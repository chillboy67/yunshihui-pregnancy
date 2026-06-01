<template>
	<view class="qa-container">
		<view class="pregnancy-info">
			<view class="info-card">
				<!-- <view class="info-title">孕期信息</view> -->
				<view class="info-content">
					<view class="pregnancy-line">
						<text class="info-text">您当前处于 孕<text class="spacing"> </text><text class="pregnancy-week">{{pregnancyCalculation.week}}</text><text class="spacing"> </text>周 <text class="spacing"> </text>第<text class="spacing"> </text><text class="pregnancy-day">{{pregnancyCalculation.day}}</text><text class="spacing"> </text>天</text>
						<text class="info-text">属于<text class="pregnancy-period">{{pregnancyCalculation.period}}</text></text>
						
					</view>
				</view>
			</view>
		</view>
		
		<!-- 功能按钮区域 -->
		<view class="function-buttons">
			<view class="button-row">
				<view 
					class="function-button" 
					:class="{ active: activeButton === 'early' }"
					@tap="handleButtonClick('early')"
				>
					<text class="button-text">孕早期</text>
					<text class="button-subtext">0-12周</text>
				</view>
				<view 
					class="function-button" 
					:class="{ active: activeButton === 'middle' }"
					@tap="handleButtonClick('middle')"
				>
					<text class="button-text">孕中期</text>
					<text class="button-subtext">13-27周</text>
				</view>
				<view 
					class="function-button" 
					:class="{ active: activeButton === 'late' }"
					@tap="handleButtonClick('late')"
				>
					<text class="button-text">孕晚期</text>
					<text class="button-subtext">28-40周</text>
				</view>
			</view>
			<view class="button-row">
				<view 
					class="function-button" 
					:class="{ active: activeButton === 'postpartum' }"
					@tap="handleButtonClick('postpartum')"
				>
					<text class="button-text">产褥期</text>
					<text class="button-subtext">产后6周</text>
				</view>
				<view 
					class="function-button" 
					:class="{ active: activeButton === 'breastfeeding' }"
					@tap="handleButtonClick('breastfeeding')"
				>
					<text class="button-text">哺乳期</text>
					<text class="button-subtext">0-12个月</text>
				</view>
			</view>
		</view>
		
		<!-- 文本链接区域 -->
		<view class="text-links" v-if="!activeButton">
			<view class="drawer-item">
				<view class="drawer-header" @tap="toggleDrawer('nutrient')">
					<text class="link-text">吃什么食物可以补充相应营养素？</text>
					<uni-icons :type="expandedDrawers.nutrient ? 'bottom' : 'right'" size="16" color="#999"></uni-icons>
				</view>
				<view class="drawer-content" v-if="expandedDrawers.nutrient">
					<view class="drawer-subitem" v-for="(item, index) in nutrientSubQuestions" :key="index" @tap="handleSubQuestionClick('nutrient', item.id)">
						<text class="subitem-text">{{item.question}}</text>
						<uni-icons type="right" size="14" color="#999"></uni-icons>
					</view>
				</view>
			</view>
			
			<view class="drawer-item">
				<view class="drawer-header" @tap="toggleDrawer('effect')">
					<text class="link-text">营养素或食材的功效和不良影响</text>
					<uni-icons :type="expandedDrawers.effect ? 'bottom' : 'right'" size="16" color="#999"></uni-icons>
				</view>
				<view class="drawer-content" v-if="expandedDrawers.effect">
					<view class="drawer-subitem" v-for="(item, index) in effectSubQuestions" :key="index" @tap="handleSubQuestionClick('effect', item.id)">
						<text class="subitem-text">{{item.question}}</text>
						<uni-icons type="right" size="14" color="#999"></uni-icons>
					</view>
				</view>
			</view>
			
			<view class="drawer-item">
				<view class="drawer-header" @tap="toggleDrawer('special')">
					<text class="link-text">孕期特殊情况饮食</text>
					<uni-icons :type="expandedDrawers.special ? 'bottom' : 'right'" size="16" color="#999"></uni-icons>
				</view>
				<view class="drawer-content" v-if="expandedDrawers.special">
					<view class="category-item" v-for="(category, index) in specialCategories" :key="index">
						<view class="category-header" @tap="toggleSpecialCategory(category.id)">
							<text class="category-text">{{category.name}}</text>
							<uni-icons :type="expandedCategories[category.id] ? 'bottom' : 'right'" size="14" color="#999"></uni-icons>
						</view>
						<view class="category-content" v-if="expandedCategories[category.id]">
							<view class="drawer-subitem" v-for="(subItem, subIndex) in category.subQuestions" :key="subIndex" 
								@tap="handleSpecialSubQuestionClick(category.id, subItem.id)">
								<text class="subitem-text">{{subItem.question}}</text>
								<uni-icons type="right" size="14" color="#999"></uni-icons>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 孕早期相关链接 -->
		<view class="text-links" v-if="activeButton === 'early'">
			<view class="text-link-item" @tap="handleTextLinkClick('early_food_types')">
				<text class="link-text">孕早期推荐摄入哪些食材种类？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('early_food_recommend')">
				<text class="link-text">孕早期推荐摄入哪些食材？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('early_dishes')">
				<text class="link-text">孕早期推荐摄入哪些菜品？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('early_nutrients')">
				<text class="link-text">孕早期推荐摄入哪些营养素？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('early_nutrient_limits')">
				<text class="link-text">孕早期推荐摄入营养素最多可以吃多少？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
		</view>
		
		<!-- 孕中期相关链接 -->
		<view class="text-links" v-if="activeButton === 'middle'">
			<view class="text-link-item" @tap="handleTextLinkClick('middle_food_limit')">
				<text class="link-text">孕中期限制摄入哪些食材？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('middle_nutrient_limits')">
				<text class="link-text">孕中期推荐摄入营养素最多可以吃多少？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('middle_nutrients')">
				<text class="link-text">孕中期推荐摄入哪些营养素？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('middle_food_types')">
				<text class="link-text">孕中期推荐摄入哪些食材种类？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('middle_food_recommend_items')">
				<text class="link-text">孕中期推荐摄入哪些食材？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('middle_dishes')">
				<text class="link-text">孕中期推荐摄入哪些菜品？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('middle_food_forbidden')">
				<text class="link-text">孕中期禁忌摄入哪些食材？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
		</view>

		<!-- 孕晚期相关链接 -->
		<view class="text-links" v-if="activeButton === 'late'">
			<view class="text-link-item" @tap="handleTextLinkClick('late_nutrient_limits')">
				<text class="link-text">孕晚期推荐摄入营养素最多可以吃多少？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('late_nutrients')">
				<text class="link-text">孕晚期推荐摄入哪些营养素？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('late_food_types')">
				<text class="link-text">孕晚期推荐摄入哪些食材种类？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('late_food_recommend')">
				<text class="link-text">孕晚期推荐摄入哪些食材？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('late_dishes')">
				<text class="link-text">孕晚期推荐摄入哪些菜品？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
		</view>

		<!-- 产褥期相关链接 -->
		<view class="text-links" v-if="activeButton === 'postpartum'">
			<view class="text-link-item" @tap="handleTextLinkClick('postpartum_food_types')">
				<text class="link-text">产褥期推荐摄入哪些食材种类？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('postpartum_food_recommend')">
				<text class="link-text">产褥期推荐摄入哪些食材？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('postpartum_dishes')">
				<text class="link-text">产褥期推荐摄入哪些菜品？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('postpartum_food_forbidden')">
				<text class="link-text">产褥期禁忌摄入哪些食材？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
		</view>

		<!-- 母乳喂养相关链接 -->
		<view class="text-links" v-if="activeButton === 'breastfeeding'">
			<view class="text-link-item" @tap="handleTextLinkClick('breastfeeding_promote_foods')">
				<text class="link-text">哪些食材可以促进乳汁分泌？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('breastfeeding_promote_dishes')">
				<text class="link-text">哪些菜品可以促进乳汁分泌？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('breastfeeding_nutrient_limits')">
				<text class="link-text">母乳喂养推荐摄入营养素最多可以吃多少？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('breastfeeding_nutrients')">
				<text class="link-text">母乳喂养推荐摄入哪些营养素？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('breastfeeding_food_types')">
				<text class="link-text">母乳喂养推荐摄入哪些食材种类？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('breastfeeding_food_recommend')">
				<text class="link-text">母乳喂养推荐摄入哪些食材？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('breastfeeding_dishes')">
				<text class="link-text">母乳喂养推荐摄入哪些菜品？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('breastfeeding_food_forbidden')">
				<text class="link-text">母乳喂养禁忌摄入哪些食材？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
			<view class="text-link-item" @tap="handleTextLinkClick('breastfeeding_benefits')">
				<text class="link-text">母乳喂养的好处是什么？</text>
				<uni-icons type="right" size="16" color="#999"></uni-icons>
			</view>
		</view>
		<image 
			class="start-chat-fab" 
			src="/static/images/qa.png" 
			mode="aspectFit"
			@tap="startNewChat"
		></image>
	</view>
</template>

