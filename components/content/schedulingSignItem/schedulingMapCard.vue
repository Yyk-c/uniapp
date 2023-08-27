<template>
	<view class="map-show">
		<view class="map1">
			<map id="mapshow" :markers="markers" :scale="18" :latitude="latitude" :longitude="longitude" :circles="circles"/>
		</view>

		<view class="address">
			<image src="../../../static/timecard/location_icon.png" mode=""></image>
			<view class="currentAddress">
				{{currentAddress.length ? currentAddress : "正在定位中..."}}
			</view>
		</view>
		<view class="distance" v-if="distance.length!=0">
			距离您{{distance}}m
		</view>
	</view>
</template>

<script>
	import QQMapWX from "@/common/qqmap-wx-jssdk.js"
	import hrUrl from "@/common/hrReqConst.js"
	//#ifdef H5  
	import $ from '@/common/jquery.min.js'  
	       
	    //#endif
	export default {
		data() {
			return {
				//compassLa: '22.166451',
				//compassLo: '111.783274',
				//compassLa: '26.108476',
				//compassLo: '119.268951',
				latitude: '',
				longitude: '',
				currentAddress: '',
				distance: '',
				markers:[],
				circles:[]
			}
		},
		props:{
			compassLa :{
				type: String
			},
			compassLo :{
				type:String
			},
			sign_scope :{
				type:Number
			},loadInfo: {
				type: Object
			},
			 app_wifi_mac:{
				 type:String
			 }
		},
		methods: {
			calculateDistance(lo, la) { //计算距离
			/*使用手动计算*/
			let lat1=this.compassLa;
			let lng1=this.compassLo;
			let lat2=la;
			let lng2=lo;
			 
			let radLat1 = lat1*Math.PI / 180.0;
			let radLat2 = lat2*Math.PI / 180.0;
			let a = radLat1 - radLat2;
			let  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
			let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
			Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
			s = s *6378.137 ;// EARTH_RADIUS;
			s = Math.round(s * 1000);
			let tmpPlace=this.currentAddress;
			let allowFlag=true;
			if(s.toFixed(1)>parseFloat(this.sign_scope)){
				allowFlag=false;
			 
			}
			if(la&&this.circles.length<1){
				this.circles.push({
					latitude:this.compassLa,
					longitude:this.compassLo,
					radius:10,
					fillColor:'#64a8ce99'
				});
			}
			if(this.circles.length>0){
				var tmpRd=parseInt(this.sign_scope);
				if(tmpRd>9999999){tmpRd=0;}
				this.circles.splice(0,1,{
					latitude:this.compassLa,
					longitude:this.compassLo,
					radius:tmpRd,
					fillColor:'#64a8ce99'
				})
			}
			 
			
			uni.$emit("schedulingMapEmitAddress",{
				place:tmpPlace,distance:s.toFixed(1),
				allow:allowFlag,
				max_distance:parseFloat(this.sign_scope),
				wifiMac:this.app_wifi_mac
			});
			/*
				let point1 = new plus.maps.Point(this.compassLo, this.compassLa); //目的地
				let point2 = new plus.maps.Point(lo, la)
				plus.maps.Map.calculateDistance(point1, point2, (event) => {
					this.distance = event.distance.toFixed(1); // 转换后的距离值
					 
					 let tmpPlace=this.currentAddress;
					 
					if(event.distance.toFixed(1)>this.sign_scope){
						tmpPlace="";
					 
					}
					
					 
					uni.$emit("schedulingMapEmitAddress",tmpPlace);
				}, function(e) {
					 
					uni.$emit("schedulingMapEmitAddress",null);
				});
				*/
			},
			
			getLocation(){
				
				
				this.calculateDistance(this.longitude,this.latitude)
				
				
				
				
			}
		},
		 

		created() {
			 
			/*uni.$on('recalculateMap',place=>{
							 
							            this.getLocation()
						})*/
			uni.$on('receiveNewLocation',data=>{
							 
							            this.latitude=data.latitude;
										this.longitude=data.longitude;
										this.currentAddress=data.address;
										let tmpMarker={
											id:1,
											latitude:data.latitude,
											longitude:data.longitude,
											rotate:data.rotate,
											title:'我的位置',
											anchor:{
												x:0.5,
												y:0.5
											},
											iconPath:'../../../../../static/timecard/navigate_up.png'
										};
										this.markers=[tmpMarker];
										this.getLocation();
						})			
		},
		mounted() {
			/*let vm = this
			
			let tmpMap=uni.createMapContext('mapshow', this)
			vm.map = tmpMap
			*/
		   let option = this.loadInfo;
		   this.hrpId = option.hrpId;
		   this.hrpPwd = option.hrpPwd;
		   this.hrpUnitId =option.hrpUnitId;
		   this.authDate=option.authDate;
		   this.orgNo=option.orgNo;
		   this.context=option.context;
		   
		   
			//this.getLocation()
		}
	}
</script>

<style lang="scss" scoped>
	.map-show {
		width: 100%;
		height: 100%;

		.map1 {
			width: 100%;
			height: 85%;//250rpx;
			border-radius: 16rpx;
			overflow: hidden;
			map {
				width: 100%;
				height: 100%;
			}
			
		}
	}

	.address {
		width: 100%;
		height: 16%;//70rpx;
		display: flex;
		align-items: center;
		font-family: PingFang SC;
		font-weight: 500;

		&>image {
			width: 32rpx;
			height: 32rpx;
			margin-right: 16rpx;
		}

		.currentAddress {
			flex: 1;
			font-size: 24rpx;
			color: #333333;
			line-height: 30rpx;
		}
	}
	
	.distance {
		font-size: 26rpx;
		color: #999999;
		line-height: 26rpx;
		margin-left: 46rpx;
	}
</style>
