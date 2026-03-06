import Vue from 'vue'
import App from './App'

// 全局配置与插件
import uView from '@/uni_modules/uview-ui'
import config from '@/static/js/config.js'
import md5 from '@/static/js/md5.js'
import configs from '@/common/config.js'
import statics from '@/static/js/statics/index.js'
import { scrollToSelector } from '@/utils/scroll.js';

Vue.prototype.$scrollToSelector = scrollToSelector;


//工具与混入
import storage from '@/utils/storage.js'
import share from '@/mixins/share.js'
// vue2项目中使用l-circle
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

// 全局挂载
Vue.use(uView)
Vue.mixin(share)

Vue.prototype.$config = config
Vue.prototype.$Md5 = md5
Vue.prototype.configs = configs
Vue.prototype.$storage = storage
Vue.prototype.$statics = statics

//  Vue 配置
Vue.config.productionTip = false
App.mpType = 'app'

// 实例化应用
const app = new Vue({
	...App,
})
app.$mount()