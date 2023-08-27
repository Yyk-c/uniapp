<template>
	<view>
		<view class="pop">
			<view class="tip">
				选择时间
			</view>
			<view class="choose-time">
				<view class="time-box" @tap="startHandle">
					<image src="../../../static/common/calendar_icon.png" mode=""></image>
					<m-input class="m-input" type="text" v-model="startTime" placeholder="开始时间" fontSize="24rpx">
					</m-input>
				</view>
				<!-- 分割线 -->
				<view class="separation"></view>

				<view class="time-box" @tap="endHandle">
					<image src="../../../static/common/calendar_icon.png" mode=""></image>
					<m-input class="m-input" type="text" v-model="endTime" placeholder="结束时间" fontSize="24rpx">
					</m-input>
				</view>

			</view>

			<!-- 状态 -->
			<view class="tip">
				状态
			</view>
			<view class="tag-list">
				<view class="tag-item" v-for="(item,index) in statusList" :key="index" @tap="statusHandle(item)"
					:class="{'active-tag': selectedStatus.indexOf(item) !== -1}">
					{{item}}
				</view>
			</view>
			<!-- 类型 -->
			<view class="tip">
				类型
			</view>
			<view class="tag-list">
				<view class="tag-item" v-for="(item,index) in typeList" :key="index" @tap="typeHandle(item)"
					:class="{'active-tag': selectedType.indexOf(item) !== -1}">
					{{item}}
				</view>
			</view>
		</view>

		<view class="operate">
			<view class="reset" @tap="resetHandle">
				重置
			</view>
			<view class="confirm">
				确定
			</view>
		</view>

		<!-- 日历选择器 -->
		<uni-calendar ref="calendar" :clear-date="true" :insert="false" :lunar="true" :startDate="startDate"
			:endDate="endDate" @confirm="confirm" />
	</view>
</template>

<script>
	import uniCalendar from '@/components/common/uni-calendar/uni-calendar.vue'
	import mInput from '@/components/common/m-input/m-input.vue'
	export default {
		data() {
			return {
				startDate: '2019-01-01',
				endDate: '2030-01-01',
				startTime: '',
				endTime: '',
				statusList: ["全部", "审批通过", "审批中", "撤回", "退回", "未通过", "草稿"],
				typeList: ["全部", "请假", "公出", "补卡", "出差", "其他"],
				selectedStatus: [],
				selectedType: [],
				timeType: 1,
			}
		},
		methods: {
			statusHandle(item) { // 状态标签选择
				let result = this.selectedStatus.some(value => { // 查看是否有选中
					return item == value
				})
				if (result) {
					this.selectedStatus = this.selectedStatus.filter(value => { // 有选中剔除
						return value !== item
					})
				} else {
					this.selectedStatus.push(item) // 没有选择添加
				}
			},
			typeHandle(item) { // 类型标签选择
				let result = this.selectedType.some(value => { // 查看是否有选中
					return item == value
				})
				if (result) {
					this.selectedType = this.selectedType.filter(value => { // 有选中剔除
						return value !== item
					})
				} else {
					this.selectedType.push(item) // 没有选择添加
				}
			},
			startHandle() { // 开始日期选择触发
				// if(this.endTime.length) {  // 结束时间选定，开始日期选择区间减少
				// 	this.endDate = this.endTime
				// }
				this.timeType = 1
				this.$refs.calendar.open()
			},
			endHandle() { // 结束日期选择触发
				// if(this.startTime.length) {  // 开始时间选定，结束日期选择区间减少
				// 	this.startDate = this.startTime
				// }
				this.timeType = 2
				this.$refs.calendar.open()
			},
			confirm(e) { // 选定日期
				if (this.timeType == 1) {
					this.startTime = e.fulldate
				} else {
					this.endTime = e.fulldate
				}
			},
			resetHandle() { // 重置
				this.startTime = '';
				this.endTime = '';
				this.selectedStatus = [];
				this.selectedType = [];
			},
		},
		components: {
			mInput,
			uniCalendar
		}
	}
</script>

<style lang="scss" scoped>
	.pop {
		height: 100%;
		padding-left: 30rpx;
		padding-right: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;

		.tip {
			font-size: 28rpx;
			font-weight: bold;
			color: #333333;
			line-height: 70rpx;
		}

		.tag-list {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;

			.tag-item {
				width: 216rpx;
				height: 68rpx;
				line-height: 68rpx;
				margin-bottom: 20rpx;
				text-align: center;
				background: #F4F4F4;
				font-size: 28rpx;
				color: #666666;
				border-radius: 12rpx;
			}
		}
	}

	.choose-time {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 64rpx;
		margin-bottom: 20rpx;

		.time-box {
			width: 316rpx;
			height: 100%;
			display: flex;
			align-items: center;
			border: 1px solid #DDDDDD;
			border-radius: 8rpx;

			&>image {
				width: 32rpx;
				height: 32rpx;
				margin-left: 17rpx;
				margin-right: 17rpx;
			}

			.m-input {
				flex: 1;
				height: 100%;
				padding-left: 0rpx !important;
			}
		}

		.separation {
			width: 26rpx;
			height: 3rpx;
			background: #DDDDDD;
		}
	}

	// 操作按钮
	.operate {
		height: 88rpx;
		margin-top: 80rpx;
		display: flex;
		align-items: center;
		font-family: PingFang SC;
		font-weight: 500;

		.reset {
			flex: 1;
			height: 100%;
			line-height: 88rpx;
			text-align: center;
			background-color: #F4F4F4;
			font-size: 28rpx;
			color: #333333;
		}

		.confirm {
			flex: 1;
			height: 100%;
			line-height: 88rpx;
			text-align: center;
			background-color: #3C81F0;
			font-size: 28rpx;
			font-weight: bold;
			color: #FFFFFF;
		}
	}


	.active-tag {
		font-weight: bold;
		color: #3C81F0 !important;
		background: #E9F2FF !important;
	}
</style>
