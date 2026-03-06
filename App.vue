<script>
import Vue from 'vue';
import commonApp from '@/common/common.min.app.js';
import statics from '@/static/js/statics/index.js';
export default {
	globalData: {
		config: {},
		setting: {},
		systemInfo: {},
		$statics: {}
	},
	onLaunch() {},
	onShow() {},
	onLoad(e) {},
	methods: {}
};
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import '@/uni_modules/uview-ui/index.scss';
</style>
