<template>
	<view >
		<view class="ant-modal-mask"  :hidden="isHidden"></view>
		<view  class="prompt-box" style="position: fixed;" :hidden="isHidden">
			<view class="prompt-content contentFontColor">
				<view class="prompt-title">{{title}}</view>
				
				<input class="prompt-input" type="text" @input="_input" :placeholder="placeholder" :value="contentPop"/>
				<view class="prompt-btn-group">
					<button class="btn-item prompt-cancel-btn contentFontColor" @tap="_cancel">取消</button>
					<button class="btn-item prompt-certain-btn" @tap="_confirm">确定</button>
				</view>
			</view>
				
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				isHidden:true,
				contentPop:''
			}
		},
		methods: {
			_confirm() { //确认
				if(!this.contentPop||this.contentPop == '') {
					uni.showToast({
						title: '不能为空！',
						icon: 'none',
						duration: 1000
					})
					this.contentPop = ''
					
				} else {
					this.isHidden = true
				}
				this.$emit("onConfirm",this.contentPop);
				this.contentPop = ''
			},
			_cancel() {  //取消
				this.contentPop = ''
				this.isHidden = true			  
			},
			_input(e){
							//将参数传出去，这样在getInput函数中可以通过e去获得必要的参数
							//this.triggerEvent("getInput",e.detail);
				 this.contentPop = e.detail.value;
		    }
		},
		props:{
			
			title:{
				type:String,
				default:'提示'
			},
			placeholder:{
				type:String,
				default:'请输入'
			}
		}
	}
</script>

<style>
	.ant-modal-mask {
	    position: fixed;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    z-index: 1000;
	    height: 100%;
	    background-color: rgba(0,0,0,.45);
	    filter: alpha(opacity=50);
	}
.prompt-box {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  /*background: rgba(0, 0, 0, 0.5);*/
}

.prompt-content {
  position: absolute;
  left: 50%;
  top: 40%;
  width: 80%;
  max-width: 600rpx;
  border: 2rpx solid #ccc;
  border-radius: 10rpx;
  box-sizing: bordre-box;
  transform: translate(-50%, -50%); 
  overflow: hidden;
  background: #fff;
}

.prompt-title {
  width: 100%;
  padding: 20rpx;
  text-align: center;
  font-size: 40rpx;
  border-bottom: 2rpx solid gray;
}
.prompt-input{
  margin: 8%;
  padding: 10rpx 15rpx;
  width: 80%;
  height:85rpx;
  border: 1px solid #ccc;
  border-radius: 10rpx;
}
.prompt-btn-group{
  display: flex;
}

.btn-item {
  width: 35%;
  margin-bottom: 20rpx;
  height: 100rpx;
  line-height: 100rpx;
  background-color: white;
  justify-content: space-around;
}
.prompt-certain-btn{
  color: white;
  background-color: #4FEBDE;
}
.prompt-cancel-btn{
  border: 1px solid #4FEBDE;
}
.contentFontColor {
  color: #868686;
}
.prompt-text{
	margin-top:15rpx;
	font-size:38rpx;
}
</style>
