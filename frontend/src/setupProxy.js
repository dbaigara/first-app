const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://first-app-ldvx.onrender.com',
      changeOrigin: true,
    })
  );
};