<script>
import yunzao1Data from '@/static/data/yunzao/yunzao_1.json';
import yunzao2Data from '@/static/data/yunzao/yunzao_2.json';
import yunzao3Data from '@/static/data/yunzao/yunzao_3.json';
import yunzao4Data from '@/static/data/yunzao/yunzao_4.json';
import yunzao5Data from '@/static/data/yunzao/yunzao_5.json';
import yunzhong1Data from '@/static/data/yunzhong/yunzhong_1.json';
import yunzhong2Data from '@/static/data/yunzhong/yunzhong_2.json';
import yunzhong3Data from '@/static/data/yunzhong/yunzhong_3.json';
import yunzhong4Data from '@/static/data/yunzhong/yunzhong_4.json';
import yunzhong5Data from '@/static/data/yunzhong/yunzhong_5.json';
import yunzhong6Data from '@/static/data/yunzhong/yunzhong_6.json';
import yunzhong7Data from '@/static/data/yunzhong/yunzhong_7.json';
import yunwan1Data from '@/static/data/yunwan/yunwan_1.json';
import yunwan2Data from '@/static/data/yunwan/yunwan_2.json';
import yunwan3Data from '@/static/data/yunwan/yunwan_3.json';
import yunwan4Data from '@/static/data/yunwan/yunwan_4.json';
import yunwan5Data from '@/static/data/yunwan/yunwan_5.json';
import chanru1Data from '@/static/data/chanru/chanru_1.json';
import chanru2Data from '@/static/data/chanru/chanru_2.json';
import chanru3Data from '@/static/data/chanru/chanru_3.json';
import chanru4Data from '@/static/data/chanru/chanru_4.json';
import buru1Data from '@/static/data/buru/buru_1.json';
import buru2Data from '@/static/data/buru/buru_2.json';
import buru3Data from '@/static/data/buru/buru_3.json';
import buru4Data from '@/static/data/buru/buru_4.json';
import buru5Data from '@/static/data/buru/buru_5.json';
import buru6Data from '@/static/data/buru/buru_6.json';
import buru7Data from '@/static/data/buru/buru_7.json';
import buru8Data from '@/static/data/buru/buru_8.json';
import buru9Data from '@/static/data/buru/buru_9.json';
import main11Data from '@/static/data/main_1/main_1_1.json';
import main12Data from '@/static/data/main_1/main_1_2.json';
import main13Data from '@/static/data/main_1/main_1_3.json';
import main14Data from '@/static/data/main_1/main_1_4.json';
import main15Data from '@/static/data/main_1/main_1_5.json';
import main16Data from '@/static/data/main_1/main_1_6.json';
import main17Data from '@/static/data/main_1/main_1_7.json';
import main18Data from '@/static/data/main_1/main_1_8.json';
import main19Data from '@/static/data/main_1/main_1_9.json';
import main110Data from '@/static/data/main_1/main_1_10.json';
import main21Data from '@/static/data/main_2/main_2_1.json';
import main22Data from '@/static/data/main_2/main_2_2.json';
import main23Data from '@/static/data/main_2/main_2_3.json';
import main24Data from '@/static/data/main_2/main_2_4.json';
import zaoyun1Data from '@/static/data/main_3/zaoyun/zaoyun_1.json';
import zaoyun2Data from '@/static/data/main_3/zaoyun/zaoyun_2.json';
import zaoyun3Data from '@/static/data/main_3/zaoyun/zaoyun_3.json';
import jutu1Data from '@/static/data/main_3/jutu/jutu_1.json';
import jutu2Data from '@/static/data/main_3/jutu/jutu_2.json';
import jutu3Data from '@/static/data/main_3/jutu/jutu_3.json';
import jutu4Data from '@/static/data/main_3/jutu/jutu_4.json';

// 妊娠期糖尿病数据
import tangniaobing1Data from '@/static/data/main_3/tangniaobing/tangniaobing_1.json';
import tangniaobing2Data from '@/static/data/main_3/tangniaobing/tangniaobing_2.json';
import tangniaobing3Data from '@/static/data/main_3/tangniaobing/tangniaobing_3.json';
import tangniaobing4Data from '@/static/data/main_3/tangniaobing/tangniaobing_4.json';
import tangniaobing5Data from '@/static/data/main_3/tangniaobing/tangniaobing_5.json';

// 妊娠期缺铁性贫血数据
import pinxue1Data from '@/static/data/main_3/pinxue/pinxue_1.json';
import pinxue2Data from '@/static/data/main_3/pinxue/pinxue_2.json';
import pinxue3Data from '@/static/data/main_3/pinxue/pinxue_3.json';

// 妊娠期高血压数据
import gaoxueya1Data from '@/static/data/main_3/gaoxueya/gaoxueya_1.json';
import gaoxueya2Data from '@/static/data/main_3/gaoxueya/gaoxueya_2.json';
import gaoxueya3Data from '@/static/data/main_3/gaoxueya/gaoxueya_3.json';
import gaoxueya4Data from '@/static/data/main_3/gaoxueya/gaoxueya_4.json';
import gaoxueya5Data from '@/static/data/main_3/gaoxueya/gaoxueya_5.json';

// 妊娠期超重数据
import chaozhong1Data from '@/static/data/main_3/chaozhong/chaozhong_1.json';

// 妊娠期肥胖数据
import feipang1Data from '@/static/data/main_3/feipang/feipang_1.json';

