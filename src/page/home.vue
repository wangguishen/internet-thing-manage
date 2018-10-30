<template>
  <div class="h_100">
    <el-container>
      <el-header>
        <v-header></v-header>
      </el-header>
      <el-container>
        <el-aside></el-aside>
        <el-main>
          <transition name="move" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
        <el-aside>
          <v-sidebar></v-sidebar>
        </el-aside>
      </el-container>
      <el-footer>
        <v-footer></v-footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import vSidebar from '@/components/sidebar.vue';
  import vHeader from '@/components/header.vue';
  import vFooter from '@/components/footer.vue';
  export default {
    components: {
      vSidebar,
      vHeader,
      vFooter
    },
    methods: {
    }
  }
</script>

<style lang="scss">
  .el-header, .el-footer {
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    width: 20% !important;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    /* min-height: 100%; */
    min-height: 84vh;
    width: 60%;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container.is-vertical {
    min-height: 100%;
  }
</style>
