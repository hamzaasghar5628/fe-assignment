module.exports = (req, res, next) => {
    // Enable CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Add pagination handling if it's a GET request to /products
    if (req.method === 'GET' && req.path.startsWith('/products')) {
        // Store original end function
        const originalEnd = res.end;
        
        res.end = function (data) {
            try {
                if (data) {
                    let products = JSON.parse(data);
                    const queryParams = new URLSearchParams(req._parsedUrl.query || '');
                    const page = parseInt(queryParams.get('_page')) || 1;
                    const limit = parseInt(queryParams.get('_limit')) || 10;
                    
                    // Shuffle the array to get random products
                    products = products.sort(() => Math.random() - 0.5);
                    
                    // Get products for current page
                    const startIndex = (page - 1) * limit;
                    const paginatedProducts = products.slice(startIndex, startIndex + limit);
                    
                    // Set headers
                    res.header('X-Total-Count', products.length.toString());
                    res.header('Access-Control-Expose-Headers', 'X-Total-Count, Link');
                    
                    // Add Link header for pagination
                    const fullUrl = `http://localhost:9000${req.path}`;
                    const lastPage = Math.ceil(products.length / limit);
                    
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
                    
                    // Send shuffled and paginated data
                    return originalEnd.call(this, JSON.stringify(paginatedProducts));
                }
            } catch (error) {
                console.error('Error in middleware:', error);
            }
            return originalEnd.apply(this, arguments);
        };
    }
    
    next();
} $$