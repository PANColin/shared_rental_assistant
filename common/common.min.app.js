const getSystemInfo = () => {
	return new Promise(function(resolve, reject) {
		uni.getSystemInfo({
			success: function(res) {
				resolve(res)
			}
		});
	});
}

export default {
	getSystemInfo
}