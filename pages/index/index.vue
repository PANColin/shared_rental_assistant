<template>
	<block v-if="loading">
		<ks-loading-page></ks-loading-page>
	</block>

	<view class="wrapper" v-else>
		<!-- 费用 -->
		<view class="card">
			<view class="title">费用</view>

			<view class="row">
				<u-input v-model="rent" placeholder="房租" type="number" border="surround" />
				<u-input v-model="fixed" placeholder="物业/网费" type="number" border="surround" />
			</view>

			<view class="row">
				<u-input v-model="water" placeholder="水费" type="number" border="surround" />
				<u-input v-model="gas" placeholder="燃气" type="number" border="surround" />
			</view>

			<view class="row">
				<u-input v-model="power" placeholder="电费" type="number" border="surround" />
			</view>
		</view>

		<!-- 居住天数 -->
		<view class="card">
			<view class="title">居住天数</view>

			<view class="people-item" v-for="(item, index) in people" :key="index">
				<view class="name">第{{ index + 1 }}人</view>

				<u-input v-model="people[index]" type="number" placeholder="住了多少天" border="surround" />

				<u-icon name="trash" color="#ff4d4f" size="22" @click="del(index)"></u-icon>
			</view>

			<u-button type="primary" shape="circle" class="add" @click="add">+ 添加一个人</u-button>
		</view>

		<!-- 分摊结果 -->
		<view class="card">
			<view class="title">分摊结果</view>

			<view class="result-item" v-for="(item, index) in result" :key="index">
				<text class="person">第{{ index + 1 }}人</text>

				<text class="money">￥{{ item }}</text>
			</view>
		</view>

		<!-- 免责声明 -->
		<view class="card disclaimer">
			<view class="title">免责声明</view>

			<view class="text">本工具仅用于合租费用分摊辅助计算，不涉及任何资金交易， 计算结果仅供参考。</view>

			<view class="text">实际费用结算请以合租成员协商结果为准， 开发者不对任何计算误差或争议承担责任。</view>

			<view class="text">使用本工具即视为同意以上说明。</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			loading: true,

			rent: '',
			fixed: '',
			water: '',
			power: '',
			gas: '',

			people: ['']
		};
	},

	computed: {
		result() {
			const totalDays = this.people.reduce((a, b) => a + Number(b || 0), 0);

			return this.people.map((d) => {
				d = Number(d || 0);

				const rentCost = totalDays ? (this.rent / totalDays) * d : 0;

				const fixedCost = totalDays ? (this.fixed / totalDays) * d : 0;

				const waterCost = totalDays ? (this.water / totalDays) * d : 0;

				const powerCost = totalDays ? (this.power / totalDays) * d : 0;

				const gasCost = totalDays ? (this.gas / totalDays) * d : 0;

				const total = rentCost + fixedCost + waterCost + powerCost + gasCost;

				return total.toFixed(2);
			});
		}
	},

	onReady() {
		this.loading = false;
	},

	methods: {
		add() {
			this.people.push('');
		},

		del(i) {
			if (this.people.length === 1) return;

			this.people.splice(i, 1);
		}
	}
};
</script>

<style lang="scss">
@import './style/index.scss';
</style>
