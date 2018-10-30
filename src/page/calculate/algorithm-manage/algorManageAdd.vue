<template>
	<div class="l-father-div">
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item :to="{ path: '/algorManage' }">算法管理</el-breadcrumb-item>
				  	<el-breadcrumb-item class="g-nav-list">新增</el-breadcrumb-item>
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
			<el-form :model="formCompany" ref="form" class="g-form-ipt" :rules="rules">
				<el-form-item label="算法图标：" :label-width="formLabelWidth" prop="imgUrl">
					<el-upload
					  class="avatar-uploader avatar-upload-small fl"
					  :action="uploadImg"
					  name="imgFile"
					  :show-file-list="false"
					  :on-change="handleAvatarPreview"
					  :auto-upload="false"
					  list-type="picture"
					  accept=".jpg,.jpeg,.png">
					  <img v-if="formCompany.imageUrl" :src="formCompany.imageUrl" class="g-avatar-icon">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<el-button type="primary" size="mini" @click="submitUpload">上传</el-button>
				</el-form-item>
				<el-form-item label="算法类型：" :label-width="formLabelWidth" prop="genre">
					<el-cascader
            :options="compOptions"
            v-model="selectedOptions2"
            @change="compOptionsChange"
            change-on-select
            filterable
            clearable
            :props="selectObjCompany"
            style="width: 50%"
            placeholder="请选择所属类型">
          </el-cascader>
				</el-form-item>
				<el-form-item label="名称：" :label-width="formLabelWidth" prop="name">
					<el-input v-model="formCompany.name" :maxlength="NAME_MAX_LENGTH" placeholder="请输入算法名称" auto-complete="off" class="ipt_wid g-item-ipt"></el-input>
				</el-form-item>
				<el-form-item label="路径：" :label-width="formLabelWidth" prop="pagePath">
		      <el-upload
				    class="upload-demo inline-block g-upload-path"
				    ref="uploadFile"
				    :action="uploadFile"
				    :on-change="handleFilePreview"
				    :on-success="hendleSuccess"
				    :on-preview="handlePreview"
						:on-remove="handleRemove"
				    :auto-upload="false"
				    :show-file-list="true"
				    :limit="1"
				    :on-exceed="handleExceed">
				    <div>
				    	<el-input v-model="formCompany.pagePath" placeholder="请选择算法架包" class="g-item-ipt" disabled></el-input>
				    	<el-button class="s-select-btn g-top-btn" slot="trigger" size="mini" type="primary">选择</el-button>
					    <el-button
					    	class="s-select-btn g-top-btn"
					    	size="mini"
					    	type="primary"
					    	element-loading-customClass="g-custom-class"
					    	element-loading-background="rgba(255, 255, 255, 0.7)"
					    	element-loading-text="加密中，请稍后..."
					    	v-loading.fullscreen.lock="fullscreenLoading"
					    	@click.stop="submitPackagingUpload">
					    	加密
					    </el-button>
				    </div>
				  </el-upload>
		    </el-form-item>
				<el-form-item label="大小：" :label-width="formLabelWidth" prop="size">
					<el-input v-model="formCompany.size" placeholder="请输入算法大小" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="当前版本：" :label-width="formLabelWidth" prop="version">
					<el-input v-model="formCompany.version" placeholder="请输入当前版本号" auto-complete="off" class="ipt_wid g-item-ipt"></el-input>
				</el-form-item>
				<el-form-item label="算法提供方：" :label-width="formLabelWidth" prop="creator">
					<el-input v-model="formCompany.creator" :maxlength="NAME_MAX_LENGTH" placeholder="请输入算法提供方" auto-complete="off" class="ipt_wid g-item-ipt"></el-input>
				</el-form-item>
				<el-form-item label="描述：" :label-width="formLabelWidth" prop="descption">
					<el-input v-model="formCompany.descption" :maxlength="DESC_MAX_LENGTH" placeholder="请描述算法信息" type="textarea" class="ipt_wid g-item-ipt"></el-input>
				</el-form-item>
				<el-form-item :label-width="formLabelWidth">
					<el-button type="primary" size="mini" @click="sureRegister">保存</el-button>
				</el-form-item>
	  	</el-form>
	  	<el-dialog
			  title="剪切"
			  :visible.sync="dialogCropperVisible"
			  @close="closeClick"
			  >
			  <my-cropper :options="options" @sureClick="sureClick"></my-cropper>
			</el-dialog>
			<el-dialog
			  :visible.sync="dialogEncryptVisible"
			  class="s-encrypt-box"
			  :show-close="false"
			  @close="closeClick"
			  >
			  <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" status="success"></el-progress>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import {uploadImg} from '@/service/list'
