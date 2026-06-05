<template>
	<view class="container">
		<view class="header-row">
			<view class="header-left" v-if="notebook.length > 0">
				<text class="title">生词本</text>
				<text class="count">共 {{ notebook.length }} 词</text>
			</view>
			<text class="title" v-else>生词本</text>
			<view class="header-right" v-if="notebook.length > 0">
				<view class="reset-btn" @click="showResetDialog = true">
					<i class="reset-ico ri-restart-line"></i>
				</view>
			</view>
		</view>

		<view class="empty" v-if="notebook.length === 0">
			<text class="empty-text">还没有生词，在闪记中点「不认识」自动加入</text>
			<button class="go-flash-btn" @click="goFlashCard">
				<i class="go-flash-icon ri-flashlight-line"></i>
				<text>去闪记</text>
			</button>
		</view>

		<view class="word-list" v-else>
			<view
				v-for="(item, idx) in notebook"
				:key="idx"
				class="word-item"
			>
				<view class="word-main">
					<text class="word-text">{{ item.word }}</text>
					<text class="word-source" v-if="item.source">来自 {{ item.source }}</text>
					<text class="word-phonetic">{{ item.phonetic_us }}</text>
					<text class="word-meaning">{{ item.meaning }}</text>
				</view>
				<view class="word-actions">
					<button class="action-btn master" @click.stop="markMaster(item)">掌握</button>
				</view>
			</view>
		</view>

		<view class="footer-btn" v-if="notebook.length > 0">
			<button class="start-btn" @click="startStudy">
				<i class="start-icon ri-flashlight-line"></i>
				<text>开始闪记</text>
			</button>
		</view>

		<!-- 重置确认弹框 -->
		<view class="reset-dialog-mask" v-if="showResetDialog" @click="showResetDialog = false">
			<view class="reset-dialog" @click.stop>
				<view class="reset-dialog-title">
					<text class="reset-title">清空生词本</text>
					<text class="reset-desc">生词本中的 {{ notebook.length }} 个单词将被清除。</text>
				</view>
				<view class="reset-dialog-actions">
					<view class="reset-action cancel" @click="showResetDialog = false">
						<text>取消</text>
					</view>
					<view class="reset-action confirm" @click="clearAll">
						<text>清空</text>
					</view>
					<view class="reset-action round" @click="goFlashCard">
						<text>去闪记</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getNotebook, removeWord, clearNotebook } from '@/utils/notebook.js'

const notebook = ref([])
const showResetDialog = ref(false)

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

const startStudy = () => {
	const words = notebook.value.map(w => ({
		word: w.word,
		phonetic_us: w.phonetic_us || '',
		phonetic_uk: w.phonetic_uk || '',
		meaning: w.meaning ? { zh: w.meaning } : {},
		examples: [],
		source: w.source || ''
	}))
	uni.setStorageSync('currentLibraryId', 'notebook')
	uni.setStorageSync('currentLibrary', '生词本')
	uni.setStorageSync('notebookWords', JSON.stringify(words))
	uni.$emit('libraryChanged')
	uni.switchTab({ url: '/pages/word/word' })
}

const clearAll = () => {
	clearNotebook()
	notebook.value = []
	showResetDialog.value = false
	uni.setStorageSync('notebookWords', '[]')
	uni.$emit('libraryChanged')
	uni.showToast({ title: '已清空', icon: 'success' })
}

const goFlashCard = () => {
	showResetDialog.value = false
	startStudy()
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

.header-right {
	display: flex;
	align-items: center;
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

.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 400rpx;
	padding-top: 100rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #CCCCCC;
}

.go-flash-btn {
	margin-top: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 20rpx 64rpx;
	border-radius: 999px;
	background-color: #6380e8;
	color: #FFFFFF;
	font-size: 28rpx;
	border: none;
	height: auto;
	line-height: normal;
}

.go-flash-icon {
	font-family: "remixicon";
	font-size: 32rpx;
	color: #FFFFFF;
}

.word-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	overflow: auto;
	flex-grow: 1;
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

.word-source {
	font-size: 22rpx;
	color: #999999;
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

/* 重置弹框 */
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

.reset-action.round text {
	color: #6380e8;
}

.reset-action.cancel {
	border-right: 1px solid #F5F5F5;
}

.reset-action.confirm {
	border-right: 1px solid #F5F5F5;
}
</style>

<style>
.start-icon,
.reset-ico,
.go-flash-icon {
	font-family: "remixicon";
}
</style>
