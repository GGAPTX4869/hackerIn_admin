import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const allGloablComponents = { SvgIcon, Pagination }

export default {
  install(app) {
    Object.keys(allGloablComponents).forEach((key) => {
      app.component(key, allGloablComponents[key])
    })
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
