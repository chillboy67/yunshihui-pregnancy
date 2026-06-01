<template>
	<view class="container">
		<view class="login-box">
			<view class="title">孕食汇</view>
			<view class="subtitle">孕产期营养知识助手</view>
			
			<uni-forms ref="loginForm" :model="formData" :rules="rules">
				<uni-forms-item name="username">
					<uni-easyinput
						v-model="formData.username"
						placeholder="请输入用户名"
						:clearable="true"
						prefixIcon="person"
					/>
				</uni-forms-item>
				
				<uni-forms-item name="password">
					<uni-easyinput
						v-model="formData.password"
						type="password"
						placeholder="请输入密码"
						:passwordIcon="true"
						prefixIcon="locked"
					/>
				</uni-forms-item>
				
				<button 
					class="login-btn" 
					type="primary" 
					@tap="handleLogin" 
					:loading="isLoading"
					:disabled="isLoading"
				>{{isLoading ? '登录中...' : '登录'}}</button>
				
				<view class="links">
					<text class="link" @tap="showRegisterModal">注册账号</text>
					<text class="link" @tap="showForgotPasswordModal">忘记密码</text>
				</view>

				<view class="custom-checkbox-container" @tap="toggleRememberMe" style="margin-top: 20rpx;">
					<view class="custom-checkbox" :class="{'checked': rememberMe}">
						<text v-if="rememberMe" class="checkbox-icon">✓</text>
					</view>
					<text class="agreement-text">记住账号密码</text>
				</view>

				<view class="agreement">
					<view class="custom-checkbox-container" @tap="toggleAgreement">
						<view class="custom-checkbox" :class="{'checked': isAgreed}">
							<text v-if="isAgreed" class="checkbox-icon">✓</text>
						</view>
						<text class="agreement-text">我已阅读并同意</text>
						<text class="agreement-link" @tap.stop="showAgreement">《用户协议和隐私政策》</text>
					</view>
				</view>
			</uni-forms>
		</view>
		
		<!-- 用户协议弹框 -->
		<uni-popup ref="agreementPopup" type="center">
			<view class="agreement-modal">
				<view class="modal-title">用户协议和隐私政策</view>
				<scroll-view scroll-y class="agreement-content">
					<view class="agreement-section">
						<view class="section-title">1. 服务说明</view>
						<view class="section-text">
							孕食汇是一个专注于为孕期女性提供营养食谱推荐的应用。我们致力于为用户提供安全、可靠的孕期饮食建议。
						</view>
					</view>
					<view class="agreement-section">
						<view class="section-title">2. 隐私保护</view>
						<view class="section-text">
							我们重视您的隐私保护，承诺对您的个人信息进行严格保密。未经您的同意，我们不会向第三方披露您的个人信息。
						</view>
					</view>
					<view class="agreement-section">
						<view class="section-title">3. 免责声明</view>
						<view class="section-text">
							本应用提供的食谱建议仅供参考，不构成医疗建议。如有特殊情况，请遵医嘱。
						</view>
					</view>
				</scroll-view>
				<view class="modal-footer">
					<button class="confirm-btn" type="primary" @tap="closeAgreement">我知道了</button>
				</view>
			</view>
		</uni-popup>

		<!-- 注册弹框 -->
		<uni-popup ref="registerPopup" type="center">
			<view class="register-modal">
				<view class="modal-title">注册账号</view>
				<uni-forms ref="registerForm" :model="registerForm" :rules="registerRules">
					<uni-forms-item name="username">
						<uni-easyinput
							v-model="registerForm.username"
							placeholder="请输入用户名"
							:clearable="true"
							prefixIcon="person"
						/>
					</uni-forms-item>
					
					<uni-forms-item name="password">
						<uni-easyinput
							v-model="registerForm.password"
							type="password"
							placeholder="请输入密码"
							:passwordIcon="true"
							prefixIcon="locked"
						/>
					</uni-forms-item>
					
					<uni-forms-item name="confirmPassword">
						<uni-easyinput
							v-model="registerForm.confirmPassword"
							type="password"
							placeholder="请再次输入密码"
							:passwordIcon="true"
							prefixIcon="locked"
						/>
					</uni-forms-item>

					<uni-forms-item name="security_question_answer">
						<uni-easyinput
							v-model="registerForm.security_question_answer"
							placeholder="请输入你最亲近的人的名字"
							:clearable="true"
							prefixIcon="person-filled"
						/>
					</uni-forms-item>
				</uni-forms>
				
				<view class="modal-footer">
					<button class="cancel-btn" @tap="closeRegisterModal">取消</button>
					<button 
						class="confirm-btn" 
						type="primary" 
						@tap="handleRegister"
						:loading="registerLoading"
						:disabled="registerLoading"
					>{{registerLoading ? '注册中...' : '注册'}}</button>
				</view>
			</view>
		</uni-popup>

		<!-- 忘记密码弹框 -->
		<uni-popup ref="forgotPasswordPopup" type="center">
			<view class="register-modal">
				<view class="modal-title">找回密码</view>
				<uni-forms ref="forgotPasswordForm" :model="forgotPasswordForm" :rules="forgotPasswordRules">
					<uni-forms-item name="username">
						<uni-easyinput
							v-model="forgotPasswordForm.username"
							placeholder="请输入用户名"
							:clearable="true"
							prefixIcon="person"
						/>
					</uni-forms-item>
					
					<uni-forms-item name="security_question_answer">
						<uni-easyinput
							v-model="forgotPasswordForm.security_question_answer"
							placeholder="请输入你最亲近的人的名字"
							:clearable="true"
							prefixIcon="person-filled"
						/>
					</uni-forms-item>

					<uni-forms-item name="newPassword">
						<uni-easyinput
							v-model="forgotPasswordForm.newPassword"
							type="password"
							placeholder="请输入新密码"
							:passwordIcon="true"
							prefixIcon="locked"
						/>
					</uni-forms-item>
					
					<uni-forms-item name="confirmPassword">
						<uni-easyinput
							v-model="forgotPasswordForm.confirmPassword"
							type="password"
							placeholder="请再次输入新密码"
							:passwordIcon="true"
							prefixIcon="locked"
						/>
					</uni-forms-item>
				</uni-forms>
				
				<view class="modal-footer">
					<button class="cancel-btn" @tap="closeForgotPasswordModal">取消</button>
					<button 
						class="confirm-btn" 
						type="primary" 
						@tap="handleForgotPassword"
						:loading="forgotPasswordLoading"
						:disabled="forgotPasswordLoading"
					>{{forgotPasswordLoading ? '提交中...' : '提交'}}</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			const savedCredentialsStr = uni.getStorageSync('savedCredentials');
			const savedCredentials = savedCredentialsStr ? JSON.parse(savedCredentialsStr) : null;
			
			return {
				formData: {
					username: savedCredentials ? savedCredentials.username : '',
					password: savedCredentials ? savedCredentials.password : ''
				},
			rules: {
				username: {
					rules: [{
						required: true,
						errorMessage: '请输入用户名'
					}]
				},
				password: {
					rules: [{
						required: true,
						errorMessage: '请输入密码'
					}]
				}
			},
			isLoading: false,
			rememberMe:!!savedCredentials,
			registerForm: {
				username: '',
				password: '',
				confirmPassword: '',
				security_question_answer: ''
			},
			registerRules: {
				username: {
					rules: [{
						required: true,
						errorMessage: '请输入用户名'
					}]
				},
				password: {
					rules: [{
						required: true,
						errorMessage: '请输入密码'
					}, {
						minLength: 6,
						errorMessage: '密码长度不能小于6位'
					}]
				},
				confirmPassword: {
					rules: [{
						required: true,
						errorMessage: '请再次输入密码'
					}, {
						validateFunction: (rule, value, data) => {
							if (value !== data.password) {
								return '两次输入的密码不一致'
							}
							return true
						}
					}]
				},
				security_question_answer: {
					rules: [{
						required: true,
						errorMessage: '请输入密保答案'
					}]
				}
			},
			registerLoading: false,
			forgotPasswordForm: {
				username: '',
				security_question_answer: '',
				newPassword: '',
				confirmPassword: ''
			},
			forgotPasswordRules: {
				username: {
					rules: [{
						required: true,
						errorMessage: '请输入用户名'
					}]
				},
				security_question_answer: {
					rules: [{
						required: true,
						errorMessage: '请输入密保答案'
					}]
				},
				newPassword: {
					rules: [{
						required: true,
						errorMessage: '请输入新密码'
					}, {
						minLength: 6,
						errorMessage: '密码长度不能小于6位'
					}]
				},
				confirmPassword: {
					rules: [{
						required: true,
						errorMessage: '请再次输入新密码'
					}, {
						validateFunction: (rule, value, data) => {
							if (value !== data.newPassword) {
								return '两次输入的密码不一致'
							}
							return true
						}
					}]
				}
			},
			forgotPasswordLoading: false,
			isAgreed: false,
		}
	},
	methods: {
		toggleRememberMe() {
					this.rememberMe = !this.rememberMe;
				},
		showRegisterModal() {
			this.$refs.registerPopup.open();
			// 清空注册表单
			this.registerForm = {
				username: '',
				password: '',
				confirmPassword: '',
				security_question_answer: ''
			};
		},
		closeRegisterModal() {
			this.$refs.registerPopup.close();
		},
		handleLogin() {
			if (!this.isAgreed) {
				uni.showToast({
					title: '请先阅读并同意用户协议',
					icon: 'none'
				});
				return;
			}
			this.$refs.loginForm.validate().then(res => {
				// 显示加载状态
				this.isLoading = true;
				
				// 准备登录数据
				const loginData = {
					username: this.formData.username,
					password: this.formData.password
				};
				
				// 发送登录请求到服务器
				uni.request({
					url: this.$apiUrl + 'login',
					method: 'POST',
					data: loginData,
					header: {
						'Content-Type': 'application/json'
					},
					success: (res) => {
						console.log('服务器响应：', res);
						
						if (res.statusCode === 200 && res.data.profile) {
							// 登录成功

							// 1. 保存从后端返回的profile
							// 使用 main.vue 期望的 key 和 type (JSON字符串)
							uni.setStorageSync(`userProfile_${res.data.username}`, JSON.stringify(res.data.profile));
							
							// 2. 保存从后端返回的username
							// 这确保了用户名是正确的
							uni.setStorageSync('username', res.data.username);
							
							// 3.保存一个简化的 userInfo, 不再包含 'token'
							const userInfo = {
								username: res.data.username,
								loginTime: new Date().getTime()
							};
							uni.setStorageSync('userInfo', JSON.stringify(userInfo));
							
							if (this.rememberMe) {
								// 如果用户勾选了“记住账号密码”
								// 警告：正在保存明文密码
								const credentials = {
									username: this.formData.username,
									password: this.formData.password
								};
								uni.setStorageSync('savedCredentials', JSON.stringify(credentials));
							} else {
								// 否则，清除已保存的凭据
								uni.removeStorageSync('savedCredentials');
							}
							
							console.log(`保存 Profile 到 key: userProfile_${res.data.username}`, res.data.profile);
							console.log('保存 Username:', res.data.username);
							
							// 显示成功提示
							uni.showToast({
								title: '登录成功',
								icon: 'success',
								duration: 1000
							});
							
							// 延迟跳转到主页面
							setTimeout(() => {
								console.log('准备跳转到主页面');
								uni.reLaunch({
									url: '/pages/index/main',
									success: () => {
										console.log('跳转成功');
									},
									fail: (err) => {
										console.error('跳转失败：', err);
									}
								});
							}, 1000);
						} else {
							// 登录失败
							uni.showToast({
								title: res.data.detail || '用户名或密码错误',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						// 请求失败
						console.error('登录请求失败：', err);
						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});
					},
					complete: () => {
						// 无论成功失败，都关闭加载状态
						this.isLoading = false;
					}
				});
			}).catch(err => {
				console.log('表单错误：', err);
			});
		},
		handleRegister() {
			this.$refs.registerForm.validate().then(res => {
				// 显示加载状态
				this.registerLoading = true;
				
				// 准备注册数据
				const registerData = {
					username: this.registerForm.username,
					password: this.registerForm.password,
					security_question_answer: this.registerForm.security_question_answer
				};
				
				// 发送注册请求到服务器
				uni.request({
					url: this.$apiUrl + 'register',
					method: 'POST',
					data: registerData,
					header: {
						'Content-Type': 'application/json'
					},
					success: (res) => {
						console.log('注册响应：', res);
						
						if (res.statusCode === 200) {
							// 注册成功
							uni.showToast({
								title: '注册成功',
								icon: 'success',
								duration: 1500
							});
							
							// 关闭注册弹框
							this.closeRegisterModal();
							
							// 清空登录表单
							this.formData = {
								username: '',
								password: ''
							};
						} else {
							// 注册失败
							uni.showToast({
								title: res.data.message || '注册失败，用户名已经存在',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						// 请求失败
						console.error('注册请求失败：', err);
						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});
					},
					complete: () => {
						// 无论成功失败，都关闭加载状态
						this.registerLoading = false;
					}
				});
			}).catch(err => {
				console.log('表单错误：', err);
			});
		},
		showForgotPasswordModal() {
			this.$refs.forgotPasswordPopup.open();
			// 清空表单
			this.forgotPasswordForm = {
				username: '',
				security_question_answer: '',
				newPassword: '',
				confirmPassword: ''
			};
		},
		closeForgotPasswordModal() {
			this.$refs.forgotPasswordPopup.close();
		},
		handleForgotPassword() {
			this.$refs.forgotPasswordForm.validate().then(res => {
				// 显示加载状态
				this.forgotPasswordLoading = true;
				
				// 准备找回密码数据
				const recoverData = {
					username: this.forgotPasswordForm.username,
					security_question_answer: this.forgotPasswordForm.security_question_answer,
					new_password: this.forgotPasswordForm.newPassword
				};
				
				// 发送找回密码请求到服务器
				uni.request({
					url: this.$apiUrl + 'recover_password',
					method: 'POST',
					data: recoverData,
					header: {
						'Content-Type': 'application/json'
					},
					success: (res) => {
						console.log('找回密码响应：', res);
						
						if (res.statusCode === 200) {
							// 密码修改成功
							uni.showToast({
								title: '密码修改成功',
								icon: 'success',
								duration: 1500
							});
							
							// 关闭找回密码弹框
							this.closeForgotPasswordModal();
							
							// 清空登录表单
							this.formData = {
								username: '',
								password: ''
							};
						} else {
							// 密码修改失败
							uni.showToast({
								title: res.data.message || '用户名或密保答案错误',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						// 请求失败
						console.error('找回密码请求失败：', err);
						uni.showToast({
							title: '网络错误，请稍后重试',
							icon: 'none'
						});
					},
					complete: () => {
						// 无论成功失败，都关闭加载状态
						this.forgotPasswordLoading = false;
					}
				});
			}).catch(err => {
				console.log('表单错误：', err);
			});
		},
		toggleAgreement() {
			this.isAgreed = !this.isAgreed;
		},
		showAgreement() {
			this.$refs.agreementPopup.open();
		},
		closeAgreement() {
			this.$refs.agreementPopup.close();
		}
		}
	}
</script>

<style>
.container {
	min-height: 100vh;
	background: linear-gradient(135deg, #fff5f7 0%, #ffe8ec 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20rpx;
}
.login-box {
	width: 100%;
	max-width: 700rpx;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 50rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	margin: 0 auto;
}

.title {
	font-size: 48px;
	font-weight: bold;
	color: #333;
	text-align: center;
	margin-bottom: 10rpx;
}

.subtitle {
	font-size: 28rpx;
	color: #666;
	text-align: center;
		margin-bottom: 50rpx;
	}

.login-btn {
	width: 100%;
	height: 90rpx;
	line-height: 90rpx;
	background: linear-gradient(to right, #FF6B8B, #FF8BA0);
	color: #fff;
	border-radius: 12rpx;
	font-size: 34rpx;
	margin-top: 50rpx;
}

.login-btn[disabled] {
	background: #ffd1dc;
}

.login-btn:hover {
	transform: scale(1.01);
}

.links {
	display: flex;
	justify-content: space-between;
	margin-top: 40rpx;
}

.link {
	font-size: 28rpx;
	color: #FF6B8B;
	display: inline-block;
}

.link:hover {
	transform: scale(1.01);
}

/* 注册弹框样式 */
.register-modal {
	width: 600rpx;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 40rpx;
}

.modal-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	text-align: center;
	margin-bottom: 30rpx;
}

.modal-footer {
	display: flex;
	justify-content: space-between;
	gap: 20rpx;
	margin-top: 30rpx;
}

.cancel-btn, .confirm-btn {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 8rpx;
	font-size: 32rpx;
}

.cancel-btn {
	background: #f8f9fa;
	color: #FF6B8B;
	border: none;
}

.confirm-btn {
	background: linear-gradient(to right, #FF6B8B, #FF8BA0);
	color: #fff;
	border: none;
}

.confirm-btn[disabled] {
	background: #ffd1dc;
}

/* 输入框聚焦时边框色 */
:deep(.uni-easyinput__content.is-focused) {
	border-color: #FF6B8B !important;
}

:deep(.uni-easyinput__content) {
	height: 90rpx !important;
	background-color: #f8f8f8 !important;
	border-radius: 12rpx !important;
}

:deep(.uni-easyinput__content-input) {
	height: 90rpx !important;
	font-size: 30rpx !important;
}

:deep(.uni-easyinput__placeholder-class) {
	font-size: 30rpx !important;
	color: #999 !important;
}

:deep(.uni-icons) {
	font-size: 36rpx !important;
	color: #666 !important;
}

:deep(.uni-forms-item) {
	margin-bottom: 30rpx !important;
}

:deep(.uni-forms-item__label) {
	font-size: 30rpx !important;
	color: #FF6B8B !important;
	margin-bottom: 12rpx !important;
}

.agreement {
	margin-top: 30rpx;
	padding: 0;
}

.custom-checkbox-container {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	-webkit-tap-highlight-color: transparent; /* 防止移动端点击出现高亮 */
	cursor: pointer;
}

.custom-checkbox {
	width: 32rpx;
	height: 32rpx;
	border: 2rpx solid #ddd;
	border-radius: 6rpx;
	margin-right: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
	background-color: #fff;
}

.custom-checkbox.checked {
	background-color: #FF6B8B;
	border-color: #FF6B8B;
}

.checkbox-icon {
	font-size: 24rpx;
	color: #fff;
	line-height: 24rpx;
}

.agreement-text {
	color: #666;
}

.agreement-link {
	color: #FF6B8B;
	margin-left: 4rpx;
}

/* 用户协议弹框样式 */
.agreement-modal {
	width: 600rpx;
	background: #ffffff;
	border-radius: 20rpx;
	padding: 40rpx;
}

.agreement-content {
	height: 600rpx;
	padding: 20rpx 0;
}

.agreement-section {
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
}

.section-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

/* 修改现有的 modal-footer 样式 */
.modal-footer {
	display: flex;
	justify-content: center;
	margin-top: 30rpx;
}

.modal-footer .confirm-btn {
	width: 80%;
}

/* 禁止所有表单元素默认的焦点样式 */
:deep(*:focus) {
	outline: none !important;
}
</style>
