<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="profile">
			<view class="avatar"></view>
			<text class="username">闪词卡用户</text>
		</view>

		<!-- 学习统计 -->
		<view class="stats">
			<view class="stat-item">
				<text class="stat-num">{{ studyDays }}</text>
				<text class="stat-label">已坚持（天）</text>
			</view>
			<view class="stat-divider"></view>
			<view class="stat-item">
				<text class="stat-num">{{ totalWords }}</text>
				<text class="stat-label">累计单词</text>
			</view>
			<view class="stat-divider"></view>
			<view class="stat-item">
				<text class="stat-num">{{ masteredWords }}</text>
				<text class="stat-label">已掌握</text>
			</view>
		</view>

		<!-- 菜单 -->
		<view class="menu-list">
			<view
				v-for="(item, idx) in menus"
				:key="idx"
				class="menu-item"
				@click="handleMenu(item)"
			>
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

const menus = ref([
	{ name: '学习报告', action: 'report' },
	{ name: '生词本', action: 'notebook' },
	{ name: '设置', action: 'settings' },
	{ name: '关于', action: 'about' },
])

const handleMenu = (item) => {
	uni.showToast({ title: `${item.name}（开发中）`, icon: 'none' })
}
</script>

<style scoped>
.container {
	background-color: #F5F5F5;
	min-height: 100vh;
	padding: 48rpx 32rpx;
}

.profile {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 32rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 4px;
	background-color: #6380e8;
	margin-bottom: 16rpx;
}

.username {
	font-size: 32rpx;
	color: #333333;
	font-weight: 500;
}

.stats {
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 4px;
	padding: 32rpx 0;
	margin-bottom: 32rpx;
}

.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-num {
	font-size: 44rpx;
	font-weight: 600;
	color: #6380e8;
	margin-bottom: 4rpx;
}

.stat-label {
	font-size: 20rpx;
	color: #999999;
}

.stat-divider {
	width: 1px;
	height: 48rpx;
	background-color: #EEEEEE;
}

.menu-list {
	background-color: #FFFFFF;
	border-radius: 4px;
}

.menu-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx;
	border-bottom: 1px solid #F5F5F5;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-name {
	font-size: 28rpx;
	color: #333333;
}

.menu-arrow {
	font-size: 28rpx;
	color: #CCCCCC;
}
</style>
