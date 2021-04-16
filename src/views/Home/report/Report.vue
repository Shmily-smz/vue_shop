<template>
  <div>
        <breadcrumbLists :breadcrumbLists="breadcrumbLists"></breadcrumbLists>
        <el-card>
            <div id="main" style="width:750px;height:400px"></div>
        </el-card>
  </div>
</template>

<script>
import breadcrumbLists from '../goods/goodslist/breadcrumb'
import echarts from 'echarts'
export default {
  name:"report",
  data () {
      return {
            breadcrumbLists:["数据统计","数据报表"],
            options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
  },
  components: {
      breadcrumbLists
  },
  //dom元素被渲染完毕
 async mounted () {
    
     var myChart = echarts.init(document.getElementById('main'));
     const result=await this.$http.get("reports/type/1")
   const returnedTarget = Object.assign(this.options,result.data.data);

        // 使用刚指定的配置项和数据显示图表。
         myChart.setOption(returnedTarget);
  }
}
</script>

<style>

</style>