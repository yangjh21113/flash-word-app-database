<template>
	<view class="container">
		<text class="page-title">词库</text>
		<view class="library-grid">
			<view
				v-for="(cat, idx) in categories"
				:key="idx"
				class="library-card"
				@click="enterLibrary(cat)"
			>
				<view class="card-icon">{{ cat.icon }}</view>
				<text class="card-name">{{ cat.name }}</text>
				<text class="card-desc">{{ cat.desc }}</text>
				<view class="card-progress">
					<text class="progress-text">已学 {{ cat.learned }}/{{ cat.total }}</text>
					<view class="progress-bar">
						<view class="progress-fill" :style="{ width: cat.percent + '%' }"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
	{ icon: '📺', name: '老友记', desc: 'Friends 全十季高频词', total: 1200, learned: 320, percent: 27 },
	{ icon: '🧪', name: '生活大爆炸', desc: 'The Big Bang Theory', total: 950, learned: 180, percent: 19 },
	{ icon: '🐉', name: '权力的游戏', desc: 'Game of Thrones', total: 1500, learned: 50, percent: 3 },
	{ icon: '🔦', name: '怪奇物语', desc: 'Stranger Things', total: 800, learned: 0, percent: 0 },
	{ icon: '👔', name: '职场英语', desc: '商务场景常用词', total: 600, learned: 200, percent: 33 },
	{ icon: '🎬', name: '漫威电影', desc: 'Marvel 系列高频词', total: 500, learned: 100, percent: 20 },
])

const enterLibrary = (cat) => {
	uni.showToast({ title: `进入 ${cat.name}`, icon: 'none' })
}
</script>

<style scoped>
.container {
	padding: 24rpx;
	background-color: #F5F5F5;
	min-height: 100vh;
}

.page-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 24rpx;
	display: block;
}

.library-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.library-card {
	width: calc(50% - 10rpx);
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 28rpx;
	box-sizing: border-box;
}

.card-icon {
	font-size: 56rpx;
	margin-bottom: 12rpx;
}

.card-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
	display: block;
	margin-bottom: 4rpx;
}

.card-desc {
	font-size: 22rpx;
	color: #999999;
	display: block;
	margin-bottom: 20rpx;
}

.card-progress {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.progress-text {
	font-size: 20rpx;
	color: #6366F1;
}

.progress-bar {
	width: 100%;
	height: 8rpx;
	background: #F0F0F0;
	border-radius: 4rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: #6366F1;
	border-radius: 4rpx;
}
</style>
