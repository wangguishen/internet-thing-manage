<template>
	<div class="l-father-div">
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item :to="{ path: '/facilityList' }">终端设备</el-breadcrumb-item>
					  <el-breadcrumb-item :to="{ path: '/facilityAdd' }">新增</el-breadcrumb-item>
					  <el-breadcrumb-item class="g-nav-list">批量录入</el-breadcrumb-item>
					</el-breadcrumb>
			  </el-col>
			  <el-col :span="16">
			  	<div class="grid-content bg-purple g-top-right">
			  		<el-button class="g-top-btn" size="mini" type="info" @click="back()">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<el-row>
			  <el-col :span="15">
			  	<div class="grid-content bg-purple">
			  		<div class="g-down-module">
			  			<span>点击下载模板</span>
			  			<el-button class="g-top-btn" size="mini" type="primary" @click="downloadBtn()">下载</el-button>
			  			<canvas ref="canvas" style="height: 0"></canvas>
			  		</div>
			  		<div class="g-up-module">
			  			<el-input class="g-search-ipt" v-model="iptValue" disabled></el-input>
			  			<!-- <el-button class="g-top-btn" size="mini" type="info" @click="selectBtn()">选择</el-button> -->
			  			<el-upload
							  class="upload-demo"
							  name="excel"
							  :action="actionUpload"
							  :auto-upload="false"
							  :on-preview="handlePreview"
							  :on-progress="handleProgress"
							  :on-remove="handleRemove"
							  :on-success="success"
            		:on-error="backError"
            		:on-change="changeFile"
							  :data="dataListes"
							  :on-exceed="handleExceed"
							  :limit="limit"
							  :show-file-list="false"
							  :file-list="fileList"
							  ref="upload">
							  <el-button class="s-select-btn g-top-btn" slot="trigger" size="mini" type="primary">选择</el-button>
							</el-upload>
			  		</div>
			  		<div class="g-sub-module">
			  			<el-button class="g-top-btn" size="mini" type="primary" @click="submitBtn()">提交</el-button>
			  		</div>
			  	</div>
			  </el-col>
			  <el-col :span="9">
			  	<div class="grid-content bg-purple-light">
			  		<div class="g-hint-module">
			  			<div>1.首先点击下载文件模板</div>
			  			<div>2.按照下载好的文件的表格形式填写好数据保存</div>
			  			<div>3.通过选择文件路径选择保存好的文件提交</div>
			  		</div>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<el-dialog class="g-sdk-details-box" width="25%" top="25vh" :visible.sync="dialogErrorVisible">
			<div slot="title" class="dialog-title">
		  	<span class="s-pass-text">设备录入失败</span>
	    </div>
	    <el-card class="box-card">
			  <div slot="header" class="clearfix">
			    <span>设备已存在</span>
			  </div>
			  <div v-for="(error,index) in errorList" :key="index" class="text item">
			    {{'设备'+(index+1)+': ' + error.sn}}
			  </div>
			</el-card>
		</el-dialog>
	</div>
</template>
<script>
export default {
	data () {
		return {
			iptValue: '',
			actionUpload: '/zqi_appstore/admin/addDevice.do',
			dataListes: {
				snType: 1
			},
			limit: 2,
			fileList: [],
			dialogErrorVisible: false,
			errorList: []
		}
	},
	methods: {
		back () {  //返回公司列表页面
			let self = this;
			self.$router.push('/facilityAdd')
		},
		downloadBtn () {  //下载
			window.location = '/zqi_appstore/temp/Template.xlsx'
		},
		handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    handleProgress (file) {  //文件上传时
    },
    handleExceed (file) {  //文件超出个数限制时
    },
    success (file, response) {
      let self = this
      let obj = JSON.parse(file.result)
      if (obj.retCode == 0) {
      	self.$message({
          message: '添加设备列表成功',
          type: 'success',
          duration: 1500,
          center: true
        });
        self.$router.push('/facilityList')
      } else if (obj.retCode == 1) {
        self.errorList = obj.errList
        self.dialogErrorVisible = true;
      }
    },
    backError (file, response) {
      let self = this
      self.$message.error("上传文件失败")
    },
    submitBtn () {  //提交
    	let self = this;
    	self.$refs.upload.submit();
    },
    changeFile (file, fileList) {
    	let self = this;
    	self.iptValue = file.name
    }
	}
}
</script>
<style lang="scss" scoped>
	.l-father-div{
		height:100%;
	}
	.g-main{
		text-align: left;
		min-height: 80%;
		background: #fff;
		padding: 15px;
		border: 1px solid #e3e9ec;
		border-radius: 3px;
	}
	.ipt_wid{
		width: 50%;
	}
	.s-company-bg-img{
		display: block;
		width: 28%;
		border-radius: 3px;
	}
	.g-down-module{
		font-size: 14px;
		font-weight: bold;
		margin-bottom: 25px;
		.g-top-btn{
			margin-left: 20px;
		}
	}
	.g-up-module{
		margin-bottom: 25px;
		.g-search-ipt{
			width:70%;
		}
		.g-top-btn{
			margin-left: 15px;
		}
	}
	.g-hint-module{
		width:90%;
		height: 200px;
		background-color: #fffafa;
		color:#96a8ae;
		font-size: 12px;
		padding: 50px 10px;
		box-sizing:border-box;
	}
	.upload-demo{
		display: inline-block;
	}
	.el-dialog{
		.el-dialog__body{
			padding: 25px 15px;
			.s-no-pass-cause{
				padding-left: 20px;
			}
		}
		.dialog-title{
			.s-pass-text{
				margin-left: 20px;
			}
		}
		.dialog-footer{
			margin-bottom: 20px;
			.s-yes-bg-ga-btn{
				margin-right: 20px;
			}
			.s-pass-sure{
				margin-left: 20px;
			}
		}
	}
	.text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card{
  	text-align: left;
  }
</style>