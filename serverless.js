const MIME = require('mime');
const $request = require('request');
const fs = require("fs");
const path = require('path');
const http = require('http');
const os = require('os');
const serverlessConfig = require('./serverless_config');
let inited = false;
let socketPath = null;

const WorkbenchServerPatch = {
    socketPath: null,
    setupHttpServer(sockPath) {
        http.Server.prototype.originalListen = http.Server.prototype.listen;
        http.Server.prototype.listen = WorkbenchServerPatch._installServer;
        WorkbenchServerPatch.socketPath = sockPath;
    },
    asyncWrapper(handler) {
        return (...args) => {
            if (typeof args[args.length - 1] === 'function') {
                const callback = args[args.length - 1];
                if (handler.constructor.name !== 'AsyncFunction') {
                    const err = new TypeError('Must be an AsyncFunction');
                    return callback(err);
                }
                // 其他事件场景
                return handler.apply(handler, args);
            }
            else {
                return handler.apply(handler, args);
            }
        };
    },
    detectServerStart() {
        let count = 0;
        let max = 50;
        return new Promise((res) => {
            if (fs.existsSync(WorkbenchServerPatch.socketPath)) {
                return res();
            }
            let intHandle = setInterval(() => {
                if (fs.existsSync(WorkbenchServerPatch.socketPath) || count >= max) {
                    clearInterval(intHandle);
                    res();
                } else {
                    count += 1;
                }
            }, 200);
        })
       
    },
    _doListen(server, listenTries, callback) {
        let errorHandler = (error) => {
            if (error.errno == 'EADDRINUSE') {
                if (listenTries == 10) {
                    server.emit('error', new Error(
                        'could not find suitable socket address to bind on'));
                } else {
                    listenTries++;
                    WorkbenchServerPatch._doListen(server, listenTries, callback);
                }
            } else {
                server.emit('error', error);
            }
        }

        server.once('error', errorHandler);
        server.originalListen(this.socketPath, function () {
            server.removeListener('error', errorHandler);
            WorkbenchServerPatch._doneListening(server, callback);
        });
    },
    _doneListening(server, callback) {
        if (callback) {
            server.once('listening', callback);
        }
        server.emit('listening');
    },
    _installServer() {
        let server = this;
        function extractCallback(args) {
            if (args.length > 1 && typeof (args[args.length - 1]) == 'function') {
                return args[args.length - 1];
            }
        }
        let listenTries = 0;
        WorkbenchServerPatch._doListen(server, listenTries, extractCallback(arguments));
        return server;
    }
};

async function initializeMethod() {
    if (serverlessConfig.FRAMEWORK && serverlessConfig.FRAMEWORK.type) {
        socketPath = path.join(os.tmpdir(), `server-${Date.now()}.sock`);
        if (fs.existsSync(socketPath)) {
            fs.unlinkSync(socketPath);
        }
        WorkbenchServerPatch.setupHttpServer(socketPath);
        if (typeof serverlessConfig.run === 'function') {
            await serverlessConfig.run();
        }
        inited = true;
    }
    else {
        console.error(`[workbench-serverless]: 存量应用初始化失败，没有可执行的入口文件`)
    }
}

