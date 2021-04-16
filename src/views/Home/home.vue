<template>
  <el-container>
    <!-- 头部区 -->
    <el-header>
      <div>
        <img src="../../assets/images/timg.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="back">退出</el-button></el-header>
    <!-- 主题区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px' :'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"      
          router  
          :default-active="activePath"
        >
         
          <el-submenu :index="item.id+''" v-for="item in leftList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
              <!-- router 激活该模式会在激活导航以index作为path进行路由跳转 -->
            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(subItem.path)">
                <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </template>
            </el-menu-item>
           
          </el-submenu>
        </el-menu>
        
      </el-aside>

      <!-- 右侧主题曲 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "home",
  data(){
   return{
     //左侧列表数据
      leftList:[],
      iconObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'

      },
      isCollapse:false,
      activePath:''
   }
  },
  created () {
    this.getLeftlist();
    //home组件被创建的时候，
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    back() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getLeftlist(){
      const result=await this.$http.get('menus');   
      if(result.data.meta.status!=200){
        return this.$message.error(result.data.meta.msg)
      }else{
        this.leftList=result.data.data
      }
    },
    //实现侧边栏的隐藏与展开
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    //保存链接的激活状态 
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);
      //重新给新的activePath赋值
      this.activePath=activePath
    },  
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  height: 100%;
}
.el-main {
  background-color: #eaedf1;
}
.el-container {
  height: 100%;
}
img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.el-menu {
 
  border-right:0px;
}
.iconfont{
  margin-right: 7px;
}
.toggle-button{
  color: #fff;
  text-align:center;
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
