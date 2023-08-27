<template>
	<view class="m-input-view">
		<input :focus="focus" :type="inputType" :value="value" @input="onInput" class="m-input-input" :style="{fontSize}"
			:placeholder="placeholder" :password="type==='password'&&!showPassword" @focus="onFocus" @blur="onBlur" />
		<!-- 优先显示密码可见按钮 -->
		<view v-if="clearable&&!displayable&&value &&value.length" class="box">
			<view class="input-icon" @tap="clear" style="opacity: 0.7;">
				<image src="./delete.png" mode=""></image>
			</view>
		</view>
		<view v-if="displayable" class="box">
			<view class="input-icon" @tap="display" style="width: 38rpx; height: 38rpx;">
				<image src="./eye.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			/**
			 * 输入类型
			 */
			type: String,
			/**
			 * 值
			 */
			value: String,
			/**
			 * 占位符
			 */
			placeholder: String,
			/**
			 * 是否显示清除按钮
			 */
			clearable: {
				type: [Boolean, String],
				default: false
			},
			/**
			 * 是否显示密码可见按钮
			 */
			displayable: {
				type: [Boolean, String],
				default: false
			},
			/**
			 * 自动获取焦点
			 */
			focus: {
				type: [Boolean, String],
				default: false
			},
			
			//字体大小
			fontSize: {
				type:String,
				default: '32rpx'
			}
		},
		model: {
			prop: 'value',
			event: 'input'
		},
		data() {
			return {
				/**
				 * 显示密码明文
				 */
				showPassword: false,
				/**
				 * 是否获取焦点
				 */
				isFocus: false
			}
		},
		computed: {
			inputType() {
				const type = this.type
				return type === 'password' ? 'text' : type
			}
		},
		methods: {
			clear() {
				this.$emit('input', '')
			},
			display() {
				this.showPassword = !this.showPassword
			},
			onFocus() {
				this.isFocus = true
			},
			onBlur() {
				this.$nextTick(() => {
					this.isFocus = false
				})
			},
			onInput(e) {
				this.$emit('input', e.detail.value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.m-input-view {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex: 1;
		padding-left: 32rpx;
		font-size: 32rpx;
		.m-input-input {
			width: 86%;
			height: 100%;
			line-height: inherit;
		}
	}

	.box{
		width: 10%;
		height: 100%;
		display: flex;
		align-items: center;
		.input-icon {
			width: 32rpx;
			height: 32rpx;
			position: relative;
			image {
				position: absolute;
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
