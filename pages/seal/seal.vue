<template>
  <view class="approval-nodes">
    <view v-for="(node, index) in approvalNodes" :key="index" class="approval-node">
    
	  

      <view class="node-details">
        <view class="node-name">
			<view class="avatar">
			  <image :src="node.approver.avatar" alt="Approver Avatar"></image>
			  <view class="status-icon" :class="getStatusIconClass(node.status)"></view>
			</view>
		<view class="name-class">
		{{ node.name }}
		</view>
		   <view class="node-status">进行中</view>
		</view>
        <view class="approvers">
          <view v-for="(approver, approverIndex) in node.approvers" :key="approverIndex" class="approver">
            <view class="name-line">
              <view class="name-box">{{ approver.name }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style>
.approval-nodes {
  display: flex;
  flex-direction: column;
  padding: 20rpx 50rpx;
}

.approval-node {
  display: flex;
  align-items: center;
  margin-bottom: 140rpx;
  position: relative;
}
.node-status {
  
}

.avatar {
  position: relative;
  margin-right: 15rpx;
  margin-left: 15rpx;
  
}

.avatar image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.status-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
}

.status-icon.approved {
  background-color: green;
}

.status-icon.pending {
  background-color: orange;
}

.status-icon.rejected {
  background-color: red;
}

.node-details {
  flex: 1;
}

.node-name {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 40rpx;
  font-weight: 600;
}
.name-class{
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 400rpx;
}

.approvers {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  width: 100%; /* 保证宽度占满父容器 */
}

.approver {
  flex-basis: calc(20% - 10px); /* 每个名字占据 1/3 的宽度，并留出一些间距 */
  margin-right: 10rpx;
  margin-bottom: 10rpx; /* 增加底部间距用于换行 */
}

.name-line {
  display: inline-block;
  position: relative;
}

.name-box {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #ccc;
  border-radius: 8rpx;
  padding: 3rpx 8rpx;
  word-wrap: break-word; /* 添加换行样式 */
}


</style>

<script>
export default {
  data() {
    return {
      approvalNodes: [
        {
          approver: { name: 'John Doe', avatar: '../../static/logo.png' },
          status: 'approved',
          name: 'Node 1',
          approvers: [
           { name: '我我我' },
           { name: '我我我' },
           { name: '我我我' },
           { name: '我我我' }, { name: '我我我' },
			{ name: '我我我' },
			{ name: '我我我' },
			{ name: '我我我' }, { name: '我我我' },
			{ name: '我我我' },
			{ name: '我我我' },
			{ name: '我我我' }, { name: '我我我' },
			{ name: '我我我' },
			{ name: '我我我' },
			{ name: '我我我' },
			{ name: '我我我' },
            { name: '我我我' },
            { name: '我我我' },
			{ name: '我我我' },
			{ name: '我我我' },
			
          ],
        },
        {
          approver: { name: 'Jane Smith', avatar: '../../static/logo.png' },
          status: 'pending',
          name: 'Node 2',
          approvers: [
            { name: '我我我' },
            { name: '我我我' },
          ],
        },
        {
          approver: { name: 'David Johnson', avatar: '../../static/logo.png' },
          status: 'rejected',
          name: 'Node 3',
          approvers: [
            { name: '我我我' },
          ],
        },{
          approver: { name: 'David Johnson', avatar: '../../static/logo.png' },
          status: 'rejected',
          name: 'Node 3',
          approvers: [
            { name: '测试测试测试测试' },{ name: '测试测试测试测试' },
          ],
        },{
          approver: { name: 'David Johnson', avatar: '../../static/logo.png' },
          status: 'rejected',
          name: 'Node 3',
          approvers: [
            { name: '测试测试' },
          ],
        },
        // Additional nodes...
      ],
    };
  },
  methods: {
    getStatusIconClass(status) {
      return status === 'approved' ? 'approved' : status === 'pending' ? 'pending' : 'rejected';
    },
  },
};
</script>