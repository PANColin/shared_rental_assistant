// http.js
import config from "@/common/config.js";
const baseUrl =
	process.env.NODE_ENV === 'development' ?
	'/api/web' :
	config.apiUrl + '/api/web';

export default {
	config: {
		baseUrl,
		header: {
			'Content-Type': 'application/json;charset=UTF-8',
			'appid': config.appid || 'web',
			'source': 'web'
		},
		method: "GET",
		dataType: "json",
	},

	request(options = {}) {
		options.header = options.header || {
			...this.config.header
		};
		options.method = options.method || this.config.method;
		options.dataType = options.dataType || this.config.dataType;

		// ✅ 关键：允许携带 Cookie（H5）
		options.withCredentials = true;

		// 拼接 URL
		if (!options.url.startsWith('http')) {
			options.url = baseUrl + options.url;
		}

		return new Promise((resolve, reject) => {
			options.success = (e) => {
				const res = e.data;
				if (e.statusCode === 200) {
					this.handleResponseError(res);
					resolve(res);
				} else {
					this.showNetworkError();
					reject(new Error('Request failed'));
				}
			};

			options.fail = (err) => {
				this.showNetworkError();
				reject(err);
			};

			uni.request(options);
		});
	},

	handleResponseError(res) {
		if (res.code !== 0 && res.code !== 500101) {
			res.msg && uni.showToast({
				title: res.msg,
				duration: 1000,
				icon: 'none'
			});
		}
	},

	showNetworkError() {
		uni.showToast({
			title: "网络异常，请稍后再试",
			duration: 1000,
			icon: 'none'
		});
	},

	get(url, data, options = {}) {
		return this.request({
			...options,
			url,
			data,
			method: 'GET'
		});
	},

	post(url, data, options = {}) {
		return this.request({
			...options,
			url,
			data,
			method: 'POST'
		});
	},

	// 上传图片
	upload(url, options = {}) {
		options.url = baseUrl + url;
		options.header = options.header || {
			...this.config.header
		};
		options.fileType = options.fileType || "image";

		// ✅ 上传也携带 Cookie
		options.withCredentials = true;

		return uni.uploadFile(options);
	}
};