/**
 * 云端请求工具
 * 当前额度已用完，临时走 mock 数据
 * 要切回云端：把 USE_MOCK 改为 false
 */

const USE_MOCK = true

import { getMockLibraryList, getMockWordList } from './mock.js'

export function getLibraryList() {
	if (USE_MOCK) {
		return getMockLibraryList()
	}
	// 以下保留云端调用
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({ name: 'get-library-list', data: {} }).then(res => {
			if (res.result && res.result.code === 0) {
				resolve(res.result.data)
			} else {
				reject(res.result)
			}
		}).catch(reject)
	})
}

export function getWordList(libraryId) {
	if (USE_MOCK) {
		return getMockWordList(libraryId)
	}
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({ name: 'get-word-list', data: { library_id: libraryId } }).then(res => {
			if (res.result && res.result.code === 0) {
				resolve(res.result.data)
			} else {
				reject(res.result)
			}
		}).catch(reject)
	})
}
