/**
 * 学习天数统计（本地存储版）
 */

const KEY_DATE = 'lastStudyDate'
const KEY_DAYS = 'studyDays'

function today() {
	return new Date().toISOString().split('T')[0]
}

/**
 * 标记今天已学习，返回当前连续天数
 */
export function markStudyToday() {
	const last = uni.getStorageSync(KEY_DATE)
	let days = parseInt(uni.getStorageSync(KEY_DAYS) || '0')
	const t = today()

	if (last === t) {
		// 今天已经标记过
		return days > 0 ? days : 1
	}

	if (last) {
		const lastDate = new Date(last)
		const todayDate = new Date(t)
		const diff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24))
		if (diff === 1) {
			// 连续学习，天数+1
			days++
		} else {
			// 中断了，重置为1
			days = 1
		}
	} else {
		// 首次学习
		days = 1
	}

	uni.setStorageSync(KEY_DATE, t)
	uni.setStorageSync(KEY_DAYS, String(days))
	return days
}

/**
 * 获取当前连续天数
 */
export function getStudyDays() {
	const last = uni.getStorageSync(KEY_DATE)
	const days = parseInt(uni.getStorageSync(KEY_DAYS) || '0')
	const t = today()

	if (!last || last !== t) {
		// 今天没学习过，需要判断是否断档
		if (last) {
			const lastDate = new Date(last)
			const todayDate = new Date(t)
			const diff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24))
			if (diff > 1) return 0 // 断档
		}
		return days > 0 ? days : 0
	}

	return days
}

/**
 * 重置（用于测试）
 */
export function resetStudyDays() {
	uni.removeStorageSync(KEY_DATE)
	uni.removeStorageSync(KEY_DAYS)
}
