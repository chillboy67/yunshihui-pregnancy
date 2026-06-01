<template>
	<view class="container">
		<!-- 用户资料弹窗 -->
		<uni-popup ref="profilePopup" type="center" @change="handlePopupChange" :mask-click="false">
			<view class="profile-popup">
				<view class="popup-header">
					<text class="popup-title">请完善个人资料</text>
				</view>
				<view class="popup-content">
					<uni-forms ref="profileForm" :model="profile" :rules="rules">
						<uni-forms-item label="年龄" required name="age">
							<uni-easyinput
								v-model="profile.age"
								type="number"
								placeholder="请输入年龄"
							/>
						</uni-forms-item>

						<uni-forms-item label="末次月经第一天" required name="last_menstrual_date">
							<uni-datetime-picker
								v-model="profile.last_menstrual_date"
								type="date"
								:clear-icon="false"
								placeholder="请选择日期"
							/>
						</uni-forms-item>

						<uni-forms-item label="体力活动水平" required name="activity_level">
							<uni-data-select
								v-model="profile.activity_level"
								:localdata="activityLevels"
								placeholder="请选择您的生活方式"
								@change="handleActivityChange"
							/>
							<view class="activity-level-hint" v-if="profile.activity_level">
								您的体力活动水平：<text class="level-text">{{ profile.activity_level }}</text>
							</view>
						</uni-forms-item>

						<view class="popup-buttons">
							<button class="save-button" @tap="submitProfile">保存</button>
						</view>
					</uni-forms>
				</view>
			</view>
		</uni-popup>
		
		<!-- 主要内容区域 -->
		<view class="main-content">
			<qa v-if="currentTab === 'qa'"></qa>
			<analysis v-if="currentTab === 'analysis'" ref="analysisRef"></analysis>
			<education v-if="currentTab === 'education'"></education>
			<profile v-if="currentTab === 'profile'"></profile>
		</view>
		
		<!-- 底部导航栏 -->
		<view class="tab-bar" :class="{ hidden: !showTabBar }">
			<view 
				class="tab-item" 
				:class="{ active: currentTab === 'qa' }"
				@tap="switchTab('qa')"
			>
				<uni-icons :type="'chat'" size="24" :color="currentTab === 'qa' ? '#007AFF' : '#666'"></uni-icons>
				<text class="tab-text">营养问答</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentTab === 'analysis' }"
				@tap="switchTab('analysis')"
			>
				<uni-icons :type="'bars'" size="24" :color="currentTab === 'analysis' ? '#007AFF' : '#666'"></uni-icons>
				<text class="tab-text">营养分析</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentTab === 'education' }"
				@tap="switchTab('education')"
			>
				<uni-icons :type="'notification'" size="24" :color="currentTab === 'education' ? '#007AFF' : '#666'"></uni-icons>
				<text class="tab-text">营养宣教</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentTab === 'profile' }"
				@tap="switchTab('profile')"
			>
				<uni-icons :type="'person'" size="24" :color="currentTab === 'profile' ? '#007AFF' : '#666'"></uni-icons>
				<text class="tab-text">我的</text>
			</view>
		</view>
	</view>
</template>

