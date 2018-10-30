<template>	
  <div>
  	<el-row class="g-header">
  	  <el-col :span="8">
		  	<el-breadcrumb separator-class="el-icon-arrow-right" class="g-top-left">
				  <el-breadcrumb-item :to="{path: '/operationSDK'}">SDK</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/operationSDKDetail'}">详情</el-breadcrumb-item>
				  <el-breadcrumb-item>分发</el-breadcrumb-item>
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
	  	  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				  <el-menu-item index="1">单点分发</el-menu-item>
				  <el-menu-item index="2">多点分发</el-menu-item>
				</el-menu>
				<!-- 单点分发 -->
				<el-form :model="form" class="g-form-ipt tl" v-show="distributeOneShow">
			    <el-form-item label="使用对象：" :label-width="formLabelWidth">
			      <el-input v-model="form.useObject" auto-complete="off" class="g-item-ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="使用IP：" :label-width="formLabelWidth">
			      <el-input v-model="form.useIP" auto-complete="off" class="g-item-ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="使用次数：" :label-width="formLabelWidth">
			      <el-input v-model="form.useTime" auto-complete="off" class="g-item-ipt"></el-input>
			    </el-form-item>
			    <el-form-item label="接收IP：" :label-width="formLabelWidth">
			      <el-input v-model="form.receptionIP" auto-complete="off" class="g-item-ipt"></el-input>
			    </el-form-item>
			    <el-button class="s-sure-btn g-top-btn" size="mini" type="primary" @click="">确定</el-button>
			  </el-form>
				<!-- 多点分发 -->
				<el-table
		      :data="tableData"
		      class="g-table-all-border"
		      v-show="!distributeOneShow">
		      <el-table-column
		      	label="使用对象">
		        <template slot-scope="scope">
			        <el-input class="g-item-ipt" v-model="scope.row.useObject"></el-input>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="使用IP">
		        <template slot-scope="scope">
			        <el-input class="g-item-ipt" v-model="scope.row.useIP"></el-input>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="使用次数">
		        <template slot-scope="scope">
			        <el-input class="g-item-ipt" v-model="scope.row.useTime"></el-input>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="接收IP">
						<template slot-scope="scope">
			        <el-input class="g-item-ipt" v-model="scope.row.receptionIP"></el-input>
	      		</template>
		      </el-table-column>
		      <el-table-column
		        label="操作"
		        align="center">
		        <template slot-scope="scope">
			        <el-button 
			        	size="mini" 
			        	icon="el-icon-plus"
			        	class="s-distribute-btn" 
			        	circle 
			        	type="primary" 
			        	@click.native.prevent="distributeAdd(scope.$index, scope.row)">	
			        </el-button>
			        <el-button 
			        	size="mini" 
			        	icon="el-icon-delete" 
			        	circle 
			        	type="warning" 
			        	@click.native.prevent="distributeDelete(scope.$index, scope.row)">
			        </el-button>
			      </template>
		      </el-table-column>
		    </el-table>

			</el-col>
		</el-row>
  </div>
</template>

<script>
	export default {
		data () {
			return {
				activeIndex: '1',
				distributeOneShow: true,
				form: {
      	  useObject: '',
          useIP: '',
          useTime: '',
          receptionIP: ''
        },
        formLabelWidth: '120px',
        tableData: [{
	        useObject: '',
	        useIP: '',
	        useTime: '',
	        receptionIP: ''
	      }]
			}
		},
		methods: {
			handleSelect (key, keyPath) {
				let self = this
			  key == 1 ? self.distributeOneShow = true : self.distributeOneShow = false
        console.log(key, keyPath);
			},
			distributeAdd (index, tab) {
	    	let self = this;
	    	let tableSingle = {
	        useObject: '',
	        useIP: '',
	        useTime: '',
	        receptionIP: ''
	      }
	    	self.tableData.splice((index + 1), 0, tableSingle)
	    	console.log(self.tableData)
	    },
	    distributeDelete (index, tab) {
	    	let self = this;
	    	if (self.tableData.length <= 1) {
	    		self.$message({
		        message: '删除失败！',
		        type: 'warning',
		        center: true,
		        duration: 1500
		      });
	    	} else {
	    		self.tableData.splice(index, 1)
	    	}
	    	console.log(self.tableData)
	    }
		}
	}
</script>

<style lang="scss" scoped>
  .g-form-ipt {
  	margin-top: 15px;
    .g-item-ipt {
		  width: 60%;
		  height: 35px;
    }
		.g-top-btn {
			margin-left: 120px;
		}
  }
  .s-distribute-btn {
  	margin-right: 30px;
  }
</style>

<style>
	.el-input__inner {
		height: 30px;
	}
</style>