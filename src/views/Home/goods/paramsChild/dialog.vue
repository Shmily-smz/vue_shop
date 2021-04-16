<template>
  <div>
    <el-dialog
      :title="'添加'+showTitle"
      :visible.sync="adddialogVisible"
      width="30%"
      @close="addDialogClose"
    >
      <el-form ref="addFormRef" :model="addForm" label-width="80px">
        <el-form-item :label="showTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "paramsDialog",
  props: {
    activeName: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      adddialogVisible: false,
      addForm: {
        attr_name: "",
      },
    };
  },
  computed: {
    showTitle() {
      if (this.activeName === "many") {
        return "动态参数 : ";
      } else {
        return "静态属性 : ";
      }
    },
  },
  methods: {
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$emit("addParamsCreat");
    },
  },
};
</script>

<style>
</style>