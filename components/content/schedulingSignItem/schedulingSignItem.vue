<template>
	<view>
		<ecan-modal-input ref="ecanModal" title="请填写外勤原因" @onConfirm="onPopConfirm"></ecan-modal-input>
		<!-- 上班 -->
		<view class="item-box">
			
			<view class="contain"  v-if="schedulingObject.nothing">
				<view class='item-title'>
					 
					<text class="work-title">今日无班次</text>
				</view>
			</view>

			<view class="contain" v-if="schedulingObject.scheduling_name">
				<view class='item-title'>
					<image src="/static/timecard/scheduling-calendar.png" mode="" class="icon"></image>
					<text class="work-title"> {{schedulingObject.scheduling_name}} 打卡</text>
				</view>
				
				<view class="work-time">
					上班时间 
					<text v-if="isWaiqin==false">{{schedulingObject.begin_time}}</text> 
					<text :class="signInClass">{{signInResult}}</text>
				</view>
				<view class="tip" v-if="schedulingObject.sign_begin_time!=null">
					打卡时间:{{schedulingObject.sign_begin_time}}
				</view>
				<view class="tip" v-else>
					未打卡
				</view>
				<view class="tip-loc" v-if="schedulingObject.sign_begin_place!=null">
					{{schedulingObject.sign_begin_place}}
				</view>
				<view class="tip-loc" v-else>
					<br/>
				</view>
			</view>

			<br/>

			<view class="contain"   v-if="schedulingObject.scheduling_name">
				<view class="work-time">
					下班时间 <text v-if="isWaiqin==false">{{schedulingObject.end_time}}</text><text :class="signOutClass">{{signOutResult}}</text>
				</view>
				<view class="tip" v-if="schedulingObject.sign_end_time!=null">
					打卡时间:{{schedulingObject.sign_end_time}}
				</view>
				<view class="tip" v-else>
					未打卡
				</view>
				<view class="tip-loc" v-if="schedulingObject.sign_end_place!=null">
					{{schedulingObject.sign_end_place}}
				</view>
				<view class="tip-loc" v-else>
					<br/>
				</view>
			</view>
			<view class="clock-in-box" @tap="signMethod" :animation="animationDataTop"  v-if="schedulingObject.scheduling_name">
				<!-- 蓝色边框，配合变大动画 -->
				<view class="boder-circle" :animation="animationDataTopCircle"></view>
				<!-- 按钮背景 -->
				<image src="/static/timecard/btn_bg.png" mode="" class="btn-bg"></image>
				<!-- 手势 -->
				<image src="/static/timecard/scheduling-sign.png" mode="" class="hand" >
				</image>
				<view class="circle">打卡</view>
				
			</view>
		</view>

		 
			
	</view>
</template>

