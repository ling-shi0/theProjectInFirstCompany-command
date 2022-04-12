import Api from './api.js'
import Http from './http.js'
import Constant from './constant.js'

const install = (Vue) => {
  Vue.prototype.$api = Api
  Vue.prototype.$http = Http
  Vue.prototype.$constant = Constant
}

export default install
