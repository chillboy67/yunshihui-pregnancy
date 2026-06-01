<template>
	<view class="container">
		<view class="content-wrapper">
			<view class="sidebar">
				<scroll-view scroll-y class="category-list">
					<view 
						v-for="(category, index) in categories" 
						:key="index"
						:class="['category-item', { active: currentCategory === index }]"
						@click="selectCategory(index)"
					>
						<text>{{category.name}}</text>
					</view>
				</scroll-view>
			</view>
			
			<view class="main-content">
				<!-- <view v-if="isLoadingCategory" class="loading-indicator">
					<uni-load-more status="loading" :showIcon="true"></uni-load-more>
				</view> -->
				<scroll-view scroll-y class="food-list" v-if="!isLoadingCategory">
					<view class="food-item" v-for="(food, index) in currentFoods" :key="index">
						<image class="food-image" :src="food.image" mode="aspectFill" lazy-load="true"></image>
						<view class="food-info">
							<text class="food-name">{{food.name}}</text>
							<text class="food-desc">{{food.description}}</text>
						</view>
						<view class="add-btn" @click="showInputDialog(food)">
							<uni-icons type="plus" size="24" color="#FF6B8B"></uni-icons>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<!-- 底部购物车栏 -->
		<view class="cart-bar">
			<view class="cart-left" @click="toggleCartPanel">
				<view class="cart-icon">
					<image class="custom-cart-icon" src="/static/images/dish.png"></image>
					<!-- 购物车图标修改 -->
					<view class="cart-badge" v-if="cartItems.length">{{cartItems.length}}</view>
				</view>
				<view class="cart-info">
					<text class="cart-total">共{{cartItems.length}}件食物</text>
					<text class="cart-weight">总重量约{{totalWeight}}g</text>
				</view>
			</view>
			<view class="cart-right" @click="analyze">
				<text>去分析</text>
			</view>
		</view>

		<!-- 购物车面板 -->
		<uni-popup ref="cartPopup" type="bottom" :mask-click="true" @change="onCartPopupChange">
					<view class="cart-panel">
						<view class="panel-header">
							<view class="header-left">
								<view class="select-all-wrapper" @click="toggleSelectAll">
									<view class="checkbox" :class="{ checked: isAllSelected }">
										<uni-icons v-if="isAllSelected" type="checkmarkempty" size="16" color="#fff"></uni-icons>
									</view>
									<text class="select-all">全选</text>
								</view>
								<text class="total-info">(共{{cartItems.length}}件食物，总重量约{{totalWeight}}g)</text>
							</view>
							<view class="header-right" @click="clearCart">
								<uni-icons type="trash" size="20" color="#999"></uni-icons>
								<text>清空食物车</text>
							</view>
						</view>
						<scroll-view scroll-y class="panel-content">
							<view class="meal-section" v-for="(meal, mealIndex) in mealTypes" :key="mealIndex">
								<view class="meal-header">
									<text class="meal-title">{{meal.name}}</text>
									<text class="meal-count">已选{{getMealCount(meal.type)}}种</text>
								</view>
								<view class="meal-items">
									<view class="cart-item" v-for="(item, index) in getMealItems(meal.type)" :key="index">
										<view class="checkbox" :class="{ checked: item.selected }" @click="toggleSelect(getItemIndex(item))">
											<uni-icons v-if="item.selected" type="checkmarkempty" size="16" color="#fff"></uni-icons>
										</view>
										<text class="item-name">{{item.name}}</text>
										<text class="item-amount">{{item.amount}}g</text>
										<view class="delete-btn" @click="removeFromCart(getItemIndex(item))">
											<uni-icons type="trash" size="20" color="#999"></uni-icons>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</uni-popup>
		
		<uni-popup ref="popup" type="center">
			<view class="input-dialog-content">
				<view class="dialog-header">
					<text class="dialog-title">添加食物</text>
					<text class="dialog-subtitle">请选择餐次并输入克数</text>
				</view>
				<view class="meal-picker">
					<text class="section-label">选择餐次</text>
					<view class="meal-options">
						<view 
							v-for="(meal, index) in mealTypes" 
							:key="index"
							:class="['meal-option', { active: currentMealIndex === index }]"
							@click="currentMealIndex = index"
						>
							<text>{{meal.name}}</text>
						</view>
					</view>
				</view>
				<view class="amount-input">
					<text class="section-label">输入克数(估重)</text>
					<view class="amount-wrapper">
						<input 
							type="number" 
							v-model="inputAmount" 
							placeholder="请输入克数"
							class="amount-field"
						/>
						<text class="amount-unit">g</text>
					</view>
				</view>
				<view class="dialog-buttons">
					<button class="cancel-btn" @click="closeDialog">取消</button>
					<button class="confirm-btn" @click="confirmAmount">确定</button>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="helpPopup" type="center" :mask-click="false">
			<view class="help-popup-content">
				<view class="help-header">
					<text class="help-title">亲爱的孕产妇：</text>
				</view>
				<scroll-view scroll-y class="help-scroll-content">
					<view class="help-paragraph">
						营养分析是根据《中国食物成分表》及《中国居民膳食营养素参考摄入量（2023）》等权威标准，支持您录入每日摄入食物，结合您的孕周、年龄及体力活动水平，自动计算总能量、三大营养素供能比及营养素摄入量，为您提供精准量化的膳食营养分析！
					</view>
					<view class="help-paragraph">			
						为帮助您轻松掌握每日饮食营养，营养分析功能具体步骤及提醒如下：
					</view>
					<view class="help-list">
						<view class="help-list-item">1. 点击食物类别，选择目标食物</view>
						<view class="help-list-item">2. 点击食物右侧“＋”号进行添加</view>
						<view class="help-list-item">3. 选择餐次和输入食用克数</view>
						<view class="help-list-item">4. 点击“去分析”即可查看营养评估</view>
					</view>
				</scroll-view>
				<view class="help-footer">
					<checkbox-group class="help-checkbox" @change="onHelpCheckboxChange">
						<label>
							<checkbox value="true" style="transform:scale(0.7)"/>
							<text>下次不再弹出</text>
						</label>
					</checkbox-group>
					<button class="confirm-btn" @click="closeHelpPopup">我知道了</button>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
