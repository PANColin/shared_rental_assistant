export function uniqueArrayByField(arr, field) {
	if (!Array.isArray(arr) || !field) {
		return arr; // 非数组或未提供字段则直接返回原数组
	}

	const seen = new Set();
	return arr.filter(item => {
		const key = item[field];
		if (!seen.has(key)) {
			seen.add(key);
			return true;
		}
		return false;
	});
}

export function repeatExecution(callback, times, delay, endcallback) {
	let count = 0;

	const timer = setInterval(() => {
		if (count < times) {
			callback && callback();
			count++;
		} else {
			endcallback && endcallback()
			clearInterval(timer);
		}
	}, delay);
}


export function formatNumber(input) {
	let numberString;

	// 检查输入是否为数字类型或字符串类型
	if (typeof input === 'number') {
		numberString = input.toString();
	} else if (typeof input === 'string') {
		numberString = input;
	} else {
		// 如果输入既不是数字也不是字符串，则返回空字符串
		return '';
	}

	// 如果数字以".00"结尾，则去掉小数点及后面的0
	if (numberString.endsWith('.00')) {
		return numberString.slice(0, -3);
	}

	// 如果数字为12.01或12.22，则保留小数点及后面两位
	if (numberString === '12.01' || numberString === '12.22') {
		return numberString;
	}

	// 其他情况返回原始字符串
	return numberString;
}

export function getRandomColor(colors = [], index) {
	return colors[index % colors.length];
}

// utils/throttle.js
export function throttle(func, delay) {
	let lastCall = 0;
	let timerId = null;

	return function(...args) {
		const now = Date.now();
		const context = this; // 保持调用上下文

		if (now - lastCall >= delay) {
			lastCall = now;
			func.apply(context, args);
		} else {
			if (timerId) clearTimeout(timerId);
			timerId = setTimeout(() => {
				lastCall = now;
				func.apply(context, args);
			}, delay - (now - lastCall));
		}
	};
}

// 公共方法：解析 URL 查询参数
export function parseQueryParams(url) {
	// 确保 url 存在且包含查询字符串
	if (!url || typeof url !== 'string') return {};

	const queryString = url.split('?')[1];

	// 如果没有查询参数，直接返回空对象
	if (!queryString) return {};

	const params = {};

	// 拆分查询字符串为键值对
	const pairs = queryString.split('&');
	pairs.forEach(pair => {
		const [key, value] = pair.split('=');
		if (key && value !== undefined) {
			params[decodeURIComponent(key)] = decodeURIComponent(value);
		}
	});

	return params;
}

// 生成半圆弧
export function calculateAvatarStyles(
	dom,
	direction = 'down',
	angleOffset = 0,
	extraSpacing = 0,
	radiusOffset = 0,
	delayMode = 'random',
	minDistance = 60 // rpx，气泡最小间距
) {
	const query = uni.createSelectorQuery().in(this);
	query
		.select(dom)
		.boundingClientRect((rect) => {
			if (!rect) return;

			const godWidth = rect.width;
			const godHeight = rect.height;
			const total = this.bubbles.length;

			const centerX = godWidth / 2;
			const centerY = godHeight / 2;
			const baseRadius = godWidth / 2 + 88;

			let startAngle = 180;
			let endAngle = 360;
			switch (direction) {
				case 'up':
					startAngle = 0;
					endAngle = 180;
					break;
				case 'left':
					startAngle = 90;
					endAngle = 270;
					break;
				case 'right':
					startAngle = -90;
					endAngle = 90;
					break;
			}

			startAngle += angleOffset;
			endAngle += angleOffset;

			// 根据气泡数量和最小间距计算实际步长，保证不挤
			const radiusStep = Math.max(baseRadius / 6, minDistance); // 可根据屏幕大小调整
			const angleStep = (endAngle - startAngle) / total;

			this.avatarStyles = [];

			for (let i = 0; i < total; i++) {
				// 均匀角度 + 微扰动
				const angle = startAngle + angleStep * i + (Math.random() - 0.5) * (angleStep * 0.3);
				const rad = (angle * Math.PI) / 180;

				// 半径可随机，但保证不重叠
				const radius = baseRadius + radiusOffset + radiusStep * (Math.random() - 0.5);

				const x = centerX + radius * Math.cos(rad) + 120;
				const y = centerY + radius * Math.sin(rad) + 20 + (Math.random() - 0.5) * 15; // 上下漂浮

				// 延迟模式
				let delay = 0;
				switch (delayMode) {
					case 'leftToRight':
						delay = i * 0.2;
						break;
					case 'rightToLeft':
						delay = (total - i - 1) * 0.2;
						break;
					case 'centerOut':
						const centerIndex = (total - 1) / 2;
						delay = Math.abs(i - centerIndex) * 0.2;
						break;
					case 'random':
						delay = Math.random() * 1;
						break;
				}

				this.avatarStyles.push({
					left: `${x}rpx`,
					top: `${y}rpx`,
					animationDelay: `${delay.toFixed(2)}s`
				});
			}

			console.log(this.avatarStyles, 'avatarStyles');
		})
		.exec();
}