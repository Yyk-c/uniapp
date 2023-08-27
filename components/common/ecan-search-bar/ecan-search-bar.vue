<template>
	<view >
		<view class="body2">
			<view class="search-bar" style="display: flex;">
				<view class="search-bar-box" style="margin:auto;width:calc(100% - 60rpx)" v-if="!onlyBtn">
					<input class="search-p-text" type="text" v-model="mainsearch" :placeholder="mainSearchPlaceholder"
					@click="mainsearchClick()" :disabled="disableMainSearch"
					/>
					<icon style="padding: 12rpx;" type="search" @click="searchClick()"></icon>

				</view>
				<view style="margin-left: 20rpx;"></view>
				<view class="select-one" style="margin: initial;" v-if="(!disableMainSearch || onlyBtn)&&searchFields.length>0">
					<text class="" @click="showDiv()">其他筛选</text>
				</view>
			</view>


			<view :hidden="searchHidden">
				<view :hidden="searchHidden" class="popup_content" :style="'height:'+popHeight+';display:grid;overflow-y: hidden;'">
					<view style="margin: 60rpx 20rpx 0 20rpx;">
					<view class="search-bar-box" style="margin-top:18rpx;width:100%;display: none;">


					</view>
					 
					<view :style="'height: calc('+popHeight+' - 33px - 45px);overflow-y:auto;overflow-x:hidden'">
						<ecan-simple-form style="z-index: 9999;"
						ref="form"
						form_type="add"
						:param="hrpParam"
						:fields="searchFields"
						></ecan-simple-form>
					</view>

					<view class="one-row" :style="'width: calc(100% - 20rpx);position: fixed;top: calc('+popHeight+' - 42px);'">
						<!--<button class="search-botton" style="margin-left: 0;" @click="hideDiv()">取消</button>-->
						<button class="search-botton" style="width: 45%;" @click="clearSearch()" type="warn">重置</button>
						<button class="search-botton" style="width: 45%;" @click="searchClick()" type="primary">确认</button>
					</view>
					</view>
				</view>
				<view :hidden="searchHidden" class="popup_overlay" @click="hideDiv()"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import ecanSimpleForm from"@/components/common/ecan-simple-form/ecan-simple-form.vue"
	import uniIcons from "@/components/common/uni-icons/uni-icons.vue"
	export default {
		props:{
			searchFields:{
				type:Array,
				default(){
					return [];
				}
			},
			hrpParam:{
				type:Object,
				default(){
					return {};
				}
			},
			mainSearchPlaceholder:{
				type:String,
				default:'请输入关键词'
			},
			mainSearchKey:{
				type:String,
				default:'keyword'
			},
			disableMainSearch:{
				type:Boolean,
				default:false
			},
			onlyBtn:{
				type:Boolean,
				default:false
			},
			popHeight:{
				type:String,
				default:'50%'
			}
		},
		components:{
			uniIcons,ecanSimpleForm
		},
		name:"ecan-search-bar",
		data() {
			return {
				mainsearch:'',
				searchHidden:true
			};
		},
		methods:{
			$getSearchData(){
				var _this=this;
				var tmpRefData=this.$refs.form.$getDatas();
				var tmpData={};
				if(!this.disableMainSearch){
					tmpData[this.mainSearchKey]=this.mainsearch
				}
				for(var key in tmpRefData){
					tmpData[key]=tmpRefData[key];
				}
				return tmpData;
			},
			$setSearchData(datas){ 
				this.$refs.form.$setDatas(datas);
			},
			mainsearchClick(){
				if(this.disableMainSearch&&this.searchFields.length>0){
					this.showDiv();
				}
			},
			showDiv() {
				this.searchHidden = false;
			},
			hideDiv() {
				this.searchHidden = true;
			},
			clearSearch() {
				this.$refs.form.$clearDatas();
			},
			searchClick() { 
				var tmpData=this.$getSearchData();
				this.$emit('onClickSearch', {
					datas: tmpData
				});
				this.hideDiv();
			}
		}
	}
</script>


<style  lang="scss" scoped>
	//@import '@/common/uni-ui.scss';
	@import url("../../../common/uni.css");
	.search-bar{
		width: 100%;
		height: 7%;
	}
	.search-bar-box{
		display: flex;
		margin: 0 auto;
		margin-left: 15rpx;
		width: 70%;
		height: 70rpx;
		border: none;
		border-radius: 50rpx;
		background-color: #EDEDED;
	}
	.search-p-text{
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		margin-top: 10rpx;
		margin-left: 20rpx;
		font-size: 36rpx;
		color: #7f7f81;
	}
	.select-one {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: auto;
		width: 28%;
		height: 60rpx;
		background-color: white;
		font-size: 32rpx;
		border-radius: 12rpx;

		text-align: center;
	}

	.select-two{
		background: none;
		border: none;
		font-size:15rpx;
		margin: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.popup_content {
		position: fixed;
		top: 0;
		width: 100%;
		height: 36%;
		border: none;
		background-color: white;
		z-index: 891;
		overflow: auto;
	}

	.popup_title {
		width: 480rpx;
		text-align: center;
		font-size: 32rpx;
	}
	.one-row{
		-webkit-flex-direction: row;
		display: flex;
		flex-direction: row;
	}
	.search-botton{
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-size: 30rpx;
		width: 170rpx;
		height: 66rpx;
		//background: none;
		border: 1px solid lightgray;
		padding-left: 0px;
		padding-right: 0px;
	}
	.popup_overlay {
		position: fixed;
		top: 0%;
		left: 0%;
		width: 100%;
		height: 100%;
		background-color: black;
		z-index: 890;
		-moz-opacity: 0.8;
		opacity: .80;
		filter: alpha(opacity=88);
	}

</style>
