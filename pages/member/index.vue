<template>
	<block v-if="loading">
		<ks-loading-page></ks-loading-page>
	</block>

	<view class="page-wrapper" v-else>
		<!-- 分数 -->
		<view class="score">戳：{{ score }}</view>

		<!-- 游戏区域 -->
		<view class="game-area">
			<view
				v-for="item in bubbles"
				:key="item.id"
				class="bubble"
				:style="{
					left: item.left + '%',
					top: item.top + '%',
					background: item.color
				}"
				@click="popBubble(item.id)"
			></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loading: true,

			score: 0,

			bubbles: [],

			timer: null,

			id: 0
		};
	},

	onShow() {
		setTimeout(() => {
			this.loading = false;
			this.startGame();
		}, 300);
	},

	onHide() {
		clearInterval(this.timer);
	},

	methods: {
		startGame() {
			this.timer = setInterval(() => {
				this.createBubble();
			}, 600);
		},

		createBubble() {
			const bubble = {
				id: this.id++,
				left: Math.random() * 90,
				top: Math.random() * 90,
				color: this.randomColor()
			};

			this.bubbles.push(bubble);

			if (this.bubbles.length > 25) {
				this.bubbles.shift();
			}
		},

		popBubble(id) {
			const index = this.bubbles.findIndex((v) => v.id === id);

			if (index > -1) {
				this.bubbles.splice(index, 1);

				this.score++;
			}
		},

		randomColor() {
			const colors = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#fd79a8', '#a29bfe'];

			return colors[Math.floor(Math.random() * colors.length)];
		}
	}
};
</script>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
