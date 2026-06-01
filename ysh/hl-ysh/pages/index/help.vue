<template>
	<view class="container">
		<view class="help-list">
			<view class="help-group">
				<view class="group-title">使用指南</view>
				<view class="help-item" v-for="(item, index) in guideList" :key="index" @tap="showGuideDetail(item)">
					<text class="item-title">{{item.title}}</text>
					<text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
			
			<view class="help-group">
				<view class="group-title">营养知识</view>
				<view class="help-item" v-for="(item, index) in nutritionList" :key="index" @tap="showNutritionDetail(item)">
					<text class="item-title">{{item.title}}</text>
					<text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
			
			<view class="help-group">
				<view class="group-title">常见问题</view>
				<view class="help-item" v-for="(item, index) in faqList" :key="index" @tap="showFaqDetail(item)">
					<text class="item-title">{{item.question}}</text>
					<text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
		</view>
		
		<!-- 详情弹窗 -->
		<uni-popup ref="detailPopup" type="center">
			<view class="detail-popup">
				<view class="popup-header">
					<text class="popup-title">{{currentDetail.title || currentDetail.question}}</text>
					<view class="close-btn" @tap="closeDetailPopup">
						<uni-icons type="close" size="20" color="#999"></uni-icons>
					</view>
				</view>
				<scroll-view scroll-y class="popup-content">
					<text class="popup-text">{{currentDetail.content || currentDetail.answer}}</text>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			guideList: [
				{
					title: '如何记录每日饮食',
					content: '1. 点击首页"营养分析"进入分析页面\n2. 选择食物类别（如谷类、蔬菜等）\n3. 点击食物右侧"+"号添加\n4. 输入食用克数\n5. 点击"去分析"查看营养评估'
				},
				{
					title: '如何查看营养分析',
					content: '1. 在分析结果页面可以查看：\n- 总能量摄入\n- 三大营养素供能比\n- 各类营养素摄入情况\n2. 系统会自动对比推荐摄入量\n3. 根据分析结果给出改善建议'
				},
				{
					title: '如何设置个人信息',
					content: '1. 点击"我的"进入个人中心\n2. 点击"基本资料"\n3. 填写：\n- 孕周\n- 年龄\n- 身高体重\n- 活动水平\n4. 保存后系统会自动调整推荐值'
				}
			],
			nutritionList: [
				{
					title: '孕期营养需求',
					content: '孕期营养需求会随孕周变化：\n\n孕早期：\n- 叶酸：600μg/天\n- 铁：18mg/天\n- 蛋白质：55g/天\n\n孕中期：\n- 蛋白质：70g/天\n- 钙：800mg/天\n- 铁：25mg/天\n\n孕晚期：\n- 蛋白质：85g/天\n- 钙：800mg/天\n- 铁：29mg/天'
				},
				{
					title: '孕期饮食建议',
					content: '1. 均衡饮食，多样化\n2. 适量增加优质蛋白\n3. 补充叶酸和铁\n4. 控制糖分和盐分\n5. 多喝水，少喝咖啡\n6. 避免生食和酒精\n7. 注意食品安全'
				},
				{
					title: '孕期饮食禁忌',
					content: '1. 避免生食：\n- 生鱼片\n- 生肉\n- 生蛋\n2. 避免酒精\n3. 限制咖啡因\n4. 避免高汞鱼类\n5. 避免未消毒奶制品\n6. 避免高糖高盐食物'
				}
			],
			faqList: [
				{
					question: '为什么我的营养分析结果不准确？',
					answer: '营养分析结果的准确性取决于：\n1. 食物重量是否准确\n2. 食物选择是否完整\n3. 个人信息是否准确\n\n建议：\n- 使用食物秤称重\n- 记录所有摄入的食物\n- 及时更新个人信息'
				},
				{
					question: '如何改善营养摄入不足？',
					answer: '1. 查看具体营养素缺乏情况\n2. 根据系统建议调整饮食\n3. 适当增加相关食物摄入\n4. 必要时咨询医生补充营养剂\n5. 定期复查营养状况'
				},
				{
					question: '孕期需要额外补充营养剂吗？',
					answer: '建议：\n1. 优先通过食物补充营养\n2. 叶酸建议额外补充\n3. 其他营养素根据检查结果\n4. 补充前咨询医生\n5. 避免过量补充'
				}
			],
			currentDetail: {}
		}
	},
	methods: {
		showGuideDetail(item) {
			this.currentDetail = item;
			this.$refs.detailPopup.open();
		},
		showNutritionDetail(item) {
			this.currentDetail = item;
			this.$refs.detailPopup.open();
		},
		showFaqDetail(item) {
			this.currentDetail = item;
			this.$refs.detailPopup.open();
		},
		closeDetailPopup() {
			this.$refs.detailPopup.close();
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

.help-list {
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.help-group {
	margin-bottom: 20rpx;
}

.group-title {
	padding: 20rpx 30rpx;
	font-size: 28rpx;
	color: #666;
	background-color: #f8f9fa;
	font-weight: bold;
}

.help-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.item-title {
	font-size: 28rpx;
	color: #333;
	flex: 1;
}

.icon-arrow-right {
	color: #999;
	font-size: 24rpx;
	margin-left: 20rpx;
}

/* 弹窗样式 */
.detail-popup {
	width: 650rpx;
	background: #fff;
	border-radius: 20rpx;
	max-height: 80vh;
	display: flex;
	flex-direction: column;
}

.popup-header {
	padding: 30rpx;
	border-bottom: 1rpx solid #f5f5f5;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
	margin-right: 20rpx;
}

.close-btn {
	padding: 10rpx;
}

.popup-content {
	flex: 1;
	padding: 30rpx;
	max-height: 60vh;
}

.popup-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	white-space: pre-wrap;
}
</style> 