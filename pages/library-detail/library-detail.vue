<template>
	<view class="container">
		<view class="header" v-if="!loading">
			<text class="title">{{ libraryName }}</text>
			<text class="subtitle">共 {{ total }} 个单词</text>
		</view>

		<view class="loading-wrap" v-if="loading">
			<text class="loading-text">加载中...</text>
		</view>

		<view class="word-list" v-else>
			<view
				v-for="(w, idx) in wordList"
				:key="idx"
				class="word-item"
			>
				<view class="word-left">
					<text class="word-text">{{ w.word }}</text>
					<text class="word-meaning">{{ formatMeaning(w) }}</text>
				</view>
				<text class="word-phonetic">{{ w.phonetic_us || w.phonetic_uk || '' }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getWordList } from '@/utils/cloud.js'

const libraryName = ref('')
const libraryId = ref('')
const wordList = ref([])
const total = ref(0)
const loading = ref(true)

const formatMeaning = (w) => {
	if (!w.meaning) return ''
	return w.meaning.zh || w.meaning.en || ''
}

onMounted(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const options = currentPage.options || {}
	libraryId.value = options.id || ''
	libraryName.value = options.name || '词库'
	fetchWords()
})

const fetchWords = async () => {
	loading.value = true
	if (!libraryId.value) {
		loading.value = false
		return
	}
	try {
		const res = await getWordList(libraryId.value, 1, 200)
		wordList.value = res.list || []
		total.value = res.total || wordList.value.length
	} catch (e) {
		console.error('加载单词失败', e)
	} finally {
		loading.value = false
	}
}
</script>

<style scoped>
.container {
	padding: 0 32rpx 32rpx;
	background-color: #F5F5F5;
	min-height: 100vh;
}

.header {
	padding: 32rpx 0 16rpx;
}

.title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333333;
	display: block;
	margin-bottom: 8rpx;
}

.subtitle {
	font-size: 24rpx;
	color: #999999;
}

.loading-wrap {
	display: flex;
	justify-content: center;
	padding-top: 80rpx;
}

.loading-text {
	font-size: 28rpx;
	color: #999999;
}

.word-list {
	padding-top: 16rpx;
}

.word-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #FFFFFF;
	border-radius: 4px;
	padding: 24rpx 32rpx;
	margin-bottom: 16rpx;
}

.word-left {
	flex: 1;
}

.word-text {
	font-size: 32rpx;
	font-weight: 500;
	color: #333333;
	display: block;
	margin-bottom: 4rpx;
}

.word-meaning {
	font-size: 24rpx;
	color: #999999;
	display: block;
}

.word-phonetic {
	font-size: 24rpx;
	color: #6380e8;
}
</style>
