<template>
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in breadcrumbLists" :key="index">{{item}}</el-breadcrumb-item>
     
    </el-breadcrumb>  
</template>

<script>
export default {
  name:"breadcrumbList",
 props: {
    breadcrumbLists: {
      type: Array,
      default() {
        return [];
      },
    },
  },
}
</script>

<style>

</style>