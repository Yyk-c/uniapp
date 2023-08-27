<!-- 
ECAN仿WEB 下拉框表格 by:xiaowu
支持代码块查询和静态数据
-->
<template>
	<view class="uni-data-tree">
		<view class="uni-data-tree-input" @click="handleInput">
			<slot :options="options" :data="selected" :error="errorMessage">
				<view class="input-value" :class="{ 'input-value-border': border }">
					<text v-if="errorMessage" class="selected-area error-text">{{ errorMessage }}</text>
					<view v-else-if="loading && !isOpened" class="selected-area">
						<uni-load-more class="load-more" :contentText="loadMore" status="loading"></uni-load-more>
					</view>
					<scroll-view v-else-if="selected.length" class="selected-area" scroll-x="true">
						<view class="selected-list">
							<view class="selected-item" v-for="(item, index) in selected" :key="index">
								<text class="ga">{{ item.text }}</text>
								<text v-if="index < selected.length - 1" class="input-split-line">{{ split }}</text>
							</view>
						</view>
					</scroll-view>
					<text v-else class="selected-area placeholder">{{ placeholder }}</text>
					<view class="arrow-area" v-if="!readonly">
						<view class="input-arrow"></view>
						
					</view>
				</view>
			</slot>
		</view>
		
		<view class="uni-data-tree-cover" v-if="isOpened" @click="handleClose"></view>
		<view class="uni-data-tree-dialog" v-if="isOpened">
			<view class="dialog-caption">
				<view class="title-area">
					<text class="dialog-title">{{ popupTitle }}</text>
				</view>
				<view class="dialog-close" @click="handleClose">
					<view class="dialog-close-plus" data-id="close"></view>
					<view class="dialog-close-plus dialog-close-rotate" data-id="close"></view>
				</view>
			</view>
			<view class="dialog-caption" v-if="openSearch">
				<view class="flex-body" style="width: 90%; ">
					<uni-easyinput
						type="text"
						suffixIcon="search"
						v-model="searchWord"
						placeholder="输入关键字搜索"
						@iconClick="searchClick"
						@confirm="searchClick"
					></uni-easyinput>  
					<button type="default" @click="clear" style="margin-left: 24rpx;height:36px;line-height:36px;">清除选中</button>
				</view>
			</view>
		
			<view class="picker-view" style="overflow-y:auto" v-if="showSearchResult">
				<view v-show="searchResult.length">
					<uni-list-item v-for="(item, index) in searchResult" :key="index" :title="item.text" clickable link @click="clickSearch(item)"></uni-list-item>
				</view>
				<view v-show="!searchResult.length" style="text-align: center;line-height:200px;"><text style="color: #999999">--未发现任何匹配数据，请重新输入--</text></view>
			</view>
		
			<ecanTablePickerDataview ref="pickerView"
			:dataList="dataList" :selected="selected" 
			:loading="dataViewLoading"
			@change="handleNodeClick"  style="text-align: left;"
			>
				
			</ecanTablePickerDataview>
			
			<view class="footer">
				<view class="page-left">共{{ total }}条记录,每页{{pageSizeLocal}}条</view>
				<view class="page-right">
					<uni-icons class="mini-btn1" color="#666" size="16" type="arrowleft" @click="beforepage()" />
					<span style="vertical-align: top;padding: 0px 5px 0px 5px;"> {{ pageCurrentLocal }}/{{ totalpage }} </span>
					<uni-icons class="mini-btn1" color="#666" size="16" type="arrowright" @click="nextpage()" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import dataPicker from '@/components/common/uni-data-pickerview/uni-data-picker.js';
	import DataPickerView from '@/components/common/uni-data-pickerview/uni-data-pickerview.vue';
	import uniEasyinput from '@/components/common/uni-easyinput/uni-easyinput.vue';
	import uniListItem from '@/components/common/uni-list-item/uni-list-item.vue';
	import uniIcons from '@/components/common/uni-icons/uni-icons.vue';
	import uniPagination from "@/components/common/uni-pagination/uni-pagination"
	import ecanTablePickerDataview from "@/components/common/ecan-table-picker/ecan-table-picker-dataview.vue"
	import hrUrl from "@/common/hrReqConst.js"
	/**
	 * uni-data-picker
	 * @description uni-data-picker
	 * @tutorial https://uniapp.dcloud.net.cn/uniCloud/uni-data-picker
	 * @property {String} popup-title 弹出窗口标题
	 * @property {Array} localdata 本地数据，参考
	 * @property {Boolean} border = [true|false] 是否有边框
	 * @property {Boolean} readonly = [true|false] 是否仅读
	 * @property {Boolean} preload = [true|false] 是否预加载数据
	 * @value true 开启预加载数据，点击弹出窗口后显示已加载数据
	 * @value false 关闭预加载数据，点击弹出窗口后开始加载数据
	 * @property {Boolean} step-searh = [true|false] 是否分布查询
	 * @value true 启用分布查询，仅查询当前选中节点
	 * @value false 关闭分布查询，一次查询出所有数据
	 * @property {String|DBFieldString} self-field 分布查询当前字段名称
	 * @property {String|DBFieldString} parent-field 分布查询父字段名称
	 * @property {String|DBCollectionString} collection 表名
	 * @property {String|DBFieldString} field 查询字段，多个字段用 `,` 分割
	 * @property {String} orderby 排序字段及正序倒叙设置
	 * @property {String|JQLString} where 查询条件
	 * @event {Function} onpopupshow 弹出的选择窗口打开时触发此事件
	 * @event {Function} onpopuphide 弹出的选择窗口关闭时触发此事件
	 *
	 * @property {Array} staticDatas 静态数据
	 * @property {String} queryBlockCode 查询用的代码块名称,例如hr_
	 * @property {String} queryKey 查询时所对应的主键名字，例如hr_emp_info表一般用emp_guid
	 * @property {String} keyAsText 意思是查询出来的结果中把这个key的值复制一份作为text的值
	 * @property {String} keyAsValue 意思是查询出来的结果中把这个key的值复制一份作为value的值
	 * @property {String} queryPlus 查询时额外附加的条件参数
	 * @property {Object} hrpParam HRP用户的数据，用于查代码块时代入
	 * @property {Boolean} multiCheck 是否多选
	 * @property {String} defaultVal 回填值
	 */
	export default {
		name: 'EcanTablePickerTest',
		components: {
			DataPickerView,
			uniEasyinput,
			uniListItem,
			uniIcons,
			uniPagination,
			ecanTablePickerDataview
		},
		props:{
			maxPageSize:{
				type: Number,
				default: 10
			},
			options: {
				type: [Object, Array],
				default() {
					return {};
				}
			},
			defaultVal:{
				type:String,
				default:''
			},
			multiCheck: {
				type:Boolean,
				default: false
			} ,
			staticDatas: {
				type: Array,
				default() {
					return [];
				}
			},
			queryBlockCode: {
				type: String,
				default: ''
			},
			queryKey: {
				type: String,
				default: 'id'
			},
			queryPlus: {
				type: Object,
				default(){
					return {}
				}
			},
			keyAsText: {
				type: String,
				default: ''
			},
			keyAsValue: {
				type: String,
				default: ''
			},
			hrpParam: {
				type: Object,
				default: function(e) {
					return {}
				}
			},
			popupTitle: {
				type: String,
				default: '请选择'
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			heightMobile: {
				type: String,
				default: ''
			},
			readonly: {
				type: Boolean,
				default: false
			},
			border: {
				type: Boolean,
				default: true
			},
			split: {
				type: String,
				default: ','
			},
			openSearch: {
				type: Boolean,
				default: false
			}
		},
		created() {
			this.pageSizeLocal=this.maxPageSize;
			if (this.hrpParam && this.hrpParam.userInfo) {
				let obj = JSON.parse(this.hrpParam.userInfo);
				if (obj) {
					let option = obj.loadInfo;
					this.loadInfo=option;
				}
			} 
			if(this.queryBlockCode!=''||this.staticDatas.length>0){ 
				if(!this.readonly){
					this.queryForData();
				}
	
				if(this.defaultVal!=''){
					this.queryForData({getDefaultVal:true})
				}
			}
	
	
		},
		data() {
			return {
				dataViewLoading:false,
				dataList:[],
				errorMessage:'',
				// 每页数据量
				pageSizeLocal:  10,
				loading: false,
				// 当前页
				pageCurrentLocal: 1,
				pageSizeIndex: 0,
				// 数据总量
				total: 0,
				totalpage: 1,
	
				loadInfo:{},
	
				isOpened: false,
				selected: [],
				searchWord: '',
				showSearchResult: false,
	
				searchDatas: [],
				searchResult: []
			}
		},
		methods: {
	
			// 分页触发
			beforepage(){
				if(this.pageCurrentLocal==1){
					return false;
				}
				this.pageCurrentLocal = this.pageCurrentLocal - 1;
				this.queryForData();
			},
			nextpage(e) {
				var totalpage = this.totalpage;
				if(this.pageCurrentLocal==totalpage || totalpage == 0){
					return false;
				}
				this.pageCurrentLocal = this.pageCurrentLocal+1;
				this.queryForData();
			},
			clear(){
				this.selected=[];
				this._dispatchEvent(this.selected,{});
			},
			searchClick(){
				this.pageCurrentLocal=1;
				this.queryForData()
			},
			queryForData(option){
				if(option==undefined||option==null){
					option={};
				}
				var _this=this;
				var queryParam={
					pageNo:this.pageCurrentLocal,
					pageSize:this.pageSizeLocal,
					keyword:this.searchWord
				};
				if(option.getDefaultVal==true){
					queryParam={
						pageNo:1,pageSize:999,
						mainTableKey:this.keyAsValue,
						mainTableId:this.defaultVal
					};
				}
				 
				queryParam=Object.assign(queryParam,this.queryPlus);
	
				_this.dataViewLoading=true;
				if(this.queryBlockCode!=''){
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
							'codeBlockName': this.queryBlockCode,//'srms_app_getSqdFormDicts',
							'params': JSON.stringify(queryParam)
						},
						success: res => {
							if (res) {
								let m = res.data.data ;
								if(m==undefined){
									m={};
								}
								var result=_this.afterRequestOperate(_this,m,option);
							} else {
								console.log("ECAN下拉框表格查询失败");
							}
						},
						fail: () => {
							console.log("ECAN下拉框表格查询失败");
	
						},
						complete: () => {
							_this.dataViewLoading=false;
						}
					});
	
				}else if(this.staticDatas.length>0){//静态数据
					//手动分页静态数据
					let m={
						rows:[],
						total:0
					};
					if(_this.keyAsText!='' ||_this.keyAsValue!=''){
						for(var ri=0;ri<this.staticDatas.length;ri++){
							if(_this.keyAsText!=''){
								this.staticDatas[ri].text=this.staticDatas[ri][_this.keyAsText]
							}
							if(_this.keyAsValue!=''){
								this.staticDatas[ri].value=this.staticDatas[ri][_this.keyAsValue]
							}
						}
					}
					//首先先得到全部
					 let tmpRows=this.staticDatas;
					 let tmpRows2=[];
					 for(var k=0;k<tmpRows.length;k++){
						var canPush=true;
						var tmpItem=tmpRows[k];
						if(queryParam.keyword&&queryParam.keyword!=''){
							 
							var tmpBool=tmpItem.text.indexOf(queryParam.keyword)!=-1;
							if(tmpBool==false){
								canPush=false;
							}
						}
						if(option.getDefaultVal==true){
							var tmpBool=tmpItem.value==queryParam.mainTableId;
							if(tmpBool==false){
								canPush=false;
							}
						}
						if(canPush==true){
							tmpRows2.push(tmpItem);
							m.total++;
						} 
					 }
					 
					for(var k=(queryParam.pageNo-1)*queryParam.pageSize;k<tmpRows2.length&&m.rows.length<queryParam.pageSize;k++){ 
						m.rows.push(tmpRows2[k]);
					}
					
					
					
					var result=this.afterRequestOperate(_this,m,option);
					this.dataViewLoading=false;
				}
	
			},
			afterRequestOperate(_this,data,option){
				let rows=data.rows;
				let total=data.total;
				if (rows) {
					if(_this.keyAsText!='' ||_this.keyAsValue!=''){
						for(var ri=0;ri<rows.length;ri++){
							if(_this.keyAsText!=''){
								rows[ri].text=rows[ri][_this.keyAsText]
							}
							if(_this.keyAsValue!=''){
								rows[ri].value=rows[ri][_this.keyAsValue]
							}
						}
					}
					if(option.getDefaultVal!=true){
						_this.dataList.length=0;
						_this.dataList=rows;
						 
						if (total) {
							_this.total = total;
							_this.totalpage = parseInt(_this.total/_this.pageSizeLocal); 
							if(_this.totalpage*_this.pageSizeLocal<_this.total){
								_this.totalpage++;
							}
							if(_this.totalpage<1){
								_this.totalpage=1;
							}
						} else {
							_this.total = 0;
							_this.totalpage = 1;
						}
					}else{
						_this.selected=rows;
					}
					return true;
				}else{
					console.log("ECAN下拉框表格查询失败");
					return false;
				}
			},
			handleNodeClick(par){
				var e=par.detail; 
				if(this.multiCheck==false){
					this.hide();
				}
				if(this.selected==null||this.selected==undefined){
					this.selected=[];
				}
				var find=this.selected.filter((x)=> x.value==e.value);
				var deleteIndex=-1;
				for(var i=0;i<this.selected.length;i++){
					if(this.selected[i].value==e.value){
						deleteIndex=i;
						break;
					}
				}
				if(this.multiCheck){ 
					if(deleteIndex>=0){
						this.selected.splice(deleteIndex,1);
					}else{
						this.selected.push(e); 
					}
				}else{
					this.selected.length=0;
					this.selected.push(e);
				}
				
				
				this._dispatchEvent(this.selected,e);
			},
			handleInput() {
				if (this.readonly) {
					return;
				}
				this.show();
			},
			handleClose(e) {
				this.hide();
			},
			hide() {
				this.isOpened = false;
				//this.closeSearchDom();
				
			},
			show(){
				this.isOpened = true;
				//看后面要不要加一个show的时候读取数据
			},
			_dispatchEvent(selected,clickItem) {
				
				var value = new Array(selected.length);
				var clickValue=clickItem.value; 
				for (var i = 0; i < selected.length; i++) {
					value[i] = selected[i].value;
				}
				 
				this.$emit('change', {
					detail: {
						value: value.join(","),
						clickItem: clickItem
						
					}
				});
			}
		}
	}
