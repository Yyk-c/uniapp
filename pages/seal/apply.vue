<template>
	<view>
		<!-- 滑动导航栏组件 -->
			<view class="swiperHead" :style="{top:topHeight}" id="swiper-head">
				<swiperNavBar v-if=" swiper.swiperTabList.length > 1 " :scrollIntoView="swiper.scrollIntoView" :swiperTabList='swiper.swiperTabList'
				 :swiperTabIdx='swiper.swiperTabIdx' :currentSwiperWidth='swiper.currentSwiperWidth' :currentSwiperHeight='swiper.currentSwiperHeight'
				 :swiperCurrentSize='swiper.swiperCurrentSize' :swiperColor='swiper.swiperColor' :swiperCurrentColor='swiper.swiperCurrentColor'
				  :currentSwiperLineActiveWidth="swiper.currentSwiperLineActiveWidth"
				 :currentSwiperLineActiveHeight="swiper.currentSwiperLineActiveHeight" :currentSwiperLineActiveBg="swiper.currentSwiperLineActiveBg"
				  @change="currentTab" class="swiperNavBar">
				</swiperNavBar>
			</view>
			
			<view class="seal-list">
			    <scroll-view class="scroll-view" scroll-y  @scrolltolower="lowerBottom" @refresherrefresh="getFresh">
			      <view v-for="(item, index) in sealList" :key="index" class="seal-item" > 
			        <view class="title">
						<view class="currentType">
							<uni-tag text="紧急" type="warning" size="small" v-if="item.urgent_level=='紧急'"/>
							<uni-tag text="特急" type="error" size="small" v-if="item.urgent_level=='特急'"/>
							<uni-tag text="常规" type="primary" size="small" v-if="item.urgent_level=='常规'"/>
						</view>
						<view class="titleCSS">
						印章:{{ item.seal_name }}
						</view>
						<view class="seal-status" :class="{'green':item.status===20,'red':item.status===30||item.status===40}">
						  {{ item.status_str}}
						</view>
					</view>
			          <view class="info">
						<view class="info-item">
			            <text class="label">印章文件名称：
						<text class="value">{{ item.file_name }}</text>
						</text>
			          </view>
					  <view class="info-item">
			            <text class="label">印章件所属单位：
						<text class="value">{{ item.file_unit }}</text>
						</text>
			          </view>
			          <view class="info-item">
			            <text class="label">申请人：
						<text class="value">{{ item.apply_user }}</text>
						</text>
			          </view>
			          <view class="info-item">
			            <text class="label">处理时限:
						<text class="value">
						  {{ item.date_limit }}
						</text>
						</text>
			          </view>
						<view class="info-item">
			            <text class="label">填单时限:
						<text class="value">
						  {{ item.create_time }}
						</text>
						</text>
			          </view>
			          <view class="info-item">
			            <text class="label">用印时限:
							<text class="value">
							  {{ item.time_range }}
							</text>
						</text>
			          </view>
					  <view class="rounded-box">
					      <input type="text"  readonly>{{item.remark}}</input>
					    </view>
					  
			        </view>
					<!-- <view class="profile-picture">
					      <image src="../../static/logo.png" class="frame" />
					</view> -->
					
			      </view>
			    </scroll-view>
			  </view>
			  
			  
	</view>
</template>

