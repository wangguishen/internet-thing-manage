<template>
  <div>
    <el-row class="g-header">
      <el-col :span="8">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
          <el-breadcrumb-item :to="{path: '/operationSDK'}">SDK</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/operationSDKDetail'}">详情</el-breadcrumb-item>
          <el-breadcrumb-item>续签</el-breadcrumb-item>
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
        <el-form label-width="115px" :model="form" class="g-form-ipt tl" :rules="rules" ref="form">
          <el-form-item label="使用对象:">
            <el-input v-model="form.sdkName" class="g-item-ipt" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="使用次数:">
            <el-input v-model="form.addNum" class="g-item-ipt" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="接收IP:">
            <el-input v-model="form.receiveIp" class="g-item-ipt" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="剩余次数:">
            <el-input v-model="form.surplusNum" class="g-item-ipt" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="续签使用次数:" prop="renewNum">
            <el-input v-model="form.renewNum" class="g-item-ipt"></el-input>
          </el-form-item>
          <el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="updateVisaInfo">确定</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { queryVisaInfo, updateVisaInfo } from '@/service/iot-frame'
  import { getToken } from '@/util/storageUtil'
  export default {
    data () {
      var checkRenewNum = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('使用次数不能为空'))
        }
        setTimeout(() => {
          if (!Number.isInteger(parseInt(value))) {
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
      return {
        id: '',
        form: {
          sdkName: '',
          addNum: '',
          receiveIp: '',
          surplusNum: '',
          renewNum: ''
        },
        rules: {
          renewNum: [
            { validator: checkRenewNum, trigger: 'blur', required: true }
          ]
        }
      };
    },
    mounted () {
      let self = this
      self.id = getToken('SDK_ROW_DETAIL', 'json').id
      self.queryVisaInfo()
    },
    methods: {
      async queryVisaInfo () {
        let self = this
        let resData = await queryVisaInfo({"id": 2})
        if (resData.status === 200) {
          self.form = resData.data.data
        } else {
          self.$message.error("服务器错误")
        }
      },
      updateVisaInfo () {
        let self = this
        self.$refs.form.validate(async (valid) => {
          if (valid) {
            let resData = await updateVisaInfo({"id": self.id, "renewNum": self.form.renewNum})
            if (resData.status === 200) {
              self.$message.success("续签成功")
              self.$router.push("/operationSDKDetail")
            } else {
              self.$message.error("服务器错误")
            }
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
    .g-item-ipt {
      width: 60%;
    }
    .upload-demo {
      margin-left: 10px;
    }
    .s-sure-btn {
      margin-top: 10px;
      margin-left: 115px;
    }
</style>