import {changePageSize} from '@/util/numberUtil'
import {getRandomString} from '@/util/stringUtil'
import {addAlgorithmInfo, queryAlgorithmTypeList} from '@/service/iot-frame'
import MyCropper from '@/components/my-cropper'
export default {
	components: {
		MyCropper
	},
	data () {
		var checkStoragePath = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择一个安装包进行上传'))
      } else {
        callback()
      }
    }
		var uploadImage = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请上传算法图标'))
      } else {
        callback()
      }
    }
    var checkTypeCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择所属类型'))
      } else {
        callback()
      }
    }
		return {
			dialogEncryptVisible: false,
			showFileList: [],
			fullscreenLoading: false,
			percentage: 0,
			loading: false,
			status: '',
			addShow: false,
			companyObj: {
				pathWay: ''
			},
			disabled: false,
			uploadImg: '/zqi_appstore/admin/uploadImg.do',
			uploadFile: '/iot-frame/file_upload',
			formCompany: {
				name: '',
				version: '',
				size: '',
				status: '0',
				creator: '',
				descption: '',
				imageUrl: '',
				imgUrl: '',
				genre: '',
				pagePath: ''
			},
			imageUrl: '',
			formLabelWidth: '120px',
			// 选取接口
			compOptions: [],
			selectedOptions2: [],
      selectObjCompany: {
      	label: 'typeName',
        value: 'typeId'
      },
      rules: {
      	imgUrl: [
          {validator: uploadImage, trigger: 'blur', required: true}
        ],
        name: [
          {required: true, message: '请输入算法名称', trigger: 'blur'}
        ],
        version: [
          {required: true, message: '请输入当前版本号', trigger: 'blur'}
        ],
        size: [
          {required: true, message: '请输入算法大小', trigger: 'blur'}
        ],
        creator: [
          {required: true, message: '请输入算法提供方', trigger: 'blur'}
        ],
        descption: [
          {required: true, message: '请描述算法信息', trigger: 'blur'}
        ],
        genre: [
        	{validator: checkTypeCode, trigger: 'blur', required: true}
        ],
        pagePath: [
          {validator: checkStoragePath, trigger: 'blur', required: true}
        ]
      },
      // 剪切
      dialogCropperVisible: false,
      options: {
        img: '',
        size: 1,
        full: false, //输出原图比例截图 props名full
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      blob: '',
      timer: null
		}
	},
	mounted () {
		let self = this;
		self.queryAlgorithmTypeList()
	},
	methods: {
		submitPackagingUpload () {
			let self = this;
			if (self.formCompany.pagePath) {
				self.timer = setTimeout(() => {
	        self.fullscreenLoading = true;
	      }, 500);
				self.$refs.uploadFile.submit();
			} else {
				self.$message.warning('请先选择算法架包')
			}
		},
		async queryAlgorithmTypeList () { //请求 -- 所有算法类型
			let self = this
			let paramData = {
				"status": "0",
				"typeName": ''
		  }
			let resData = await queryAlgorithmTypeList('?pageSize=10000&currentPage=1', paramData)
			self.loading = false
    	if (resData.status !== 200) {
    		self.$message.error('服务器错误')
    		return
    	}
			if (resData.status === 200 && resData.data.message === 'success') {
				let list = resData.data.data
				self.compOptions = list
			} else {
			  self.$message.error('服务器错误')
			}
		},
		compOptionsChange (value) { //改变算法类型 -- 操作
      let self = this
      if (self.selectedOptions2.length > 0) {
        self.compChange(self.selectedOptions2[self.selectedOptions2.length - 1])
      } else {
      	self.formCompany.genre = ''
      }
    },
    compChange (compValue) { //改变算法类型 -- 值的切换
    	let self = this;
    	self.formCompany.genre = compValue
  	},
		async algorithm (data) { //请求 -- 算法新增操作
			let self = this;
			let algorithmData = await addAlgorithmInfo(data)
			if (algorithmData.status !== 200) {
				self.$message.error("服务器错误")
				return
			}
			if (algorithmData.status == 200) {
				self.$message.success('新增算法成功')
				self.$router.push('/algorManage')
			} else {
				self.$message.error(algorithmData.data.message)
			}
		},
		back () { //返回算法管理列表页面
			let self = this;
			self.$router.push('/algorManage')
		},
		handleAvatarPreview (file) { //选取图片
			let self = this;
			self.formCompany.imageUrl = file.url
			self.options.img = file.url
			self.dialogCropperVisible = !self.dialogCropperVisible
		},
		handleFilePreview (file) { //选择上传文件
			let self = this;
			console.log(8888888888)
			self.formCompany.pagePath = file.name
			self.formCompany.size = changePageSize(file.size, 1);
			console.log(file)
		},
		sureClick (data, base) {
			let self = this
			self.formCompany.imgUrl = ''
			self.formCompany.imageUrl = base
			self.imageUrl = base;
			self.blob = data
			self.dialogCropperVisible = false;
		},
		closeClick () {
			let self = this;
			self.formCompany.imageUrl = self.imageUrl;
		},
		async submitUpload () { //点击上传
			let self = this;
			if (self.blob) {
				var formdata = new FormData();
	      formdata.append("imgFile", self.blob, getRandomString(16) + '.jpg');
	      let upload = await uploadImg(formdata)
	      if (upload.status !== 200) {
					self.$message.error("服务器错误")
					return
				}
				if (upload.status == 200) {
					self.formCompany.imgUrl = upload.data.imgUrl;
					self.imageUrl = upload.data.imgUrl;
	      	self.$message.success('上传图标成功')
				} else {
					self.$message.error('上传图标失败')
				}
			} else {
				self.$message.warning('请先选择算法图标')
			}
    },
    sureRegister () { //保存按钮 -- 提交
    	let self = this;
    	self.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
          	self.loading = true
            let data = {
            	"name": self.formCompany.name,
            	"img": self.formCompany.imgUrl,
            	"version": self.formCompany.version,
            	"creator": self.formCompany.creator,
            	"size": self.formCompany.size,
            	"descption": self.formCompany.descption,
            	"status": self.formCompany.status,
            	"type": self.formCompany.genre,
            	"path": self.formCompany.pagePath
            }
            self.algorithm(data)
          } finally {
            self.loading = false
          }
        }
      })
    },
    hendleSuccess (response, file, fileList) { //上传成功时的钩子
    	let self = this
    	console.log("---------------------------")
    	console.log(response)
    	console.log(file)
    	console.log(fileList)
    	setTimeout(() => {
    		self.fullscreenLoading = false;
  			// self.fullscreenLoading.close();
	    	clearTimeout(self.timer)
	      fileList.splice(0, 1)
    		if (response.message == 'success') {
		    	self.formCompany.pagePath = response.data
		      self.formCompany.size = changePageSize(file.size, 1);
		      self.$message.success('加密成功')
    		} else {
    			self.$message.error("加密失败", response)
    		}
    	}, 500)
    	// self.form.pageSize = file.size;
      // let arr = response.data.split('.')
      // self.formCompany.extension = arr[arr.length - 1]
      // self.showFileList = fileList
      console.log(self.formCompany)
    },
    handleError (response, file, fileList) { //上传失败时的钩子
    	let self = this
    	self.fullscreenLoading = false;
    	self.$message.error("加密失败", response)
    },
    handleRemove (file, fileList) { //文件列表移除文件时的钩子
    	console.log("+++++++++++++++++++++++++++++")
    },
    handlePreview (file) { //点击已上传的钩子
    	console.log("===================================")
    },
    handleExceed (files, fileList) {
    	console.log('111111111', files)
    	console.log(fileList)
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
		padding: 15px 0 10px;
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
	.avatar-uploader,.avatar-uploader-icon{
		width:40px;
		height:40px;
		line-height: 40px;
	}
	.g-item-ipt {
		width: 60%;
	}
	.s-select-btn{
		margin-left: 10px;
	}
</style>