</script>


<style scoped>
	.flex-body{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: left;
		padding: 10rpx 0 10rpx 20rpx ;
		font-size: 12px;
		background-color: #ffffff;
	}
	.uni-data-tree {
		position: relative;
		font-size: 14px;
	}
	.error-text {
		color: #dd524d;
	}
	.input-value {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: nowrap;
		font-size: 14px;
		line-height: 38px;
		padding: 0 5px;
		overflow: hidden;
		/* #ifdef APP-NVUE */
		height: 40px;
		/* #endif */
	}
	.input-value-border {
		border: 1px solid #e5e5e5;
		border-radius: 5px;
	}
	.selected-area {
		flex: 1;
		overflow: hidden;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
	.load-more {
		margin-right: auto;
		/* #ifdef APP-NVUE */
		width: 40px;
		/* #endif */
	}
	.selected-list {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		padding: 0 5px;
	}
	.selected-item {
		flex-direction: row;
		padding: 0 1px;
		white-space: nowrap;
	}
	.placeholder {
		color: grey;
	}
	.input-split-line {
		opacity: 0.5;
	}
	.arrow-area {
		position: relative;
		margin-left: auto;
		width: 20px;
		display: flex;
		justify-content: center;
		transform: rotate(-45deg);
		transform-origin: center;
	}
	.input-arrow {
		width: 7px;
		height: 7px;
		border-left: 1px solid #999;
		border-bottom: 1px solid #999;
	}
	.uni-data-tree-cover {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
		display: flex;
		flex-direction: column;
		z-index: 100;
	}
	.uni-data-tree-dialog {
		position: fixed;
		left: 0;
		top: 20%;
		right: 0;
		bottom: 0;
		background-color: #ffffff;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		display: flex;
		flex-direction: column;
		z-index: 102;
		overflow: hidden;
		/* #ifdef APP-NVUE */
		width: 750rpx;
		/* #endif */
	}
	.dialog-caption {
		position: relative;
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #f0f0f0;
	}
	.title-area {
		display: flex;
		align-items: center;
		margin: auto;
		padding: 0 10px;
	}
	.dialog-title {
		font-weight: bold;
		line-height: 44px;
	}
	.dialog-close {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 15px;
	}
	.dialog-close-plus {
		width: 16px;
		height: 2px;
		background-color: #666;
		border-radius: 2px;
		transform: rotate(45deg);
	}
	.dialog-close-rotate {
		position: absolute;
		transform: rotate(-45deg);
	}
	.picker-view {
		flex: 1;
		overflow: hidden;
	}
	/* #ifdef H5 */
	@media all and (min-width: 768px) {
	.uni-data-tree-cover {
		background-color: transparent;
	}
	.uni-data-tree-dialog {
		position: absolute;
		top: 100%;
		height: auto;
		min-height: 400px;
		max-height: 50vh;
		background-color: #fff;
		border-radius: 5px;
		box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.3);
	}
	.dialog-caption {
		display: none;
	}
}
/* #endif */
</style>
<style lang="scss" scoped>
	.footer {
		z-index: 888;
		height: 100rpx;
		font-size: 28rpx;
	}
	.page-left{
		width: 35%;
		display: inline-block;
		height: 100rpx;
		line-height: 100rpx;
	    float: left;
		text-align: left;
		vertical-align: middle;
		padding-left: 1em;
	}
	
	.page-right{
		width: 55%;
		display: inline-block;
		height: 100rpx;
		line-height: 100rpx;
	    float: right;
		text-align: right;
		padding-right: 1em;
		vertical-align: middle;
	}
</style>
