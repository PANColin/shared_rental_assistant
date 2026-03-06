import {
	getUserInfo,
} from '@/common/apis/user.js'
import {
	jiliadvJiliClickTj,
	jiliadvJiliIssuTj
} from '@/common/apis/ad.js';
import {
	getFirstPageInfo
} from '@/common/apis/fortune.js';
export default {
	data() {
		return {
			user_infomixin: {},
			fortuneInfomixin: {},
			topHeight: 0
		}
	},
	created() {
		this.initStatusBarHeight()
		// mixin的created生命周期钩子
		this.getUserInfominxinChange(this.getFirstPageInfoChange)
	},
	methods: {
		getFirstPageInfoChange() {
			getFirstPageInfo({
				type: 'today',
				cur_userinfo_id: this.user_infomixin.userinfo_id
			}).then(res => {
				console.log(res, 'getFirstPageInfo')
				this.fortuneInfomixin = res.data;
			})
		},
		initStatusBarHeight() {
			uni.getSystemInfo({
				success: (res) => (this.topHeight = res.statusBarHeight)
			});
		},
		getUserInfominxinChange(callback) {
			getUserInfo().then(res => {
				this.user_infomixin = res.data;
				callback?.()
			})
		},
		onAdClickReport(type) {
			jiliadvJiliClickTj({
				button_name: type
			});
		},
		onAdClickIssuTj(type) {
			jiliadvJiliIssuTj({
				button_name: type
			});
		},
	},
	onShareAppMessage(shareOption) {
		console.log(shareOption);
		return {
			success: () => {
				console.log("分享成功");
			},
		};
	},
}