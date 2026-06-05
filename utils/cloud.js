/**
 * 云端请求工具
 * 支持三种数据源：GitHub 远程数据、本地 mock、UniCloud
 * - USE_GITHUB = true: 从 GitHub 仓库拉取 JSON 数据（默认）
 * - USE_MOCK = true: 使用本地 mock 数据（调试用）
 * - 都设为 false: 使用 UniCloud 云函数
 *
 * USE_GITHUB_FORCE = true 时，跳过本地缓存，每次都从 CDN 拉最新数据
 */

const USE_GITHUB = true
const USE_MOCK = false
const USE_GITHUB_FORCE = true

const GITHUB_BASE = USE_GITHUB_FORCE
	? 'https://raw.githubusercontent.com/yangjh21113/flash-word-app-database/master'
	: 'https://cdn.jsdelivr.net/gh/yangjh21113/flash-word-app-database@master'

import {
	getMockLibraryList,
	getMockLibraryDetail,
	getMockEpisodes,
	getMockWordList,
	getCategories as getMockCategories,
} from './mock.js'

/**
 * 清除所有 GitHub 缓存
 */
export function clearGhCache() {
	const info = uni.getStorageInfoSync()
	info.keys.forEach(key => {
		if (key.startsWith('gh_cache_')) {
			uni.removeStorageSync(key)
		}
	})
}

/**
 * 通用 fetch，带本地缓存（5分钟）
 * skipCache = true 时：清本地缓存 + URL 加时间戳绕过 CDN 缓存
 */
function fetchJSON(path, skipCache = false) {
	const cacheKey = `gh_cache_${path}`
	if (skipCache) {
		uni.removeStorageSync(cacheKey)
	} else {
		const cache = uni.getStorageSync(cacheKey)
		if (cache) {
			const { data, ts } = JSON.parse(cache)
			if (Date.now() - ts < 5 * 60 * 1000) {
				return Promise.resolve(data)
			}
		}
	}

	const url = `${GITHUB_BASE}/${path}${skipCache ? '?t=' + Date.now() : ''}`

	return new Promise((resolve, reject) => {
		uni.request({
			url,
			success: (res) => {
				if (res.statusCode !== 200) {
					reject(new Error(`HTTP ${res.statusCode}`))
					return
				}

				let data = res.data

				// WeChat 对 text/plain 响应不做自动解析，需要手动 JSON.parse
				if (typeof data === 'string') {
					console.log('>>> 第一次 parse: 输入类型=string, 长度=' + data.length)
					try {
						data = JSON.parse(data)
						console.log('>>> 第一次 parse 成功: 结果类型=' + typeof data + (Array.isArray(data) ? ', array长度=' + data.length : ''))
					} catch (e) {
						console.error('>>> 第一次 parse 失败，input 前 500 字符:', data.slice(0, 500))
						reject(new Error('JSON 解析失败: ' + e.message))
						return
					}
				} else {
					console.log('>>> res.data 已经是', typeof data, Array.isArray(data) ? 'array' : 'object')
				}

				// 防御性：确保不是字符串就跳过二次 parse
				if (typeof data === 'string') {
					console.log('>>> 第二次 parse 需要: 输入长度=' + data.length)
					try {
						data = JSON.parse(data)
						console.log('>>> 第二次 parse 成功')
					} catch (e) {
						console.error('>>> 第二次 parse 失败，input 前 500 字符:', data.slice(0, 500))
						reject(new Error('JSON 解析失败: ' + e.message))
						return
					}
				}

				console.log('>>> fetchJSON OK:', Array.isArray(data) ? `array(${data.length})` : typeof data)
				uni.setStorageSync(cacheKey, JSON.stringify({ data, ts: Date.now() }))
				resolve(data)
			},
			fail: (err) => {
				console.error('>>> fetchJSON fail:', err.errMsg)
				reject(new Error('请求失败: ' + (err.errMsg || 'unknown')))
			}
		})
	})
}

export function getLibraryList(category = 'all', force = false) {
	if (USE_MOCK) {
		return getMockLibraryList(category)
	}
	if (USE_GITHUB) {
		const skipCache = USE_GITHUB_FORCE || force
		return fetchJSON('libraries.json', skipCache).then(list => {
			const libs = category === 'all' ? list : list.filter(lib => lib.category === category)
			return { list: libs, total: libs.length, page: 1, pageSize: 50 }
		})
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

export function getLibraryDetail(libraryId, force = false) {
	if (USE_MOCK) {
		return getMockLibraryDetail(libraryId)
	}
	if (USE_GITHUB) {
		return fetchJSON('libraries.json', USE_GITHUB_FORCE || force).then(list => {
			const lib = list.find(l => l._id === libraryId)
			return lib ? { data: lib } : Promise.reject(new Error('Library not found'))
		})
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

export function getEpisodes(seasonId, force = false) {
	if (USE_MOCK) {
		return getMockEpisodes(seasonId)
	}
	if (USE_GITHUB) {
		// 先找 season 属于哪个词库
		return fetchJSON('libraries.json', USE_GITHUB_FORCE || force).then(libs => {
			let libId = ''
			for (const lib of libs) {
				if (lib.seasons && lib.seasons.some(s => s._id === seasonId)) {
					libId = lib._id
					break
				}
			}
			if (!libId) return { list: [], total: 0 }
			return fetchJSON(`episodes/${libId}.json`, USE_GITHUB_FORCE || force).then(epMap => {
				// episodes 文件中 key 是 season id，值是剧集数组
				const episodes = []
				for (const key in epMap) {
					if (key === seasonId) {
						episodes.push(...epMap[key])
					}
				}
				return { list: episodes, total: episodes.length }
			})
		})
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
	if (USE_GITHUB) {
		// libraryId 可能是 season id（如 ielts_s1）或 episode id（如 tbbt_s2e01）
		// 需要先找到对应的词库文件
		return fetchJSON('libraries.json', USE_GITHUB_FORCE).then(libs => {
			let libId = ''
			for (const lib of libs) {
				if (lib.seasons && lib.seasons.some(s => s._id === libraryId)) {
					libId = lib._id
					break
				}
			}
			if (!libId) {
				// 可能是 episode id，尝试常见词库
				for (const lib of libs) {
					if (lib.type === 'series') {
						libId = lib._id
						break
					}
				}
			}
			if (!libId) return { list: [], total: 0, page: 1, pageSize: 50 }
			return fetchJSON(`words/${libId}.json`, USE_GITHUB_FORCE).then(wordMap => {
				const words = wordMap[libraryId] || []
				return { list: words, total: words.length, page: 1, pageSize: 50 }
			})
		})
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

/**
 * 获取分类列表（从 GitHub 拉取）
 */
export function getCategories() {
	if (USE_MOCK) {
		return getMockCategories()
	}
	if (USE_GITHUB) {
		return fetchJSON('categories.json', USE_GITHUB_FORCE)
	}
	// UniCloud fallback
	return new Promise((resolve, reject) => {
		uniCloud.callFunction({ name: 'get-categories' }).then(res => {
			if (res.result && res.result.code === 0) resolve(res.result.data)
			else reject(res.result)
		}).catch(reject)
	})
}

export { getCoverColor, getCoverTextColor } from './mock.js'
