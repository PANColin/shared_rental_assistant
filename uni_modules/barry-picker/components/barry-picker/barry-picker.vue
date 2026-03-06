<template>
	<view>
		<u-picker round="10" :show="show" title="选择地址" ref="uPicker" :columns="columns" @confirm="confirm"
			@cancel="show=false" @change="changeHandler" closeOnClickOverlay @close="show=false"></u-picker>
	</view>
</template>

<script>
	import {
		columns,
		columnData
	} from "./province.js"
	export default {
		data() {
			return {
				show: false,
				columns: columns,
				columnData: columnData,
			};
		},
		methods: {
			changeHandler(e) {
				const {
					columnIndex,
					value,
					values,
					index,
					picker = this.$refs.uPicker
				} = e // values为当前变化列的数组内容

				// 微信小程序无法将picker实例传出来，只能通过ref操作


				// 当第一列值发生变化时，变化第二列(后一列)对应的选项
				if (columnIndex === 0) {
					// picker为选择器this实例，变化第二列对应的选项
					picker.setColumnValues(1, this.columnData[index])
				}
			},
			// 选择的地址
			// 回调参数为包含columnIndex、value、values
			confirm(e) {
				this.show = false
				let address = e.value[0] + e.value[1]
				this.$emit('get-address', address)
			},
		},
	}
</script>

<style lang="scss" scoped>

</style>