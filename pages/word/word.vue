<template>
	<view class="container">
		<!-- 当前词库名称 + 模式标签 -->
		<view class="header-row">
			<view class="header-left">
				<text class="library-tag">{{ currentLibrary }}</text>
				<view class="mode-tag" @click="showModePicker">
					<text>{{ mode === 'fast' ? '快速' : '深度' }}</text>
					<i class="mode-arrow ri-arrow-down-s-line"></i>
				</view>
			</view>
		<view class="header-right">
			<view class="shuffle-btn" @click="shuffleWords" v-if="wordList.length > 0">
				<i class="shuffle-ico ri-shuffle-line"></i>
			</view>
			<view class="reset-btn" @click="showResetConfirm" v-if="wordList.length > 0">
				<i class="reset-ico ri-restart-line"></i>
			</view>
		</view>
		</view>

		<!-- 加载中 -->
		<view class="card-wrap" v-if="loading">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 空状态 -->
		<view class="card-wrap empty" v-else-if="wordList.length === 0">
			<text class="empty-text">该词库暂无单词</text>
		</view>

		<!-- 闪卡 -->
		<view class="card-wrap" v-else @click="onCardTap">
			<view class="card" :class="{ flipped: isFlipped }">
				<!-- 正面 -->
				<view class="card-face front">
					<text class="word">{{ currentWord.word }}</text>
					<text class="phonetic">{{ phonetic }}</text>
					<text class="hint-text" v-if="mode === 'fast'">{{ isFlipped ? '点击切换下一个' : '点击查看释义' }}</text>
				</view>
				<!-- 背面 -->
				<view class="card-face back">
					<text class="meaning">{{ formatMeaning }}</text>
					<view class="example" v-if="hasExample">
						<text class="example-en">{{ currentWord.examples[0].en }}</text>
						<text class="example-zh">{{ currentWord.examples[0].zh }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 进度 -->
		<view class="progress-row" v-if="wordList.length > 0">
			<text class="progress-text">{{ currentIndex + 1 }} / {{ wordList.length }}</text>
		</view>

		<!-- 深度模式：操作按钮 -->
		<view class="actions" v-if="mode === 'deep' && wordList.length > 0">
			<button class="btn btn-unknown" @click.stop="markUnknown">不认识</button>
			<button class="btn btn-known" @click.stop="markKnown">认识</button>
		</view>

		<!-- 模式选择弹框 -->
		<view class="mode-picker-mask" v-if="showPicker" @click="showPicker = false">
			<view class="mode-picker" @click.stop>
				<view class="picker-title">选择模式</view>
				<view class="picker-option" @click="selectMode('fast')" :class="{ active: mode === 'fast' }">
					<i class="picker-icon ri-flashlight-line"></i>
					<text class="picker-name">快速模式</text>
					<view class="picker-check" v-if="mode === 'fast'"></view>
				</view>
				<view class="picker-option" @click="selectMode('deep')" :class="{ active: mode === 'deep' }">
					<i class="picker-icon ri-book-open-line"></i>
					<text class="picker-name">深度记忆</text>
					<view class="picker-check" v-if="mode === 'deep'"></view>
				</view>
				<view class="picker-cancel" @click="showPicker = false">
					<text>取消</text>
				</view>
			</view>
		</view>

		<!-- 重置进度确认弹框 -->
		<view class="reset-dialog-mask" v-if="showResetDialog" @click="showResetDialog = false">
			<view class="reset-dialog" @click.stop>
				<view class="reset-dialog-title">
					<text class="reset-title">重置学习进度</text>
					<text class="reset-desc">「{{ currentLibrary }}」的翻转轮数将清空，生词本不受影响。</text>
				</view>
				<view class="reset-dialog-actions">
					<view class="reset-action cancel" @click="showResetDialog = false">
						<text>取消</text>
					</view>
					<view class="reset-action confirm" @click="resetProgressAction">
						<text>确定重置</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getWordList } from '@/utils/cloud.js'
import { addWordToNotebook } from '@/utils/notebook.js'
import { markStudyToday } from '@/utils/study.js'
import { recordFlipped, checkRoundComplete, resetProgress } from '@/utils/progress.js'

const isFlipped = ref(false)
const currentIndex = ref(0)
const currentLibrary = ref('')
const wordList = ref([])
const loading = ref(true)
const mode = ref('deep')
const showPicker = ref(false)
const showResetDialog = ref(false)

const currentWord = computed(() => wordList.value[currentIndex.value] || {})

const phonetic = computed(() => {
	const w = currentWord.value
	return w.phonetic_us || w.phonetic_uk || ''
})

