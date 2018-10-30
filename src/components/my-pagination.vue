<template>
	<div>
		<div class="g-block">
			<template v-if="paginationObj.saveBtn">
				<el-button class="g-top-btn" size="mini" type="primary" @click="saveBtnData()">保存</el-button>
			</template>
		  <el-pagination
		  	class="s-page-style"
		  	:page-size="paginationObj.pageSize"
		  	:current-page="paginationObj.currentPage"
				@current-change="changeCur"
		    layout="prev, pager, next, jumper"
		    :total="paginationObj.totalCount">
		  </el-pagination>
		</div>
	</div>
</template>
<script>
export default {
	data () {
		return {
			pageSize: 10,
			totalCount: 100
		}
	},
	props: {
    paginationObj: Object
  },
	methods: {
		changeCur (val) {  //分页按钮点击事件
			let self = this;
			self.$emit('changeCur', val)
		},
		saveBtnData () {
			let self = this;
			self.$emit('saveBtnData', '成功');
		}
	}
}
</script>
<style lang="scss" scoped>
	.g-top-btn{
		float:left;
		margin: 10px 0;
	}
</style>