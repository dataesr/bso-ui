const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/elasticsearch',
    createProxyMiddleware({
      target: 'https://es01:9200',
      changeOrigin: true,
      pathRewrite: {
        '^/elasticsearch': '', // /elasticsearchを削除してリクエストを転送
      },
      secure: false, // 自己署名証明書を使用する場合はこれを追加
      onProxyReq: (proxyReq, req, res) => {
        // APIキーをヘッダーに追加
        proxyReq.setHeader('Authorization', 'ApiKey XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
        proxyReq.setHeader('Content-Type', 'application/json');
      }
    })
  );
};