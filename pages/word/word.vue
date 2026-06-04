<template>
	<view class="container">
		<!-- 今日学习卡片 -->
		<view class="today-card" @click="startFlash">
			<view class="today-header">
				<text class="today-title">今日闪记</text>
				<text class="today-count">{{ todayCount }}/20</text>
			</view>
			<view class="progress-bar">
				<view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
			</view>
			<text class="today-hint">点击开始闪记</text>
		</view>

		<!-- 词库选择 -->
		<view class="section">
			<text class="section-title">选择词库</text>
			<view class="library-list">
				<view
					v-for="(lib, idx) in libraries"
					:key="idx"
					class="library-item"
					:class="{ active: lib.id === currentLibId }"
					@click="selectLibrary(lib)"
				>
					<text class="library-icon">{{ lib.icon }}</text>
					<view class="library-info">
						<text class="library-name">{{ lib.name }}</text>
						<text class="library-desc">{{ lib.desc }}</text>
					</view>
					<text class="library-count">{{ lib.total }}词</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'

const todayCount = ref(5)
const currentLibId = ref('friends')
const libraries = ref([
	{ id: 'friends', icon: '📺', name: '老友记', desc: '经典美剧高频词汇', total: 120 },
	{ id: 'bigbang', icon: '🧪', name: '生活大爆炸', desc: '科学与日常结合', total: 95 },
	{ id: 'got', icon: '🐉', name: '权力的游戏', desc: '奇幻史诗词汇', total: 150 },
	{ id: 'stranger', icon: '🔦', name: '怪奇物语', desc: '80年代复古词汇', total: 80 },
])

const progressPercent = computed(() => Math.round((todayCount.value / 20) * 100))

const selectLibrary = (lib) => {
	currentLibId.value = lib.id
	uni.showToast({ title: `已选择：${lib.name}`, icon: 'none' })
}

const startFlash = () => {
	uni.navigateTo({ url: '/pages/library/library' })
}
</script>

<style scoped>
.container {
	padding: 24rpx;
	background-color: #F5F5F5;
	min-height: 100vh;
}

.today-card {
	background: linear-gradient(135deg, #6366F1, #8B5CF6);
	border-radius: 24rpx;
	padding: 40rpx;
	margin-bottom: 32rpx;
}

.today-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.today-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #FFFFFF;
}

.today-count {
	font-size: 28rpx;
	color: rgba(255,255,255,0.8);
}

.progress-bar {
	width: 100%;
	height: 12rpx;
	background: rgba(255,255,255,0.3);
	border-radius: 6rpx;
	overflow: hidden;
	margin-bottom: 16rpx;
}

.progress-fill {
	height: 100%;
	background: #FFFFFF;
	border-radius: 6rpx;
	transition: width 0.3s;
}

.today-hint {
	font-size: 24rpx;
	color: rgba(255,255,255,0.7);
}

.section {
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 20rpx;
	display: block;
}

.library-item {
	display: flex;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
}

.library-item:last-child {
	border-bottom: none;
}

.library-item.active {
	background: #F5F3FF;
	margin: 0 -24rpx;
	padding-left: 24rpx;
	padding-right: 24rpx;
	border-radius: 12rpx;
}

.library-icon {
	font-size: 48rpx;
	margin-right: 20rpx;
}

.library-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.library-name {
	font-size: 30rpx;
	color: #333333;
	font-weight: 500;
}

.library-desc {
	font-size: 22rpx;
	color: #999999;
	margin-top: 4rpx;
}

.library-count {
	font-size: 24rpx;
	color: #6366F1;
	font-weight: bold;
}
</style>
