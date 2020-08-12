const SAFE = {
  '/api' : true,
  '/.workbench':true,
  '/serverless.js':true
};
const MIME = {
    "323"     : "text/h323",
    "acx"     : "application/internet-property-stream",
    "ai"      : "application/postscript",
    "aif"     : "audio/x-aiff",
    "aifc"    : "audio/x-aiff",
    "aiff"    : "audio/x-aiff",
    'apk'     : "application/vnd.android.package-archive",
    "asf"     : "video/x-ms-asf",
    "asr"     : "video/x-ms-asf",
    "asx"     : "video/x-ms-asf",
    "au"      : "audio/basic",
    "avi"     : "video/quicktime",
    "axs"     : "application/olescript",
    "bas"     : "text/plain",
    "bcpio"   : "application/x-bcpio",
    "bin"     : "application/octet-stream",
    "bmp"     : "image/bmp",
    "c"       : "text/plain",
    "cat"     : "application/vnd.ms-pkiseccat",
    "cdf"     : "application/x-cdf",
    "cer"     : "application/x-x509-ca-cert",
    "class"   : "application/octet-stream",
    "clp"     : "application/x-msclip",
    "cmx"     : "image/x-cmx",
    "cod"     : "image/cis-cod",
    "cpio"    : "application/x-cpio",
    "crd"     : "application/x-mscardfile",
    "crl"     : "application/pkix-crl",
    "crt"     : "application/x-x509-ca-cert",
    "csh"     : "application/x-csh",
    "css"     : "text/css",
    "dcr"     : "application/x-director",
    "der"     : "application/x-x509-ca-cert",
    "dir"     : "application/x-director",
    "dll"     : "application/x-msdownload",
    "dms"     : "application/octet-stream",
    "doc"     : "application/msword",
    "dot"     : "application/msword",
    "dvi"     : "application/x-dvi",
    "dxr"     : "application/x-director",
    "eps"     : "application/postscript",
    "etx"     : "text/x-setext",
    "evy"     : "application/envoy",
    "exe"     : "application/octet-stream",
    "fif"     : "application/fractals",
    "flr"     : "x-world/x-vrml",
    "gif"     : "image/gif",
    "gtar"    : "application/x-gtar",
    "gz"      : "application/x-gzip",
    "h"       : "text/plain",
    "hdf"     : "application/x-hdf",
    "hlp"     : "application/winhlp",
    "hqx"     : "application/mac-binhex40",
    "hta"     : "application/hta",
    "htc"     : "text/x-component",
    "htm"     : "text/html",
    "html"    : "text/html",
    "htt"     : "text/webviewhtml",
    "ico"     : "image/x-icon",
    "ief"     : "image/ief",
    "iii"     : "application/x-iphone",
    "ins"     : "application/x-internet-signup",
    "isp"     : "application/x-internet-signup",
    "jfif"    : "image/pipeg",
    "jpe"     : "image/jpeg",
    "jpeg"    : "image/jpeg",
    "jpg"     : "image/jpeg",
    "js"      : "application/x-javascript",
    "json"    : "application/json",
    "latex"   : "application/x-latex",
    "lha"     : "application/octet-stream",
    "lsf"     : "video/x-la-asf",
    "lsx"     : "video/x-la-asf",
    "lzh"     : "application/octet-stream",
    "m13"     : "application/x-msmediaview",
    "m14"     : "application/x-msmediaview",
    "m3u"     : "audio/x-mpegurl",
    "man"     : "application/x-troff-man",
    "mdb"     : "application/x-msaccess",
    "md"      : "text/plain",
    "me"      : "application/x-troff-me",
    "mht"     : "message/rfc822",
    "mhtml"   : "message/rfc822",
    "mid"     : "audio/mid",
    "mny"     : "application/x-msmoney",
    "mov"     : "video/quicktime",
    "movie"   : "video/x-sgi-movie",
    "mp2"     : "video/mpeg",
    "mp3"     : "audio/mpeg",
    'mp4'     : 'video/mp4',
    "mpa"     : "video/mpeg",
    "mpe"     : "video/mpeg",
    "mpeg"    : "video/mpeg",
    "mpg"     : "video/mpeg",
    "mpp"     : "application/vnd.ms-project",
    "mpv2"    : "video/mpeg",
    "ms"      : "application/x-troff-ms",
    "mvb"     : "application/x-msmediaview",
    "nws"     : "message/rfc822",
    "oda"     : "application/oda",
    'ogg'     : 'video/ogg',
    'ogv'     : 'video/ogg',
    "p10"     : "application/pkcs10",
    "p12"     : "application/x-pkcs12",
    "p7b"     : "application/x-pkcs7-certificates",
    "p7c"     : "application/x-pkcs7-mime",
    "p7m"     : "application/x-pkcs7-mime",
    "p7r"     : "application/x-pkcs7-certreqresp",
    "p7s"     : "application/x-pkcs7-signature",
    "pbm"     : "image/x-portable-bitmap",
    "pdf"     : "application/pdf",
    "pfx"     : "application/x-pkcs12",
    "pgm"     : "image/x-portable-graymap",
    "pko"     : "application/ynd.ms-pkipko",
    "pma"     : "application/x-perfmon",
    "pmc"     : "application/x-perfmon",
    "pml"     : "application/x-perfmon",
    "pmr"     : "application/x-perfmon",
    "pmw"     : "application/x-perfmon",
    "png"     : "image/png",
    "pnm"     : "image/x-portable-anymap",
    "pot"     : "application/vnd.ms-powerpoint",
    "ppm"     : "image/x-portable-pixmap",
    "pps"     : "application/vnd.ms-powerpoint",
    "ppt"     : "application/vnd.ms-powerpoint",
    "prf"     : "application/pics-rules",
    "ps"      : "application/postscript",
    "pub"     : "application/x-mspublisher",
    "qt"      : "video/quicktime",
    "ra"      : "audio/x-pn-realaudio",
    "ram"     : "audio/x-pn-realaudio",
    "ras"     : "image/x-cmu-raster",
    "rgb"     : "image/x-rgb",
    "rmi"     : "audio/mid",
    "roff"    : "application/x-troff",
    "rtf"     : "application/rtf",
    "rtx"     : "text/richtext",
    "scd"     : "application/x-msschedule",
    "scss"     : "text/css",
    "sct"     : "text/scriptlet",
    "setpay"  : "application/set-payment-initiation",
    "setreg"  : "application/set-registration-initiation",
    "sh"      : "application/x-sh",
    "shar"    : "application/x-shar",
    "sit"     : "application/x-stuffit",
    "snd"     : "audio/basic",
    "spc"     : "application/x-pkcs7-certificates",
    "spl"     : "application/futuresplash",
    "src"     : "application/x-wais-source",
    "sst"     : "application/vnd.ms-pkicertstore",
    "stl"     : "application/vnd.ms-pkistl",
    "stm"     : "text/html",
    "svg"     : "image/svg+xml",
    "sv4cpio" : "application/x-sv4cpio",
    "sv4crc"  : "application/x-sv4crc",
    "t"       : "application/x-troff",
    "tar"     : "application/x-tar",
    "tcl"     : "application/x-tcl",
    "tex"     : "application/x-tex",
    "texi"    : "application/x-texinfo",
    "texinfo" : "application/x-texinfo",
    "tgz"     : "application/x-compressed",
    "tif"     : "image/tiff",
    "tiff"    : "image/tiff",
    "tr"      : "application/x-troff",
    "trm"     : "application/x-msterminal",
    "tsv"     : "text/tab-separated-values",
    "txt"     : "text/plain",
    "uls"     : "text/iuls",
    "ustar"   : "application/x-ustar",
    "vcf"     : "text/x-vcard",
    "vrml"    : "x-world/x-vrml",
    "wav"     : "audio/x-wav",
    "wcm"     : "application/vnd.ms-works",
    "wdb"     : "application/vnd.ms-works",
    'webm'    : 'video/webm',
    "wks"     : "application/vnd.ms-works",
    "wmf"     : "application/x-msmetafile",
    "wps"     : "application/vnd.ms-works",
    "wri"     : "application/x-mswrite",
    "wrl"     : "x-world/x-vrml",
    "wrz"     : "x-world/x-vrml",
    "xaf"     : "x-world/x-vrml",
    "xbm"     : "image/x-xbitmap",
    "xla"     : "application/vnd.ms-excel",
    "xlc"     : "application/vnd.ms-excel",
    "xlm"     : "application/vnd.ms-excel",
    "xls"     : "application/vnd.ms-excel",
    "xlt"     : "application/vnd.ms-excel",
    "xlw"     : "application/vnd.ms-excel",
    "xof"     : "x-world/x-vrml",
    "xpm"     : "image/x-xpixmap",
    "xwd"     : "image/x-xwindowdump",
    "z"       : "application/x-compress",
    "zip"     : "application/zip",
    "ttf"     : "font/ttf",
    "docx"    : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "xlsx"    : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "pptx"    : "application/vnd.openxmlformats-officedocument.presentationml.presentation"
};
const fs = require("fs");
module.exports.handler = function(event, context, callback) {
    try {
      var request = JSON.parse(event);
      var path = request['path'];
      var pathArray = path.match(/\/[^\/]*/ig);
      var pathLength = pathArray.length;
      var lastPath = pathArray[pathLength-1];
      var extArray = (lastPath.indexOf('.')>-1) ? pathArray[pathLength-1].split('.') : null;
      var fileExt = extArray ? extArray[extArray.length-1] : null;
      var codePath = process.env.FC_FUNC_CODE_PATH||'';
      codePath = codePath.replace(/\/$/ig, '');
      var modulePath = codePath;
      var fnCall;
      var htmlResponse = {
        isBase64Encoded: false,
        statusCode: 404,
        headers: {
        	"Content-type": "text/html; charset=utf-8"
        },
        body: "<h1>很抱歉，您要访问的页面不存在！</h1>"
      };
      
      if(pathLength){
          modulePath = codePath + pathArray.join('');
          console.info('Request Path: '+modulePath);
          
          if(path==='/'){
          	modulePath = codePath + '/index.html';
          	fileExt = 'html';
          	if(!fs.existsSync(modulePath)){
          		modulePath = codePath + '/index.htm';
          		if(!fs.existsSync(modulePath)){
          			modulePath = codePath + '/default.html';
          			if(!fs.existsSync(modulePath)){
          				modulePath = codePath + '/default.htm';
          			}
          		}
          	}
          	console.info('Request default home page: '+modulePath);
          }
          
          if(fileExt){

              pathArray.forEach(function(v,i,a){
                if(SAFE[v]){
                  callback(null, htmlResponse);
                  return;
                }
              });

              fnCall = function(){
                    fs.readFile(modulePath, (err, data) => {
                        if (err) {
                        	console.info('The requested file does not exist: '+modulePath);
                            callback(null, htmlResponse);
                            return;
                        }
                        var fileResponse = {
                            isBase64Encoded: true,
                            statusCode: 200,
                            headers: {
                                "Content-type": MIME[fileExt]
                            },
                            body: Buffer.from(data).toString("base64")
                        }
                        callback(null, fileResponse);
                        return;
                    });
                };
            }else{
                try{
                    fnCall = require(modulePath).handler;
                }catch(e){
                    callback(null, htmlResponse);
                    return;
                }
            }
        }
        fnCall(event, context, callback);
    } catch (err) {
        callback(err);
    }
};