<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="7">
        <!-- 搜索与添加区域 -->
        <!-- 双向绑定关键字 -->
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getgoodslist()"
        >
          <el-button slot="append" icon="el-icon-search" @click="getgoodslist()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addBtn">添加商品</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      adddialogVisible: false,
    };
  },
  props: {
    queryInfo: {
        type:Object,
        default(){
            return {}
        }
    },
  },
  methods: {
    getgoodslist(){
        this.$emit("getgoodslistEmit")
    },
    addBtn(){
        this.$router.push('./add')
    }
  },
};
</script>

<style>
</style>