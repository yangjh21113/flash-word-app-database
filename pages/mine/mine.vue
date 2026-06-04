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

		<!-- 学习模式 -->
		<view class="mode-card">
			<text class="section-title">学习模式</text>
			<view class="mode-options">
				<view
					class="mode-item"
					:class="{ active: mode === 'fast' }"
					@click="switchMode('fast')"
				>
					<view class="mode-icon">⚡</view>
					<text class="mode-name">快速模式</text>
					<text class="mode-desc">点卡翻页，无限循环</text>
					<view class="mode-check" v-if="mode === 'fast'"></view>
				</view>
				<view
					class="mode-item"
					:class="{ active: mode === 'deep' }"
					@click="switchMode('deep')"
				>
					<view class="mode-icon">📖</view>
					<text class="mode-name">深度记忆</text>
					<text class="mode-desc">标记认识/不认识</text>
					<view class="mode-check" v-if="mode === 'deep'"></view>
				</view>
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
import { ref, onMounted } from 'vue'

const studyDays = ref(12)
const totalWords = ref(450)
const masteredWords = ref(120)
const mode = ref('deep')

const menus = ref([
	{ name: '学习报告', action: 'report' },
	{ name: '生词本', action: 'notebook' },
	{ name: '设置', action: 'settings' },
	{ name: '关于', action: 'about' },
])

onMounted(() => {
	const saved = uni.getStorageSync('studyMode')
	if (saved === 'fast' || saved === 'deep') {
		mode.value = saved
	}
})

const switchMode = (m) => {
	mode.value = m
	uni.setStorageSync('studyMode', m)
	uni.showToast({ title: m === 'fast' ? '快速模式' : '深度记忆', icon: 'none' })
}

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

.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 24rpx;
	display: block;
}

.mode-card {
	background-color: #FFFFFF;
	border-radius: 4px;
	padding: 32rpx;
	margin-bottom: 32rpx;
}

.mode-options {
	display: flex;
	gap: 24rpx;
}

.mode-item {
	flex: 1;
	position: relative;
	background-color: #F5F5F5;
	border-radius: 4px;
	padding: 32rpx 24rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: all 0.2s;
}

.mode-item.active {
	background-color: #f0f3fc;
	border: 2rpx solid #6380e8;
}

.mode-icon {
	font-size: 48rpx;
	margin-bottom: 12rpx;
}

.mode-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 8rpx;
}

.mode-desc {
	font-size: 20rpx;
	color: #999999;
	text-align: center;
}

.mode-check {
	position: absolute;
	top: 12rpx;
	right: 12rpx;
	width: 32rpx;
	height: 32rpx;
	background-color: #6380e8;
	border-radius: 50%;
}

.mode-check::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 12rpx;
	height: 8rpx;
	border-left: 3rpx solid #FFFFFF;
	border-bottom: 3rpx solid #FFFFFF;
	transform: translate(-50%, -60%) rotate(-45deg);
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
