<template>
	<view class="wrapper">
		<view class="solarcard-wrapper" v-if="showsolar">
			<!-- 日历卡片 -->
			<view class="calendar-card">
				<!-- 背景图 -->
				<image v-if="bg" class="bg" :src="bg" mode="widthFix" />

				<!-- 内容 -->
				<view class="content">
					<!-- 顶部年月日 -->
					<view class="solar">{{ year }}/{{ month }}/{{ day }}</view>

					<!-- 中间日期 + 星期 -->
					<view class="main">
						<view class="date">{{ day }}</view>
						<view class="week">{{ week }}</view>
					</view>

					<!-- 农历 -->
					<view class="lunar">{{ lunarText }}</view>
				</view>
			</view>
		</view>

		<!-- 非日历模式 -->
		<view class="clockIn-card-wrapper" v-else>
			<view class="clockIn-card" @click="pageTo">
				<image class="clockIn-img" :src="$statics.get('user.clockIn')" mode="widthFix" />
			</view>
		</view>
	</view>
</template>

<script>
import solarLunar from 'solarlunar-es';
import { splitPagePath, switchTabWithQuery } from '@/utils/tabJump.js';
/**
 * 语义化模式 → 天数偏移
 */
const MODE_OFFSET_MAP = {
	today: 0, // 今天（自动刷新）
	tomorrow: 1, // 明天
	afterTomorrow: 2, // 后天
	week: 7, // 一周后
	month: 30, // 一个月后
	halfYear: 180 // 半年后
};

export default {
	name: 'TodayCalendar',

	props: {
		showsolar: {
			type: Boolean,
			default: true
		},

		/**
		 * 语义化模式
		 * today | tomorrow | afterTomorrow | week | month | halfYear | custom
		 */
		mode: {
			type: String,
			default: 'today'
		},

		/**
		 * custom 模式使用
		 */
		dayOffset: {
			type: Number,
			default: 0
		},
		fortuneInfo: {
			type: Object,
			default: () => {}
		},
		bg: {
			type: String,
			default: 'https://zylucky.zvyhjkx.com/luckywx_client/images/user/solar.png'
		}
	},

	data() {
		return {
			year: '',
			month: '',
			day: '',
			week: '',
			lunarText: '',
			timer: null
		};
	},

	created() {
		this.updateDate();
		this.autoRefresh();
	},

	beforeDestroy() {
		this.timer && clearTimeout(this.timer);
	},

	watch: {
		mode() {
			this.updateDate();
			this.autoRefresh();
		},
		dayOffset() {
			if (this.mode === 'custom') {
				this.updateDate();
			}
		}
	},

	methods: {
		pageTo() {
			if (this.fortuneInfo.control_flags.tiaozhanzhong) {
				uni.navigateTo({
					url: '/pages/subPackages/clockIn/index'
				});
			} else {
				let page_path = 'pages/immortal/index?type=clockIn';
				const { pagePath, queryString } = splitPagePath(page_path);
				switchTabWithQuery(pagePath, queryString);
			}
		},
		/** 获取偏移天数 */
		getOffset() {
			if (this.mode === 'custom') {
				return this.dayOffset;
			}
			return MODE_OFFSET_MAP[this.mode] ?? 0;
		},

		/** 获取目标日期 */
		getTargetDate() {
			const date = new Date();
			date.setDate(date.getDate() + this.getOffset());
			return date;
		},

		/** 更新公历 + 农历 */
		updateDate() {
			const date = this.getTargetDate();
			const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

			this.year = date.getFullYear();
			this.month = date.getMonth() + 1;
			this.day = date.getDate();
			this.week = weeks[date.getDay()];

			const lunar = solarLunar.solar2lunar(this.year, this.month, this.day);

			this.lunarText = `${lunar.gzYear}年 ${lunar.monthCn}${lunar.dayCn}`;
		},

		/** today 模式：跨天自动刷新 */
		autoRefresh() {
			this.timer && clearTimeout(this.timer);

			if (this.mode !== 'today') return;

			const now = new Date();
			const tomorrow = new Date(now);
			tomorrow.setHours(24, 0, 0, 0);

			const delay = tomorrow.getTime() - now.getTime();

			this.timer = setTimeout(() => {
				this.updateDate();
				this.autoRefresh();
			}, delay);
		}
	}
};
</script>

<style lang="scss" scoped>
.wrapper {
	width: 100%;
	height: 100%;

	.solarcard-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
}

.clockIn-solarcard {
	display: flex;
	align-items: center;

	.clockIn-solarimg {
		width: 506rpx;
		height: 200rpx;
		object-fit: contain;
	}
}

.clockIn-card {
	display: flex;
	align-items: center;
	width: 100%;
	margin-top: 30rpx;

	.clockIn-img {
		width: 100%;
		object-fit: cover;
	}
}

.calendar-card {
	width: 200rpx;
	height: 140rpx;
	margin-left: 16rpx;
	position: relative;
	padding: 18rpx 0 38rpx;
	border-radius: 24rpx;
	overflow: hidden;
	background: rgba(0, 0, 0, 0.55);
}

.bg {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 0;
	object-fit: contain;
}

.content {
	position: relative;
	z-index: 1;
	text-align: center;
	color: #fff;
}

.solar {
	font-size: 28rpx;
	background-color: rgba(255, 255, 255, 0.1);
	height: 56rpx;
	line-height: 56rpx;
}

.main {
	color: #e04c29;
}

.date {
	font-size: 38rpx;
	font-weight: bold;
	margin-top: 6rpx;
	line-height: 1;
}

.week {
	margin-top: 4rpx;
	font-size: 22rpx;
}

.lunar {
	margin-top: 10rpx;
	font-size: 18rpx;
}
</style>
