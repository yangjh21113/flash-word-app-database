/**
 * 学习进度记录
 * 存储结构: { libId: { round: 0, flipped: Set<string> } }
 */

const STORAGE_KEY = 'studyProgress'

function getProgress() {
	const data = uni.getStorageSync(STORAGE_KEY)
	return data ? JSON.parse(data) : {}
}

function saveProgress(progress) {
	uni.setStorageSync(STORAGE_KEY, JSON.stringify(progress))
}

export function recordFlipped(libId, word) {
	const progress = getProgress()
	if (!progress[libId]) {
		progress[libId] = { round: 0, flipped: [] }
	}
	const record = progress[libId]
	if (!record.flipped.includes(word)) {
		record.flipped.push(word)
	}
	saveProgress(progress)
}

export function checkRoundComplete(libId, totalCount) {
	const progress = getProgress()
	const record = progress[libId]
	if (!record) return false

	if (record.flipped.length >= totalCount) {
		record.round++
		record.flipped = []
		saveProgress(progress)
		return true
	}
	return false
}

export function getRoundInfo(libId) {
	const progress = getProgress()
	const record = progress[libId]
	if (!record) {
		return { round: 0, flippedCount: 0 }
	}
	return { round: record.round || 0, flippedCount: record.flipped.length || 0 }
}

export function resetProgress(libId) {
	const progress = getProgress()
	delete progress[libId]
	saveProgress(progress)
}
