<template>
	<view class="container">
		<view class="article-header">
			<text class="article-title">{{article.title}}</text>
			<view class="article-meta">
				<text class="meta-date">{{article.date}}</text>
				<view class="meta-stats">
					<text class="meta-text">{{article.readCount}}阅读</text>
					<text class="meta-text">{{article.likeCount}}点赞</text>
				</view>
			</view>
		</view>
		
		<view class="article-content">
			<image class="article-image" :src="article.image" mode="widthFix"></image>
			<view class="content-text">
				<text class="content-paragraph">{{article.content}}</text>
			</view>
		</view>
		
		<view class="article-tags">
			<text class="tag" v-for="(tag, index) in article.tags" :key="index">{{tag}}</text>
		</view>
	</view>
</template>

<script>
// 直接导入JS数据文件
import articlesData from '../../static/data/educationArticlesData.js';

export default {
	data() {
		return {
			article: {
				title: '',
				date: '',
				readCount: '',
				likeCount: '',
				image: '',
				content: '',
				tags: []
			}
		}
	},
	onLoad(options) {
		// 根据传入的id获取文章详情
		const articleId = options.id;
		this.getArticleDetail(articleId);
	},
	methods: {
		getArticleDetail(id) {
			// 直接从导入的JS数据中获取文章
			if (articlesData && articlesData[id]) {
				this.article = articlesData[id];
			} else {
				// 数据获取失败时，回退到第一篇文章
				uni.showToast({
					title: '文章数据获取失败',
					icon: 'none'
				});
				// 如果有id=1的文章，显示第一篇，否则显示空文章
				if (articlesData && articlesData['1']) {
					this.article = articlesData['1'];
				}
			}
		}
	}
}
</script>

<style>
.container {
	/* padding: 30rpx; */
}

.article-header {
	margin-bottom: 40rpx;
	padding: 0 30rpx;
}

.article-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	line-height: 1.4;
	margin-bottom: 20rpx;
	display: block;
}

.article-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.meta-date {
	font-size: 24rpx;
	color: #999;
}

.meta-stats {
	display: flex;
	gap: 20rpx;
}

.meta-text {
	font-size: 24rpx;
	color: #999;
}

.article-content {
	margin-bottom: 40rpx;
	padding: 0 30rpx;
}

.article-image {
	width: 100%;
	border-radius: 12rpx;
	margin-bottom: 30rpx;
}

.content-text {
	font-size: 30rpx;
	color: #333;
	line-height: 1.8;
}

.content-paragraph {
	display: block;
	margin-bottom: 20rpx;
	white-space: pre-wrap;
}

.article-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 10rpx;
	padding: 0 30rpx;
}

.tag {
	font-size: 24rpx;
	color: #FF6B8B;
	background: rgba(255, 107, 139, 0.1);
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
}
</style> 