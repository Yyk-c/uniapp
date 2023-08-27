<template>
	<view class="node-ul-parent">
		<view class="node-li" v-for="(item,index) in arrayList" :key="index">
			<view class="node-border"></view>
			<view class="node-Name" @tap="changeState(item)">
				<view class="node-item" v-if="item.pid==0||!item.type" >
					<view class="icon">
						<image :src="item.isShow?picMap['folderOpen']:picMap['folderClose']" :class="true ? 'rt45' : ''"
							mode="widthFix" class="left-icon">
						</image>
					</view>
					<text class="txt">{{item.name}}</text>
				</view>
				
				<view class="node-item" v-else>
					<view class="icon">
						<image :src="_getIcon(item)" :class="true ? 'rt45' : ''" mode="scaleToFill" class="left-icon1"
							 ></image>
						
						
					</view>					
					<text class="txt1">{{item.name}}</text>
					 
					<text class="txt2" style="margin-top: 20px;">{{item.date}}</text>
				</view>				
			</view>
			<view class="node-ul">
				<tree-node :dataList="item.children" v-if="sonNodeIf(item)"
				@onClickItem="_onClickItem" @onGetIcon="_getIcon"
				></tree-node>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'treeNode',
		componentName: 'treeNode',
		props: {
			dataList: {
				type: Array,
				default: []
			},
			picMap: {
				type: Object,
				default: function() { return {
					"folderOpen":"../../../static/thumbs-icon/folderOpen.png",
					"folderClose":"../../../static/thumbs-icon/folderClose.png",
					"doc":"../../../static/thumbs-icon/DOC.png",
					"docx":"../../../static/thumbs-icon/DOC.png",
					"pdf":"../../../static/thumbs-icon/PDF.png",
					"xsl":"../../../static/thumbs-icon/XSL.png",
					"xlsx":"../../../static/thumbs-icon/XSL.png",
					"ppt":"../../../static/thumbs-icon/XSL.png",
					"global":"../../../static/thumbs-icon/GLOBAL.png"
					}
				} 
			}
		},
		mounted() {
			this.arrayList = this.dataList 
		},
		data() {
			return {
				arrayList: [] 
			}
		},
		methods: {
			_getIcon(item){
				 
				if(Object.keys(item).indexOf("overrideResult")!=-1){
					this.$emit("onGetIcon",  item  );
					 
					return this.picMap[item.overrideResult]?this.picMap[item.overrideResult]:this.picMap['global']
				}else{
					var emitParam={
						item:JSON.parse( JSON.stringify(item) ),
						overrideResult:this.picMap[item.type]?item.type:'global'
					};
					 
					this.$emit("onGetIcon",  emitParam  );
					 
					return this.picMap[emitParam.overrideResult]?this.picMap[emitParam.overrideResult]:this.picMap['global'];
				}
				
				 
				
			},
			sonNodeIf(item){
				var tmp=item.children;
				return tmp&&tmp.length > 0 && item.isShow;
			},
			changeState(e) {
				 
				this._onClickItem(e);
				if(e.pid==0||!e.type){
					 
					let isShow = !e.isShow
					this.$set(e, 'isShow', isShow)
				}
				
			},
			_onClickItem(e){
				this.$emit("onClickItem", JSON.parse( JSON.stringify(e) ));
			}
		}
	}
</script>

<style lang="scss">

	.node-ul-parent {
		margin: 0;
		padding: 0 0 0 20rpx;
	}

	.node-ul {
		margin: 0;
		padding: 0 0 0 60rpx;
	}

	.node-ul .node-li,
	.node-ul-parent .node-li {
		list-style: none;
		position: relative;
	}

	/* #ifdef MP */
	.node-ul:first-child>.node-li::before {
		border: 1rpx solid #007AFF;
	}

	/* #endif */

	/* #ifndef MP */
	.node-ul:first-child>.node-li::before {
		border: none;
	}

	/* #endif */

	.node-ul .node-li:before {
		position: absolute;
		content: '';
		top: 30rpx;
		left: -20rpx;
		width: 20rpx;
		height: 1rpx;
		border-bottom: 1rpx solid #707070;
	}

	.node-ul .node-li:not(:last-child)::after {
		position: absolute;
		content: '';
		top: -18rpx;
		left: -20rpx;
		bottom: -50rpx;
		border-left: 1rpx solid #707070;
	}

	.node-ul .node-li:first-child .node-border {
		position: relative;
	}

	.node-ul .node-li:first-child .node-border::after {
		position: absolute;
		content: '';
		height: 50rpx;
		top: -18rpx;
		left: -20rpx;
		bottom: 0rpx;
		border-left: 1rpx solid #707070;
	}

	.node-Name {
		width: 400rpx;
		height: 60rpx;
		line-height: 60rpx;
		padding-left: 25rpx;
		display: flex;
		// border: 1rpx solid #000;
		margin: 20rpx 0;
		border-radius: 15rpx;

		// .icon {

		// 	padding: 0 10rpx 0 0;
		// }

		.left-icon {
			width: 70rpx;
			height: 70rpx;
			margin-bottom: 10rpx;
			margin-right: 20rpx;
		}
		.node-item{
			display: flex;
		}
		
		.left-icon1 {
			width: 40rpx;
			height: 40rpx;
			margin-top: 10rpx;
			margin-bottom: 10rpx;
			margin-right: 20rpx;
		}
		.txt1 {
			line-height: 60rpx;
			font-size: 30rpx;
			color: #222;
			word-break: break-all;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			/* 这里是超出几行省略 */
			overflow: hidden;
		}
		.txt2{
			font-size: 24rpx;
			color: #999;
			position: absolute;
			right: 30upx;
		}
		
	}
	.txt {
		line-height: 90rpx;
		font-size: 30rpx;
		color: #222;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		/* 这里是超出几行省略 */
		overflow: hidden;
	}
</style>