<script>
	import qa from './qa.vue'
	import analysis from './analysis.vue'
	import education from './education.vue'
	import profile from './profile.vue'
	
	export default {
		components: {
			qa,
			analysis,
			education,
			profile
		},
		data() {
			return {
				userInfo: {
					username: ''
				},
				currentTab: 'qa', // 默认选中营养问答
				profile: {
					age: '',
					last_menstrual_date: '',
					activity_level: ''
				},
				activityLevels: [{
					text: "静态生活方式/坐位工作",
					value: "低"
				}, {
					text: "主要是站着或走着工作",
					value: "中"
				}, {
					text: "高强度职业工作",
					value: "高"
				}],
				rules: {
					age: {
						rules: [{
							required: true,
							errorMessage: '请输入年龄'
						}]
					},
					last_menstrual_date: {
						rules: [{
							required: true,
							errorMessage: '请选择末次月经第一天'
						}]
					},
					activity_level: {
						rules: [{
							required: true,
							errorMessage: '请选择体力活动水平'
						}]
					}
				},
				showTabBar: true
			}
		},
		onLoad() {
			// 获取用户信息
			try {
				const userInfoStr = uni.getStorageSync('userInfo');
				if (userInfoStr) {
					this.userInfo = JSON.parse(userInfoStr);
					// 延迟检查用户资料，确保页面完全加载
					setTimeout(() => {
						this.checkUserProfile();
					}, 100);
				}
			} catch (e) {
				console.error('获取用户信息失败', e);
			}
		},
		methods: {
			// 检查用户资料
			checkUserProfile() {
				const username = uni.getStorageSync('username');
				if (username) {
					const userProfileStr = uni.getStorageSync(`userProfile_${username}`);
					if (!userProfileStr) {
						// 如果没有资料，显示弹窗
						this.showProfilePopup();
					} else {
						const userProfile = JSON.parse(userProfileStr);
						if (!userProfile.age || !userProfile.last_menstrual_date || !userProfile.activity_level) {
							// 如果资料不完整，显示弹窗
							this.showProfilePopup();
						}
					}
				}
			},
			
			// 显示资料弹窗
			showProfilePopup() {
				// 确保弹窗组件已经挂载
				if (this.$refs.profilePopup) {
					this.$refs.profilePopup.open();
				} else {
					// 如果弹窗组件还没有挂载，等待一下再试
					setTimeout(() => {
						if (this.$refs.profilePopup) {
							this.$refs.profilePopup.open();
						}
					}, 100);
				}
			},
			
			// 关闭资料弹窗
			closeProfilePopup() {
				this.$refs.profilePopup.close();
			},
			
			// 提交资料
			async submitProfile() {
				try {
					const valid = await this.$refs.profileForm.validate();
					if (valid) {
						const username = uni.getStorageSync('username');
						if (username) {
							// 保存到本地存储
							uni.setStorageSync(`userProfile_${username}`, JSON.stringify(this.profile));
							
							// 保存到服务器
							const response = await uni.request({
								url: this.$apiUrl + 'update_profile',
								method: "POST",
								data: {
									username: username,
									profile: this.profile
								}
							});
							
							if (response.statusCode === 200) {
								uni.showToast({
									title: "资料保存成功",
									icon: "success"
								});
								
								// 关闭弹窗
								this.closeProfilePopup();
								
								// 延迟一小段时间后刷新页面
								setTimeout(() => {
									// 使用reLaunch而不是reload，这样更平滑
									uni.reLaunch({
										url: '/pages/index/main',
										success: () => {
											console.log('页面刷新成功');
										}
									});
								}, 300);
							} else {
								uni.showToast({
									title: response.data.message || "保存失败",
									icon: "none"
								});
							}
						}
					}
				} catch (e) {
					console.error('保存资料失败', e);
					uni.showToast({
						title: "保存失败，请重试",
						icon: "none"
					});
				}
			},
			
			// 切换底部标签
			switchTab(tab) {
				this.currentTab = tab;
				if (tab === 'analysis') {
					// 当切换到“营养分析”标签页时
					console.log('Switched to analysis tab'); // 添加日志
	
					// 检查本地存储，看用户是否勾选过“不再弹出”
					const showHelp = uni.getStorageSync('showAnalysisHelp');
					console.log('Value of showAnalysisHelp:', showHelp);
	
					if (showHelp !== 'false') {
						console.log('Condition met, should open popup.');
	
						// 需要找到 analysis 组件实例来调用它的方法或控制它的 popup
						// 注意：这里假设 analysis 组件已经加载并且有 helpPopup ref
						// 我们需要确保 analysis 组件实例存在
						this.$nextTick(() => {
							// 通过 $refs 找到 main.vue 加载的 analysis 组件
							// **重要：** 确保下面使用了 ref="analysisRef"
							const analysisComponent = this.$refs.analysisRef; 
							if (analysisComponent && analysisComponent.$refs.helpPopup) {
								console.log('Analysis component and Popup ref found, calling open().');
								analysisComponent.$refs.helpPopup.open();
							} else {
								console.error('Could not find analysis component ref or its helpPopup ref!');
								// 尝试延迟，因为 v-if 可能需要时间渲染
								setTimeout(() => {
									const analysisCompRetry = this.$refs.analysisRef;
									if (analysisCompRetry && analysisCompRetry.$refs.helpPopup) {
										console.log('Retry: Found refs, calling open().');
										analysisCompRetry.$refs.helpPopup.open();
									} else {
										console.error('Retry failed: Still cannot find refs.');
									}
								}, 300); // 延迟 300ms 再试一次
							}
						});
					} else {
						console.log('Condition NOT met, popup will not open.');
					}
				}
			},
			handleActivityChange(value) {
				this.profile.activity_level = value;
			},
			// 处理弹窗状态变化
			handlePopupChange(e) {
				// 如果弹窗正在关闭，且表单未完成，则阻止关闭
				if (!e.show && (!this.profile.age || !this.profile.last_menstrual_date || !this.profile.activity_level)) {
					this.$refs.profilePopup.open();
					uni.showToast({
						title: '请完成所有必填项',
						icon: 'none'
					});
					return;
				}
				this.showTabBar = !e.show;
			}
		}
	}
</script>

