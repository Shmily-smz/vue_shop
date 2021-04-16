<template>
  <div>
    <el-dialog title="提示" :visible.sync="addCateDialogvisible" width="30%" @close="addCartFormClose">
      <!-- v-model是数据绑定，rules是规则校验，ref是组件名称 -->
      <el-form
        :model="addCartForm"
        :rules="addCartFormrules"
        ref="addCartFormRef"
        label-width="100px"
       
      >
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="addCartForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options  用来指定数据源 -->
         
          <el-cascader
          class="cascader"
            v-model="selectKeys"
            :options="parentList"
           expandTrigger=hover
           size="medium"
            @change="parentCartCase"
            :props="cascaderProps "
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
     
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "dialogs",
   props: {
    parentList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      //控制添加分类对话框的分类与隐藏
      addCateDialogvisible: false,
      selectKeys:[],
      //添加分类的表单对象
      addCartForm: {
        cat_name: "", //添加分类的名称
        cat_pid: 0, //父级id。默认是0
        cat_level: 0, //等级
      },
      //指定级联选择器的配置对象
      cascaderProps:{
        value:"cat_id",
        label:"cat_name",
        chiildren:"children"

      },
      //验证规则对象 
      addCartFormrules:{
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
   
    odd() {
      this.addCateDialogvisible = true;

    },

    parentCartCase(){
      if(this.selectKeys.length>0){
        //如果数组长度大于0，说明有父级分类，反之则是没有

        this.addCartForm.cat_pid=this.selectKeys[this.selectKeys.length-1];
        //父级分类的id
        this.addCartForm.cat_level=this.selectKeys.length
        //自己的level等级

      }else{
        this.addCartForm.cat_pid=0;
        this.addCartForm.cat_level=0
      }
     
    },
    //监听对话框的关闭事件，重置表单
    addCartFormClose(){
      this.$refs.addCartFormRef.resetFields();
      this.selectKeys=[];
         this.addCartForm.cat_pid=0;
        this.addCartForm.cat_level=0
    },
    addCate(){
     
       this.$emit("cateCreat",this.addCartForm)
    
    }
  },
};
</script>

<style>
.el-cascader-panel{
  height: 200px !important;
}
.cascader{
  width: 100%;
}
</style>
