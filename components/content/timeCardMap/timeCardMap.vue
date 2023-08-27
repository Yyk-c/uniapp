<template>
	<view class="map-show">
		<view class="map1">
			<map id="mapshow" :scale="18" :latitude="latitude" :longitude="longitude" />
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
	export default {
		data() {
			return {
				compassLa: '26.108476',
				compassLo: '119.268951',
				latitude: '',
				longitude: '',
				currentAddress: '',
				distance: ''
			}
		},
		methods: {
			calculateDistance(lo, la) { //计算距离
				let point1 = new plus.maps.Point(this.compassLo, this.compassLa); //目的地
				let point2 = new plus.maps.Point(lo, la)
				plus.maps.Map.calculateDistance(point1, point2, (event) => {
					this.distance = event.distance.toFixed(1); // 转换后的距离值
					console.log(this.distance)
				}, function(e) {
					console.log("Failed:" + JSON.stringify(e));
				});
			},
			getLocation(){
				uni.getLocation({
					type: 'gcj02', //国测局坐标
					geocode: 'true', //解析地址信息
					success: (res) => {
						let _this = this
						// 初始定位成功后的赋值操作
						this.latitude = res.latitude
						this.longitude = res.longitude
						let {
							city,
							district,
							street,
							streetNum,
							poiName
						} = res.address
						let currentAddress = city + district + street + streetNum + poiName
						_this.currentAddress = currentAddress
						let mapContext = uni.createMapContext("mapshow", this) //创建并返回 map 上下文 mapContext 对象
						let map = mapContext.$getAppMap() //获取 原生地图对象
						map.showUserLocation(true) // 显示用户位置
						this.calculateDistance(this.longitude,this.latitude)
				
					}
				})
			}
		},
		mounted() {
			this.getLocation()
		}
	}
</script>

<style lang="scss" scoped>
	.map-show {
		width: 100%;
		height: 100%;

		.map1 {
			width: 100%;
			height: 250rpx;
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
		height: 70rpx;
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
			font-size: 26rpx;
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
