<template>
	<view class="container">
		<view class="settings-list">
			<view class="settings-group">
				<view class="group-title">通知设置</view>
				<view class="settings-item">
					<text>营养提醒</text>
					<switch :checked="settings.nutritionReminder" @change="handleNutritionReminderChange" />
				</view>
				<view class="settings-item">
					<text>产检提醒</text>
					<switch :checked="settings.checkupReminder" @change="handleCheckupReminderChange" />
				</view>
			</view>
			
			<view class="settings-group">
				<view class="group-title">隐私设置</view>
				<view class="settings-item">
					<text>数据同步</text>
					<switch :checked="settings.dataSync" @change="handleDataSyncChange" />
				</view>
				<view class="settings-item">
					<text>匿名统计</text>
					<switch :checked="settings.anonymousStats" @change="handleAnonymousStatsChange" />
				</view>
			</view>
			
			<view class="settings-group">
				<view class="group-title">其他</view>
				<view class="settings-item" @tap="clearCache">
					<text>清除缓存</text>
					<text class="cache-size">{{cacheSize}}</text>
				</view>
				<view class="settings-item" @tap="checkUpdate">
					<text>检查更新</text>
					<text class="version">v{{version}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			settings: {
				nutritionReminder: true,
				checkupReminder: true,
				dataSync: true,
				anonymousStats: true
			},
			cacheSize: '0MB',
			version: '1.0.0'
		}
	},
	onLoad() {
		this.loadSettings();
		this.calculateCacheSize();
	},
	methods: {
		loadSettings() {
			const savedSettings = uni.getStorageSync('settings');
			if (savedSettings) {
				this.settings = JSON.parse(savedSettings);
			}
		},
		saveSettings() {
			uni.setStorageSync('settings', JSON.stringify(this.settings));
		},
		handleNutritionReminderChange(e) {
			this.settings.nutritionReminder = e.detail.value;
			this.saveSettings();
		},
		handleCheckupReminderChange(e) {
			this.settings.checkupReminder = e.detail.value;
			this.saveSettings();
		},
		handleDataSyncChange(e) {
			this.settings.dataSync = e.detail.value;
			this.saveSettings();
		},
		handleAnonymousStatsChange(e) {
			this.settings.anonymousStats = e.detail.value;
			this.saveSettings();
		},
		calculateCacheSize() {
			// 这里应该实现实际的缓存大小计算逻辑
			this.cacheSize = '2.5MB';
		},
		clearCache() {
			uni.showModal({
				title: '提示',
				content: '确定要清除缓存吗？',
				success: (res) => {
					if (res.confirm) {
						// 这里应该实现实际的缓存清理逻辑
						uni.showToast({
							title: '清除成功',
							icon: 'success'
						});
						this.cacheSize = '0MB';
					}
				}
			});
		},
		checkUpdate() {
			uni.showLoading({
				title: '检查更新中...'
			});
			
			// 这里应该实现实际的版本检查逻辑
			setTimeout(() => {
				uni.hideLoading();
				uni.showToast({
					title: '已是最新版本',
					icon: 'none'
				});
			}, 1500);
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

.settings-list {
	background: #fff;
	border-radius: 12rpx;
	overflow: hidden;
}

.settings-group {
	margin-bottom: 20rpx;
}

.group-title {
	padding: 20rpx 30rpx;
	font-size: 28rpx;
	color: #999;
	background-color: #f8f8f8;
}

.settings-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #eee;
	font-size: 30rpx;
	color: #333;
}

.settings-item:last-child {
	border-bottom: none;
}

.cache-size, .version {
	color: #999;
	font-size: 28rpx;
}

:deep(.switch) {
	transform: scale(0.8);
}
</style> 