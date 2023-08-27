<template>
	<view class="list">
		<view class="avatar">
			<image :src="message.avatar ? message.avatar : defAvatar " mode=""></image>
		</view>
		
		<view class="box">
			<view class="info">
				<view class="name">
					{{message.name ? message.name : "默认名称"}}
				</view>
				<view class="signature">
					{{message.signature ? message.signature : "默认签名"}}
				</view>
			</view>
			<view class="time">
				{{message.time}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: {
			message: {
				type: Object,
				required: true,		
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #FFFFFF;
	}
	.list {
		width: 100%;
		height: 160rpx;
		display: flex;
		align-items: center;
		font-family: PingFang SC;
		background: #FFFFFF;
		.avatar {
			margin-left: 31rpx;
			width: 88rpx;
			height: 88rpx;
			border-radius: 50%;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.box {
			margin-left: 24rpx;
			margin-right: 31rpx;
			height: 100%;
			display: flex;
			flex: 1;
			justify-content: space-between;
			align-items: center;
			font-family: PingFang SC;
			font-weight: 500;
			border-bottom: 1px solid #edeeef;
			.info {
				
				.name {
					font-weight: bold;
					color: #FFFFFF;
					line-height: 32rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: #333333
				}
				.signature {
					margin-top: 19rpx;
					font-size: 28rpx;
					color: #999999;
					line-height: 28rpx;
				}	
			}
			.time{
				font-size: 24rpx;
				color: #666666;
			}
		}
	}
</style>
