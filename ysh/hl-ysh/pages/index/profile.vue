<template>
	 <view class="container"> 
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="user-info">
				<image class="avatar" src="/static/avatar.png" mode="aspectFill"></image>
				<view class="user-detail">
					<!-- <text class="username">ID:{{userInfo.username}}</text> -->
					<text class="user-id">ID: {{userInfo.username}}</text>
				</view>
			</view>
		</view> 
		
		 <!-- 功能列表  -->
		 <view class="menu-list">
			<view class="menu-group">
				<view class="menu-item" v-for="(item, index) in menuList" :key="index" @tap="handleMenuClick(item)">
					<view class="menu-item-left">
						<uni-icons :type="item.icon" size="24" color="#666"></uni-icons>
						<text class="menu-text">{{item.text}}</text>
					</view>
					<uni-icons type="right" size="16" color="#999"></uni-icons>
				</view>
			</view>
		</view> 
		
		<!-- 退出登录按钮 -->
		<button class="logout-btn" @tap="handleLogout">退出登录</button>
	</view>
</template>  

<script>
export default {
	data() {
		return {
			userInfo: {
				username: uni.getStorageSync('username') || '',
				id: ''
			},
			menuList: [
				{ icon: 'person', text: '基本资料', path: '/pages/index/basic' },
				// { icon: 'gear', text: '设置', path: '/pages/index/settings' },
				{ icon: 'help', text: '帮助与反馈', path: '/pages/index/help' },
				{ icon: 'info', text: '关于我们', path: '/pages/index/about' },
				{ icon: 'list', text: '历史营养分析', path: '/pages/history/analysis-list' }
			]
		}
	},
	onLoad() {
		// 获取用户信息
		try {
			const username = uni.getStorageSync('username');
			if (username) {
				this.userInfo.username = username;
			}
		} catch (e) {
			console.error('获取用户信息失败', e);
		}
	},
	methods: {
		handleMenuClick(item) {
			uni.navigateTo({
				url: item.path
			});
		},
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						//在删除 username 之前，先获取它
						const username = uni.getStorageSync('username');

						//清除所有会话相关信息
						uni.removeStorageSync('userInfo');
						uni.removeStorageSync('username');

						//清除特定于用户的 profile 缓存
						if (username) {
							uni.removeStorageSync(`userProfile_${username}`);
						}

						//故意不清空 'savedCredentials'

						//跳转到登录页
						uni.reLaunch({
							url: '/pages/index/login'
						});
					}
				}
			});
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 40rpx;
}

.user-card {
	background: #fff;
	padding: 40rpx 30rpx;
	margin-bottom: 20rpx;
}

.user-info {
	display: flex;
	align-items: center;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	margin-right: 30rpx;
}

.user-detail {
	display: flex;
	flex-direction: column;
}

.username {
	font-size: 36rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.user-id {
	font-size: 24rpx;
	color: #999;
}

.menu-list {
	background: #fff;
	margin-bottom: 40rpx;
}

.menu-group {
	display: flex;
	flex-direction: column;
}

.menu-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-item-left {
	display: flex;
	align-items: center;
}

.menu-text {
	font-size: 30rpx;
	color: #333;
	margin-left: 20rpx;
}

.logout-btn {
	width: 90%;
	height: 90rpx;
	line-height: 90rpx;
	background: #fff;
	color: #ff3b30;
	font-size: 32rpx;
	border-radius: 12rpx;
	margin: 0 auto;
}
</style> 

  

