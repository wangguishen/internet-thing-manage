<template>
	<div class="l-father-div">
		<div class="g-header">
			<el-row type="flex" class="row-bg" justify="space-between">
			  <el-col :span="14">
			  	<div class="s-img-box g-top-left">
			  		<img class="iconImg fl" :src="algorithmObj.img" onerror="onerror=null;this.src='static/image/applyApp.png'">
			  		<div class="g-overflow-hide">{{algorithmObj.name}}</div>
			  	</div>
			  </el-col>
			  <el-col :span="10">
			  	<div class="grid-content bg-purple g-top-right">
			  		<template v-if="algorithmObj.path">
			  			<el-button class="g-top-btn" type="primary" size="mini" @click="uploaddown" >下载</el-button>
			  		</template>
			  		<el-button class="s-four-text-btn" type="primary" size="mini" @click="uploadNewEdition">上传新版</el-button>
			  		<!-- <el-button class="s-four-text-btn" type="primary" size="mini" @click="addressDeploy">地址配置</el-button> -->
			  		<el-button class="g-top-btn" size="mini" type="info" @click="back()">返回</el-button>
			  	</div>
			  </el-col>
			</el-row>
		</div>
		<div class="g-main">
			<el-form :model="algorithmObj" ref="formAccount" class="g-form-ipt">
				<el-form-item label="算法路径：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.path" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="当前版本：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.version" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="大小：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.size" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="状态：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.algStatu" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="算法类型：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.typeName" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="算法提供方：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.creator" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="上传时间：" :label-width="formLabelWidth">
					<el-input v-model="algorithmObj.timeData" auto-complete="off" class="ipt_wid g-item-ipt" disabled></el-input>
				</el-form-item>
				<el-form-item label="描述:" :label-width="formLabelWidth">
		      <el-input v-model="algorithmObj.descption" type="textarea" class="ipt_wid g-item-ipt" disabled="disabled"></el-input>
		    </el-form-item>
		    <el-form-item :label-width="formLabelWidth">
		    	<el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="amend">修改</el-button>
	        <el-button class="s-no-bg-xq-btn" size="mini" type="primary" @click="deleteSubmitBtn">删除</el-button>
		    </el-form-item>
	  	</el-form>
	  	<canvas ref="canvas" style="height: 0"></canvas>
		</div>
	</div>
</template>
<script>
import {getToken, removeToken, getLocalStore} from '@/util/storageUtil'
import {queryAlgorithmInfo, deleteAlgorithmInfo} from '@/service/iot-frame'
import {formatTime} from '@/util/dateUtil'
export default {
	data () {
		return {
			info: {},
			algorithmId: '',
			algorithmObj: {},
			formLabelWidth: '120px',
			upload: ''
		}
	},
	mounted () {
		let self = this;
		self.algorithmId = getToken("ARITHMETIC_OBJECT_ID")
		self.info = getLocalStore("USER_INFO", 'json')
		console.log(self.algorithmId)
		let id = '?id=' + self.algorithmId
		self.algorithm(id)
	},
	methods: {
		back () {  //返回算法管理列表页面
			let self = this;
			self.$router.push('/algorManage')
		},
		async algorithm (url) {  //请求 -- 当前算法详情
			let self = this;
			let algorithmData = await queryAlgorithmInfo(url)
			if (algorithmData.status !== 200) {
    		self.$message.error("服务器错误")
    		return
    	}
			if (algorithmData.status === 200 && algorithmData.data.status === "200") {
				let obj = algorithmData.data.data;
				let statu = '';
				if (obj.status == '0') {
					statu = '正常'
				} else {
					statu = '异常'
				}
				let time = formatTime(obj.createTime, '{y}/{m}/{d} {h}:{i}')
				self.$set(obj, 'timeData', time)
				self.$set(obj, 'algStatu', statu)
				self.algorithmObj = obj;
			} else {
				self.$message.error(algorithmData.data.message)
			}
		},
		uploadNewEdition () {  //上传新版 -- 跳转
			let self = this;
			self.$router.push('/algorManageNew')
		},
		amend () {  //修改页面 -- 跳转
			let self = this;
			self.$router.push('/algorManageAmend')
		},
		async deleteSubmitBtn () {  //删除操作
			let self = this;
			let isSuccess = true
			let data = {id: self.algorithmId}
    	await self.$confirm('确认删除此算法吗?', '提示', {
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
      let resData = await deleteAlgorithmInfo(data)
      if (resData.status !== 200) {
        self.$message.error("服务器错误")
        return
      }
      if (resData.status === 200 && resData.data.status == '200') {
      	if (resData.data.message == 'success') {
      		self.$message.success("删除成功")
      		removeToken('ARITHMETIC_OBJECT_ID')
      		self.$router.push('/algorManage')
      	} else {
      		self.$message.warning(resData.data.message)
      	}
      } else {
      	self.$message.error('服务器错误')
      }
		},
		async uploaddown () {  //下载操作
			let self = this;
			let userName = self.info.userName || self.info.account
    	let url = `/iot-frame/algorithm_download?url=${self.algorithmObj.path}&algorithmId=${self.algorithmId}&download=${userName}`
			window.location = url
		},
		async addressDeploy () { //配置算法接口路径
			// let self = this;

		}
	}
}
</script>
<style lang="scss" scoped>
	.g-header{
		margin-bottom: 10px;
		.g-top-left, .g-top-right{
			height:40px;
			line-height: 40px;
		}
	}
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
	.s-img-box{
		text-align: left;
		font-size: 14px;
	}
	.iconImg{
		display: block;
		height:100%;
		margin-right: 15px;
		border-radius: 3px;
	}
</style>