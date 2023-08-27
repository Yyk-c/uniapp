<template>
	<view>
		<!-- 上班 -->
		<view class="item-box">

			<view class="contain">
				<image src="/static/timecard/sun_icon.png" mode="" class="icon"></image>
				<view class="work-time">
					上班时间 <text>{{workTime}}</text>
				</view>
				<view class="tip">
					左滑可以切换到外勤打卡
				</view>
			</view>

			<view class="clock-in-box" @tap="workHandle" :animation="animationDataTop">
				<!-- 蓝色边框，配合变大动画 -->
				<view class="boder-circle" :animation="animationDataTopCircle"></view>
				<!-- 按钮背景 -->
				<image src="/static/timecard/btn_bg.png" mode="" class="btn-bg"></image>
				<!-- 手势 -->
				<image src="/static/timecard/hand.png" mode="" class="hand" :class="{handAnimation:!isSignIn}">
				</image>
				<!-- 圆圈 -->
				<image src="/static/timecard/circle_icon.png" mode="" class="circle"
					:class="{circleAnimation:!isSignIn}"></image>
			</view>

			<view class="outer">
				外
			</view>
		</view>

		<!-- 下班 -->
		<view class="item-box" style="margin-top: 20rpx;">
			<view class="contain">
				<image src="/static/timecard/moon_icon.png" mode="" class="icon"></image>
				<view class="work-time">
					下班时间 <text>{{offWorkTime}}</text>
				</view>
				<view class="tip">
					左滑可以切换到外勤打卡
				</view>
			</view>
			<view class="clock-in-box" @tap="offWorkHandle" :animation="animationDataDown">
				<view class="boder-circle" :animation="animationDataDownCircle"></view>
				<image src="/static/timecard/btn_bg.png" mode="" class="btn-bg"></image>
				<!-- 手势 -->
				<image src="/static/timecard/hand.png" mode="" class="hand"
					:class="{handAnimation:isSignIn && !isSignOut}"></image>
				<!-- 小圆圈 -->
				<image src="/static/timecard/circle_icon.png" mode="" class="circle"
					:class="{circleAnimation:isSignIn && !isSignOut}"></image>

				
			</view>
			<view class="outer">
				外
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				workTime: "08:30",
				offWorkTime: "17:30",
				isSignIn: false, // 是否签到了
				isSignOut: false,
				animationDataTop: {}, // 签到
				animationDataDown: {}, // 签退
				animationDataTopCircle: {},
				animationDataDownCircle: {},
			}
		},
		methods: {
			workHandle() {
				this.isSignIn = !this.isSignIn

				this.animation.scale(1.2).step()
				this.animation.scale(1).step()
				this.animationDataTop = this.animation.export()

				this.animation.scale(1.2).step()
				this.animation.scale(1).step()
				this.animationDataTopCircle = this.animation.export()

				setTimeout(function() {
					this.animation.scale(1).step()
					this.animationDataTop = this.animation.export()
					this.animationDataTopCircle = this.animation.export()
				}.bind(this), 1000)

			},
			offWorkHandle() {
				if (!this.isSignIn) { // 没有签到不能签
					return
				}
				this.isSignOut = !this.isSignOut
				this.animation.scale(1.2).step()
				this.animation.scale(1).step()
				this.animationDataDown = this.animation.export()
				this.animation.scale(1.2).step()
				this.animation.scale(1).step()
				this.animationDataDownCircle = this.animation.export()

				setTimeout(function() {
					this.animation.scale(1).step()
					this.animationDataDown = this.animation.export()
					this.animationDataDownCircle = this.animation.export()
				}.bind(this), 1000)
			},
		},
		computed: {

		},
		mounted() {
			let animation = uni.createAnimation({
				duration: 400,
				timingFunction: 'linear',
			})
			this.animation = animation
		},
	}
</script>

<style lang="scss" scoped>
	// 手势上下移动
	@keyframes displacement {
		0% {
			transform: translateY(-8%);
		}

		100% {
			transform: translateY(8%);
		}
	}

	// 圆显现
	@keyframes circle-show {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	.item-box {
		position: relative;
		z-index: 99;
		height: 260rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 30rpx;
		padding-right: 60rpx;
		background: #FFFFFF;
		border-radius: 36rpx;
		overflow: hidden;

		.outer {
			position: absolute;
			box-sizing: border-box;
			right: -15rpx;
			width: 52rpx;
			height: 104rpx;
			line-height: 90rpx;
			text-align: center;
			font-size: 22rpx;
			color: #FFFFFF;
			background: linear-gradient(0deg, #F3B93D, #E89724);
			border: 4rpx solid #F5DDB8;
			border-radius: 52rpx 0 0 52rpx;
		}

		.contain {
			.icon {
				width: 48rpx;
				height: 48rpx;
			}

			.work-time {
				font-size: 36rpx;
				font-weight: bold;
				color: #333333;
				line-height: 70rpx;

				text {
					margin-left: 30rpx;
				}
			}

			.tip {
				font-size: 26rpx;
				color: #999999;
				line-height: 70rpx;
			}
		}

	}

	.clock-in-box {
		position: relative;
		width: 125rpx;
		height: 125rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 3rpx solid #CFECFF;
		box-shadow: 0px 10rpx 20rpx 0px rgba(238, 238, 238, 0.5);
		border-radius: 50%;

		.boder-circle {
			position: absolute;
			z-index: 55;
			width: 119rpx;
			height: 119rpx;
			border-radius: 50%;
			border: 4rpx solid #CFECFF;
			box-shadow: 0px 10rpx 20rpx 0px rgba(238, 238, 238, 0.5);
		}

		.btn-bg {
			position: absolute;
			z-index: 66;
			width: 128rpx;
			height: 128rpx;
		}

		.hand {
			z-index: 88;
			width: 44rpx;
			height: 51rpx;
		}

		.circle {
			position: absolute;
			top: 17%;
			left: 35%;
			z-index: 77;
			width: 30rpx;
			height: 28rpx;
		}

		.handAnimation {
			//手势
			animation: displacement 2.5s infinite;
			animation-timing-function: linear;
		}

		.circleAnimation {
			//圆
			animation: circle-show 2.5s infinite;
			animation-timing-function: linear;
		}
	}
</style>
