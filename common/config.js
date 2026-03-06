var config = {}
const accountInfo = uni.getAccountInfoSync();
const envVersion = accountInfo.miniProgram.envVersion;
uni.getSystemInfo({
	success: function(res) {
		if (res.uniPlatform === 'mp-weixin') {
			// 在微信小程序中运行的逻辑
			if (envVersion === 'develop') {
				// 开发版本
				config = {
					// https://testluckyapi.dududus.com 测试环境
					//  online环境
					//  正式环境
					apiUrl: "https://testluckyapi.dududus.com",
					staticUrl: 'https://zylucky.zvyhjkx.com/luckywx_client/images/', //静态图片地址https://zylucky.zvyhjkx.com/luckywx_client/images/
				}
			} else if (envVersion === 'trial') {
				//体验版
				config = {
					apiUrl: "https://testluckyapi.dududus.com",
					staticUrl: 'https://zylucky.zvyhjkx.com/luckywx_client/images/', //静态图片地址https://zylucky.zvyhjkx.com/luckywx_client/images/
				}
			} else if (envVersion === 'release') {
				//正式版
				config = {
					apiUrl: "https://testluckyapi.dududus.com",
					staticUrl: 'https://zylucky.zvyhjkx.com/luckywx_client/images/', //静态图片地址https://zylucky.zvyhjkx.com/luckywx_client/images/
				}
			}
		} else if (res.uniPlatform === 'web') {
			// 在H5环境中运行的逻辑
		}
	}
});
export default config