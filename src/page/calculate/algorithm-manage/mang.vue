<template>
	<div>
		<a target="_blank" href="/login">这是一个模板公共页面模板</a>
	</div>
</template>

<script>
import {verServer} from '@/service/list'
export default {
	data(){
		return{
			id: '0x0511'
		}
	},
	mounted(){
		let self = this;
		let data = {"commandId":0x0503,"reqNode":"WEB","body":{"type":0,"refreshSeq":9,"pageSize":10}}
		self.api(data)
	},
	methods: {
	  async api(data) {
      console.log(1)
      let resData = await verServer(data)
      console.log("resData", resData)
    },
	}
}
</script>
<style lang="scss" scoped>
	
</style>