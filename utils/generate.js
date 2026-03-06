// 获取当前时间的毫秒值的函数
const getMilliseconds = () => {
	return Date.now();
};

// 生成 __trackid 的函数
export const generateTrackId = (uid) => {
	const milliseconds = getMilliseconds();
	return `${uid}.${milliseconds}`;
};

// 获取 __uid 的函数
export const getUid = () => {
	const userInfo = uni.getStorageSync('user_info');
	return userInfo && userInfo.uid ? userInfo.uid : 0; // 处理 uid 可能为 undefined 的情况
};

// 生成公共参数的函数
export const generateCommonParams = () => {
	const uid = getUid();
	const trackId = generateTrackId(uid);
	return {
		__uid: uid,
		__trackid: trackId,
	};
};

// 生成带有公共参数的 URL
export const generateUrlWithParams = (url, params = {}) => {
	const commonParams = generateCommonParams();
	const queryString = new URLSearchParams({
		...commonParams,
		...params
	}).toString();
	return `${url}?${queryString}`;
};