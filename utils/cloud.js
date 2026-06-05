/**
 * 云端请求工具
 * 当前额度已用完，临时走 mock 数据
 * 要切回云端：把 USE_MOCK 改为 false
 */

const USE_MOCK = true

import {
	getMockLibraryList,
	getMockLibraryDetail,
	getMockEpisodes,
	getMockWordList,
} from './mock.js'

export function getLibraryList(category = 'all') {
	if (USE_MOCK) {
		return getMockLibraryList(category)
	}
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({ name: 'get-library-list', data: { category } }).then(res => {
			if (res.result && res.result.code === 0) {
				resolve(res.result.data)
			} else {
				reject(res.result)
			}
		}).catch(reject)
	})
}

export function getLibraryDetail(libraryId) {
	if (USE_MOCK) {
		return getMockLibraryDetail(libraryId)
	}
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({ name: 'get-library-detail', data: { libraryId } }).then(res => {
			if (res.result && res.result.code === 0) {
				resolve(res.result.data)
			} else {
				reject(res.result)
			}
		}).catch(reject)
	})
}

export function getEpisodes(seasonId) {
	if (USE_MOCK) {
		return getMockEpisodes(seasonId)
	}
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({ name: 'get-episodes', data: { seasonId } }).then(res => {
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

export { getCategories, getCoverColor, getCoverTextColor } from './mock.js'