export default {
	data() {
		return {
			activeButton: '', // 当前选中的按钮
			pregnancyInfo: {
				week: 0,
				day: 0,
				period: ''
			},
			isLoading: false, // 添加加载状态
			yunzao1Data: (yunzao1Data && yunzao1Data.yunzao_1) || [],
			yunzao2Data: (yunzao2Data && yunzao2Data.yunzao_2) || [],
			yunzao3Data: (yunzao3Data && yunzao3Data.yunzao_3) || [],
			yunzao4Data: (yunzao4Data && yunzao4Data.yunzao_4) || [],
			yunzao5Data: (yunzao5Data && yunzao5Data.yunzao_5) || [],
			yunzhong1Data: (yunzhong1Data && yunzhong1Data.yunzhong_1) || [],
			yunzhong2Data: (yunzhong2Data && yunzhong2Data.yunzhong_2) || [],
			yunzhong3Data: (yunzhong3Data && yunzhong3Data.yunzhong_3) || [],
			yunzhong4Data: (yunzhong4Data && yunzhong4Data.yunzhong_4) || [],
			yunzhong5Data: (yunzhong5Data && yunzhong5Data.yunzhong_5) || [],
			yunzhong6Data: (yunzhong6Data && yunzhong6Data.yunzhong_6) || [],
			yunzhong7Data: (yunzhong7Data && yunzhong7Data.yunzhong_7) || [],
			yunwan1Data: (yunwan1Data && yunwan1Data.yunwan_1) || [],
			yunwan2Data: (yunwan2Data && yunwan2Data.yunwan_2) || [],
			yunwan3Data: (yunwan3Data && yunwan3Data.yunwan_3) || [],
			yunwan4Data: (yunwan4Data && yunwan4Data.yunwan_4) || [],
			yunwan5Data: (yunwan5Data && yunwan5Data.yunwan_5) || [],
			chanru1Data: (chanru1Data && chanru1Data.chanru_1) || [],
			chanru2Data: (chanru2Data && chanru2Data.chanru_2) || [],
			chanru3Data: (chanru3Data && chanru3Data.chanru_3) || [],
			chanru4Data: (chanru4Data && chanru4Data.chanru_4) || [],
			buru1Data: (buru1Data && buru1Data.buru_1) || [],
			buru2Data: (buru2Data && buru2Data.buru_2) || [],
			buru3Data: (buru3Data && buru3Data.buru_3) || [],
			buru4Data: (buru4Data && buru4Data.buru_4) || [],
			buru5Data: (buru5Data && buru5Data.buru_5) || [],
			buru6Data: (buru6Data && buru6Data.buru_6) || [],
			buru7Data: (buru7Data && buru7Data.buru_7) || [],
			buru8Data: (buru8Data && buru8Data.buru_8) || [],
			buru9Data: (buru9Data && buru9Data.buru_9) || [],
			main11Data: (main11Data && main11Data.main_1_1) || [],
			main12Data: (main12Data && main12Data.main_1_2) || [],
			main13Data: (main13Data && main13Data.main_1_3) || [],
			main14Data: (main14Data && main14Data.main_1_4) || [],
			main15Data: (main15Data && main15Data.main_1_5) || [],
			main16Data: (main16Data && main16Data.main_1_6) || [],
			main17Data: (main17Data && main17Data.main_1_7) || [],
			main18Data: (main18Data && main18Data.main_1_8) || [],
			main19Data: (main19Data && main19Data.main_1_9) || [],
			main110Data: (main110Data && main110Data.main_1_10) || [],
			main21Data: (main21Data && main21Data.main_2_1) || [],
			main22Data: (main22Data && main22Data.main_2_2) || [],
			main23Data: (main23Data && main23Data.main_2_3) || [],
			main24Data: (main24Data && main24Data.main_2_4) || [],
			zaoyun1Data: (zaoyun1Data && zaoyun1Data.zaoyun_1) || [],
			zaoyun2Data: (zaoyun2Data && zaoyun2Data.zaoyun_2) || [],
			zaoyun3Data: (zaoyun3Data && zaoyun3Data.zaoyun_3) || [],
			jutu1Data: (jutu1Data && jutu1Data.jutu_1) || [],
			jutu2Data: (jutu2Data && jutu2Data.jutu_2) || [],
			jutu3Data: (jutu3Data && jutu3Data.jutu_3) || [],
			jutu4Data: (jutu4Data && jutu4Data.jutu_4) || [],
			
			// 妊娠期糖尿病数据
			tangniaobing1Data: (tangniaobing1Data && tangniaobing1Data.tangniaobing_1) || [],
			tangniaobing2Data: (tangniaobing2Data && tangniaobing2Data.tangniaobing_2) || [],
			tangniaobing3Data: (tangniaobing3Data && tangniaobing3Data.tangniaobing_3) || [],
			tangniaobing4Data: (tangniaobing4Data && tangniaobing4Data.tangniaobing_4) || [],
			tangniaobing5Data: (tangniaobing5Data && tangniaobing5Data.tangniaobing_5) || [],
			
			// 妊娠期缺铁性贫血数据
			pinxue1Data: (pinxue1Data && pinxue1Data.pinxue_1) || [],
			pinxue2Data: (pinxue2Data && pinxue2Data.pinxue_2) || [],
			pinxue3Data: (pinxue3Data && pinxue3Data.pinxue_3) || [],
			
			// 妊娠期高血压数据
			gaoxueya1Data: (gaoxueya1Data && gaoxueya1Data.gaoxueya_1) || [],
			gaoxueya2Data: (gaoxueya2Data && gaoxueya2Data.gaoxueya_2) || [],
			gaoxueya3Data: (gaoxueya3Data && gaoxueya3Data.gaoxueya_3) || [],
			gaoxueya4Data: (gaoxueya4Data && gaoxueya4Data.gaoxueya_4) || [],
			gaoxueya5Data: (gaoxueya5Data && gaoxueya5Data.gaoxueya_5) || [],
			
			// 妊娠期超重数据
			chaozhong1Data: (chaozhong1Data && chaozhong1Data.chaozhong_1) || [],
			
			// 妊娠期肥胖数据
			feipang1Data: (feipang1Data && feipang1Data.feipang_1) || [],
			
			preloadedAnswers: {
				nutrient: null,
				effect: null,
				special: null,
				early_food_types: null,
				early_food_recommend: null,
				early_dishes: null,
				
				early_nutrients: null,
				early_nutrient_limits: null,
				middle_food_limit: null,
				middle_nutrient_limits: null,
				middle_nutrients: null,
				middle_food_types: null,
				middle_food_recommend_items: null,
				middle_dishes: null,
				middle_food_forbidden: null,
				late_nutrient_limits: null,
				late_nutrients: null,
				late_food_types: null,
				late_food_recommend: null,
				late_dishes: null,
				postpartum_food_types: null,
				postpartum_food_recommend: null,
				postpartum_dishes: null,
				postpartum_food_forbidden: null,
				breastfeeding_promote_foods: null,
				breastfeeding_promote_dishes: null,
				breastfeeding_nutrient_limits: null,
				breastfeeding_nutrients: null,
				breastfeeding_food_types: null,
				breastfeeding_food_recommend: null,
				breastfeeding_dishes: null,
				breastfeeding_food_forbidden: null,
				breastfeeding_benefits: null
			}, // 为每种类型分别存储预加载的答案
			isPreloading: false, // 预加载状态
			expandedDrawers: {
				nutrient: false,
				effect: false,
				special: false
			},
			nutrientSubQuestions: [
				{ id: 'protein', question: '哪些食材含有蛋白质？' },
				{ id: 'calcium', question: '哪些食材含有钙？' },
				{ id: 'iron', question: '哪些食材含有铁？' },
				{ id: 'vitamin_a', question: '哪些食材含有维生素A？' },
				{ id: 'vitamin_b1', question: '哪些食材含有维生素B1？' },
				{ id: 'vitamin_b2', question: '哪些食材含有维生素B2?' },
				{ id: 'vitamin_c', question: '哪些食材含有维生素C？' },
				{ id: 'folate', question: '哪些食材含有叶酸？' },
				{ id: 'vitamin_c_types', question: '哪些食材种类含有维生素C？' },
				{ id: 'folate_types', question: '哪些食材种类含有叶酸？' }
			],
			effectSubQuestions: [
				{ id: 'nutrient_effects', question: '营养素的功效' },
				{ id: 'food_type_effects', question: '食材种类的功效' },
				{ id: 'food_effects', question: '食材的功效' },
				{ id: 'dish_effects', question: '菜品的功效' }
			],
			specialSubQuestions: [
				{ id: 'nausea', question: '孕吐严重时的饮食建议' },
				{ id: 'diabetes', question: '妊娠期糖尿病的饮食建议' },
				{ id: 'anemia', question: '孕期贫血的饮食建议' },
				{ id: 'constipation', question: '孕期便秘的饮食建议' },
				{ id: 'heartburn', question: '孕期烧心的饮食建议' }
			],
			specialCategories: [
				{
					id: 'early_reaction',
					name: '早孕反应',
					subQuestions: [
						{ id: 'early_reaction_nutrients', question: '早孕反应推荐摄入哪些营养素？' },
						{ id: 'early_reaction_food_types', question: '早孕反应推荐摄入哪些食材种类？' },
						{ id: 'early_reaction_foods', question: '早孕反应推荐摄入哪些食材？' }
					]
				},
				{
					id: 'severe_vomiting',
					name: '妊娠剧吐',
					subQuestions: [
						{ id: 'severe_vomiting_nutrients', question: '妊娠剧吐推荐摄入哪些营养素？' },
						{ id: 'severe_vomiting_food_types', question: '妊娠剧吐推荐摄入哪些食材种类？' },
						{ id: 'severe_vomiting_foods', question: '妊娠剧吐推荐摄入哪些食材？' },
						{ id: 'severe_vomiting_dishes', question: '妊娠剧吐推荐摄入哪些菜品？' }
					]
				},
				{
					id: 'diabetes',
					name: '妊娠期糖尿病',
					subQuestions: [
						{ id: 'diabetes_limit_nutrients', question: '妊娠期糖尿病限制摄入哪些营养素？' },
						{ id: 'diabetes_limit_foods', question: '妊娠期糖尿病限制摄入哪些食材？' },
						{ id: 'diabetes_recommend_nutrients', question: '妊娠期糖尿病推荐摄入哪些营养素？' },
						{ id: 'diabetes_recommend_food_types', question: '妊娠期糖尿病推荐摄入哪些食材种类？' },
						{ id: 'diabetes_recommend_foods', question: '妊娠期糖尿病推荐摄入哪些食材？' }
					]
				},
				{
					id: 'anemia',
					name: '妊娠期缺铁性贫血',
					subQuestions: [
						{ id: 'anemia_nutrients', question: '妊娠期缺铁性贫血推荐摄入哪些营养素？' },
						{ id: 'anemia_food_types', question: '妊娠期缺铁性贫血推荐摄入哪些食材种类？' },
						{ id: 'anemia_foods', question: '妊娠期缺铁性贫血推荐摄入哪些食材？' }
					]
				},
				{
					id: 'hypertension',
					name: '妊娠期高血压',
					subQuestions: [
						{ id: 'hypertension_limit_food_types', question: '妊娠期高血压限制摄入食材种类？' },
						{ id: 'hypertension_recommend_nutrients', question: '妊娠期高血压推荐摄入营养素？' },
						{ id: 'hypertension_recommend_food_types', question: '妊娠期高血压推荐摄入食材种类？' },
						{ id: 'hypertension_recommend_foods', question: '妊娠期高血压推荐摄入食材？' },
						{ id: 'hypertension_avoid_foods', question: '妊娠期高血压避免摄入食材？' }
					]
				},
				{
					id: 'overweight',
					name: '妊娠期超重',
					subQuestions: [
						{ id: 'overweight_nutrients', question: '妊娠期超重推荐摄入营养素？' }
					]
				},
				{
					id: 'obesity',
					name: '妊娠期肥胖',
					subQuestions: [
						{ id: 'obesity_nutrients', question: '妊娠期肥胖推荐摄入营养素？' }
					]
				}
			],
			expandedCategories: {
				early_reaction: false,
				severe_vomiting: false,
				gestational_diabetes: false,
				iron_deficiency: false,
				hypertension: false,
				overweight: false,
				obesity: false
			}
		}
	},
	computed: {
		todayDate() {
			const today = new Date();
			const year = today.getFullYear();
			const month = String(today.getMonth() + 1).padStart(2, '0');
			const day = String(today.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		},
		pregnancyCalculation() {
			try {
				const username = uni.getStorageSync('username');
				if (!username) {
					return {
						week: 0,
						day: 0,
						period: '未登录'
					};
				}

				const userProfileStr = uni.getStorageSync(`userProfile_${username}`);
				if (!userProfileStr) {
					return {
						week: 0,
						day: 0,
						period: '未设置'
					};
				}

				const userProfile = JSON.parse(userProfileStr);
				if (!userProfile.last_menstrual_date) {
					return {
						week: 0,
						day: 0,
						period: '未设置'
					};
				}

				const lastMenstrualDate = new Date(userProfile.last_menstrual_date);
				const today = new Date();

				// 检查日期是否有效
				if (isNaN(lastMenstrualDate.getTime())) {
					return {
						week: 0,
						day: 0,
						period: '日期格式错误'
					};
				}

				// 检查是否是未来日期
				if (lastMenstrualDate > today) {
					return {
						week: 0,
						day: 0,
						period: '日期设置错误'
					};
				}

				// 计算天数差
				const diffTime = today - lastMenstrualDate;
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

				// 计算周数和天数
				const weeks = Math.floor(diffDays / 7);
				const days = diffDays % 7;

				// 确定孕期阶段
				let period = '';
				if (weeks < 12) {
					period = '孕早期';
				} else if (weeks < 28) {
					period = '孕中期';
				} else if (weeks < 40) {
					period = '孕晚期';
				} else if (weeks <46) {
					period = '产褥、哺乳期';
				} else {
					period = '哺乳期';
				}

				return {
					week: weeks,
					day: days,
					period: period
				};
			} catch (e) {
				console.error('计算孕期信息失败', e);
				return {
					week: 0,
					day: 0,
					period: '计算错误'
				};
			}
		}
	},
	onLoad() {
		console.log('页面加载开始');
		console.log('营养素食物数据:', this.nutrientFoodData);
		// 监听资料更新事件
		uni.$on('profileUpdated', this.updatePregnancyInfo);
	},
	onUnload() {
		// 移除事件监听
		uni.$off('profileUpdated', this.updatePregnancyInfo);
	},
	onShow() {
		console.log('页面显示');
		// 检查用户是否已登录，如果已登录则开始预加载
		const username = uni.getStorageSync('username');
		if (username && !this.preloadedAnswers.nutrient && !this.isPreloading) {
			// 默认预加载营养素相关问答
			this.preloadNextAnswer('nutrient');
		}
	},
	methods: {
		startNewChat() {
					// 直接跳转到 qa-chat 页面
					uni.navigateTo({
						url: '/pages/index/qa-chat'
					});
				},
		updatePregnancyInfo(profile) {
			console.log('收到资料更新事件:', profile);
			if (profile && profile.last_menstrual_date) {
				const lastMenstrualDate = new Date(profile.last_menstrual_date);
				const today = new Date();

				// 计算天数差
				const diffTime = today - lastMenstrualDate;
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

				// 计算周数和天数
				const weeks = Math.floor(diffDays / 7);
				const days = diffDays % 7;

				// 确定孕期阶段
				let period = '';
				if (weeks < 12) {
					period = '孕早期';
				} else if (weeks < 28) {
					period = '孕中期';
				} else if (weeks < 40) {
					period = '孕晚期';
				} else if (weeks < 46) {
					period = '产褥、哺乳期';
				} else {
					period = '哺乳期';
				}

				this.pregnancyInfo = {
					week: weeks,
					day: days,
					period: period
				};

				console.log('更新完成，孕周信息:', this.pregnancyInfo);
			}
		},
		handleButtonClick(button) {
			// 如果点击的是当前已选中的按钮，则取消选中
			if (this.activeButton === button) {
				this.activeButton = '';
			} else {
				this.activeButton = button;
			}
		},
		// 获取孕早期相关数据
		getYunzaoItems(type) {
			let data = [];
			switch(type) {
				case 'early_food_types':
					data = this.yunzao1Data;
					break;
				case 'early_food_recommend':
					data = this.yunzao2Data;
					break;
				case 'early_dishes':
					data = this.yunzao3Data;
					break;
				case 'early_nutrients':
					data = this.yunzao4Data;
					break;
				case 'early_nutrient_limits':
					data = this.yunzao5Data;
					break;
			}
			// 确保返回的是数组
			return Array.isArray(data) ? data : [];
		},
		// 获取孕中期相关数据
		getYunzhongItems(type) {
			let data = [];
			switch(type) {
				case 'middle_food_limit':
					data = this.yunzhong1Data;
					break;
				case 'middle_nutrient_limits':
					data = this.yunzhong2Data;
					break;
				case 'middle_nutrients':
					data = this.yunzhong3Data;
					break;
				case 'middle_food_types':
					data = this.yunzhong4Data;
					break;
				case 'middle_food_recommend_items':
					data = this.yunzhong5Data;
					break;
				case 'middle_dishes':
					data = this.yunzhong6Data;
					break;
				case 'middle_food_forbidden':
					data = this.yunzhong7Data;
					break;
			}
			return Array.isArray(data) ? data : [];
		},
		// 获取孕晚期相关数据
		getYunwanItems(type) {
			let items = [];
			switch(type) {
				case 'late_nutrient_limits':
					items = this.yunwan1Data;
					break;
				case 'late_nutrients':
					items = this.yunwan2Data;
					break;
				case 'late_food_types':
					items = this.yunwan3Data;
					break;
				case 'late_food_recommend':
					items = this.yunwan4Data;
					break;
				case 'late_dishes':
					items = this.yunwan5Data;
					break;
			}
			return Array.isArray(items) ? items : [];
		},
		// 获取产褥期相关数据
		getChanruItems(type) {
			let items = [];
			switch(type) {
				case 'postpartum_food_types':
					items = this.chanru1Data;
					break;
				case 'postpartum_food_recommend':
					items = this.chanru2Data;
					break;
				case 'postpartum_dishes':
					items = this.chanru3Data;
					break;
				case 'postpartum_food_forbidden':
					items = this.chanru4Data;
					break;
			}
			return Array.isArray(items) ? items : [];
		},
		// 获取母乳喂养相关数据
		getBuruItems(type) {
			let items = [];
			switch(type) {
				case 'breastfeeding_promote_foods':
					items = this.buru1Data;
					break;
				case 'breastfeeding_promote_dishes':
					items = this.buru2Data;
					break;
				case 'breastfeeding_nutrient_limits':
					items = this.buru3Data;
					break;
				case 'breastfeeding_nutrients':
					items = this.buru4Data;
					break;
				case 'breastfeeding_food_types':
					items = this.buru5Data;
					break;
				case 'breastfeeding_food_recommend':
					items = this.buru6Data;
					break;
				case 'breastfeeding_dishes':
					items = this.buru7Data;
					break;
				case 'breastfeeding_food_forbidden':
					items = this.buru8Data;
					break;
				case 'breastfeeding_benefits':
					items = this.buru9Data;
					break;
			}
			return Array.isArray(items) ? items : [];
		},
		// 预加载下一个答案
		async preloadNextAnswer(type = 'nutrient') {
			if (this.isPreloading) return;
			
			this.isPreloading = true;
			try {
				let prompt = '';
				// 处理母乳喂养相关问题
				if (['breastfeeding_promote_foods', 'breastfeeding_promote_dishes', 'breastfeeding_nutrient_limits', 
					'breastfeeding_nutrients', 'breastfeeding_food_types', 'breastfeeding_food_recommend', 
					'breastfeeding_dishes', 'breastfeeding_food_forbidden', 'breastfeeding_benefits'].includes(type)) {
					const items = this.getBuruItems(type);
					if (!items || items.length === 0) {
						console.error('没有找到对应的数据:', type);
						return;
					}
					
					// 如果数据少于3个，使用所有数据；否则随机选择3个
					const randomItems = items.length <= 3 ? items : items.sort(() => 0.5 - Math.random()).slice(0, 3);
					
					let title = '';
					switch(type) {
						case 'breastfeeding_promote_foods':
							title = '哪些食材可以促进乳汁分泌？';
							break;
						case 'breastfeeding_promote_dishes':
							title = '哪些菜品可以促进乳汁分泌？';
							break;
						case 'breastfeeding_nutrient_limits':
							title = '母乳喂养推荐摄入营养素最多可以吃多少？';
							break;
						case 'breastfeeding_nutrients':
							title = '母乳喂养推荐摄入哪些营养素？';
							break;
						case 'breastfeeding_food_types':
							title = '母乳喂养推荐摄入哪些食材种类？';
							break;
						case 'breastfeeding_food_recommend':
							title = '母乳喂养推荐摄入哪些食材？';
							break;
						case 'breastfeeding_dishes':
							title = '母乳喂养推荐摄入哪些菜品？';
							break;
						case 'breastfeeding_food_forbidden':
							title = '母乳喂养禁忌摄入哪些食材？';
							break;
						case 'breastfeeding_benefits':
							title = '母乳喂养的好处是什么？';
							break;
					}

					prompt = `你是一个专业的营养师，请根据以下信息，用亲切自然的语气回答问题。
问题：${title}

参考信息：
${randomItems.map((item, index) => {
	const values = Object.entries(item)
		.filter(([key, val]) => val !== undefined && val !== null)
		.map(([key, val]) => val);
	return `${index + 1}. ${values.join('，')}`;
}).join('\n')}

请根据以上${randomItems.length}组信息，生成一个专业、温暖且简短的回答。要求：
1. 语气要像专业医生跟妈妈聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 可以使用序号或列表形式
5. 确保包含所有${randomItems.length}组信息的核心内容`;
				}
				// 处理产褥期相关问题
				else if (['postpartum_food_types', 'postpartum_food_recommend', 'postpartum_dishes', 'postpartum_food_forbidden'].includes(type)) {
					const items = this.getChanruItems(type);
					if (!items || items.length === 0) {
						console.error('没有找到对应的数据:', type);
						return;
					}
					
					// 如果数据少于3个，使用所有数据；否则随机选择3个
					const randomItems = items.length <= 3 ? items : items.sort(() => 0.5 - Math.random()).slice(0, 3);
					
					let title = '';
					switch(type) {
						case 'postpartum_food_types':
							title = '产褥期推荐摄入哪些食材种类？';
							break;
						case 'postpartum_food_recommend':
							title = '产褥期推荐摄入哪些食材？';
							break;
						case 'postpartum_dishes':
							title = '产褥期推荐摄入哪些菜品？';
							break;
						case 'postpartum_food_forbidden':
							title = '产褥期禁忌摄入哪些食材？';
							break;
					}

					prompt = `你是一个专业的营养师，请根据以下信息，用亲切自然的语气回答问题。
问题：${title}

参考信息：
${randomItems.map((item, index) => {
	const values = Object.entries(item)
		.filter(([key, val]) => val !== undefined && val !== null)
		.map(([key, val]) => val);
	return `${index + 1}. ${values.join('，')}`;
}).join('\n')}

请根据以上${randomItems.length}组信息，生成一个专业、温暖且简短的回答。要求：
1. 语气要像专业医生跟产妇聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 可以使用序号或列表形式
5. 确保包含所有${randomItems.length}组信息的核心内容`;
				}
				// 处理孕晚期相关问题
				else if (['late_nutrient_limits', 'late_nutrients', 'late_food_types', 'late_food_recommend', 'late_dishes'].includes(type)) {
					const items = this.getYunwanItems(type);
					if (!items || items.length === 0) {
						console.error('没有找到对应的数据:', type);
						return;
					}
					
					// 如果数据少于3个，使用所有数据；否则随机选择3个
					const randomItems = items.length <= 3 ? items : items.sort(() => 0.5 - Math.random()).slice(0, 3);
					
					let title = '';
					switch(type) {
						case 'late_nutrient_limits':
							title = '孕晚期推荐摄入营养素最多可以吃多少？';
							break;
						case 'late_nutrients':
							title = '孕晚期推荐摄入哪些营养素？';
							break;
						case 'late_food_types':
							title = '孕晚期推荐摄入哪些食材种类？';
							break;
						case 'late_food_recommend':
							title = '孕晚期推荐摄入哪些食材？';
							break;
						case 'late_dishes':
							title = '孕晚期推荐摄入哪些菜品？';
							break;
					}

					prompt = `你是一个专业的营养师，请根据以下信息，用亲切自然的语气回答问题。
问题：${title}

参考信息：
${randomItems.map((item, index) => {
	const values = Object.entries(item)
		.filter(([key, val]) => val !== undefined && val !== null)
		.map(([key, val]) => val);
	return `${index + 1}. ${values.join('，')}`;
}).join('\n')}

请根据以上${randomItems.length}组信息，生成一个专业、温暖且简短的回答。要求：
1. 语气要像专业医生跟孕妇聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 可以使用序号或列表形式
5. 确保包含所有${randomItems.length}组信息的核心内容`;
				}
				// 处理孕中期相关问题
				else if (['middle_food_limit', 'middle_nutrient_limits', 'middle_nutrients', 
					'middle_food_types', 'middle_food_recommend_items', 'middle_dishes', 'middle_food_forbidden'].includes(type)) {
					const items = this.getYunzhongItems(type);
					if (!items || items.length === 0) {
						console.error('没有找到对应的数据:', type);
						return;
					}
					
					// 如果数据少于3个，使用所有数据；否则随机选择3个
					const randomItems = items.length <= 3 ? items : items.sort(() => 0.5 - Math.random()).slice(0, 3);
					
					let title = '';
					switch(type) {
						case 'middle_food_limit':
							title = '孕中期限制摄入哪些食材？';
							break;
						case 'middle_nutrient_limits':
							title = '孕中期推荐摄入营养素最多可以吃多少？';
							break;
						case 'middle_nutrients':
							title = '孕中期推荐摄入哪些营养素？';
							break;
						case 'middle_food_types':
							title = '孕中期推荐摄入哪些食材种类？';
							break;
						case 'middle_food_recommend_items':
							title = '孕中期推荐摄入哪些食材？';
							break;
						case 'middle_dishes':
							title = '孕中期推荐摄入哪些菜品？';
							break;
						case 'middle_food_forbidden':
							title = '孕中期禁忌摄入哪些食材？';
							break;
					}

					prompt = `你是一个专业的营养师，请根据以下信息，用亲切自然的语气回答问题。
问题：${title}

参考信息：
${randomItems.map((item, index) => {
	const values = Object.entries(item)
		.filter(([key, val]) => val !== undefined && val !== null)
		.map(([key, val]) => val);
	return `${index + 1}. ${values.join('，')}`;
}).join('\n')}

请根据以上${randomItems.length}组信息，生成一个专业、温暖且简短的回答。要求：
1. 语气要像专业医生跟孕妇聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 可以使用序号或列表形式
5. 确保包含所有${randomItems.length}组信息的核心内容`;

				} else if (['early_food_types', 'early_food_recommend', 'early_dishes', 'early_nutrients', 'early_nutrient_limits'].includes(type)) {
					const items = this.getYunzaoItems(type);
					if (!items || items.length === 0) {
						console.error('没有找到对应的数据:', type);
						return;
					}
					
					// 如果数据少于3个，使用所有数据；否则随机选择3个
					const randomItems = items.length <= 3 ? items : items.sort(() => 0.5 - Math.random()).slice(0, 3);
					
					let title = '';
					switch(type) {
						case 'early_food_types':
							title = '孕早期推荐摄入哪些食材种类？';
							break;
						case 'early_food_recommend':
							title = '孕早期推荐摄入哪些食材？';
							break;
						case 'early_dishes':
							title = '孕早期推荐摄入哪些菜品？';
							break;
						case 'early_nutrients':
							title = '孕早期推荐摄入哪些营养素？';
							break;
						case 'early_nutrient_limits':
							title = '孕早期推荐摄入营养素最多可以吃多少？';
							break;
					}

					prompt = `你是一个专业的营养师，请根据以下信息，用亲切自然的语气回答问题。
问题：${title}

参考信息：
${randomItems.map((item, index) => {
	if (type === 'early_food_types') {
		return `${index + 1}. ${item.foodType}：${item.recommend}`;
	} else {
		const values = Object.entries(item)
			.filter(([key, val]) => val !== undefined && val !== null)
			.map(([key, val]) => val);
		return `${index + 1}. ${values.join('，')}`;
	}
}).join('\n')}

请根据以上${randomItems.length}组信息，生成一个专业、温暖且简短的回答。要求：
1. 语气要像专业医生跟孕妇聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 可以使用序号或列表形式
5. 确保包含所有${randomItems.length}组信息的核心内容`;

				} else if (type === 'nutrient') {
					const randomItems = this.getRandomNutrientItems();
					prompt = `你是一个专业的营养师，请根据以下信息，用亲切自然的语气回答问题。
问题：吃什么食物可以补充相应营养素？

参考信息：
${randomItems.map((item, index) => `${index + 1}. ${item.food}可以补充${item.nutrient}，${item.supplement}`).join('\n')}

请根据以上${randomItems.length}组信息，生成一个专业、温暖且简短的回答。要求：
1. 语气要像专业医生跟孕妇聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 可以使用序号或列表形式
5. 确保包含所有${randomItems.length}组信息的核心内容`;

				} else if (type === 'effect') {
					const randomItems = this.getRandomEffectItems();
					prompt = `你是一个专业的营养师，请根据以下信息，用亲切自然的语气回答问题。
问题：营养素或食材的功效和不良影响？

参考信息：
${randomItems.map((item, index) => `${index + 1}. ${item.nutrient}的功效：${item.benefits}，过量可能：${item.risks}`).join('\n')}

请根据以上${randomItems.length}组信息，生成一个专业、温暖且简短的回答。要求：
1. 语气要像专业医生跟孕妇聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 可以使用序号或列表形式
5. 确保包含所有${randomItems.length}组信息的核心内容`;

				} else if (type === 'special') {
					const randomItems = this.getRandomSpecialItems();
					prompt = `你是一个专业的营养师，请根据以下信息，用亲切自然的语气回答问题。
问题：孕期特殊情况饮食？

参考信息：
${randomItems.map((item, index) => `${index + 1}. ${item.condition}的饮食建议：${item.diet}，注意事项：${item.tips}`).join('\n')}

请根据以上${randomItems.length}组信息，生成一个专业、温暖且简短的回答。要求：
1. 语气要像专业医生跟孕妇聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 可以使用序号或列表形式
5. 确保包含所有${randomItems.length}组信息的核心内容`;
				}

				const res = await new Promise((resolve, reject) => {
					uni.request({
						url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
						method: 'POST',
						data: {
							model: 'glm-4-flash',
							messages: [{ role: 'user', content: prompt }],
							temperature: 0.7,
							top_p: 0.9,
							max_tokens: 200,
							stream: false
						},
						header: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer 678dcb5e536d4e11bf964c7da157e76b.A1Jdp6FYTPymwX7B'
						},
						success: resolve,
						fail: reject
					});
				});

				if (res.data && res.data.choices && res.data.choices[0] && res.data.choices[0].message) {
					this.preloadedAnswers[type] = res.data.choices[0].message.content;
					console.log('预加载答案成功:', type);
				}
			} catch (err) {
				console.error('预加载答案失败:', err);
			} finally {
				this.isPreloading = false;
			}
		},
		handleTextLinkClick(type) {
			if (['middle_food_limit', 'middle_nutrient_limits', 'middle_nutrients', 
				'middle_food_types', 'middle_food_recommend_items', 'middle_dishes', 'middle_food_forbidden',
				'early_food_types', 'early_food_recommend', 'early_dishes', 'early_nutrients', 'early_nutrient_limits',
				'late_nutrient_limits', 'late_nutrients', 'late_food_types', 'late_food_recommend', 'late_dishes',
				'postpartum_food_types', 'postpartum_food_recommend', 'postpartum_dishes', 'postpartum_food_forbidden',
				'breastfeeding_promote_foods', 'breastfeeding_promote_dishes', 'breastfeeding_nutrient_limits', 
				'breastfeeding_nutrients', 'breastfeeding_food_types', 'breastfeeding_food_recommend', 
				'breastfeeding_dishes', 'breastfeeding_food_forbidden', 'breastfeeding_benefits'].includes(type)) {
				
				// 获取标题
				const title = this.getTitle(type);
				
				// 直接跳转到聊天页面，由聊天页面显示加载动画
				if (this.preloadedAnswers[type]) {
					// 如果有预加载的答案，则传递答案
					const answer = this.preloadedAnswers[type];
					this.preloadedAnswers[type] = null;
					uni.navigateTo({
						url: `/pages/index/qa-chat?id=${type}&title=${encodeURIComponent(title)}&question=${encodeURIComponent(title)}&answer=${encodeURIComponent(answer)}`
					});
					// 在后台预加载下一次的答案
					setTimeout(() => {
						this.preloadNextAnswer(type);
					}, 500);
				} else {
					// 没有预加载的答案，直接跳转，聊天页面将显示加载动画
					uni.navigateTo({
						url: `/pages/index/qa-chat?id=${type}&title=${encodeURIComponent(title)}&question=${encodeURIComponent(title)}`
					});
					// 在后台预加载下一次的答案
					setTimeout(() => {
						this.preloadNextAnswer(type);
					}, 500);
				}
				return;
			}
			
			// 根据当前选中的按钮类型显示对应的答案
			let qaList = [];
			switch(this.activeButton) {
				case 'early':
					qaList = this.earlyPregnancyQA;
					break;
				case 'middle':
					qaList = this.middlePregnancyQA;
					break;
				case 'late':
					qaList = this.latePregnancyQA;
					break;
				case 'postpartum':
					qaList = this.postpartumQA;
					break;
				case 'breastfeeding':
					qaList = this.breastfeedingQA;
					break;
			}
			
			if (qaList.length > 0) {
				const qa = qaList.find(item => item.id === type);
				if (qa) {
					uni.navigateTo({
						url: `/pages/index/qa-chat?id=${type}&title=${encodeURIComponent(qa.question)}&question=${encodeURIComponent(qa.question)}&answer=${encodeURIComponent(qa.answer)}`
					});
				}
			}
		},
		// 切换抽屉展开/收起状态
		toggleDrawer(type) {
			this.expandedDrawers[type] = !this.expandedDrawers[type];
		},
		
		// 处理子问题点击
		handleSubQuestionClick(parentType, subId) {
			let subQuestions = [];
			switch(parentType) {
				case 'nutrient':
					subQuestions = this.nutrientSubQuestions;
					break;
				case 'effect':
					subQuestions = this.effectSubQuestions;
					break;
				case 'special':
					subQuestions = this.specialSubQuestions;
					break;
			}
			
			const subQuestion = subQuestions.find(item => item.id === subId);
			if (!subQuestion) {
				return;
			}
			
			// 构建完整的答案键名
			const answerKey = `${parentType}_${subId}`;
			
			// 检查是否有预加载的答案
			if (this.preloadedAnswers[answerKey]) {
				// 如果有预加载的答案，则传递答案
				const answer = this.preloadedAnswers[answerKey];
				this.preloadedAnswers[answerKey] = null;
				uni.navigateTo({
					url: `/pages/index/qa-chat?id=${parentType}_${subId}&title=${encodeURIComponent(subQuestion.question)}&question=${encodeURIComponent(subQuestion.question)}&answer=${encodeURIComponent(answer)}`
				});
				// 在后台预加载下一次的答案
				setTimeout(() => {
					this.preloadSubQuestionAnswer(parentType, subId);
				}, 500);
			} else {
				// 没有预加载的答案，直接跳转，聊天页面将显示加载动画
				uni.navigateTo({
					url: `/pages/index/qa-chat?id=${parentType}_${subId}&title=${encodeURIComponent(subQuestion.question)}&question=${encodeURIComponent(subQuestion.question)}`
				});
				// 在后台预加载下一次的答案
				setTimeout(() => {
					this.preloadSubQuestionAnswer(parentType, subId);
				}, 500);
			}
		},
		
		// 预加载子问题答案
		async preloadSubQuestionAnswer(parentType, subId) {
			if (this.isPreloading) return;
			
			this.isPreloading = true;
			try {
				let items = [];
				let prompt = '';
				const answerKey = `${parentType}_${subId}`;
				
				// 根据问题类型和子问题ID获取相关数据
				if (parentType === 'nutrient') {
					// 获取该子问题对应的数据
					items = this.getMainNutrientItems(subId);
					
					// 如果数据少于3个，使用所有数据；否则随机选择3个
					const randomItems = items.length <= 3 ? items : items.sort(() => 0.5 - Math.random()).slice(0, 3);
					
					const subQuestion = this.nutrientSubQuestions.find(q => q.id === subId);
					prompt = `你是一个专业的营养师，请根据以下信息，用亲切自然的语气回答问题。
问题：${subQuestion ? subQuestion.question : '哪些食物可以补充相应营养素？'}

参考信息：
${randomItems.map((item, index) => {
    const values = Object.entries(item)
        .filter(([key, val]) => val !== undefined && val !== null)
        .map(([key, val]) => val);
    return `${index + 1}. ${values.join('，')}`;
}).join('\n')}

请根据以上${randomItems.length}组信息，生成一个专业、温暖且简短的回答。要求：
1. 语气要像专业医生跟孕妇聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 可以使用序号或列表形式
5. 确保包含所有${randomItems.length}组信息的核心内容`;
				} else if (parentType === 'effect') {
					// 获取该子问题对应的数据
					items = this.getMainEffectItems(subId);
					
					// 如果数据少于3个，使用所有数据；否则随机选择3个
					const randomItems = items.length <= 3 ? items : items.sort(() => 0.5 - Math.random()).slice(0, 3);
					
					const subQuestion = this.effectSubQuestions.find(q => q.id === subId);
					prompt = `你是一个专业的营养师，请根据以下信息，用亲切自然的语气回答问题。
问题：${subQuestion ? subQuestion.question : '营养素或食材的功效和不良影响？'}

参考信息：
${randomItems.map((item, index) => {
    const values = Object.entries(item)
        .filter(([key, val]) => val !== undefined && val !== null)
        .map(([key, val]) => val);
    return `${index + 1}. ${values.join('，')}`;
}).join('\n')}

请根据以上${randomItems.length}组信息，生成一个专业、温暖且简短的回答。要求：
1. 语气要像专业医生跟孕妇聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 可以使用序号或列表形式
5. 确保包含所有${randomItems.length}组信息的核心内容`;
				} else if (parentType === 'special') {
					// 获取与特定孕期状况相关的饮食建议
					items = this.specialData.filter(item => {
						switch(subId) {
							case 'nausea':
								return item.condition.includes('孕吐') || item.condition.includes('恶心');
							case 'diabetes':
								return item.condition.includes('糖尿病');
							case 'anemia':
								return item.condition.includes('贫血');
							case 'constipation':
								return item.condition.includes('便秘');
							case 'heartburn':
								return item.condition.includes('烧心') || item.condition.includes('胃酸');
							default:
								return false;
						}
					});
					
					if (items.length > 3) {
						items = items.sort(() => 0.5 - Math.random()).slice(0, 3);
					}
					
					const subQuestion = this.specialSubQuestions.find(q => q.id === subId);
					prompt = `你是一个专业的营养师，请根据以下信息，用亲切自然的语气回答问题。
问题：${subQuestion ? subQuestion.question : '孕期特殊情况饮食？'}

参考信息：
${items.map((item, index) => `${index + 1}. ${item.condition}的饮食建议：${item.diet}，注意事项：${item.tips}`).join('\n')}

请根据以上${items.length}组信息，生成一个专业、温暖且简短的回答。要求：
1. 语气要像专业医生跟孕妇聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 可以使用序号或列表形式
5. 确保包含所有${items.length}组信息的核心内容`;
				}
				
				// 如果没有匹配到数据，返回
				if (items.length === 0) {
					this.isPreloading = false;
					return;
				}
				
				// 发送API请求获取回答
				const res = await new Promise((resolve, reject) => {
					uni.request({
						url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
						method: 'POST',
						data: {
							model: 'glm-4-flash',
							messages: [{ role: 'user', content: prompt }],
							temperature: 0.7,
							top_p: 0.9,
							max_tokens: 200,
							stream: false
						},
						header: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer 678dcb5e536d4e11bf964c7da157e76b.A1Jdp6FYTPymwX7B'
						},
						success: (res) => {
							console.log('API调用成功:', res);
							resolve(res);
						},
						fail: (err) => {
							console.error('API调用失败:', err);
							reject(err);
						}
					});
				});
				
				if (res.data && res.data.choices && res.data.choices[0] && res.data.choices[0].message) {
					this.preloadedAnswers[answerKey] = res.data.choices[0].message.content;
					console.log('预加载子问题答案成功:', answerKey);
				} else {
					console.error('API返回异常:', res);
				}
			} catch (err) {
				console.error('预加载子问题答案失败:', err);
			} finally {
				this.isPreloading = false;
			}
		},
		
		// 获取主营养素子问题数据
		getMainNutrientItems(type) {
			let items = [];
			switch(type) {
				case 'protein': // 哪些食材含有蛋白质？
					items = this.main11Data;
					break;
				case 'calcium': // 哪些食材含有钙？
					items = this.main12Data;
					break;
				case 'iron': // 哪些食材含有铁？
					items = this.main13Data;
					break;
				case 'vitamin_a': // 哪些食材含有维生素A？
					items = this.main14Data;
					break;
				case 'vitamin_b1': // 哪些食材含有维生素B1？
					items = this.main15Data;
					break;
				case 'vitamin_b2': // 哪些食材含有维生素B2?
					items = this.main16Data;
					break;
				case 'vitamin_c': // 哪些食材含有维生素C？
					items = this.main17Data;
					break;
				case 'folate': // 哪些食材含有叶酸？
					items = this.main18Data;
					break;
				case 'vitamin_c_types': // 哪些食材种类含有维生素C？
					items = this.main19Data;
					break;
				case 'folate_types': // 哪些食材种类含有叶酸？
					items = this.main110Data;
					break;
			}
			
			// 确保返回的是数组
			return Array.isArray(items) ? items : [];
		},
		
		// 获取功效相关子问题数据
		getMainEffectItems(type) {
			let items = [];
			switch(type) {
				case 'nutrient_effects': // 营养素的功效
					items = this.main21Data;
					break;
				case 'food_type_effects': // 食材种类的功效
					items = this.main22Data;
					break;
				case 'food_effects': // 食材的功效
					items = this.main23Data;
					break;
				case 'dish_effects': // 菜品的功效
					items = this.main24Data;
					break;
			}
			
			// 确保返回的是数组
			return Array.isArray(items) ? items : [];
		},
		toggleSpecialCategory(categoryId) {
			this.expandedCategories[categoryId] = !this.expandedCategories[categoryId];
		},
		handleSpecialSubQuestionClick(categoryId, subId) {
			// 找到对应的问题
			const category = this.specialCategories.find(cat => cat.id === categoryId);
			if (!category) {
				return;
			}
			
			const subQuestion = category.subQuestions.find(q => q.id === subId);
			if (!subQuestion) {
				return;
			}
			
			// 构建完整的答案键名
			const answerKey = `special_${categoryId}_${subId}`;
			
			// 检查是否有预加载的答案
			if (this.preloadedAnswers[answerKey]) {
				// 如果有预加载的答案，则传递答案
				const answer = this.preloadedAnswers[answerKey];
				this.preloadedAnswers[answerKey] = null;
				uni.navigateTo({
					url: `/pages/index/qa-chat?id=special_${categoryId}_${subId}&title=${encodeURIComponent(subQuestion.question)}&question=${encodeURIComponent(subQuestion.question)}&answer=${encodeURIComponent(answer)}`
				});
				// 在后台预加载下一次的答案
				setTimeout(() => {
					this.preloadSpecialAnswer(categoryId, subId);
				}, 500);
			} else {
				// 没有预加载的答案，直接跳转，聊天页面将显示加载动画
				uni.navigateTo({
					url: `/pages/index/qa-chat?id=special_${categoryId}_${subId}&title=${encodeURIComponent(subQuestion.question)}&question=${encodeURIComponent(subQuestion.question)}`
				});
				// 在后台预加载下一次的答案
				setTimeout(() => {
					this.preloadSpecialAnswer(categoryId, subId);
				}, 500);
			}
		},
		
		// 预加载特殊情况答案
		async preloadSpecialAnswer(categoryId, subId) {
			if (this.isPreloading) return;
			
			this.isPreloading = true;
			try {
				let items = [];
				const answerKey = `special_${categoryId}_${subId}`;
				
				// 获取对应的数据
				if (categoryId === 'early_reaction') {
					items = this.getZaoyunItems(subId);
				} else if (categoryId === 'severe_vomiting') {
					items = this.getJutuItems(subId);
				} else if (categoryId === 'diabetes') {
					items = this.getTangniaoItems(subId);
				} else if (categoryId === 'anemia') {
					items = this.getPinxueItems(subId);
				} else if (categoryId === 'hypertension') {
					items = this.getGaoxueyaItems(subId);
				} else if (categoryId === 'overweight') {
					items = this.getChaozhongItems(subId);
				} else if (categoryId === 'obesity') {
					items = this.getFeipangItems(subId);
				}
				
				if (!items || items.length === 0) {
					console.error('没有找到对应的数据:', categoryId, subId);
					return;
				}
				
				// 如果数据少于3个，使用所有数据；否则随机选择3个
				const randomItems = items.length <= 3 ? items : items.sort(() => 0.5 - Math.random()).slice(0, 3);
				
				// 找到对应的问题
				const category = this.specialCategories.find(cat => cat.id === categoryId);
				const subQuestion = category.subQuestions.find(q => q.id === subId);
				
				const prompt = `你是一个专业的营养师，请根据以下信息，用亲切自然的语气回答问题。
问题：${subQuestion.question}

参考信息：
${randomItems.map((item, index) => {
	const values = Object.entries(item)
		.filter(([key, val]) => val !== undefined && val !== null)
		.map(([key, val]) => val);
	return `${index + 1}. ${values.join('，')}`;
}).join('\n')}

请根据以上${randomItems.length}组信息，生成一个专业、温暖且简短的回答。要求：
1. 语气要像专业医生跟孕妇聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 可以使用序号或列表形式
5. 确保包含所有${randomItems.length}组信息的核心内容`;
				
				const res = await new Promise((resolve, reject) => {
					uni.request({
						url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
						method: 'POST',
						data: {
							model: 'glm-4-flash',
							messages: [{ role: 'user', content: prompt }],
							temperature: 0.7,
							top_p: 0.9,
							max_tokens: 200,
							stream: false
						},
						header: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer 678dcb5e536d4e11bf964c7da157e76b.A1Jdp6FYTPymwX7B'
						},
						success: resolve,
						fail: reject
					});
				});
				
				if (res.data && res.data.choices && res.data.choices[0] && res.data.choices[0].message) {
					this.preloadedAnswers[answerKey] = res.data.choices[0].message.content;
					console.log('预加载特殊情况答案成功:', answerKey);
				}
			} catch (err) {
				console.error('预加载特殊情况答案失败:', err);
			} finally {
				this.isPreloading = false;
			}
		},
		// 获取早孕反应相关数据
		getZaoyunItems(type) {
			let items = [];
			switch(type) {
				case 'early_reaction_nutrients':
					items = this.zaoyun1Data;
					break;
				case 'early_reaction_food_types':
					items = this.zaoyun2Data;
					break;
				case 'early_reaction_foods':
					items = this.zaoyun3Data;
					break;
			}
			return Array.isArray(items) ? items : [];
		},
		// 获取妊娠剧吐相关数据
		getJutuItems(type) {
			let items = [];
			switch(type) {
				case 'severe_vomiting_nutrients':
					items = this.jutu1Data;
					break;
				case 'severe_vomiting_food_types':
					items = this.jutu2Data;
					break;
				case 'severe_vomiting_foods':
					items = this.jutu3Data;
					break;
				case 'severe_vomiting_dishes':
					items = this.jutu4Data;
					break;
			}
			return Array.isArray(items) ? items : [];
		},
		// 获取妊娠期糖尿病相关数据
		getTangniaoItems(type) {
			let items = [];
			switch(type) {
				case 'diabetes_limit_nutrients':
					items = this.tangniaobing1Data;
					break;
				case 'diabetes_limit_foods':
					items = this.tangniaobing2Data;
					break;
				case 'diabetes_recommend_nutrients':
					items = this.tangniaobing3Data;
					break;
				case 'diabetes_recommend_food_types':
					items = this.tangniaobing4Data;
					break;
				case 'diabetes_recommend_foods':
					items = this.tangniaobing5Data;
					break;
			}
			return Array.isArray(items) ? items : [];
		},
		
		// 获取妊娠期缺铁性贫血相关数据
		getPinxueItems(type) {
			let items = [];
			switch(type) {
				case 'anemia_nutrients':
					items = this.pinxue1Data;
					break;
				case 'anemia_food_types':
					items = this.pinxue2Data;
					break;
				case 'anemia_foods':
					items = this.pinxue3Data;
					break;
			}
			return Array.isArray(items) ? items : [];
		},
		
		// 获取妊娠期高血压相关数据
		getGaoxueyaItems(type) {
			let items = [];
			switch(type) {
				case 'hypertension_limit_food_types':
					items = this.gaoxueya1Data;
					break;
				case 'hypertension_recommend_nutrients':
					items = this.gaoxueya2Data;
					break;
				case 'hypertension_recommend_food_types':
					items = this.gaoxueya3Data;
					break;
				case 'hypertension_recommend_foods':
					items = this.gaoxueya4Data;
					break;
				case 'hypertension_avoid_foods':
					items = this.gaoxueya5Data;
					break;
			}
			return Array.isArray(items) ? items : [];
		},
		
		// 获取妊娠期超重相关数据
		getChaozhongItems(type) {
			let items = [];
			if (type === 'overweight_nutrients') {
				items = this.chaozhong1Data;
			}
			return Array.isArray(items) ? items : [];
		},
		
		// 获取妊娠期肥胖相关数据
		getFeipangItems(type) {
			let items = [];
			if (type === 'obesity_nutrients') {
				items = this.feipang1Data;
			}
			return Array.isArray(items) ? items : [];
		},
		getItemsByType(type, condition) {
			let items = [];
			if (type === 'special') {
				// 删除 specialData 相关代码
				items = []; // 或者根据新的数据结构获取数据
			} else {
				// ... existing code ...
			}
			return items;
		},
		// 获取标题函数
		getTitle(type) {
			switch(type) {
				// 孕中期标题
				case 'middle_food_limit':
					return '孕中期限制摄入哪些食材？';
				case 'middle_nutrient_limits':
					return '孕中期推荐摄入营养素最多可以吃多少？';
				case 'middle_nutrients':
					return '孕中期推荐摄入哪些营养素？';
				case 'middle_food_types':
					return '孕中期推荐摄入哪些食材种类？';
				case 'middle_food_recommend_items':
					return '孕中期推荐摄入哪些食材？';
				case 'middle_dishes':
					return '孕中期推荐摄入哪些菜品？';
				case 'middle_food_forbidden':
					return '孕中期禁忌摄入哪些食材？';
				// 孕早期标题
				case 'early_food_types':
					return '孕早期推荐摄入哪些食材种类？';
				case 'early_food_recommend':
					return '孕早期推荐摄入哪些食材？';
				case 'early_dishes':
					return '孕早期推荐摄入哪些菜品？';
				case 'early_nutrients':
					return '孕早期推荐摄入哪些营养素？';
				case 'early_nutrient_limits':
					return '孕早期推荐摄入营养素最多可以吃多少？';
				// 孕晚期标题
				case 'late_nutrient_limits':
					return '孕晚期推荐摄入营养素最多可以吃多少？';
				case 'late_nutrients':
					return '孕晚期推荐摄入哪些营养素？';
				case 'late_food_types':
					return '孕晚期推荐摄入哪些食材种类？';
				case 'late_food_recommend':
					return '孕晚期推荐摄入哪些食材？';
				case 'late_dishes':
					return '孕晚期推荐摄入哪些菜品？';
				// 产褥期标题
				case 'postpartum_food_types':
					return '产褥期推荐摄入哪些食材种类？';
				case 'postpartum_food_recommend':
					return '产褥期推荐摄入哪些食材？';
				case 'postpartum_dishes':
					return '产褥期推荐摄入哪些菜品？';
				case 'postpartum_food_forbidden':
					return '产褥期禁忌摄入哪些食材？';
				// 母乳喂养标题
				case 'breastfeeding_promote_foods':
					return '哪些食材可以促进乳汁分泌？';
				case 'breastfeeding_promote_dishes':
					return '哪些菜品可以促进乳汁分泌？';
				case 'breastfeeding_nutrient_limits':
					return '母乳喂养推荐摄入营养素最多可以吃多少？';
				case 'breastfeeding_nutrients':
					return '母乳喂养推荐摄入哪些营养素？';
				case 'breastfeeding_food_types':
					return '母乳喂养推荐摄入哪些食材种类？';
				case 'breastfeeding_food_recommend':
					return '母乳喂养推荐摄入哪些食材？';
				case 'breastfeeding_dishes':
					return '母乳喂养推荐摄入哪些菜品？';
				case 'breastfeeding_food_forbidden':
					return '母乳喂养禁忌摄入哪些食材？';
				case 'breastfeeding_benefits':
					return '母乳喂养的好处是什么？';
				default:
					return '';
			}
		}
	}
}
</script>

