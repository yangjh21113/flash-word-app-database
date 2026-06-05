<template>
	<view class="container">
		<!-- 封面头部 -->
		<view class="cover-header" v-if="!loading && library">
			<view class="cover-img" :style="{ backgroundColor: getCoverColor(library._id) }">
				<text class="cover-letter" :style="{ color: getCoverTextColor(library._id) }">{{ library.name.charAt(0) }}</text>
			</view>
			<view class="cover-info">
				<text class="cover-title">{{ library.name }}</text>
				<text class="cover-meta">{{ library.total }} 词 · {{ library.seasons.length }} 个{{ library.type === 'series' ? '季' : '分类' }}</text>
				<text class="cover-desc">{{ library.desc }}</text>
			</view>
		</view>

		<!-- 加载中 -->
		<view class="loading-wrap" v-if="loading">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 季/分类列表 -->
		<view class="season-list" v-if="!loading && library">
			<view
				v-for="season in library.seasons"
				:key="season._id"
				class="season-item"
				:class="{ selected: season._id === selectedId }"
				@click="goEpisodes(season)"
			>
				<view class="season-info">
					<text class="season-name">{{ season.name }}</text>
					<text class="season-meta">
						{{ season.total }} 词
						<span v-if="season.episodes"> · {{ season.episodes }} 集</span>
					</text>
				</view>
				<view class="season-round" v-if="getSeasonRound(season) > 0">
					<text class="round-text">已背 {{ getSeasonRound(season) }} 轮</text>
				</view>
				<i v-if="season._id === selectedId" class="ri-check-line selected-icon"></i>
				<i class="ri-arrow-right-s-line season-arrow"></i>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getLibraryDetail, getCoverColor, getCoverTextColor } from '@/utils/cloud.js'
import { getRoundInfo } from '@/utils/progress.js'

const library = ref(null)
const loading = ref(true)
const libraryId = ref('')
const libraryType = ref('series')
const selectedId = ref('')

onMounted(() => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const options = currentPage.options || {}
	libraryId.value = options.id || ''
	libraryType.value = options.type || 'series'
	selectedId.value = uni.getStorageSync('currentLibraryId') || ''
	fetchDetail()
})

const fetchDetail = async () => {
	loading.value = true
	if (!libraryId.value) {
		loading.value = false
		return
	}
	try {
		const res = await getLibraryDetail(libraryId.value)
		library.value = res.data
	} catch (e) {
		console.error('加载词库详情失败', e)
	} finally {
		loading.value = false
	}
}

const goEpisodes = (season) => {
	if (libraryType.value === 'series') {
		uni.navigateTo({
			url: `/pages/episode-list/episode-list?seasonId=${season._id}&seasonName=${season.name}&libraryId=${libraryId.value}&libraryName=${library.value.name}`
		})
	} else {
		const parentPath = library.value.name
		uni.navigateTo({
			url: `/pages/word-list/word-list?libId=${season._id}&name=${encodeURIComponent(season.name)}&parent=${encodeURIComponent(parentPath)}`
		})
	}
}

const getSeasonRound = (season) => {
	const info = getRoundInfo(season._id)
	return info.round
}
</script>

<style scoped>
.container {
	background-color: #fafafa;
	min-height: 100vh;
	padding: 0 32rpx 32rpx;
}

.cover-header {
	display: flex;
	padding: 32rpx 0;
}

.cover-img {
	width: 100rpx;
	height: 100rpx;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.cover-letter {
	font-size: 40rpx;
	font-weight: 700;
}

.cover-info {
	flex: 1;
	margin-left: 24rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.cover-title {
	font-size: 34rpx;
	font-weight: 600;
	color: #333333;
	margin-bottom: 6rpx;
}

.cover-meta {
	font-size: 22rpx;
	color: #999999;
	margin-bottom: 8rpx;
}

.cover-desc {
	font-size: 24rpx;
	color: #999999;
	line-height: 1.5;
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

.season-list {
	display: flex;
	flex-direction: column;
}

.season-item {
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 8px;
	padding: 28rpx 32rpx;
	margin-bottom: 16rpx;
}


.season-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.season-name {
	font-size: 28rpx;
	font-weight: 500;
	color: #333333;
	margin-bottom: 6rpx;
}

.season-meta {
	font-size: 22rpx;
	color: #999999;
}

.season-round {
	margin: 0 12rpx;
	padding: 4rpx 12rpx;
	border-radius: 4px;
	background-color: #f0f3fc;
	flex-shrink: 0;
}

.season-round .round-text {
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

.season-arrow {
	font-family: "remixicon";
	font-size: 32rpx;
	color: #CCCCCC;
	flex-shrink: 0;
}
</style>

<style>
.season-arrow,
.selected-icon {
	font-family: "remixicon";
}
</style>
