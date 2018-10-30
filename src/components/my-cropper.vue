<template>
	<div>
		<div class="cropper-content">
	    <div class="cropper">
	      <vueCropper
	        ref="cropper"
	        :img="options.img"
	        :outputSize="options.size"
	        :outputType="options.outputType"
	        :info="true"
	        :full="options.full"
	        :canMove="options.canMove"
	        :canMoveBox="options.canMoveBox"
	        :original="options.original"
	        :autoCrop="options.autoCrop"
	        :autoCropWidth="options.autoCropWidth"
	        :autoCropHeight="options.autoCropHeight"
	        :fixedBox="options.fixedBox"
	        @realTime="realTime"
	      ></vueCropper>
	    </div>
	    <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
	      <div :style="previews.div" class="preview">
	        <img :src="previews.url" :style="previews.img">
	      </div>
	    </div>
	  </div>
	  <div class="footer-btn">
	    <div class="scope-btn">
	      <label class="btn" for="uploads">更换图片</label>
	      <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">

	      <el-button class="g-top-btn" type="primary" @click="changeScale(1)">
	      	<i class="iconfont setting">&#xe62f;</i>
	      </el-button>
	      <el-button class="g-top-btn" type="primary" @click="changeScale(-1)">
	      	<i class="iconfont setting">&#xe608;</i>
	      </el-button>
	      <el-button class="g-top-btn" type="primary" @click="rotateLeft">
	      	<i class="iconfont setting">&#xe722;</i>
	      </el-button>
	      <el-button class="g-top-btn" type="primary" @click="rotateRight">
	      	<i class="iconfont setting">&#xe720;</i>
	      </el-button>
	    </div>
	    <div class="upload-btn">
	      <el-button class="g-top-btn" size="mini" type="primary" @click="down('blob')">确定</el-button>
	    </div>
	  </div>
	</div>
</template>
<script>
import VueCropper from 'vue-cropper'
export default {
	props: {
		options: Object
	},
	components: {
		VueCropper
	},
	data () {
		return {
      previews: {},
      downImg: '#'
		}
	},
	mounted () {
	},
	methods: {
		changeScale (num) {
			let self = this;
			num = num || 1
			self.$refs.cropper.changeScale(num)
		},
		rotateLeft () {
			let self = this;
			self.$refs.cropper.rotateLeft()
		},
		rotateRight () {
			let self = this;
			self.$refs.cropper.rotateRight()
		},
		finish (type) { // 输出
			let self = this;
			if (type === 'blob') {
				self.$refs.cropper.getCropBlob((data) => {
					var img = window.URL.createObjectURL(data)
					self.model = true
					self.modelSrc = img
				})
			} else {
				self.$refs.cropper.getCropData((data) => {
					self.model = true
					self.modelSrc = data
				})
			}
		},
		// 实时预览函数
		realTime (data) {
			let self = this;
			self.previews = data
		},
		down (type) {
			let self = this;
			// 输出
			if (type === 'blob') {
				let base64;
				self.$refs.cropper.getCropData((data) => {
					base64 = data
					self.$refs.cropper.getCropBlob((date) => {
						self.$emit("sureClick", date, base64)
					})
				})
			} else {
				self.$refs.cropper.getCropData((data) => {
					self.$emit("sureClick", data)
				})
			}
		},
		uploadImg (e, num) { //上传图片
			let self = this;
			var file = e.target.files[0]
			if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
				self.$message.error('图片类型必须是jpeg,jpg,png中的一种')
				return false
			}
			var reader = new FileReader()
			reader.onload = (e) => {
				let data
				if (typeof e.target.result === 'object') { // 把Array Buffer转化为blob 如果是base64不需要
					data = window.URL.createObjectURL(new Blob([e.target.result]))
				} else {
					data = e.target.result
				}
				if (num === 1) {
					self.options.img = data
				} else if (num === 2) {
					self.example2.img = data
				}
			}
			// 转化为base64
			// reader.readAsDataURL(file)
			// 转化为blob
			reader.readAsArrayBuffer(file)
		}
	}
}
</script>
<style lang="scss" scoped>
	.cropper-content{
	  display: flex;
	  display: -webkit-flex;
	  justify-content: flex-end;
	  -webkit-justify-content: flex-end;
	  .cropper{
	    width: 350px;
	    height: 300px;
	  }
	  .show-preview{
	    flex: 1;
	    -webkit-flex: 1;
	    display: flex;
	    display: -webkit-flex;
	    justify-content: center;
	    -webkit-justify-content: center;
	    .preview{
	      overflow: hidden;
	      border:1px solid #cccccc;
	      background: #cccccc;
	      margin-left: 40px;
	      box-sizing: border-box;
	    }
	  }
	}
	.footer-btn{
	  margin-top: 30px;
	  display: flex;
	  display: -webkit-flex;
	  justify-content: flex-end;
	  -webkit-justify-content: flex-end;
	  .scope-btn{
	    width: 350px;
	    display: flex;
	    display: -webkit-flex;
	    justify-content: space-between;
	    -webkit-justify-content: space-between;
	    .g-top-btn{
	    	padding: 7px;
	    }
	    .setting {
			  font-size: 14px;
			}
	  }
	  .upload-btn{
	    flex: 1;
	    -webkit-flex: 1;
	    display: flex;
	    display: -webkit-flex;
	    justify-content: center;
	    -webkit-justify-content: center;
	  }
	  .btn {
	    outline: none;
	    display: inline-block;
	    line-height: 1;
	    white-space: nowrap;
	    cursor: pointer;
	    -webkit-appearance: none;
	    text-align: center;
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;
	    outline: 0;
	    margin: 0;
	    -webkit-transition: .1s;
	    transition: .1s;
	    font-weight: 500;
	    padding: 8px 15px;
	    font-size: 12px;
	    border-radius: 3px;
	    color: #fff;
	    background-color: #67c23a;
	    border-color: #67c23a;
	  }
	}
</style>