module.exports.handler = WorkbenchServerPatch.asyncWrapper(async (event, context, callback) => {
    try {
        if (!inited) {
            if (serverlessConfig.FRAMEWORK && serverlessConfig.FRAMEWORK.type) {
                await initializeMethod();
            } else {
                inited = true;
            }
            if (!inited) {
                return callback(new Error('存量应用初始化失败'));
            }
        }
        let requestCtx = JSON.parse(event.toString());
        // 存量项目
        if (serverlessConfig.FRAMEWORK && serverlessConfig.FRAMEWORK.type) {
            try {
                await WorkbenchServerPatch.detectServerStart();
                let ctx = {};
                let data = await new Promise((resolve, reject) => {
                    delete requestCtx.headers['content-length'];
                    delete requestCtx.headers['Content-Length'];
                    delete requestCtx.headers['accept-encoding'];
                    delete requestCtx.headers['Accept-Encoding'];

                    try {
                      JSON.parse(requestCtx.body);
                      requestCtx.headers['Content-Type'] = requestCtx.headers['content-type'] = 'application/json';
                    } catch(e) {}                   
                    
                    let method = requestCtx.httpMethod || requestCtx.method
                    let hasBody = ['PATCH', 'POST', 'PUT'];
                    let opts = {
                        uri: `http://unix:${socketPath}:${requestCtx.path}`,
                        qs: requestCtx.queryParameters,
                        method,
                        body: hasBody.includes(method) ? (requestCtx.isBase64Encoded ? Buffer.from(requestCtx.body, 'base64'):
                          typeof requestCtx.body === 'string'
                            ? requestCtx.body
                            : JSON.stringify(requestCtx.body)) : null,
                        
                        headers: requestCtx.headers,
                        encoding: null,
                        followRedirect: false,
                    };
                    let resp = $request(opts,
                        async (error, response, body) => {
                        if (error) {
                            reject(error);
                        }
                        if (response) {
                            ctx.res = response;
                            ctx.status = response.statusCode;
                        }
                        resolve(body);
                        }
                    );
                });

                let encoded = true;
                ctx.body = data.toString('base64');
                const newHeader = {};
                for (const key in ctx.res.headers) {
                    // The length after base64 is wrong.
                    if (!['content-length'].includes(key)) {
                        if ('set-cookie' === key) {
                        // unsupport multiple cookie when use apiGateway
                        newHeader[key] = ctx.res.headers[key][0];
                        if (ctx.res.headers[key].length > 1) {
                            console.warn('[workbench-serverless]: unsupport multiple cookie when use apiGateway');
                        }
                        } else {
                        newHeader[key] = ctx.res.headers[key];
                        }
                    }
                }
                return callback(null, {
                    isBase64Encoded: encoded,
                    statusCode: ctx.status,
                    headers: newHeader,
                    body: ctx.body,
                });
            } catch (e) {
                console.error(`[workbench-serverless]: proxy request error, ${e.message}`, e.stack);
                return callback({
                    isBase64Encoded: false,
                    statusCode: 500,
                    headers: {},
                    body: 'Server Internal Error',
                });
            }
        } else {
            // 通用存量项目迁移
            let reqPath = requestCtx['path'];
            let pathArray = reqPath.match(/\/[^\/]*/ig);
            let pathLength = pathArray.length;
            let lastPath = pathArray[pathLength - 1];
            let extArray = (lastPath.indexOf('.') > -1) ? pathArray[pathLength - 1].split('.') : null;
            let fileExt = extArray ? extArray[extArray.length - 1] : null;
            let codePath = process.env.FC_FUNC_CODE_PATH || '';
            codePath = codePath.replace(/\/$/ig, '');
            let modulePath = codePath;
            let fnCall;
            let htmlResponse = {
                isBase64Encoded: false,
                statusCode: 404,
                headers: {
                "Content-type": "text/html; charset=utf-8"
                },
                body: "<h1>很抱歉，您要访问的页面不存在！</h1>"
            };

            if (pathLength) {
                modulePath = codePath + pathArray.join('');
                console.info('[workbench-serverless]: Request Path: ' + modulePath);

                if (reqPath === '/') {
                    modulePath = codePath + '/index.html';
                    fileExt = 'html';
                    if (!fs.existsSync(modulePath)) {
                        modulePath = codePath + '/index.htm';
                        if (!fs.existsSync(modulePath)) {
                            modulePath = codePath + '/default.html';
                            if (!fs.existsSync(modulePath)) {
                                modulePath = codePath + '/default.htm';
                            }
                        }
                    }
                    console.info('[workbench-serverless]: Request default home page: ' + modulePath);
                }

                if (fileExt) {
                    for (let v of pathArray) {
                        console.info("[workbench-serverless]: 安全检查:" + v, (serverlessConfig.SAFE.includes(v)));
                        if (serverlessConfig.SAFE.includes(v)) {
                        callback(null, htmlResponse);
                        return;
                        }
                    }

                    fnCall = function () {
                        fs.readFile(modulePath, (err, data) => {
                            if (err) {
                                console.info('[workbench-serverless]: The requested file does not exist: ' + modulePath);
                                callback(null, htmlResponse);
                                return;
                            }
                            let fileResponse = {
                                isBase64Encoded: true,
                                statusCode: 200,
                                headers: {
                                "Content-type": MIME.getType && MIME.getType(fileExt) || MIME.lookup && MIME.lookup(fileExt)
                                },
                                body: Buffer.from(data).toString("base64")
                            }
                            callback(null, fileResponse);
                            return;
                        });
                    };
                } else {
                    try {
                        fnCall = require(modulePath).handler;
                    } catch (e) {
                        callback(null, htmlResponse);
                        return;
                    }
                }
            }
            fnCall(event, context, callback);
        }
    } catch (err) {
        callback(err);
    }
});