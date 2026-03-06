// storage.js

const storage = {
	get(key) {
		try {
			return uni.getStorageSync(key);
		} catch (e) {
			console.error(`Error getting storage item ${key}:`, e);
			return null;
		}
	},

	set(key, value) {
		try {
			uni.setStorageSync(key, value);
		} catch (e) {
			console.error(`Error setting storage item ${key}:`, e);
		}
	},

	remove(key) {
		try {
			uni.removeStorageSync(key);
		} catch (e) {
			console.error(`Error removing storage item ${key}:`, e);
		}
	},

	clear() {
		try {
			uni.clearStorageSync();
		} catch (e) {
			console.error(`Error clearing storage:`, e);
		}
	}
};

export default storage;