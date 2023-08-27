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
						{{ meeting.title }}
						</view>
						<view class="meeting-status" :class="{'blue': meeting.inProgress, 'gray': !meeting.inProgress}">
						  {{ meeting.inProgress ? '进行中' : '已结束' }}
						</view>
					</view>
			        <view class="info">
			          <view class="info-item">
			            <text class="label">会议室：
						<text class="value">{{ meeting.room }}</text>
						</text>
			          </view>
			          <view class="info-item">
			            <text class="label">开始时限：
						<text class="value">
						  {{ meeting.startTime }}
						</text>
						</text>
						<text class="status-label" :class="{'green': meeting.checkedIn, 'red': !meeting.checkedIn}">
						  {{ meeting.checkedIn ? '已签到' : '未签到' }}
						</text>
			          </view>
			          <view class="info-item">
			            <text class="label">处理时限：
							<text class="value">
							  {{ meeting.endTime }}
							</text>
						</text>
						<text class="status-label" :class="{'green': meeting.checkedOut, 'red': !meeting.checkedOut}">
						  {{ meeting.checkedOut ? '已签退' : '未签退' }}
						</text>
			          </view>
			        </view>
			      </view>
			    </scroll-view>
			  </view>
	</view>
</template>

<script>
	import swiperNavBar from '@/components/common/swiperNavBar/swiperNavBar.vue';
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
				          title: '会议标题会议标题会议标题会议标题会议标题会议标题会议标题会议标题会议标题会议标题会议标题会议标题会议标题会议标题会议标题1',
				          room: '会议室A',
				          startTime: '09:00',
				          endTime: '10:30',
				          checkedIn: true,
				          checkedOut: false,
				          inProgress: true
				        },
				        {
				          title: '会议标题2',
				          room: '会议室B',
				          startTime: '13:00',
				          endTime: '14:30',
				          checkedIn: false,
				          checkedOut: true,
				          inProgress: false
				        },{
				          title: '会议标题1',
				          room: '会议室A',
				          startTime: '09:00',
				          endTime: '10:30',
				          checkedIn: true,
				          checkedOut: true,
				          inProgress: true
				        },{
				          title: '会议标题1',
				          room: '会议室A',
				          startTime: '09:00',
				          endTime: '10:30',
				          checkedIn: false,
				          checkedOut: false,
				          inProgress: false
				        },{
				          title: '会议标题1',
				          room: '会议室A',
				          startTime: '09:00',
				          endTime: '10:30',
				          checkedIn: true,
				          checkedOut: false,
				          inProgress: true
				        },{
				          title: '会议标题1',
				          room: '会议室A',
				          startTime: '09:00',
				          endTime: '10:30',
				          checkedIn: true,
				          checkedOut: false,
				          inProgress: true
				        },
						]
			}
		},
		methods: {
			 currentTab(index, item) {
			 	console.log(index);
				console.log(item);
				this.swiper.swiperTabIdx = index;
				this.swiper.scrollIntoView = Math.max(0, index - 1);
			 },
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
	.meeting-list {
	  height: 85vh;
	  background-color:#ebebeb;
	}
	
	.scroll-view {
	  height: 100%;
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
	  color: #888;
	}
</style>
