<template>
	<view class="container">
		<view class="education-header">
			<view class="header-title">
				<text class="title-main">孕期营养知识</text>
				<text class="title-sub">科学饮食，健康孕期</text>
			</view>
			<view class="category-tabs">
				<view 
					v-for="(tab, index) in categoryTabs" 
					:key="index"
					:class="['tab-item', { active: currentTab === index }]"
					@click="switchTab(index)"
				>
					{{tab.name}}
				</view>
			</view>
		</view>
		
		<view class="education-list">
			<view class="education-item" v-for="(item, index) in filteredList" :key="index" @click="navigateToDetail(item)">
				<view class="item-header">
					<view class="item-tags">
						<text class="tag" v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{tag}}</text>
					</view>
					<text class="item-date">{{item.date}}</text>
				</view>
				<view class="item-content">
					<view class="content-left">
						<text class="item-title">{{item.title}}</text>
						<text class="item-desc">{{item.description}}</text>
						<view class="item-meta">
							<text class="meta-text">{{item.readCount}}阅读</text>
							<text class="meta-text">{{item.likeCount}}点赞</text>
						</view>
					</view>
					<image class="content-image" :src="item.image" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// 直接导入JS数据文件
import educationListData from '../../static/data/educationListData.js';

export default {
	data() {
		return {
			currentTab: 0,
			categoryTabs: [
				{ name: '孕早期', type: 'first' },
				{ name: '孕中期', type: 'second' },
				{ name: '孕晚期', type: 'third' },
				{ name: '产褥期', type: 'postpartum' },
				{ name: '母乳喂养', type: 'breastfeeding' }
			],
			educationList: []
		}
	},
	computed: {
		filteredList() {
			return this.educationList.filter(item => item.type === this.categoryTabs[this.currentTab].type);
		}
	},
	created() {
		// 组件创建时初始化教育文章列表数据
		this.initEducationList();
	},
	methods: {
		// 初始化教育文章列表数据
		initEducationList() {
			// 直接使用导入的JS数据
			this.educationList = educationListData;
		},
		switchTab(index) {
			this.currentTab = index;
		},
		navigateToDetail(item) {
			uni.navigateTo({
				url: `/pages/index/education-detail?id=${item.id}`
			});
		}
	}
}
</script>

<style>
.container {
	/* padding: 10rpx; */
}

.education-header {
	margin: 20rpx;
}

.header-title {
	margin-bottom: 30rpx;
}

.title-main {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.title-sub {
	font-size: 28rpx;
	color: #666;
}

.category-tabs {
	display: flex;
	background: #fff;
	border-radius: 12rpx;
	padding: 10rpx 10rpx 10rpx 0;
	margin-bottom: 20rpx;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 16rpx 0;
	font-size: 28rpx;
	color: #666;
	position: relative;
}

.tab-item.active {
	color: #FF6B8B;
}

/* 删除指示条样式 */
.tab-item.active::after {
	display: none;
}

.education-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	margin: -10rpx 20rpx 0;
}

.education-item {
	background: #fff;
	border-radius: 12rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	cursor: pointer;
}

.education-item:active {
	background: #f8f8f8;
}

.item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.item-tags {
	display: flex;
	gap: 10rpx;
}

.tag {
	font-size: 24rpx;
	color: #FF6B8B;
	background: rgba(255, 141, 161, 0.2);
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
}

.item-date {
	font-size: 24rpx;
	color: #999;
}

.item-content {
	display: flex;
	gap: 20rpx;
}

.content-left {
	flex: 1;
}

.content-image {
	width: 200rpx;
	height: 150rpx;
	border-radius: 8rpx;
}

.item-title {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
	display: block;
}

.item-desc {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	margin-bottom: 20rpx;
	display: block;
}

.item-meta {
	display: flex;
	gap: 20rpx;
}

.meta-text {
	font-size: 24rpx;
	color: #999;
}
</style> 