<template>
  <div>
    <el-row class="g-header">
      <el-col :span="8">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
          <el-breadcrumb-item :to="{path: '/adminList'}">管理员列表</el-breadcrumb-item>
          <el-breadcrumb-item>新增</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="16" class="tr">
        <el-button type="info" size="mini" @click="$router.push('/adminList')">
          返回
        </el-button>
      </el-col>
    </el-row>
    <el-row class="g-wrap">
      <!-- 公司 -->
      <el-col :span="4" class="g-dt tl">
        <span>所&nbsp;属&nbsp;公&nbsp;司: </span>
      </el-col>
      <el-col :span="12">
        <el-select v-model="value8" filterable placeholder="请选择公司名称" size="small"
          @change="optionsChange" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.name"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <!-- 管理员 -->
      <el-col :span="4" class="g-dt tl">
        <span>管理员名称: </span>
      </el-col>
      <el-col :span="12" class="tr">
        <!-- 用户 -->
        <el-select
          v-model="value9"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          size="small"
          @change="userChange"
          style="width:100%">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" class="tl">
        <el-button type="primary" class="g-top-btn" size="mini" @click="addAdmin">
          保存 
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { verServer } from '@/service/list'
  import { apiFindUser } from '@/service/account-auth-admin'
  import { getLocalStorage } from '@/util/storageUtil'
  import { addAdmin } from '@/service/iot-frame'
  export default {
    data () {
      return {
        value8: '',
        options: [],
        compCode: '',
        options4: [],
        value9: '',
        list: [],
        loading: false,
        states: [],
        sessionId: '',
        queryKey: '',
        selectComp: '',  //选中公司
        selectUsers: ''  //选中用户
      }
    },
    mounted () {
      this.sessionId = getLocalStorage('sessionId')
      this.queryData()
    },
    methods: {
      async queryData () {
        let self = this
        let GetDeviceListReqData = {
          "commandId": 0x0515,
          "reqNode": "WEB",
          "body": {
            "pageSize": 10000,
            "pageIndex": 1,
            "compCode": self.compCode
          }
        }
        let resData = await verServer(GetDeviceListReqData)
        if (resData.status !== 200) {
          self.$message.error('服务器错误')
          self.loading = false
          return
        }
        if (resData.data.retCode !== 0) {
          self.$message.error(resData.data.errMsg)
          self.loading = false
          return
        }
        let list = resData.data.body.merList
        list.forEach((item, index) => {
          self.options.push({
            name: item.merName,
            value: JSON.stringify({
              compName: item.merName,
              compCode: item.compCode
            })
          })
        })
      },
      async apiFindUser () {
        let self = this
        let paramData = {
          pageSize: 10000,
          pageNumber: 1,
          key: self.queryKey || "null",
          sessionId: self.sessionId,
          sort: ''
        }
        let resData = await apiFindUser(paramData)
        if (resData.data.status !== 1) return
        let list = resData.data.data.items

        self.options4 = []
        list.forEach((item, index) => {
          self.options4.push({
            label: item.userName,
            value: JSON.stringify({
              'userName': item.userName,
              'userId': item.userId,
              'password': item.password
            })
          })
        })
      },
      optionsChange (value) {
        this.selectComp = JSON.parse(value)
      },
      userChange (value) {
        this.selectUsers = JSON.parse(value)
      },
      remoteMethod (query) {
        this.queryKey = query
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.apiFindUser()
          }, 2000);
        } else {
          this.options4 = [];
        }
      },
      async addAdmin () {
        let self = this
        if (self.selectComp === '') {
          self.$message.warning('请先选择公司')
          return
        }

        if (self.selectUsers === '') {
          self.$message.warning('用户不能为空')
          return
        }

        /*let temp = self.selectComp.compCode.split(',')
        let compCode = temp[temp.length - 1]*/

        let paramData = {
          userId: self.selectUsers.userId,
          userName: self.selectUsers.userName,
          password: self.selectUsers.password,
          compCode: self.selectComp.compCode,
          status: '1'
        }

        let resData = await addAdmin(paramData)
        if (resData.status == 200 && resData.data.message === 'success') {
          self.$message.success('授权成功')
          self.$router.push('/adminList')
        } else {
          self.$message.error(resData.data.message)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .g-wrap {
    margin-top: 60px;
  }
  .g-dt {
    line-height: 32px;
    font-size: 14px;
    margin-bottom: 40px;
  }
</style>