<template>
	<div class="operation-server-twin">
		<el-row type="flex" class="row-bg" justify="space-between">
		  <el-col :span="12"><div class="grid-content bg-purple g-top-left">服务器环境详情</div></el-col>
		  <el-col :span="12">
		  	<div class="grid-content bg-purple g-top-right">
		  		<el-button class="g-top-btn" size="mini" type="success" @click="back()">返回</el-button>
		  	</div>
		  </el-col>
		</el-row>
		<el-table
	    :data="tableData"
	    style="width: 100%;border: 1px solid #e3e9ec;border-radius: 3px;">
	    <el-table-column
	      prop="name"
	      align="center"
	      label="名称">
	    </el-table-column>
	    <el-table-column
	      prop="serverAddress"
	      align="center"
	      label="服务器地址">
	    </el-table-column>
	    <el-table-column
	      prop="useIp"
	      align="center"
	      label="使用IP">
	    </el-table-column>
	    <el-table-column
	      prop="owner"
	      align="center"
	      label="所属人">
	    </el-table-column>
	    <el-table-column
	      prop="useObject"
	      align="center"
	      label="使用对象">
	    </el-table-column>
	    <el-table-column
	      prop="useNum"
	      align="center"
	      label="使用次数">
	    </el-table-column>
	    <el-table-column
	      prop="describe"
	      align="center"
	      label="描述">
	    </el-table-column>
	    <el-table-column
	      label="操作"
	      align="center">
	      <template slot-scope="scope">
	        <el-button
	          size="mini"
	          class="s-no-bg-xq-btn"
	          plain
	          @click.native.prevent="renewClick()">续签</el-button>
	        <el-button
	          size="mini"
	          type="primary"
	          class="s-yes-bg-ff-btn"
	          @click="distributeClick()">分发</el-button>
	        <el-button
	          size="mini"
	          type="danger"
	          class="s-yes-bg-xg-btn"
	          @click="amendClick()">修改</el-button>
	        <el-button
	          size="small"
	          class="s-no-bor-icon"
	          type="text"
	          @click.native.prevent="deleteClick(scope.$index, tableData)"><i class="el-icon-delete"></i></el-button>
	      </template>
	    </el-table-column>
	  </el-table>
	  <el-dialog class="g-renew-box" :visible.sync="dialogRenewOuterVisible">
		  <el-form :model="form">
		    <el-form-item label="使用对象：" :label-width="formLabelWidth">
		      <el-input class="g-renew-ipt" v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="使用次数：" :label-width="formLabelWidth">
		      <el-input class="g-renew-ipt" v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="使用IP：" :label-width="formLabelWidth">
		      <el-input class="g-renew-ipt" v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="接受IP：" :label-width="formLabelWidth">
		      <el-input class="g-renew-ipt" v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="剩余次数：" :label-width="formLabelWidth">
		      <el-input class="g-renew-ipt" v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="续签次数：" :label-width="formLabelWidth">
		      <el-input class="g-renew-ipt" v-model="form.name" auto-complete="off"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button class="g-renew-sure" size="mini" type="primary" @click="renewSure">续 签</el-button>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
import {getToken, removeToken} from '@/util/storageUtil'
export default {
	data(){
		return{
			tableData: [],
			dialogRenewOuterVisible: false,
			formLabelWidth: '100px',
			form: {
				name:''
			}
		}
	},
	mounted(){
		let self = this;
		let serverData = getToken("operationServerData", "json")
		self.tableData.push(serverData)
	},
	methods: {
		back () {//返回server列表页
			let self = this;
			self.$router.push('/operationserver');
		},
		renewClick () {//续签事件
			let self = this;
			self.dialogRenewOuterVisible = true;
		},
		renewSure () {//续签确认
			let self = this;
			self.dialogRenewOuterVisible = false;
			self.$message({
        message: '续签成功！',
        type: 'success',
        center: true,
        duration: 1500
      });
		},
		distributeClick () {//分发点击事件
			let self = this;
			self.$router.push('/operationserverDistribute');
		},
		amendClick() {//修改点击事件
			let self = this;
			self.$router.push('/operationserverAmend');
		},
		deleteClick(index, tab) {//删除点击事件
			let self = this;
			self.tableData.splice(index, 1)
			removeToken("operationserverData")
		}
	}
}
</script>
<style lang="scss" scoped>
	$green:#50CB44;
	.g-top-btn{
		background-color: $green;
		border-color: $green;
	}
	.operation-server-twin{
		.row-bg{
			margin-bottom: 10px;
			.g-top-left{
				font-size: 20px;
			}
			.g-top-right{
				float:right;
			}
		}
		.name-wrapper{
			text-overflow:ellipsis;
			white-space:nowrap;
			overflow:hidden;
		}
		.s-yes-bg-ff-btn,.s-yes-bg-xg-btn,.s-no-bor-icon{
			margin-left: 20px;
		}
		.g-renew-ipt{
			width:80%;
		}
	}	
</style>