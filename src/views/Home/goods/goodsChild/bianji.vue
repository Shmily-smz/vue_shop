<template>
  <div>
       
      <el-dialog
      title="修改用户"
      :visible.sync="cateDialogVisible"
      width="50%"
     @close="cateclearForm"
    >
      <el-form
        :model="cateForm"
        status-icon
        ref="cateFormRef"
        label-width="70px"
      >
        <el-form-item label="角色描述" prop="cat_name">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:"bianji",
  props: {
   cateForm: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data () {
      return {
          cateDialogVisible:false,
      }
  },
  methods: {
       cateclearForm() {
      this.$refs.cateFormRef.resetFields();
    },
    editUserInfo(){
        this.$emit("childbianji")
    }
  }
}
</script>

<style>

</style>