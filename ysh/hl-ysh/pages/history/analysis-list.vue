<template>
  <view class="analysis-history-container">
    <view class="analysis-header">
      <view class="back-button" @tap="goBack">
        <uni-icons type="back" size="24" color="#333"></uni-icons>
      </view>
      <text class="header-title">历史营养分析</text>
    </view>

    <scroll-view scroll-y class="history-list">
      <view v-if="isLoading" class="loading-state">
        <uni-load-more status="loading"></uni-load-more>
      </view>
      <view v-else-if="historyList.length === 0" class="empty-state">
        <text>暂无历史记录</text>
      </view>
      <view
        v-else
        v-for="(item, index) in historyList"
        :key="item._id || index" class="history-item"
        @tap="viewAnalysisDetail(item)"
      >
        <view class="history-item-content">
          <text class="history-item-date">{{ item.date }}</text>
          <text class="history-item-energy">总能量: {{ item.nutritionData.energy ? item.nutritionData.energy.toFixed(0) : 'N/A' }} kcal</text>
          <text class="history-item-foods">食物种类: {{ item.selectedFoods ? item.selectedFoods.length : 0 }} 种</text>
        </view>
        <uni-icons type="right" size="16" color="#999"></uni-icons>
        </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      historyList: [],
      isLoading: true // 初始设为 true，表示正在加载
    }
  },
  onShow() {
    // 每次进入页面时重新加载历史记录
    this.loadHistoryList();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    loadHistoryList() {
      const username = uni.getStorageSync('username');
      if (!username) {
        uni.showToast({ title: '请先登录', icon: 'none' });
        this.isLoading = false; // 停止加载状态
        this.historyList = []; // 清空列表
        return;
      }

      this.isLoading = true; // 开始加载
      console.log('开始获取营养分析历史记录 for username:', username);

      uni.request({
        url: this.$apiUrl + 'get_analysis_history', // 调用后端获取接口
        method: 'GET',
        data: {
          username: username // 将用户名作为查询参数发送
        },
        success: (res) => {
          console.log('获取历史记录 API 响应:', res); // 打印完整响应
          if (res.statusCode === 200 && res.data.data) {
            // 检查返回的数据是否是数组
            if (Array.isArray(res.data.data)) {
               this.historyList = res.data.data;
               console.log('历史记录加载成功:', this.historyList);
            } else {
                console.error('获取历史记录失败: 后端返回的 data 不是数组');
                uni.showToast({ title: '获取记录格式错误', icon: 'none' });
                this.historyList = [];
            }
          } else {
            console.error('获取历史记录失败 (后端):', res.data);
            const detail = res.data && res.data.detail ? res.data.detail : '获取记录失败';
            uni.showToast({ title: detail, icon: 'none' });
            this.historyList = [];
          }
        },
        fail: (err) => {
          console.error('获取历史记录请求失败 (网络):', err);
          uni.showToast({ title: '网络错误，获取记录失败', icon: 'none' });
          this.historyList = [];
        },
        complete: () => {
          this.isLoading = false; // 结束加载状态
          console.log('获取历史记录请求完成');
        }
      });
    },
    viewAnalysisDetail(item) {
      // 跳转回 analysis-result 页面，传递整个历史记录对象
      // 注意：URL 长度可能有限制，如果 item 对象过大，可能需要只传递 ID，让结果页重新请求详情
      try {
          const itemString = JSON.stringify(item);
          console.log('准备跳转到详情页，传递数据:', itemString);
          uni.navigateTo({
            // 在 key 名中使用 "history" 以更好地区分
            url: `/pages/index/analysis-result?historyRecord=${encodeURIComponent(itemString)}`
          });
      } catch (e) {
          console.error('序列化历史记录失败:', e);
          uni.showToast({title: '无法查看详情', icon: 'none'});
      }
    }
  }
}
</script>

<style>
/* 样式尽量参考 chat-history.vue */
.analysis-history-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 自定义导航栏样式 */
.analysis-header {
  height: 90rpx; /* 或根据需要调整 */
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  padding-top: var(--status-bar-height); /* 适配状态栏高度 */
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  position: sticky; /* 使其固定在顶部 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.back-button { /* 复用 chat-history 的样式 */
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title { /* 复用 chat-history 的样式 */
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  text-align: center;
  flex: 1;
  margin-right: 60rpx; /* 补偿返回按钮的宽度 */
}

.history-list { /* 复用 chat-history 的样式 */
  flex: 1;
  padding: 20rpx;
  box-sizing: border-box;
}

.history-item { /* 复用 chat-history 的样式 */
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.history-item-content {
  flex: 1;
  margin-right: 20rpx;
  overflow: hidden;
}

.history-item-date {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.history-item-energy {
  font-size: 26rpx;
  color: #666;
  display: block;
   margin-bottom: 6rpx; /* 添加间距 */
}

.history-item-foods { /* 新增食物种类样式 */
    font-size: 24rpx;
    color: #999;
    display: block;
}

.loading-state, .empty-state { /* 复用 chat-history 的样式 */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx; /* 或根据需要调整 */
  color: #999;
  font-size: 28rpx;
}
</style>