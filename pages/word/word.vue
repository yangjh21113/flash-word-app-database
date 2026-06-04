<template>
	<view class="container">
		<!-- 当前词库名称 -->
		<view class="library-name">
			<text class="library-tag">{{ currentLibrary }}</text>
		</view>

		<!-- 进度 -->
		<view class="progress-row">
			<text class="progress-text">{{ currentIndex + 1 }} / {{ wordList.length }}</text>
		</view>

		<!-- 闪卡 -->
		<view class="card-wrap" @click="flipCard">
			<view class="card" :class="{ flipped: isFlipped }">
				<!-- 正面 -->
				<view class="card-face front">
					<text class="word">{{ currentWord.word }}</text>
					<text class="phonetic">{{ currentWord.phonetic }}</text>
				</view>
				<!-- 背面 -->
				<view class="card-face back">
					<text class="meaning">{{ currentWord.meaning }}</text>
					<view class="example" v-if="currentWord.example">
						<text class="example-en">{{ currentWord.example.en }}</text>
						<text class="example-zh">{{ currentWord.example.zh }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="actions">
			<button class="btn btn-unknown" @click.stop="markUnknown">不认识</button>
			<button class="btn btn-known" @click.stop="markKnown">认识</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const isFlipped = ref(false)
const currentIndex = ref(0)

// 当前词库
const currentLibrary = ref('老友记')

const wordList = ref([
	{ word: 'pivot', phonetic: '/ˈpɪvət/', meaning: 'n. 枢轴；中心点 v. 以...为中心', example: { en: 'Ross is the pivot of the group.', zh: 'Ross 是这群人的核心。' }},
	{ word: 'sarcastic', phonetic: '/sɑːrˈkæstɪk/', meaning: 'adj. 讽刺的；嘲讽的', example: { en: "Chandler is always sarcastic.", zh: 'Chandler 总是很讽刺。' }},
	{ word: 'obsessed', phonetic: '/əbˈsest/', meaning: 'adj. 着迷的；困扰的', example: { en: "Monica is obsessed with cleaning.", zh: 'Monica 对清洁很着迷。' }},
	{ word: 'awkward', phonetic: '/ˈɔːkwərd/', meaning: 'adj. 尴尬的；笨拙的', example: { en: "That was an awkward silence.", zh: '那是一段尴尬的沉默。' }},
	{ word: 'deliberately', phonetic: '/dɪˈlɪbərətli/', meaning: 'adv. 故意地；蓄意地', example: { en: "He deliberately ignored her.", zh: '他故意无视了她。' }},
])

const currentWord = computed(() => wordList.value[currentIndex.value] || wordList.value[0])

onMounted(() => {
	const lib = uni.getStorageSync('currentLibrary')
	if (lib) {
		currentLibrary.value = lib
	}
})

const flipCard = () => {
	isFlipped.value = !isFlipped.value
}

const nextWord = () => {
	if (currentIndex.value < wordList.value.length - 1) {
		currentIndex.value++
		isFlipped.value = false
	} else {
		uni.showToast({ title: '本轮学习完成', icon: 'success' })
	}
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

.library-name {
	margin-bottom: 16rpx;
}

.library-tag {
	font-size: 24rpx;
	color: #6380e8;
	background-color: #f0f3fc;
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
</style>