const formatMeaning = computed(() => {
	const w = currentWord.value
	if (!w.meaning) return ''
	const zh = w.meaning.zh || ''
	const en = w.meaning.en || ''
	return zh || en
})

const hasExample = computed(() => {
	const w = currentWord.value
	return w.examples && w.examples.length > 0
})

onMounted(() => {
	loadMode()
	loadWords()
	markStudyToday()
	uni.$on('libraryChanged', () => {
		currentIndex.value = 0
		isFlipped.value = false
		loadWords()
	})
})

onShow(() => {
	loadMode()
	markStudyToday()
})

const loadMode = () => {
	const saved = uni.getStorageSync('studyMode')
	if (saved === 'fast' || saved === 'deep') {
		mode.value = saved
	}
}

const loadWords = async () => {
	loading.value = true
	const libId = uni.getStorageSync('currentLibraryId')
	const libName = uni.getStorageSync('currentLibrary') || '未选择词库'
	currentLibrary.value = libName

	if (!libId) {
		wordList.value = []
		loading.value = false
		return
	}

	try {
		const res = await getWordList(libId, 1, 100)
		wordList.value = res.list || []
	} catch (e) {
		console.error('加载单词失败', e)
	} finally {
		loading.value = false
	}
}

const onCardTap = () => {
	if (loading.value || wordList.value.length === 0) return

	if (!isFlipped.value) {
		isFlipped.value = true
		recordFlipped(uni.getStorageSync('currentLibraryId'), currentWord.value.word)
		checkRoundComplete(uni.getStorageSync('currentLibraryId'), wordList.value.length)
	} else {
		nextWord()
	}
}

const nextWord = () => {
	if (currentIndex.value < wordList.value.length - 1) {
		currentIndex.value++
	} else {
		currentIndex.value = 0
	}
	isFlipped.value = false
}

const markKnown = () => {
	recordFlipped(uni.getStorageSync('currentLibraryId'), currentWord.value.word)
	checkRoundComplete(uni.getStorageSync('currentLibraryId'), wordList.value.length)
	nextWord()
}

const markUnknown = () => {
	recordFlipped(uni.getStorageSync('currentLibraryId'), currentWord.value.word)
	checkRoundComplete(uni.getStorageSync('currentLibraryId'), wordList.value.length)
	addWordToNotebook(currentWord.value)
	nextWord()
}

const shuffleWords = () => {
	const list = [...wordList.value]
	for (let i = list.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[list[i], list[j]] = [list[j], list[i]]
	}
	if (list[0].word === currentWord.value.word && list.length > 1) {
		const idx = 1 + Math.floor(Math.random() * (list.length - 1))
		;[list[0], list[idx]] = [list[idx], list[0]]
	}
	wordList.value = list
	currentIndex.value = 0
	isFlipped.value = false
}

const showModePicker = () => {
	showPicker.value = true
}

const selectMode = (m) => {
	mode.value = m
	uni.setStorageSync('studyMode', m)
	uni.$emit('modeChanged', m)
	showPicker.value = false
}

const showResetConfirm = () => {
	showResetDialog.value = true
}

const resetProgressAction = () => {
	resetProgress(uni.getStorageSync('currentLibraryId'))
	showResetDialog.value = false
	uni.showToast({ title: '进度已重置', icon: 'success' })
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	padding: 32rpx;
	box-sizing: border-box;
	background-color: #fafafa;
}

.header-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.header-right {
	display: flex;
	gap: 12rpx;
}

.shuffle-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48rpx;
	height: 48rpx;
	border: 1px solid #EEEEEE;
	border-radius: 8px;
	background-color: #FFFFFF;
}

.reset-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48rpx;
	height: 48rpx;
	border: 1px solid #EEEEEE;
	border-radius: 8px;
	background-color: #FFFFFF;
}

.reset-ico {
	font-family: "remixicon";
	font-size: 24rpx;
	color: #999999;
	display: inline-block;
	line-height: 1;
}

.shuffle-ico {
	font-family: "remixicon";
	font-size: 24rpx;
	color: #999999;
	display: inline-block;
	line-height: 1;
}

.library-tag {
	font-size: 24rpx;
	color: #333333;
	background-color: #F0F0F0;
	padding: 8rpx 16rpx;
	border-radius: 4px;
}

.mode-tag {
	font-size: 24rpx;
	color: #6380e8;
	background-color: #f0f3fc;
	padding: 8rpx 16rpx;
	border-radius: 4px;
	display: flex;
	align-items: center;
	gap: 4rpx;
}

.mode-arrow {
	font-family: "remixicon";
	font-size: 28rpx;
	color: #6380e8;
	line-height: 1;
}

