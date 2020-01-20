<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color:lightgreen;" v-if="scope.row.cat_deleted===false"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="danger" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="">
          <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        :total="total"
        :page-sizes="[3,5,10,15]"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" @close="addCateDialogClosed" :visible.sync="addCateDialogVisible">
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props=" cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click=" addCateDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addCateDialogVisible: false,
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类数据列表
      cateList: [],
      //总条数
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template", //定义为模板列
          template: "isok" //使用的模板名称
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      //添加分类表单的对象
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: ""
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //父级分类
      parentCateList: [],
      //级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true
      },
      //选中的父级分类key
      selectedKeys: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$axios.get("categories", {
        params: this.queryInfo
      });
      //   console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败");
      }
      this.$message.success("获取商品分类列表成功");
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //监听Pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddDialog() {
      this.addCateDialogVisible = true;
      this.getParentCateLiat();
    },
    //获取父级分类
    async getParentCateLiat() {
      const { data: res } = await this.$axios.get("categories", {
        params: { type: 2 }
      });
      console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！");
      }

      //   console.log(res.data);
      this.parentCateList = res.data.slice(0, 10);
      console.log(this.parentCateList);
    },
    //级联选择项发生变化触发该函数
    parentCateChange() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        //选中父级分类
        //父级分类id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        //为当前分类等级赋值
        this.addCateForm.cat_pid = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
    //   console.log(this.addCateForm);
    this.$refs.addCateFormRef.validate(async valid=>{
        if(!valid){
            return
        }
        const {data:res} = await this.$axios.post('categories',this.addCateForm)
        // console.log(res)
        if(res.meta.status!==201){
            return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addCateDialogVisible = false
        this.getCateList()
    })

    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    }
  }
};
</script>

<style>
.tree-table {
  margin-top: 15px;
}
</style>