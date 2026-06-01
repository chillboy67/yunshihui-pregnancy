<template>
	<view class="container">
		<view class="about-content">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
			<view class="app-name">孕食汇</view>
			<view class="version">v{{version}}</view>
			
			<view class="section">
				<view class="section-title">关于我们</view>
				<view class="section-content">
					亲爱的孕产妇，在孕育新生命的过程中，科学合理的营养摄入对您和宝宝至关重要！孕食汇是一款专注于孕产妇饮食营养的智能应用，为您的日常营养健康提供专业参考和指导。
				</view>
			</view>
			
			<view class="section">
				<view class="section-title">核心功能</view>
				<view class="feature-list">
					<view class="feature-item" v-for="(feature, index) in features" :key="index">
						<view class="feature-icon-wrapper">
							<text class="feature-icon">{{feature.icon}}</text>
						</view>
						<text class="feature-name">{{feature.name}}</text>
						<text class="feature-desc">{{feature.desc}}</text>
					</view>
				</view>
			</view>
			
			<view class="section">
				<view class="section-title">数据来源</view>
				<view class="data-source">
					<text class="source-text">本应用所有营养数据均来自以下权威指南及文献：</text>
					<view class="source-list">
						<text class="source-item">• 《中国居民膳食指南2022》</text>
						<text class="source-item">• 《中国妇幼人群膳食指南2016》</text>
						<text class="source-item">• 《中国居民膳食营养素参考摄入量2023》</text>
						<text class="source-item">• 《妊娠期糖尿病患者膳食指导》</text>
						<text class="source-item">• 《妊娠期高血糖诊治指南2022》</text>
						<text class="source-item">• 《妊娠期糖尿病非药物管理患者指南2024》</text>
						<text class="source-item">• 《妊娠期高血压疾病诊治指南2020》</text>
						<text class="source-item">• 《中国超重/肥胖医学营养治疗指南（2021）》</text>
						<text class="source-item">• 《妊娠期铁缺乏和缺铁性贫血诊治指南2014》</text>
						<text class="source-item">• 《中国食物成分表》（中国疾病预防控制中心营养与健康所编著）</text>
					</view>
				</view>
			</view>
			
			<view class="copyright">
				<text>Copyright © 2025 孕食汇</text>
				<text>All Rights Reserved</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			version: '1.0.0',
			features: [
				{ 
					icon: '💬', 
					name: '营养问答', 
					desc: '专业解答孕期营养困惑'
				},
				{ 
					icon: '📊', 
					name: '营养分析', 
					desc: '智能分析营养摄入情况'
				},
				{ 
					icon: '📚', 
					name: '营养宣教', 
					desc: '科学的孕期营养指导'
				}
			]
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding: 20rpx;
}

.about-content {
	background: #fff;
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
	text-align: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.logo {
	width: 160rpx;
	height: 160rpx;
	margin-bottom: 20rpx;
}

.app-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.version {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 40rpx;
}

.section {
	margin-bottom: 40rpx;
	text-align: left;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	position: relative;
	padding-left: 24rpx;
}

.section-title::before {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 6rpx;
	height: 28rpx;
	background: #FF6B8B;
	border-radius: 3rpx;
}

.section-content {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	background: #f8f9fa;
	padding: 20rpx;
	border-radius: 12rpx;
}

.feature-list {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20rpx;
}

.feature-item {
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.feature-icon-wrapper {
	width: 90rpx;
	height: 90rpx;
	background: rgba(255, 107, 139, 0.1);
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16rpx;
}

.feature-icon {
	font-size: 44rpx;
}

.feature-name {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.feature-desc {
	font-size: 24rpx;
	color: #666;
}

.data-source {
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 20rpx;
}

.source-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
	margin-bottom: 16rpx;
}

.source-list {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.source-item {
	font-size: 24rpx;
	color: #666;
	line-height: 1.4;
}

.copyright {
	margin-top: 60rpx;
	padding-top: 30rpx;
	border-top: 1rpx solid #eee;
}

.copyright text {
	display: block;
	font-size: 24rpx;
	color: #999;
	margin-bottom: 10rpx;
}
</style> 