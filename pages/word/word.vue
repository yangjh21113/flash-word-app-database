<template>
	<view class="container">
		<!-- 当前词库名称 + 模式标签 -->
		<view class="header-row">
			<text class="library-tag">{{ currentLibrary }}</text>
			<text class="mode-tag" v-if="mode === 'fast'">快速</text>
		</view>

		<!-- 进度 -->
		<view class="progress-row">
			<text class="progress-text">{{ currentIndex + 1 }} / {{ wordList.length }}</text>
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

		<!-- 深度模式：操作按钮 -->
		<view class="actions" v-if="mode === 'deep' && wordList.length > 0">
			<button class="btn btn-unknown" @click.stop="markUnknown">不认识</button>
			<button class="btn btn-known" @click.stop="markKnown">认识</button>
		</view>

		<!-- 快速模式：提示 -->
		<view class="quick-hint" v-if="mode === 'fast' && wordList.length > 0">
			<text class="hint-text">{{ isFlipped ? '点击切换下一个' : '点击查看释义' }}</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getWordList } from '@/utils/cloud.js'

const isFlipped = ref(false)
const currentIndex = ref(0)
const currentLibrary = ref('')
const wordList = ref([])
const loading = ref(true)
const mode = ref('deep')

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
	const saved = uni.getStorageSync('studyMode')
	if (saved === 'fast' || saved === 'deep') {
		mode.value = saved
	}
	loadWords()
	uni.$on('libraryChanged', () => {
		currentIndex.value = 0
		isFlipped.value = false
		loadWords()
	})
})

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
		// 第一次点击：翻转到背面
		isFlipped.value = true
	} else {
		// 已经翻开状态：快速模式下是下一个，深度模式下也当快速用
		nextWord()
	}
}

const nextWord = () => {
	if (currentIndex.value < wordList.value.length - 1) {
		currentIndex.value++
	} else {
		// 无限循环：回到第一个
		currentIndex.value = 0
	}
	isFlipped.value = false
}

const markKnown = () => {
	nextWord()
}

const markUnknown = () => {
	uni.showToast({ title: '已加入生词本', icon: 'none' })
	nextWord()
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 48rpx 32rpx 32rpx;
	min-height: 100vh;
	background-color: #F5F5F5;
}

.header-row {
	display: flex;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.library-tag {
	font-size: 24rpx;
	color: #6380e8;
	background-color: #f0f3fc;
	padding: 8rpx 16rpx;
	border-radius: 4px;
}

.mode-tag {
	font-size: 24rpx;
	color: #FFFFFF;
	background-color: #6380e8;
	padding: 8rpx 16rpx;
	border-radius: 4px;
}

.progress-row {
	margin-bottom: 32rpx;
}

.progress-text {
	font-size: 24rpx;
	color: #999999;
}

.card-wrap {
	width: 100%;
	height: 640rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.card-wrap:not(.empty) {
	margin-bottom: 48rpx;
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
	border-radius: 4px;
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

.meaning {
	font-size: 32rpx;
	color: #6380e8;
	font-weight: 500;
	margin-bottom: 32rpx;
	text-align: center;
}

.example {
	width: 100%;
	background-color: #F5F5F5;
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
	display: flex;
	gap: 24rpx;
	width: 100%;
}

.btn {
	flex: 1;
	height: 88rpx;
	border-radius: 4px;
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

.quick-hint {
	margin-top: 16rpx;
}

.hint-text {
	font-size: 24rpx;
	color: #CCCCCC;
}
</style>
