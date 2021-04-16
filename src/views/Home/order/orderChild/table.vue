<template>
  <div>
    <el-table :data="orderList" border scripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
              <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
          </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="订单时间" prop="create_time">
          <template v-slot="scope">
               {{scope.row.create_time | showDate}} 
          </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
          <el-button size="mini" type="success" icon="el-icon-location" @click="change(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
 
<script>
import {formatDate} from '../../../../components/utils'
export default {
  name: "orderTable",
  props: {
      orderList:{
          type:Array,
          default(){
              return []
          }
      }
  },
    filters: {
		  showDate: function (value) {
        let date = new Date(value*1000);
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    methods: {
      edit(row){
        this.$emit('orderEmit',row)
      },
      change(row){
        this.$emit('orderChange',row)
      }
    }
};
</script>

<style></style>