<script>
	import hrUrl from "@/common/hrReqConst.js"
	import ecanModalInput from "@/components/common/ecan-modal-with-input/ecan-modal-with-input.vue"
	import { dataUrlToBase64,pathToBase64, base64ToPath } from "@/common/image_tools.js"
	function sendSchedulingStatus(__this){
		//发送本排班状态
		let scObj={};
		scObj.scheduling_id=__this.schedulingObject.scheduling_id;
		scObj.scheduling_name=__this.schedulingObject.scheduling_name;
		let tmpStatus="nothing";
		let hasIn=false;
		let hasOut=false;
		let tmpStatusMap={
			"normal":1,"warning":2,"error":3
		}
		if(__this.signInClass){
			hasIn=true;
			tmpStatus=__this.signInClass.split("-")[2];
		}
		scObj.status=tmpStatus;
		if(__this.signOutClass){
			hasOut=true;
			let tmpOutStatus=__this.signOutClass.split("-")[2];
			if(tmpStatusMap[tmpOutStatus]>tmpStatusMap[tmpStatus]){
				tmpStatus=tmpOutStatus;
			}
		}
		if(!hasIn||!hasOut){
			tmpStatus="nothing";
		}
		scObj.status=tmpStatus;
		
		uni.$emit("receiveSchedulingStatusObj",scObj);
	};
	function checkSignStatus(type,signTime,__this){
		let tmpExistStatus=__this.schedulingObject.status;
		 
		if(type=='signIn'){
			
			if(tmpExistStatus&&!signTime){//证明已经结算但是没签到
				__this.signInClass="sign-result-error";
				__this.signInResult="缺卡";
				 
			}else if(!signTime){
				
			}else{
				 
				let tmpBeginTime=__this.schedulingObject.scheduling_time+" "+__this.schedulingObject.begin_time+":00";
				tmpBeginTime = tmpBeginTime.replace(/-/g,':').replace(' ',':');
				tmpBeginTime = tmpBeginTime.split(':');
				tmpBeginTime=new Date(tmpBeginTime[0],(tmpBeginTime[1]-1),tmpBeginTime[2],tmpBeginTime[3],tmpBeginTime[4],tmpBeginTime[5]);
				
				let tmpSignTime=signTime;
				tmpSignTime = tmpSignTime.replace(/-/g,':').replace(' ',':');
				tmpSignTime = tmpSignTime.split(':');
				tmpSignTime=new Date(tmpSignTime[0],(tmpSignTime[1]-1),tmpSignTime[2],tmpSignTime[3],tmpSignTime[4],tmpSignTime[5]);
				let chidaoSec=(tmpSignTime.getTime()-tmpBeginTime.getTime())/1000;
				let signInResult="在岗";
				if(chidaoSec>0&&!__this.isWaiqin){//迟到
					let chidaoHour=parseInt(chidaoSec/3600);
					let chidaoMinute=parseInt( (chidaoSec-(chidaoHour*3600))/60   );
					let chidaoSecond=parseInt( (chidaoSec-(chidaoHour*3600)-(chidaoMinute*60))   );
					signInResult="迟到";
					if(chidaoHour>0){
						signInResult+=(chidaoHour+"时");
					}
					if(chidaoMinute>0){
						signInResult+=(chidaoMinute+"分");
					}
					if(chidaoSecond>0){
						signInResult+=(chidaoSecond+"秒");
					}
					__this.signInClass="sign-result-warning";
				}else{//正常
					__this.signInClass="sign-result-normal";
				}
				 
				__this.signInResult=signInResult;
				
				if(!__this.schedulingObject.sign_begin_place&&__this.place){
					__this.schedulingObject.sign_begin_place=__this.place;
				}
			}
			 
			
		}else{
			 
			if(tmpExistStatus&&!signTime){//证明已经结算但是没签到
				__this.signOutClass="sign-result-error";
				__this.signOutResult="缺卡";
				 
			}else if(!signTime){
				
			}else{
				 
				/*计算是否早退*/
				let ar=__this.schedulingObject.begin_time.split(":");
				let br=__this.schedulingObject.end_time.split(":");
				let ahour=parseInt(ar[0]);
				let bhour=parseInt(br[0]);
				let kuatian=ahour>bhour;//跨天的话，开始时间从数字上来说会大于结束时间
				let tmpEndTime=__this.schedulingObject.scheduling_time+" "+__this.schedulingObject.end_time+":00";
				 
				tmpEndTime = tmpEndTime.replace(/-/g,':').replace(' ',':');
				tmpEndTime = tmpEndTime.split(':');
				tmpEndTime=new Date(tmpEndTime[0],(tmpEndTime[1]-1),tmpEndTime[2],tmpEndTime[3],tmpEndTime[4],tmpEndTime[5]);
				 
				if(kuatian==true){
					 
					tmpEndTime.setTime(tmpEndTime.getTime()+86400000);
				}
				let tmpSignTime=signTime;
				tmpSignTime = tmpSignTime.replace(/-/g,':').replace(' ',':');
				tmpSignTime = tmpSignTime.split(':');
				tmpSignTime=new Date(tmpSignTime[0],(tmpSignTime[1]-1),tmpSignTime[2],tmpSignTime[3],tmpSignTime[4],tmpSignTime[5]);
			 
				 
				let zaotuiSec=(tmpEndTime.getTime()-tmpSignTime.getTime())/1000;
				let signOutResult="正常签退";
				
				if(zaotuiSec>0&&!__this.isWaiqin){//早退
					let zaotuiHour=parseInt(zaotuiSec/3600);
					let zaotuiMinute=parseInt( (zaotuiSec-(zaotuiHour*3600))/60   );
					let zaotuiSecond=parseInt( (zaotuiSec-(zaotuiHour*3600)-(zaotuiMinute*60))   );
					signOutResult="早退";
					if(zaotuiHour>0){
						signOutResult+=(zaotuiHour+"时");
					}
					if(zaotuiMinute>0){
						signOutResult+=(zaotuiMinute+"分");
					}
					if(zaotuiSecond>0){
						signOutResult+=(zaotuiSecond+"秒");
					}
					__this.signOutClass="sign-result-warning";
				}else{//正常
					__this.signOutClass="sign-result-normal";
				}
				 
				__this.signOutResult=signOutResult;
				if(!__this.schedulingObject.sign_end_place&&__this.place){
					__this.schedulingObject.sign_end_place=__this.place;
				}
			}
			
		}
		sendSchedulingStatus(__this);
	};
	export default {
		data() {
			return {
				initDone:false,
				
				place:null,
				distance:null,
				maxDistance:null,
				wifiMac:null,
				iosWifiInfo:null,
				allowFlag:false,
				signInResult:'',
				signOutResult:'',
				signInClass:'',
				signOutClass:'',
				photoFile:null,
				isSignIn: false, // 是否签到了
				isSignOut: false,
				animationDataTop: {}, // 签到
				animationDataDown: {}, // 签退
				animationDataTopCircle: {},
				animationDataDownCircle: {},
				out_reason:""
			}
		},props: { //此处定义传入的参数
            signNeedPhoto:{
				type:[Boolean,String],
				default:false
			},
			schedulingObject: {
			    type: Object
			},
			loadInfo: {
				type: Object
			},
			isWaiqin: {
				type: [Boolean,String],
				default:false
			},
			 isXiaxiang:{
				 type: [Boolean,String],
				 default:false
			 }
        },
		components:{
			ecanModalInput
		}, 
		methods: {
			signMethod(){
				if(!this.initDone){
					uni.showToast({
						title: '读取数据中，请稍后...',
						icon:'none',
						duration: 2000
					});
					return false;
				}
				
				if(this.isWaiqin&&!this.isSignIn){
					 
					this.$refs.ecanModal.isHidden = !this.$refs.ecanModal.isHidden;
				}else{
					
					this.beforeSignCheck();
				}
			},
			onPopConfirm(e){
				if(e){
					this.out_reason=e;
					this.beforeSignCheck();
				}
				return false;
			},
			//桥接所需代码
			setupWebViewJavascriptBridge(callback) {
			
				if (window.WebViewJavascriptBridge) {
					return callback(WebViewJavascriptBridge);
				}
				if (window.WVJBCallbacks) {
					return window.WVJBCallbacks.push(callback);
				}
				window.WVJBCallbacks = [callback];
				var WVJBIframe = document.createElement('iframe');
				WVJBIframe.style.display = 'none';
				WVJBIframe.src = 'https://__bridge_loaded__';
				document.documentElement.appendChild(WVJBIframe);
				setTimeout(function() {
					document.documentElement.removeChild(WVJBIframe)
				}, 0)
			},
			
			//call原生
			callOBJ(dic,callback) {
			
				this.setupWebViewJavascriptBridge(function(bridge) {
					bridge.callHandler('ObjC Echo', dic, function responseCallback(responseData) {
						// responseCallback(data);
						callback(responseData);
					})
				})
			} ,
		 
			beforeSignCheck(){
				var _this=this;
				uni.hideLoading();
				if(!(this.isWaiqin)&&this.wifiMac!=null&&this.wifiMac!=''&&this.wifiMac!='null'){
					
					try{
						let plat=uni.getSystemInfoSync().platform;
						let wifiObj="";
						if(plat=='ios'){
							let dic={
								type:'getWifiInfo'
							};
							if(this.iosWifiInfo==null){
								uni.showLoading({title: 'IOS获取WIFI信息中',mask:true});
								this.callOBJ(dic,function(iosObj){
									_this.iosWifiInfo=iosObj.wifiInfo; 
								});
								setTimeout(function() {
									_this.beforeSignCheck();
								}, 10)
								return false;
							}else{
								wifiObj=JSON.parse(this.iosWifiInfo);
								this.iosWifiInfo=null;
							}
							
							
						}else{
							wifiObj=JSON.parse(window.appMethod.getWifiInfo());
						}
						//尝试获取当前机器的WIFI地址
						
						let winfo=wifiObj.BSSID;
						let wifiName=wifiObj.SSID;
						let thisWifiArr=this.wifiMac.split(",");
						if( this.wifiMac.indexOf(winfo)==-1 ||winfo==''){
							let showTitle=''+wifiName+'['+winfo+']';
							if(wifiName==''&&winfo==''){
								showTitle='非WIFI';
							}
							uni.showToast({
								title: '当前WIFI('+showTitle+')不正确,无法打卡',
								icon:'none',
								duration: 5000
							});
							return false;
						}
					}catch(e){
						uni.showToast({
							title: '无法获取当前连接WIFI信息,无法打卡(请尝试更新应用)',
							icon:'none',
							duration: 5000
						});
						return false;
					}
				}
				this.totalSign();
			},
			totalSign(){
				 let _this=this;
				 let tmpAllowFlag=true;
				 if(parseFloat(this.distance)>parseFloat(this.maxDistance)){
				 	tmpAllowFlag=false;
				 }
				  
				if(!tmpAllowFlag&&!(this.isWaiqin)){
					uni.showToast({
						title: '当前地点无法打卡,距离'+(this.distance?this.distance:'未知')+'米,最大打卡距离为'+this.maxDistance+'米',
						icon:'none',
						duration: 2500
					});
					return false;
				}
				 
				
				
				let tmpContent="签到";
				if(this.isSignIn==true){
					tmpContent="签退";
				}
				let reasonTip="";
				if((this.isWaiqin||this.isXiaxiang)&&!this.isSignIn){
					reasonTip="理由:"+this.out_reason;
				}
				if(this.signNeedPhoto==1&&this.photoFile==null){
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['camera'],   //album 从相册选图，camera 使用相机
						success: function (res) {
							let path=res.tempFilePaths[0];
							let fname=res.tempFiles[0].name;
							let ftype=res.tempFiles[0].type;
							 
							uni.getImageInfo({
								src: path,
								success(res) {
									let originWidth = res.width; //图片原始宽
									let originHeight = res.height; //图片原始高
									let maxWidth = 2000;
									let maxHeight = 2000;
									let img = new Image()
									img.src = res.path
									let canvas = document.createElement('canvas');
									let ctx = canvas.getContext('2d')
									// 目标尺寸
									let targetWidth = originWidth;
									let targetHeight = originHeight;
									if (originWidth > maxWidth || originHeight > maxHeight) {
										if (originWidth / originHeight > maxWidth / maxHeight) {
											// 更宽，按照宽度限定尺寸
											targetWidth = maxWidth;
											targetHeight = Math.round(maxWidth * (originHeight / originWidth));
										} else {
											targetHeight = maxHeight;
											targetWidth = Math.round(maxHeight * (originWidth / originHeight));
										}
									}
									canvas.width = targetWidth
									canvas.height = targetHeight 
									// 图片压缩
									ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
									// canvas对图片进行缩放 0.3是我定义的图片质量，
									let base64 = canvas.toDataURL(ftype, 0.3);
										//将base64转换为filel流，
									 
									uni.hideLoading()
									uni.showLoading({
										title: "照片较大，压缩上传中..."
									});
									uni.request({
										url: hrUrl,
										method: 'post',
										dataType:'json',
										 header: {
												'content-type': 'application/x-www-form-urlencoded'
											  },
										data: {'hrpId': _this.loadInfo.hrpId,
											   'hrpPwd':_this.loadInfo.hrpPwd,
											   'hrpUnitId': _this.loadInfo.hrpUnitId,
											   'authDate':_this.loadInfo.authDate,
											   'orgNo':_this.loadInfo.orgNo,
											   'context':_this.loadInfo.context,
											   'codeBlockName':"hr_util_uploadFileFromHex",
											   'params':'{"compress":"300", "is_base64":"true", "hex":"'+dataUrlToBase64(base64)+'","fileName":"'+fname+'"}'
											  },
										success: res => {
											_this.photoFile=res.data.data.fileId;
											_this.totalSign();
										},
										fail: () => {
											uni.showToast({
												title: '上传失败，请联系管理员',
												icon:'none',//不要图标
												duration: 1000//1后消失
											});
										}, 
										complete: () => {uni.hideLoading();}
									});
									
							 
								},
								fail() {
									uni.showModal({
										title: '提示',
										content: '图片压缩失败',
										showCancel: false
									});
								}
							})
							
							
							
							 
							  
							  
							  
						}
					}); 
					
					return false;
				}
				uni.showModal({
					cancelText: "取消", // 取消按钮的文字  
					confirmText: "确认", // 确认按钮文字 
					title: '打卡提示',
					content: '是否'+tmpContent+'班次['+this.schedulingObject.scheduling_name+']?'+reasonTip,
					confirmColor:'#3B8BFF',
					cancelColor:'#222222',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: "操作中"
							});
							 let signURL="hr_app_schedulingSign";
							 if(_this.isWaiqin){
								 signURL="hr_app_schedulingWaiqinSign";
							 }else if(_this.isXiaxiang){
								 signURL="hr_app_schedulingXiaxiangSign";
							 }
							uni.request({
								url: hrUrl,
								method: 'GET',
								dataType:'json',
								data: {'hrpId': this.loadInfo.hrpId,
								       'hrpPwd':this.loadInfo.hrpPwd,
									   'hrpUnitId': this.loadInfo.hrpUnitId,
									   'authDate':this.loadInfo.authDate,
									   'orgNo':this.loadInfo.orgNo,
									   'context':this.loadInfo.context,
									   'codeBlockName':signURL,
									   'params':'{"scheduling_detail_guid":"'+this.schedulingObject.scheduling_detail_guid+'","scheduling_id":"'+this.schedulingObject.scheduling_id+'","place":"'+this.place+'","is_out":"'+this.isWaiqin+'","out_reason":"'+this.out_reason+'","sign_photo":"'+this.photoFile+'"}'
									  },
								success: res => {
									 
									uni.showToast({
										title: res.data.data.message,
										icon:'none',//不要图标
										duration: 1000//1后消失
									});
									
									
									if(!this.isSignIn){
										 
										this.schedulingObject.sign_begin_time=res.data.data.sign_time;
										this.isSignIn=true;
										checkSignStatus("signIn",res.data.data.sign_time,this);
										
									}else{
										 
										this.schedulingObject.sign_end_time=res.data.data.sign_time;
										this.isSignOut=true;
										checkSignStatus("signOut",res.data.data.sign_time,this);
									}
									 
								},
								fail: () => {
									uni.showToast({
										title: '打卡失败，请联系管理员',
										icon:'none',//不要图标
										duration: 1000//1后消失
									});
								}, 
								complete: () => {uni.hideLoading();_this.photoFile=null;}
							});
						} else if (res.cancel) {
							// 取消
							_this.photoFile=null; 
						}
					}
				});
				
			},
			
			
			
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
		created() {
			 
			uni.$on('schedulingMapEmitAddress',placeObj=>{
				this.initDone=true;
										this.distance=placeObj.distance;
							            this.place=placeObj.place;
										this.allowFlag=placeObj.allowFlag;
										this.maxDistance=placeObj.max_distance; 
										this.wifiMac=placeObj.wifiMac;
						})
		},
		 
		mounted() {
			
			
			let animation = uni.createAnimation({
				duration: 400,
				timingFunction: 'linear',
			})
			this.animation = animation
			 
			if(this.schedulingObject.sign_begin_time){
				this.isSignIn=true;
				
			}
			checkSignStatus("signIn",this.schedulingObject.sign_begin_time,this);
			if(this.schedulingObject.sign_end_time){
				this.isSignOut=true;
				
			}
			checkSignStatus("signOut",this.schedulingObject.sign_end_time,this);
			 
			
			//uni.$emit("recalculateMap","null");
			sendSchedulingStatus(this);
			
//			sign-result-warning
			 
			
		}
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
		height: 660rpx;
		display: block;
		justify-content: space-between;
		align-items: center;
		padding-left: 20rpx;
		padding-right: 20rpx;
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
				width: 54rpx;
				height: 42rpx;
				margin-top:10rpx;
			}
			
			.item-title{
				margin:10px 0;
				display: flex;
				align-items: center;
			}
			
			.work-title {
				font-size: 38rpx;
				font-weight: bold;
				color: #333333;
				//line-height: 70rpx;
			    padding-left: 10rpx;
				text {
					margin-left: 30rpx;
				}
			}

			.work-time {
				font-size: 30rpx;
				font-weight: bold;
				color: #333333;
				//line-height: 70rpx;

				text {
					margin-left: 30rpx;
				}
			}
			
			.sign-result-normal {
				font-size: 26rpx;
				background: #00c700; 
				color: #FFFFFF;
				border-radius: 6rpx;
				padding-left: 10rpx;
				padding-right: 10rpx;
			}
			.sign-result-warning {
				font-size: 26rpx;
				background: #ffa008; 
				color: #FFFFFF;
				border-radius: 6rpx;
				padding-left: 10rpx;
				padding-right: 10rpx;
			}
			.sign-result-error {
				font-size: 26rpx;
				background: #dc0000; 
				color: #FFFFFF;
				border-radius: 6rpx;
				padding-left: 10rpx;
				padding-right: 10rpx;
			}

			.tip {
				font-size: 26rpx;
				color: #999999;
				line-height: 70rpx;
			}
			.tip-loc {
				font-size: 26rpx;
				color: #999999;
				line-height: 25rpx;
			}
		}

	}

	.clock-in-box {
		margin:auto;
		margin-top: 20rpx;
		//margin-left: 37%;
		position: relative;
		width: 175rpx;
		height: 175rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 3rpx solid #CFECFF;
		box-shadow: 0px 10rpx 20rpx 0px rgba(238, 238, 238, 0.5);
		border-radius: 50%;

		.boder-circle {
			position: absolute;
			z-index: 55;
			width: 170rpx;
			height: 170rpx;
			border-radius: 50%;
			border: 4rpx solid #CFECFF;
			box-shadow: 0px 10rpx 20rpx 0px rgba(238, 238, 238, 0.5);
		}

		.btn-bg {
			position: absolute;
			z-index: 66;
			width: 175rpx;
			height: 175rpx;
		}

		.hand {
			z-index: 88;
			width: 61rpx;
			height: 60rpx;
			position: absolute;
			top: 17%;
			//left: 32%;
			
		}

		.circle {
			position: absolute;
			bottom: 25%;
			left: 32%;
			z-index: 77;
			width: 120rpx;
			height: 28rpx;
		
			color: #ffffff;
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
