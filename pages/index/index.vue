<template>
	<view class="container">
		<view class="list">
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
						:class="{ selected: item.id === currentLibId }"
					>
						{{ item.id === currentLibId ? '当前' : '设为当前' }}
					</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentLibId = ref('')
const libraries = ref([
	{ id: 'friends', name: '老友记', total: 1200 },
	{ id: 'bigbang', name: '生活大爆炸', total: 950 },
	{ id: 'got', name: '权力的游戏', total: 1500 },
	{ id: 'stranger', name: '怪奇物语', total: 800 },
	{ id: 'work', name: '职场英语', total: 600 },
	{ id: 'marvel', name: '漫威电影', total: 500 },
])

onMounted(() => {
	const saved = uni.getStorageSync('currentLibraryId')
	if (saved) {
		currentLibId.value = saved
	} else {
		// default first
		currentLibId.value = libraries.value[0].id
		uni.setStorageSync('currentLibraryId', currentLibId.value)
	}
})

const selectLibrary = (item) => {
	currentLibId.value = item.id
	uni.setStorageSync('currentLibraryId', item.id)
	uni.setStorageSync('currentLibrary', item.name)
	uni.showToast({ title: `已选择：${item.name}`, icon: 'none' })
}

const goDetail = (item) => {
	uni.navigateTo({
		url: `/pages/library-detail/library-detail?id=${item.id}&name=${item.name}`
	})
}
</script>

<style scoped>
.container {
	padding: 0 32rpx;
	background-color: #F5F5F5;
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
</style>
