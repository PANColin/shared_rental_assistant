import commonApp from "./common.min.app.js";
import request from "@/utils/http.js";
let token = null;
let requestLoginTime = 0;

// 获取 token
export const getToken = async () => {
	// 如果已有 token 缓存
	if (!token) token = uni.getStorageSync(`token`);
	if (token && typeof token === "string") {
		token = JSON.parse(token);
	}

	// 检查 token 是否存在或是否过期
	if (!token || !checkToken(token)) {
		// 如果已有正在进行的登录请求，则等待该请求完成
		if (getToken.promise) {
			return getToken.promise;
		}

		// 否则，发起登录请求
		getToken.promise = login().then(async res => {
			if (res.code == 0) {
				return setToken(res.data);
			} else {
				// 如果登录失败，尝试重新登录
				try {
					let loginRes = await login();
					return setToken(loginRes.data);
				} catch (e) {
					return Promise.reject(e);
				}
			}
		}).finally(() => {
			// 登录请求完成后，清空 promise
			getToken.promise = null;
		});

		return getToken.promise;
	}

	// 如果 token 是有效的，直接返回
	return Promise.resolve(token.token);
};

// 登录
export const login = async () => {
	requestLoginTime++;
	if (requestLoginTime != 1) {
		await loginPromise();
	}
	let code = await commonApp.getAppCode();
	let res = await request.post("/api/auth/login", {
		code: code,
		appid: commonApp.getAppId(),
		use_for: 1,
	});
	requestLoginTime = 0;
	return res;
};

// 登录的延迟模拟
const loginPromise = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, 800);
	});
};

// 检测数据结果
export const checkResult = r => {
	if (!r.data.code) {
		return r.data.data;
	} else {
		return Promise.reject(r);
	}
};

// 刷新 token
const refreshToken = () => {
	let res = request.post("/api/auth/refreshToken", {
		refreshToken: token.refreshToken,
		appid: commonApp.getAppId()
	});
	return res;
};

// 检查 token 的有效期
const checkToken = t => {
	return new Date().getTime() < t.time;
};

// 设置 token
const setToken = async t => {
	try {
		token = formatToken(t);
		uni.setStorageSync(`token`, token);
		return t.token;
	} catch (e) {
		// 处理异常
	}
};

// 清除 token
export const clearToken = async () => {
	token = null;
	uni.removeStorageSync(`token`);
};

// 处理 token 的格式
const formatToken = t => {
	t.token = "Bearer " + t.accessToken;
	t.time = ((t.expiration - 300) * 1000);
	return t;
};