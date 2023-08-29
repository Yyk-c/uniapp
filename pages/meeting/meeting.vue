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
			
			<view class="meeting-list">
			    <scroll-view class="scroll-view" scroll-y>
			      <view v-for="(meeting, index) in meetingList" :key="index" class="meeting-item" > 
			        <view class="title">
						<view class="titleCSS">
						{{ meeting.meeting_topic }}
						</view>
						<view class="meeting-status" :class="{'gray': meeting.status == '已结束' || meeting.status == '未通过' || meeting.status == '未审批', 'green2': meeting.status == '进行中','yellow':meeting.status == '已通过未开始'}">
						  {{ meeting.status }}
						</view>
					</view>
			        <view class="info">
			          <view class="info-item">
			            <text class="label">会议室：
						<text class="value">{{ meeting.room_name }}</text>
						</text>
			          </view>
			          <view class="info-item">
			            <text class="label">开始时限：
						<text class="value">
						  {{ meeting.begin_time }}
						</text>
						</text>
						<text class="status-label" :class="{'green': meeting.sign_status=='已签到'||meeting.sign_status=='已签退'||meeting.sign_status=='未签退', 'red': meeting.sign_status=='未签到'}">
						  {{ meeting.sign_status=='已签退'||meeting.sign_status=='未签退'||meeting.sign_status=='已签到'?'已签到':'未签到' }}
						</text>
			          </view>
			          <view class="info-item">
			            <text class="label">结束时间：
							<text class="value">
							  {{ meeting.end_time }}
							</text>
						</text>
						<text class="status-label" :class="{'green': meeting.sign_status=='已签退', 'red': meeting.sign_status=='未签退'||meeting.sign_status=='未签到'}">
						  {{ meeting.sign_status=='已签到'||meeting.sign_status=='未签到'||meeting.sign_status=='未签退' ? '未签退' : '已签退' }}
						</text>
			          </view>
			        </view>
			      </view>
			    </scroll-view>
			  </view>
			  <view class="button-container">		  
			      <view class="button" style="background-color: #5CC3F9;">
			        <image src="../../static/logo.png" class="button-image"></image>
			  					<text class="button-text">扫码签到/签退</text>
			      </view>
			      <view class="button" style="background-color: #1E8FFE;">
			        <image src="../../static/logo.png" class="button-image"></image>
			  					<text class="button-text">手工签到/签退</text>
			      </view>
			    </view>
			  
	</view>
			
</template>

<script>
	import swiperNavBar from '@/components/common/swiperNavBar/swiperNavBar.vue';
	import hrUrl from "@/common/hrReqConst.js";
	export default {
		data() {
			return {
				swiper: { //滑动导航栏
					scrollIntoView: 0, //设置哪个方向可滚动，则在哪个方向滚动到该元素
					swiperTabList: ['已参加','待参加'], //导航列表文字
					swiperTabIdx: 0,
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
				meetingList: [
				        {

				        }
						]
			}
		},
		
		onLoad(param) {
			this.param = param;
			console.log(param)
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
		
		methods: {
			 currentTab(index, item) {
			 	console.log(index);
				console.log(item);
				this.swiper.swiperTabIdx = index;
				this.swiper.scrollIntoView = Math.max(0, index - 1);
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
				 		'codeBlockName': 'oa_meeting_getlist()',
				 		'params': '{"user_id":"'+this.userId+'","pageNum":0,"pageSize":30,"type":"1","date":"'+this.formatDate(new Date())+'"}'
				 	},
				 	success: res => {
				 		let data = res.data.data;
				 		this.meetingList = data.rows;
						
				 	},
				 	fail: () => {
				 
				 	},
				 	complete: () => {
				 		
				 
				 	}
				 });
			 },
			 /**
			  * 格式化日期对象
			  * @para {date object} 日期对象
			  * return {string} yyyy-mm-dd
			  */
			 formatDate(dateObj) {
			 	var year = dateObj.getFullYear(),
			 		month = dateObj.getMonth() + 1,
			 		day = dateObj.getDate();
			 
			 	return year + '-' + this.formatNum(month) + '-' + this.formatNum(day);
			 },
			 formatNum(num) {
			 	if (num < 10) {
			 		num = '0' + num;
			 	}
			 	return num;
			 }
		},
		components:{
			swiperNavBar
		}
	}
</script>

<style>
.swiperHead{
		/* margin-top: 5px; */
		/* height: calc(6vh); */
		background-color: #ffffff;
	},
	
	
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
	.meeting-list {
	  height: 78vh;
	  background-color:#ebebeb;
	}
	
	.scroll-view {
	  height: 100%;
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
	
	.meeting-item {
	  position: relative;
	  margin: 20rpx 10rpx;
	  padding: 20rpx 10rpx;
	  background-color: #fff;
	  border-radius: 8rpx;
	  background-image: url(../../static/bg.png);
	  background-size: cover;
	  background-position: center;
	  box-sizing: border-box;
	}
	
	.meeting-status {
	  top: 0;
	  right: 0;
	  padding: 6rpx;
	  border-radius: 4rpx;
	  color: #fff;
	}
	
	.title {
	 display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 42rpx;
	font-weight: 600;
	}
	.titleCSS{
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 400rpx;
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
	  color: #00cc66;
	  background-color: #ccffcc;
	}
	
	.red {
	  color: #ff3300;
	  background-color: #ffcccc;
	}
	
	.blue {
	  color: #3366ff;
	}
	
	.gray {
	  color: #999999;
	}
	.yellow{
		color:#E0943A ;
	}
	.green2{
		color: #2DD08D;
	}
	
	
</style>