<style>
.qa-container {
	padding: 20rpx;
	
	
}

.pregnancy-info {
	margin-bottom: 30rpx;
}

.info-card {
	background: #fff;
	border-radius: 12rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.info-title {
	font-size: 32rpx;
	color: #333;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.info-content {
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.info-text {
	font-size: 28rpx;
	color: #666;
}

.pregnancy-week {
	color: #FF6B8B;
	font-weight: bold;
	font-size: 32rpx;
}

.pregnancy-day {
	color: #FF6B8B;
	font-weight: bold;
	font-size: 32rpx;
}

.pregnancy-period {
	color: #FF8DA1;
	font-weight: bold;
	font-size: 30rpx;
	display: inline-block;
}

.qa-list {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.qa-item {
	background: #fff;
	border-radius: 12rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.question {
	display: flex;
	align-items: flex-start;
	margin-bottom: 20rpx;
}

.q-icon {
	width: 40rpx;
	height: 40rpx;
	background: #007AFF;
	color: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	margin-right: 16rpx;
	flex-shrink: 0;
}

.q-text {
	font-size: 30rpx;
	color: #333;
	font-weight: bold;
}

.answer {
	display: flex;
	align-items: flex-start;
}

.a-icon {
	width: 40rpx;
	height: 40rpx;
	background: #4CD964;
	color: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	margin-right: 16rpx;
	flex-shrink: 0;
}

.a-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

.date-display {
	display: flex;
	align-items: center;
	gap: 10rpx;
}

.date-label {
	font-size: 28rpx;
	color: #666;
}

.date-value {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.spacing {
	margin: 0 4rpx;
}

.pregnancy-line {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

/* 功能按钮样式 */
.function-buttons {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	padding: 20rpx;
	margin-top: 30rpx;
}

.button-row {
	display: flex;
	justify-content: space-between;
	gap: 20rpx;
}

.function-button {
	flex: 1;
	min-width: 120rpx;
	height: 140rpx;
	background: #FFE4E8;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(255, 107, 139, 0.15);
	transition: all 0.3s ease;
	border: 2rpx solid #FFB6C1;
}

.function-button.active {
	background: #E6F7FF;
	border: 2rpx solid #91D5FF;
	transform: scale(1.05);
	box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.15);
}

.function-button:active {
	transform: scale(0.98);
}

.button-text {
	font-size: 28rpx;
	color: #FF6B8B;
	margin-top: 10rpx;
	font-weight: 600;
}

.button-subtext {
	font-size: 22rpx;
	color: #FF8DA1;
	margin-top: 4rpx;
}

.function-button.active .button-text {
	color: #1890FF;
	font-weight: 600;
}

.function-button.active .button-subtext {
	color: #69C0FF;
}

/* 文本链接样式 */
.text-links {
	margin-top: 40rpx;
	padding: 0 20rpx;
}

.text-link-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.text-link-item:last-child {
	border-bottom: none;
}

.link-text {
	font-size: 28rpx;
	color: #333;
	flex: 1;
	margin-right: 20rpx;
}

.text-link-item:active {
	background-color: #f8f8f8;
}

/* 抽屉组件样式 */
.drawer-item {
	background: #fff;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.drawer-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx;
	background-color: #fff;
	border-bottom: 1rpx solid #f5f5f5;
}

.drawer-header:active {
	background-color: #f9f9f9;
}

.drawer-content {
	background-color: #f9f9f9;
}

.drawer-subitem {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 30rpx 24rpx 50rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.drawer-subitem:active {
	background-color: #f0f0f0;
}

.drawer-subitem:last-child {
	border-bottom: none;
}

.subitem-text {
	font-size: 26rpx;
	color: #555;
}

.category-item {
	border-bottom: 1rpx solid #f0f0f0;
}

.category-item:last-child {
	border-bottom: none;
}

.category-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 30rpx;
	background-color: #f5f5f5;
}

.category-header:active {
	background-color: #f0f0f0;
}

.category-text {
	font-size: 26rpx;
	color: #444;
	font-weight: 500;
}

.category-content {
	background-color: #fff;
}

.start-chat-fab {
	position: fixed; /* 关键：让按钮“浮”在页面上，不随滚动条滚动 */
	right: 40rpx; /* 定位：距离屏幕右边 40rpx */

	/* 定位：距离底部 150rpx。
	   (说明文档中的底部导航栏 大约 100rpx 高，
	   我们设置 150rpx 是为了让按钮在导航栏上方，留出一些空隙)
	*/
	bottom: 150rpx; 

	width: 100rpx; /* 按钮的宽度 */
	height: 100rpx; /* 按钮的高度 */

	background-color: #ffffff; /* 添加一个白色背景，以防 png 图标是透明的 */
	border-radius: 50%; /* 关键：将按钮设置为圆形 (100rpx 的一半是 50rpx，50% 也可以) */

	/* 添加阴影，使其有“悬浮”感 */
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15); 

	z-index: 999; /* 确保它在页面所有元素的最上层 */

	padding: 1rpx; /* 给里面的 qa.png 图标留出 1rpx 的内边距 */
	box-sizing: border-box; /* 确保 padding 不会撑大 100rpx 的盒子 */

	transition: transform 0.2s ease; /* 添加一个点击动画，使其更平滑 */
}

.start-chat-fab:active {
	transform: scale(0.90); /* 点击时，按钮缩小到 90% */
}
</style> 