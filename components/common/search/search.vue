<template>
	<view class="search" :style="{ backgroundColor: backgroundColor }">
		<view class="content" :style="{ 'border-radius': radius + 'px', border: border }">
			<view class="content-box" :class="{ center: mode === 2 }">
				<text class="icon icon-search">&#xe61c;</text>
				<input class="input" :class="{ center: !active && mode === 2 }" :focus="isFocus"
					:placeholder="placeholder" v-model="inputVal" @focus="focus" @blur="blur" />
				<text v-if="isDelShow" class="icon icon-del" @tap="clear">&#xe644;</text>
			</view>
			<view v-show="(active && show && button === 'inside') || (isDelShow && button === 'inside')"
				class="searchBtn" @tap="search">搜索</view>
		</view>
		<view v-if="button === 'outside'" class="button" :class="{ active: show || active }" @tap="search">
			<view class="button-item">{{ !show ? searchName : '搜索' }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			mode: {
				type: Number,
				default: 1
			},
			button: {
				type: String,
				default: 'outside'
			},
			show: {
				type: Boolean,
				default: true
			},
			radius: {
				type: String,
				default: '60'
			},
			placeholder: {
				type: String,
				default: '请输入搜索内容'
			},
			backgroundColor: {
				type: String,
				default: '#fff'
			},
			border: {
				type: String,
				default: '1px #f5f5f5 solid'
			}

		},
		data() {
			return {
				active: false,
				inputVal: '',
				searchName: '取消',
				isDelShow: false,
				isFocus: false
			};
		},
		methods: {
			focus() {
				this.active = true;
			},
			blur() {
				this.isFocus = false;
				if (!this.inputVal) {
					this.active = false;
				}
			},
			clear() {
				this.inputVal = '';
				this.active = false;
				this.$emit('search', '');
			},
			getFocus() {
				this.isFocus = true;
			},
			search() {
				if (!this.inputVal) return;
				this.$emit('search', this.inputVal);
			}
		},
		watch: {
			inputVal(newVal) {
				if (newVal) {
					this.searchName = '搜索';
					this.isDelShow = true;
				} else {
					this.searchName = '取消';
					this.isDelShow = false;
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.search {
		display: flex;
		width: 100%;
		height: 100rpx;
		box-sizing: border-box;
		padding:  18rpx 0rpx;
		font-size: $uni-font-size-base;

		.content {
			display: flex;
			align-items: center;
			width: 100%;
			height: 60rpx;
			border: 1px #ccc solid;
			background-color: #F4F4F4;
			overflow: hidden;
			transition: all 0.2s linear;
			border-radius: 32rpx;

			.content-box {
				width: 100%;
				display: flex;
				align-items: center;

				&.center {
					justify-content: center;
				}

				.icon {
					margin-left: 20rpx;
					margin-right: 20rpx;

					&.icon-del {
						font-size: 38rpx;
					}
				}

				.input {
					width: 100%;
					max-width: 100%;
					line-height: 64rpx;
					height: 64rpx;
					transition: all 0.2s linear;
					font-size: 26rpx;

					&.center {
						width: 200rpx;
					}

					&.sub {
						// position: absolute;
						width: auto;
						color: grey;
					}
				}
			}

			.searchBtn {
				height: 100%;
				flex-shrink: 0;
				padding: 0 30rpx;
				background: $uni-color-success;
				line-height: 60rpx;
				color: #fff;
				border-left: 1px #ccc solid;
				transition: all 0.3s;
			}
		}

		.button {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			flex-shrink: 0;
			width: 0;
			transition: all 0.2s linear;
			white-space: nowrap;
			overflow: hidden;

			&.active {
				padding-left: 15rpx;
				width: 100rpx;
			}
		}
	}

	@font-face {
		font-family: 'iconfont';
		src: url('https://at.alicdn.com/t/font_989023_efq0mtli526.ttf') format('truetype');
	}

	.icon {
		font-family: iconfont;
		font-size: 26rpx;
		font-style: normal;
		color: #999;
	}
</style>
