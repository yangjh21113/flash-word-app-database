<template>
	<view class="container">
		<view class="header-row">
			<text class="title">生词本</text>
			<text class="count">共 {{ notebook.length }} 个</text>
		</view>

		<view class="empty" v-if="notebook.length === 0">
			<text class="empty-text">还没有生词，点「不认识」自动加入</text>
		</view>

		<view class="word-list" v-else>
			<view
				v-for="(item, idx) in notebook"
				:key="idx"
				class="word-item"
			>
				<view class="word-main">
					<text class="word-text">{{ item.word }}</text>
					<text class="word-phonetic">{{ item.phonetic_us }}</text>
					<text class="word-meaning">{{ item.meaning }}</text>
				</view>
				<view class="word-actions">
					<button class="action-btn master" @click.stop="markMaster(item)">掌握</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getNotebook, removeWord } from '@/utils/notebook.js'

const notebook = ref([])

onMounted(() => {
	loadNotebook()
})

onShow(() => {
	loadNotebook()
})

const loadNotebook = () => {
	notebook.value = getNotebook()
}

const markMaster = (item) => {
	removeWord(item.word)
	notebook.value = getNotebook()
	uni.showToast({ title: '已移出', icon: 'none' })
}
</script>

<style scoped>
.container {
	background-color: #fafafa;
	min-height: 100vh;
	padding: 32rpx;
}

.header-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333333;
}

.count {
	font-size: 24rpx;
	color: #999999;
}

.empty {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 400rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #CCCCCC;
}

.word-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.word-item {
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 4px;
	padding: 24rpx 32rpx;
}

.word-main {
	flex: 1;
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

.word-actions {
	margin-left: 24rpx;
}

.action-btn {
	padding: 8rpx 16rpx;
	border-radius: 4px;
	font-size: 22rpx;
	color: #6380e8;
	border: 1px solid #6380e8;
	height: auto;
	line-height: normal;
	background-color: transparent;
}
</style>
