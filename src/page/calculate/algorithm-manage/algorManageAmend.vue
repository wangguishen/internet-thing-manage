<template>
	<div class="l-father-div">
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="8">
			  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
					  <el-breadcrumb-item :to="{ path: '/algorManage' }">算法管理</el-breadcrumb-item>
				  	<el-breadcrumb-item :to="{path: '/algorManageDetail'}">详情</el-breadcrumb-item>
				  	<el-breadcrumb-item>修改</el-breadcrumb-item>
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
			<el-form :model="algorithmObj" ref="form" class="g-form-ipt" :rules="rules">
				<el-form-item label="算法图标：" :label-width="formLabelWidth" prop="imgUrl">
					<el-upload
					  class="avatar-uploader avatar-upload-small fl"
					  :action="uploadImg"
					  name="imgFile"
					  :show-file-list="false"
					  :on-change="handleAvatarPreview"
					  :auto-upload="false"
					  list-type="picture"
					  accept=".jpg,.jpeg,.png"
					  ref="upload">
					  <img v-if="algorithmObj.img" :src="algorithmObj.img" class="g-avatar-icon" onerror="onerror=null;this.src='static/image/applyApp.png'">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<el-button class="s-four-text-btn" type="text" size="mini" @click="submitUpload">重新上传</el-button>
				</el-form-item>
				<el-form-item label="算法类型：" :label-width="formLabelWidth" prop="type">
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
					<el-input v-model="algorithmObj.name" :maxlength="NAME_MAX_LENGTH" placeholder="请输入算法名称" auto-complete="off" class="ipt_wid g-item-ipt"></el-input>
				</el-form-item>
				<el-form-item label="算法路径：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.path" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="当前版本：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.version" placeholder="请输入当前版本" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="大小：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.size" placeholder="请输入算法大小" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="状态：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.algStatu" placeholder="请输入状态" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="算法提供方：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.creator" :maxlength="NAME_MAX_LENGTH" placeholder="请输入算法提供方" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="描述：" :label-width="formLabelWidth" prop="descption">
					<el-input v-model="algorithmObj.descption" :maxlength="DESC_MAX_LENGTH" type="textarea" class="ipt_wid g-item-ipt"></el-input>
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
		</div>
	</div>
</template>
<script>
import {uploadImg} from '@/service/list'
import {getToken} from '@/util/storageUtil'
import {getRandomString} from '@/util/stringUtil'
import {queryAlgorithmInfo, updateAlgorithmInfo, queryAlgorithmTypeList} from '@/service/iot-frame'
import MyCropper from '@/components/my-cropper'
export default {
	components: {
		MyCropper
	},
	data () {
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
			algorithmId: '',
			loading: false,
			status: '',
			addShow: false,
			companyObj: {
				pathWay: ''
			},
			disabled: false,
			uploadImg: '/zqi_appstore/admin/uploadImg.do',
			algorithmObj: {
				imgUrl: '',
				imageUrl: ''
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
        type: [
          {validator: checkTypeCode, trigger: 'blur', required: true}
        ],
        descption: [
          {required: true, message: '请描述算法信息', trigger: 'blur'}
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
      blob: ''
		}
	},
	mounted () {
		let self = this;
		self.algorithmId = getToken("ARITHMETIC_OBJECT_ID")
		self.queryAlgorithmTypeList()
	},
	methods: {
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
				let id = '?id=' + self.algorithmId
				self.algorithm(id)
			} else {
			  self.$message.error('服务器错误')
			}
		},
		async algorithmAmend (data) { //请求 -- 当前算法详情
			let self = this;
			let algorithmData = await updateAlgorithmInfo(data)
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				self.$message.success("修改算法成功")
        self.$router.push('/algorManageDetail')
			} else {
				self.$message.error(algorithmData.data.message)
			}
		},
		async algorithm (url) { //请求 -- 修改操作
			let self = this;
			let algorithmData = await queryAlgorithmInfo(url)
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				console.log(algorithmData)
				let obj = algorithmData.data.data;
				let statu = '';
				if (obj.status == '0') {
					statu = '正常'
				} else {
					statu = '异常'
				}
				self.$set(obj, 'algStatu', statu)
				self.$set(obj, 'imgUrl', obj.img)
				self.options.img = obj.img
				self.imageUrl = obj.img
				self.algorithmObj = obj;
				self.selectedOptions2.push(self.algorithmObj.type)
			} else {
				self.$message.error(algorithmData.data.message)
			}
		},
		back () { //返回算法详情页
			let self = this;
			self.$router.push('/algorManageDetail')
		},
		handleAvatarPreview (file) { //选取文件
			let self = this;
			self.algorithmObj.img = file.url
			self.options.img = file.url
			self.algorithmObj.imgUrl = ''
			self.dialogCropperVisible = !self.dialogCropperVisible
		},
		sureClick (data, base) {
			let self = this
			self.algorithmObj.img = base
			self.imageUrl = base
			self.blob = data
			self.dialogCropperVisible = false;
		},
		closeClick () {
			let self = this;
			self.algorithmObj.img = self.imageUrl;
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
					self.algorithmObj.img = upload.data.imgUrl;
					self.imageUrl = upload.data.imgUrl;
					self.algorithmObj.imgUrl = upload.data.imgUrl;
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
    	console.log(self.algorithmObj.imgUrl)
    	// if (!self.algorithmObj.imgUrl) {
    	// 	self.algorithmObj.imgUrl = self.algorithmObj.img
    	// }
    	self.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
          	self.loading = true
            let data = {
            	"id": self.algorithmObj.id,
            	"name": self.algorithmObj.name,
            	"img": self.algorithmObj.imgUrl,
            	"descption": self.algorithmObj.descption,
            	"type": self.algorithmObj.type
            }
            self.algorithmAmend(data)
          } finally {
            self.loading = false
          }
        }
      })
    },
    compOptionsChange (value) { //改变算法类型 -- 操作
      let self = this
      if (self.selectedOptions2.length > 0) {
        self.compChange(self.selectedOptions2[self.selectedOptions2.length - 1])
      } else {
      	self.algorithmObj.type = ''
      	self.algorithmObj.typeName = ''
      }
    },
    compChange (compValue) { //改变算法类型 -- 值的切换
    	let self = this;
    	self.algorithmObj.type = compValue
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
</style>