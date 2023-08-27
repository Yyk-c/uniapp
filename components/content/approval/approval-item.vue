<template>
	<view class="item-info">
		<view class="info">
			<view class="avatar">
				<text>{{approvalItem.name}}</text>
			</view>
			
			<view class="content">
				<view class="type">
					{{approvalItem.name}}的{{approvalItem.type}}
				</view>
				<view class="time">
					{{timeFormat(approvalItem.time)}}
				</view>
				<view class="desc">
					请假类型:{{approvalItem.type}}
				</view>
				<view class="start">
					{{timeFormat(approvalItem.start)}}
				</view>
				<view class="end">
					{{timeFormat(approvalItem.end)}}
				</view>
			</view>
		</view>
		<!-- 状态 -->
		<view class="status" :style="{color:statuscolor}">
			{{approvalStatus}}
		</view>
	</view>
</template>

<script>
	const moment = require("moment")
	moment.locale("zh-cn") //设置语言环境为中文
	export default {
		data() {
			return {
				statuscolor: "#666666",
			}
		},
		props:{
			approvalItem: {
				type:Object,
				required:true
			}
		},
		computed:{
			approvalStatus() {
				switch(this.approvalItem.status) {
					case 0 :
						this.statuscolor = "#E89724"
						return "待审批";
						break;
					case 1 :
						this.statuscolor = "#3EB568"
						return "同意";
						break;
					case 2 :
						this.statuscolor = "#E64110"
						return "不同意";
						break;
					default:
						return "退回";
						break;
				}
			}
		},
		methods:{
			timeFormat(time) {
				return moment(time).format('YYYY-MM-DD HH:mm:ss')
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.item-info {
		height: 284rpx;
		display: flex;
		justify-content: space-between;
		padding: 30rpx 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		box-sizing: border-box;
		border-bottom: 1px solid #C0C0C0;
	}
	
	.info {
		display: flex;
		.avatar {
			width: 80rpx;
			height: 80rpx;
			background: #3C81F0;
			border-radius: 50%;
			text-align: center;
			& > text {
				font-size: 24rpx;
				color: #FFFFFF;
				line-height: 80rpx;
			}
		}
		.content {
			margin-left: 30rpx;
			.type {
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
			}
			.time {
				height: 60rpx;
				line-height: 60rpx;
				font-size: 22rpx;
				color: #999999;
			}
			.desc,.start,.end {
				font-size: 26rpx;
				color: #666666;
			}
			.start {
				height: 60rpx;
				line-height: 60rpx;
			}
		}
	}
	
	.status {
		font-size: 30rpx;
	}
</style>
