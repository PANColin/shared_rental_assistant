/**
 * 拆 page_path，只为 tabBar 用
 */
export function splitPagePath(path = '') {
	const [pagePath, queryString = ''] = path.split('?');
	return {
		pagePath,
		queryString
	};
}

/**
 * tab 参数 storage key（按页面隔离）
 */
export function getTabParamsKey(pagePath) {
	return `__TAB_PARAMS__:${pagePath}`;
}

/**
 * tabBar 跳转（支持 queryString）
 */
export function switchTabWithQuery(pagePath, queryString = '') {
	if (!pagePath) return;

	const key = getTabParamsKey(pagePath);

	if (queryString) {
		uni.setStorageSync(key, queryString);
	}

	uni.switchTab({
		url: `/${pagePath}`
	});
}

/**
 * 读取并清理 tabBar queryString
 */
export function consumeTabQuery(pagePath) {
	if (!pagePath) return '';

	const key = getTabParamsKey(pagePath);
	const queryString = uni.getStorageSync(key);

	if (queryString) {
		uni.removeStorageSync(key);
	}

	return queryString || '';
}

/**
 * =========================
 * 🔽 新增：参数解析工具
 * =========================
 */

/**
 * 解析 queryString 为对象
 */
export function parseQueryString(queryString = '') {
	const params = {};
	if (!queryString) return params;

	queryString.split('&').forEach(item => {
		if (!item) return;
		const [k, v = ''] = item.split('=');
		if (k) params[k] = decodeURIComponent(v);
	});

	return params;
}

/**
 * 读取 tabBar 参数对象（一次性）
 */
export function consumeTabParams(pagePath) {
	const queryString = consumeTabQuery(pagePath);
	return queryString ? parseQueryString(queryString) : null;
}

/**
 * 读取 tabBar 的 type 参数（高频）
 */
export function consumeTabType(pagePath, key = 'type') {
	const queryString = consumeTabQuery(pagePath);
	if (!queryString) return '';

	let value = '';
	queryString.split('&').some(item => {
		const [k, v] = item.split('=');
		if (k === key && v) {
			value = decodeURIComponent(v);
			return true;
		}
		return false;
	});

	return value;
}