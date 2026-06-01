<template>
  <view class="chat-history-container">
    <view class="chat-header">
      <view class="back-button" @tap="goBack">
        <uni-icons type="back" size="24" color="#333"></uni-icons>
      </view>
      <text class="header-title">历史记录</text>
    </view>
    
    <scroll-view scroll-y class="history-list">
      <view 
        v-for="(item, index) in historyList" 
        :key="index"
        class="history-item"
        @tap="viewChatDetail(item)"
      >
        <view class="history-item-content">
          <text class="history-item-title">{{ item.title }}</text>
          <text class="history-item-preview">{{ item.preview }}</text>
          <text class="history-item-time">{{ item.time }}</text>
        </view>
        <view class="delete-button" @tap.stop="showDeleteConfirm(item)">
          <uni-icons type="trash" size="24" color="#999"></uni-icons>
        </view>
      </view>
      <view v-if="historyList.length === 0" class="empty-state">
        <text>暂无历史记录</text>
      </view>
    </scroll-view>

    <uni-popup ref="deletePopup" type="dialog">
      <uni-popup-dialog
        type="warn"
        title="确认删除"
        content="确定要删除这条对话记录吗？"
        :before-close="true"
        @confirm="confirmDelete"
        @close="cancelDelete"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      historyList: [],
      _itemToDelete: null // 用于临时存储要删除项的 ID
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
        console.warn('未获取到用户名，无法加载历史记录');
        this.historyList = []; // 清空列表
        return;
      }

      console.log('开始加载本地聊天记录 for username:', username);

      let list = [];
      try {
        // 获取所有本地存储的 key
        const res = uni.getStorageInfoSync();
        const keys = res.keys;

        // 筛选出属于当前用户的聊天记录 key
        const chatKeys = keys.filter(key => key.startsWith(`chat_history_${username}_`));
        console.log('找到的聊天记录 Keys:', chatKeys);

        chatKeys.forEach(key => {
          try {
            const historyStr = uni.getStorageSync(key);
            if (historyStr) {
              const messages = JSON.parse(historyStr);

              if (Array.isArray(messages) && messages.length > 0) {
                // 从 key 中提取 question_id
                const questionId = key.replace(`chat_history_${username}_`, '');

                // 提取标题 (第一个用户消息) 和预览 (第一个系统消息)
                const userMessage = messages.find(msg => msg.type === 'user');
                const systemMessage = messages.find(msg => msg.type === 'system' && !msg.isThinking); // 忽略还在思考的消息

                // 提取时间 (最后一个消息的时间)
                const lastMessage = messages[messages.length - 1];

                list.push({
                  question_id: questionId,
                  // 如果找不到用户消息，使用 questionId 或默认标题
                  title: userMessage ? userMessage.content : (questionId.startsWith('custom_') ? '自定义对话' : questionId.replace(/_/g, ' ')),
                  preview: systemMessage ? systemMessage.content.substring(0, 50) + '...' : '...', // 截取预览
                  time: lastMessage ? lastMessage.time : '', // 使用最后消息的时间
                  // messages: messages //如果详情页需要，可以保留
                });
              }
            }
          } catch (e) {
            console.error(`解析 key ${key} 失败:`, e);
          }
        });

        // (可选) 按时间或其他方式排序
        // list.sort((a, b) => { ... });

        this.historyList = list;
        console.log('加载完成，historyList:', this.historyList);

      } catch (e) {
        console.error('加载本地聊天记录失败:', e);
        uni.showToast({
          title: '加载历史记录失败',
          icon: 'none'
        });
        this.historyList = []; // 出错时清空列表
      }
    }, // <-- loadHistoryList 结束的逗号

    viewChatDetail(item){
      // 跳转到聊天详情页面
      // 传递 question_id 和 title，让 qa-chat 页面知道要加载哪个历史记录
      uni.navigateTo({
        url: `/pages/index/qa-chat?id=${item.question_id}&title=${encodeURIComponent(item.title)}`
      });
    }, // <-- viewChatDetail 结束的逗号

    showDeleteConfirm(item) {
      // 存储要删除的ID
      this._itemToDelete = item.question_id;
      this.$refs.deletePopup.open();
    }, // <-- showDeleteConfirm 结束的逗号

    confirmDelete() {
      const questionIdToDelete = this._itemToDelete;
      if (!questionIdToDelete) return;

      const username = uni.getStorageSync('username');
      if (!username) return;

      // 构建本地存储的 key
      const storageKey = `chat_history_${username}_${questionIdToDelete}`;

      // 从列表中移除 (视觉上)
      this.historyList = this.historyList.filter(
        item => item.question_id !== questionIdToDelete
      );

      // 从本地存储中删除 (实际数据)
      uni.removeStorageSync(storageKey);
      console.log('已删除本地存储 key:', storageKey);

      // 显示成功提示
      uni.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1500
      });

      // 关闭弹窗并清除临时变量
      this.$refs.deletePopup.close();
      this._itemToDelete = null;
    }, // <-- confirmDelete 结束的逗号

    // --- cancelDelete 方法移到这里 ---
    cancelDelete() {
      // 清除临时变量
      this._itemToDelete = null;
      this.$refs.deletePopup.close();
    } // <-- cancelDelete 结束 (后面不需要逗号，因为它是最后一个方法)

  } // <-- methods 对象的结束 }
}
</script>

<style>
.chat-history-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.chat-header {
  height: 90rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  position: relative; /* 改为 relative 或 static */
  z-index: 10; /* 可以降低 z-index */
}

.back-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  text-align: center;
  flex: 1;
  margin-right: 60rpx; /* 补偿返回按钮的宽度 */
}

.history-list {
  flex: 1;
  padding: 20rpx;
  box-sizing: border-box; /* 确保 padding 不会撑开 */
}

.history-item {
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
  /* 防止内容溢出 */
  overflow: hidden;
}

.history-item-title {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
  /* 单行省略 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item-preview {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 最多显示两行 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4; /* 调整行高以适应两行 */
}

.history-item-time {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.delete-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* 防止被压缩 */
}

/* 空状态样式 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx; /* 或根据需要调整 */
  color: #999;
  font-size: 28rpx;
}
</style>