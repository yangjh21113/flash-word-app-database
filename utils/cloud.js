/**
 * 云端请求工具
 */

/**
 * 调用云函数（带 loading 和错误处理）
 * @param {string} name 云函数名
 * @param {object} data 请求参数
 * @returns {object} 云函数返回的 data 字段
 */
export function callCloud(name, data = {}) {
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({
			name,
			data
		}).then(res => {
			const { result } = res
			if (result && result.code === 0) {
				resolve(result.data)
			} else {
				uni.showToast({
					title: result?.msg || '请求失败',
					icon: 'none'
				})
				reject(result)
			}
		}).catch(err => {
			uni.showToast({ title: '网络异常', icon: 'none' })
			reject(err)
		})
	})
}

/**
 * 获取词库列表
 */
export function getLibraryList(page = 1, pageSize = 20) {
	return callCloud('get-library-list', { page, pageSize })
}

/**
 * 获取指定词库的单词列表
 */
export function getWordList(libraryId, page = 1, pageSize = 50) {
	return callCloud('get-word-list', { library_id: libraryId, page, pageSize })
}
