<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="profile" @click="handleProfile">
			<image class="avatar" src="/static/avatar.png" mode="aspectFill"></image>
			<view class="profile-info">
				<text class="username">闪词卡用户</text>
				<text class="user-id">ID: 000000</text>
			</view>
		</view>

		<!-- 学习统计 -->
		<view class="stats">
			<view class="stat-item">
				<text class="stat-num">{{ studyDays }}</text>
				<text class="stat-label">已坚持（天）</text>
			</view>
			<view class="stat-divider"></view>
			<view class="stat-item">
				<text class="stat-num">{{ todayNotebook }}</text>
				<text class="stat-label">今日生词</text>
			</view>
			<view class="stat-divider"></view>
			<view class="stat-item">
				<text class="stat-num">{{ masteredWords }}</text>
				<text class="stat-label">已掌握</text>
			</view>
		</view>

		<!-- 学习模式 -->
		<view class="mode-card">
			<view class="section-title-row">
				<i class="ri-book-marked-line section-icon"></i>
				<text class="section-title">学习模式</text>
			</view>
			<view class="mode-options">
				<view
					class="mode-item"
					:class="{ active: mode === 'fast' }"
					@click="switchMode('fast')"
				>
					<view class="mode-icon"><i class="ri-flashlight-line"></i></view>
					<text class="mode-name">快速模式</text>
					<text class="mode-desc">点卡翻页，无限循环</text>
					<view class="mode-check" v-if="mode === 'fast'"></view>
				</view>
				<view
					class="mode-item"
					:class="{ active: mode === 'deep' }"
					@click="switchMode('deep')"
				>
					<view class="mode-icon"><i class="ri-book-open-line"></i></view>
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
				<view class="menu-left">
					<i :class="['menu-icon', item.icon]"></i>
					<text class="menu-name">{{ item.name }}</text>
				</view>
				<view class="menu-right">
					<text class="menu-badge" v-if="item.badge">{{ item.badge }}</text>
					<i class="ri-arrow-right-s-line menu-arrow"></i>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getNotebook, getTodayNotebookCount } from '@/utils/notebook.js'
import { getStudyDays } from '@/utils/study.js'

const studyDays = ref(0)
const masteredWords = ref(120)
const todayNotebook = ref(0)
const mode = ref('deep')

const menus = ref([
	{ name: '生词本', action: 'notebook', icon: 'ri-edit-line', badge: '' },
	{ name: '设置', action: 'settings', icon: 'ri-settings-3-line', badge: '' },
	{ name: '关于', action: 'about', icon: 'ri-information-line', badge: '' },
])

onMounted(() => {
	const saved = uni.getStorageSync('studyMode')
	if (saved === 'fast' || saved === 'deep') {
		mode.value = saved
	}
	loadStats()
})

onShow(() => {
	loadStats()
})

const loadStats = () => {
	studyDays.value = getStudyDays()
	todayNotebook.value = getTodayNotebookCount()
	menus.value = menus.value.map(item => {
		if (item.action === 'notebook') {
			const total = getNotebook().length
			item.badge = total > 0 ? `${total}` : ''
		}
		return item
	})
}

const switchMode = (m) => {
	mode.value = m
	uni.setStorageSync('studyMode', m)
	uni.showToast({ title: m === 'fast' ? '快速模式' : '深度记忆', icon: 'none' })
}

const handleMenu = (item) => {
	if (item.action === 'notebook') {
		uni.navigateTo({ url: '/pages/notebook/notebook' })
	} else {
		uni.showToast({ title: `${item.name}（开发中）`, icon: 'none' })
	}
}

const handleProfile = () => {
	uni.showToast({ title: '个人资料（开发中）', icon: 'none' })
}
</script>

<style scoped>
.container {
	background-color: #fafafa;
	min-height: 100vh;
	padding: 32rpx;
}

.profile {
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 8px;
	padding: 32rpx;
	margin-bottom: 24rpx;
}

.avatar {
	width: 82rpx;
	height: 82rpx;
	border-radius: 10px;
}

.profile-info {
	flex: 1;
	margin-left: 24rpx;
	display: flex;
	flex-direction: column;
}

.username {
	font-size: 32rpx;
	color: #333333;
	font-weight: 600;
	margin-bottom: 4rpx;
}

.user-id {
	font-size: 22rpx;
	color: #999999;
}

.stats {
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 8px;
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
	font-size: 44rpx;
	font-weight: 600;
	color: #333333;
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

.section-title-row {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 24rpx;
}

.section-icon {
	font-size: 30rpx;
	color: #6380e8;
}

.section-title {
	font-size: 28rpx;
	color: #333333;
}

.mode-card {
	background-color: #FFFFFF;
	border-radius: 8px;
	padding: 32rpx;
	margin-bottom: 24rpx;
}

.mode-options {
	display: flex;
	gap: 24rpx;
}

.mode-item {
	flex: 1;
	position: relative;
	border: 1px solid #EEEEEE;
	border-radius: 8px;
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
	color: #6380e8;
	display: flex;
	align-items: center;
	justify-content: center;
}

.mode-icon i {
	font-size: 48rpx;
}

.mode-name {
	font-size: 28rpx;
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
	border-radius: 8px;
}

.menu-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 32rpx;
	border-bottom: 1px solid #F5F5F5;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-left {
	display: flex;
	align-items: center;
}

.menu-icon {
	font-size: 36rpx;
	color: #6380e8;
	margin-right: 16rpx;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.menu-icon::before {
	font-size: 36rpx;
	line-height: 1;
}

.menu-name {
	font-size: 28rpx;
	color: #333333;
}

.menu-right {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.menu-badge {
	font-size: 20rpx;
	color: #FFFFFF;
	background-color: #6380e8;
	padding: 2rpx 12rpx;
	border-radius: 4px;
	min-width: 32rpx;
	text-align: center;
}

.menu-arrow {
	font-family: "remixicon";
	font-size: 32rpx;
	color: #CCCCCC;
	display: inline-block;
	line-height: 1;
}
</style>

<style>
/* 图标定义 — 非 scoped，确保 ::before 能匹配 */
.section-icon,
.mode-icon i,
.menu-icon,
.menu-arrow {
	font-family: "remixicon";
	display: inline-block;
	line-height: 1;
}
</style>
