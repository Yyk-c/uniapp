<template>
  <view class="container">
    <view v-for="(questionType, index) in questionTypes" :key="index" class="question-type">
      <view class="header">{{ questionType.title }}</view>			
															  
      <view class="question-list">
        <view 
          v-for="(question, questionIndex) in questionType.questions" 
          :key="questionIndex" 
          class="question-item circle"
		  :style="{'background-color':qwewr[questionIndex]==1? '#00aaff':'#ffffff'}"
        >
         <text class="circle-number" @click="transToQuestion(questionIndex+1)">{{ questionIndex + 1 }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      questionTypes: [{
        title: '题型一',
        questions: ['题目1', '题目2', '题目3', '题目4', '题目5', '题目6', '题目7', '题目7', '题目7', '题目7', '题目7', '题目7', '题目7', '题目7', '题目7', '题目7' ,'题目7', '题目7']
      }, {
        title: '题型二',
        questions: ['题目1', '题目2', '题目3', '题目4']
      }, {
        // 更多题型...
      }],
	  qwewr:[]
    };
	
  },
  methods:{
  	transToQuestion(index){
  		this.qwewr[index-1] = 1;
		alert(index)
		this.$forceUpdate()
  	}
  }
};
</script>

<style scoped>
.container {
/*  display: flex;
  flex-direction: column;
  align-items: center; */
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

</style>