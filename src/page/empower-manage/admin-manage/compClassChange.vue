<template>
	<div v-loading="loading">
		<el-row class="g-header">
		  <el-col :span="4">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item>管理员授权</el-breadcrumb-item>
				</el-breadcrumb>
		  </el-col>
		  <el-col :span="16" class="tl">
		    公司名称:&nbsp;<span>{{merName}}</span>
		  </el-col>
		  <el-col :span="4" class="tr">
  	    <el-button type="info" class="g-top-btn" size="mini" @click="$router.push('/adminList')">返回</el-button>
		  </el-col>
		</el-row>
		<el-row>
			<el-col :span="24" class="tl g-checkbox">
			  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
			  </el-checkbox>
			  <div style="margin: 15px 0;"></div>
			  <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
			    <el-checkbox v-for="city in cities" :label="city.typeId" :key="city.typeId" :value="city.typeId">
            <span :title="city.typeName">{{city.typeName}}</span>
          </el-checkbox>
			  </el-checkbox-group>
			</el-col>
		</el-row>
		<el-row>
		  <el-col :span="24">
		    <el-button type="primary" class="g-submit-btn" size="mini" @click="algoAuthorization">
  	      授权
  	    </el-button>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
  import { getToken, getLocalStorage } from '@/util/storageUtil'
  import { queryAlgorithmTypeList, queryCompAuth, algoAuthorization } from '@/service/iot-frame'
  var cityOptions = [];
  export default {
    data () {
      return {
        checkAll: false,
        checkedCities: [],
        cities: cityOptions,
        isIndeterminate: false,
        merName: '',
        compCode: '',
        account: '',
        loading: true,
        firstCities: []
      };
    },
    mounted () {
    	this.merName = getToken('ADMIN_MERDATA', 'json').merName || ''
      let userInfo = getLocalStorage('USER_INFO', 'json')
      this.account = userInfo.account
      this.compCode = getToken('ADMIN_MERDATA', 'json').compCode || ''
      this.queryAlgorithmTypeList()
    },
    methods: {
      async queryAlgorithmTypeList () {
        let self = this
        let qParamData = `?pageSize=10000&currentPage=1`
        let paramData = {
          status: '0',
          typeName: ''
        }
        let resData = await queryAlgorithmTypeList(qParamData, paramData)
        if (resData.status == 200 && resData.data.message === 'success') {
          cityOptions = resData.data.data
          self.cities = cityOptions
          self.queryCompAuth()
        }
      },
      async queryCompAuth () {
        let self = this
        let qParamData = `?pageSize=10000&currentPage=1`
        let paramData = {
          compCode: self.compCode
        }
        let resData = await queryCompAuth(qParamData, paramData)
        if (resData.status == 200 && resData.data.message === 'success') {
          let list = resData.data.data
          list.forEach((item, index) => {
            self.checkedCities.push(item.typeid)
            self.firstCities.push(item.typeid)
          })
          self.handleCheckedCitiesChange(self.checkedCities)
        }
        self.loading = false
      },
      handleCheckAllChange (val) {
        let self = this
        self.checkedCities = []
        if (val === true) {
          cityOptions.forEach(function (item, index) {
            self.checkedCities.push(item.typeId)
          })
        } else {
          self.checkedCities = []
        }
        self.isIndeterminate = false;
      },
      handleCheckedCitiesChange (value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      async algoAuthorization () {
        let self = this
        self.loading = true
        let paramData = [{
          compCode: self.compCode,
          userName: self.account
        }]
        for (let i in this.checkedCities) {
          paramData.push({
            compCode: self.compCode,
            userName: self.account,
            typeid: this.checkedCities[i]
          })
        }

        if (JSON.stringify(self.checkedCities) === JSON.stringify(self.firstCities)) {
          self.$message.warning('没有发生改变')
          self.loading = false
          return
        }

        let resData = await algoAuthorization(paramData)
        if (resData.status == 200 && resData.data.message === 'success') {
          self.$message.success('授权成功')
        } else {
          self.$message.error(resData.data.message)
        }
        self.loading = false
      }
    }
  };
</script>

<style scoped lang="scss">
  .tl {
  	line-height: 30px;
  	font-size: 14px;
  	>span {
	    color: #112331;
	    font-weight: bold;
  	}
  }
  .g-checkbox {
  	margin-top: 40px;
  }
  .g-submit-btn {
  	margin-top: 30px;
  }
</style>