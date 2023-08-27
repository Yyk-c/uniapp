<template>
	<view >
		<view v-if="1>2"   v-for="(item,i) in nodes" :key="i" class="uni-flex uni-row" style="margin: 0 10%;">
			 <view :class="'text uni-flex '+nodeClass(i)" style="width: 20px; height: 30px; justify-content: center; align-items: center;" >
				 {{i}} 
			 </view>
			 <view class="uni-flex uni-column" style="flex: 1 1 0%; justify-content: space-between;">
				  
				 <view class="text" style="flex: 1 1 0%;">
					 {{item.nodeName}}
				 </view>
			 </view>
		</view>
		
		<view v-if="1>2" class="step-line-one" v-for="(item,i) in nodes" :key="i">
		    <view class="step-bar">
		      <view :class="'step-bar-dot '+nodeClass(i)"></view>
		      <view :class="'step-bar-line '+nodeClass(i+1)" v-if="i<nodes.length-1"></view>
		    </view>
		    <view class="step-content">
		      <view class="step-content-title">{{ item.nodeName }}</view>
			  
		      <view  class="uni-flex uni-row" style="margin: 0 10%;">
		      	 
		      	 <view class="cardlist-content-desc">
		      		  <view class="text cardlist-content-desc-label"  >
		      		  		      			 {{item.nodeName}}
		      		  </view>
		      		 <view class="text cardlist-content-desc-label" >
		      			 {{item.nodeName}}
		      		 </view>
		      	 </view>
		      </view>
		    </view>
		</view> 
		
		<view class="cardlist step-line-one" v-for="(item, i) in nodes" :key="i"    >
			<view class="step-bar">
			  <view :class="'step-bar-dot '+nodeClass(i)"></view>
			  <view :class="'step-bar-line '+nodeClass(i+1)" v-if="i<nodes.length-1"></view>
			</view>
			<view class="cardlist-content"  >
				<view class="cardlist-content-title">
					<view>{{item.operateTime}}</view>
					<view style="margin-top: 10px;color:#2288ff;font-size: 17px;">{{item.nodeName}}</view>
				</view>
				<view class="cardlist-content-desc"  >
					<view class="cardlist-content-desc-label">
						<span style="min-width:112rpx">操作人：</span>
						<span >{{item.operator}}</span>
					</view>
					<view class="cardlist-content-desc-browse" style="text-align: left;">
						<span >结果：</span> 
						<span :style="'color:'+formatColor(item.result)">{{item.result}}</span>
					</view>
					
				</view>
				<view class="cardlist-content-desc" >
					<view class="cardlist-content-desc-label">
						<span >审批意见：</span>
						<span >{{item.opinion}}</span>
					</view>
				</view>
				<view class="cardlist-content-desc" v-if="item.caPic">
					<view class="" style="display: flex;">
						<span style="padding:12px 0;">CA签名：</span>
						<button size="mini" style="line-height: 3;" @click="showCA(item)">查看签名</button>
					</view> 
				</view>
				 
			</view>
		</view>
		  
		  
	</view>
</template>

