<template>
	<view class="uni-data-pickerview">
		<scroll-view class="selected-area" scroll-x="true" scroll-y="false" :show-scrollbar="false">
			<view class="selected-list">
				<view class="selected-item selected-item-ontop selected-item-active"  v-if="selected.length<1" >
					<text class="">请选择</text>
				</view>
				<view class="selected-item selected-item-ontop" :class="{'selected-item-active':isChecked(item)}" v-for="(item,index) in selected" :key="index" v-if="item.text" @click="handleSelect(index)">
					<text class="">{{item.text}}</text>
				</view>
			</view>
		</scroll-view>
		<view class="tab-c">
			<scroll-view class="list"  :scroll-y="true">
				<view class="item" :class="{'is-disabled': !!item.disable}"  v-for="(item, i) in dataList" :key="i" @click="handleNodeClick(item )">
					<text class="item-text">{{item.text}}</text>
					<view class="check" v-if="isChecked(item)"></view>
				</view>
			</scroll-view>
			<view class="loading-cover" v-if="loading">
				<uni-load-more class="load-more" :contentText="loadMore" status="loading"></uni-load-more>
			</view>
			<view class="error-message" v-if="errorMessage">
				<text class="error-text">{{errorMessage}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from"@/components/common/uni-load-more/uni-load-more.vue"
	export default {
		components:{
			uniLoadMore
		},
		name: 'EcanTablePickerDataview',
		props:{
			loading:{
				type:Boolean,
				default:false
			},
			dataList:{
				type: Array,
				default: function(){
					return [];
				}
			},
			selected:{
				type: Array,
				default: function(){
					return [];
				}
			},
			errorMessage:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				loadMore:{contentdown: '上拉显示更多',
						contentrefresh: '正在加载...',
						contentnomore: '没有更多数据了'}
			}
		},
		methods: {
			 
			isChecked(item){
				return this.selected.filter((x)=>x.value==item.value).length>0;
			},
			handleNodeClick(item){
				console.log("emit",item);
				this._dispatchEvent(item);
			},
			_dispatchEvent(clickItem) {
				 
				this.$emit('change', {
					detail: clickItem
				});
			}
		}
	}
</script>


<style lang="scss" scoped>
	.uni-data-pickerview {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		overflow: hidden;
		height: 100%;
	}

	.error-text {
		color: #DD524D;
	}

	.loading-cover {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.5);
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		z-index: 1001;
	}

	.load-more {
		/* #ifndef APP-NVUE */
		margin: auto;
		/* #endif */
	}

	.error-message {
		background-color: #fff;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		padding: 15px;
		opacity: 0.9;
		z-index: 102;
	}

	/* #ifdef APP-NVUE */
	.selected-area {
		width: 750rpx;
	}

	/* #endif */
	.selected-list {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: nowrap;
		padding: 0 5px;
		border-bottom: 1px solid #f8f8f8;
	}


	.selected-item {
		margin-left: 10px;
		margin-right: 10px;
		//padding: 12px 0;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		/* #endif */
	}
	.selected-item-ontop {
		padding: 12px 0;
	}

	.selected-item-active {
		border-bottom: 2px solid #007aff;
	}

	.selected-item-text {
		color: #007aff;
	}

	.tab-c {
		position: relative;
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		overflow: hidden;
	}

	.list {
		flex: 1;
	}

	.item {
		padding: 12px 15px;
		border-bottom: 1px solid #f0f0f0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.is-disabled {
		opacity: 0.5;
	}

	.item-text {
		flex: 1;
		color: #333333;
	}

	.check {
		margin-right: 5px;
		border: 2px solid #007aff;
		border-left: 0;
		border-top: 0;
		height: 12px;
		width: 6px;
		transform-origin: center;
		/* #ifndef APP-NVUE */
		transition: all 0.3s;
		/* #endif */
		transform: rotate(45deg);
	}
</style>