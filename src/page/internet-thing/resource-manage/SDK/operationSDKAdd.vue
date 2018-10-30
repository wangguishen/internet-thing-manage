<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationSDK'}">SDK</el-breadcrumb-item>
				  <el-breadcrumb-item>新增</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/operationSDK')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
			  <el-form label-width="100px" :model="form" class="g-form-ipt tl" :rules="rules" ref="form">
			    <el-form-item label="公司名称:" prop="compCode">
			      <el-cascader
					    expand-trigger="hover"
					    :options="options"
              change-on-select
              filterable
              clearable
					    v-model="selectedOptions"
					    :props="props"
					    @change="handleChange">
					  </el-cascader>
			    </el-form-item>
			    <el-form-item label="名称:" prop="sdkName">
			      <el-input v-model="form.sdkName" class="g-item-ipt" :maxlength="NAME_MAX_LENGTH"></el-input>
			    </el-form-item>
			    <el-form-item label="路径:" prop="storagePath">
			      <el-input v-model="form.storagePath" class="g-item-ipt" disabled="disabled"></el-input>
			      <el-upload
					    class="upload-demo inline-block"
					    action="/iot-frame/file_upload"
					    :on-success="hendleSuccess"
					    :on-error="handleError"
					    :auto-upload="true"
					    :show-file-list="false">
					    <el-button class="s-select-btn g-top-btn" slot="trigger" size="mini" type="primary">选择</el-button>
					  </el-upload>
			    </el-form-item>
          <el-form-item label="大小:">
            <el-input v-model="form.sdkSize" class="g-item-ipt" disabled="disabled"></el-input>
          </el-form-item>
			    <el-form-item label="上传用户:">
			      <el-input v-model="form.creator" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="使用次数:" prop="addNum">
			      <el-input v-model="form.addNum" class="g-item-ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="描述:">
			      <el-input type="textarea" v-model="form.sdkDesc" class="g-item-ipt txtarea" :maxlength="DESC_MAX_LENGTH"></el-input>
			    </el-form-item>
			    <el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="addSdkInfo">提交</el-button>
			  </el-form>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
  import {companyList} from '@/service/list'
  import {addSdkInfo} from '@/service/iot-frame'
  import {recursionDelete} from '@/util/arrayUtil'
  import {getLocalStorage} from '@/util/storageUtil'
  export default {
    data () {
      var checkAddNum = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('使用次数不能为空'))
        }
        setTimeout(() => {
          if (!Number.isInteger(Number(value))) {
            callback(new Error('请输入数字值'));
          } else {
            if (value <= 0) {
              callback(new Error('使用次数不能小于1次'))
            } else {
              callback()
            }
          }
        }, 1000);
      }
      var checkStoragePath = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请选择一个SDK进行上传'))
        } else {
          callback()
        }
      }

      var checkCompCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请至少选择一个公司'))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        options: [],
        selectedOptions: [],
        form: {
        	sdkName: '',
        	sdkDesc: '',
          sdkSize: '',
        	storagePath: '',
        	compCode: '',
        	creator: '',
        	addNum: '',
          applicant: ''
        },
        fileList: [],
        comp_code: '',
        props: {
          label: 'comp_name',
          value: 'comp_code',
          children: 'enterprises'
        },
        rules: {
          sdkName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          storagePath: [
            { validator: checkStoragePath, trigger: 'blur', required: true }
          ],
          comp_code: [
            { type: 'array', required: true, message: '请至少选择一个公司', trigger: 'change' }
          ],
          addNum: [
            { validator: checkAddNum, trigger: 'blur', required: true }
          ],
          compCode: [
            { validator: checkCompCode, trigger: 'blur', required: true }
          ]
        }
      };
    },
    mounted () {
      let self = this
      let userInfo = getLocalStorage('USER_INFO', 'json')
      self.form.applicant = self.form.creator = userInfo.userName || userInfo.account
      self.comp_code = userInfo.compCode || ''
      self.companyList()
    },
    methods: {
      handleChange (value) {
      	let self = this
        self.selectedOptions = value
        self.form.compCode = self.selectedOptions.join(',')
      },
      submitUpload () {
        this.$refs.upload.submit();
      },
      hendleSuccess (response, file, fileList) {
      	let self = this
        console.log(response, file, fileList)
        self.form.sdkSize = file.size
      	self.form.storagePath = response.data
        self.$message.success('上传成功')
      },
      handleError (response, file, fileList) {
      	let self = this
      	self.$message.error("上传失败", response)
      },
      async companyList () {
        let self = this
        let params = {"compCode": self.comp_code, "type": 0}
        let resData = await companyList(params)
        if (resData.status === 200) {
          self.options = recursionDelete(resData.data.data)
        }
      },
      addSdkInfo () {
      	let self = this
        self.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              self.loading = true
              let resData = await addSdkInfo(self.form)
              if (resData.status === 200) {
                self.$message.success("新增成功")
                self.$router.push("/operationSDK")
              } else {
                self.$message.error("新增失败", resData.message)
              }
            } finally {
              self.loading = false
            }
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
	.g-content {
		border: 1px solid #e3e9ec;
		background: #fff;
		padding: 15px;
    .g-form-ipt {
      margin-bottom: 60px;
    }
		.g-item-ipt {
			width: 60%;
		}
		.upload-demo {
			margin-left: 10px;
		}
		.s-sure-btn {
			margin-left: 100px;
		}
    .txtarea {
      padding-top: 10px;
    }
	}
</style>

