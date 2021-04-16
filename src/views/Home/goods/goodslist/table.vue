<template>
  <div>
    <el-table :data="goodsList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格（元）" prop="goods_price" width="95px"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="140px">
          <template v-slot="scope">
              {{scope.row.add_time | showDate}}   
          </template>
      </el-table-column>
      
      <el-table-column label="操作" width="300px">
        <template v-slot="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editgoodslist(scope.row.goods_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deletegoodslist(scope.row.goods_id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {formatDate} from '../../../../components/utils'
export default {
  name: "goodsListTable",
  props: {
    goodsList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  filters: {
		  showDate: function (value) {
        let date = new Date(value*1000);
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
  components: {},
  methods: {
      deletegoodslist(id){
        this.$emit("deletegoodslistEdit",id)
      },
      editgoodslist(id){
this.$emit("editgoodslistEdit",id)
      }
  }
};
</script>

<style>
</style>
