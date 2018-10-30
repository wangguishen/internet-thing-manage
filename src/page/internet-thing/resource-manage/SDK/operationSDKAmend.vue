<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationSDK'}">SDK</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/operationSDKDetail'}">详情</el-breadcrumb-item>
				  <el-breadcrumb-item>修改</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/operationSDKDetail')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
			  <el-form label-width="80px" :model="form" class="g-form-ipt tl">
			    <el-form-item label="公司名称:">
			      <el-cascader
					    expand-trigger="hover"
					    :options="options"
					    v-model="selectedOptions"
					    :props="props"
					    @change="handleChange">
					  </el-cascader>
			    </el-form-item>
			    <el-form-item label="名称:">
			      <el-input v-model="form.sdkName" class="g-item-ipt" :maxlength="NAME_MAX_LENGTH"></el-input>
			    </el-form-item>
			    <el-form-item label="版本:">
			      <el-input v-model="form.sdkVersion" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="路径:">
			      <el-input v-model="form.storagePath" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="上传用户:">
			      <el-input v-model="form.creator" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="使用次数:">
			      <el-input v-model="form.addNum" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="描述:">
			      <el-input type="textarea" v-model="form.sdkDesc" class="g-item-ipt" :maxlength="DESC_MAX_LENGTH"></el-input>
			    </el-form-item>
			    <el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="updateSdkInfo">提交</el-button>
			  </el-form>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
  import {recursionDelete} from '@/util/arrayUtil'
  import { setToken, getToken, getLocalStorage } from '@/util/storageUtil'
  import { updateSdkInfo } from '@/service/iot-frame'
  import {companyList} from '@/service/list'
  export default {
    data () {
      return {
        options: [],
        selectedOptions: [],
        form: {
        	sdkName: '',
          sdkVersion: '',
        	storagePath: '',
          creator: '',
          addNum: '',
          sdkDesc: '',
          compCode: ''
        },
        comp_code: '',
        props: {
          label: 'comp_name',
          value: 'comp_code',
          children: 'enterprises'
        }
      };
    },
    mounted () {
      let self = this
      self.comp_code = getLocalStorage('USER_INFO', 'json').compCode || ''
      self.form = getToken('SDK_ROW_DETAIL', 'json')
      self.selectedOptions = self.form.compCode.split(",")
      self.companyList()
    },
    methods: {
      handleChange (value) {
        let self = this
        self.selectedOptions = value
        self.form.compCode = self.selectedOptions.join(',')
      },
      async companyList () {
        let self = this
        let params = {"compCode": self.comp_code, "type": 0}
        let resData = await companyList(params)
        if (resData.status === 200) {
          self.options = recursionDelete(resData.data.data)
        }
      },
      async updateSdkInfo () {
        let self = this
        let resData = await updateSdkInfo(self.form)
        if (resData.status === 200) {
          self.$message.success('修改成功')
          setToken('SDK_ROW_DETAIL', self.form)
          self.$router.push('/operationSDKDetail')
        } else {
          self.$message.error('服务器错误')
        }
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
  }
	.g-item-ipt {
		width: 60%;
	}
	.upload-demo {
		margin-left: 10px;
	}
	.s-sure-btn {
		margin-left: 80px;
	}
</style>

