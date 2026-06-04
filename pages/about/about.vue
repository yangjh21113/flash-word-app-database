<template>
	<view class="container">
		<!-- 应用信息 -->
		<view class="app-header">
			<image class="app-logo" src="/static/avatar.png" mode="aspectFill"></image>
			<text class="app-name">闪词卡</text>
			<text class="app-version">v{{ version }}</text>
		</view>

		<!-- 介绍 -->
		<view class="section">
			<text class="section-title">应用介绍</text>
			<text class="section-desc">闪词卡是一款轻量级背单词工具，支持快速浏览和深度记忆两种学习模式。词库来源于经典美剧场景词汇，帮助你在真实语境中高效记单词。</text>
		</view>

		<!-- 功能列表 -->
		<view class="section">
			<text class="section-title">核心功能</text>
			<view class="feature-list">
				<view class="feature-item" v-for="(item, idx) in features" :key="idx">
					<i :class="['feature-icon', item.icon]"></i>
					<view class="feature-info">
						<text class="feature-name">{{ item.name }}</text>
						<text class="feature-desc">{{ item.desc }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 开源声明 -->
		<view class="section">
			<text class="section-title">开源声明</text>
			<view class="notice-item">
				<text class="notice-label">图标库</text>
				<text class="notice-text">Remix Icon v4.6.0（Apache License 2.0）</text>
			</view>
		</view>

		<!-- 底部 -->
		<view class="footer">
			<text class="footer-text">Made with 闪词卡团队</text>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const version = ref('1.0.0')

const features = ref([
	{ name: '快速模式', desc: '点卡翻页，无限循环，适合高频浏览', icon: 'ri-flashlight-line' },
	{ name: '深度记忆', desc: '标记认识/不认识，自动加入生词本', icon: 'ri-book-open-line' },
	{ name: '美剧词库', desc: '生活大爆炸、老友记等经典场景词汇', icon: 'ri-movie-2-line' },
	{ name: '生词本', desc: '自动收录不认识单词，随时复习', icon: 'ri-edit-line' },
	{ name: '学习统计', desc: '记录连续学习天数，追踪进度', icon: 'ri-line-chart-line' },
])
</script>

<style scoped>
.container {
	background-color: #FAFAFA;
	min-height: 100vh;
	padding: 32rpx;
}

.app-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 64rpx 0 48rpx;
}

.app-logo {
	width: 128rpx;
	height: 128rpx;
	border-radius: 24px;
	margin-bottom: 24rpx;
}

.app-name {
	font-size: 36rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 8rpx;
}

.app-version {
	font-size: 24rpx;
	color: #999999;
}

.section {
	background-color: #FFFFFF;
	border-radius: 8px;
	padding: 32rpx;
	margin-bottom: 24rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #333333;
	display: block;
	margin-bottom: 20rpx;
}

.section-desc {
	font-size: 26rpx;
	color: #666666;
	line-height: 1.6;
}

.feature-list {
	display: flex;
	flex-direction: column;
}

.feature-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1px solid #F5F5F5;
}

.feature-item:last-child {
	border-bottom: none;
	padding-bottom: 0;
}

.feature-item:first-child {
	padding-top: 0;
}

.feature-icon {
	font-family: "remixicon";
	font-size: 40rpx;
	color: #6380e8;
	margin-right: 24rpx;
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.feature-info {
	display: flex;
	flex-direction: column;
}

.feature-name {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
	margin-bottom: 4rpx;
}

.feature-desc {
	font-size: 22rpx;
	color: #999999;
}

.notice-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 0;
}

.notice-label {
	font-size: 26rpx;
	color: #666666;
}

.notice-text {
	font-size: 24rpx;
	color: #999999;
}

.footer {
	text-align: center;
	padding: 48rpx 0;
}

.footer-text {
	font-size: 22rpx;
	color: #CCCCCC;
}
</style>

<style>
.feature-icon {
	font-family: "remixicon";
}
</style>
