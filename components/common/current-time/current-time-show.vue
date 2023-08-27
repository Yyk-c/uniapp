<template>
	<view class="current-time">
		{{currentTime}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentTime: null ,//显示的时间
				timer: null
			}
		},
		methods:{
			// 时间格式化
			formatTime(fmt) {
				let date = new Date(fmt);
				let o = {
					h: date.getHours(), //小时
					m: date.getMinutes(), //分
					s: date.getSeconds() //秒
				};
				
				return (
					(o.h < 10 ? '0' + o.h : o.h) +
					':' +
					(o.m < 10 ? '0' + o.m : o.m) +
					':' +
					(o.s < 10 ? '0' + o.s : o.s)
				);
			},
		},
		created() {
			clearInterval(this.timer);
			this.timer = setInterval(() => {
				this.currentTime = this.formatTime(new Date())
			}, 1000);
		}
	}
</script>

<style lang="scss" scoped>
	.current-time {
		width: 100%;
		height: 100%;
		line-height: 90rpx;
		font-size: 72rpx;
		font-family: PingFang-SC-Bold;
		font-weight: bold;
		color: #FFFFFF;
	}
</style>
