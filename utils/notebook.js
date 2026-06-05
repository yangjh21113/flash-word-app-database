/**
 * 生词本（本地存储版）
 */

const STORAGE_KEY = 'notebook'

/**
 * 获取生词本列表
 */
export function getNotebook() {
	try {
		const data = uni.getStorageSync(STORAGE_KEY)
		return data ? JSON.parse(data) : []
	} catch (e) {
		return []
	}
}

/**
 * 添加单词到生词本
 * @param {object} word 单词数据
 * @param {string} source 来源词库名称
 * @returns {boolean} 是否添加成功（false 表示已存在）
 */
export function addWordToNotebook(word, source) {
	const list = getNotebook()
	// 判断是否已存在（同一词库+同一单词）
	const exists = list.some(item => item.word === word.word && item.library_id === word.library_id)
	if (exists) {
		return false
	}

	const now = new Date().toISOString().split('T')[0]
	list.unshift({
		word: word.word,
		phonetic_us: word.phonetic_us || '',
		meaning: word.meaning ? word.meaning.zh : '',
		library_id: word.library_id || '',
		source: source || '',
		added_at: now,
		review_count: 0,
		last_reviewed: null
	})

	uni.setStorageSync(STORAGE_KEY, JSON.stringify(list))
	return true
}

/**
 * 从生词本移除单词
 * @param {string} word 单词名
 */
export function removeWord(word) {
	const list = getNotebook()
	const filtered = list.filter(item => item.word !== word)
	uni.setStorageSync(STORAGE_KEY, JSON.stringify(filtered))
}

/**
 * 获取今日新增生词数
 */
export function getTodayNotebookCount() {
	const list = getNotebook()
	const today = new Date().toISOString().split('T')[0]
	return list.filter(item => item.added_at === today).length
}

/**
 * 清空生词本
 */
export function clearNotebook() {
	uni.setStorageSync(STORAGE_KEY, '[]')
}
