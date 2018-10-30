<template>
  <div>
  	<el-dialog class="g-sdk-details-box g-renew-box" width="30%" min-height="30vh" top="25vh" 
		  :visible.sync="showes" :before-close="closeDialogShow">
			<div slot="title" class="dialog-title">
	  		<span class="s-pass-text">{{deploy.name}}</span>
	    </div>
	    <el-form class="g-form-ipt g-unpass-ta">
    		<template v-for="item of moduleApply">
  				<el-form-item :label="item.name+'：'" :label-width="formLabelWidth">
	    			<el-input v-model="item.degree" placeholder="请输入次数" type="number" auto-complete="off" class="g-ipt-number g-item-ipt " clearable></el-input>
					</el-form-item>
    		</template>
	    </el-form>
	    <div class="s-unreg-box" v-if="moduleUnreg.length != 0">
	    	<div class="sm-title-unreg">
	    		退订算法：
	    	</div>
	    	<div class="sm-list-unreg">
	    		<template v-for="(item, index) of moduleUnreg">
		    		<span>{{item.name}}</span>
		    		<template v-if="index != moduleUnreg.length - 1">、</template>
		    	</template>
	    	</div>
	    </div>
	    <el-row class="g-fotter-bth">
			  <el-col :span="12">
			  	<el-button type="info" size="mini" @click="closeDialogShow">
	  	      返回
	  	    </el-button>
			  </el-col>
			  <el-col :span="12">
	  	    <el-button type="primary" size="mini" @click="UpdateDeviceAppsReq">
	  	      确定
	  	    </el-button>
			  </el-col>
			</el-row>
		</el-dialog>
  </div>
</template>

<script>
export default {
	data () {
		return {
			formLabelWidth: '120px'
		}
	},
	props: {
    showes: Boolean,
    moduleUnreg: Array, //退订的算法
    moduleApply: Array, //申请的算法
    deploy: Object
  },
	mounted () {
		console.log(this.data)
	},
	methods: {
		UpdateDeviceAppsReq () {
			let self = this;
			self.$emit('sureClick')
		},
		closeDialogShow () {
			let self = this;
			self.$emit('closeDialogShow')
		}
	}
}
</script>

<style lang="scss" scoped>
.g-sdk-details-box {
  .el-dialog .el-dialog__body .el-form-item {
    margin-bottom: 10px;
  }	
  .s-pass-text {
  	font-size: 14px;
  	padding: 15px;
  }
  .g-textarea {
  	min-height: 100px;
  }
  .g-form-ipt{
  	width: 80%;
  }
  .g-fotter-bth{
  	padding: 30px 0 0;
  	text-align: center;
  }
  .s-unreg-box{
  	display: flex;
  	align-items: center;
  	width: 100%;
  	height: 5em;
  	text-align: left;
  	background-color: #ECECEC;
  	.sm-title-unreg{
  		width: 120px;
  		text-align: right;
  		font-size: bold;
  		padding: 0 12px 0 0;
	    box-sizing: border-box;
  	}
  	.sm-list-unreg{
  		width: calc(100% - 120px);
  		span{
  			color: #8d0000;
  		}
  	}
  }
}
</style>