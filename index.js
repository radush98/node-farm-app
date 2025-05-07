const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replace-template');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true)

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'content-type': 'text/html'
        })

        const cardsHTML = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);

        res.end(output);
    }

    // Product page
    else if (pathname === '/product') {
        const product = dataObj[query.id];

        res.writeHead(200, {
            'content-type': 'text/html'
        })
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }

    // API page
    else if (pathname === '/api') {
        res.writeHead(200, {
            'content-type': 'application/json'
        })
        res.end(data);
    }

    // Not found
    else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world!'
        })
        res.end('Not found!');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
})