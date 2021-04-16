<template>
  <div>
    <breadcrumbList :breadcrumbLists="breadcrumbLists"></breadcrumbList>
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- 字符串-0变为数字 -->
      <el-steps :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <!-- v-model绑定的是name的值，显示的是哪个面板 -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="tabPosition"
          :before-leave="beforeTabsLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="ruleForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="ruleForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="ruleForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="ruleForm.goods_cat"
                :options="cartList"
                :props="cateProps"
                @change="handleChange"
                expand-trigger="hover"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in tableManyData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in tableOnlyData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headObj"
              list-type="picture"
              :on-success="onsuccessLoad"
            >
              <el-button size="small" type="primary">添加图片</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="myQuillEditor" v-model="ruleForm.introduce" />
            <el-button type="primary" @click="add" class="addBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="预览图片" :visible.sync="dialogVisible" width="50%">
      <img :src="fileUrl" alt class="imgUrl" />
    </el-dialog>
  </div>
</template>

<script>
import breadcrumbList from "./breadcrumb";
export default {
  name: "add",
  data() {
    return {
      breadcrumbLists: ["商品管理", "添加商品"], //面包屑导航
      activeIndex: "0",
      tabPosition: "left",
      ruleForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        introduce: "",
        attrs: [],
      },
      fileUrl: "",

      dialogVisible: false,
      cartList: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      cateArray: [],
      tableManyData: [],
      tableOnlyData: [],
      headObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      rules: {
        goods_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },
    };
  },
  components: {
    breadcrumbList,
  },
  created() {
    this.getGoodList();
  },
  computed: {
    getCartId() {
      if (this.ruleForm.goods_cat.length == 3) {
        return this.ruleForm.goods_cat[2];
      } else {
        return null;
      }
    },
  },
  methods: {
    async getGoodList() {
      const result = await this.$http.get("/categories");
     
      this.cartList = result.data.data;
    },
    handleChange() {
      if (this.ruleForm.goods_cat.length !== 3) {
        this.ruleForm.goods_cat = [];

        return;
      }
    },

    beforeTabsLeave() {
      if (
        this.ruleForm.goods_cat.length === 0 &&
        this.ruleForm.goods_cat.length !== 3
      ) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    async tabClick() {
      if (this.activeIndex === "1") {
        const result = await this.$http.get(
          `categories/${this.getCartId}/attributes`,
          { params: { sel: "many" } }
        );
        result.data.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });

        this.tableManyData = result.data.data;
        
      } else if (this.activeIndex === "2") {
        const result = await this.$http.get(
          `categories/${this.getCartId}/attributes`,
          { params: { sel: "only" } }
        );
        this.tableOnlyData = result.data.data;
       
      }
    },
    onsuccessLoad(response) {
      const picInfo = { pic: response.data.tmp_path };
      this.ruleForm.pics.push(picInfo);
    },
    handlePreview(file) {
      this.fileUrl = file.response.data.url;
      this.dialogVisible = true;
    },
    handleRemove(file) {
      const filePath = file.response.data.tem_path;
      const i = this.ruleForm.pics.findIndex((x) => x.pic === filePath);
      this.ruleForm.pics.splice(i, 1);
    
    },
    add() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) {
          return this.$message.error("请填写必填项");
        }
        const form = JSON.parse(JSON.stringify(this.ruleForm));
        form.goods_cat = form.goods_cat.join(",");
        this.tableOnlyData.forEach((item) => {
        
          const itemInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.ruleForm.attrs.push(itemInfo);
          
        }),
          this.tableManyData.forEach((item) => {
            const itemInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' '),
            };
            this.ruleForm.attrs.push(itemInfo);
          });
        form.attrs = this.ruleForm.attrs;
        const result=await this.$http.post('goods',form)
        if(result.data.meta.status!==201){
          this.$message.error('添加商品失败')
        }this.$message.success("添加商品成功")
        this.$router.push('/goods')
      });
    },
  },
};
</script>
<style lang="less" >
* {
  padding: 0;
  margin: 0;
}
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 14px !important;
}
.el-form-item {
  margin-top: 20px;
}
.el-cascader-panel {
  height: 200px !important;
}
.params_cascader {
  width: 250px;
}
.el-popper {
  height: 200px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.imgUrl {
  width: 100%;
}
.addBtn {
  margin-top: 20px;
}
</style>