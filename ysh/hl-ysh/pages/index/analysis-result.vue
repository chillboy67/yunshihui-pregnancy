  <template>
	<view class="container">
		<view class="header">
			<text class="title">营养分析结果</text>
			<text class="subtitle">根据您目前所在的孕周、年龄和体力活动水平计算</text>
			
			<view class="save-button-container">
				<button class="save-btn" @tap="saveAnalysisResult" :disabled="isSaved || isLoadingSave" size="mini">
					{{ isSaved ? '已保存' : (isLoadingSave ? '保存中...' : '保存记录') }}
				</button>
			</view>
		</view>
		
		<view class="selected-foods">
			<view class="foods-header">
				<text class="foods-title">已选食物</text>
				<text class="foods-count">共{{selectedFoods.length}}种</text>
			</view>
			<view class="meal-sections">
				<view class="meal-section" v-for="(meal, index) in mealTypes" :key="index">
					<view class="meal-header">
						<text class="meal-title">{{meal.name}}</text>
						<text class="meal-count">已选{{getMealCount(meal.type)}}种</text>
					</view>
					<view class="foods-list">
						<view class="food-item" v-for="(food, foodIndex) in getMealFoods(meal.type)" :key="foodIndex">
							<view class="food-info">
								<text class="food-name">{{food.name}}</text>
								<text class="food-amount">{{food.amount}}g</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="energy-section">
			<view class="energy-card">
				<view class="energy-header">
					<text class="energy-title">总能量摄入</text>
					<view class="energy-value">
						<text class="value">{{Number.isInteger(nutritionData.energy) ? nutritionData.energy : nutritionData.energy.toFixed(2)}}</text>
						<text class="unit">kcal</text>
					</view>
				</view>
				<view class="energy-details">
					<view class="recommended-value" v-if="recommendedValues.energy">
						<text class="recommended-label">推荐摄入</text>
						<text class="recommended-num">{{Number.isInteger(recommendedValues.energy) ? recommendedValues.energy : recommendedValues.energy.toFixed(2)}}</text>
						<text class="recommended-unit">kcal/d</text>
					</view>
					<view class="energy-tips" v-if="recommendedValues.energy">
						<text class="tip-text" v-if="nutritionData.energy < recommendedValues.energy * 0.9">当前摄入偏低，建议适当增加饮食</text>
						<text class="tip-text" v-else-if="nutritionData.energy > recommendedValues.energy * 1.1">当前摄入偏高，建议适当控制饮食</text>
						<text class="tip-text" v-else>当前摄入合理，继续保持</text>
					</view>
				</view>
			</view>
			
			<view class="ratio-card">
				<text class="ratio-title">供能比</text>
				<view class="ratio-chart">
					<view class="ratio-item">
						<view class="ratio-header">
							<view class="ratio-dot" :style="{ backgroundColor: proteinStatus.color }"></view>
							<text class="ratio-name">蛋白质</text>
							<text class="ratio-value">{{proteinRatio}}%</text>
							<text class="ratio-range">正常范围: 10%-20%</text>
						</view>
						<view class="ratio-bar">
							<view class="ratio-bar-fill" :style="{ width: proteinRatio + '%', background: proteinStatus.gradient }"></view>
						</view>
						<text class="ratio-status" :style="{ color: proteinStatus.color }">{{proteinStatus.text}}</text>
					</view>
					<view class="ratio-item">
						<view class="ratio-header">
							<view class="ratio-dot" :style="{ backgroundColor: fatStatus.color }"></view>
							<text class="ratio-name">脂肪</text>
							<text class="ratio-value">{{fatRatio}}%</text>
							<text class="ratio-range">正常范围: 20%-30%</text>
						</view>
						<view class="ratio-bar">
							<view class="ratio-bar-fill" :style="{ width: fatRatio + '%', background: fatStatus.gradient }"></view>
						</view>
						<text class="ratio-status" :style="{ color: fatStatus.color }">{{fatStatus.text}}</text>
					</view>
					<view class="ratio-item">
						<view class="ratio-header">
							<view class="ratio-dot" :style="{ backgroundColor: carbStatus.color }"></view>
							<text class="ratio-name">碳水化合物</text>
							<text class="ratio-value">{{carbRatio}}%</text>
							<text class="ratio-range">正常范围: 50%-65%</text>
						</view>
						<view class="ratio-bar">
							<view class="ratio-bar-fill" :style="{ width: carbRatio + '%', background: carbStatus.gradient }"></view>
						</view>
						<text class="ratio-status" :style="{ color: carbStatus.color }">{{carbStatus.text}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="nutrition-table">
			<text class="table-subtitle">参考<text class="guide-name">《中国居民膳食营养素参考摄入量2023》</text></text>
			<view class="table-header">
				<text class="header-cell">营养素</text>
				<text class="header-cell">实际摄入</text>
				<text class="header-cell">推荐摄入</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">蛋白质</text>
				<text class="row-cell actual">{{nutritionData.protein.toFixed(1)}}g</text>
				<text class="row-cell recommended">{{recommendedValues.protein}}g/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">脂肪</text>
				<text class="row-cell actual">{{nutritionData.fat.toFixed(1)}}g</text>
				<text class="row-cell recommended">{{recommendedValues.fat.min.toFixed(1)}}~{{recommendedValues.fat.max.toFixed(1)}}g/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">碳水化合物</text>
				<text class="row-cell actual">{{nutritionData.carbohydrate.toFixed(1)}}g</text>
				<text class="row-cell recommended">{{recommendedValues.carbohydrate.min.toFixed(1)}}~{{recommendedValues.carbohydrate.max.toFixed(1)}}g/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">膳食纤维</text>
				<text class="row-cell actual">{{nutritionData.fiber.toFixed(1)}}g</text>
				<text class="row-cell recommended">{{recommendedValues.fiber.min}}~{{recommendedValues.fiber.max}}g/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">维生素A</text>
				<text class="row-cell actual">{{Math.round(nutritionData.vitamins.A)}}μg</text>
				<text class="row-cell recommended">{{recommendedValues.vitamins.A.min}}~{{recommendedValues.vitamins.A.max}}μg/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">维生素B1</text>
				<text class="row-cell actual">{{nutritionData.vitamins.B1.toFixed(1)}}mg</text>
				<text class="row-cell recommended">{{recommendedValues.vitamins.B1}}mg/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">维生素B2</text>
				<text class="row-cell actual">{{nutritionData.vitamins.B2.toFixed(1)}}mg</text>
				<text class="row-cell recommended">{{recommendedValues.vitamins.B2}}mg/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">维生素C</text>
				<text class="row-cell actual">{{Math.round(nutritionData.vitamins.C)}}mg</text>
				<text class="row-cell recommended">{{recommendedValues.vitamins.C.min}}~{{recommendedValues.vitamins.C.max}}mg/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">钙</text>
				<text class="row-cell actual">{{Math.round(nutritionData.calcium)}}mg</text>
				<text class="row-cell recommended">{{recommendedValues.calcium.min}}~{{recommendedValues.calcium.max}}mg/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">铁</text>
				<text class="row-cell actual">{{nutritionData.iron.toFixed(1)}}mg</text>
				<text class="row-cell recommended">{{recommendedValues.iron.min}}~{{recommendedValues.iron.max}}mg/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">锌</text>
				<text class="row-cell actual">{{nutritionData.zinc.toFixed(1)}}mg</text>
				<text class="row-cell recommended">{{recommendedValues.zinc.min}}~{{recommendedValues.zinc.max}}mg/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">硒</text>
				<text class="row-cell actual">{{Math.round(nutritionData.selenium)}}μg</text>
				<text class="row-cell recommended">{{recommendedValues.selenium.min}}~{{recommendedValues.selenium.max}}μg/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">叶酸</text>
				<text class="row-cell actual">{{Math.round(nutritionData.folate)}}μg</text>
				<text class="row-cell recommended">{{recommendedValues.folate.min}}~{{recommendedValues.folate.max}}μg/d</text>
			</view>
			
			<view class="table-row">
				<text class="row-cell">DHA</text>
				<text class="row-cell actual">{{Math.round(nutritionData.DHA)}}mg</text>
				<text class="row-cell recommended">{{recommendedValues.DHA}}mg/d</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectedFoods: [],
			mealTypes: [
				{ name: '早餐', type: 'breakfast' },
				{ name: '午餐', type: 'lunch' },
				{ name: '晚餐', type: 'dinner' }
			],
			nutritionData: {
				energy: 0,
				protein: 0,
				fat: 0,
				carbohydrate: 0,
				fiber: 0,
				vitamins: {
					A: 0,
					B1: 0,
					B2: 0,
					C: 0
				},
				calcium: 0,
				iron: 0,
				zinc: 0,
				selenium: 0,
				folate: 0,
				DHA: 0
			},
			recommendedValues: {
				energy: 0,
				protein: 0,
				fat: { min: 0, max: 0 },
				carbohydrate: { min: 0, max: 0 },
				fiber: { min: 0, max: 0 },
				vitamins: {
					A: { min: 0, max: 0 },
					B1: 0,
					B2: 0,
					C: { min: 0, max: 0 }
				},
				calcium: { min: 0, max: 0 },
				iron: { min: 0, max: 0 },
				zinc: { min: 0, max: 0 },
				selenium: { min: 0, max: 0 },
				folate: { min: 0, max: 0 },
				DHA: 0
			},
			isSaved: false, // 标记是否已保存
			isLoadingSave: false // 标记是否正在保存
		}
	},
	computed: {
		userProfile() {
			const username = uni.getStorageSync('username');
			if (!username) return null;
			const userProfileStr = uni.getStorageSync(`userProfile_${username}`);
			return userProfileStr ? JSON.parse(userProfileStr) : null;
		},
		pregnancyStage() {
			if (!this.userProfile || !this.userProfile.last_menstrual_date) return null;
			
			const lastMenstrualDate = new Date(this.userProfile.last_menstrual_date);
			const today = new Date();
			const diffDays = Math.ceil((today - lastMenstrualDate) / (1000 * 60 * 60 * 24));
			const weeks = Math.floor(diffDays / 7);
			
			if (weeks < 12) return '孕早期';
			if (weeks < 28) return '孕中期';
			if (weeks < 40) return '孕晚期';
			return '哺乳期';
		},
		ageGroup() {
			if (!this.userProfile || !this.userProfile.age) return null;
			const age = parseInt(this.userProfile.age);
			return age >= 18 && age <= 29 ? '18-29' : '30-49';
		},
		proteinEnergy() {
			return this.nutritionData.protein * 4;
		},
		fatEnergy() {
			return this.nutritionData.fat * 9;
		},
		carbEnergy() {
			return this.nutritionData.carbohydrate * 4;
		},
		totalEnergy() {
			return this.proteinEnergy + this.fatEnergy + this.carbEnergy;
		},
		proteinRatio() {
			return this.totalEnergy > 0 ? ((this.proteinEnergy / this.totalEnergy) * 100).toFixed(1) : '0.0';
		},
		fatRatio() {
			return this.totalEnergy > 0 ? ((this.fatEnergy / this.totalEnergy) * 100).toFixed(1) : '0.0';
		},
		carbRatio() {
			return this.totalEnergy > 0 ? ((this.carbEnergy / this.totalEnergy) * 100).toFixed(1) : '0.0';
		},
		proteinStatus() {
			const ratio = parseFloat(this.proteinRatio);
			if (ratio < 10) {
				return {
					color: '#FF6B8B',
					gradient: 'linear-gradient(90deg, #FF6B8B, #FF8E9E)',
					text: '偏低'
				};
			} else if (ratio > 20) {
				return {
					color: '#FF6B8B',
					gradient: 'linear-gradient(90deg, #FF6B8B, #FF8E9E)',
					text: '偏高'
				};
			} else {
				return {
					color: '#FF6B8B',
					gradient: 'linear-gradient(90deg, #FF6B8B, #FF8E9E)',
					text: '正常'
				};
			}
		},
		fatStatus() {
			const ratio = parseFloat(this.fatRatio);
			if (ratio < 20) {
				return {
					color: '#4CAF50',
					gradient: 'linear-gradient(90deg, #4CAF50, #66BB6A)',
					text: '偏低'
				};
			} else if (ratio > 30) {
				return {
					color: '#4CAF50',
					gradient: 'linear-gradient(90deg, #4CAF50, #66BB6A)',
					text: '偏高'
				};
			} else {
				return {
					color: '#4CAF50',
					gradient: 'linear-gradient(90deg, #4CAF50, #66BB6A)',
					text: '正常'
				};
			}
		},
		carbStatus() {
			const ratio = parseFloat(this.carbRatio);
			if (ratio < 50) {
				return {
					color: '#2196F3',
					gradient: 'linear-gradient(90deg, #2196F3, #42A5F5)',
					text: '偏低'
				};
			} else if (ratio > 65) {
				return {
					color: '#2196F3',
					gradient: 'linear-gradient(90deg, #2196F3, #42A5F5)',
					text: '偏高'
				};
			} else {
				return {
					color: '#2196F3',
					gradient: 'linear-gradient(90deg, #2196F3, #42A5F5)',
					text: '正常'
				};
			}
		}
	},
	watch: {
		'userProfile': {
			handler: 'calculateRecommendedValues',
			immediate: true
		},
		'pregnancyStage': {
			handler: 'calculateRecommendedValues',
			immediate: true
		}
	},
	methods: {
		calculateRecommendedValues() {
			if (!this.userProfile || !this.pregnancyStage || !this.ageGroup) return;
			
			const activityLevel = this.userProfile.activity_level;
			const ageGroup = this.ageGroup;
			const stage = this.pregnancyStage;
			
			// Calculate recommended energy based on age, activity level and pregnancy stage
			let energy = 0;
			if (stage === '孕早期') {
				if (activityLevel === '低') energy = 1700;
				else if (activityLevel === '中') energy = ageGroup === '18-29' ? 2100 : 2050;
				else if (activityLevel === '高') energy = ageGroup === '18-29' ? 2450 : 2400;
			} else if (stage === '孕中期') {
				if (activityLevel === '低') energy = 1950;
				else if (activityLevel === '中') energy = ageGroup === '18-29' ? 2350 : 2300;
				else if (activityLevel === '高') energy = ageGroup === '18-29' ? 2700 : 2650;
			} else if (stage === '孕晚期') {
				if (activityLevel === '低') energy = 2100;
				else if (activityLevel === '中') energy = ageGroup === '18-29' ? 2500 : 2450;
				else if (activityLevel === '高') energy = ageGroup === '18-29' ? 2850 : 2800;
			} else if (stage === '哺乳期') {
				if (activityLevel === '低') energy = 2100;
				else if (activityLevel === '中') energy = ageGroup === '18-29' ? 2500 : 2450;
				else if (activityLevel === '高') energy = ageGroup === '18-29' ? 2850 : 2800;
			}
			
			this.recommendedValues.energy = energy;
			
			// Calculate recommended nutrients based on pregnancy stage
			if (stage === '孕早期') {
				this.recommendedValues.protein = 55;
				this.recommendedValues.fat = {
					min: energy * 0.20 / 9,
					max: energy * 0.30 / 9
				};
				this.recommendedValues.carbohydrate = {
					min: energy * 0.50 / 4,
					max: energy * 0.60 / 4
				};
				this.recommendedValues.fiber = { min: 25, max: 30 };
				this.recommendedValues.vitamins.A = { min: 660, max: 3000 };
				this.recommendedValues.vitamins.B1 = 1.2;
				this.recommendedValues.vitamins.B2 = 1.2;
				this.recommendedValues.vitamins.C = { min: 100, max: 2000 };
				this.recommendedValues.calcium = { min: 800, max: 2000 };
				this.recommendedValues.iron = { min: 18, max: 42 };
				this.recommendedValues.zinc = { min: 10.5, max: 40 };
				this.recommendedValues.selenium = { min: 65, max: 400 };
				this.recommendedValues.folate = { min: 600, max: 1000 };
				this.recommendedValues.DHA = 200;
			} else if (stage === '孕中期') {
				this.recommendedValues.protein = 70;
				this.recommendedValues.fat = {
					min: energy * 0.20 / 9,
					max: energy * 0.30 / 9
				};
				this.recommendedValues.carbohydrate = {
					min: energy * 0.50 / 4,
					max: energy * 0.60 / 4
				};
				this.recommendedValues.fiber = { min: 29, max: 34 };
				this.recommendedValues.vitamins.A = { min: 730, max: 3000 };
				this.recommendedValues.vitamins.B1 = 1.4;
				this.recommendedValues.vitamins.B2 = 1.3;
				this.recommendedValues.vitamins.C = { min: 115, max: 2000 };
				this.recommendedValues.calcium = { min: 800, max: 2000 };
				this.recommendedValues.iron = { min: 25, max: 42 };
				this.recommendedValues.zinc = { min: 10.5, max: 40 };
				this.recommendedValues.selenium = { min: 65, max: 400 };
				this.recommendedValues.folate = { min: 600, max: 1000 };
				this.recommendedValues.DHA = 200;
			} else if (stage === '孕晚期') {
				this.recommendedValues.protein = 85;
				this.recommendedValues.fat = {
					min: energy * 0.20 / 9,
					max: energy * 0.30 / 9
				};
				this.recommendedValues.carbohydrate = {
					min: energy * 0.50 / 4,
					max: energy * 0.60 / 4
				};
				this.recommendedValues.fiber = { min: 29, max: 34 };
				this.recommendedValues.vitamins.A = { min: 730, max: 3000 };
				this.recommendedValues.vitamins.B1 = 1.5;
				this.recommendedValues.vitamins.B2 = 1.4;
				this.recommendedValues.vitamins.C = { min: 115, max: 2000 };
				this.recommendedValues.calcium = { min: 800, max: 2000 };
				this.recommendedValues.iron = { min: 29, max: 42 };
				this.recommendedValues.zinc = { min: 10.5, max: 40 };
				this.recommendedValues.selenium = { min: 65, max: 400 };
				this.recommendedValues.folate = { min: 600, max: 1000 };
				this.recommendedValues.DHA = 200;
			} else if (stage === '哺乳期') {
				this.recommendedValues.protein = 80;
				this.recommendedValues.fat = {
					min: energy * 0.20 / 9,
					max: energy * 0.30 / 9
				};
				this.recommendedValues.carbohydrate = {
					min: energy * 0.50 / 4,
					max: energy * 0.60 / 4
				};
				this.recommendedValues.fiber = { min: 29, max: 34 };
				this.recommendedValues.vitamins.A = { min: 1260, max: 3000 };
				this.recommendedValues.vitamins.B1 = 1.5;
				this.recommendedValues.vitamins.B2 = 1.7;
				this.recommendedValues.vitamins.C = { min: 100, max: 2000 };
				this.recommendedValues.calcium = { min: 800, max: 2000 };
				this.recommendedValues.iron = { min: 24, max: 42 };
				this.recommendedValues.zinc = { min: 13, max: 40 };
				this.recommendedValues.selenium = { min: 78, max: 400 };
				this.recommendedValues.folate = { min: 550, max: 1000 };
				this.recommendedValues.DHA = 200;
			}
		},
		saveAnalysisResult() {
			// 如果已保存或正在保存，则不执行
			if (this.isSaved || this.isLoadingSave) return;

			const username = uni.getStorageSync('username');
			if (!username) {
				uni.showToast({ title: '请先登录', icon: 'none' });
				return;
			}

			this.isLoadingSave = true; // 开始保存
			uni.showLoading({ title: '保存中...' });

			uni.request({
				url: this.$apiUrl + 'save_analysis_history', // 调用后端保存接口
				method: 'POST',
				data: {
					username: username,
					// 确保 selectedFoods 和 nutritionData 是最新的
					selectedFoods: this.selectedFoods,
					nutritionData: this.nutritionData
				},
				header: {
					'Content-Type': 'application/json'
				},
				success: (res) => {
					if (res.statusCode === 200 && res.data.message) {
						uni.showToast({ title: '保存成功', icon: 'success' });
						this.isSaved = true; // 更新按钮状态为“已保存”
					} else {
						// 尝试显示后端返回的更详细错误
						const detail = res.data && res.data.detail ? res.data.detail : '保存失败';
						uni.showToast({ title: detail, icon: 'none' });
						console.error('保存分析记录失败 (后端):', res.data);
					}
				},
				fail: (err) => {
					console.error('保存分析记录请求失败 (网络):', err);
					uni.showToast({ title: '保存失败，请检查网络', icon: 'none' });
				},
				complete: () => {
					this.isLoadingSave = false; // 结束保存状态
					uni.hideLoading();
				}
			});
		},
		getMealCount(mealType) {
			return this.selectedFoods.filter(food => food.mealType === mealType).length;
		},
		getMealFoods(mealType) {
			return this.selectedFoods.filter(food => food.mealType === mealType);
		}
	},
	onLoad(options) {
		console.log('Analysis Result Page - 接收到的参数:', options); // 添加日志，区分页面

		if (options.historyRecord) {
			try {
				// 解析从 URL 传递过来的 JSON 字符串
				const historyRecord = JSON.parse(decodeURIComponent(options.historyRecord));
				console.log('解析后的历史记录:', historyRecord);

				// 确保解析成功且是对象
				if (historyRecord && typeof historyRecord === 'object') {
					// 使用历史记录的数据填充页面 data
					this.nutritionData = historyRecord.nutritionData;
					this.selectedFoods = historyRecord.selectedFoods;

					 this.calculateRecommendedValues();

					if (historyRecord.date) {
						uni.setNavigationBarTitle({ title: `${historyRecord.date} 的分析结果` });
					}

					// 禁用“保存记录”按钮，因为这是查看历史
					this.isSaved = true; 

					// 数据结构检查
					if (!this.nutritionData.vitamins || typeof this.nutritionData.vitamins !== 'object') {
						console.error('历史记录维生素数据结构错误:', this.nutritionData.vitamins);
						// 提供默认值以防页面渲染错误
						this.nutritionData.vitamins = { A: 0, B1: 0, B2: 0, C: 0 }; 
					}

					console.log('已使用历史记录数据填充页面。');
					return; // 处理完历史记录，直接结束 onLoad
				} else {
					console.error('解析出的 historyRecord 格式不正确:', historyRecord);
				}
			} catch (error) {
				console.error('解析 historyRecord 参数时出错:', error);
				// 解析失败，可以给用户提示，或者继续执行下面的默认逻辑
				uni.showToast({ title: '加载历史记录失败', icon: 'none' });
			}
		}

		// --- 如果不是查看历史记录，执行原有的 onLoad 逻辑 (处理实时分析结果) ---
		console.log('非历史记录模式，加载实时分析结果...');
		if (options.nutritionData) {
			try {
				const parsedData = JSON.parse(decodeURIComponent(options.nutritionData));
				console.log('解析后的实时营养数据:', parsedData);

				if (parsedData && typeof parsedData === 'object') {
					this.nutritionData = parsedData;
					// (原有的数据检查逻辑)
					if (!this.nutritionData.vitamins || typeof this.nutritionData.vitamins !== 'object') {
						console.error('实时维生素数据结构错误:', this.nutritionData.vitamins);
						this.nutritionData.vitamins = { A: 0, B1: 0, B2: 0, C: 0 };
					}
				} else {
					console.error('实时营养数据格式不正确:', parsedData);
				}
			} catch (error) {
				console.error('解析实时 nutritionData 参数时出错:', error);
			}
		} else {
			console.error('未接收到 nutritionData 参数');
		}

		if (options.selectedFoods) {
			try {
				this.selectedFoods = JSON.parse(decodeURIComponent(options.selectedFoods));
				console.log('解析后的实时选中食物:', this.selectedFoods);
			} catch (error) {
				console.error('解析实时 selectedFoods 参数时出错:', error);
			}
		} else {
			console.error('未接收到 selectedFoods 参数');
		}

		this.calculateRecommendedValues(); 
	},
}
</script>

