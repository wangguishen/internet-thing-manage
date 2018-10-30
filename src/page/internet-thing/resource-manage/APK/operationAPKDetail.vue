<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationAPK'}">安装包</el-breadcrumb-item>
				  <el-breadcrumb-item>详情</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
        <el-button class="s-sure-btn g-top-btn" size="mini" type="primary" 
          @click="$router.push('/operationAPKDistribute')" v-show="distributeShow">
          分发
        </el-button>
  	    <el-button type="info" class="g-top-btn" size="mini"
          @click="$router.push('/operationAPK')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
			  <el-form label-width="80px" :model="form" class="g-form-ipt tl">
          <el-form-item label="公司名称:">
            <el-cascader
              :options="compOptions"
              v-model="selectedOptions"
              change-on-select
              filterable
              clearable
              :props="props"
              placeholder="请选择公司企业"
              disabled>
            </el-cascader>
          </el-form-item>
			    <el-form-item label="名称:">
			      <el-input v-model="form.fileName" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="版本:">
			      <el-input v-model="form.fileVersion" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="存储路径:">
			      <el-input v-model="form.pagePath" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="状态:">
			      <el-input v-model="form.status || '正常'" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="大小:">
			      <el-input v-model="form.size" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="上传用户:">
			      <el-input v-model="form.userName" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="描述:">
			      <el-input type="textarea" v-model="form.fileDesc" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-button class="s-sure-btn g-top-btn" size="mini" type="primary" 
            @click="$router.push('/operationAPKAmend')">
            修改
          </el-button>
          <el-button class="s-no-bg-xq-btn" size="mini" type="primary" @click="deleteSubmitBtn">删除</el-button>
			  </el-form>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
import {getToken, removeToken} from '@/util/storageUtil'
import {recursionDelete} from '@/util/arrayUtil'
import {companyList} from '@/service/list'
import {deleteAPKInfo} from '@/service/iot-frame'
import {changePageSize} from '@/util/numberUtil'
export default {
  data () {
    return {
      userInfo: {},
      compOptions: [],
      selectedOptions: [],
      distributeShow: true, //是否可以分发
      props: {
        label: 'comp_name',
        value: 'comp_code',
        children: 'enterprises'
      },
      form: {
      	fileName: '',
      	fileDesc: '',
      	fileVersion: '',
      	pagePath: '',
      	status: '',
      	pageSize: '',
        size: '',
      	userName: '',
      	userId: '',
        comp_code: '',
        merId: '',
        merName: ''
      },
      fileList: []
    };
  },
  mounted () {
		let self = this;
		self.form = getToken("atPresentAPKDetails", "json")
    self.form.size = changePageSize(self.form.pageSize, 1);
    self.distributeShow = self.form.flowStatus == 1;
    if (self.form.compCode) {
      self.selectedOptions = self.form.compCode.split(',')
    }
    let data = {compCode: '', type: "0"};
    self.companyLists(data, 'a')
	},
  methods: {
    async companyLists (data, type) {
      let self = this;
      let companyData = await companyList(data)
      if (companyData.status !== 200) {
        self.$message.error("服务器错误")
        return
      }
      if (companyData.status == 200 && companyData.data.success) {
        let list = companyData.data.data;
        if (type == 'a') {
          self.compOptions = recursionDelete(list)
        }
      } else {
        self.$message.error(companyData.data.msg)
      }
    },
    async deleteSubmitBtn () { //删除操作
    	let self = this
    	let isSuccess = true
    	await self.$confirm('确认删除此安装包吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      	isSuccess = true
      }).catch(() => {
        self.$message({
          type: 'info',
          message: '已取消删除!'
        });
        isSuccess = false
      });

      if (!isSuccess) return
      let resData = await deleteAPKInfo({"id": self.form.id})
      if (resData.status !== 200) {
        self.$message.error("服务器错误")
        return
      }
      if (resData.status === 200 && resData.data.status == '200') {
      	self.$message.success("删除成功")
      	removeToken('atPresentAPKDetails')
      	self.$router.push('/operationAPK')
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
  		.g-item-ipt {
  			width: 60%;
  		}
  		.upload-demo {
  			margin-left: 10px;
  		}
  		.s-sure-btn {
  			margin-left: 80px;
  		}
    }
  }
</style>

