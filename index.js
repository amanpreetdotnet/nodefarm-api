const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify')
const replaceTemplate = require('./modules/replaceTemplate');


// server 

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj  = JSON.parse(data)

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }))

// server 
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)

    // overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-Type': "text/html" })

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)
    }
    // product page
    else if(pathname === '/product') {
        const product = dataObj[query.id]
        res.writeHead(200, { 'Content-Type': 'text/html' })
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
    }
    // api
    else if(pathname === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json'})
        res.end(data)
    } 
    // not found
    else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
        })
        res.end('Page not found')
    }
    
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Server running on port 8000');
})