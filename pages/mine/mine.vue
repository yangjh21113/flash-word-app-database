<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="profile-card">
			<view class="avatar">⚡</view>
			<text class="username">闪词卡用户</text>
			<text class="signup-days">已坚持 {{ studyDays }} 天</text>
		</view>

		<!-- 学习统计 -->
		<view class="stats-row">
			<view class="stat-item">
				<text class="stat-num">{{ totalWords }}</text>
				<text class="stat-label">累计单词</text>
			</view>
			<view class="stat-item">
				<text class="stat-num">{{ masteredWords }}</text>
				<text class="stat-label">已掌握</text>
			</view>
			<view class="stat-item">
				<text class="stat-num">{{ todayWords }}</text>
				<text class="stat-label">今日学习</text>
			</view>
		</view>

		<!-- 菜单列表 -->
		<view class="menu-list">
			<view class="menu-item" v-for="(item, idx) in menus" :key="idx" @click="handleMenu(item)">
				<text class="menu-icon">{{ item.icon }}</text>
				<text class="menu-name">{{ item.name }}</text>
				<text class="menu-arrow">></text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const studyDays = ref(12)
const totalWords = ref(450)
const masteredWords = ref(120)
const todayWords = ref(15)

const menus = ref([
	{ icon: '📊', name: '学习报告', action: 'report' },
	{ icon: '🔖', name: '我的收藏', action: 'favorites' },
	{ icon: '📝', name: '生词本', action: 'notebook' },
	{ icon: '⚙️', name: '设置', action: 'settings' },
])

const handleMenu = (item) => {
	uni.showToast({ title: `${item.name}（开发中）`, icon: 'none' })
}
</script>

<style scoped>
.container {
	background-color: #F5F5F5;
	min-height: 100vh;
	padding: 24rpx;
}

.profile-card {
	background: linear-gradient(135deg, #6366F1, #8B5CF6);
	border-radius: 24rpx;
	padding: 48rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 24rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	background: rgba(255,255,255,0.3);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 56rpx;
	margin-bottom: 16rpx;
}

.username {
	font-size: 34rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin-bottom: 8rpx;
}

.signup-days {
	font-size: 24rpx;
	color: rgba(255,255,255,0.7);
}

.stats-row {
	display: flex;
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx 0;
	margin-bottom: 24rpx;
}

.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-num {
	font-size: 40rpx;
	font-weight: bold;
	color: #6366F1;
	margin-bottom: 8rpx;
}

.stat-label {
	font-size: 22rpx;
	color: #999999;
}

.menu-list {
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 0 32rpx;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 32rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-icon {
	font-size: 36rpx;
	margin-right: 20rpx;
}

.menu-name {
	flex: 1;
	font-size: 30rpx;
	color: #333333;
}

.menu-arrow {
	font-size: 28rpx;
	color: #CCCCCC;
}
</style>
