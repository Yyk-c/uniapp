<!--
ECAN通用表单
将各种常见的表单组件引入
外部只需传入需要的字段，以及字段类型等
就能生成一个通用的表单页面
20230328-加入表格控件

-->
<template>
	<view>
		<view v-if="showContent">
				<view class=" "  v-for="(item, i) in fields" :key="i" @click="nowField(item)"
				:style="'display: flex;width:100%;'+(item.hide==true?'display:none;':'')"
				>

					<!-- 如果是html或者编辑器，则需要分两行展示-->
					<view v-if="item.type=='textarea'||item.type=='html'||item.type=='table'" class="uni-form-item " style="display: block;" >
						<view class="uni-form-item uni-row ">
							<view scroll-x="true" class="simple-title form-title" style="margin-left:12px;font-weight: bold;">
								  {{item.label}}<span v-if="item.notnull" style="color:red">*</span>
							</view>
						</view>
						<view class="uni-form-item uni-row  each-line">
							<view  v-if="item.type=='html'" class="uni-form-item" style="margin: 0 5%;color: darkgray;">
								 <rich-text :nodes="cdata[item.key]"></rich-text>
								<!-- 目前这里只能看，不能编辑富文本 -->
							</view>
							<view  v-else-if="item.type=='textarea'" class="uni-form-item" style="margin: 0 5%;color: darkgray;">

								<textarea  :disabled="checkDisabled(item)" @input="bindValueChange" :maxlength="item.maxLength?parseInt(item.maxLength):500"
								class="form-right-value" style="text-align: left;" :name="item.key" v-model="cdata[item.key]" :placeholder="'请输入'+item.label" />

							</view>
							<view v-else-if="item.type=='table'"  style="width:100%">
								<button v-if="!checkDisabled(item)" type="primary" @click="addTableRow(item)" style="flex:auto;margin-bottom:12px;margin-left: 24rpx;height: 36px;margin-right:10px;line-height: 36px;width:88px;">
									<uni-icons type="plus" size="18" color="white" style="padding-right:6px"></uni-icons>添加
								</button>
								 
								<view class="uni-form-item">
									<ecan-zb-table v-if="comboCreate(item.key)"
									    :isShowLoadMore="false"
									    :highlight="true"
									    :show-header="true"
									    :columns="item.columns"
									    :fit="false" 
									    :row-key="item.row_key?item.row_key:'id'" 
										:permissionBtn="item.permissionBtn"
										@editFunc="item.editFunc"
										@delFunc="item.delFunc"
									    :ref="'table'+item.key" 
									    :border="true" 
									    :data="cdata[item.key]?cdata[item.key]:[]"></ecan-zb-table>
									
								</view>
								
							
							</view>	
						</view>
					</view>
					<view v-else class="uni-form-item  uni-row each-line" >
						<view class="simple-title form-title" style="font-weight: bold;">  {{item.label}}<span v-if="item.notnull" style="color:red">*</span></view>
						<!-- 遍历类型 -->
						<view v-if="item.type=='input'"  class="form-right-value">
							<input class="fix-line-high"
							:disabled="checkDisabled(item)" @input="bindValueChange"
							:name="item.key" v-model="cdata[item.key]" :placeholder="checkDisabled(item)?'':'请输入'+item.label" />
						</view>
						<view v-if="item.type=='inputnumber'"  class="form-right-value">
							<input class="fix-line-high"  
							:disabled="checkDisabled(item)" @input="bindTypeInputChange($event,'number',item)"
							:name="item.key" v-model="cdata[item.key]" :placeholder="checkDisabled(item)?'':'请输入'+item.label" />
						</view>
						<view v-else-if="item.type=='number'"  class="form-right-value">
							<uni-number-box style="display: inline-flex;" class="number-box"  @input="bindValueChange"
								:min="item.min?item.min:0" :max="item.max?item.max:100"  
								:defaultVal="0"  :disabled="checkDisabled(item)"
								v-model="cdata[item.key]" />
						</view>
						<radio-group v-else-if="item.type=='radio'" :name="item.key" class="form-right-value"
						:disabled="checkDisabled(item)"
						 :value="cdata[item.key]?cdata[item.key]:''"

						 @change="bindValueChange">
							<label v-for="(dic,di) in item.dics" :key="di">
								<radio :disabled="checkDisabled(item)"
								:checked="(cdata[item.key]?(cdata[item.key]==dic.value):false)"
								:value="dic.value" /><text>{{dic.label}}</text>
							</label>
						</radio-group>
						<checkbox-group v-else-if="item.type=='checkbox'" :name="item.key" class="form-right-value"
						 :disabled="checkDisabled(item)"
						:value="cdata[item.key]?cdata[item.key]:''"

						@change="bindValueChange">
							<label v-for="(dic,di) in item.dics " :key="di">
								<checkbox :disabled="checkDisabled(item)"
								:checked="(cdata[item.key]?(getCheckboxSplit(cdata[item.key]).indexOf(dic.value)!=-1):false)"
								:value="dic.value" /><text>{{dic.label}}</text>
							</label>

						</checkbox-group>
						<view v-else-if="item.type=='combo'" class="form-right-value" style="display: grid;justify-content: end;" >
							<uni-data-picker  :style="'max-width:'+windowWidth/2+'px;'"  :placeholder="checkDisabled(item)?'':'请选择'" :popup-title="'请选择'+item.label" :localdata="item.dics"
							:openSearch="true"  :value="cdata[item.key]?cdata[item.key]:''"
							:defaultVal="cdata[item.key]?cdata[item.key]:''" :staticDatas="item.staticDatas"
							:hrpParam="param" :ref="'combo'+item.key" v-if="comboCreate(item.key)"
							:queryBlockCode="item.codeblock" :keyAsText="item.textkey" :keyAsValue="item.valuekey"
							:readonly="checkDisabled(item)" :border="false"
							:queryPlus="item.queryPlus" 
							 @change="bindComboChange">
							</uni-data-picker>
						</view>
						<view v-else-if="item.type=='webdate'" class="form-right-value">
							<uni-date-picker :border="false" v-model="cdata[item.key]"
							:disabled="checkDisabled(item)" :placeholder="'请选择'+item.label"
							@change="bindValueChange"
							>
							</uni-date-picker>
						</view>
						<view v-else-if="item.type=='webdateandtime'" class="form-right-value">
							<uni-datetime-picker :border="false" v-model="cdata[item.key]"
							type="datetime"   :ref="'webdateandtime'+item.key"
							:disabled="checkDisabled(item)" :placeholder="'请选择'+item.label"
							@change="bindValueChange"
							>
							</uni-datetime-picker>
						</view>
						<view v-else-if="item.type=='date'" class="form-right-value">
							<picker mode="date" v-model="cdata[item.key]" :start="getDateRangeForPicker(item.yearRange?(-1*item.yearRange):'start')" :end="getDateRangeForPicker(item.yearRange?(item.yearRange):'end')"
							:disabled="checkDisabled(item)"

							@change="bindValueChange">
								<view v-if="cdata[item.key]" class="uni-input ecan-remove-bg" >{{cdata[item.key]}}</view>
								<view v-else class="uni-input ecan-remove-bg ecan-remove-bg-placeholder">请选择{{item.label}}</view>
							</picker>
						</view>
						<view v-else-if="item.type=='time'" class="form-right-value">
							<picker mode="time" v-model="cdata[item.key]" start="00:00" end="23:59"

							@change="bindValueChange">
								<view v-if="cdata[item.key]" class="uni-input ecan-remove-bg" >{{cdata[item.key]}}</view>
								<view v-else class="uni-input ecan-remove-bg ecan-remove-bg-placeholder">请选择{{item.label}}</view>
							</picker>

						</view>
						<view v-else-if="item.type=='gdzcFileManager'" class="form-right-value">
							<button @click="gdzcFileManager(item)">
								{{item.label}}管理
							</button>
							 
						</view>




					</view>



					<!-- 提示行 -->
					<view class="uni-picker-tips " v-if="fieldErrorTip[item.key]"
						:style="'text-overflow: ellipsis;text-align:end;color:red;position: absolute;right:0;margin-top:29px;white-space: nowrap;overflow: hidden;width: '+windowWidth*0.7+'px;'">
						{{fieldErrorTip[item.key]}}
					</view>
				</view>




		</view>
	</view>
