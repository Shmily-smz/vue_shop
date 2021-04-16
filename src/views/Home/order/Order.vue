<template>
  <div>
   
   <breadcrumbLists :breadcrumbLists="breadcrumbLists"></breadcrumbLists>
   <el-card>
       <el-row :gutter="20">
      <el-col :span="7">
        <!-- 搜索与添加区域 -->
        <!-- 双向绑定关键字 -->
        <el-input
          placeholder="请输入内容"       
          clearable
          v-model="queryInfo.query"
          @clear="getgoodslist()"
        >
          <el-button slot="append" icon="el-icon-search" @click="getgoodslist()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <orderTable :orderList="orderList" @orderEmit="orderEmit" @orderChange="orderChange"></orderTable>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
   </el-card>
    <orderDialog ref="orderDialog"></orderDialog>
    <orderTwoDialog ref="orderTwoDialog"></orderTwoDialog>
  </div>
</template>

<script>
import breadcrumbLists from '../goods/goodslist/breadcrumb'
import orderTable from '../order/orderChild/table'
import orderDialog from "./orderChild/dialog"
import orderTwoDialog from "./orderChild/order2"
export default {
  name: "order",
  data() {
    return {
         breadcrumbLists:["订单管理","订单列表"],
         queryInfo:"",
         queryInfo:{
           query:"",
           pagenum:1,
           pagesize:10,
         },
         orderList:[],
         total:0,
         addressVisible:false
    };
  },
  components: {
      breadcrumbLists,
      orderTable,
      orderDialog,
     orderTwoDialog
  },
  created () {
    this.getOrderlist()
  },
  methods: {
     async getOrderlist(){
        const result=await this.$http.get('/orders',{params:this.queryInfo})
       
        this.orderList=result.data.data.goods,
        this.total=result.data.data.total
       
      },
      handleSizeChange(newSize){
       this.queryInfo.pagesize=newSize,
       this.getOrderlist()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage,
        this.getOrderlist()
      },
      orderEmit(){
       this.$refs.orderDialog.addressVisible=true
       
      },
      orderChange(){
      
        this.$refs.orderTwoDialog.changeVisible=true
      }
  }
};
</script>

<style lang="less" scoped>
</style>
