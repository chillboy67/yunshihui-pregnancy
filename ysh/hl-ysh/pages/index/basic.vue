<template>
	<view class="container">
		<uni-card title="个人资料卡" :is-shadow="false">
			<uni-forms ref="form" :model="profile" :rules="rules">
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

				<view class="button-group">
					<button class="save-button" @click="submitForm">保存</button>
				</view>
			</uni-forms>
		</uni-card>
	</view>
</template>

<script>
export default {
	data() {
		// 从本地存储获取用户资料
		const username = uni.getStorageSync("username");
		let profileData = {
			age: "",
			last_menstrual_date: "",
			activity_level: ""
		};

		// 如果有用户名，尝试获取该用户的本地数据
		if (username) {
			const localProfile = uni.getStorageSync(`userProfile_${username}`);
			if (localProfile) {
				try {
					profileData = JSON.parse(localProfile);
				} catch (e) {
					console.error('解析本地用户资料失败：', e);
				}
			}
		}

		return {
			profile: profileData,
			activityLevels: [{
				text: "第一类：静态生活方式/坐位工作",
				value: "低"
			}, {
				text: "第二类：主要是站着或走着工作",
				value: "中"
			}, {
				text: "第三类：高强度职业工作",
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
			}
		};
	},
	onLoad() {
		// 如果没有本地数据，则从服务器获取
		const username = uni.getStorageSync("username");
		if (username && !uni.getStorageSync(`userProfile_${username}`)) {
			this.getUserProfile();
		}
	},
	methods: {
		// 获取用户资料
		async getUserProfile() {
			const username = uni.getStorageSync("username");
			if (!username) {
				uni.showToast({
					title: "请先登录",
					icon: "none"
				});
				return;
			}

			try {
				const response = await uni.request({
					url: this.$apiUrl + 'get_profile',
					method: "GET",
					data: {
						username: username
					}
				});

				if (response.statusCode === 200 && response.data.profile) {
					this.profile = response.data.profile;
					// 保存到本地存储，使用用户名作为标识
					uni.setStorageSync(`userProfile_${username}`, JSON.stringify(this.profile));
				}
			} catch (error) {
				console.error('获取用户资料失败：', error);
				uni.showToast({
					title: "获取资料失败",
					icon: "none"
				});
			}
		},
		// 活动水平选择处理方法
		handleActivityChange(value) {
			this.profile.activity_level = value;
		},
		// 表单提交
		submitForm() {
			this.$refs.form.validate().then(async (res) => {
				await this.updateProfile();
			}).catch(err => {
				console.log('表单错误：', err);
			})
		},
		async updateProfile() {
			const username = uni.getStorageSync("username");
			if (!username) {
				uni.showToast({
					title: "请先登录",
					icon: "none"
				});
				return;
			}

			try {
				const response = await uni.request({
					url: this.$apiUrl + 'update_profile',
					method: "POST",
					data: {
						username: username,
						profile: this.profile
					}
				});

				if (response.statusCode === 200) {
					// 更新成功后，保存到本地存储，使用用户名作为标识
					uni.setStorageSync(`userProfile_${username}`, JSON.stringify(this.profile));

					uni.showToast({
						title: "资料更新成功",
						icon: "success"
					});
				} else {
					uni.showToast({
						title: response.data.message || "更新失败",
						icon: "none"
					});
				}
			} catch (error) {
				uni.showToast({
					title: "请求失败，请重试",
					icon: "none"
				});
			}
		}
	}
};
</script>

<style scoped>
.container {
	padding: 12px;
	background-color: #f5f5f5;
	min-height: 100vh;
}

:deep(.uni-card) {
	margin: 0 !important;
	padding: 0 !important;
	border-radius: 8px;
}

:deep(.uni-card__header) {
	padding: 16px !important;
	border-bottom: 1px solid #eee;
}

:deep(.uni-card__content) {
	padding: 16px !important;
}

:deep(.uni-forms-item__label) {
	color: #333 !important;
}

:deep(.uni-easyinput__content),
:deep(.uni-date),
:deep(.uni-data-select) {
	border: 1px solid #ddd !important;
	border-radius: 4px !important;
	height: 40px !important;
}

/* 修复日期选择器双边框问题 */
:deep(.uni-date-editor--x) {
	border: none !important;
}

:deep(.uni-date-x) {
	border: none !important;
}

:deep(.uni-date-editor .uni-date__x-input) {
	height: 38px !important;
}

.button-group {
	margin-top: 24px;
}

.save-button {
	width: 100%;
	background-color: #007aff;
	color: #fff;
	border-radius: 4px;
	font-size: 16px;
	height: 44px;
	line-height: 44px;
	border: none;
}

.save-button:active {
	opacity: 0.8;
}

.activity-level-hint {
	margin-top: 8px;
	font-size: 14px;
	color: #666;
}

.level-text {
	color: #007aff;
	font-weight: 500;
}
</style>