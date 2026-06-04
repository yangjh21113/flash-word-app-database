<template>
	<view class="container">
		<view class="header">
			<text class="title">{{ libraryName }}</text>
			<text class="subtitle">共 {{ wordList.length }} 个单词</text>
		</view>

		<view class="word-list">
			<view
				v-for="(w, idx) in wordList"
				:key="idx"
				class="word-item"
			>
				<view class="word-left">
					<text class="word-text">{{ w.word }}</text>
					<text class="word-meaning">{{ w.meaning }}</text>
				</view>
				<text class="word-phonetic">{{ w.phonetic }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const libraryName = ref('')
const wordList = ref([])

onMounted(() => {
	// 从路由参数获取词库信息（后续替换为接口请求）
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const options = currentPage.options || {}
	libraryName.value = options.name || '词库'

	// 示例数据
	wordList.value = [
		{ word: 'pivot', phonetic: '/ˈpɪvət/', meaning: 'n. 枢轴；中心点' },
		{ word: 'sarcastic', phonetic: '/sɑːrˈkæstɪk/', meaning: 'adj. 讽刺的' },
		{ word: 'obsessed', phonetic: '/əbˈsest/', meaning: 'adj. 着迷的' },
		{ word: 'awkward', phonetic: '/ˈɔːkwərd/', meaning: 'adj. 尴尬的' },
		{ word: 'deliberately', phonetic: '/dɪˈlɪbərətli/', meaning: 'adv. 故意地' },
		{ word: 'reluctant', phonetic: '/rɪˈlʌktənt/', meaning: 'adj. 不情愿的' },
		{ word: 'phenomenon', phonetic: '/fɪˈnɒmɪnən/', meaning: 'n. 现象' },
		{ word: 'inevitable', phonetic: '/ɪnˈevɪtəbl/', meaning: 'adj. 不可避免的' },
	]
})
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
