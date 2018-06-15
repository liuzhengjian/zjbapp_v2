import wepy from 'wepy'
// 接口地址
const host = 'http://api.zhejiuban.work/api'
const auth = host + '/weapp/authorizations'
const request = async (options, showLoading = true) => {
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  // 显示加载中
  if (showLoading) {
    wepy.showLoading({title: '加载中'})
  }
  // 拼接请求地址
  // options.url = host + '/' + options.url
  // 调用小程序请求
  let response = await wepy.request(options)
  // 隐藏加载中
  if (showLoading) {
    wepy.hideLoading()
  }
  // 如果请求异常提示错误信息
  if (response.statusCode === 500) {
    wepy.showModal({
      title: '提示',
      content: '服务器错误，请联系管理员或重试'
    })
  }
  return response
}
const login = async (params = {}) => {
  // 请求微信login
  let res = await wepy.login()
  // 参数增加code
  params.code = res.code
  // 调用服务器login接口weapp/authorizations
  let authResponse = await request({
    url: auth,
    data: params,
    method: 'POST'
  })
  // 登陆成功记录token值
  if (authResponse.statusCode === 201) {
    wepy.setStorageSync('access_token', authResponse.data.access_token)
    wepy.setStorageSync('access_token_expired_at', authResponse.data.expires_in * 1000 + new Date().getTime())
  }
  return authResponse
}
export default {
  request,
  login
}