<style>
	.container {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: 100rpx;
		display: flex;
		flex-direction: column;
	}
	
	/* 状态栏样式 */
	.status-bar {
		background-color: #ffffff;
		padding: 20rpx 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.welcome-text {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}
	
	/* 主要内容区域 */
	.main-content {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	
	/* 搜索栏样式 */
	.search-bar {
		margin-bottom: 30rpx;
	}
	
	/* 功能区域样式 */
	.feature-section {
		margin-bottom: 30rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	
	.feature-scroll {
		white-space: nowrap;
	}
	
	.feature-item {
		display: inline-block;
		margin-right: 20rpx;
		width: 300rpx;
		background: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}
	
	.feature-image {
		width: 100%;
		height: 200rpx;
	}
	
	.feature-name {
		font-size: 28rpx;
		color: #333;
		padding: 16rpx;
		display: block;
	}
	
	/* 食谱列表样式 */
	.recipe-section {
		background: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
	}
	
	.recipe-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.recipe-item {
		display: flex;
		padding: 16rpx;
		background: #f8f8f8;
		border-radius: 8rpx;
	}
	
	.recipe-image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
	}
	
	.recipe-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	
	.recipe-name {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	
	.recipe-desc {
		font-size: 24rpx;
		color: #666;
	}
	
	/* 底部导航栏样式 */
	.tab-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background: #fff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		z-index: 100;
		transition: opacity 0.3s;
		opacity: 1;
	}

	.tab-bar.hidden {
		opacity: 0;
		pointer-events: none;
	}
	
	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 10rpx 0;
	}
	
	.tab-item.active {
		color: #FF6B8B;
	}
	
	.tab-item.active .uni-icons {
		color: #FF6B8B !important;
	}
	
	.tab-text {
		font-size: 24rpx;
		margin-top: 4rpx;
		color: #666;
	}
	
	.tab-item.active .tab-text {
		color: #FF6B8B;
	}
	
	/* 弹窗样式 */
	.profile-popup {
		background: #fff;
		border-radius: 12rpx;
		width: 600rpx;
		max-height: 80vh;
		overflow-y: auto;
		position: relative;
		z-index: 100;
	}
	
	.popup-header {
		padding: 20rpx;
		border-bottom: 1rpx solid #eee;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.popup-title {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}
	
	.popup-close {
		display: none;
	}
	
	.popup-content {
		padding: 20rpx;
	}
	
	.popup-buttons {
		margin-top: 30rpx;
	}
	
	.save-button {
		width: 100%;
		background-color: #FF6B8B;
		color: #fff;
		border-radius: 4rpx;
		font-size: 28rpx;
		height: 70rpx;
		line-height: 70rpx;
		border: none;
	}
	
	.save-button:active {
		opacity: 0.8;
	}
	
	:deep(.uni-forms-item__label) {
		color: #333 !important;
	}
	
	:deep(.uni-easyinput__content) {
		border: 1rpx solid #ddd !important;
		border-radius: 4rpx !important;
		height: 70rpx !important;
		line-height: 70rpx !important;
		background-color: #fff !important;
	}

	:deep(.uni-date),
	:deep(.uni-data-select) {
		border: 1rpx solid #ddd !important;
		border-radius: 4rpx !important;
		height: 70rpx !important;
		line-height: 70rpx !important;
	}

	:deep(.uni-easyinput__content-input) {
		height: 70rpx !important;
		line-height: 70rpx !important;
	}

	:deep(.uni-date) {
		border: none !important;
		position: relative;
		z-index: 1;
	}

	:deep(.uni-date__input) {
		border: 1rpx solid #ddd !important;
		border-radius: 4rpx !important;
		height: 70rpx !important;
		line-height: 70rpx !important;
	}

	:deep(.uni-date__icon-clear) {
		display: none !important;
	}

	:deep(.uni-date__icon) {
		right: 10rpx !important;
	}

	:deep(.uni-date-editor) {
		position: relative;
		z-index: 1;
	}

	:deep(.uni-date-editor--x) {
		position: relative;
		z-index: 1;
	}

	:deep(.uni-date-editor--x .uni-date-editor__input) {
		position: relative;
		z-index: 1;
	}

	:deep(.uni-date-editor--x .uni-date-editor__icon) {
		position: relative;
		z-index: 1;
	}

	:deep(.uni-date-editor--x .uni-date-editor__icon-clear) {
		position: relative;
		z-index: 1;
	}

	:deep(.uni-date-picker) {
		position: fixed !important;
		z-index: 9999 !important;
	}

	:deep(.uni-date-picker__container) {
		position: fixed !important;
		z-index: 9999 !important;
	}

	:deep(.uni-date-picker__popup) {
		position: fixed !important;
		z-index: 9999 !important;
	}

	:deep(.uni-date-picker__mask) {
		position: fixed !important;
		z-index: 9998 !important;
	}
	
	.activity-level-hint {
		margin-top: 8rpx;
		font-size: 24rpx;
		color: #666;
	}

	.level-text {
		color: #FF6B8B;
		font-weight: 500;
	}
</style> 