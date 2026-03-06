// timeoutMixin.js
export default {
	data() {
		return {
			timeoutHandler: null, // 用于保存定时器的函数
			timeoutDelay: 4000 // 默认超时时间
		};
	},
	methods: {
		/**
		 * 启动超时检查
		 * @param {Function} checkFunction - 自定义的检查函数，返回布尔值或 Promise
		 * @param {number} [delay=this.timeoutDelay] - 超时时间，默认 4000 毫秒
		 * @param {Function} callback - 超时后执行的回调函数
		 */
		startTimeout(checkFunction, delay = this.timeoutDelay, callback) {
			// 清除之前的定时器
			if (this.timeoutHandler) {
				this.timeoutHandler();
			}
			// 创建新的定时器
			this.timeoutHandler = this.createTimeoutHandler(checkFunction, delay, callback);
		},

		/**
		 * 创建定时器处理逻辑
		 * @param {Function} checkFunction - 自定义的检查函数
		 * @param {number} delay - 超时时间
		 * @param {Function} callback - 超时后执行的回调函数
		 * @returns {Function} - 返回清除定时器的函数
		 */
		createTimeoutHandler(checkFunction, delay, callback) {
			const timer = setTimeout(async () => {
				try {
					const result = await checkFunction.call(this);
					console.log(result, 'resultresult')
					if (!result) {
						callback();
					}
				} catch (error) {
					console.error('Error in checkFunction:', error);
				}
			}, delay);

			return () => clearTimeout(timer); // 返回清除定时器的函数
		},

		/**
		 * 清除定时器
		 */
		clearTimeout() {
			if (this.timeoutHandler) {
				this.timeoutHandler();
			}
		}
	},
	beforeDestroy() {
		this.clearTimeout(); // 组件销毁时清除定时器
	}
}