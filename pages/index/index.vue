<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<i class="search-icon ri-search-line"></i>
			<input
				class="search-input"
				placeholder="搜索词库..."
				:value="keyword"
				@input="onSearch"
			/>
		</view>

		<!-- 分类 Tab -->
		<scroll-view class="tab-scroll" scroll-x>
			<view class="tab-group">
				<view
					v-for="cat in categories"
					:key="cat.key"
					class="tab-item"
					:class="{ active: activeCategory === cat.key }"
					@click="switchCategory(cat.key)"
				>
					<text class="tab-text">{{ cat.name }}</text>
				</view>
			</view>
		</scroll-view>

		<!-- 词库列表 -->
		<scroll-view class="content" scroll-y :show-scrollbar="false"
			refresher-enabled
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh">
			<view v-if="!loading">
				<block v-for="group in filteredLibraries" :key="group.category">
					<view class="section-header" v-if="activeCategory === 'all' && showSectionHeader(group)">
						<text class="section-title">{{ group.categoryName }}</text>
					</view>
					<view
						v-for="lib in group.libs"
						:key="lib._id"
						class="lib-card"
						@click="goDetail(lib)"
					>
						<view class="lib-cover" :style="{ backgroundColor: getCoverColor(lib._id) }">
							<text class="cover-text" :style="{ color: getCoverTextColor(lib._id) }">{{ lib.name.charAt(0) }}</text>
						</view>
						<view class="lib-info">
							<text class="lib-name">{{ lib.name }}</text>
							<text class="lib-meta">{{ lib.total }} 词 · {{ lib.seasons.length }} 个{{ lib.type === 'series' ? '季' : '分类' }}</text>
						</view>
						<i class="ri-arrow-right-s-line lib-arrow"></i>
					</view>
				</block>
			</view>

			<!-- 空状态 -->
			<view class="empty-wrap" v-if="!loading && filteredLibraries.length === 0">
				<text class="empty-text">暂无词库</text>
			</view>

			<!-- 加载中 -->
			<view class="loading-wrap" v-if="loading">
				<text class="loading-text">加载中...</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getLibraryList, getCategories, getCoverColor, getCoverTextColor, clearGhCache } from '@/utils/cloud.js'

const categories = ref([])
const activeCategory = ref('all')
const keyword = ref('')
const libraries = ref([])
const loading = ref(true)
const librariesCache = ref({})
const isRefreshing = ref(false)

const categoryNameMap = {
	exam: '考试词汇',
	tv: '影视剧集',
	interest: '兴趣爱好',
	other: '其他',
}

onMounted(async () => {
	categories.value = await getCategories()
	const saved = uni.getStorageSync('currentLibraryId')
	await fetchLibraries()
	librariesCache.value[activeCategory.value] = libraries.value
	if (!saved && libraries.value.length > 0) {
		const first = libraries.value[0]
		uni.setStorageSync('currentLibraryId', first._id)
		uni.setStorageSync('currentLibrary', first.name)
	}
})

const fetchLibraries = async (force = false) => {
	loading.value = true
	try {
		const res = await getLibraryList(activeCategory.value, force)
		libraries.value = res.list || []
		librariesCache.value[activeCategory.value] = libraries.value
	} catch (e) {
		console.error('加载词库失败', e)
	} finally {
		loading.value = false
	}
}

const switchCategory = (key) => {
	activeCategory.value = key
	const cached = librariesCache.value[key]
	if (cached) {
		libraries.value = cached
		return
	}
	fetchLibraries()
}

const onSearch = (e) => {
	keyword.value = e.detail.value
}

const filteredLibraries = computed(() => {
	let libs = libraries.value || []
	if (keyword.value.trim()) {
		const kw = keyword.value.trim().toLowerCase()
		libs = libs.filter(lib => lib.name.toLowerCase().includes(kw))
	}

	if (activeCategory.value !== 'all') {
		return [{ category: activeCategory.value, categoryName: '', libs }]
	}

	const groups = {}
	libs.forEach(lib => {
		if (!groups[lib.category]) {
			groups[lib.category] = []
		}
		groups[lib.category].push(lib)
	})

	const order = ['exam', 'tv', 'interest', 'other']
	return order
		.filter(cat => groups[cat] && groups[cat].length > 0)
		.map(cat => ({ category: cat, categoryName: categoryNameMap[cat], libs: groups[cat] }))
})

const showSectionHeader = (group) => {
	return activeCategory.value === 'all' && group.libs.length > 0
}

const goDetail = (lib) => {
	uni.navigateTo({
		url: `/pages/library-detail/library-detail?id=${lib._id}&name=${lib.name}&type=${lib.type}`
	})
}

const onRefresh = async () => {
	isRefreshing.value = true
	clearGhCache()
	librariesCache.value = {}
	try {
		await fetchLibraries(true)
		uni.showToast({ title: '已更新', icon: 'none', duration: 1500 })
	} catch (e) {
		uni.showToast({ title: '更新失败', icon: 'none' })
	} finally {
		isRefreshing.value = false
	}
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	background-color: #fafafa;
	height: 100vh;
	padding: 0 32rpx;
	overflow: hidden;
}

.search-bar {
	display: flex;
	align-items: center;
	background-color: #ffffff;
	border-radius: 999px;
	padding: 16rpx 24rpx;
	margin-top: 16rpx;
	margin-bottom: 16rpx;
	flex-shrink: 0;
}

.tab-scroll {
	white-space: nowrap;
	margin-bottom: 24rpx;
	flex-shrink: 0;
}

.content {
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: auto;
	padding: 0 0 24rpx 0;
}

.content::-webkit-scrollbar {
	display: none;
}

.search-icon {
	font-family: "remixicon";
	font-size: 32rpx;
	color: #999999;
	margin-right: 12rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #333333;
}

.search-input::placeholder {
	color: #C5C5C5;
}

.tab-group {
	display: inline-flex;
	gap: 16rpx;
}

.tab-item {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 12rpx 28rpx;
	border-radius: 999px;
	background-color: transparent;
	border: 1px solid #DDDDDD;
	transition: all 0.2s;
}

.tab-item.active {
	border-color: #6380e8;
}

.tab-text {
	font-size: 26rpx;
	color: #666666;
}

.tab-item.active .tab-text {
	color: #6380e8;
}

.section-header {
	margin-top: 24rpx;
	margin-bottom: 16rpx;
}

.section-title {
	font-size: 28rpx;
	color: #333333;
}

.lib-card {
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 12px;
	padding: 24rpx;
	margin-bottom: 16rpx;
}

.lib-cover {
	width: 80rpx;
	height: 80rpx;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.cover-text {
	font-size: 36rpx;
	font-weight: 600;
}

.lib-info {
	flex: 1;
	margin-left: 24rpx;
	display: flex;
	flex-direction: column;
}

.lib-name {
	font-size: 30rpx;
	font-weight: 500;
	color: #333333;
	margin-bottom: 6rpx;
}

.lib-meta {
	font-size: 22rpx;
	color: #999999;
}

.lib-arrow {
	font-family: "remixicon";
	font-size: 36rpx;
	color: #CCCCCC;
	flex-shrink: 0;
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
.search-icon,
.lib-arrow {
	font-family: "remixicon";
}

.search-input::placeholder {
	color: #C5C5C5;
}
</style>
