<template>
  <view class="detail-page">
    <view class="row">
      <view class="label required">科室：</view>
      <view class="value">某某科室</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label required">申请人：</view>
      <view class="value">张三</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label required">流水号：</view>
      <view class="value">123456789</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label">填单时间：</view>
      <view class="value">2023-08-26</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label required">出差类型：</view>
      <view class="value">公务出差</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label required">出差开始时间：</view>
      <view class="value">2023-09-01</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label required">出差结束时间：</view>
      <view class="value">2023-09-05</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label">出差天数：</view>
      <view class="value">5天</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label">同行人：</view>
      <view class="value">李四</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label">联系人电话：</view>
      <view class="value">1234567890</view>
    </view>
    <view class="separator"></view>
    <view class="row">
      <view class="label required">经费开支来源：</view>
      <view class="value">财务部</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label">起始时间：</view>
      <view class="value">09:00</view>
    </view>
	<view class="separator"></view>
	 <view class="row" style="flex-direction: column;align-items: flex-start;">
	      <view class="label">备注：</view>
	      <view class="remark-value">这是备注内容</view>
	    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label">目的地址：</view>
      <view class="value">某某地点</view>
    </view>
		<view class="separator"></view>
	<view class="row">
	      <view class="label">签到二维码：</view>
		  <image class="qrcode" src="../../static/logo.png" @click="previewImage('../../static/logo.png')"></image>
		  <text style="padding: 0 0 0 15rpx;">可点击查看</text>
	    </view>
			<view class="separator"></view>
	    <view class="row">
	      <view class="label">签退二维码：</view>
	      <image class="qrcode" src="../../static/logo.png" @click="previewImage('../../static/logo.png')"></image>
		  <text style="padding: 0 0 0 15rpx;">可点击查看</text>
	    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label">出差单位：</view>
      <view class="value">某某单位</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label">出差缘由：</view>
      <view class="value">会议参加</view>
    </view>
	
	
  </view>
</template>

<script>
export default {
  methods: {
    previewImage(url) {
      uni.previewImage({
        current: url,
        urls: [url]
      });
    }
  }
};
</script>

<style>
.detail-page {
  padding: 20rpx;
}
.remark-value {	
  text-align: center;
  color: #999;
  margin-top: 15rpx;
}
.qrcode {
  width: 80rpx;
  height: 80rpx;
  margin-left: 10rpx;
}
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30rpx;
  margin-top: 30rpx;
}

.label {
  flex: 1;
  text-align: left;
  color: #333;
}

.value {
  flex: 1;
  text-align: right;
  color: #999;
}

.required::before {
  content: "*";
  color: red;
  margin-right: 5rpx;
}

.separator {
  height: 1rpx;
  background-color: #ccc;
  margin: 10rpx 0;
}
</style>