// cacheUtils.js

import {
	getToken,
	clearToken
} from '@/common/token.js';

export function clearCache() {
	return new Promise((resolve) => {
		clearToken();
		getToken().then(() => {
			resolve();
		});
	});
}