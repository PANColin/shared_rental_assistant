export default {
	data() {
		return {

		}
	},
	created() {
		// mixin的created生命周期钩子
	},
	methods: {

	},
	onShareAppMessage(res) {
		if (res.from === 'button') { // 来自页面内分享按钮
			console.log(res.target, this.$storage.get('user_info').userinfo_id)
		}
		return {
			title: '好运连连',
			path: `/pages/fortune/index?yaoqing_uid=${this.$storage.get('user_info').userinfo_id}`
		}
	}
}