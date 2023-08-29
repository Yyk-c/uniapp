<template>
	<view>
		<!-- 滑动导航栏组件 -->
		<view class="swiperHead" :style="{top:topHeight}" id="swiper-head">
			<swiperNavBar v-if="swiper.swiperTabList.length > 1 " :scrollIntoView="swiper.scrollIntoView"
				:swiperTabList='swiper.swiperTabList' :swiperTabIdx='swiper.swiperTabIdx'
				:currentSwiperWidth='swiper.currentSwiperWidth' :currentSwiperHeight='swiper.currentSwiperHeight'
				:swiperCurrentSize='swiper.swiperCurrentSize' :swiperColor='swiper.swiperColor'
				:swiperCurrentColor='swiper.swiperCurrentColor'
				:currentSwiperLineActiveWidth="swiper.currentSwiperLineActiveWidth"
				:currentSwiperLineActiveHeight="swiper.currentSwiperLineActiveHeight"
				:currentSwiperLineActiveBg="swiper.currentSwiperLineActiveBg" @change="currentTab" class="swiperNavBar">
			</swiperNavBar>
		</view>

		<view class="meetingRoom-list">
			<scroll-view class="scroll-view" scroll-y>
				<view v-for="(meeting, index) in meetingList" :key="index" class="meetingRoom-item">
					<view class="info" style="margin-top: 10rpx;">
					<view class="info-item">
						<text class="label" style="font-size: 28rpx;">创建时间：
							<text class="value" style="font-size: 28rpx;">
								{{ meeting.create_time }}
							</text>
						</text>
						
						
						
						<view class="meeting-status" :class="{'gray': meeting.status == '已结束' || meeting.status == '未通过' || meeting.status == '未审批', 'green2': meeting.status == '进行中','yellow':meeting.status == '已通过未开始'}">
						
						  <view class="status-dot" :class="{ 'grayForDot': meeting.status == '已结束' || meeting.status == '未通过' || meeting.status == '未审批', 'green2ForDot': meeting.status == '进行中','yellowForDot':meeting.status == '已通过未开始' }"></view>
						  {{ meeting.status }}
						</view>
						
					</view>
					</view>
					<view class="separator"></view>
					<view class="title">
						<view class="titleCSS">
							{{ meeting.title }}
						</view>
					</view>
					<view class="info">
						<view class="info-item">
							<text class="label">会议地点：
								<text class="value">{{ meeting.room_name }}</text>
							</text>
						</view>
						<view class="info-item">
							<text class="label">会议时间：
								<text class="value">
									{{ meeting.begin_time + '~' + meeting.end_time.substring(11,20) }}
								</text>
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
	import hrUrl from "@/common/hrReqConst.js";
	export default {
		data() {
			return {
				swiper: { //滑动导航栏
					scrollIntoView: 0, //设置哪个方向可滚动，则在哪个方向滚动到该元素
					swiperTabList: ['未通过', '审核中', '未开始', '进行中', '已结束'], //导航列表文字
					swiperTabIdx: 0,
					swiperCurrentSize: '30rpx', //导航的字体大小
					swiperColor: '#999999', //导航栏字体未选中前颜色
					swiperCurrentColor: '#333333', //选中当前导航栏字体颜色
					currentSwiperWidth: '20%', //每项导航列表的宽度
					currentSwiperHeight: '88rpx', //当前导航的高度度 rpx px
					currentSwiperLineActiveBg: '#3C81F0', //当前选中的导航栏线条颜色
					currentSwiperLineActiveWidth: '36rpx', //当前选中的导航栏线条的宽度 upx rpx px
					currentSwiperLineActiveHeight: '6rpx', //当前选中的导航栏线条的高度度 upx rpx px
				},
				topHeight: "0px", //吸顶高度
				meetingList: [
{end_time:''}
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
							 		'codeBlockName': 'oa_meeting_getSelfOrder',
							 		'params': '{"user_id":"'+this.userId+'","pageNum":1,"pageSize":30}'
							 	},
							 	success: res => {
							 		let data = res.data.data;
							 		this.meetingList = data.rows;
									console.log(data)
							 	},
							 	fail: () => {
							 
							 	},
							 	complete: () => {
							 		
							 
							 	}
							 });
			},
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
		components: {
			swiperNavBar
		}
	}
</script>

<style>
	.swiperHead {
		/* margin-top: 5px; */
		/* height: calc(6vh); */
		background-color: #ffffff;
	}

	,
	.meetingRoom-list {
		height: 85vh;
		background-color: #ebebeb;
	}

	.scroll-view {
		height: 100%;
	}

	.meetingRoom-item {
		position: relative;
		margin: 20rpx 10rpx;
		padding: 20rpx 10rpx;
		background-color: #fff;
		border-radius: 8rpx;
		background-image: url(../../static/rooms.png);
		background-size: cover;
		background-position: center;
		box-sizing: border-box;
	}

	.meeting-status {
display: flex;
  flex-direction: row;
  align-items: center;
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

	.titleCSS {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 400rpx;
	}

	.info {
		margin-top: 20rpx;
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
	
	.separator {
	  height: 1rpx;
	  background-color: #E6E6E6;
	  margin: 10rpx 0;
	}
	.status-dot {
	  width: 18rpx;
	  height: 18rpx;
	  border-radius: 50%;
	  margin-right:10rpx;
	  box-shadow: 0 2rpx 20rpx ;
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
	
	.grayForDot {
	  background-color: #999999;
	}
	.yellowForDot{
		background-color:#E0943A ;
	}
	.green2ForDot{
		background-color: #2DD08D;
	}
	
</style>