/**
 * 保证节点存在再滚动
 * @param {string} selector - 选择器，比如 '#immortals'
 * @param {object} options
 * @param {number} options.duration - 滚动时间，默认 300ms
 * @param {number} options.retryInterval - 重试间隔，默认 50ms
 * @param {number} options.maxRetry - 最大重试次数，默认 20
 * @param {number} options.offset - 偏移量，比如吸顶 header 高度
 * @returns {Promise}
 */
export function scrollToSelector(
	selector, {
		duration = 300,
		retryInterval = 50,
		maxRetry = 20,
		offset = 0
	} = {}
) {
	return new Promise((resolve, reject) => {
		let attempts = 0;

		function tryScroll() {
			const query = uni.createSelectorQuery();
			query
				.selectViewport()
				.scrollOffset()
				.select(selector)
				.boundingClientRect()
				.exec((res) => {
					const scrollTop = res[0]?.scrollTop || 0; // 当前滚动位置
					const rect = res[1]; // 节点信息

					if (rect) {
						const target = scrollTop + rect.top - offset;
						if (Math.abs(target - scrollTop) < 1) {
							// 已经在目标位置，直接 resolve
							resolve({
								scrollTop
							});
						} else {
							uni.pageScrollTo({
								scrollTop: target,
								duration,
								complete: (r) => {
									resolve(r);
								}
							});
						}
					} else {
						attempts++;
						if (attempts < maxRetry) {
							setTimeout(tryScroll, retryInterval);
						} else {
							console.warn(`scrollToSelector: 节点 ${selector} 未找到`);
							reject(new Error(`节点 ${selector} 未找到`));
						}
					}
				});
		}

		tryScroll();
	});
}