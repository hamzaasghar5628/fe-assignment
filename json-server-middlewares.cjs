module.exports = (req, res, next) => {
    // Enable CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Add pagination handling if it's a GET request to /products
    if (req.method === 'GET' && req.path.startsWith('/products')) {
        const queryParams = new URLSearchParams(req._parsedUrl.query || '');
        const page = parseInt(queryParams.get('_page')) || 1;
        const limit = parseInt(queryParams.get('_limit')) || 10;
        
        // Calculate start and end indices for pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        
        // Modify the request query to use _start and _end
        // which is what json-server uses internally for pagination
        req.query._start = startIndex;
        req.query._end = endIndex;
        
        // Delete the _page parameter as we're using _start/_end instead
        delete req.query._page;
        
        // Set custom headers for pagination
        res.header('X-Total-Count', '30'); // Total number of items in db.json
        res.header('Access-Control-Expose-Headers', 'X-Total-Count, Link');
        
        // Add Link header for pagination
        const fullUrl = `http://localhost:9000${req.path}`;
        const lastPage = Math.ceil(30 / limit);
        
        const links = [];
        if (page > 1) {
            links.push(`<${fullUrl}?_page=${page-1}&_limit=${limit}>; rel="prev"`);
        }
        if (page < lastPage) {
            links.push(`<${fullUrl}?_page=${page+1}&_limit=${limit}>; rel="next"`);
        }
        links.push(`<${fullUrl}?_page=1&_limit=${limit}>; rel="first"`);
        links.push(`<${fullUrl}?_page=${lastPage}&_limit=${limit}>; rel="last"`);
        
        res.header('Link', links.join(', '));
    }
    
    next();
} 