import foodsData from '/static/data/foods-data.js';

export default {
	data() {
		return {
			showCartPanel: false,
			currentCategory: 0,
			currentFood: null,
			mealTypes: [
				{ name: '早餐', type: 'breakfast' },
				{ name: '午餐', type: 'lunch' },
				{ name: '晚餐', type: 'dinner' }
			],
			categories: [
				{ name: '谷类及制品', type: 'grain' },
				{ name: '薯类及制品', type: 'potato' },
				{ name: '干豆类及制品', type: 'bean' },
				{ name: '蔬菜类及制品', type: 'vegetable' },
				{ name: '水果类及制品', type: 'fruit' },
				{ name: '坚果类及制品', type: 'nut' },
				{ name: '调味品类', type: 'seasoning' },
				{ name: '畜肉类及制品', type: 'meat' },
				{ name: '禽肉类及制品', type: 'poultry' },
				{ name: '奶类及制品', type: 'dairy' },
				{ name: '蛋类及制品', type: 'egg' },
				{ name: '鱼虾类', type: 'seafood' }
			],
			foods: foodsData,
			cartItems: [],
			currentMealIndex: 0,
			inputAmount: '',
			dontShowAgain: false,
			isLoadingCategory: false,
			imageLoadingStatus: {}
		}
	},
	computed: {
		currentFoods() {
			return this.foods[this.categories[this.currentCategory].type] || [];
		},
		isAllSelected() {
			return this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
		},
		totalWeight() {
			return this.cartItems.reduce((sum, item) => item.selected ? sum + item.amount : sum, 0);
		},
		selectedItems() {
			return this.cartItems.filter(item => item.selected);
		},
		hasSelectedItems() {
			return this.selectedItems.length > 0;
		}
	},
	
	methods: {
		selectCategory(index) {
			if (this.currentCategory === index) {
				return; // 如果点击的是当前分类，则不执行任何操作
			}

			this.isLoadingCategory = true; // 1. 开始加载，准备隐藏旧列表

			// 使用 $nextTick 确保 isLoadingCategory 的变化先生效
			this.$nextTick(() => {
				this.currentCategory = index; // 2. 更新分类索引

				// 再次使用 $nextTick 等待 computed property 'currentFoods' 更新完成
				this.$nextTick(() => {
					this.isLoadingCategory = false; // 3. 加载完成，显示新列表
				});
			});
		},
		getMealCount(mealType) {
			return this.cartItems.filter(item => item.mealType === mealType).length;
		},
		showInputDialog(food) {
			this.currentFood = food;
			this.currentMealIndex = 0;
			this.inputAmount = '';
			this.$refs.popup.open();
		},
		onMealChange(e) {
			this.currentMealIndex = e.detail.value;
		},
		confirmAmount() {
			if (this.currentFood && this.inputAmount) {
				const foodData = {...this.currentFood};
				
				this.cartItems.push({
					name: foodData.name,
					amount: parseInt(this.inputAmount),
					selected: true,
					mealType: this.mealTypes[this.currentMealIndex].type,
					energy: foodData.energy,
					protein: foodData.protein,
					fat: foodData.fat, 
					carbohydrate: foodData.carbohydrate,
					fiber: foodData.fiber,
					vitaminA: foodData.vitaminA,
					vitaminB1: foodData.vitaminB1,
					vitaminB2: foodData.vitaminB2,
					vitaminC: foodData.vitaminC,
					calcium: foodData.calcium,
					iron: foodData.iron,
					zinc: foodData.zinc,
					selenium: foodData.selenium,
					folate: foodData.folate,
					dha: foodData.dha
				});
			}
			this.closeDialog();
		},
		closeDialog() {
			this.currentFood = null;
			this.currentMealIndex = 0;
			this.inputAmount = '';
			this.$refs.popup.close();
		},
		removeFromCart(index) {
			this.cartItems.splice(index, 1);
		},
		toggleCartPanel() {
			if (this.showCartPanel) {
					// 如果当前是打开的，就调用 close 关闭
					this.$refs.cartPopup.close();
				} else {
					// 如果当前是关闭的，就调用 open 打开
					this.$refs.cartPopup.open();
				}
		},
		onCartPopupChange(e) {
			// 我们用这个状态来同步 showCartPanel 变量
			this.showCartPanel = e.show;
		},
		clearCart() {
			this.cartItems = [];
			this.showCartPanel = false;
		},
		analyze() {
			if (!this.hasSelectedItems) {
				uni.showToast({
					title: '请先选择需要分析的食物',
					icon: 'none'
				});
				return;
			}
			
			// 检查食物项是否包含营养数据
			const hasNutritionData = this.selectedItems.every(item => {
				return typeof item.energy !== 'undefined';
			});
			
			// 如果食物项缺少营养数据，需要先找到对应的数据
			if (!hasNutritionData) {
				// 为每个选中项补充营养数据
				this.selectedItems.forEach(item => {
					// 找到对应的食物完整数据
					for (const category in this.foods) {
						const found = this.foods[category].find(food => food.name === item.name);
						if (found) {
							// 补充营养数据
							item.energy = found.energy || 0;
							item.protein = found.protein || 0;
							item.fat = found.fat || 0;
							item.carbohydrate = found.carbohydrate || 0;
							item.fiber = found.fiber || 0;
							item.vitaminA = found.vitaminA || 0;
							item.vitaminB1 = found.vitaminB1 || 0;
							item.vitaminB2 = found.vitaminB2 || 0;
							item.vitaminC = found.vitaminC || 0;
							item.calcium = found.calcium || 0;
							item.iron = found.iron || 0;
							item.zinc = found.zinc || 0;
							item.selenium = found.selenium || 0;
							item.folate = found.folate || 0;
							item.dha = found.dha || 0;
							break;
						}
					}
				});
				
				console.log('已补充营养数据的选中项:', this.selectedItems);
			}
			
			// 计算营养数据
			const nutritionData = this.calculateNutrition();
			console.log('最终营养数据:', nutritionData);
			
			// 确保数据包含必要字段并打印日志
			if (nutritionData.energy !== undefined && nutritionData.vitamins) {
				console.log('数据完整，准备跳转');
			} else {
				console.error('数据不完整，可能会导致结果页面显示异常');
			}
			
			// 跳转到分析结果页面
			const dataStr = JSON.stringify(nutritionData);
			const selectedFoodsStr = JSON.stringify(this.selectedItems);
			console.log('传递的URL参数长度:', dataStr.length);
			
			uni.navigateTo({
				url: `/pages/index/analysis-result?nutritionData=${encodeURIComponent(dataStr)}&selectedFoods=${encodeURIComponent(selectedFoodsStr)}`
			});
		},
		calculateNutrition() {
			let totalNutrition = {
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
			};
			
			// 只处理被选中的食物
			this.selectedItems.forEach(item => {
				const weight = item.amount || 100; // 获取用户输入的克数
				
				// 直接使用克数乘以每克的营养值（不需要除以100）
				totalNutrition.energy += (item.energy || 0) * weight;
				totalNutrition.protein += (item.protein || 0) * weight;
				totalNutrition.fat += (item.fat || 0) * weight;
				totalNutrition.carbohydrate += (item.carbohydrate || 0) * weight;
				totalNutrition.fiber += (item.fiber || 0) * weight;
				totalNutrition.vitamins.A += (item.vitaminA || 0) * weight;
				totalNutrition.vitamins.B1 += (item.vitaminB1 || 0) * weight;
				totalNutrition.vitamins.B2 += (item.vitaminB2 || 0) * weight;
				totalNutrition.vitamins.C += (item.vitaminC || 0) * weight;
				totalNutrition.calcium += (item.calcium || 0) * weight;
				totalNutrition.iron += (item.iron || 0) * weight;
				totalNutrition.zinc += (item.zinc || 0) * weight;
				totalNutrition.selenium += (item.selenium || 0) * weight;
				totalNutrition.folate += (item.folate || 0) * weight;
				totalNutrition.DHA += (item.dha || 0) * weight;
				
				console.log(`计算 ${item.name} ${weight}g: 能量 ${(item.energy || 0) * weight} kcal`);
			});
			
			console.log('计算结果:', totalNutrition);
			return totalNutrition;
		},
		toggleSelectAll() {
			const newState = !this.isAllSelected;
			this.cartItems.forEach(item => {
				item.selected = newState;
			});
		},
		toggleSelect(index) {
			this.cartItems[index].selected = !this.cartItems[index].selected;
		},
		getMealItems(mealType) {
			return this.cartItems.filter(item => item.mealType === mealType);
		},
		getItemIndex(item) {
			return this.cartItems.findIndex(cartItem => 
				cartItem.name === item.name && 
				cartItem.amount === item.amount && 
				cartItem.mealType === item.mealType
			);
		},
		onHelpCheckboxChange(e) {
			this.dontShowAgain = e.detail.value.includes('true');
			console.log('dontShowAgain 更新为:', this.dontShowAgain);
		},
		closeHelpPopup() {
			if (this.dontShowAgain) {
				uni.setStorageSync('showAnalysisHelp', 'false');
				console.log('已将 showAnalysisHelp 存储为 false');
			}
			this.$refs.helpPopup.close();
			console.log('helpPopup 已关闭');
		}
	}
}
</script>

