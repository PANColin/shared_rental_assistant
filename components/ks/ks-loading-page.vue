<template>
	<view class="loading-wrapper" :style="[wrapperStyle, style]">
		<image class="loading-image" src="@/static/images/common/loading.gif" mode="aspectFit" />
		<text class="loading-text">{{ loadtext }}</text>
	</view>
</template>

<script>
export default {
	name: 'LoadingView',
	props: {
		style: {
			type: Object,
			default: () => ({})
		},
		loadtext: {
			type: String,
			default: '加载中'
		}
	},
	computed: {
		wrapperStyle() {
			return {
				backgroundColor: 'rgba(255,255,255,.5)',
				zIndex: 9999
			};
		}
	}
};
</script>

<style lang="scss" scoped>
.loading-wrapper {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 400rpx;

	.loading-image {
		width: 90rpx;
		height: 90rpx;
		margin-bottom: 24rpx;
		animation: scalePulse 1.4s infinite ease-in-out;
	}

	.loading-text {
		font-size: 28rpx;
		font-weight: 600;
		color: #666;
		letter-spacing: 2rpx;
	}
}

/* 动画 */
@keyframes scalePulse {
	0%,
	100% {
		transform: scale(1);
		opacity: 1;
	}

	50% {
		transform: scale(1.08);
		opacity: 0.9;
	}
}
</style>