<script>
	import hrUrl from "@/common/hrReqConst.js"
	export default {
		name: 'TaskRecords',
		data() {
			return {
				nodes:[],
				baseInfo:{}
			}
		},
		props:{
			bussinessid:{
				type:String,
				default:''
			},
			proins: {
				type: String,
				default: ''
			},
			loadInfo: {
				type: Object,
				defalut: {}
			}
		},
		created() {
			
			 
			console.log("created!",this.loadInfo,this.proins);
			 
			this.$nextTick(() => {
				this.getNodes();
			});
		},
		methods: {
			showCA(node){
				uni.previewImage({
					urls:[node.caPic],
					complete() {
						setTimeout(function(){
							var kk=document.getElementsByClassName("image-view-img")[0]
							kk.style['background-color']='white'   
						},100)
						
					}
				})
				
				
			},
			reload(){
				this.getNodes();
			},
			formatColor(result){
				if(result==null||result==undefined){result='';}
				if(result=='通过'){
					return 'green';
				}else if(result.indexOf('终止')!=-1){
					return 'red'
				}else{
					return 'black'
				}
			},
			nodeClass( index ){
				var node=this.nodes[index];
				var classArr=['node-now','node-finish','node-not-finish'];
				var classIndex=2;
				return classArr[1];
				if(node==undefined){
					return classArr[2];
				}
				
				if(node.itemType=='complete'){
					classIndex=1;
				}
				let lastIndex=this.nodes.length-1;
				for(var i=0;i<this.nodes.length;i++){
					if(this.nodes[i].itemType!='complete'){
						lastIndex=i;
						break;
					}
				}
				if(lastIndex==this.nodes.length-1){
					classIndex=1;
				}
				else if(index==lastIndex){
					classIndex=0;
					 
				}
				return classArr[classIndex];
			},
			shortTxt(txt){
				let length=35;
				if(txt==null||txt==undefined||txt==''){return '';}
				if(txt.length>length){
					return txt.substring(0,length-3)+'...';
				}
				return txt;
			},
			solveNodes(nodes){
				 
				return nodes.filter((x)=>x.itemType=='complete');
			},
			getNodes(){
				var _this=this;
				var nodeParam={
					processinstance:this.proins,
					bussinessid:this.bussinessid
				};
				uni.request({
					url: hrUrl,
					method: 'POST',
					dataType: 'json',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						'hrpId': this.loadInfo.hrpId,
						'hrpPwd': this.loadInfo.hrpPwd,
						'hrpUnitId': this.loadInfo.hrpUnitId,
						'authDate': this.loadInfo.authDate,
						'orgNo': this.loadInfo.orgNo,
						'context': this.loadInfo.context,
						'codeBlockName': 'hrp_getApprovalRecord',
						'params': JSON.stringify(nodeParam)
					},
					success: res => {
						if (res) {
							let m = res.data.data ;
							if(m ){
								_this.nodes=_this.solveNodes(m);
							}else{
								uni.showToast({
									title: '流程节点获取失败',
									icon: 'none',
									duration: 2500
								});
							}
							 
						} else {
							uni.showToast({
								title: '流程节点获取失败',
								icon: 'none',
								duration: 2500
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '流程节点获取失败',
							icon: 'none',
							duration: 2500
						});
					},
					complete: () => {
						 
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import url("../../../common/uni.css");
	.node-now {
		background-color: orange!important;
	}
	.node-finish {
		background-color: dodgerblue!important;
	}
	.node-not-finish {
		background-color: #b0b0b0!important;
	}
	
.text {
    margin: 7px 5px;
    padding: 0 10px;
    background-color: #ebebeb;
    height: 35px;
    line-height: 35px;
    text-align: center;
    color: #777;
    font-size: 13px;
}

.cardlist {
		display: flex;
		padding: 10px;
		margin-bottom: 10px;
		border-radius: 5px;
		//background: rgba(0,0,0,0.2);
		 
		box-shadow: 0 0 5px 1px rgba(0,0,0,  0.1);
		
		.cardlist-content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-left: 40rpx;
			 
			width: 100%;
		    
			.cardlist-content-title {
				font-size: 28rpx;
				color: #333333;
				font-weight: 400;
	        }
			
			.cardlist-content-desc {
				display: flex;
				justify-content: space-between;
				font-size: 28rpx;
				margin-top: 15px;
				
				.cardlist-content-desc-label {
					display: flex;
					flex: 1 1 0%;
					.cardlist-content-desc-label-item {
	                    padding: 0 5px;
	                    border-radius: 15px;
	                    color: #FFFFFF;
	                }
				}
				.cardlist-content-desc-browse {
					flex: 1 1 0%;
				}
	        }
		}
	}

.step-content {
  margin-left: 24px;
 
  &-title {
    font-weight: 700;
  }
  &-content {
    margin: 10px 0;
    color: #b0b0b0;
	white-space: nowrap;
	overflow-x: auto;
  }
}
 
.step-bar {
  position: relative;
}
.step-bar-dot {
  width: 14px;
  height: 15px;
  border-radius: 50%;
  background-color: #1777ff;
  position: absolute;
  left: 0;
  top: 3px;
  z-index: 100;
}
.step-bar-line {
	display:none;
  width: 3px;
  height: 165px;
  background-color: #1777ff;
  position: absolute;
  left: 6px;
  top: 7px;
} 


</style>
