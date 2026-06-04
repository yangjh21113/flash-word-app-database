<template>
	<view class="container">
		<!-- 进度提示 -->
		<view class="progress-header">
			<text class="progress-text">{{ currentIndex + 1 }} / {{ wordList.length }}</text>
		</view>

		<!-- 闪卡区域 -->
		<view class="card-area" @click="flipCard">
			<view class="flash-card" :class="{ flipped: isFlipped }">
				<!-- 正面：英文 -->
				<view class="card-front">
					<text class="word-text">{{ currentWord.word }}</text>
					<text class="word-phonetic">{{ currentWord.phonetic }}</text>
					<text class="flip-hint">点击翻转看释义</text>
				</view>
				<!-- 背面：中文释义 -->
				<view class="card-back">
					<text class="word-meaning">{{ currentWord.meaning }}</text>
					<view class="example-box" v-if="currentWord.example">
						<text class="example-en">{{ currentWord.example.en }}</text>
						<text class="example-zh">{{ currentWord.example.zh }}</text>
					</view>
					<text class="flip-hint">点击翻回正面</text>
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-row">
			<button class="action-btn unknown" @click="markUnknown">不认识</button>
			<button class="action-btn known" @click="markKnown">认识</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'

const isFlipped = ref(false)
const currentIndex = ref(0)

// 示例单词数据
const wordList = ref([
	{ word: 'pivot', phonetic: '/ˈpɪvət/', meaning: 'n. 枢轴；中心点 v. 以...为中心', example: { en: 'Ross is the pivot of the group.', zh: 'Ross 是这群人的核心。' }},
	{ word: 'sarcastic', phonetic: '/sɑːrˈkæstɪk/', meaning: 'adj. 讽刺的；嘲讽的', example: { en: "Chandler is always sarcastic.", zh: 'Chandler 总是很讽刺。' }},
	{ word: 'obsessed', phonetic: '/əbˈsest/', meaning: 'adj. 着迷的；困扰的', example: { en: "Monica is obsessed with cleaning.", zh: 'Monica 对清洁很着迷。' }},
	{ word: 'awkward', phonetic: '/ˈɔːkwərd/', meaning: 'adj. 尴尬的；笨拙的', example: { en: "That was an awkward silence.", zh: '那是一段尴尬的沉默。' }},
	{ word: 'deliberately', phonetic: '/dɪˈlɪbərətli/', meaning: 'adv. 故意地；蓄意地', example: { en: "He deliberately ignored her.", zh: '他故意无视了她。' }},
])

const currentWord = computed(() => wordList.value[currentIndex.value] || wordList.value[0])

const flipCard = () => {
	isFlipped.value = !isFlipped.value
}

const nextWord = () => {
	if (currentIndex.value < wordList.value.length - 1) {
		currentIndex.value++
		isFlipped.value = false
	} else {
		uni.showToast({ title: '本轮学习完成！', icon: 'success' })
		uni.navigateBack()
	}
}

const markKnown = () => {
	nextWord()
}

const markUnknown = () => {
	// 加入生词本逻辑（后续实现）
	uni.showToast({ title: '已加入生词本', icon: 'none' })
	nextWord()
}
</script>

<style scoped>
.container {
	background: linear-gradient(180deg, #F5F3FF 0%, #F5F5F5 100%);
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 24rpx;
}

.progress-header {
	width: 100%;
	display: flex;
	justify-content: center;
	margin: 20rpx 0;
}

.progress-text {
	font-size: 26rpx;
	color: #999999;
}

.card-area {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-height: 800rpx;
}

.flash-card {
	width: 90%;
	height: 600rpx;
	position: relative;
	transition: transform 0.6s;
	transform-style: preserve-3d;
}

.flash-card.flipped .card-front {
	display: none;
}

.flash-card.flipped .card-back {
	display: flex;
}

.card-front, .card-back {
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 32rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40rpx;
	box-sizing: border-box;
}

.card-front {
	background: #FFFFFF;
	box-shadow: 0 8rpx 32rpx rgba(99, 102, 241, 0.15);
}

.card-back {
	background: #FFFFFF;
	box-shadow: 0 8rpx 32rpx rgba(139, 92, 246, 0.15);
	display: none;
}

.word-text {
	font-size: 56rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 16rpx;
}

.word-phonetic {
	font-size: 28rpx;
	color: #999999;
	margin-bottom: 40rpx;
}

.word-meaning {
	font-size: 34rpx;
	color: #6366F1;
	text-align: center;
	margin-bottom: 32rpx;
	font-weight: 500;
}

.example-box {
	width: 100%;
	background: #F9FAFB;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
}

.example-en {
	display: block;
	font-size: 26rpx;
	color: #333333;
	margin-bottom: 8rpx;
}

.example-zh {
	display: block;
	font-size: 22rpx;
	color: #999999;
}

.flip-hint {
	font-size: 22rpx;
	color: #CCCCCC;
	position: absolute;
	bottom: 32rpx;
}

.action-row {
	display: flex;
	gap: 24rpx;
	padding: 32rpx 0 60rpx;
	width: 90%;
}

.action-btn {
	flex: 1;
	height: 88rpx;
	border-radius: 44rpx;
	font-size: 32rpx;
	border: none;
}

.action-btn.unknown {
	background: #FEE2E2;
	color: #EF4444;
}

.action-btn.known {
	background: #6366F1;
	color: #FFFFFF;
}
</style>
