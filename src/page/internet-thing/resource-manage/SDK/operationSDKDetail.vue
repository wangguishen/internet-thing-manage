<template>
	<div>
		<el-row class="g-header">
		  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationSDK'}">SDK</el-breadcrumb-item>
				  <el-breadcrumb-item>详情</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tr">
        <el-button class="s-sure-btn g-top-btn" size="mini" type="primary" 
          @click="$router.push('/operationSDKRenew')" v-show="xqShow">
          续签
        </el-button>
  	    <el-button type="info" class="g-top-btn" size="mini"
          @click="$router.push('/operationSDK')">
  	      返回
  	    </el-button>
		  </el-col>
		</el-row>
		<el-row class="g-content">
		  <el-col :span="24">
			  <el-form label-width="80px" :model="form" class="g-form-ipt tl">
          <el-form-item label="所属公司:">
            <!-- <el-input v-model="form.compCode" class="g-item-ipt" disabled="disabled"></el-input> -->
            <el-cascader
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              :props="props"
              disabled="disabled">
            </el-cascader>
          </el-form-item>
			    <el-form-item label="名称:">
			      <el-input v-model="form.sdkName" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="版本:">
			      <el-input v-model="form.sdkVersion" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="路径:">
			      <el-input v-model="form.storagePath" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="状态:">
			      <el-input v-model="form.status || '正常'" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="上传时间:">
			      <el-input v-model="form.createTime" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-form-item label="上传用户:">
			      <el-input v-model="form.creator" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
          <el-form-item label="使用次数:">
            <el-input v-model="form.addNum" class="g-item-ipt" disabled="disabled"></el-input>
          </el-form-item>
			    <el-form-item label="描述:">
			      <el-input type="textarea" v-model="form.sdkDesc" class="g-item-ipt" disabled="disabled"></el-input>
			    </el-form-item>
			    <el-button class="s-sure-btn g-top-btn" size="mini" type="primary" 
            @click="$router.push('/operationSDKAmend')">
            修改
          </el-button>
          <el-button class="s-no-bg-xq-btn" size="mini" type="primary" @click="deleteSdkInfo">删除</el-button>
			  </el-form>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
  import { formatTime } from '@/util/dateUtil'
  import { getToken, removeToken } from '@/util/storageUtil'
  import { queryVisaInfo, deleteSdkInfo } from '@/service/iot-frame'
  import {companyList} from '@/service/list'
  import {recursionDelete} from '@/util/arrayUtil'
  export default {
    data () {
      return {
        form: {},
        xqShow: false,
        options: [],
        selectedOptions: [],
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
      self.form = getToken('SDK_ROW_DETAIL', 'json')
      self.form.createTime = self.form.createTime !== null ? formatTime(self.form.createTime, '{y}/{m}/{d} {h}:{i}') : self.form.createTime
      self.selectedOptions = self.form.compCode.split(",")
      self.queryVisaInfo()
    },
    methods: {
      async deleteSdkInfo () {
      	let self = this
      	let isSuccess = true
      	await self.$confirm('确认删除此SDK吗?', '提示', {
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
        let resData = await deleteSdkInfo({"id": self.form.id})
        if (resData.status === 200) {
        	self.$message.success("删除成功")
        	removeToken('SDK_ROW_DETAIL')
        	self.$router.push('/operationSDK')
        } else {
        	self.$message.error('服务器错误')
        }
      },
      async queryVisaInfo () {
        let self = this
        let resData = await queryVisaInfo({"id": self.form.id})
        if (resData.status === 200) {
          if (resData.data.data !== null) self.xqShow = true
        } else {
          self.$message.error('服务器错误')
        }
        self.companyList()
      },
      async companyList () {
        let self = this
        let params = {"compCode": self.comp_code, "type": 0}
        let resData = await companyList(params)
        if (resData.status === 200) {
          self.options = recursionDelete(resData.data.data)
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