<style>
.container {
	/* padding: 20rpx; */
}

.content-wrapper {
	display: flex;
	height: calc(100vh - 40rpx);
	position: relative;
}

.sidebar {
	width: 180rpx;
	background: #f8f8f8;
	border-right: 1rpx solid #eee;
}

.category-list {
	height: 100%;
	/* 隐藏滚动条但保留滚动功能 */
	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* IE and Edge */
}

/* 为 Webkit 浏览器隐藏滚动条 */
.category-list::-webkit-scrollbar {
	display: none;
}

.category-item {
	padding: 20rpx 10rpx;
	font-size: 26rpx;
	color: #666;
	text-align: center;
	border-bottom: 1rpx solid #eee;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.category-item.active {
	color: #FF6B8B;
	background: rgba(255, 107, 139, 0.1);
}

.main-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding-bottom: 220rpx;
}

.food-list {
	flex: 1;
	padding: 20rpx;
}

.food-item {
	display: flex;
	align-items: center;
	padding: 15rpx 35rpx 15rpx 15rpx;
	background: #fff;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.food-image {
	width: 70rpx;
	height: 70rpx;
	border-radius: 8rpx;
	margin-right: 15rpx;
	flex-shrink: 0;
}

.food-info {
	flex: 1;
	min-width: 0; /* 防止文本溢出 */
	margin-right: 15rpx;
}

