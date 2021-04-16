<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb></breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="card_opt">
        <el-col>
          <span>选择商品分类 :</span>
          <!-- 选择商品分类的级联选择框 -->
          <!-- options是绑定数据源，props是配置级联选择框 -->
          <el-cascader
            class="params_cascader"
            expand-trigger="hover"
            v-model="selectCartKeys"
            :options="cartList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addBtn">添加参数</el-button>
          <paramsTable1
            ref="bbb"
            :onlyTableData="getParamsTable()"
            @editVisibel="editVisibel"
            @deleteVisibel="deleteVisibel"
            @tablehandleInputConfirm="tablehandleInputConfirm"
            @tableCloseable="tableCloseable"
          ></paramsTable1>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addBtn">添加属性</el-button>
          <paramsTable1
            :onlyTableData="getParamsTable()"
            @editVisibel="editVisibel"
            @deleteVisibel="deleteVisibel"
             @tablehandleInputConfirm="tablehandleInputConfirm"
            @tableCloseable="tableCloseable"
          ></paramsTable1>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <paramsDialog ref="paramsDialog" :activeName="activeName" @addParamsCreat="addParamsCreat"></paramsDialog>

    <el-dialog
      :title="'修改'+showTitle"
      :visible.sync="editdialogVisible"
      width="30%"
      @close="editDialogClose"
    >
      <el-form ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item :label="showTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="paramsChangeForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  
</template>

<script>
import breadcrumb from "./paramsChild/breadcrumb";
import paramsTable1 from "./paramsChild/table";
import paramsDialog from "./paramsChild/dialog";

export default {
  name: "Params",
  data() {
    return {
      //商品分类列表
      cartList: [],
      //级联选择框配置
      //value指定选择的值
      //label指定看到的值
      //children指定父子节点的嵌套属性
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //级联选择框双向绑定的数组
      selectCartKeys: [],
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      editdialogVisible: false,
      editForm: {
        attr_name: "",
        attr_id: "",
      },
    };
  },
  components: {
    breadcrumb,
    paramsTable1,
    paramsDialog,
  },
  created() {
    this.getCartlist();
  },
  computed: {
    isBtnDisabled() {
      if (this.selectCartKeys.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    getCartId() {
      if (this.selectCartKeys.length == 3) {
        return this.selectCartKeys[2];
      } else {
        return null;
      }
    },
    showTitle() {
      if (this.activeName === "many") {
        return "动态参数 : ";
      } else {
        return "静态属性 : ";
      }
    },
  },
  methods: {
    async getCartlist() {
      const result = await this.$http.get("categories");
      if (result.data.meta.status !== 200) {
        return this.$message.error("获取列表数据失败");
      }
      this.cartList = result.data.data;
     
    },
    async getParamsData() {
      if (this.selectCartKeys.length !== 3) {
        this.selectCartKeys = [];
        this.onlyTableData=[];
         this.manyTableData=[]
        return;
      }
      const result = await this.$http.get(
        `categories/${this.getCartId}/attributes`,
        { params: { sel: this.activeName } }
      );

      if (result.data.meta.status !== 200) {
        return this.$message("获取参数失败");
      }
      result.data.data.forEach((item) => {
        (item.inputVisible = false), (item.inputValue = "");
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
      
      });
      if (this.activeName === "many") {
        this.manyTableData = result.data.data;
      } else {
        this.onlyTableData = result.data.data;
      }
    },
    // tab页签点击事件的处理函数
    handleClick() {
      this.getParamsData();
    },
    handleChange() {
      this.getParamsData();
    },
    getParamsTable() {
      if (this.activeName === "many") {
        return this.manyTableData;
      } else {
        return this.onlyTableData;
      }
    },
    addBtn() {
      this.$refs.paramsDialog.adddialogVisible = true;
    },
    async addParamsCreat() {
      this.aaa = this.$refs.paramsDialog.addForm;
      const result = await this.$http.post(
        `categories/${this.getCartId}/attributes`,
        {
          attr_name: this.aaa.attr_name,
          attr_sel: this.activeName,
        }
      );

      if (result.data.meta.status !== 201) {
        return this.$message.error("获取列表数据失败");
      }
      this.$refs.paramsDialog.adddialogVisible = false;
      this.$message.success("获取列表数据成功");
      this.getParamsData();
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },

    // 编辑按钮
    async editVisibel(attr_id) {
      this.editdialogVisible = true;
      const result = await this.$http.get(
        `categories/${this.getCartId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (result.data.meta.status !== 200) {
        return this.$message.error("获取列表数据失败");
      }
      this.editForm.attr_name = result.data.data.attr_name;
      this.editForm.attr_id = result.data.data.attr_id;
   
    },

    // 编辑出现的dialog的确认按钮
    async paramsChangeForm() {
      const result = await this.$http.put(
        `categories/${this.getCartId}/attributes/${this.editForm.attr_id}`,
        {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
        }
      );
      if (result.data.meta.status !== 200) {
        return this.$message.error("获取列表数据失败");
      }
      this.$message.success("编辑成功hahahah");
      this.getParamsData();
      this.editdialogVisible = false;
    },
    // 删除
    async deleteVisibel(attr_id) {
      this.$confirm("此操作将永久删除该用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$http.delete(
            `categories/${this.getCartId}/attributes/${attr_id}`
          );
        
          if (result.data.meta.status !== 200) {
            return this.$message.error("删除列表数据失败");
          }
          this.$message.success("删除成功");
          this.getParamsData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 扩展行的编辑
    async tablehandleInputConfirm(row) {
      const result = await this.$http.put(
        `categories/${this.getCartId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(","),
        }
      );
    
      if (result.data.meta.status !== 200) {
        return this.$message.error("修改参数失败");
      } else {
        this.$message.success("修改参数成功");
       
      }
    },

    //扩展行的删除
    async tableCloseable(row, index) {
      row.attr_vals.splice(index, 1);
      this.tablehandleInputConfirm(row);
    },
  },
};
</script>

<style>
.card_opt {
  margin: 15px 0;
}

.el-cascader-panel {
  height: 200px !important;
}
.params_cascader {
  width: 250px;
}
</style>