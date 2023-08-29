<!-- 签到签退二维码未解决 -->
<template>
  <view class="detail-page">
    <view class="row">
      <view class="label required">预定日期</view>
      <view class="value">{{detail.apply_date}}</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label">创建时间</view>
      <view class="value">{{detail.create_time}}</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label">签到签退码</view>
      <view class="value">{{detail.meeting_guid.substring(4, detail.meeting_guid.length)}}</view>
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
      <view class="label required">会议室</view>
      <view class="value">{{detail.room_name}}</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label required">申请人</view>
      <view class="value">{{detail.user_name}}</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label required">开始时间</view>
      <view class="value">{{detail.begin_time}}</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label required">结束时间</view>
      <view class="value">{{detail.end_time}}</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label required">使用部门</view>
      <view class="value">{{detail.dept_name}}</view>
    </view>
	<view class="separator"></view>
	<view class="row" style="flex-direction: column;align-items: flex-start;">
	     <view class="label">额外需求</view>
	     <view class="remark-value">{{detail.multi_needs ? detail.multi_needs : '无'}}</view>
	   </view>
	   <view class="separator"></view>
	   <view class="row" style="flex-direction: column;align-items: flex-start;">
	        <view class="label">备注</view>
	        <view class="remark-value">{{detail.remark ? detail.remark : '无'}}</view>
	      </view>
	
	<view class="separator"></view>
	<view class="row">
	  <view class="label required">主题内容</view>
	  <view class="value">{{detail.meeting_topic ? detail.meeting_topic : ''}}</view>
	</view><view class="separator"></view>
    <view class="row">
      <view class="label">主持人</view>
      <view class="value">{{detail.hoster_name ? detail.hoster_name : '无'}}</view>
    </view><view class="separator"></view>
    <view class="row">
      <view class="label">记录人</view>
      <view class="value">{{detail.recorder_name ? detail.recorder_name : '无'}}</view>
    </view>
	<view class="separator"></view>
    <view class="row">
      <view class="label required">会议开始时间：</view>
      <view class="value">{{detail.meeting_begin_time}}</view>
    </view>
    <view class="separator"></view>
    <view class="row">
      <view class="label required">会议结束时间</view>
      <view class="value">{{detail.meeting_end_time}}</view>
    </view>
	<view class="separator"></view>
	 <view class="row" style="flex-direction: column;align-items: flex-start;">
	      <view class="label">院内参加人员：</view>
	      <view class="remark-value">{{detail.parList.toString()}}</view>
	    </view>	<view class="separator"></view>
	 <view class="row" style="flex-direction: column;align-items: flex-start;">
	      <view class="label">院外参加人员：</view>
	      <view class="remark-value">{{detail.other_emp ? detail.meeting_other_emp : '无'}}</view>
	    </view>

	
	
  </view>
</template>

<script>
	import hrUrl from "@/common/hrReqConst.js";
export default {
	
	onLoad(param) {
		this.param = param;
		//判断传过来的参数
		if (param && param.userInfo) {
			let obj = JSON.parse(param.userInfo);
			if (obj) {
				let option = obj.loadInfo;
				this.hrpId = option.hrpId;
				this.hrpPwd = option.hrpPwd;
				this.applyGuid = "830677af81b64c16bc1dad2ea1034e2f";
				this.hrpUnitId = option.hrpUnitId;
				this.authDate = option.authDate;
				this.orgNo = option.orgNo;
				this.context = option.context;
				this.dataOption = option;
				this.getData();
			}
		}
	},
	
	data() {
		return {
			detail:{
				parList:[],
				meeting_guid:'',
			}
		}},
	
  methods: {
    previewImage(url) {
      uni.previewImage({
        current: url,
        urls: [url]
      });
    },
	getData(){
					 uni.request({
					 	url: hrUrl,
					 	method: 'GET',
					 	dataType: 'json',
					 	data: {
					 		'hrpId': this.hrpId,
					 		'hrpPwd': this.hrpPwd,
					 		'hrpUnitId': this.hrpUnitId,
					 		'authDate': this.authDate,
					 		'orgNo': this.orgNo,
					 		'context': this.context,
					 		'codeBlockName': 'oa_meeting_getDetail',
					 		'params': '{"apply_guid":"'+this.applyGuid+'"}'
					 	},
					 	success: res => {
					 		let data = res.data.data;
					 		this.detail = data;
							
					 	},
					 	fail: () => {
					 
					 	},
					 	complete: () => {
					 		
					 
					 	}
					 });
	},
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