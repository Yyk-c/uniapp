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
		
		<view class="step-line-one" v-for="(item,i) in nodes" :key="i">
		    <view class="step-bar">
		      <view :class="'step-bar-dot '+nodeClass(i)"></view>
		      <view :class="'step-bar-line '+nodeClass(i+1)" v-if="i<nodes.length-1"></view>
		    </view>
		    <view class="step-content">
		      <view class="step-content-title">{{ item.nodeName }}</view>
		      <view class="step-content-content"> -{{item.operator}} </view>
		    </view>
		  </view> 
	</view>
</template>

<script>
	import hrUrl from "@/common/hrReqConst.js"
	export default {
		name: 'TaskNodes',
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
			reload(){
				this.getNodes();
			},
			nodeClass( index ){
				console.log("get class");
				var node=this.nodes[index];
				var classArr=['node-now','node-finish','node-not-finish'];
				var classIndex=2;
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
				if(index==lastIndex){
					classIndex=0;
					if(node.nodeName=='结束'){
						classIndex=1;
					}
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
				var start={
					easyNode:true,
					"nodeName": "开始",
					"itemType": "complete"  
				};
				var end={
					easyNode:true,
					"nodeName": "结束",
					"itemType": "unComplete"  
				};
				
				let endResult=nodes[nodes.length-1]?nodes[nodes.length-1].itemType:'unComplete';
				end.itemType=endResult;
				nodes.splice(0,0,start);
				nodes.push(end);
				return nodes;
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
						'codeBlockName': 'hrp_getApprovalNode',
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
  width: 3px;
  height: 60px;
  background-color: #1777ff;
  position: absolute;
  left: 6px;
  top: 7px;
} 
</style>
