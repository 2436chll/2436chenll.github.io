const { createProxyMiddleware: proxy } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    // proxy('/portal', {  //api1是需要转发的请求
    //   target:       'http://192.168.43.178:8080', //配置转发目标地址
    //   changeOrigin: true //控制服务器接收到的请求头中host字段的值
    // })
    proxy('/web', {
      target:       'https://eone.fjmu.edu.cn',
      changeOrigin: true
    })
  )
}