</template>


<script>
	/**
	 * 表单区域，目前只专注于展示、输入、选择，然后触发事件给父组件/页面
	 *
	 *
	 * @event valueChange 一般输入框变更值时触发的事件
	 * @function getDatas 获取当前表单的数据
	 * @function setDatas 覆盖表单数据
	 * @function checkForm 校验表单，返回布尔
	 *
	 * */
	import uniIcons from"@/components/common/uni-icons/uni-icons.vue"
	import uniDataPicker from"@/components/common/ecan-table-picker/ecan-table-picker.vue"
	import uniDatePicker from"@/components/common/uni-date-picker/uni-date-picker.vue"
	import uniDatetimePicker from"@/components/common/uni-datetime-picker/uni-datetime-picker.vue"
	import uniNumberBox from "@/components/common/uni-number-box/uni-number-box.vue"
	import ecanZbTable from"@/components/common/ecan-zb-table/components/zb-table/zb-table.vue"
	export default {
		components: {
			uniIcons,
			uniDataPicker,
			uniDatePicker,
			uniDatetimePicker,
			uniNumberBox,
			ecanZbTable
		},
		name:"ecan-simple-form",
		props:{
			defaultDataMap:{
				type:Object,
				default(){
					return {};
				}
			},
			form_type:{
				type:String,
				default:'add'//除了show，其他都是可编辑
			},
			param:{
				type:Object,
				default(){
					return {};
				}
			},
			fields:{
				type:Array,
				default(){
					return [
					{key:'project_id',label:'项目名称',type:'combo',notnull:true,
					codeblock:'srms_app_getProjectInfos',
					textkey:'srms_manage_project_information#project_name',
					valuekey:'MAIN_TABLE_ID'},
					{key:'project_code',label:'项目批准号',type:'input',readonly:false},
					{key:'acct_project_code',label:'财务项目号',type:'input',readonly:false},
					{key:'leader_name',label:'项目负责人',type:'input',readonly:false},
					{key:'start_date',label:'开始时间',type:'date',readonly:false},
					{key:'end_date',label:'结束时间',type:'date',readonly:false,yearRange:3},
					{key:'apply_dept_name',label:'申请科室',type:'input',readonly:false},
					{key:'centralized_dept',label:'归口科室',type:'input',readonly:false},
					{key:'client_emp_guid',
					label:'受托人',
					notnull:true,
					type:'combo',
					codeblock:"srms_app_getPeople",
					 textkey:'hr_emp_info#emp_name',
					 valuekey:'hr_emp_info#emp_guid'},
					{key:'remarks',label:'是否院内',type:'checkbox',notnull:true,dics:[{label:'院内',value:'1'},{label:'院外',value:'0'} ]},
					{key:'apply_reason',label:'委托原因',notnull:true,type:'textarea',maxLength:-1 },
					//{key:'file_id',label:'委托文件',type:'file',readonly:true}

					];
				}
			}
		},
		computed:{
			cdata:function(){
				//将cdata指向data
				//通过在这个函数中引用到dataRefreshCount，从而使computed监听dataRefreshCount的变化
				//当dRC变化时，我们return的data里面的变化也能获取到
				let a=this.dataRefreshCount;
				let v=this.comboCreateFlag
				return this.data;
			},
			cbflag:function(){//这个是为了做combo回填
				let a=this.dataRefreshCount; 
				return this.comboCreateFlag;
			}
		},
		data() {
			return {
				showContent:true,
				dataRefreshCount:0,
				data:{ },
				fieldErrorTip:{
					"_forSample_Test":"这是一段错误提示"
				},
				comboCreateFlag:{
					
				}
			};
		},
		methods:{
			$clearDatas(){
				for(var key in this.data){
					//this.data[key]=undefined;
					delete this.data[key];
				}
				this.dataRefreshCount++; 
				this.$rerenderForm();
			},
			$getDatas(){
				return this.data;
			},
			$setDatas(data){
				let link={};
				let needReloadCombo=[];
				for(var i=0;i<this.fields.length;i++){
					link[this.fields[i].key]=i;
				} 
				for(var key in data){
					let linkIndex=link[key];
					
					this.data[key]=data[key];
					if(linkIndex==undefined){
						continue;
					}
					this.$checkForm(false,[ key]); 
					if(this.fields[link[key]].type=='combo'||this.fields[link[key]].type=='table'){ 
						needReloadCombo.push(key);//this.$refs['combo'+key][0].queryForData({getDefaultVal:true})
					}
					if(this.fields[link[key]].type=='webdateandtime'&&data[key]==null){ 
						this.$refs['webdateandtime'+key][0].clearForForm()
					}
					 
				}
				this.dataRefreshCount++;
				for(var i=0;i<needReloadCombo.length;i++){
					
					this.recreateCombo(needReloadCombo[i]);//this.$refs['combo'+needReloadCombo[i]][0].queryForData({getDefaultVal:true})
				}
			},
			$rerenderForm(){
				var _this=this;
				this.showContent=false;
				this.$nextTick(()=>{
					_this.showContent=true;
				})

			},
			$checkForm(showMsg,keys){
				//this.clearFieldErrorTips();
				var res=true;
				var msgs=[];
				//检查必填
				for(var i=0;i<this.fields.length;i++){
					if(keys&&keys.indexOf(this.fields[i].key)==-1){
						continue;
					}
					this.fieldErrorTip[this.fields[i].key]=undefined;
					let tmpVal=this.data[this.fields[i].key];
					if(this.fields[i].notnull==true&&this.checkNull(tmpVal)){
						msgs.push('必填项【'+this.fields[i].label+'】不能为空');
						this.fieldErrorTip[this.fields[i].key]="必填项不能为空"
						res=false;
					}
					if(this.fields[i].max!=undefined || this.fields[i].min!=undefined ){
						var tmpCheckObj=this.checkNumberRange(this.fields[i],tmpVal);
						if(!tmpCheckObj.success){
							msgs.push(tmpCheckObj.msg);
							this.fieldErrorTip[this.fields[i].key]=tmpCheckObj.msg
							res=false;
						}
					}
					if(this.fields[i].customValidator!=null){
						var tmpCustomMsg=this.fields[i].customValidator(this.fields[i],this.data);
						if(tmpCustomMsg!=true){
							msgs.push(tmpCustomMsg);
							this.fieldErrorTip[this.fields[i].key]=tmpCustomMsg
							res=false;
						}
					}
				}
				if(showMsg==true&&msgs.length>0){
					uni.showToast({
						title: msgs.join("、"),
						icon: 'none',
						duration: 2500
					});
				}
				this.dataRefreshCount++;
				return res;
			},
			addTableRow(item){
				var rows=this.data[item.key];
				var _this=this;
				if(rows==null||rows==undefined){
					this.data[item.key]=[];
					rows=[];
				}
				
				var newData={};
				var rowKey=item.row_key?item.row_key:'id';
				var tmpMax=0;
				for(var k=0;k<rows.length;k++){
					if(parseInt(rows[k][rowKey])>tmpMax){
						tmpMax=parseInt(rows[k][rowKey])
					}
				}
				var newRow={id:tmpMax+1};
				newRow[rowKey]=tmpMax+1
				this.data[item.key].push(newRow);
				newData[item.key]=this.data[item.key]
				
				this.$setDatas(newData)
				
				this.$nextTick(()=>{
					//_this.recreateCombo(item.key)
				})
				
				console.log(this.data);
			},
			gdzcFileManager(item){
				uni.navigateTo({
					url: '/pages/common/gdzcFileManager?userInfo='+this.param.userInfo+'&asst_guid='+item.asst_guid+'&asst_type='+item.asst_type+'&mode='+item.mode
				});
			},
			recreateCombo(key){
				var _this=this;console.log("recreateCombo:",key);
				this.comboCreateFlag[key]=false;
				this.$nextTick(()=>{
					_this.comboCreateFlag[key]=true;
					_this.dataRefreshCount++;
				})
			},
			comboCreate(key){
				if(this.cbflag[key]!=false){
					return true;
				}
				return false;
			},
			clearFieldErrorTips(){
				this.fieldErrorTip={};
			},
			getDateRangeForPicker(type){
				let date = new Date();

				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 10;return '';
				} else if (type === 'end') {
					year = year + 10;return '';
				}else if(Number.isInteger( parseInt(type) )){
					year=year+parseInt(type);

				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				let res=`${year}-${month}-${day}`
				return res;
			},
			getCheckboxSplit(val){
				if(val==null||val==undefined){
					return [];
				}
				return (""+val).split(",");
			},
			checkNull(val){
				return val==null||val==undefined||val=='';
			},
			checkDisabled(field){
				if(this.form_type=='show'){
					return true;
				}
				return field.readonly==true;
			},
			checkNumberRange(field,val){
				var tmpNum=parseFloat(val);
				if(!isNaN(tmpNum)){
					var tmpMax=parseFloat(field.max);
					var tmpMin=parseFloat(field.min);
					if(!isNaN(tmpMax)&&tmpMax<tmpNum){
						return {val:tmpMax,success:false,msg:'最大值为'+tmpMax};
					}else if(!isNaN(tmpMin)&&tmpMin>tmpNum){
						return {val:tmpMin,success:false,msg:'最小值为'+tmpMin};
					}
				}
				return {val:val,success:true,msg:''};
			},
			nowField(field) {
				this.nowSelectedField = field;
			},
			bindTypeInputChange(e,type,item){
				var value=e;
				if(type=='number'){
					value=e.detail.value
					var str = value.replace(/[^\d\.]/g, '');
					var pointIndex = str.search(/\./); 
					if (-1 !== pointIndex ) {
						if(pointIndex==(str.length-1)){
							str = str.substr(0, pointIndex + 1).replace(/\./, '.0');
						}else if(str.substr(pointIndex+1 ).length>2){
							str = str.substr(0, pointIndex + 3);
						} 
					}
					var tmpNum=parseFloat(str);
					if(!isNaN(tmpNum)&&1>2){
						var checkObj=this.checkNumberRange(item,str);
						if(!checkObj.success){
							str=checkObj.val;
						} 
					}
					
					e.detail.value = str;
				} 
				this.bindValueChange(e);
			},
			bindValueChange: function(e) {
				var _this = this;
				setTimeout(function() {
					var tmpVal = e;
					if (e.detail != undefined) {
						tmpVal = e.detail.value;
					}
					if(Array.isArray(tmpVal) ){
						tmpVal=tmpVal.join(",");
					}
					_this.data[_this.nowSelectedField.key] = tmpVal;
					console.log("val change",_this);
					_this.$emit('valueChange', {
						detail: {
							value: tmpVal,
							field:_this.nowSelectedField
						}
					});
					_this.dataRefreshCount++;
					_this.$checkForm(false,_this.nowSelectedField.key)
				}, 50);
			},
			bindComboChange: function(e) {
				var _this = this;
				setTimeout(function() {
					let clickItem = e.detail.clickItem;
					let targetValue='';
					let targetDic={};

					if(clickItem!=null){
						targetDic = clickItem;
						targetValue = targetDic.value;
					}
					_this.data[_this.nowSelectedField.key] = e.detail.value;
console.log("combo change");
					_this.$emit('valueChange', {
						detail: {
							value: e.detail.value,
							clickItem: clickItem,
							field:_this.nowSelectedField
						}
					});
					_this.dataRefreshCount++;
					_this.$checkForm(false,_this.nowSelectedField.key)
				}, 50);
			}
		},
		created() {

	 
			 
			this.height = uni.getSystemInfoSync().windowHeight;
			this.windowWidth=uni.getSystemInfoSync().windowWidth;
			//判断传过来的参数
			//_this.showContent=true;
			this.data=this.defaultDataMap;
		}
	}
