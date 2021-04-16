<template>
  <div>
    <!-- 面包屑导航 -->
    <breadbranch></breadbranch>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="log">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="catetlist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        border
        index-text="#"
        class="treeTable"
      >
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- opt指定模板的名字，v-slot用来接收数据 -->
        <template v-slot:opt="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateUser(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <dialogs ref="aaa" :parentList="parentList" @cateCreat="cateCreat"></dialogs>
    <!-- <el-dialog
      title="提示"
      :visible.sync="addCateDialogvisible"
      width="30%"      
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>-->
    <bianji ref="bianji" :cateForm="cateForm" @childbianji="childbianji"></bianji>
  </div>
</template>

<script>
import breadbranch from "../../../components/breadcrumb";
import addButton from "./goodsChild/addButton"
import dialogs from "./goodsChild/dialog";
import bianji from "./goodsChild/bianji"
export default {
  data() {
    return {
      //商品列表的数据，默认为空
      catetlist: [],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      addCateDialogvisible: false,
      queryInfo: {
        type: 3, //获取123层分类列表
        pagenum: 1,
        pagesize: 5,
      },
      aaaa:{},
      total: 0,
      parentList: [],
      cateForm:{
        cat_name:"",
        cat_id:""
      }
    };
  },
  components: {
    breadbranch,
    addButton,
    dialogs,
    bianji
  },
  created() {
    this.getCatelist();
  },
  methods: {
    //获取商品列表
    async getCatelist() {
      const result = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (result.data.meta.status !== 200) {
        return this.message.error("获取商品分类失败");
      }
      this.catetlist = result.data.data.result;
      this.total = result.data.data.total;
      
    },
    handleSizeChange(newpagesize) {
      (this.queryInfo.pagesize = newpagesize), this.getCatelist();
    },
    handleCurrentChange(newpagenum) {
      (this.queryInfo.pagenum = newpagenum), this.getCatelist();
    },
    async getParentCartList() {
      const result = await this.$http.get("categories", {
        params: { type: 2 },
      }); //用params指定参数
      if (result.data.meta.status !== 200) {
        return this.message.error("获取父级分类失败");
      }
      this.parentList = result.data.data
     
    },
    log() {
      this.$refs.aaa.odd(),
        //点击添加分类父级分类的数据
        this.getParentCartList();
    },
    async cateCreat(){
      this.aaaa=this.$refs.aaa.addCartForm
      const result=await this.$http.post("categories",this.aaaa);
       if (result.data.meta.status !== 201) {
        return this.$message.error("添加分类失败");
        
      }
    this.$message.success("添加分类成功")
      this.getCatelist();
      this.$refs.aaa.addCateDialogvisible = false
    },
    async showEditCateDialog(id){
      const result = await this.$http.get("categories/" + id);
      if (result.data.meta.status != 200) {
        return this.$message.error("查询用户信息失败");
      }
      // this.editDialogVisible = true;
      this.cateForm = result.data.data;
      this.$refs.bianji.cateDialogVisible=true
    },
    async childbianji(){
      const result=await this.$http.put("categories/"+this.cateForm.cat_id,{
        cat_name:this.cateForm.cat_name,
      })
        if(result.data.meta.status !== 200) {
        return this.$message.error("修改用户失败");
      } else {
        this.$message.success("修改用户成功");
        //隐藏添加用户的对话框
       this.$refs.bianji.cateDialogVisible = false;
        this.getCatelist();
      }
    },
    removeCateUser(id){
      
      this.$confirm("此操作将永久删除该用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$http.delete("categories/" + id);
          if (result.data.meta.status !== 200) {
            return this.$message.error("修改用户失败");
          } else {
            //隐藏添加用户的对话框
            this.$message.success("修改用户成功");
            this.cateDialogVisible = false;
            this.getCatelist();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
           
          });
        });
    
    }
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 18px;
}
</style>