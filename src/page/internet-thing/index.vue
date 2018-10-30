<template>
	<div>
	  <el-row>
	  	<el-col :span="24">
	  	  <h4>终端应用</h4>
	  	</el-col>
	  </el-row>
	  <el-row>
	  	<router-link to="/applicationList">
	  		<el-col :span="8">
		  		<div class="m-wrap">
		  			<img src="static/icon/applicationList.png" alt="..">
		  			<a>应用管理</a>
		  		</div>
		  	</el-col>
	  	</router-link>
	  	<router-link to="/companyGather">
		  	<el-col :span="8">
		  	  <div class="m-wrap u-two">
		  			<img src="static/icon/companyGather.png" alt="..">
		  			<a>公司应用</a>
		  		</div>
		  	</el-col>
			</router-link>
	  	<el-col :span="8">
			  <div class="m-wrap">
			  </div>
	  	</el-col>
	  </el-row>
	  <el-row>
	    <el-col :span="24">
	      <h4>终端管理</h4>
	    </el-col>
	  </el-row>
	  <el-row>
	  	<router-link to="/facilityList">
		  	<el-col :span="8">
		  	  <div class="m-wrap">
		  			<img src="static/icon/facilityList.png" alt="..">
		  			<a>终端设备</a>
		  		</div>
		  	</el-col>
			</router-link>
	    <router-link to="/terminal-authority/list">
		    <el-col :span="8">
		      <div class="m-wrap u-two">
		  			<img src="static/icon/terminal-authority.png" alt="..">
		  			<a>终端权限</a>
		  		</div>
		    </el-col>
	    </router-link>
	    <el-col :span="8">
	    	<div class="m-wrap"></div>
	    </el-col>
	  </el-row>
	  <el-row>
	    <el-col :span="24">
	      <h4>资源服务管理</h4>
	    </el-col>
	  </el-row>
	  <el-row>
	    <router-link to="/operationSDK">
		    <el-col :span="8">
		      <div class="m-wrap">
		  			<img src="static/icon/operationSDK.png" alt="..">
		  			<a>SDK</a>
		  		</div>
		    </el-col>
	    </router-link>
	    <router-link to="/operationServer">
	    	<el-col :span="8">
		      <div class="m-wrap u-two">
		  			<img src="static/icon/operationServer.png" alt="..">
		  			<a>服务器环境</a>
		  		</div>
		    </el-col>
	    </router-link>
	    <router-link to="/operationAPK">
	    	<el-col :span="8">
		      <div class="m-wrap">
		  			<img src="static/icon/operationAPK.png" alt="..">
		  			<a>安装包</a>
		  		</div>
		    </el-col>
	    </router-link>
	  </el-row>
	</div>
</template>
<script>
import { removeToken } from '@/util/storageUtil'
export default {
	mounted () {
		removeToken('MER_DATA')
	}
}
</script>
<style lang="scss" scoped>
	.m-wrap {
	  height: 155px;
		border: 1px solid #e3e9ec;
		border-radius: 3px;
		position: relative;
		background: #fff;
		cursor: pointer;
		img {
			display: block;
			position: absolute;
			left: 50%;
			margin-top: 35px;
			transform: translate(-50%);
		}
		a {
		  font-size: 14px;
			line-height: 220px;
		}
	}

	.m-wrap:hover {
	  background: #eee;
	}
	
	h4 {
		text-align: left;
		margin: 10px 0 10px 0;
		color: #2e2e2e;
	}
	.u-two {
		border-left: none;
		border-right: none;
	}

	@media screen and (min-width:1920px) {
	  .m-wrap {
	  	height: 260px;
	  	img {
	  		margin-top: 85px;
	  	}
	  	a {
	  		line-height: 340px;
	  	}
	  }
  }
</style>