<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="adddialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="closeById(scope.row, item1.id)" closable>
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级与三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="closeById(scope.row, item2.id)"
                      type="success"
                      closable
                    >
                      {{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13">
                    <el-tag
                      @close="closeById(scope.row, item3.id)"
                      type="warning"
                      closable
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      :class="[index3 === 0 ? '' : 'bdtop']"
                      >{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(slotProps.row.id)"
              size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeUser(slotProps.row.id)"
              size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(slotProps.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
        ref="addformRuleForm"
        label-width="70px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
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
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setRightDialogVisible"
      width="40%"
      @close="setRightDialogClosed()"
    >
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      //添加用户对话框的消失与隐藏
      adddialogVisible: false,

      // 修改对话框的消失与隐藏
      editDialogVisible: false,
      setRightDialogVisible: false,

      //修改表单的绑定对象
      editForm: {},
      //所有权限的数据
      rightsList: [],
      roleId:"",
      //默认选中id值得数组
      defKeys: [],
      
      //添加表单的绑定对象
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      //树形控件的组件嵌套
      defaultProps: {
        children: "children",
        label: "authName",
      },
    };
  },

  created() {
    this.getRolesList();
  },

  methods: {
    //获取角色权限的列表
    async getRolesList() {
      const result = await this.$http.get("roles");
    
      if (result.data.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = result.data.data;

    
    },

    // 清除表单新的内容
    clearForm() {
      this.$refs.addformRuleForm.resetFields();
    },

    //监听修改用户对话框的关闭事件
    editclearForm() {
      this.$refs.editFormRef.resetFields();
    },

    //添加新用户
    async addUser() {
      //可以发起添加用户的请求
      const result = await this.$http.post("roles", this.addForm);
   
      if (result.data.meta.status !== 201) {
        return this.$message.error("创建用户失败");
      } else {
        this.$message.success("创建用户成功");
        //隐藏添加用户的对话框s
        this.adddialogVisible = false;
        this.getRolesList();
      }
    },

    //根据id查询角色
    async showEditDialog(id) {
    

      const result = await this.$http.get("roles/" + id);
   
      if (result.data.meta.status != 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editDialogVisible = true;
      this.editForm = result.data.data;
    },

    //修改表单的提交
    async editUserInfo() {
      //可以发起添加用户的请求
      const result = await this.$http.put("roles/" + this.editForm.roleId, {
        roleDesc: this.editForm.roleDesc,
        roleName: this.editForm.roleName,
      });
    
      if (result.data.meta.status !== 200) {
        return this.$message.error("修改用户失败");
      } else {
        this.$message.success("修改用户成功");
        //隐藏添加用户的对话框
        this.editDialogVisible = false;
        this.getRolesList();
      }
    },

    // 删除表单
    removeUser(id) {
      this.$confirm("此操作将永久删除该用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$http.delete("roles/" + id);
          if (result.data.meta.status !== 200) {
            return this.$message.error("修改用户失败");
          } else {
            //隐藏添加用户的对话框
            this.editDialogVisible = false;
            this.getRolesList();
          }
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    closeById(row, rightId) {
      this.$confirm("此操作将永久删除该用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$http.delete(
            `roles/${row.id}/rights/${rightId}`
          );
        
          if (result.data.meta.status !== 200) {
            return this.$message.error("修改用户失败");
          } else {
            //隐藏添加用户的对话框
            this.editDialogVisible = false;
            //this.getRolesList();//重新获取数据，重新渲染table表格
            row.children = result.data.data;
          }
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //获取所有权限列表信息
    async showSetRightDialog(role) {
      this.roleId = role.id;
  
      const result = await this.$http.get("rights/tree");
   
      if (result.data.meta.status !== 200) {
        return this.$message.error("获取用户权限数据失败");
      } else {
        //this.$message.success("修改用户成功");
        //获取到的数据保存到data中
        (this.rightsList = result.data.data),
          this.getLeafKeys(role, this.defKeys),
          (this.setRightDialogVisible = true);
       
      }
    },
    //通过递归形式，获取角色下所有三级权限得id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      //如果当前node节点不包括children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    setRightDialogClosed() {
      this.defKeys = [];
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
  
      const idStr = keys.join(",");
      const result =await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr,
      });

      if (result.data.meta.status !== 200) {
        return this.$message.error("分配用户权限数据失败");
      } else {
        this.$message.success("分配用户权限成功");
        //获取到的数据保存到data中
        this.getRolesList();
        this.setRightDialogVisible = false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