<script>
	import uniIcons from '@/components/common/uni-icons/uni-icons.vue';
	import swiperNavBar from '@/components/common/swiperNavBar/swiperNavBar.vue';
	import uniTag from '@/components/common/uni-tag/uni-tag.vue';
	import hrUrl from "@/common/hrReqConst.js";
	export default {
		data() {
			return {
				swiper: { //滑动导航栏
					scrollIntoView: 0, //设置哪个方向可滚动，则在哪个方向滚动到该元素
					swiperTabList: ['待我审批单','我已审批的'], //导航列表文字
					swiperTabIdx: 1,
					swiperCurrentSize: '30rpx', //导航的字体大小
					swiperColor: '#999999', //导航栏字体未选中前颜色
					swiperCurrentColor: '#333333', //选中当前导航栏字体颜色
					currentSwiperWidth: '50%', //每项导航列表的宽度
					currentSwiperHeight: '88rpx', //当前导航的高度度 rpx px
					currentSwiperLineActiveBg: '#3C81F0', //当前选中的导航栏线条颜色
					currentSwiperLineActiveWidth: '36rpx', //当前选中的导航栏线条的宽度 upx rpx px
					currentSwiperLineActiveHeight: '6rpx', //当前选中的导航栏线条的高度度 upx rpx px
				},
				topHeight: "0px", //吸顶高度
				sealList: [
						],
				y:0,
				limit:5,
			}
		},
		methods: {
			 currentTab(index, item) {
				// this.swiper.swiperTabIdx = index;
				// this.swiper.scrollIntoView = Math.max(0, index - 1);
				
			 },
			 
			 lowerBottom(){
				 this.y+=5;
				 this.getData();
			 },
			 getFresh(){
				 
			 },
			 getData(){
				 
				 uni.showLoading({
				 	mask: true,
				 	title: '查询中'
				 });
				 
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
			 				 		'codeBlockName': 'oa_seal_使用情况列表',
			 				 		'params': '{"start":"'+this.y+'","limit":"'+this.limit+'"}'
			 				 	},
			 				 	success: res => {
			 				 		let data = res.data.data.data;
									this.sealList = this.sealList.concat(data)

			 				 	},
			 				 	fail: () => {
			 				 
			 				 	},
			 				 	complete: () => {
			 				 		uni.hideLoading();
			 				 
			 				 	}
			 				 });
			 },
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
					this.userId = "a5d2e406ad524319892399a5bcabd8b4";
					this.hrpUnitId = option.hrpUnitId;
					this.authDate = option.authDate;
					this.orgNo = option.orgNo;
					this.context = option.context;
					this.dataOption = option;
					this.getData();
				}
			}
		},
		components:{
			swiperNavBar,
			uniIcons,
			uniTag
		}
	}
</script>

<style>
.swiperHead{
		background-color: #ffffff;
	},
	.seal-list {
	  height: 87vh;
	  background-color:#ebebeb;
	}
	
	.scroll-view {
	  height: 100%;
	}
	
	.button-container {
		
	  display: flex;
	  justify-content: space-between;
	}
	
	.button {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  justify-content: center;
	  width: 300rpx;
	  height: 90rpx;
	  background-color: #EFEFEF;
	  border-radius: 46rpx;
	  margin-right: 20rpx;
	  margin-left: 20rpx;
	  margin-top: 15rpx;
	}
	
	.button-image {
	   margin-right: 20rpx;
	  width: 50rpx;
	  height: 50rpx;
	}
	
	.button-text {
	  text-align: center ;
	  font-size: 28rpx;
	  margin-top: 10rpx;
	  color: #FFFFFF;	
	  font-weight: bold;
	}
	
	.profile-picture {
	    position: absolute;
	    top: calc(24%);
	    right: 20rpx;
	    width: 200rpx; /* 调整头像框的宽度 */
	    height: 230rpx; /* 调整头像框的高度 */
	    /* display: flex; */
	    justify-content: center;
	    align-items: center;
	  }
	
	  .frame {
	    width: 200rpx; /* 调整头像框的宽度，与容器保持一致 */
	    height: 230rpx; /* 调整头像框的高度，与容器保持一致 */
	    position: absolute;
	    top: 0;
	    right: 0;
	  }
	
	.seal-item {
	  position: relative;
	  margin: 20rpx 10rpx;
	  padding: 20rpx 10rpx;
	  background-color: #fff;
	  border-radius: 8rpx;
	  background-image: url(../../static/apply.png);
	  background-size: cover;
	  background-position: center;
	  box-sizing: border-box;
	}
	
	.seal-status {
	  top: 0;
	  right: 0;
	  padding: 6rpx;
	  border-radius: 4rpx;
	  color: #fff;
	  width: 160rpx;
	}
	
	.title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 32rpx;
	font-weight: bold;
	}
	.titleCSS{
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 55%;
	}
	.info {
	  margin-top: 10rpx;
	  color: #888;
	}
	
	.info-item {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 5rpx;
	}
	
	.label {
	  font-size: 30rpx;
	}
	
	.value {
	  font-size: 30rpx;
	  margin-left: 5rpx;
	}
	
	.status {
	  display: flex;
	  justify-content: flex-end;
	  margin-top: 10rpx;
	}
	
	.status-label {
	  margin-left: 10rpx;
	  font-size: 28rpx;
	  padding: 2rpx 6rpx;
	  border-radius: 4rpx;
	}
	
	
	.green {
	  color: #14AE23;
	}
	
	.red {
	  color: #FF4C4A;
	}
	
	.rounded-box {
	  border: 1rpx solid #ccc;
	  border-radius: 10rpx; /* 设置圆角大小 */
	  padding: 20rpx;
	  width: 94%;
	  background-color: #F3F3F3;
	}
	
	.rounded-box input[type="text"] {
	  border: none;
	  outline: none;
	  width: 100%;
	  box-sizing: border-box;
	  background: transparent;
	}
	
	.rounded-box input[type="text"]:read-only {
	  cursor: default;
	}
</style>
