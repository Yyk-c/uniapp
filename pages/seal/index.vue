<template>
  <view class="detail-page">
	
	 <view v-for="(item, index) in datas" :key="index">
		 <view class="row">
		   <view class="label required" v-if="item.is_require==1">{{item.param_name}}</view>
		   <view class="label" v-if="item.is_require==0">{{item.param_name}}</view>
		   <view class="value">{{item.value}}</view>
		 </view>
		 <view class="separator" v-if="index!==datas.length-1"></view>
	 </view> 

   
  </view>
</template>

<script>
	import hrUrl from "@/common/hrReqConst.js";
export default {
	
	data() {
		return {
			datas:[],
		}
		},
	
	onLoad(param) {
		this.param = param;
		//判断传过来的参数
		if (param && param.userInfo) {
			let obj = JSON.parse(param.userInfo);
			if (obj) {
				let option = obj.loadInfo;
				this.hrpId = option.hrpId;
				this.hrpPwd = option.hrpPwd;
				this.applyGuid = "010730b7933b490c95975b097f8ac287";
				this.formId = "b62f105a830d4e809bd2892398467cec";
				this.infoId = "799f917773494c82a7baa3a5eaf183ae";
				this.hrpUnitId = option.hrpUnitId;
				this.authDate = option.authDate;
				this.orgNo = option.orgNo;
				this.context = option.context;
				this.dataOption = option;
				this.getData();
			}
		}
	},
  methods: {
    previewImage(url) {
      uni.previewImage({
        current: url,
        urls: [url]
      });
    },
	getData() {
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
				'codeBlockName': 'oa_getTaskDetailToApp',
				'params': '{"form_id":"' + this.formId +'","info_id":"'+this.infoId+'" }'
			},
			success: res => {
				let data = res.data.data;
				this.datas = data;
				
			},
			fail: () => {
	
			},
			complete: () => {
	
	
			}
		});
	},
  },
  
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
  flex: 2;
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