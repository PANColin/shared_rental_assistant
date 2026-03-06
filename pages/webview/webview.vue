<template>
	<view class="webview">
		<web-view :src="url" :binderror="handleError"></web-view>
	</view>
</template>

<script>
	export default {
		props: {
			url: {
				type: String,
				default: ""
			}
		},
		data() {
			return {}
		},
		onLoad(e) {
			if (e.url) {
				this.url = e.url;
			}
		},
		onShow() {
			// 通过uni.getStorageSync或其他方式获取传递的URL参数
		},
		methods: {
			handleError(event) {
			}
		}
	};
</script>

<style lang="scss" scoped>
	.webview {
		width: 100%;
		height: 100vh;
	}
</style>