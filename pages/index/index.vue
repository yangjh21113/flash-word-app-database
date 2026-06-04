<template>
	<view class="container">
		<view class="list" v-if="!loading">
			<view
				v-for="(item, idx) in libraries"
				:key="idx"
				class="list-item"
			>
				<view class="item-main" @click="goDetail(item)">
					<text class="item-name">{{ item.name }}</text>
					<text class="item-count">{{ item.total }} 词</text>
				</view>
				<view class="item-action" @click.stop="selectLibrary(item)">
					<text
						class="select-btn"
						:class="{ selected: item._id === currentLibId }"
					>
						{{ item._id === currentLibId ? '当前' : '设为当前' }}
					</text>
				</view>
			</view>
		</view>
		<view class="loading-wrap" v-else>
			<text class="loading-text">加载中...</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getLibraryList } from '@/utils/cloud.js'

const CACHE_KEY = 'libraryCache'
const CACHE_EXPIRE = 60 * 60 * 1000 // 1 hour

const currentLibId = ref('')
const libraries = ref([])
const loading = ref(true)

onMounted(() => {
	const saved = uni.getStorageSync('currentLibraryId')
	if (saved) {
		currentLibId.value = saved
	}
	fetchLibraries()
})

const fetchLibraries = async () => {
	// 先读缓存
	const cached = uni.getStorageSync(CACHE_KEY)
	if (cached) {
		const data = JSON.parse(cached)
		if (Date.now() - data.time < CACHE_EXPIRE) {
			libraries.value = data.list
			loading.value = false
			// default first if none selected
			if (!currentLibId.value && libraries.value.length > 0) {
				currentLibId.value = libraries.value[0]._id
				uni.setStorageSync('currentLibraryId', currentLibId.value)
			}
			return
		}
	}

	loading.value = true
	try {
		const res = await getLibraryList()
		libraries.value = res.list || []
		// 更新缓存
		uni.setStorageSync(CACHE_KEY, JSON.stringify({
			list: libraries.value,
			time: Date.now()
		}))
		if (!currentLibId.value && libraries.value.length > 0) {
			currentLibId.value = libraries.value[0]._id
			uni.setStorageSync('currentLibraryId', currentLibId.value)
		}
	} catch (e) {
		console.error('加载词库失败', e)
		// 请求失败时用缓存兜底
		const fallback = uni.getStorageSync(CACHE_KEY)
		if (fallback) {
			libraries.value = JSON.parse(fallback).list
		}
	} finally {
		loading.value = false
	}
}

const selectLibrary = (item) => {
	currentLibId.value = item._id
	uni.setStorageSync('currentLibraryId', item._id)
	uni.setStorageSync('currentLibrary', item.name)
	uni.showToast({ title: `已选择：${item.name}`, icon: 'none' })
	// notify flash page
	uni.$emit('libraryChanged')
}

const goDetail = (item) => {
	uni.navigateTo({
		url: `/pages/library-detail/library-detail?id=${item._id}&name=${item.name}`
	})
}
</script>

<style scoped>
.container {
	padding: 0 32rpx;
	background-color: #fafafa;
	min-height: 100vh;
}

.list {
	padding-top: 16rpx;
}

.list-item {
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	border-radius: 4px;
	margin-bottom: 16rpx;
	padding: 32rpx;
}

.item-main {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.item-name {
	font-size: 32rpx;
	color: #333333;
	font-weight: 500;
}

.item-count {
	font-size: 24rpx;
	color: #999999;
}

.item-action {
	margin-left: 24rpx;
}

.select-btn {
	font-size: 24rpx;
	color: #6380e8;
	padding: 8rpx 16rpx;
	border-radius: 4px;
	border: 1px solid #6380e8;
}

.select-btn.selected {
	background-color: #6380e8;
	color: #FFFFFF;
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
</style>
