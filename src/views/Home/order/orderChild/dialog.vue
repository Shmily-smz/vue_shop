<template>
  <div>
      <el-dialog  title="修改地址" :visible.sync="addressVisible" width="50%">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
            <el-form-item label="省市区/县" prop="address1">
             <el-cascader :options="cityData" v-model="addressForm.address1" class="aa"></el-cascader>
                 
            </el-form-item>
            <el-form-item label="省市区/县" prop="address2">
              <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
        </el-form>
         <span slot="footer" class="dialog-footer">
    <el-button @click="dialogClose">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
      </el-dialog>
  </div>
</template>

<script>
import cityData from '../../../../components/citydata'
export default {
  name:"orderDialog",
  data () {
      return {
          addressForm:{
              address1:[],
              address2:''
          },
          cityData,
          addressVisible:false,
          addressFormRules:{
              address1:[
                  {
                     required:true,message:"请选择省市区县",trigger:'blur'
                  }],
                  address2:[{
                     required:true,message:"请填写详细地址",trigger:'blur'
                  }]
                  
          },
      }
  },
  methods: {
      dialogClose(){
          this.$refs.addressFormRef.resetFields()
          this.addressVisible=false
      }
  }
}
</script>

<style>
.aa{
    width: 100%;
}
.el-cascader-panel {
  height: 200px !important;
}
.params_cascader {
  width: 250px;
}
</style>