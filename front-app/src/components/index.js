import INav from './i-nav/index.js'
import ITabbar from './i-tabbar/index.js'
import IButton from './i-button/index.js'
import Util from './utils/util.js'
import Reg from './utils/reg.js'
import IsMap from './isMap/index.js'

const components = [
  INav,
  ITabbar,
  IButton
].concat(IsMap)

const install = (Vue) => {
  components.forEach((component) => Vue.component(component.name, component))
  Object.keys(Util).forEach((util) => {
    Vue.prototype[`$${util}`] = Util[util]
    return undefined
  })
  Object.keys(Reg).forEach((reg) => {
    Vue.prototype[`$${reg}`] = Reg[reg]
    return undefined
  })
}

export default install
