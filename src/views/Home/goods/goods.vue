<template>
  <div>
    <!-- 面包屑导航 -->
     <breadcrumbList :breadcrumbLists="breadcrumbLists"></breadcrumbList>
     <!-- 搜索栏与添加商品 -->
     <el-card>
        <search ref="searchs" :queryInfo="queryInfo" @getgoodslistEmit="getgoodslistEmit"></search>
        <goodsListTable :goodsList="goodsList" @deletegoodslistEdit="deletegoodslistEdit" @editgoodslistEdit="editgoodslistEdit"></goodsListTable>
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
      <el-dialog
      title="编辑商品"
      :visible.sync="adddialogVisible"
      width="50%"
     
    >
      <el-form ref="addFormRef" :model="editForm" label-width="80px">
         <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="editForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="editForm.goods_weight" type="number"></el-input>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEnter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumbList from "./goodslist/breadcrumb"
import search from "./goodslist/search"
import goodsListTable from "./goodslist/table"
export default {
  name:"goods",
  data () {
    return {
      breadcrumbLists:["商品管理","商品列表"],//面包屑导航 
      adddialogVisible:false, 
      //查询参数对象
      queryInfo:{
            query:"",//查询参数
             pagenum:1,//当前页码
            pagesize:10,//每页显示条数
           
          },
          editForm:{},
          //商品列表
          goodsList:[],
          //商品总条数
          total:0
    }
  },
  components:{
    breadcrumbList,//面包屑导航组件
    search,//搜索栏与添加商品组件
    goodsListTable
  },
  created() {
    this.getGoodList()
  },
  methods: {    
    async getGoodList(){     
      const result=await this.$http.get("goods",{params:this.queryInfo});
      if (result.data.meta.status !== 200) {
        return this.$message("获取商品列表失败失败");
      }
      this.$message.success("获取商品列表成功")
      this.goodsList=result.data.data.goods,
      this.total=result.data.data.total
     
    },
    handleCurrentChange(newpagenum){
      this.queryInfo.pagenum=newpagenum,
      this.getGoodList()
    },
    handleSizeChange(newpagesize){
    this.queryInfo.pagesize=newpagesize,
    this.getGoodList()
    },
    getgoodslistEmit(){
      this.getGoodList()
    },
   async editgoodslistEdit(id){
      const result=await this.$http.get(`goods/${id}`)
     
     this.editForm=result.data.data,
     this.adddialogVisible=true
    },
    deletegoodslistEdit(id){
       this.$confirm("此操作将永久删除该用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$http.delete(
            `goods/${id}`
          );
        
          if (result.data.meta.status !== 200) {
            return this.$message.error("删除商品数据失败");
          }
          this.$message.success("删除成功");
          this.getGoodList()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async editEnter(){
      const result=await this.$http.put(`goods/${this.editForm.goods_id}`,this.editForm)
      this.adddialogVisible=false
      this.getGoodList()
    }
    
  }
}
</script>
<style lang="less" scoped>

</style>