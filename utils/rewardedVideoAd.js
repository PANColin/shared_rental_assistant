import {
	getConfigs
} from "@/common/apis/ad.js";

let rewardedVideoAd = null; // 激励视频广告实例
let currentPage = null; // 当前页面引用

// 创建激励视频广告
const createRewardedVideoAd = async () => {

	if (rewardedVideoAd != null) return; // 如果广告已经实例化，直接返回

	const res = await getConfigs();
	if (!res.data?.jili_adv?.jili_adv_id) return;

	// 小程序端单例：每个页面的实例
	rewardedVideoAd = wx.createRewardedVideoAd({
		adUnitId: res.data.jili_adv.jili_adv_id,
	});

	// 检查是否已经绑定了 onClose 回调
	if (!rewardedVideoAd.__isOnCloseBound) {
		rewardedVideoAd.onClose((res) => {
			uni.hideLoading();
			if (res.isEnded) {
				currentPage?.rewardSuccess && currentPage.rewardSuccess();
			} else {
				currentPage?.rewardFaile && currentPage.rewardFaile();
			}
		});
		rewardedVideoAd.__isOnCloseBound = true;
	}

	// 为 onError 绑定事件（如果 SDK 支持 offError，可先移除已有的 onError 监听）
	rewardedVideoAd.offError && rewardedVideoAd.offError();
	rewardedVideoAd.onError((err) => {
		console.log(err, 'onErroronError')
		uni.hideLoading();
		currentPage?.rewardError && currentPage.rewardError(err);
	});
};

// 设置当前页面
const setCurrentPage = (page) => {
	currentPage = page;
};

// 显示激励视频广告
const showRewardedVideoAd = (callback) => {
	if (rewardedVideoAd == null) {
		currentPage.checkAnswer && currentPage.checkAnswer();
		return;
	}

	rewardedVideoAd.onError((err) => {
		console.log(err, 'onErroronError')
		uni.showToast({
			title: `拉取视频失败，请稍后重试(${err?.errCode || ''})`,
			icon: 'none'
		});
		currentPage?.rewardError && currentPage.rewardError(err);
		uni.hideLoading();
	});
	uni.showLoading({
		title: '加载中',
	});

	let timer = setTimeout(() => {
		uni.hideLoading();
		clearTimeout(timer)
	}, 2000)

	rewardedVideoAd
		.show()
		.then(() => {
			// 广告展示成功
			uni.hideLoading();
			callback && callback(); // 执行回调
		})
		.catch(() => {
			// 如果广告未加载成功，手动加载广告
			rewardedVideoAd
				.load()
				.then(() => {
					return rewardedVideoAd.show();
				})
				.then(() => {
					// 第二次展示成功
					uni.hideLoading();
					callback && callback();
				})
				.catch(() => {
					uni.hideLoading();
					rewardedVideoAd.onError((err) => {
						console.log(err, 'onErroronError')
						uni.showToast({
							title: `拉取视频失败，请稍后重试(${err?.errCode || ''})`,
							icon: 'none'
						});
						currentPage?.rewardError && currentPage.rewardError(err);
						uni.hideLoading();
					});
				});
		});
};;

// 销毁广告实例，防止跨页面复用
const destroyRewardedVideoAd = () => {
	// if (rewardedVideoAd) {
	// 	rewardedVideoAd.destroy();
	// }
	rewardedVideoAd = null;
	currentPage = null;
	uni.hideLoading();
};

export {
	createRewardedVideoAd,
	showRewardedVideoAd,
	destroyRewardedVideoAd,
	setCurrentPage
};