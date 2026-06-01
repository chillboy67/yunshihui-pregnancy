<template>
  <view class="chat-container">
    <view class="chat-header">
      <view class="back-button" @tap="goBack">
        <uni-icons type="back" size="24" color="#333"></uni-icons>
      </view>
      <text class="header-title">{{ title }}</text>
    </view>
    
    <scroll-view 
      scroll-y 
      class="chat-content" 
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      @scrolltoupper="loadMoreHistory"
      ref="chatScroll"
      :show-scrollbar="false"
    >
      <view class="chat-messages">
        <view class="message-wrapper" v-for="(message, index) in messages" :key="index">
          <!-- 系统消息 -->
          <view v-if="message.type === 'system'" class="message message-system">
            <view class="message-avatar">
              <view class="avatar-icon system-icon">
                <uni-icons type="staff" size="24" color="#fff"></uni-icons>
              </view>
            </view>
            <view class="message-content">
              <!-- 思考中的临时消息带加载动画 -->
              <view v-if="message.isThinking" class="thinking-message">
                <text>容我想想哦</text>
                <view class="thinking-dots">
                  <view class="dot dot1"></view>
                  <view class="dot dot2"></view>
                  <view class="dot dot3"></view>
                </view>
              </view>
              <!-- 普通消息 -->
              <text v-else class="message-text">{{ message.content }}</text>
            </view>
          </view>
          
          <!-- 用户消息 -->
          <view v-else class="message message-user">
            <view class="message-content">
              <text class="message-text">{{ message.content }}</text>
            </view>
            <view class="message-avatar">
              <view class="avatar-icon user-icon">
                <uni-icons type="person" size="24" color="#fff"></uni-icons>
              </view>
            </view>
          </view>
          
          <text class="message-time" :class="{'time-right': message.type === 'user'}">{{ message.time }}</text>
        </view>
      </view>
    </scroll-view>
    
    <view class="chat-input">
      <view class="history-button" @tap="showHistoryPopup">
        <uni-icons type="list" size="24" color="#666"></uni-icons>
      </view>
      <input 
        type="text" 
        class="input-field"
        v-model="inputContent"
        placeholder="输入您的问题..."
        confirm-type="send"
        @confirm="sendMessage"
        :disabled="isLoading"
      />
      <view class="send-button" @tap="sendMessage" :class="{'disabled': isLoading}">
        <uni-icons type="paperplane" size="24" :color="isLoading ? '#ccc' : '#FF6B8B'"></uni-icons>
      </view>
    </view>

    <!-- 历史记录弹窗 -->
    <uni-popup ref="historyPopup" type="bottom">
      <view class="history-popup">
        <view class="popup-header">
          <text class="popup-title">对话历史</text>
          <view class="close-button" @tap="closeHistoryPopup">
            <uni-icons type="close" size="24" color="#666"></uni-icons>
          </view>
        </view>
        <scroll-view scroll-y class="history-list">
          <view 
            v-for="(message, index) in messages" 
            :key="index"
            class="history-item"
            :class="{'history-item-user': message.type === 'user'}"
            @tap="selectHistoryMessage(index)"
          >
            <view class="history-item-content">
              <text class="history-item-text">{{ message.content }}</text>
              <text class="history-item-time">{{ message.time }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inputContent: '',
      messages: [],
      title: '营养问答',
      questionId: null,
      questionContent: '',
      answerContent: '',
      scrollTop: 0,
      isLoading: false,
      thinkingMessageIndex: -1,
      username: null,
      fromHistory: false  // 新增标记，表示是否从历史记录跳转
    }
  },
  onLoad(options) {
    // 获取传递的参数
    if (options.title) {
      this.title = options.title;
    }
    if (options.id) {
	// 如果 URL 传入了 ID (来自预设问题或历史记录点击)
	this.questionId = options.id;
	if (!options.question && !options.answer) {
		// 如果只传入 ID 没有问答，说明是从历史记录查看详情
		this.fromHistory = true;
		console.log('Loading from history for ID:', this.questionId);
		} else {
			console.log('Loading preset question/answer for ID:', this.questionId);
		}
	} else {
		// 如果 URL 没有传入 ID，说明是新开始的自定义对话
		// 生成一个基于时间戳的唯一 ID
		this.questionId = 'custom_' + Date.now(); // 例如 "custom_1761100000000"
		this.title = '自定义对话'; // 设置默认标题
		this.fromHistory = false; // 明确不是从历史记录加载
		console.log('Starting new custom chat with generated ID:', this.questionId);
	}
    if (options.question) {
      this.questionContent = decodeURIComponent(options.question);
    }
    if (options.answer) {
      this.answerContent = decodeURIComponent(options.answer);
    }
    
    // 从历史记录加载时，直接获取历史数据
    if (this.fromHistory) {
      // 从云端/本地获取历史对话记录
      this.loadChatHistory();
      return;
    }
    
    // 如果有预设问题和答案，自动添加到对话中
    if (this.questionContent) {
      this.addUserMessage(this.questionContent);
      
      // 如果有预设答案，显示延迟加载动画后显示答案
      if (this.answerContent) {
        const thinkingIndex = this.addSystemMessage("", true);
        
        // 使用setTimeout模拟加载过程，延迟显示真正的回答
        setTimeout(() => {
          this.updateSystemMessage(thinkingIndex, this.answerContent);
        }, 1500); // 1.5秒后显示真正的回答
      } 
      // 如果没有预设答案，则自动请求获取答案
      else if (this.questionId) {
        this.isLoading = true;
        const thinkingIndex = this.addSystemMessage("", true);
        this.thinkingMessageIndex = thinkingIndex;
        
        // 发送请求获取回答
        this.getAnswer(this.questionContent).then(answer => {
          this.updateSystemMessage(thinkingIndex, answer);
          this.isLoading = false;
        }).catch(err => {
          console.error('获取回答失败:', err);
          this.updateSystemMessage(thinkingIndex, '抱歉，我暂时无法回答您的问题。请稍后再试。');
          this.isLoading = false;
        });
      }
    } else {
      // 非历史记录跳转，且没有预设问答，加载本地历史
      this.loadChatHistory();
    }
  },
  onShow() {
    // 滚动到底部
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    scrollToBottom() {
      // 计算滚动位置
      const query = uni.createSelectorQuery().in(this);
      query.select('.chat-messages').boundingClientRect();
      query.select('.chat-content').boundingClientRect();
      query.exec(res => {
        if (res && res[0] && res[1]) {
          const messagesHeight = res[0].height;
          const contentHeight = res[1].height;
          this.scrollTop = messagesHeight - contentHeight;
        }
      });
    },
    addUserMessage(content) {
      const now = new Date();
      const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      this.messages.push({
        type: 'user',
        content: content,
        time: timeString
      });
      this.saveChatHistory();
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    addSystemMessage(content, isThinking = false) {
      const now = new Date();
      const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      const index = this.messages.length;
      this.messages.push({
        type: 'system',
        content: content,
        time: timeString,
        isThinking: isThinking
      });
      this.saveChatHistory();
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      return index;
    },
    updateSystemMessage(index, content) {
      this.messages[index].content = content;
      this.messages[index].isThinking = false;
      this.saveChatHistory();
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    sendMessage() {
      if (!this.inputContent.trim() || this.isLoading) {
        return;
      }
      
      const userQuestion = this.inputContent.trim();
      this.addUserMessage(userQuestion);
      this.inputContent = '';
      
      // 显示加载提示
      this.isLoading = true;
      
      // 添加一个带加载动画的"容我想想哦"临时消息
      this.thinkingMessageIndex = this.addSystemMessage("", true);
      
      // 发送请求获取回答
      this.getAnswer(userQuestion).then(answer => {
        this.updateSystemMessage(this.thinkingMessageIndex, answer);
        this.isLoading = false;
      }).catch(err => {
        console.error('获取回答失败:', err);
        this.updateSystemMessage(this.thinkingMessageIndex, '抱歉，我暂时无法回答您的问题。请稍后再试。');
        this.isLoading = false;
      });
    },
    async getAnswer(question) {
      try {
        // 构建提示语
        const prompt = `你是一个专业的孕期和产后营养师，请根据以下问题，用亲切自然的语气回答。
问题：${question}

要求：
1. 语气要像专业医生跟孕妇/妈妈聊天一样自然
2. 可以适当添加一些关心的话语
3. 保持回答简短，但要有温度
4. 确保回答准确专业，基于科学依据
5. 在回答的末尾，明确标注信息来源`;
        
        // 调用API获取回答
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            method: 'POST',
            data: {
              model: 'glm-4-flash',
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7,
              top_p: 0.9,
              max_tokens: 400,
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
          return res.data.choices[0].message.content;
        } else {
          throw new Error('API返回数据格式错误');
        }
      } catch (err) {
        console.error('API调用失败:', err);
        throw err;
      }
    },
    saveChatHistory() {
      // // 保存到本地存储
      // if (!this.questionId) return;
      
      try {
        // 获取当前用户
        const username = uni.getStorageSync('username');
        if (!username) {
			console.error('saveChatHistory: Username not found, cannot save.'); 
			return;
		}
		// 确认 questionId 是否为 null (自定义对话)
		console.log('saveChatHistory called. questionId:', this.questionId); 

		// 只保存最近的20条消息
		const messagesToSave = this.messages.slice(-20);

		// 【关键修改1】使用 'custom' 作为 ID (如果 questionId 为 null)
		const storageKey = `chat_history_${username}_${this.questionId}`; 

		// 打印将要使用的 key 和数据
		console.log('Attempting to save to Local Storage. Key:', storageKey);
		// console.log('Data to save:', JSON.stringify(messagesToSave));

		uni.setStorageSync(storageKey, JSON.stringify(messagesToSave));

		console.log('Saved to Local Storage successfully for key:', storageKey); 

		// 云端保存
		// this.saveToCloud(username, messagesToSave); 

	  } catch (e) {
		console.error('保存聊天记录到本地存储失败:', e); 
	  }
	},
    saveToCloud(username, messagesToSave, retryCount = 0) {
      const maxRetries = 3;
      
      uni.request({
        url: this.$apiUrl + 'save_chat_history',
        method: 'POST',
        data: {
          username: username,
          question_id: this.questionId,
          messages: messagesToSave
        },
        timeout: 10000, // 设置10秒超时
        header: {
          'Content-Type': 'application/json'  // 添加Content-Type头
        },
        success: (res) => {
          if (res.data.statusCode !== 200) {
            console.error('保存对话记录到云端失败:', res.data);
            if (retryCount < maxRetries) {
              // 延迟1秒后重试
              setTimeout(() => {
                this.saveToCloud(username, messagesToSave, retryCount + 1);
              }, 1000);
            }
          }
        },
        fail: (err) => {
          console.error('保存对话记录到云端失败:', err);
          if (retryCount < maxRetries) {
            // 延迟1秒后重试
            setTimeout(() => {
              this.saveToCloud(username, messagesToSave, retryCount + 1);
            }, 1000);
          } else {
            // 最后一次重试失败后，显示提示
            uni.showToast({
              title: '网络不稳定，已保存到本地',
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    },
    loadChatHistory() {
	  try {
		// 获取当前用户
		const username = uni.getStorageSync('username');
		if (!username) {
			console.warn('loadChatHistory: Username not found.'); // 添加日志
			// 如果是从历史记录页跳转来的，且没有用户名，提示并返回
			if (this.fromHistory) {
				uni.showToast({ title: '请先登录以查看历史记录', icon: 'none' });
				// 考虑是否需要跳转回登录页
				// uni.reLaunch({ url: '/pages/index/login' });
			}
			return; // 没有用户名无法加载
		}
		
		// 如果是从历史记录跳转，显示加载指示器
		if (this.fromHistory) { 
			uni.showLoading({ title: '加载中...' }); 
		}

		// 【关键修改】直接从本地加载
		// 使用 onLoad 中设置好的 questionId (可能是预设ID, custom_时间戳, 或 null)
		const storageKey = `chat_history_${username}_${this.questionId}`; 
		console.log('Attempting to load from Local Storage. Key:', storageKey); // 添加日志
		const historyStr = uni.getStorageSync(storageKey);

		if (this.fromHistory) { uni.hideLoading(); } // 隐藏加载

		if (historyStr) {
		  const history = JSON.parse(historyStr);
		  if (Array.isArray(history) && history.length > 0) {
			  console.log('Loaded history from Local Storage:', history); // 添加日志
			  
			  // 根据情况合并或替换 messages
			  // 如果是从历史记录页跳转过来查看详情，直接使用历史记录
			  if (this.fromHistory) {
				  this.messages = history;
			  } 
			  // 如果是进入预设问题页面，但本地已有记录 (例如用户之前聊过又返回)
			  // 并且当前 messages 数组为空 (或只有初始消息)
			  // 且不是从历史记录跳转的
			  else if (this.questionContent && !this.fromHistory && this.messages.length <= (this.answerContent ? 3 : 1)) { 
				   // 优先使用本地历史记录覆盖初始状态
				   this.messages = history;
				   console.log('Preset question detected, but local history found and applied.');
			  } 
			  // 如果是新开的自定义对话页面(非历史记录跳转)，且本地意外有同ID记录(理论上不太可能，除非ID生成重复)
			  else if (this.questionId && this.questionId.startsWith('custom_') && !this.fromHistory && this.messages.length === 0) {
				   this.messages = history;
				   console.log('New custom chat, but existing local history found and applied (unlikely).');
			  }
			  // (其他情况，如已有预设答案，则保留 onLoad 中的 addUserMessage/addSystemMessage 逻辑，不覆盖)
			  
			  // 滚动到底部
			  this.$nextTick(() => { this.scrollToBottom(); });
			  
		  } else {
			  // 本地存储中有键，但内容不是有效的消息数组
			  console.log('Local Storage found but no valid messages array for key:', storageKey); // 添加日志
			  if (this.fromHistory) {
				  uni.showToast({ title: '历史记录为空或格式错误', icon: 'none' });
			  }
			  // 如果本地记录无效，且是新开自定义对话，可以添加欢迎语
			  else if (!this.questionContent && !this.answerContent && this.messages.length === 0) {
				 this.addSystemMessage("您好！有什么可以帮您的吗？");
			  }
		  }
		} else {
			// 本地存储中没有找到对应的键
			console.log('No history found in Local Storage for key:', storageKey); // 添加日志
			if (this.fromHistory) {
				uni.showToast({ title: '没有找到该对话的历史记录', icon: 'none' });
			}
			// 如果本地没有记录，且是新开自定义对话，添加欢迎语
			else if (!this.questionContent && !this.answerContent && this.messages.length === 0) {
			   this.addSystemMessage("您好！有什么可以帮您的吗？");
			}
		}

	  } catch (e) {
		if (this.fromHistory) { uni.hideLoading(); } // 隐藏加载
		console.error('加载聊天记录失败:', e);
		if (this.fromHistory) {
			uni.showToast({ title: '加载历史记录失败', icon: 'none' });
		}
	  }
	},
    loadMoreHistory() {
      // 此处可以实现加载更多历史记录的逻辑
      // 目前历史记录都保存在本地，暂时不需要额外加载
    },
    showHistoryPopup() {
      // 跳转到历史记录页面
      uni.navigateTo({
        url: '/pages/history/chat-history'
      });
    },
    closeHistoryPopup() {
      this.$refs.historyPopup.close();
    },
    selectHistoryMessage(index) {
      // 滚动到选中的消息位置
      const query = uni.createSelectorQuery().in(this);
      query.select('.message-wrapper').boundingClientRect();
      query.select('.chat-content').boundingClientRect();
      query.exec(res => {
        if (res && res[0] && res[1]) {
          const messageHeight = res[0].height;
          const contentHeight = res[1].height;
          // 计算滚动位置，使选中的消息在视图中居中
          this.scrollTop = messageHeight * index - (contentHeight / 2) + (messageHeight / 2);
        }
      });
      this.closeHistoryPopup();
    }
  }
}
</script>

<style>
/* 全局隐藏滚动条样式 */
::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  display: none !important;
  -webkit-appearance: none;
  background: transparent;
}

/* 全局设置no-scrollbar样式 */
* {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

.chat-container {
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
  position: relative;
  z-index: 10;
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
  margin-right: 60rpx;
}

.chat-content {
  flex: 1;
  overflow: hidden;
  padding: 20rpx;
  box-sizing: border-box;
  /* 隐藏滚动条 */
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE and Edge */
}

/* 隐藏Webkit浏览器的滚动条 */
.chat-content::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

/* 特定针对scroll-view的样式 */
uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

uni-scroll-view .uni-scroll-view {
  scrollbar-width: none !important; /* Firefox */
  -ms-overflow-style: none !important; /* IE and Edge */
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  padding-bottom: 40rpx;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5rpx;
}

.message {
  display: flex;
  align-items: flex-start;
  max-width: 90%;
}

.message-user {
  align-self: flex-end;
  flex-direction: row;
  justify-content: flex-end;
}

.message-system {
  align-self: flex-start;
}

.message-avatar {
  width: 80rpx;
  height: 80rpx;
  margin: 0 20rpx;
  flex-shrink: 0;
}

.avatar-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.system-icon {
  background: linear-gradient(to right, #FF6B8B, #FF8BA0);
}

.user-icon {
  background: linear-gradient(to right, #1890FF, #69C0FF);
}

.message-content {
  background: #fff;
  padding: 20rpx 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
  max-width: calc(100% - 140rpx);
}

.message-user .message-content {
  background: #E6F7FF;
  box-shadow: 0 2rpx 6rpx rgba(24, 144, 255, 0.1);
}

.message-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-time {
  font-size: 22rpx;
  color: #999;
  align-self: flex-start;
  margin-top: 5rpx;
  margin-left: 100rpx;
}

.time-right {
  align-self: flex-end;
  margin-right: 100rpx;
}

.chat-input {
  height: 100rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 10rpx 0 20rpx;
  box-shadow: 0 -2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.history-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10rpx;
}

.input-field {
  flex: 1;
  height: 70rpx;
  background: #f5f5f5;
  border-radius: 35rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333;
  margin-right: 10rpx;
}

.send-button {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 添加思考动画的样式 */
.thinking-message {
  display: flex;
  align-items: center;
}

.thinking-dots {
  display: flex;
  margin-left: 10rpx;
}

.dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background-color: #999;
  margin: 0 5rpx;
  animation: dotPulse 1.5s infinite ease-in-out;
}

.dot1 {
  animation-delay: 0s;
}

.dot2 {
  animation-delay: 0.2s;
}

.dot3 {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
}

/* 禁用状态的发送按钮 */
.send-button.disabled {
  opacity: 0.5;
}

/* 历史记录弹窗样式 */
.history-popup {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 20rpx;
  max-height: 70vh;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-list {
  max-height: calc(70vh - 100rpx);
  padding: 20rpx;
}

.history-item {
  padding: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.history-item:last-child {
  border-bottom: none;
}

.history-item-user {
  background-color: #f9f9f9;
}

.history-item-content {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.history-item-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  word-wrap: break-word;
}

.history-item-time {
  font-size: 24rpx;
  color: #999;
  align-self: flex-end;
}
</style> 