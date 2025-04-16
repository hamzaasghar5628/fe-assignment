module.exports = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (req.method === "GET" && req.path.startsWith("/products")) {
    const originalEnd = res.end;

    let chunks = [];

    // Override res.write and res.end to capture response body
    res.write = function (chunk) {
      chunks.push(chunk);
    };

    res.end = function (chunk) {
      if (chunk) chunks.push(chunk);

      try {
        const body = Buffer.concat(chunks).toString("utf8");
        let products = JSON.parse(body);
        const queryParams = new URLSearchParams(req._parsedUrl.query || "");
        const page = parseInt(queryParams.get("_page")) || 1;
        const limit = parseInt(queryParams.get("_limit")) || 10;

        // Simple pagination without shuffle
        const startIndex = (page - 1) * limit;
        const endIndex = Math.min(startIndex + limit, products.length);
        const paginatedProducts = products.slice(startIndex, endIndex);

        const fullUrl = `http://localhost:9000${req.path}`;
        const lastPage = Math.ceil(products.length / limit);

        const links = [];
        if (page > 1)
          links.push(
            `<${fullUrl}?_page=${page - 1}&_limit=${limit}>; rel="prev"`
          );
        if (page < lastPage)
          links.push(
            `<${fullUrl}?_page=${page + 1}&_limit=${limit}>; rel="next"`
          );
        links.push(`<${fullUrl}?_page=1&_limit=${limit}>; rel="first"`);
        links.push(
          `<${fullUrl}?_page=${lastPage}&_limit=${limit}>; rel="last"`
        );

        res.header("X-Total-Count", products.length.toString());
        res.header("Access-Control-Expose-Headers", "X-Total-Count, Link");
        res.header("Link", links.join(", "));

        return originalEnd.call(this, JSON.stringify(paginatedProducts));
      } catch (err) {
        console.error("Middleware error:", err);
        return originalEnd.call(this, JSON.stringify([]));
      }
    };
  }

  next();
};
