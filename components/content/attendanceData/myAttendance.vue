<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-Y">
			<!-- 月度考勤统计 -->
			<view class="statistics">
				<view class="header">
					<text>月度考勤统计</text>
					<view class="picker-data" @tap="myPicker">
						{{myCurrentMonth}}
						<image src="../../../static/timecard/bottom_arrow.png" mode=""></image>
					</view>
				</view>

				<!-- 圆形进度 -->
				<view class="circle-box">
					<cmd-progress type="circle" :percent="attendance/ workday * 100" :stroke-width="12" :width="280"
						:showInfo="false"></cmd-progress>
					<view class="content">
						<view class="day-progress">{{attendance}}/{{workday}}</view>
						<view class="tip">出勤天数</view>
					</view>
				</view>

				<!-- 相关类型天数  线型进度 -->
				<view class="line-progress">
					<view class="line-box" v-for="(item,index) in relativeData" :key="index">
						<view class="show-info">
							<text>{{item.name}}</text>
							<text>{{item.days ? item.days : item.times}}</text>
						</view>

						<cmd-progress :percent="lineProgress(item)" stroke-shape="round" :showInfo="false"
							:stroke-width="8"></cmd-progress>
					</view>
				</view>
			</view>
		
		    <!-- 考勤异常记录 -->
			<view class="abnormal-recode">
				<view class="header">
					考勤异常记录
				</view>
				
				<view class="recode-list" v-if="abnormalRecodes.length">
					<view class="recode-item" v-for="(item,index) in abnormalRecodes" :key="index">
						<view class="date-show">
							<view class="circle"></view>
							<text class="type">{{item.type}}</text>
							<text>{{item.date}}</text>
							<text>{{item.desc}}</text>
						</view>
						<view class="dispose">
							处理
					</view>
					
					</view>
				</view>
				
				<view class="none-abnormal" v-else>
					暂无数据
				</view>	
			</view>
			
			<view style="height: 32rpx;">
				
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
				workday: 31,
				attendance: 12,
				relativeData: [{
						name: "公出",
						days: "5.0"
					},
					{
						name: "迟到",
						times: 2
					},
					{
						name: "出差",
						days: "0.0"
					},
					{
						name: "早退",
						times: 0
					},
					{
						name: "请假",
						days: "2.0"
					},
					{
						name: "旷工",
						times: 3
					},
					{
						name: "补卡",
						times: 2
					},
					{
						name: "漏卡",
						times: 4
					},
				],
				abnormalRecodes:[
					{
						type:"漏卡",
						date: "10-23（星期三）",
						desc: "下班"
					},
					{
						type:"迟到",
						date: "10-24（星期四）",
						desc: "下班"
					},
					{
						type:"漏卡",
						date: "10-23（星期三）",
						desc: "下班"
					},
				]
			}
		},
		props: {
			myCurrentMonth: {
				type: String
			}
		},
		methods: {
			// 弹出月份选择器
			myPicker() {
				this.$emit('myPicker')
			},
			lineProgress(item) {
				let num = parseFloat(item.days ? item.days : item.times)
				return num / this.workday * 100
			}
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
		height: 978rpx;
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
				font-size: 54rpx;
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

	// 月度考勤线形进度
	.line-progress {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 80rpx;
		padding-left: 65rpx;
		padding-right: 65rpx;

		.line-box {
			width: 200rpx;
			height: 60rpx;
			display: flex;
			align-content: space-between;
			flex-wrap: wrap;
			margin-bottom: 55rpx;

			.show-info {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
			}
		}
	}

	// 考勤异常记录
	.abnormal-recode {
		margin-top: 20rpx;
		line-height: 100rpx;
		border-radius: 36rpx;
		overflow: hidden;
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		background-color: #FFFFFF;
		.header {
			padding-left: 30rpx;
		}
		.recode-list {
			& .recode-item:nth-child(2n-1) {
				background-color:#F8FAFC;
			}
			.recode-item {
				height: 105rpx;
				padding-left: 30rpx;
				padding-right: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
				.date-show {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.circle {
						width: 12rpx;
						height: 12rpx;
						margin-right: 16rpx;
						border-radius: 12rpx;
						background-color: #E89724;
					}
					.type {
						color: #666666;
						margin-right: 25rpx;
					}
				}
				.dispose {
					width: 88rpx;
					height: 44rpx;
					line-height: 44rpx;
					text-align: center;
					font-size: 26rpx;
					font-weight: 500;
					color: #FFFFFF;
					background: linear-gradient(90deg, #3BAAF8, #3C81F0);
					border: 1px solid #3C81F0;
					box-shadow: 0px 10rpx 20rpx 0rpx #BFDFFF;
					border-radius: 4rpx;
				}
			}
			
			& .recode-item:nth-child(2n) .circle {
				background-color: #E64110;
			}
		}
		.none-abnormal {
			line-height: 140rpx;
			text-align: center;
			color: #666666;
			opacity: 0.5;
		}
	}
</style>