.progress-row {
	text-align: center;
	margin-top: 24rpx;
}

.progress-text {
	font-size: 24rpx;
	color: #999999;
}

.card-wrap {
	flex: 1;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.card {
	position: relative;
	width: 100%;
	height: 100%;
}

.card-face {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #FFFFFF;
	border-radius: 20px;
	box-shadow: 0 2px 8px rgba(99, 128, 232, 0.08);
	padding: 48rpx;
	box-sizing: border-box;
	transition: opacity 0.2s;
}

.card.flipped .front {
	opacity: 0;
	pointer-events: none;
}

.card.flipped .back {
	opacity: 1;
}

.card:not(.flipped) .front {
	opacity: 1;
}

.card:not(.flipped) .back {
	opacity: 0;
	pointer-events: none;
}

.word {
	font-size: 60rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 16rpx;
}

.phonetic {
	font-size: 28rpx;
	color: #999999;
}

.hint-text {
	font-size: 24rpx;
	color: #CCCCCC;
	margin-top: 32rpx;
}

.meaning {
	font-size: 32rpx;
	color: #6380e8;
	font-weight: 500;
	margin-bottom: 32rpx;
	text-align: center;
}

.example {
	width: 100%;
	background-color: #fafafa;
	padding: 24rpx;
	border-radius: 4px;
}

.example-en {
	display: block;
	font-size: 24rpx;
	color: #333333;
	margin-bottom: 8rpx;
}

.example-zh {
	display: block;
	font-size: 20rpx;
	color: #999999;
}

.loading-text, .empty-text {
	font-size: 28rpx;
	color: #999999;
}

.actions {
	margin-top: 20px;
	display: flex;
	gap: 32rpx;
	width: 100%;
}

.btn {
	flex: 1;
	height: 88rpx;
	border-radius: 999px;
	font-size: 32rpx;
	border: none;
	line-height: 88rpx;
}

.btn-unknown {
	background-color: #FFFFFF;
	color: #333333;
	border: 1px solid #EEEEEE;
}

.btn-known {
	background-color: #6380e8;
	color: #FFFFFF;
}

/* 模式选择弹框 */
.mode-picker-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.mode-picker {
	width: 560rpx;
	background-color: #FFFFFF;
	border-radius: 12px;
	padding: 40rpx 0 24rpx;
}

.picker-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333333;
	text-align: center;
	margin-bottom: 32rpx;
}

.picker-option {
	display: flex;
	align-items: center;
	padding: 28rpx 40rpx;
	position: relative;
}

.picker-option.active {
	background-color: #f0f3fc;
}

.picker-icon {
	font-family: "remixicon";
	font-size: 40rpx;
	color: #6380e8;
	margin-right: 20rpx;
}

.picker-name {
	flex: 1;
	font-size: 30rpx;
	color: #333333;
}

.picker-check {
	width: 36rpx;
	height: 36rpx;
	background-color: #6380e8;
	border-radius: 50%;
	position: relative;
}

.picker-check::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 14rpx;
	height: 9rpx;
	border-left: 3rpx solid #FFFFFF;
	border-bottom: 3rpx solid #FFFFFF;
	transform: translate(-50%, -60%) rotate(-45deg);
}

.picker-cancel {
	text-align: center;
	padding: 28rpx 0 0;
	border-top: 1px solid #F5F5F5;
	margin-top: 8rpx;
}

.picker-cancel text {
	font-size: 30rpx;
	color: #999999;
}

/* 重置确认弹框 */
.reset-dialog-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.reset-dialog {
	width: 560rpx;
	background-color: #FFFFFF;
	border-radius: 12px;
	overflow: hidden;
}

.reset-dialog-title {
	padding: 40rpx 40rpx 32rpx;
}

.reset-title {
	display: block;
	font-size: 30rpx;
	font-weight: 600;
	color: #333333;
	text-align: center;
	margin-bottom: 16rpx;
}

.reset-desc {
	display: block;
	font-size: 24rpx;
	color: #999999;
	text-align: center;
	line-height: 1.5;
}

.reset-dialog-actions {
	display: flex;
	border-top: 1px solid #F5F5F5;
}

.reset-action {
	flex: 1;
	text-align: center;
	padding: 28rpx 0;
	font-size: 30rpx;
}

.reset-action.cancel text {
	color: #999999;
}

.reset-action.confirm text {
	color: #e84a4a;
}

.reset-action.cancel {
	border-right: 1px solid #F5F5F5;
}
</style>

<style>
.shuffle-ico,
.mode-arrow,
.mode-tag .mode-arrow,
.picker-icon,
.reset-ico {
	font-family: "remixicon";
}
</style>
