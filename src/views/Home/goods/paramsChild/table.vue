<template>
  <div>
    <el-table :data="onlyTableData" border stripe>
      <el-table-column type="expand">
        <template v-slot="scope">
          <el-tag closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close="closeAble(scope.row,index)">{{item}}</el-tag>

          <el-input
            class="input-new-tag"
            v-if="scope.row.inputVisible"
            v-model="scope.row.inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm(scope.row)"
            @blur="handleInputConfirm(scope.row)"
          ></el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput(scope.row)"
          >+ New Tag</el-button>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="参数" prop="attr_name"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editParams(scope.row.attr_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteParams(scope.row.attr_id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "paramsTable",
  data() {
    return {};
  },
  props: {
    onlyTableData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    editParams(attr_id) {
      this.$emit("editVisibel", attr_id);
    },
    deleteParams(attr_id) {
      this.$emit("deleteVisibel", attr_id);
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue=""
        row.inputVisible = false;
        return
      }else{
        row.attr_vals.push(row.inputValue.trim())
        
        this.$emit("tablehandleInputConfirm",row)
         row.inputValue=""
        row.inputVisible = false;

      }
    },
    // $nextTick作用是当页面元素被从新渲染时，才会指定回调函数当中的代码
    showInput(row) {
      (row.inputVisible = true),
        this.$nextTick((_) => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    closeAble(row,index){
      this.$emit('tableCloseable',row,index)
    }
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin-left: 10px;
}
.el-input {
  width: 120px;
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
}
</style>