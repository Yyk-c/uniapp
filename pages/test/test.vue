<template>
	<view class="container">
		<view class="bar1">
			<view class="bar">
				<view class="time">
					<image src="../../static/logo.png" style="width:60rpx; height:60rpx; opacity: 1">
						<text style="font-size: 40rpx ;padding: 0 0 0 5rpx;">{{ remainingTime }}</text>
				</view>
				<view class="type-switch" @click="showDrawer">
					<text style="font-size: 35rpx">选择题型</text>
					<view class="textClass">
						<image src="../../static/logo.png" style="width:60rpx; height:60rpx; opacity: 1;">
					</view>
				</view>
			</view>
			<view class="bar">
				<view class="currentType">
					<uni-tag :text="currentType" type="primary" />
				</view>
				<view class="type-switch" @click="showDrawer">
					<text style="font-size: 35rpx ;">{{currentIndex+1}}/{{currentTypeSum}}</text>
				</view>
			</view>

			<view class="bar">
				<view class="content">
					{{currentIndex+1}}.({{currentQuestion.value}}分){{ currentQuestion.content }}
				</view>
			</view>
		</view>

		<view class="question" @touchstart="touchStart" @touchend="touchEnd">
			<scroll-view scroll-y="true" class="list">

				<view class="options" v-if="currentType== '单选题'">
					<radio-group>
						<label class="option" v-for="(option, index) in currentQuestion.options" :key="index"
							@click="radioChange(index)">
							<view>
								<radio :checked="currentCheck == index" />
							</view>
							<view class="text">{{ option.text }}</view>
							<image :src="option.image" class="imageClass" mode="scaleToFill" 
							 v-if="option.image!='' &&option.image!=null"/>
						</label>
					</radio-group>
				</view>
				<view class="options" v-if="currentType== '多选题'">
					<checkbox-group @change="checkboxChange">
						<label class="option" v-for="(option, index) in currentQuestion.options" :key="index">
							<view>
								<checkbox :value="index+''" :checked="isCheck(index)" />
							</view>
							<view class="text">{{ option.text }}</view>
							<image :src="option.image" class="imageClass" mode="scaleToFill"
								v-if="option.image!=''&&option.image!=null" />
						</label>
					</checkbox-group>
				</view>
				<view class="options" v-if="currentType== '判断题'">
					<radio-group>
						<label class="option" v-for="(option, index) in currentQuestion.options" :key="index"
							@click="radioChangeForTorF(index)">
							<view>
								<radio :checked="currentCheck == index" />
							</view>
							<view class="text">{{ option.text }}</view>
						</label>
					</radio-group>
				</view>
				<view class="inputs" v-if="currentType== '简答题'">
					<textarea class="text1" placeholder='请输入...' @input="sumfontnum" v-model="textArea"></textarea>
				</view>
				<view v-if="currentType=='判断改错题'">
					<view class="options">
						<radio-group>
							<label class="option" v-for="(option, index) in currentQuestion.options" :key="index"
								@click="radioChangeForPDGC(index)">
								<view>
									<radio :checked="currentCheck == index" />
								</view>
								<view class="text">{{ option.text }}</view>
							</label>
						</radio-group>
					</view>
					<view class="inputs">
						<textarea class="text1" placeholder='请输入...' @input="textChange"
							v-model="textAreaForPDGC"></textarea>
					</view>
				</view>
				<view class="inputAnswer" v-if="currentType== '填空题'">
					<view class="inputAnswer2" v-for="(option, index) in currentQuestion.options" :key="index">
						{{option}}
						<input v-model="inputValues[index]" :id="index" @input="inputEvent" />
					</view>
				</view>
			</scroll-view>
		</view>

		<view>
			<uniDrawer ref="showRight" mode="right" :mask-click="false">
				<view class="drawer">
					<view class="option-container">
						<view class="option" @click="switchtypeCheck('单选题',0)">
							<view class="icon">
								<image src="../../static/logo.png" style="width: 55rpx; height: 55rpx;" />
							</view>
							<view class="content2">单选题</view>
						</view>
						<view class="option" @click="switchtypeCheck('多选题',0)">
							<view class="icon">
								<image src="../../static/logo.png" style="width: 55rpx; height: 55rpx;" />
							</view>
							<view class="content2">多选题</view>
						</view>
						<view class="option" @click="switchtypeCheck('判断题',0)">
							<view class="icon">
								<image src="../../static/logo.png" style="width: 55rpx; height: 55rpx;" />
							</view>
							<view class="content2">判断题</view>
						</view>
						<view class="option" @click="switchtypeCheck('简答题',0)">
							<view class="icon">
								<image src="../../static/logo.png" style="width: 55rpx; height: 55rpx;" />
							</view>
							<view class="content2">简答题</view>
						</view>
						<view class="option" @click="switchtypeCheck('填空题',0)">
							<view class="icon">
								<image src="../../static/logo.png" style="width: 55rpx; height: 55rpx;" />
							</view>
							<view class="content2">填空题</view>
						</view>
						<view class="option" @click="switchtypeCheck('判断改错题',0)">
							<view class="icon">
								<image src="../../static/logo.png" style="width: 55rpx; height: 55rpx;" />
							</view>
							<view class="content2">判断改错题</view>
						</view>
					</view>
				</view>
			</uniDrawer>
		</view>

		<view class="tabbar">
			<view class="tabbar-item">
				<image class="item-img" src="../../static/logo.png" @click="answeSheet"></image>
				<image class="item-img" src="../../static/logo.png" @click="lastQuestion"></image>
				<image class="item-img" src="../../static/logo.png" @click="nextQuestion"></image>
				<image class="item-img" src="../../static/logo.png" @click="submit"></image>
			</view>

		</view>

		<!-- <view class="mask" :style="{ display: maskVisible }" @click="hideDrawer"></view> -->

		<view class="drawer2" :style="{ transform: drawerTransform }">
			<view class="content3">
				<scroll-view scroll-y="true" class="list">
					<view class="card" @touchstart="touchStartForDrawer" @touchend="touchEndForDrawer">
						<view v-for="(questionType, index) in questionTypes" :key="index" class="question-type">
							<view class="header">{{ questionType.title }}</view>

							<view class="question-list">
								<view v-for="(question, questionIndex) in questionType.questions" :key="questionIndex"
									class="question-item circle"
									:style="{'background-color':qwewr[index][questionIndex]==1? '#00aaff':'#ffffff'}"
									>
									<text class="circle-number"
										@click="transToQuestion(index,questionIndex)">{{ questionIndex + 1 }}</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>