<style>
.container {
	padding: 20rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
	text-align: center;
	margin-bottom: 40rpx;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.subtitle {
	font-size: 28rpx;
	color: #666;
}

.selected-foods {
	background: #fff;
	border-radius: 20rpx;
	padding: 20rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.foods-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.foods-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.foods-count {
	font-size: 24rpx;
	color: #999;
}

.meal-sections {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.meal-section {
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 16rpx;
}

.meal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12rpx;
}

.meal-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.meal-count {
	font-size: 24rpx;
	color: #999;
}

.foods-list {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.food-item {
	background: #fff;
	border-radius: 8rpx;
	padding: 12rpx 16rpx;
}

.food-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.food-name {
	font-size: 26rpx;
	color: #666;
}

.food-amount {
	font-size: 26rpx;
	color: #FF6B8B;
	font-weight: 500;
}

.energy-section {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	margin-bottom: 30rpx;
}

.energy-card {
	background: linear-gradient(135deg, #fff, #f8f9fa);
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.energy-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.energy-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.energy-value {
	display: flex;
	align-items: baseline;
}

.value {
	font-size: 48rpx;
	font-weight: bold;
	color: #FF6B8B;
}

.unit {
	font-size: 24rpx;
	color: #999;
	margin-left: 8rpx;
}

.energy-details {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.recommended-value {
	background: linear-gradient(135deg, #f0f9f0, #e8f5e9);
	border-radius: 12rpx;
	padding: 16rpx 20rpx;
	display: flex;
	align-items: center;
}

.recommended-label {
	font-size: 26rpx;
	color: #4CAF50;
	margin-right: 10rpx;
}

.recommended-num {
	font-size: 28rpx;
	font-weight: bold;
	color: #4CAF50;
}

.recommended-unit {
	font-size: 26rpx;
	color: #4CAF50;
	margin-left: 8rpx;
}

.energy-tips {
	background: linear-gradient(135deg, #fff8f8, #ffebee);
	border-radius: 12rpx;
	padding: 16rpx 20rpx;
	border: 1rpx solid rgba(255, 107, 139, 0.2);
}

.tip-text {
	font-size: 26rpx;
	color: #FF6B8B;
}

.ratio-card {
	background: linear-gradient(135deg, #fff, #f8f9fa);
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.ratio-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 24rpx;
	display: block;
}

.ratio-chart {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.ratio-item {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.ratio-header {
	display: flex;
	align-items: center;
	gap: 12rpx;
	flex-wrap: wrap;
}

.ratio-dot {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
}

.ratio-name {
	font-size: 26rpx;
	color: #666;
	flex: 1;
}

.ratio-value {
	font-size: 26rpx;
	font-weight: bold;
	color: #333;
	min-width: 60rpx;
	text-align: right;
}

.ratio-range {
	font-size: 24rpx;
	color: #999;
	width: 100%;
	margin-top: 4rpx;
}

.ratio-bar {
	height: 10rpx;
	background-color: #f5f5f5;
	border-radius: 5rpx;
	overflow: hidden;
	margin: 8rpx 0;
}

.ratio-bar-fill {
	height: 100%;
	border-radius: 5rpx;
	transition: width 0.3s ease;
}

.ratio-status {
	font-size: 24rpx;
	font-weight: bold;
}

.nutrition-table {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 20rpx;
	margin-bottom: 40rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.table-header {
	display: flex;
	padding: 20rpx 0;
	border-bottom: 2rpx solid #eee;
	margin-bottom: 20rpx;
}

.header-cell {
	flex: 1;
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	text-align: center;
}

.header-cell:first-child {
	text-align: left;
}

.table-row {
	display: flex;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.row-cell {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	text-align: center;
}

.row-cell:first-child {
	text-align: left;
}

.actual {
	color: #FF6B8B;
	font-size: 28rpx;
}

.recommended {
	color: #4CAF50;
	font-size: 28rpx;
}

.table-subtitle {
	font-size: 26rpx;
	color: #666;
	text-align: center;
	margin-bottom: 20rpx;
	display: block;
}

.guide-name {
	color: #FF6B8B;
	font-weight: 600;
}

.save-button-container {
    position: absolute; /* 绝对定位，相对于 .header */
    top: 20rpx; /* 距离 .header 顶部 */
    right: 20rpx; /* 距离 .header 右侧 */
}

.save-btn {
    background-color: #FF6B8B;
    color: white;
    border-radius: 30rpx;
    font-size: 24rpx;
    padding: 8rpx 20rpx; /* 调整内边距 */
    line-height: normal;
    margin: 0;
    /* 添加过渡效果 */
    transition: background-color 0.3s ease;
}

/* 禁用状态的样式 */
.save-btn[disabled] {
    background-color: #cccccc;
    color: #666666;
    opacity: 0.7; /* 添加透明度以示禁用 */
}
</style> 