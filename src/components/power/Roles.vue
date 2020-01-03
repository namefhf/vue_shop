<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1==0?'bdtop':'','vcenter']"
              v-for="(item1,i1) in (scope.row.children)"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2==0?'':'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="removeRightById(scope.row,item2.id)"
                      closable
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      @close="removeRightById(scope.row,item3.id)"
                      closable
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色dialog -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" @close="addDialogClosed">
      <el-form :model="addRoleForm" ref="addFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色dialog -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" @close="editDialogClosed">
      <el-form :model="editRoleForm" ref="editFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限dialog -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree
        show-checkbox
        node-key="id"
        :default-checked-keys="defkeys"
        default-expand-all
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
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
      roleid: "", //当前分配权限的角色id
      roleList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      rightsList: [],
      //树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      //默认选中的节点id值数组
      defkeys: [],
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      editRoleForm: {
        roleName: "",
        roleDesc: ""
      }
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await this.$axios.get("roles");
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.$message.success("获取角色列表成功");
      this.roleList = res.data;
    },
    // 添加角色
    async addRole() {
      // this.addDialogVisible = true;
      const { data: res } = await this.$axios.post("roles", this.addRoleForm);
      console.log(res);
      if (res.meta.status !== 201) {
        return this.$message.error("创建角色失败");
      }
      this.$message.success("创建角色成功");
      this.addDialogVisible = false;
      this.getRoleList();
    },
    //重置添加角色表单
    addDialogClosed() {
      // this.addRoleForm.roleName = ''
      // this.addRoleForm.roleDesc = ''
      this.$refs.addFormRef.resetFields();
    },
    //重置编辑角色表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //打开编辑角色信息dialog
    async showEditDialog(id) {
      // console.log(id)
      this.editDialogVisible = true;
      const { data: res } = await this.$axios.get(`roles/${id}`);
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色信息失败");
      }
      this.$message.success("获取角色信息成功");
      this.editRoleForm = res.data;
      // console.log(this.editRoleForm)
    },
    // 编辑角色信息
    async editRole() {
      const { data: res } = await this.$axios.put(
        `roles/${this.editRoleForm.roleId}`,
        {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("编辑角色信息失败");
      }
      this.$message.success("编辑角色信息成功");
      this.editDialogVisible = false;
      this.getRoleList();
    },
    // 删除角色
    deleteRole(id) {
      // console.log(id)
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //发起删除角色请求
          this.$axios.delete(`roles/${id}`).then(re => {
            if (re.data.meta.status !== 200) {
              return this.$message.error("删除失败");
            }
            this.$message.success("删除成功");
            this.getRoleList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async removeRightById(role, rightid) {
      const confirmresult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmresult !== "confirm") {
        return this.$message.error("取消了删除");
      }
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightid}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      role.children = res.data;
      // this.getRoleList();会刷新页面
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleid = role.id;
      // 获取所有权限数据
      const { data: res } = await this.$axios.get("rights/tree");
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.$message.success("获取权限列表成功");
      this.rightsList = res.data;
      // 递归获取三级节点id
      this.getLeafKeys(role, this.defkeys);
      this.setRightDialogVisible = true;
    },
    // 递归获取三级节点id
    getLeafKeys(node, arr) {
      if (!node.children) {
        //如果node节点不包含children属性则是三级节点
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    //关闭树形控件清空defkeys数组
    setRightDialogClosed() {
      this.defkeys = [];
    },
    //点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      console.log(keys);
      const idStr = keys.join(",");
      const { data: res } = await this.$axios.post(
        `roles/${this.roleid}/rights`,
        { rids: idStr }
      );
      // console.log(res);
      if(res.meta.status!==200){
        return this.$message.error('更新权限失败')
      }
      this.$message.success('更新权限成功')
      this.setRightDialogVisible = false
      this.getRoleList()
    }
  }
};
</script>

<style lang="less" scoped>
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>