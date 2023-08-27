<template>
	<view class="bottom">
		<view class="nav-box">
			<view class="nav-tab" @tap="toIndex(0)" :class="{'active-text':navIndex===0}">
				<view class="nav-icon">
					<image src="../../../static/tabbarIcon/home_active.png" mode="" 
					v-if="navIndex===0" :class="{'active-nav':navIndex===0}"></image>
					<image src="../../../static/tabbarIcon/home.png" mode="" v-else></image>
				</view>
				<view class="nav-text">
					首页
				</view>
			</view>
			<view class="nav-tab" @tap="toIndex(1)" :class="{'active-text':navIndex===1}">
				<view class="nav-icon">
					<image src="../../../static/tabbarIcon/communication_active.png" mode="" 
					v-if="navIndex===1" :class="{'active-nav':navIndex===1}"></image>
					<image src="../../../static/tabbarIcon/communication.png" mode="" v-else></image>
				</view>
				<view class="nav-text">
					通讯录
				</view>
			</view>

			<view class="nav-tab" @tap="toIndex(2)" :class="{'active-text':navIndex===2}">
				<view class="nav-icon" >
					<image class="mindle-icon"  src="../../../static/tabbarIcon/timecard_active.png" mode="" 
					:class="{'active-middle':navIndex===2}"></image>
					<!-- <image src="../../../static/tabbarIcon/timecard.png" mode="" v-else></image> -->
				</view>
				<view class="nav-text">
					考勤
				</view>
			</view>
			<view class="nav-tab" @tap="toIndex(3)" :class="{'active-text':navIndex===3}">
				<view class="nav-icon">
					<image src="../../../static/tabbarIcon/workbench_active.png" mode="" 
					v-if="navIndex===3" :class="{'active-nav':navIndex===3}"></image>
					<image src="../../../static/tabbarIcon/workbench.png" mode="" v-else></image>
				</view>
				<view class="nav-text">
					工作台
				</view>
			</view>
			<view class="nav-tab" @tap="toIndex(4)" :class="{'active-text':navIndex===4}">
				<view class="nav-icon">
					<image src="../../../static/tabbarIcon/profile_active.png" mode="" 
					v-if="navIndex===4" :class="{'active-nav':navIndex===4}"></image>
					<image src="../../../static/tabbarIcon/profile.png" mode="" v-else></image>
				</view>
				<view class="nav-text">
					我的
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		components: {},
		data() {
			return {
			}
		},
		computed: {
			...mapState(["navIndex"])
		},
		methods: {
			...mapMutations(["changeNavIndex"]),
			toIndex(index) {
				this.changeNavIndex(index)
				switch (this.navIndex) {
					case 0:
						uni.reLaunch({
							url: "/pages/communication/communication"
						})
						break;
					case 1:
						uni.reLaunch({
							url: "/pages/message/message"
						})
						break;
					case 2:
						uni.reLaunch({
							url: "/pages/timecard/timecard"
						})
						break;
					case 3:
						uni.reLaunch({
							url: "/pages/workbench/workbench"
						})
						break;
					case 4:
						uni.reLaunch({
							url: "/pages/profile/profile"
						})
						break;
				}

			}
		},
		mounted() {
			
		}
	}
</script>

<style scoped lang="scss">
	// 圆显现
	@keyframes active-normal{
		0% {
			transform: translate(-24rpx,-12rpx) scale(1);
		}
		100% {
			transform: translate(-24rpx,-12rpx) scale(1.5);
		}
	}
	
	// mindle-special
	@keyframes active-special{
		0% {
			transform:  translateX(-50%)  scale(0.5);
		}
		100% {
			transform: translateX(-50%)  scale(1);
		}
		// 100% {
		// 	transform: translateX(-26rpx) scale(1);
		// }
	}
	
	.bottom {
		position: fixed;
		z-index: 66;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 98rpx;
		box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.06);
		background: #fff;
		z-index: 10;
		font-family: PingFang SC;
		font-weight: 500;
	}
	.nav-box {
		display: flex;
		width: 100%;
		box-sizing: border-box;

		.nav-tab {
			fiex: 1;
			text-align: center;
			width: 100%;
			height: 98rpx;
			font-size: 22rpx;
			color: #99A1B0;
			.nav-icon {
				position: relative;
				width: 100%;
				height: 58rpx;

				& image {
					position: absolute;
					bottom: 6rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 48rpx;
					height: 48rpx;
					z-index: 99;
				}
				.mindle-icon {
					transform: translateX(-50%);
					bottom: 6rpx ;
					width: 72rpx !important;
					height: 72rpx !important;
					z-index: 99;
				}
			}

		}
	}
	
	.active-nav { // 一般tabbar活跃动画
		animation: active-normal 0.2s;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}
	.active-middle { // 中间tabbar活跃动画
		animation: active-special 0.2s;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}
	
	.active-text {  //活跃字色
		color: #3274F6 !important;
	}
</style>
