<template>
	<view class="container">
		<scroll-view class="scroll-view" scroll-y
			refresher-enabled
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh">

			<!-- 头部信息 -->
			<view class="header" v-if="!loading">
				<text class="header-title">{{ seasonName }}</text>
				<text class="header-sub">{{ libraryName }} · 共 {{ episodeList.length }} 集</text>
			</view>

			<!-- 加载中 -->
			<view class="loading-wrap" v-if="loading">
				<text class="loading-text">加载中...</text>
			</view>

			<!-- 剧集列表 -->
			<view class="episode-list" v-if="!loading && episodeList.length > 0">
				<view
					v-for="ep in episodeList"
					:key="ep._id"
					class="episode-item"
					:class="{ selected: ep._id === selectedId }"
					@click="goWordView(ep)"
				>
					<text class="ep-name">{{ ep.name }}</text>
					<text class="ep-meta">{{ ep.total }} 词</text>
					<view class="ep-round" v-if="getEpRound(ep) > 0">
						<text class="round-text">已背 {{ getEpRound(ep) }} 轮</text>
					</view>
					<i v-if="ep._id === selectedId" class="ri-check-line selected-icon"></i>
					<i class="ri-arrow-right-s-line ep-arrow"></i>
				</view>
			</view>

			<!-- 空状态 -->
			<view class="empty-wrap" v-if="!loading && episodeList.length === 0">
				<text class="empty-text">暂无剧集</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getEpisodes, clearGhCache } from '@/utils/cloud.js'
import { getRoundInfo } from '@/utils/progress.js'

const seasonName = ref('')
const libraryName = ref('')
const libraryId = ref('')
const seasonId = ref('')
const episodeList = ref([])
const loading = ref(true)
const selectedId = ref('')
const isRefreshing = ref(false)

onMounted(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const options = currentPage.options || {}
	seasonId.value = options.seasonId || ''
	seasonName.value = decodeURIComponent(options.seasonName || '')
	libraryId.value = options.libraryId || ''
	libraryName.value = decodeURIComponent(options.libraryName || '')
	selectedId.value = uni.getStorageSync('currentLibraryId') || ''
	fetchEpisodes()
})

const fetchEpisodes = async (force = false) => {
	loading.value = true
	if (!seasonId.value) {
		loading.value = false
		return
	}
	try {
		const res = await getEpisodes(seasonId.value, force)
		episodeList.value = res.list || []
	} catch (e) {
		console.error('加载剧集失败', e)
	} finally {
		loading.value = false
	}
}

const onRefresh = async () => {
	isRefreshing.value = true
	clearGhCache()
	try {
		await fetchEpisodes(true)
		uni.showToast({ title: '已更新', icon: 'none', duration: 1500 })
	} catch (e) {
		uni.showToast({ title: '更新失败', icon: 'none' })
	} finally {
		isRefreshing.value = false
	}
}

const goWordView = (ep) => {
	const parentPath = `${libraryName.value}/${seasonName.value}`
	uni.navigateTo({
		url: `/pages/word-list/word-list?libId=${ep._id}&name=${encodeURIComponent(ep.name)}&parent=${encodeURIComponent(parentPath)}`
	})
}

const getEpRound = (ep) => {
	const info = getRoundInfo(ep._id)
	return info.round
}
</script>

<style scoped>
.container {
	background-color: #fafafa;
	min-height: 100vh;
}

.scroll-view {
	min-height: 100vh;
	padding: 0 32rpx 32rpx;
}

.header {
	padding: 32rpx 0 16rpx;
}

.header-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #333333;
	display: block;
	margin-bottom: 6rpx;
}

.header-sub {
	font-size: 22rpx;
	color: #999999;
}

.loading-wrap {
	display: flex;
	justify-content: center;
	padding-top: 80rpx;
}

.loading-text {
	font-size: 28rpx;
	color: #999999;
}

.episode-item {
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 8px;
	padding: 28rpx 32rpx;
	margin-bottom: 16rpx;
}


.ep-name {
	flex: 1;
	font-size: 28rpx;
	font-weight: 500;
	color: #333333;
}

.ep-meta {
	font-size: 22rpx;
	color: #999999;
	margin-right: 16rpx;
}

.ep-round {
	margin-right: 8rpx;
	padding: 4rpx 12rpx;
	border-radius: 4px;
	background-color: #f0f3fc;
	flex-shrink: 0;
}

.ep-round .round-text {
	font-size: 20rpx;
	color: #6380e8;
}

.selected-icon {
	font-family: "remixicon";
	font-size: 36rpx;
	color: #6380e8;
	margin-right: 8rpx;
	flex-shrink: 0;
}

.ep-arrow {
	font-family: "remixicon";
	font-size: 32rpx;
	color: #CCCCCC;
	flex-shrink: 0;
}

.empty-wrap {
	display: flex;
	justify-content: center;
	padding-top: 80rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999999;
}
</style>

<style>
.ep-arrow,
.selected-icon {
	font-family: "remixicon";
}
</style>