.food-name {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	display: block;
	margin-bottom: 6rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.food-desc {
	font-size: 24rpx;
	color: #999;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.add-btn {
	width: 50rpx;
	height: 50rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255, 107, 139, 0.1);
	border-radius: 25rpx;
	flex-shrink: 0;
}

/* 调整加号图标大小 */
.add-btn .uni-icons {
	transform: scale(0.8);
}

/* 底部购物车栏样式 */
.cart-bar {
	position: fixed;
	bottom: 100rpx;
	left: 0;
	right: 0;
	height: 100rpx;
	background: #fff;
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	z-index: 999;
}

.cart-left {
	flex: 1;
	display: flex;
	align-items: center;
}

.cart-icon {
	position: relative;
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 30rpx;
	background: rgba(255, 107, 139, 0.1);
	border-radius: 50%;
}

.cart-badge {
	position: absolute;
	top: -6rpx;
	right: -6rpx;
	background: #FF6B8B;
	color: #fff;
	font-size: 20rpx;
	padding: 6rpx 12rpx;
	border-radius: 20rpx;
	min-width: 32rpx;
	text-align: center;
	box-shadow: 0 2rpx 6rpx rgba(255, 107, 139, 0.3);
}

.cart-info {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.cart-total {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 4rpx;
}

.cart-weight {
	font-size: 24rpx;
	color: #999;
}

.cart-right {
	width: 180rpx;
	height: 72rpx;
	background: linear-gradient(to right, #FF6B8B, #FF8BA0);
	color: #fff;
	font-size: 28rpx;
	font-weight: 500;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 36rpx;
	box-shadow: 0 4rpx 12rpx rgba(255, 107, 139, 0.3);
	margin-left: 30rpx;
}

/* 购物车面板样式 */
.cart-panel {
	position: fixed;
	bottom: 200rpx;
	left: 0;
	right: 0;
	background: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	z-index: 9998;
	padding: 20rpx;
	max-height: 60vh;
	display: flex;
	flex-direction: column;
}

.panel-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.header-left {
	display: flex;
	align-items: center;
}

.select-all-wrapper {
	display: flex;
	align-items: center;
	margin-right: 10rpx;
}

.checkbox {
	width: 36rpx;
	height: 36rpx;
	border: 2rpx solid #ddd;
	border-radius: 50%;
	margin-right: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.checkbox.checked {
	background: #FF6B8B;
	border-color: #FF6B8B;
}

.select-all {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	margin-right: 10rpx;
}

.total-info {
	font-size: 24rpx;
	color: #999;
}

.header-right {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #999;
}

.header-right .uni-icons {
	margin-right: 6rpx;
}

.panel-content {
	flex: 1;
	overflow-y: auto;
}

.meal-section {
	margin-bottom: 20rpx;
}

.meal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #eee;
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

.meal-items {
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 0 16rpx;
}

.cart-item {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
}

.cart-item:last-child {
	border-bottom: none;
}

.item-name {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.item-amount {
	font-size: 28rpx;
	color: #666;
	margin: 0 20rpx;
}

.delete-btn {
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* 通用滚动条隐藏 */
::-webkit-scrollbar {
	display: none !important;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
}

/* 为所有滚动区域隐藏滚动条 */
scroll-view {
	scrollbar-width: none !important; /* Firefox */
	-ms-overflow-style: none !important; /* IE and Edge */
}

.category-list {
	height: 100%;
}

.food-list {
	flex: 1;
	padding: 20rpx;
}

.panel-content {
	flex: 1;
	overflow-y: auto;
}

.input-dialog-content {
	padding: 30rpx;
	background: #fff;
	border-radius: 24rpx;
	width: 600rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.dialog-header {
	text-align: center;
	margin-bottom: 30rpx;
}

.dialog-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.dialog-subtitle {
	font-size: 24rpx;
	color: #999;
}

.section-label {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 16rpx;
	display: block;
}

.meal-picker {
	margin-bottom: 30rpx;
}

.meal-options {
	display: flex;
	gap: 20rpx;
}

.meal-option {
	flex: 1;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f8f9fa;
	border-radius: 12rpx;
	font-size: 28rpx;
	color: #666;
	transition: all 0.3s ease;
}

.meal-option.active {
	background: linear-gradient(to right, #FF6B8B, #FF8BA0);
	color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(255, 107, 139, 0.3);
}

.amount-input {
	margin-bottom: 40rpx;
}

.amount-wrapper {
	position: relative;
	display: flex;
	align-items: center;
}

.amount-field {
	flex: 1;
	height: 80rpx;
	background: #f8f9fa;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	color: #333;
}

.amount-unit {
	position: absolute;
	right: 20rpx;
	font-size: 28rpx;
	color: #999;
}

.dialog-buttons {
	display: flex;
	justify-content: flex-end;
	gap: 20rpx;
}

.cancel-btn, .confirm-btn {
	width: 180rpx;
	height: 80rpx;
	border-radius: 40rpx;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.cancel-btn {
	background: #f8f9fa;
	color: #666;
	border: none !important;
	box-shadow: none !important;
	outline: none !important;
}

.cancel-btn:active {
	background: #f0f0f0;
}

.confirm-btn {
	background: linear-gradient(to right, #FF6B8B, #FF8BA0);
	color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(255, 107, 139, 0.3);
	border: none;
}

.confirm-btn:active {
	transform: translateY(2rpx);
	box-shadow: 0 2rpx 6rpx rgba(255, 107, 139, 0.3);
}

.custom-cart-icon {
	width: 50rpx;
	height: 50rpx;
}/* 购物车图标大小 */
.help-popup-content {
	width: 600rpx;
	background: #fff;
	border-radius: 24rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.help-header {
	text-align: center;
	margin-bottom: 20rpx;
}

.help-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.help-scroll-content {
	/* 设置一个最大高度，防止内容撑爆 */
	max-height: 50vh; 
	margin-bottom: 30rpx;
}

.help-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	/* 允许换行 */
	white-space: pre-wrap;
	word-break: break-word;
}

.help-footer {
	/* (样式复用 login.vue 的) */
	font-size: 26rpx;
	color: #666;
}

.help-checkbox {
	margin-bottom: 20rpx;
}

.help-footer label {
	display: flex;
	align-items: center;
}
</style> 