const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT, 10) || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const urlObj = new URL(req.url, `https://${req.headers.cadomain}`);

      if (urlObj.host === "photo-picker.qingrizhi.com") {
        urlObj.host = "photo-picker.wwen.pro";
        res.statusCode = 301;
        res.setHeader("Location", urlObj.toString());
        res.end("redirecting to new domain");
        return;
      }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
