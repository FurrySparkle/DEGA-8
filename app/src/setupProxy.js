/* eslint-disable @typescript-eslint/no-var-requires */
 
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/chatapi',
        createProxyMiddleware({
            target: 'http://localhost:3001',
            secure: false,
            changeOrigin: true,
        })
    );
};