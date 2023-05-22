<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="需求名称" prop="requireName">
        <el-input
          v-model="queryParams.requireName"
          placeholder="请输入需求名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="需求状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="requireList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="需求编号" prop="requireId" width="120" />
      <el-table-column
        label="需求名称"
        prop="requireName"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="300"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="requireContent" width="100" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-message"
            @click="handleEnter(scope.row)"
            >进入</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改项目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <!-- 表单内容 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <!-- 选择团队 -->
          <el-col :span="12">
            <el-form-item label="项目ID" prop="projectId">
              <el-input
                v-model="form.projectId"
                placeholder="项目Id"
                disabled
              />
            </el-form-item>
          </el-col>
          <!-- 项目名称 -->
          <el-col :span="12">
            <el-form-item label="需求名称" prop="requireName">
              <el-input
                v-model="form.requireName"
                placeholder="请输入需求名称"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="结束时间" prop="overTime">
              <el-date-picker
                v-model="form.overTime"
                type="datetime"
                placeholder="选择结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker
                v-model="form.createTime"
                type="datetime"
                placeholder="选择创建时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="0">正常</el-radio>
                <el-radio label="1">完结</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="项目简介" prop="requireContent">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入内容"
                v-model="form.requireContent"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="选择负责人" prop="leaderId">
              <el-select v-model="form.leaderId" placeholder="请选择">
                <el-option
                  v-for="item in leaderOptions"
                  :key="item.userId"
                  :label="item.userId"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入联系邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 表单底部 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
import {
  listRequireById,
  getRequire,
  addRequire,
  updateRequire,
  changeRequireStatus,
  delRequire,
} from "@/api/system/require";
import { listUser } from "@/api/system/user";

export default {
  name: "Require",
  dicts: ["sys_normal_disable"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 需求表格数据
      requireList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "需求名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    const projectId = this.$route.params && this.$route.params.projectId;
    this.getList(projectId);
    this.getUserList();
  },
  methods: {
    /** 进入操作 */
    handleEnter: function(row) {
        const requireId = row.requireId;
        this.$router.push("/system/task/"+requireId);
        },

    /** 查询需求列表 */
    getList(projectId) {
      this.$router.push("/system/require/" + projectId);
      this.loading = true;
      listRequireById(projectId).then((response) => {
        this.requireList = response.data.requires;
        this.loading = false;
      });
    },

    // 需求状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal
        .confirm('确认要"' + text + '""' + row.requireName + '"需求吗？')
        .then(function () {
          return changeRequireStatus(row.requireId, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    /** 查询用户列表 */
    getUserList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
        this.leaderOptions = this.handleTree(response.data.users, "userId");
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        requireId: undefined,
        requireName: undefined,
        status: "0",
        requireContent: undefined,
        createTime: undefined,
        projectId:undefined,
        overTime: undefined,
        phone: undefined,
        email:undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.$route.params.projectId);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.requireId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == "project") {
        this.$refs.project.setCheckedNodes(value ? this.projectOptions : []);
      } else if (type == "team") {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加需求";
      this.form.projectId=this.$route.params.projectId;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const requireId = row.requireId || this.ids;
      getRequire(requireId).then((response) => {
        this.form = response.data.require;
        this.open = true;
        this.title = "修改需求";
      });
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.requireId != undefined) {
            updateRequire(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList(this.$route.params.projectId);
            });
          } else {
            addRequire(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList(this.$route.params.projectId);
            });
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const requireId = row.requireId || this.ids;
      this.$modal
        .confirm('是否确认删除需求编号为"' + requireId + '"的数据项？')
        .then(function () {
          return delRequire(requireId);
        })
        .then(() => {
          this.getList(this.$route.params.projectId);
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/role/export",
        {
          ...this.queryParams,
        },
        `role_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>