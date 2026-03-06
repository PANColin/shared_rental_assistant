import config from '@/static/js/config.js'

// 各模块图片
import test from './test.js'
import common from './common.js'
import fortune from './fortune.js'
import immortal from './immortal.js'
import rank from './rank.js'
import clockIn from './clockIn.js'
import user from './user.js'

// 合并模块
const modules = {
	test,
	common,
	fortune,
	immortal,
	rank,
	clockIn,
	user
}

// 工具方法
const statics = {
	baseUrl: config.staticUrl,

	/**
	 * 获取图片完整地址（带防缓存）
	 * @param {string} key 模块路径，例如 'common.addarchive' 或 'test.avatar'
	 */
	get(key) {
		console.log(key)
		if (!key) return ''
		const parts = key.split('.')
		if (parts.length !== 2) return ''
		const [module, name] = parts
		const mod = modules[module]
		if (!mod) {
			console.warn(`[statics] 未找到模块: ${module}`)
			return ''
		}
		if (!mod[name]) {
			console.warn(`[statics] 未找到图片: ${name} 于模块: ${module}`)
			return ''
		}

		const url = this.baseUrl + mod[name]

		return `${url}`
	}
}

export default statics