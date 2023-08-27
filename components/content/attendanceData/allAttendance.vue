<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-Y">
			<!-- 月度考勤统计 -->
			<view class="statistics">
				<view class="header">
					<text>月度考勤统计</text>
					<view class="picker-data" @tap="allPicker">
						{{allCurrentMonth}}
						<image src="../../../static/timecard/bottom_arrow.png" mode=""></image>
					</view>
				</view>

				<!-- 圆形进度 -->
				<view class="circle-box">
					<cmd-progress type="circle" :percent="attendance/ headcount * 100" :stroke-width="12" :width="280"
						:showInfo="false"></cmd-progress>
					<view class="content">
						<view class="day-progress">{{attendance}}/{{headcount}}</view>
						<view class="tip">出勤人数</view>
					</view>
				</view>

				<!-- 考勤相关人数统计 -->
				<view class="statistics-box">
					<view class="statistics-item" v-for="(item,index) in typeStatistics" :key="index">
						<view class="num">{{item.num}}</view>
						<view class="type">
							<view class="circle"></view>
							{{item.name}}
						</view>
					</view>
				</view>
			</view>

			<!-- 各部门考勤 -->
			<view class="department">
				<view class="header">
					各部门考勤
				</view>
				<view class="department-list">
					<view class="department-item" v-for="(item,index) in departmentList" :key="index">
						<view class="department-name">{{item.name}}</view>
						<view class="hours">
							平均<text>{{item.hours}}</text>公时
							<image src="../../../static/timecard/right-arrow.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>


	</view>
</template>

<script>
	import cmdProgress from '@/components/common/cmd-progress/cmd-progress.vue'
	import wPicker from "@/components/common/w-picker/w-picker.vue";
	export default {
		data() {
			return {
				headcount: 365,
				attendance: 167,
				typeStatistics: [{
					name: "未打卡",
					num: 16
				}, {
					name: "迟到",
					num: 17
				}, {
					name: "外勤",
					num: 167
				}],
				departmentList: [{
						name: "销售一部",
						hours: "0.0"
					},
					{
						name: "销售一部",
						hours: "0.0"
					},
					{
						name: "销售一部",
						hours: "0.0"
					},
					{
						name: "销售一部",
						hours: "0.0"
					},
					{
						name: "销售一部",
						hours: "0.0"
					},
					{
						name: "销售一部",
						hours: "0.0"
					},
					{
						name: "销售一部",
						hours: "0.0"
					},
					{
						name: "销售一部",
						hours: "0.0"
					},
					{
						name: "销售一部",
						hours: "0.0"
					},
					{
						name: "销售一部",
						hours: "0.0"
					},
					{
						name: "销售一部",
						hours: "0.0"
					},
				],
			}
		},
		props: {
			allCurrentMonth: {
				type: String
			}
		},
		methods: {
			// 弹出月份选择器
			allPicker() {
				this.$emit('allPicker')
			},
		},
		components: {
			cmdProgress
		}
	}
</script>

<style scoped lang="scss">
	.scroll-Y {
		box-sizing: border-box;
		height: calc(100vh - 240rpx);
		font-family: PingFang SC;
		border-top-left-radius: 36rpx;
		border-top-right-radius: 36rpx;
		overflow: hidden;
	}

	// 月度考勤统计
	.statistics {
		height: 634rpx;
		border-radius: 36rpx;
		font-size: 32rpx;
		font-weight: bold;
		padding-top: 20rpx;
		color: #333333;
		background-color: #FFFFFF;

		.header {
			height: 100rpx;
			padding-left: 30rpx;
			padding-right: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		// 月份选择器
		.picker-data {
			width: 202rpx;
			height: 56rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			border: 1px solid #CCCCCC;
			border-radius: 8rpx;
			padding-left: 16rpx;
			padding-right: 16rpx;
			font-weight: 500;
			font-size: 28rpx;
			color: #333333;

			& image {
				width: 30rpx;
				height: 30rpx;
			}
		}

		// 圆形进度
		.circle-box {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 280rpx;
			height: 280rpx;
			margin: auto;
			margin-top: 50rpx;

			.content {
				position: absolute;
				text-align: center;

				.day-progress {
					font-size: 42rpx;
					font-weight: bold;
					color: #333333;
				}

				.tip {
					margin-top: 10rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #666666;
				}
			}
		}

		.statistics-box {
			margin-top: 80rpx;
			display: flex;
			align-items: center;

			.statistics-item {
				flex: 1;
				height: 82rpx;
				display: flex;
				align-content: space-between;
				justify-content: space-between;
				text-align: center;
				flex-wrap: wrap;

				.num {
					width: 100%;
					font-size: 36rpx;
					font-weight: bold;
					color: #333333;
				}

				.type {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					font-size: 26rpx;
					font-weight: 500;
					color: #666666;

					.circle {
						width: 12rpx;
						height: 12rpx;
						margin-right: 16rpx;
						border-radius: 12rpx;
						background-color: #E89724;
					}
				}
			}

			& .statistics-item:nth-child(2) {
				border-left: 1px solid #DDDDDD;
				border-right: 1px solid #DDDDDD;
			}

			& .statistics-item:nth-child(2) .circle {
				background-color: #E64110;
			}

			& .statistics-item:nth-child(3) .circle {
				background-color: #3DD2DB;
			}
		}
	}

	.department {
		margin-top: 20rpx;
		border-radius: 36rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		background-color: #FFFFFF;

		.header {
			height: 100rpx;
			padding-left: 30rpx;
			line-height: 100rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #333333;
			box-shadow: 0px 1px 0px 0px #F3F3F3;
		}
		.department-list {
			padding-left: 30rpx;
			padding-right: 30rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			
			.department-item {
				height: 100rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #F5F5F5;
				.department-name {
					color: #333333;
				}
				.hours {
					display: flex;
					align-items: center;
					color: #666666;
					text {
						margin-left: 6rpx;
						margin-right: 6rpx;
						color: #389AF4;
					}
				}
				image {
					width: 15rpx;
					height: 26rpx;
					margin-left: 20rpx;
				}
			}
		}
	}
</style>
