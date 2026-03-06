<template>
	<view class="stat-box-wrapper" :style="{ alignItems: align }">
		<view class="title-wrapper" @click="titleClick" :style="{ alignItems: underlinealign, textAlign: 'center' }" ref="titleWrapper">
			<text class="stat-title" ref="title" :style="{ fontSize: fontSize + 'rpx', fontWeight: fontWeight, color: textColor }">
				{{ title }}
			</text>
			<view
				v-if="showunderline"
				class="underline elastic"
				:style="{
					width: underlineWidthComputed + 'rpx',
					height: underlineHeight + 'rpx',
					marginTop: underlineMarginTop + 'rpx',
					borderRadius: underlineRadius + 'rpx',
					transformOrigin: transformOrigin,
					transform: underlineAnimated ? 'scaleX(1)' : 'scaleX(0)',
					background: underlineColor
				}"
			></view>
			<!-- 如果不显示下划线时，添加占位元素 -->
			<view
				v-else
				class="underline placeholder"
				:style="{
					height: underlineHeight + 'rpx',
					marginTop: underlineMarginTop + 'rpx'
				}"
			></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'StatTitle',
	props: {
		title: { type: String, required: true },
		showunderline: { type: Boolean, default: true },
		fontSize: { type: Number, default: 32 },
		textColor: { type: String, default: '#160F32' },
		underlineWidth: { type: [Number, String], default: 20 }, // 可以传数字 或 auto
		fontWeight: { type: [Number, String], default: 600 }, // 可以传数字 或 bold
		underlineHeight: { type: Number, default: 8 },
		underlineMarginTop: { type: Number, default: 9 },
		underlineRadius: { type: Number, default: 100 },
		underlineColor: { type: String, default: 'linear-gradient(90deg, #7A5FF5 0%, rgba(81, 137, 246, 0) 100%)' },
		align: { type: String, default: 'center' },
		underlinealign: { type: String, default: 'flex-start' },
		underlineOrigin: { type: String, default: 'left' } // left / center / right
	},
	data() {
		return {
			underlineAnimated: true, // 下划线默认动画
			textAnimated: false,
			textScale: 1,
			underlineWidthComputed: 0,
			marginLeft: 'auto',
			marginRight: 'auto'
		};
	},
	computed: {
		transformOrigin() {
			switch (this.underlineOrigin) {
				case 'left':
					return 'left center';
				case 'right':
					return 'right center';
				default:
					return 'center center';
			}
		}
	},
	methods: {
		titleClick() {
			this.$emit('click');
		},
		calcUnderlineWidth() {
			uni.createSelectorQuery()
				.in(this)
				.select('.stat-title')
				.boundingClientRect((rect) => {
					if (rect) {
						// 注意这里 rect.width 是 px，需要转成 rpx
						const screenWidth = 750; // 默认750rpx设计稿
						const systemInfo = uni.getSystemInfoSync();
						const rpxPerPx = screenWidth / systemInfo.windowWidth;
						if (this.underlineWidth == 'auto') {
							this.underlineWidthComputed = rect.width * rpxPerPx;
						} else {
							this.underlineWidthComputed = this.underlineWidth;
						}
					}
				})
				.exec();
		}
	},
	mounted() {
		this.calcUnderlineWidth();
	},
	watch: {
		title() {
			this.calcUnderlineWidth(); // 标题变化时重新计算
		}
	}
};
</script>

<style lang="scss" scoped>
.stat-box-wrapper {
	display: flex;
	flex-direction: column;
}

.title-wrapper {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.underline {
	transform: scaleX(0);
	animation-fill-mode: forwards;
	display: block;
}

/* 弹性展开动画 */
.underline[style*='scaleX(1)'] {
	animation: elastic-expand var(--elastic-duration, 0.6s) forwards;
}

@keyframes elastic-expand {
	0% {
		transform: scaleX(0);
	}
	60% {
		transform: scaleX(1.2);
	}
	80% {
		transform: scaleX(0.9);
	}
	100% {
		transform: scaleX(1);
	}
}
</style>
