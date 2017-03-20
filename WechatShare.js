import config from './WechatShare.config.js'
import wx from 'weixin-js-sdk'
const WxShareObj = {
  install (Vue, options) {
    Vue.prototype.$wxshare = {
      // getParams (cb) {
      //   var postUrl = 'http://wechat.new-sailing.com/wechat/getSignPackage'
      //   var postData = config
      //   postData.url = encodeURIComponent(window.location.href)
      //   Vue.http.post(postUrl, postData).then(res => {
      //     typeof cb === 'function' && cb(res.data, null)
      //   }, res => {
      //     typeof cb === 'function' && cb(res, '服务器返回http status: ' + res.status)
      //   })
      // },
      setConfig (obj) {
        var postUrl = 'http://wechat.new-sailing.com/wechat/getSignPackage'
        var postData = config
        postData.url = encodeURIComponent(window.location.href)
        Vue.http.post(postUrl, postData).then(res => {
          this.setWxConfig(res.data.data, typeof obj === 'object' && obj.hasOwnProperty('success') ? obj.success : '')
        }, res => {
          if (typeof obj === 'object' && obj.hasOwnProperty('fail')) {
            typeof obj.fail === 'function' && obj.fail('请求获取签名错误')
          }
        })
      },
      setWxConfig (wxconfig, success) {
        wx.config({
          debug: true,
          appId: wxconfig.appId,
          timestamp: parseInt(wxconfig.timestamp),
          nonceStr: wxconfig.nonceStr,
          signature: wxconfig.signature,
          jsApiList: [
            // 所有要调用的 API 都要加到这个列表中
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
          ]
        })
        typeof success === 'function' && success('wxconfig设置成功')
      },
      setShareInfo (shareData, obj) {
        wx.ready(() => {
          // 在这里调用 API
          wx.onMenuShareTimeline({
            title: shareData.desc, // 分享标题
            link: shareData.link, // 分享链接
            imgUrl: shareData.imgUrl, // 分享图标
            success () {
              // 用户确认分享后执行的回调函数
              if (typeof obj === 'object' && obj.hasOwnProperty('success')) {
                typeof obj.success === 'function' && obj.success()
              }
            },
            cancel () {
              // 用户取消分享后执行的回调函数
              if (typeof obj === 'object' && obj.hasOwnProperty('cancel')) {
                typeof obj.cancel === 'function' && obj.cancel()
              }
            }
          })

          wx.onMenuShareAppMessage({
            title: shareData.title, // 分享标题
            link: shareData.link, // 分享链接
            desc: shareData.desc, // 分享描述

            imgUrl: shareData.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success () {
              // 用户确认分享后执行的回调函数
              if (typeof obj === 'object' && obj.hasOwnProperty('success')) {
                typeof obj.success === 'function' && obj.success()
              }
            },
            cancel () {
              // 用户取消分享后执行的回调函数
              if (typeof obj === 'object' && obj.hasOwnProperty('cancel')) {
                typeof obj.cancel === 'function' && obj.cancel()
              }
            }
          })
        })
      }
    }
  }
}
export default WxShareObj
