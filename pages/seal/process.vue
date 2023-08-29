<template>
	<view class="container">
		<!-- 审核结束时间 -->
		<view class="endClass" style="flex-direction: column;">
			<view class="row" style="background-color: white">
				<view class="label">申请人</view>
				<view class="value">{{ sealApply.user_name }}</view>
			</view>
			<view class="separator"></view>
			<view class="row" style="background-color: white">
				<view class="label">印章名称</view>
				<view class="value">{{ sealApply.seal_name }}</view>
			</view>
			<view class="separator"></view>
			<view class="row" style="background-color: white">
				<view class="label">用章科室</view>
				<view class="value">{{ sealApply.dept_names }}</view>
			</view>
			<view class="separator"></view>
			<view class="row" style="background-color: white">
				<view class="label">盖章件名称</view>
				<view class="value">{{ sealApply.file_name }}</view>
			</view>
			<view class="separator"></view>
			<view class="row" style="background-color: white">
				<view class="label">盖章件单位</view>
				<view class="value">{{ sealApply.file_unit }}</view>
			</view>
			<view class="separator"></view>
			<view class="row" style="background-color: white">
				<view class="label">使用次数</view>
				<view class="value">{{ sealApply.use_count }}</view>
			</view>
			<view class="separator"></view>
			<view class="row" style="background-color: white">
				<view class="label">经办人</view>
				<view class="value">{{ sealApply.operator_names }}</view>
			</view>
			<view class="separator"></view>
			<view class="row" style="background-color: white">
				<view class="label">处理时限</view>
				<view class="value">{{ sealApply.date_limit }}</view>
			</view>
			<view class="separator"></view>
			<view class="row" style="background-color: white">
				<view class="label">紧急程度</view>
				<view class="value">{{ sealApply.urgent_level }}</view>
			</view>


			<view class="separator" v-if="fileList.length>0"></view>
			<view class="row" style="background-color: white" v-if="fileList.length>0">
				<view class="label" style="color:skyblue;">相关附件（可点击查看）</view>
			</view>
			<view v-for="(file, index) in fileList">
				<view class="separator"></view>
				<view class="row" style="background-color: white">
					<view class="label" @click="fileView(file.localRelativePath)">{{file.name}}</view>
				</view>
			</view>


			<view class="separator"></view>
			<view class="row" style="background-color: white">
				<view class="label">开始时间</view>
				<view class="value">{{ sealApply.start_time}}</view>
			</view>
			<view class="separator"></view>
			<view class="row" style="background-color: white">
				<view class="label">结束时间</view>
				<view class="value">{{ sealApply.end_time }}</view>
			</view>
		</view>

		<!-- 备注 -->
		<view class="endClass">
			<view style="margin-top: 20rpx;margin-bottom: 20rpx; background-color: white; width: 100%;">
				<view class="label required">备注</view>
				<view class="remark">
					<textarea class="remark-input" :value="sealApply.remark" readonly></textarea>
				</view>
			</view>
		</view>

		<!-- 审核节点列表 -->
		<view class="endClass" style="background-color: #F7F8F9; width:100%; height: auto;">
			<view class="node-list">
				<checkbox-group @change="checkboxChange">
				<view v-for="(node, index) in nodeList" :key="index" class="node-item">
					<view class="node-item-border">
						<view class="node-info">
							<checkbox :checked="node.is_need=='1'" :value="node.ID" :key="node.ID"></checkbox>
							<view class="nodeMes">
								<view class="titleCSS" style="padding-bottom: 10rpx;">
									审批人姓名：{{ node.user }}
								</view>
								<view class="info-item">
									<text class="label" style="color: #666666;">层级：
										<text class="value" style="color: #666666;">{{ node.relation_name }}</text>
									</text>
								</view>
								<view class="info-item">
									<text class="label" style="color: #999999;">节点：
										<text class="value">{{ node.PROCESS_ALIAS }}</text>
									</text>
								</view>
							</view>
							<view style="flex:1">
								<uni-icons type="forward" size="30" @tap="goToNextPage"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				</checkbox-group>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="buttons-container">
			<view class="buttons">
				<button @click="reject" class="rejectBtn">退回申请</button>
				<button @click="approve" class="approveBtn">审核通过</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '@/components/common/uni-icons/uni-icons.vue';
	import uniFilePicker from '@/components/common/uni-file-picker/uni-file-picker.vue';
	import hrUrl from "@/common/hrReqConst.js";
	import fileUrl from "@/common/baseUrl.js";
	export default {
		data() {
			return {
				endTime: "2023-08-28 12:00",
				remark: "",
				sealApply: {},
				nodeList: [],
				fileList: [],
				selectedNodeIndex: -1,
				allChecked: true,
				checkNode:[],//选择的节点
			};
		},
		methods: {
			changeAll() {
				this.allChecked = !this.allChecked;
			},
			reject() {
				// 处理退回申请逻辑
			},
			checkboxChange(e){
				this.checkNode = e.detail.value;
			},
			
			getCheckNode(){
				var resultNode = [];
				for (var i = 0; i < this.nodeList.length; i++) {
					if(this.checkNode.includes(this.nodeList[i].ID)){
						this.nodeList[i].is_need = '1';
						resultNode.push(this.nodeList[i]);
					}else{
						this.nodeList[i].is_need = '0';
						resultNode.push(this.nodeList[i]);
					}
				}
				return resultNode;
			},
			nodeInit(){
				for (var i = 0; i < this.nodeList.length; i++) {
					if(this.nodeList[i].is_need==='1'){
						this.checkNode.push(this.nodeList[i].ID);
					}
				}
			},
			approve() {
				var nodeData = this.getCheckNode();
				console.log(nodeData)
				uni.request({
					url: hrUrl,
					method: 'post',
					dataType: 'json',
					header: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					data: {
						'hrpId': this.hrpId,
						'hrpPwd': this.hrpPwd,
						'hrpUnitId': this.hrpUnitId,
						'authDate': this.authDate,
						'orgNo': this.orgNo,
						'context': this.context,
						'codeBlockName': 'oa_passSealApplyForApp',
						'params': JSON.stringify({
							'apply_guid': this.applyGuid,
							'apply_user': this.sealApply.apply_user,
							'data': nodeData
						}),
					},
					success: res => {
						let data = res.data.data;
						console.log(data);
					},
					fail: () => {

					},
					complete: () => {
						

					}
				});
			},
			goToNextPage() {
				// // 在这里编写跳转逻辑，比如使用uni.navigateTo跳转到目标页面
				// uni.navigateTo({
				//   url: '/pages/next-page' // 目标页面的路径
				// });
				console.log('a');
			},
			fileView(fileUrl) {




			},
			getData() {
				uni.request({
					url: hrUrl,
					method: 'GET',
					dataType: 'json',
					data: {
						'hrpId': this.hrpId,
						'hrpPwd': this.hrpPwd,
						'hrpUnitId': this.hrpUnitId,
						'authDate': this.authDate,
						'orgNo': this.orgNo,
						'context': this.context,
						'codeBlockName': 'oa_stamp_detailApp',
						'params': '{"apply_guid":"' + this.applyGuid + '"}'
					},
					success: res => {
						let data = res.data.data;
						this.sealApply = data.dataResult;
						this.fileGuids = data.dataResult.file_guid;
						this.getNodes(this.sealApply.dept_guids);
					},
					fail: () => {

					},
					complete: () => {
						if (this.fileGuids !== '' && this.fileGuids != undefined && this.fileGuids !== null) {
							this.getFile(this.fileGuids);
						}

					}
				});
			},
			getNodes(dept_guids) {
				uni.request({
					url: hrUrl,
					method: 'GET',
					dataType: 'json',
					data: {
						'hrpId': this.hrpId,
						'hrpPwd': this.hrpPwd,
						'hrpUnitId': this.hrpUnitId,
						'authDate': this.authDate,
						'orgNo': this.orgNo,
						'context': this.context,
						'codeBlockName': 'oa_getSealOwnerListToApp',
						'params': '{"apply_guid":"' + this.applyGuid + '","dept_guids":"' + dept_guids + '" }'
					},
					success: res => {
						let data = res.data.data;
						this.nodeList = data;
					},
					fail: () => {

					},
					complete: () => {
						this.nodeInit();

					}
				});
			},
			getFile(file_guids) {

				uni.request({
					url: fileUrl + 'hrp!getFiles.action',
					method: 'post',
					dataType: 'json',
					header: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					data: {
						hrpId: this.hrpId,
						hrpPwd: this.hrpPwd,
						hrpUnitId: this.hrpUnitId,
						authDate: this.authDate,
						orgNo: this.orgNo,
						context: this.context,
						flag: "",
						docId: this.applyGuid,
						mode: "3mail",
						fileType: "",
						fileIds: this.fileGuids,
						needResultStr: "0"
					},
					success: res => {
						let data = res.data.data;
						this.fileList = data;
					},
					fail: () => {

					},
					complete: () => {


					}
				});

			}
		},
		components: {
			uniIcons,
			uniFilePicker,
		},
		onLoad(param) {
			this.param = param;
			//判断传过来的参数
			if (param && param.userInfo) {
				let obj = JSON.parse(param.userInfo);
				if (obj) {
					let option = obj.loadInfo;
					this.hrpId = option.hrpId;
					this.hrpPwd = option.hrpPwd;
					this.applyGuid = "1567c8c7a8c72cff2137fbd40ad7ef55";
					this.hrpUnitId = option.hrpUnitId;
					this.authDate = option.authDate;
					this.orgNo = option.orgNo;
					this.context = option.context;
					this.dataOption = option;
					this.getData();
				}
			}
		},
	};
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;

	}

	.separator {
		height: 1rpx;
		background-color: #ccc;
		margin: 10rpx 0;
	}

	.scroll-view {
		height: 100%;
		background-color: #F7F8F9;
	}

	.nodeMes {
		display: flex;
		flex-direction: column;
		padding-left: 20rpx;
		flex: 8;
	}

	.endClass {
		padding-left: 20rpx;
		padding-right: 20rpx;
		margin-bottom: 90rpx;
		display: flex;


	}

	.node-item-border {
		border: 1px solid white;
		background-color: white;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		margin-top: 20rpx;
		padding: 10rpx;
		display: flex;
		align-items: center;
		width: 100%;
	}

	.time {
		margin-bottom: 20rpx;
		font-size: 28rpx;
	}

	.value {
		flex: 2;
		text-align: right;
		color: #999;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5rpx;
	}

	.label {
		font-size: 30rpx;
	}



	.remark textarea {
		width: 100%;
		height: 200rpx;
		border: 1rpx solid #ccc;
		border-radius: 4rpx;
		padding: 10rpx;
	}

	.node-list {
		margin-top: 20rpx;
		width: 95%;
		height: 50vh;
	}

	.node-item {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;

	}

	.node-info {
		flex: 1;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.buttons {
		margin-top: 20rpx;
		display: flex;
		flex-direction: row;
	}

	.buttons-container {
		position: fixed;
		bottom: 0;
		width: 100%;
		padding-bottom: 10px;
		background-color: #F7F8F9;
		box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
	}

	.rejectBtn {
		background: #F8FBFF;
		border-radius: 46rpx 46rpx 46rpx 46rpx;
		border: 1rpx solid #1E8FFE;
		width: 40%;
		color: #1E8FFE;
	}

	.approveBtn {
		background: #1E8FFF;
		border-radius: 46rpx 46rpx 46rpx 46rpx;
		width: 40%;
		color: #FFFFFF;
	}

	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 30rpx;
		margin-top: 30rpx;
		width: 100%;
	}

	.label {
		flex: 1;
		text-align: left;
		color: #333;
	}

	.remark-value {
		text-align: center;
		color: #999;
		margin-top: 15rpx;
	}

	.required::before {
		content: "*";
		color: red;
		margin-right: 5rpx;
	}

	.remark textarea.remark-input {
		width: 97%;
		height: 200rpx;
		border: 1rpx solid #ccc;
		border-radius: 4rpx;
		padding: 10rpx;
	}
</style>