</template>

<script>
	import hrUrl from "@/common/hrReqConst.js"
	import uniDrawer from '@/components/common/uni-drawer/uni-drawer.vue'
	import uniIcons from '@/components/common/uni-icons/uni-icons.vue'
	import uniTag from '@/components/common/uni-tag/uni-tag.vue';
	export default {
		components: {
			uniDrawer,
			uniIcons,
			uniTag,
		},
		data() {
			return {

				questionTypes: [],
				qwewr: [],
				drawerVisible: false,
				list: [], //题型类型
				remainingTime: '', // 剩余时间
				currentType: '', // 当前题型
				currentIndex: 0,
				currentCheck: 0,
				currentTypeSum: 0,
				exam_id: '',
				questions: [ // 题目列表
					{
						type: '单选题',
						list: [{
							id: 11,
							content: '单选题1',
							options: [{
									text: '题目1选项1',
									image: '../../static/logo.png'
								},
								{
									text: '题目1选项1',
									image: '../../static/logo.png'
								},
								{
									text: '题目1选项1',
									image: '../../static/logo.png'
								}
							],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}],

						}, {
							id: 121,
							content: '单选题1',
							options: [{
									text: '题目1选项1',
									image: '../../static/logo.png'
								},
								{
									text: '题目1选项1',
									image: '../../static/logo.png'
								},
								{
									text: '题目1选项1',
									image: '../../static/logo.png'
								}
							],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}],

						}, {
							id: 111,
							content: '单选题1',
							options: [{
									text: '题目1选项1',
									image: '../../static/logo.png'
								},
								{
									text: '题目1选项1',
									image: '../../static/logo.png'
								},
								{
									text: '题目1选项1',
									image: '../../static/logo.png'
								}
							],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}],

						}, {
							id: 411,
							content: '单选题1',
							options: [{
									text: '题目1选项1',
									image: '../../static/logo.png'
								},
								{
									text: '题目1选项1',
									image: '../../static/logo.png'
								},
								{
									text: '题目1选项1',
									image: '../../static/logo.png'
								}
							],
							value: 65,
							answer: [{
								key: '',
								value: ''
							}],

						}, {
							id: 141,
							content: '单选题1',
							options: [{
									text: '题目1选项1',
									image: '../../static/logo.png'
								},
								{
									text: '题目1选项1',
									image: '../../static/logo.png'
								},
								{
									text: '题目1选项1',
									image: '../../static/logo.png'
								}
							],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}],

						}, {
							id: 116,
							content: '单选题1',
							options: [{
									text: '题目1选项1',
									image: '../../static/logo.png'
								},
								{
									text: '题目1选项1',
									image: '../../static/logo.png'
								},
								{
									text: '题目1选项1',
									image: '../../static/logo.png'
								}
							],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}],

						}]
					},

					{
						type: '多选题',
						list: [{
							id: 21,
							content: '多选大苏打实打大苏打实打大苏打实打大苏打实打大苏打实打大苏打实打实题1',
							options: [{
									text: '题目21选项1',
									image: '../../static/logo.png',
									sortValue: "0"
								},
								{
									text: '题目21选项1',
									image: '../../static/logo.png',
									sortValue: "1"
								},
								{
									text: '题目21选项1',
									image: '../../static/logo.png',
									sortValue: "2"
								}, {
									text: '题目21选项1',
									image: '../../static/logo.png',
									sortValue: "2"
								},
								{
									text: '题目21选项1',
									image: '../../static/logo.png',
									sortValue: "3"
								}
							],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}],

						}, {
							id: 26,
							content: '多选大苏打实打大苏打实打大苏打实打大苏打实打大苏打实打大苏打实打实题1',
							options: [{
									text: '题目21选项1',
									image: '../../static/logo.png',
									sortValue: "0"
								},
								{
									text: '题目21选项1',
									image: '../../static/logo.png',
									sortValue: "1"
								},
								{
									text: '题目21选项1',
									image: '../../static/logo.png',
									sortValue: "2"
								}, {
									text: '题目21选项1',
									image: '../../static/logo.png',
									sortValue: "2"
								},
								{
									text: '题目21选项1',
									image: '../../static/logo.png',
									sortValue: "3"
								}
							],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}],

						}]
					},

					{
						type: '判断题',
						list: [{
							id: 3112,
							content: '判断题1',
							options: [{
									text: '对',
								},
								{
									text: '错',
								}
							],
							value: 10,
							answer: [{
								key: '',
								value: ''
							}],

						}, {
							id: 2331,
							content: '判断题1',
							options: [{
									text: '对',
								},
								{
									text: '错',
								}
							],
							value: 10,
							answer: [{
								key: '',
								value: ''
							}],

						}]
					},
					{
						type: '简答题',
						list: [{
							id: 4641,
							content: '简答题1',
							options: [],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}],

						}, {
							id: 4871,
							content: '简答题1',
							options: [],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}],

						}]
					},
					{
						type: '填空题',
						list: [{
							id: 512,
							content: '填空题1',
							options: [

								'问题11你的答案：',
								'问题21你的答案：',
								'问题31你的答案：',

							],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}, {
								key: '',
								value: ''
							}, {
								key: '',
								value: ''
							}],

						}, {
							id: 511,
							content: '填空题1',
							options: [

								'问题11你的答案：',
								'问题21你的答案：',
								'问题31你的答案：',

							],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}, {
								key: '',
								value: ''
							}, {
								key: '',
								value: ''
							}],

						}]
					},

					{
						type: '判断改错题',
						list: [{
							id: 461,
							content: '判断改错题1',
							options: [{
									text: '对',
								},
								{
									text: '错',
								}
							],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}, {
								key: '',
								value: ''
							}],

						}, {
							id: 611,
							content: '判断改错题1',
							options: [{
									text: '对',
								},
								{
									text: '错',
								}
							],
							value: 6,
							answer: [{
								key: '',
								value: ''
							}, {
								key: '',
								value: ''
							}],

						}]
					},

				],
				currentQuestion: {
					id: -1,
					type: '',
					content: '',
					options: [{
						text: '',
						image: '',
						sortValue: 0,
					}],
					value: 0,
					answer: [{
						key: '',
						value: ''
					}],

				}, // 当前题目
				selectedTypePosition: 0, // 用户选择的题目类型index
				textArea: '',
				textAreaForPDGC: '',
				inputValues: [],
				total: 24, //
				rows: [], //
				startX: 0,
				startY: 0,
				firstQuesttionTypeIndex:-1
			}
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
					this.hrpUnitId = option.hrpUnitId;
					this.authDate = option.authDate;
					this.orgNo = option.orgNo;
					this.context = option.context;
					this.dataOption = option;
					this.exam_id = param.exam_id;
					this.getData();
				}
			}

		},
		computed: {
			drawerTransform() {
				return this.drawerVisible ? 'translateY(0)' : 'translateY(100%)';
			},
			maskVisible() {
				return this.drawerVisible ? 'block' : 'none';
			}
		},

		methods: {
			initAnswerSheet() {
				let flag = 0;
				for (var i = 0; i < this.questions.length; i++) {
					if(this.questions[i].list.length<=0)continue;

					this.questionTypes.push({
						title: '',
						questions: ['']
					})
					this.qwewr.push([0, 0]);
					this.questionTypes[flag].title = this.questions[i].type;
					for (var j = 0; j < this.questions[i].list.length; j++) {
						this.questionTypes[flag].questions[j] = this.questions[i].list[j].content;
					}
					flag++;
				}

			},
			transForAnswerSheetIndex(index){
				let flag = -1;
				let realIndex = -1;
				for (var i = 0; i < this.questions.length; i++) {
					if(this.questions[i].list.length>0){
						flag++;
						if(flag==index){
							realIndex = i;
							break;
						}
					}
				}
				return realIndex;
			},
			
			transForRealIndex(index){
				let flag = -1;
				for (var i = 0; i <= index; i++) {
					if(this.questions[i].list.length>0){
						flag++;
					}
				}
				return flag;
				
			},
			
			
			transToQuestion(index1, index2) {
				index1 = this.transForAnswerSheetIndex(index1);
				this.drawerVisible = false; //关闭弹窗
				this.initData();
				this.currentQuestion = this.questions[index1].list[index2];
				this.currentType = this.questions[index1].type;
				this.selectedTypePosition = this.getTypeQuestion(this.currentType);
				this.currentIndex = index2;
				this.currentTypeSum = this.questions[index1].list.length;
				this.checkIsAnswerAndShow();
			},

			checkboxChange(e) {
				this.a = 'a';
				const str = e.detail.value.map(n => String.fromCharCode(Number(n) + 65)).join(',');
				this.questions[this.selectedTypePosition].list[this.currentIndex].answer[0].key = 'choice';
				this.questions[this.selectedTypePosition].list[this.currentIndex].answer[0].value = str;
				this.qwewr[this.transForRealIndex(this.selectedTypePosition)][this.currentIndex] = 1;
			},
			isCheck(index) {
				return this.convertStringToIndex(this.currentQuestion.answer[0].value).includes(index + '');
			},
			convertStringToIndex(str) {
				const letters = str.split(',')
				const indices = []
				for (let i = 0; i < letters.length; i++) {
					const index = letters[i].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)
					if (index >= 0 && index <= 25) {
						indices.push(index.toString())
					}
				}
				return indices;
			},
			nextQuestion() {
				if (this.currentIndex >= this.currentTypeSum - 1) {
					if (this.questions[this.questions.length - 1].type == this.currentType) {
						this.showFinalQuestion();
					} else {
						let index = this.getTypeQuestion(this.currentType) + 1;
						let question = this.questions[index];
						while(question.list.length==0){
							if(index == this.questions.length-1){
								this.showFinalQuestion();
								return;
							}
							index+=1;
							question = this.questions[index];
						}
						this.switchType(question.type, 0);
					}
				} else {
					this.initData()
					this.currentQuestion = this.questions[this.selectedTypePosition].list[++this.currentIndex];
					this.checkIsAnswerAndShow();
				}
			},
			inputEvent(e) {
				this.questions[this.selectedTypePosition].list[this.currentIndex].answer[e.target.id].key = 'answer';
				this.questions[this.selectedTypePosition].list[this.currentIndex].answer[e.target.id].value = e.detail.value;
				this.qwewr[this.transForRealIndex(this.selectedTypePosition)][this.currentIndex] = 1;
			},
			lastQuestion() {
				if (this.currentIndex == 0) {
					if (this.currentType == this.questions[this.firstQuesttionTypeIndex].type) {
						this.showFirstQuestion();
					} else {
						let index = this.getTypeQuestion(this.currentType) - 1;
						let question = this.questions[index];
						while(question.list==null||question.list.length==0){
							index-=1;
							question = this.questions[index];
						}
						this.switchType(question.type, question.list.length - 1);
					}
				} else {
					this.initData();
					this.currentQuestion = this.questions[this.selectedTypePosition].list[--this.currentIndex];
					this.checkIsAnswerAndShow();
				}
			},
			initData(){
				this.currentCheck = -1;
				this.textArea = '';
				this.textAreaForPDGC = '';
				this.inputValues = [];
			},
			
			submit() {
							uni.showModal({
							  title: '提示',
							  content: '是否交卷？',
							  showCancel: true,
							  confirmText: '确定',
							  success: (res) => {
							    if (res.confirm) {
							      this.submitQuestions();
							    } else if (res.cancel) {
							    }
							  }
							});
						},
			getFirstQuestionType(){
				for (var i = 0; i < this.questions.length; i++) {
					if(this.questions[i].list!=0){
						this.firstQuesttionTypeIndex = i;
						return;
					}
				}
			},
			submitQuestions() {
				let answerObject = {};
				for (var i = 0; i < this.questions.length; i++) {
					for (var j = 0; j < this.questions[i].list.length; j++) {
						let key = this.questions[i].list[j].question_id;
						let value = JSON.stringify(this.questions[i].list[j].answer);
						answerObject[key] = value;
					}
				}
				let submitObject = {
					'exam_id': this.exam_id,
					'answer': answerObject,
					'isApp': 1
				}

				uni.showLoading({
					mask: true,
					title: '提交中'
				});
				var _this = this;
				uni.request({
					url: hrUrl,
					method: 'POST',
					dataType: 'json',
					header: {
							'content-type': 'application/x-www-form-urlencoded'
							},
					data: {
						'hrpId': this.hrpId,
						'hrpPwd': this.hrpPwd,
						'hrpUnitId': this.hrpUnitId,
						'authDate': this.authDate,
						'orgNo': this.orgNo,
						'context': this.context,
						'codeBlockName': 'hr_app_教学考试提交考卷',
						'params': JSON.stringify(submitObject)
					},
					success: res => {
						uni.showToast({
						  title: '成功交卷',
						  icon: 'success',
						  duration: 2000,
						});
						setTimeout(function() {
						  uni.navigateBack({
						    success: function () {
						      console.log('返回上一个页面成功');
						    }
						  });
						}, 2000);
					},
					fail: () => {
						uni.showToast({
						  title: '提交失败',
						  icon: 'error',
						  duration: 2000,
						});
					},
					complete: () => {
						uni.hideLoading();
					}
				});


			},

			radioChangeForPDGC(param) {
				this.questions[this.selectedTypePosition].list[this.currentIndex].answer[0].key = 'choice';
				if (param == 0) {
					this.questions[this.selectedTypePosition].list[this.currentIndex].answer[0].value = 'true';
					this.currentCheck = 0;
				} else {
					this.questions[this.selectedTypePosition].list[this.currentIndex].answer[0].value = 'false';
					this.currentCheck = 1;
				}
				this.qwewr[this.transForRealIndex(this.selectedTypePosition)][this.currentIndex] = 1;
			},
			textChange(e) {
				this.questions[this.selectedTypePosition].list[this.currentIndex].answer[1].key = 'answer';
				this.questions[this.selectedTypePosition].list[this.currentIndex].answer[1].value = e.detail.value;
				this.qwewr[this.transForRealIndex(this.selectedTypePosition)][this.currentIndex] = 1;
			},

			hideDrawer() {
				this.drawerVisible = false;
			},
			answeSheet() {
				this.drawerVisible = true;
			},
			radioChange(param) {
				var value = this.toChoice(param);
				this.questions[this.selectedTypePosition].list[this.currentIndex].answer[0].key = 'choice';
				this.questions[this.selectedTypePosition].list[this.currentIndex].answer[0].value = value;
				this.currentCheck = this.convertLetterToIndex(this.questions[this.selectedTypePosition].list[this
					.currentIndex].answer[0].value);
				this.qwewr[this.transForRealIndex(this.selectedTypePosition)][this.currentIndex] = 1;
			},
			radioChangeForTorF(param) {
				this.questions[this.selectedTypePosition].list[this.currentIndex].answer[0].key = 'choice';
				if (param == 0) {
					this.questions[this.selectedTypePosition].list[this.currentIndex].answer[0].value = 'true';
					this.currentCheck = 0;
				} else {
					this.questions[this.selectedTypePosition].list[this.currentIndex].answer[0].value = 'false';
					this.currentCheck = 1;
				}
				this.qwewr[this.transForRealIndex(this.selectedTypePosition)][this.currentIndex] = 1;
			},
			sumfontnum(e) {
				this.questions[this.selectedTypePosition].list[this.currentIndex].answer[0].key = 'answer';
				this.questions[this.selectedTypePosition].list[this.currentIndex].answer[0].value = e.detail.value;
				this.qwewr[this.transForRealIndex(this.selectedTypePosition)][this.currentIndex] = 1;
			},

			// 加载题目
			loadQuestions(time) {
				this.countDownTime(time); //倒计时几分钟
				this.getFirstQuestionType();
				this.currentQuestion = this.questions[this.firstQuesttionTypeIndex].list[this.currentIndex];
				this.currentType = this.questions[this.firstQuesttionTypeIndex].type;
				this.currentTypeSum = this.questions[this.firstQuesttionTypeIndex].list.length;
			},
			showDrawer() {
				this.$refs.showRight.open();
			},
			closeDrawer() {
				this.$refs.showRight.close();
			},
			switchtypeCheck(type, index){

				let length = this.questions[this.getTypeQuestion(type)].list.length
				if(length==0){
					uni.showToast({
						title: '没有此类题型',
						icon: 'error',
						//显示持续时间为 2秒
						duration: 2000
					})
				}else{
					this.switchType(type,index);
				}
			},
			// 切换题型
			switchType(type, index) {
				this.initData();
				if (type == '单选题') {
					this.currentType = '单选题';
					this.changeQuestion('单选题', index);
				}
				if (type == '多选题') {
					this.currentType = '多选题';
					this.changeQuestion('多选题', index);
				}
				if (type == '判断题') {
					this.currentType = '判断题';
					this.changeQuestion('判断题', index);
				}
				if (type == '简答题') {
					this.currentType = '简答题';
					this.changeQuestion('简答题', index);
				}
				if (type == '填空题') {
					this.currentType = '填空题';
					this.changeQuestion('填空题', index);
				}
				if (type == '判断改错题') {
					this.currentType = '判断改错题';
					this.changeQuestion('判断改错题', index);
				}

				this.closeDrawer();
			},
			changeQuestion(type, index) {
				if (type == '单选题') {
					this.getIndexQuestion(type, index);
					this.checkIsAnswerAndShow();
				}
				if (type == '多选题') {
					this.getIndexQuestion(type, index);
				}
				if (type == '判断题') {
					this.getIndexQuestion(type, index);
					this.checkIsAnswerAndShow();
				}
				if (type == '简答题') {
					this.getIndexQuestion(type, index);
					this.checkIsAnswerAndShow();
				}
				if (type == '填空题') {
					this.getIndexQuestion(type, index);
					this.checkIsAnswerAndShow();
				}
				if (type == '判断改错题') {
					this.getIndexQuestion(type, index);
					this.checkIsAnswerAndShow();
				}
			},

			getIndexQuestion(type, index) {

				this.currentIndex = index;
				this.selectedTypePosition = this.getTypeQuestion(type);
				this.currentTypeSum = this.questions[this.selectedTypePosition].list.length;
				this.currentQuestion = this.questions[this.selectedTypePosition].list[index];

			},

			checkIsAnswerAndShow() {
				if (this.currentType == '填空题') {
					for (var i = 0; i < this.currentQuestion.options.length; i++) {
						var value = this.currentQuestion.answer[i].value;
						if (value != null && value != '') {
							this.inputValues[i] = value;
						}
					}
					//循环判断没空的放入
				}

				if (this.currentQuestion.answer[0].key != null && this.currentQuestion.answer[0].key != '') {
					if (this.currentType == '单选题') {
						this.currentCheck = this.convertLetterToIndex(this.currentQuestion.answer[0].value);
					}
					if (this.currentType == '多选题') {

					}
					if (this.currentType == '判断题') {
						if (this.currentQuestion.answer[0].value == 'true') {
							this.currentCheck = 0;
						} else if (this.currentQuestion.answer[0].value == 'false') {
							this.currentCheck = 1;
						}
					}
					if (this.currentType == '简答题') {
						var value = this.currentQuestion.answer[0].value;
						if (value != null && value != '') {
							this.textArea = value;
						} else {
							this.textArea = '';
						}
					}
					if (this.currentType == '判断改错题') {
						var value = this.currentQuestion.answer[1].value;
						if (value != null && value != '') {
							this.textAreaForPDGC = value;
						} else {
							this.textAreaForPDGC = '';
						}
						if (this.currentQuestion.answer[0].value == 'true') {
							this.currentCheck = 0;
						} else if (this.currentQuestion.answer[0].value == 'false') {
							this.currentCheck = 1;
						}
					}
				}
			},

			toChoice(i) {
				const char = String.fromCharCode(i + 65);
				return char;
			},
			getTypeQuestion(type) {
				for (var i = 0; i < this.questions.length; i++) {
					if (this.questions[i].type == type) {
						return i;
					}
				}
			},
			convertLetterToIndex(letter) {
				const index = letter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)
				return index >= 0 && index <= 25 ? index : -1
			},
			countDownTime(showTime) { //showTime为传递的时间 默认在转化成分钟
				var that = this;
				that.times = showTime * 60
				that.timer = setInterval(function() {
					that.times--;
					var hour = Math.floor(that.times/60/60).toString();
					var minutes = Math.floor((that.times / 60)%60).toString();
					var seconds = Math.floor(that.times % 60).toString();
					
					that.remainingTime = `${hour.padStart(2,'0')}:${minutes.padStart(2,'0')}:${seconds.padStart(2,'0')}`
					if (that.times == 0) {
						//时间到了清除计时器
						clearInterval(that.timer);
						this.submitQuestions();
						uni.showToast({
							title: '考试结束',
							icon: 'error',
							//显示持续时间为 2秒
							duration: 2000
						})
					}
				}, 1000)
			}, //data定义的timeMsg为展示的倒计时时间
			getData() {
				uni.showLoading({
					mask: true,
					title: '查询中'
				});
				var _this = this;
				// this.exam_id = 'KS001';
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
						'codeBlockName': 'hr_app_教学获取考卷信息',
						'params': '{"exam_id":"' + this.exam_id + '","isApp":1}'
					},
					success: res => {
						let data = res.data.data;
						if (data.success == true) {
							this.questions = data.res;
		
							let time = this.getExamTime(data.examBean.current_time,data.examBean.end_time);
							
							this.loadQuestions(time);
							this.initAnswerSheet();
						} else {
							uni.showToast({
								title: data.message,
								icon: 'error',
								//显示持续时间为 2秒
								duration: 2000
							})
						}
					},
					fail: () => {

					},
					complete: () => {
						uni.hideLoading();

					}
				});

			},
			touchStart(e) {
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.startX = e.touches[0].clientX;
				}
			},
			touchEnd(e) {
				if (e.changedTouches.length == 1) {
					//手指移动结束后水平位置
					var endX = e.changedTouches[0].clientX;
					let diff = endX - this.startX;
					if (Math.abs(diff) > 100) {
						if (diff > 0) {
							this.lastQuestion();
						} else {
							this.nextQuestion();
						}
					}
				}
			},
			touchStartForDrawer(e) {
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.startY = e.touches[0].clientY;
				}
			},
			touchEndForDrawer(e) {
				if (e.changedTouches.length == 1) {
					//手指移动结束后水平位置
					var endY = e.changedTouches[0].clientY;
					let diff = endY - this.startY;
					if (Math.abs(diff) > 500) {
						if (diff > 0) {
							this.drawerVisible = false;
						}
					}
				}
			},
			
			//获取考试时间
			getExamTime(current,end){
				let endTime = new Date(end);
				let currentTime = new Date(current);				
				let timeDiff = endTime - currentTime;
				let minutesDiff = Math.floor(timeDiff / (1000 * 60));
				return minutesDiff
			},
			showFirstQuestion(){
				uni.showToast({
					title: '已经是第一题',
					icon: 'error',
					//显示持续时间为 2秒
					duration: 2000
				})
			},
			showFinalQuestion(){
				uni.showToast({
					title: '已经是最后一题',
					icon: 'error',
					//显示持续时间为 2秒
					duration: 2000
				})
			}


		}
	}
