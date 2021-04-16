<template>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>  
</template>

<script>
export default {
  name:"breadcrumb"
}
</script>

<style>
  el-breadcrumb{
      display: flex;
  }
</style>