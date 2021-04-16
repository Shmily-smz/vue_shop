<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索与添加区域 -->
          <!-- 双向绑定关键字 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserlist()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserlist()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="adddialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!-- 布尔值无法在页面上渲染，作用域插槽，拿到这一行的数据就能.出想要的数据 -->
        <el-table-column label="状态">
          <template v-slot="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(slotProps.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="slotProps">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(slotProps.row.id)"
              ></el-button> </el-tooltip
            ><el-tooltip
              class="item"
              effect="dark"
              content="删除信息"
              placement="top"
              :entelable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="removeUser(slotProps.row.id)"
              ></el-button> </el-tooltip
            ><el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="setRole(slotProps.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="clearForm"
    >
      <!-- 内容主体 -->

      <el-form
        :model="addForm"
        status-icon
        :rules="addFormrules"
        ref="addformRuleForm"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editclearForm"
    >
      <el-form
        :model="editForm"
        status-icon
        :rules="editFormrules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="提示" :visible.sync="steRoleDialogVisible" width="30%" @close="setRoleDialogClosed">
      <div>
        <p>{{ userInfo.username }}</p>
        <p>{{ userInfo.role_name }}</p>
        <p>分配新角色
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="steRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //验证邮箱的正则表达式
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    //验证手机号的正则表达
    var checkPhone = (rule, value, callback) => {
      const regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regPhone.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      rolesList: [],
      //控制分配角色对话框得显示与隐藏
      steRoleDialogVisible: false,
      userlist: [],
      total: 0,
      selectedRoleId:"",
      adddialogVisible: false, //控制对话框的显示与隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editForm: {},
      //制定用户表单的规则
      addFormrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
      editFormrules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
      userInfo: [],
    };
  },
  created() {
    this.getUserlist();
  },
  methods: {
    //获取用户列表
    async getUserlist() {
      const result = await this.$http.get("users", { params: this.queryInfo });
    
      if (result.data.meta.status != 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.total = result.data.data.total;
      this.userlist = result.data.data.users;
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
  
      this.queryInfo.pagesize = newSize;
      this.getUserlist();
    },
    //监听页码值的改变
    handleCurrentChange(newpage) {
    
      this.queryInfo.pagenum = newpage;
      this.getUserlist();
    },
    //监听开关状态的改变switch
    async userStateChange(userInfo) {
    
      const result = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
    
      if (result.data.meta.status != 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新数据状态失败");
      }
      this.$message.success("更新数据状态成功");
    },
    //监听添加用户对话框的关闭事件
    clearForm() {
      this.$refs.addformRuleForm.resetFields();
    },
    //监听修改用户对话框的关闭事件
    editclearForm() {
      this.$refs.editFormRef.resetFields();
    },
    //点击确定按钮对表单的预处理,添加新用户
    addUser() {
      this.$refs.addformRuleForm.validate(async (valid) => {
     
        if (!valid) return;
        //可以发起添加用户的请求
        const result = await this.$http.post("users", this.addForm);
      
        if (result.data.meta.status !== 201) {
          return this.$message.error("创建用户失败");
        } else {
          this.$message.success("创建用户成功");
          //隐藏添加用户的对话框
          this.adddialogVisible = false;
          this.getUserlist();
        }
      });
    },
    //获取想要修改表单的数据
    async showEditDialog(id) {   
      const result = await this.$http.get("users/" + id);  
      if (result.data.meta.status != 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editDialogVisible = true;
      this.editForm = result.data.data;
    },
    //修改表单的预验证
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
     
        if (!valid) return;
        //可以发起添加用户的请求
        const result = await this.$http.put("users/" + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        });
      
        if (result.data.meta.status !== 200) {
          return this.$message.error("修改用户失败");
        } else {
          this.$message.success("修改用户成功");
          //隐藏添加用户的对话框
          this.editDialogVisible = false;
          this.getUserlist();
        }
      });
    },
    removeUser(id) {
      true;
      this.$confirm("此操作将永久删除该用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          const result = await this.$http.delete("users/" + id);
          if (result.data.meta.status !== 200) {
            return this.$message.error("修改用户失败");
          } else {
            this.$message.success("修改用户成功");
            //隐藏添加用户的对话框
            this.editDialogVisible = false;
            this.getUserlist();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //展示分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      const result = await this.$http.get("roles"); 
      if (result.data.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = result.data.data;   
      this.steRoleDialogVisible = true;
    },
    // 点击按钮分配角色
   async saveRoleInfo(){
      if(!this.selectedRoleId!=0){
         return this.$message.error("请选择要分配的角色");
      }
      const result = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId});         
      if (result.data.meta.status !== 200) {
        return this.$message.error("分配角色失败");
      }
      this.steRoleDialogVisible=false,     
      this.getUserlist();
    },
    //关闭分配角色对话框后清空input
    setRoleDialogClosed(){
      this.selectedRoleId="";
      this.userInfo={}
    }
  },
};
</script>
<style lang="less" scoped>
.el-popper{
  margin-top: 244px !important;
}</style>