</script>

<style>
	.container {
		/* width: 100%; */
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}
	.question-type {
		width: 100%;
		margin-bottom: 20px;
	}

	.header {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.question-list {
		display: flex;
		flex-wrap: wrap;
	}

	.question-item {
		width: calc(20% - 10px);
		margin-bottom: 10px;
		text-align: center;
	}

	.circle {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10px;
	}


	.drawer2 {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 80vh;
		background-color: #d5d5d5;
		transition: transform 0.3s ease-in-out;
	}

	.inputAnswer {
		display: flex;
		flex-direction: column;
	}

	.inputAnswer2 {
		display: flex;
		flex-direction: row;
	}

	.bar {
		justify-content: space-between;
		align-items: center;
		padding: 3px;
		display: flex;
	}
	.bar1 {
		margin-top: 40px;

	}
	.drawer {
		padding: 30px;
	}
	.time {
		font-weight: bold;
		display: flex;
	}

	.type-switch {
		display: flex;
		font-weight: bold;
		align-items: center;
	}
	.card {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 100%;
		/* height: 100%; */
		padding: 20rpx;
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-bottom: 20rpx;
	}
	.exam-tag {
		/* border-radius: 27%; */
		margin-top: -10px;

	}

	.item {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 60rpx;
		height: 60rpx;
		background-color: #fff;
		border: 1rpx solid #666;
		border-radius: 50%;
		font-size: 28rpx;
		color: #333;
		cursor: pointer;
	}

	.active {
		background-color: #00f;
		/* 填充颜色为蓝色 */
		color: #fff;
	}
	.inputs {
		border: 2rpx solid #EAEAEA;
		border-radius: 10rpx;
		padding-top: 34rpx;
		padding-left: 35rpx;
		padding-right: 35rpx;
	}
	.text1 {
		width: 100%;
		color: #000000;
		font-size: 26rpx;
	}
	.option-container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
	}
	.imageClass {
		padding: 0 150rpx 0 20px;
		max-height: 150px;
	}

	.question {
		flex-grow: 1;
		position: relative;
	}

	.content {
		font-size: 40rpx;
		margin-bottom: 0rpx;
		/* padding: 0 20px; */
	}

	.content2 {
		padding: 0 0 0 20px;
		font-size: 18px;
		text-align: center;
	}

	.item-img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		box-shadow: 0rpx 0rpx 0rpx 10rpx #EEEFF0;
		opacity: 1
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.3);
		/* backdrop-filter: blur(10px); */

		z-index: 99;
	}

	.tabbar {
		display: flex;
		justify-content: space-between;
	}

	.list {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.tabbar-item {
		width: 100vh;
		justify-content: space-between;
		align-items: center;
		height: 120rpx;
		flex-direction: row;
		display: flex;


		font-size: 14px;
		padding: 20px;
	}

	.content3 {
		padding: 20px;
	}


	.icon {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 50px;
	}

	.options {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.option {
		height: 50%;
		display: flex;
		align-items: center;
		padding: 10px;
		cursor: pointer;
	}

	.textClass {
		padding: 0 0 0 5px;
	}


	.option2 {
		flex: none;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #eee;
		font-size: 18px;
		margin: 10px;
		border-radius: 5px;
	}

	.currentType {}

	.radio {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid #ccc;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10px;
	}

	.radio input[type="radio"] {
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: #ccc;
	}

	.radio input[type="radio"]:checked {
		background-color: #0081ff;
	}

	.text {
		font-size: 40rpx;
		margin-left: 10px;
		width: 40%;
	}

	.drawer {
		padding: 20px;
	}

	.title {
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 20px;
	}


	.type {
		padding: 10px;
		font-size: 20px;
		margin-right: 10px;
		margin-bottom: 10px;
		border: 2px solid #ccc;
		cursor: pointer;
	}

	.type.active {
		background-color: #0081ff;
		color: #fff;
		border-color: #0081ff;
	}
</style>