</script>

<style  lang="scss" scoped>
	@import url("../../../common/uni.css");

	.each-line {

		 border-bottom: 1px solid #dfdfdf!important;
		 margin-right:24rpx;
		 margin-left:24rpx;
		 .uni-form-item {
			 //margin-left: 10rpx;
			 //margin-right: 20rpx;
			 //margin-right:24rpx;
		 }
		 .simple-title {
			 padding:5px 12px 5px 0px;
		 }
	}

	.form-title {
		flex: 1 1 0%;
	}
	.form-right-value {
		flex: 1 1 0%;
		text-align: right;
	}

	/deep/.uni-date-editor--x {
		.uni-date-x {
			padding: initial;
			background-color: initial;
			.uni-date__input {
				padding: initial;
			}
			.uni-date__icon-logo {
				display: none;
			}
		}

	}
	/deep/.uni-date-editor--x:hover {
		.uni-date__icon-clear {
			right: initial;
			    left: 27px;
		}
	}
	/deep/.uni-data-tree {
		.uni-data-tree-input {
			.input-value {
				padding:initial;
				line-height: 32px;
				.selected-list {
					padding:initial;
					font-size: initial;
				}
				.selected-area {
					padding:initial;
					font-size: initial;
				}
			}
		}
	}
	.uni-picker-tips {
		font-size: 12px;
		color: #666;
		margin-bottom: 15px;
		padding: 0 15px;
		font-style: italic;
		/* text-align: right; */
	}
	.ecan-remove-bg {
		background-color: initial;
		padding-left: 0;
		padding-right: 0;

	}
	.ecan-remove-bg-placeholder {
		color:grey;
	}
	.fix-line-high {
		height: 30px;
	}
</style>
