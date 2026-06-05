<template>
	<view class="container">
		<view class="header-row" v-if="!loading">
			<view class="header-left">
				<text class="parent-path" v-if="parentPath">{{ parentPath }}</text>
				<text class="title">{{ listName }}</text>
				<text class="count">共 {{ wordList.length }} 词</text>
			</view>
			<view class="round-tag" v-if="round > 0">
				<i class="round-icon ri-book-marked-line"></i>
				<text class="round-text">已背 {{ round }} 轮</text>
			</view>
		</view>

		<view class="loading-wrap" v-if="loading">
			<text class="loading-text">加载中...</text>
		</view>

		<view class="empty" v-if="!loading && wordList.length === 0">
			<text class="empty-text">暂无单词</text>
		</view>

		<view class="word-list" v-if="!loading && wordList.length > 0">
			<view
				v-for="(item, idx) in wordList"
				:key="idx"
				class="word-item"
			>
				<view class="word-main">
					<text class="word-text">{{ item.word }}</text>
					<text class="word-phonetic">{{ item.phonetic_us || item.phonetic_uk }}</text>
					<text class="word-meaning">{{ formatMeaning(item) }}</text>
				</view>
			</view>
		</view>

		<view class="footer-btn" v-if="!loading && wordList.length > 0">
			<button class="start-btn" @click="startStudy">
				<i class="start-icon ri-flashlight-line"></i>
				<text>开始闪记</text>
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getWordList } from '@/utils/cloud.js'
import { getRoundInfo } from '@/utils/progress.js'

const listName = ref('')
const wordList = ref([])
const loading = ref(true)
const libId = ref('')
const parentPath = ref('')

const round = computed(() => {
	return getRoundInfo(libId.value).round
})

const flippedCount = computed(() => {
	return getRoundInfo(libId.value).flippedCount
})

onMounted(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const options = currentPage.options || {}
	libId.value = options.libId || ''
	listName.value = decodeURIComponent(options.name || '单词列表')
	parentPath.value = decodeURIComponent(options.parent || '')
	fetchWords()
})

const fetchWords = async () => {
	loading.value = true
	if (!libId.value) {
		loading.value = false
		return
	}
	try {
		const res = await getWordList(libId.value, 1, 100)
		wordList.value = res.list || []
	} catch (e) {
		console.error('加载单词失败', e)
	} finally {
		loading.value = false
	}
}

const formatMeaning = (w) => {
	if (!w.meaning) return ''
	return w.meaning.zh || w.meaning.en || ''
}

const startStudy = () => {
	const fullName = parentPath.value ? `${parentPath.value}/${listName.value}` : listName.value
	uni.setStorageSync('currentLibraryId', libId.value)
	uni.setStorageSync('currentLibrary', fullName)
	uni.$emit('libraryChanged')
	uni.switchTab({ url: '/pages/word/word' })
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	background-color: #fafafa;
	height: 100vh;
	padding: 0 32rpx;
	overflow: hidden;
}

.header-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 0rpx;
	background-color: #fafafa;
	z-index: 10;
}

.header-left {
	display: flex;
	flex-direction: column;
}

.parent-path {
	font-size: 22rpx;
	color: #999999;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 500rpx;
	margin-bottom: 2rpx;
}

.title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 4rpx;
}

.count {
	font-size: 22rpx;
	color: #999999;
}

.round-tag {
	display: flex;
	align-items: center;
	gap: 4rpx;
	padding: 6rpx 16rpx;
	border-radius: 999px;
	background-color: #f0f3fc;
}

.round-icon {
	font-family: "remixicon";
	font-size: 26rpx;
	color: #6380e8;
	line-height: 1;
}

.round-text {
	font-size: 22rpx;
	color: #6380e8;
}

.loading-wrap {
	display: flex;
	justify-content: center;
	padding-top: 80rpx;
	flex: 1;
}

.loading-text {
	font-size: 28rpx;
	color: #999999;
}

.empty {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 400rpx;
	padding-top: 100rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #CCCCCC;
}

.word-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	overflow: auto;
	flex-grow: 1;
}

.word-item {
	background-color: #FFFFFF;
	border-radius: 4px;
	padding: 24rpx 32rpx;
}

.word-main {
	display: flex;
	flex-direction: column;
}

.word-text {
	font-size: 32rpx;
	font-weight: 500;
	color: #333333;
	margin-bottom: 4rpx;
}

.word-phonetic {
	font-size: 22rpx;
	color: #999999;
	margin-bottom: 4rpx;
}

.word-meaning {
	font-size: 24rpx;
	color: #6380e8;
}

.footer-btn {
	padding: 20rpx 32rpx 48rpx;
	background-color: #fafafa;
	border-top: 1px solid #EEEEEE;
}

.start-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 28rpx;
	border-radius: 999px;
	background-color: #6380e8;
	color: #FFFFFF;
	font-size: 32rpx;
	border: none;
	height: auto;
	line-height: normal;
	width: 100%;
}

.start-icon {
	font-family: "remixicon";
	font-size: 36rpx;
	color: #FFFFFF;
}
</style>

<style>
.start-icon,
.round-icon {
	font-family: "remixicon";
}
</style>
