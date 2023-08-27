<template>
	<view class="info">

		<view class="tip">
			<view class="left">
				全部类型及状态
			</view>
			<view class="right" @tap="popupHandle">
				<image src="../../../static/workbench/selectIcon.png" mode=""></image>
				<text>筛选</text>
			</view>
		</view>

		<scroll-view scroll-y="true" class="scroll">
			<view v-for="(item,index) in applyList" :key="index">
				<apply-item :applyItem="item"></apply-item>
			</view>
		</scroll-view>
		
		<uni-fab ref="fab" :pattern="pattern" :content="content" horizontal="right" vertical="bottom" direction="horizontal"
		 @trigger="trigger" @fabClick="fabClick" />
	</view>
</template>

<script>
	import applyItem from '@/components/content/approval/apply-item.vue'
	import uniFab from '@/components/common/uni-fab/uni-fab.vue'
	export default {
		data() {
			return {
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
				},
				content: [{
						text: '组件',
						active: false
					},
					{
						text: 'API',
						active: false
					},
					{
						text: '模版',
						active: false
					}
				],
				popupShow: false
			}
		},
		props: {
			applyList: {
				type: Array,
				required: true
			},
		},
		components: {
			applyItem,
			uniFab,
		},
		methods: {
			trigger(e) {
				console.log(e)
				this.content[e.index].active = !e.item.active
				uni.showModal({
					title: '提示',
					content: `您${this.content[e.index].active ? '选中了' : '取消了'}${e.item.text}`,
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定')
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			fabClick() {
				uni.showToast({
					title: '点击了悬浮按钮',
					icon: 'none'
				})
			},
			popupHandle() {
				this.$emit('applyPop')
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	.tip {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 30rpx;
		padding-right: 30rpx;
		height: 88rpx;
		background-color: #F8F8F8;

		.left {
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #999999;
		}

		.right {
			display: flex;

			image {
				width: 24rpx;
				height: 24rpx;
				margin: auto;
			}

			&>text {
				margin-left: 12rpx;
				height: 88rpx;
				line-height: 88rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #666666;
			}
		}
	}

	.scroll {
		height: calc(100vh - 264rpx);
	}
</style>
