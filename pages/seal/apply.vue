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
			    <scroll-view class="scroll-view" scroll-y>
			      <view v-for="(item, index) in sealList" :key="index" class="seal-item" > 
			        <view class="title">
						<view class="currentType">
							<uni-tag text="紧急" type="primary" size="small" />
						</view>
						<view class="titleCSS">
						印章:{{ item.title }}
						</view>
						<view class="seal-status" :class="{'green': item.inProgress, 'red': !item.inProgress}">
						  {{ item.inProgress ? '审批通过' : '审批不通过' }}
						</view>
					</view>
			          <view class="info">
						<view class="info-item">
			            <text class="label">印章文件名称：
						<text class="value">{{ item.name }}</text>
						</text>
			          </view>
					  <view class="info-item">
			            <text class="label">印章件所属单位：
						<text class="value">{{ item.position }}</text>
						</text>
			          </view>
			          <view class="info-item">
			            <text class="label">申请人：
						<text class="value">{{ item.person }}</text>
						</text>
			          </view>
			          <view class="info-item">
			            <text class="label">处理时限：
						<text class="value">
						  {{ item.startTime }}
						</text>
						</text>
			          </view>
						<view class="info-item">
			            <text class="label">填单时限：
						<text class="value">
						  {{ item.startTime }}
						</text>
						</text>
			          </view>
			          <view class="info-item">
			            <text class="label">用印时限：
							<text class="value">
							  {{ item.endTime }}
							</text>
						</text>
			          </view>
					  <view class="rounded-box">
					      <input type="text" value="备注：盖一下文件" readonly>
					    </view>
					  
			        </view>
					<!-- 头像框absolute定位 -->
					 <view class="profile-picture">
					      <!-- 添加头像框的叠加层 -->
					      <image src="../../static/logo.png" class="frame" />
					    </view>
					
			      </view>
			    </scroll-view>
			  </view>
	</view>
</template>

<script>
	import uniIcons from '@/components/common/uni-icons/uni-icons.vue';
	import swiperNavBar from '@/components/common/swiperNavBar/swiperNavBar.vue';
	import uniTag from '@/components/common/uni-tag/uni-tag.vue';
	export default {
		data() {
			return {
				swiper: { //滑动导航栏
					scrollIntoView: 0, //设置哪个方向可滚动，则在哪个方向滚动到该元素
					swiperTabList: ['待我审批单','我已审批的'], //导航列表文字
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
				sealList: [
				        {
				          title: '印章asdasdasdsdasdas名称1',
				          name: '印章文件名称',
						  position:'印章单位',
						  person:'申请人1',
				          startTime: '09:00',
				          endTime: '10:30',
				          inProgress: true
				        },
				        {
				          title: '印章名称2',
				          name: '印章文件名称',
						  position:'印章单位',
						  person:'申请人1',
				          startTime: '13:00',
				          endTime: '14:30',
				          inProgress: false
				        },{
				          title: '印章名称1',
				          name: '印章文件名称',
						  position:'印章单位',
						  person:'申请人1',
				          startTime: '09:00',
				          endTime: '10:30',
				          inProgress: true
				        },{
				          title: '印章名称1',
				          name: '印章文件名称',
						  position:'印章单位',
						  person:'申请人1',
				          startTime: '09:00',
				          endTime: '10:30',
				          inProgress: false
				        },{
				          title: '印章名称1',
				          name: '印章文件名称',
						  position:'印章单位',
						  person:'申请人1',
				          startTime: '09:00',
				          endTime: '10:30',
				          inProgress: true
				        },{
				          title: '印章名称1',
				          name: '印章文件名称',
						  position:'印章单位',
						  person:'申请人1',
				          startTime: '09:00',
				          endTime: '10:30',
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
	  height: 85vh;
	  background-color:#ebebeb;
	}
	
	.scroll-view {
	  height: 100%;
	}
	
	.profile-picture {
	    position: absolute;
	    top: 80rpx;
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
	width: 450rpx;
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
	  width: 670rpx;
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
