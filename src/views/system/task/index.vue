<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="任务名称" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          placeholder="请输入任务名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="任务状态"
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
      :data="taskList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="任务编号" prop="taskId" width="120" />
      <el-table-column
        label="任务名称"
        prop="taskName"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column label="状态" align="center" width="100" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '0'" type="danger">未开始</el-tag>
          <el-tag v-else-if="scope.row.status === '1'" type="success"
            >进行中</el-tag
          >
          <el-tag v-else-if="scope.row.status === '2'" type="warning"
            >已完成</el-tag
          >
          <el-tag v-else type="warning">未知</el-tag>
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
      <el-table-column label="内容" prop="taskContent" width="100" />
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


    <!-- 添加或修改项目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <!-- 表单内容 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目ID" prop="projectId">
              <el-input
                v-model="form.projectId"
                placeholder="项目Id"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="需求ID" prop="requireId">
              <el-input
                v-model="form.requireId"
                placeholder="需求Id"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="taskName">
              <el-input v-model="form.taskName" placeholder="请输入任务名称" />
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
            <el-form-item label="任务状态" prop="status">
              <el-select v-model="form.status" placeholder="">
                <el-option key="0" label="未开始" value="0" />
                <el-option key="1" label="进行中" value="1" />
                <el-option key="2" label="已完成" value="2" />
              </el-select>

              <!-- 原有的 -->
              <!-- <el-radio-group v-model="form.status">
                <el-radio label="0">未开始</el-radio>
                <el-radio label="1">进行中</el-radio>
                <el-radio label="2">已完成</el-radio>
              </el-radio-group> -->
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="任务简介" prop="taskContent">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入内容"
                v-model="form.taskContent"
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
                  :label="item.nickName"
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
  listTaskById,
  getTask,
  addTask,
  updateTask,
  changeTaskStatus,
  delTask,
} from "@/api/system/task";
import { listUser } from "@/api/system/user";

export default {
  name: "Task",
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
      // 任务表格数据
      taskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 人员列表
      leaderOptions: [],
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
          { taskd: true, message: "任务名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    const requireId = this.$route.params && this.$route.params.requireId;
    const projectId = this.$route.params && this.$route.params.projectId;
    this.getList(requireId);
    this.getUserList();
  },
  methods: {
    /** 进入操作 */
    handleEnter: function (row) {
      const taskId = row.taskId;
      this.$router.push("");
    },

    /** 查询任务列表 */
    getList(requireId) {
      if (requireId == undefined) {
        requireId = this.$route.params.requireId
      }
      this.loading = true;
      listTaskById(requireId).then((response) => {
        this.taskList = response.data.tasks;
        this.loading = false;
      });
    },

    // 任务状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal
        .confirm('确认要"' + text + '""' + row.taskName + '"任务吗？')
        .then(function () {
          return changeTaskStatus(row.taskId, row.status);
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
        taskId: undefined,
        taskName: undefined,
        status: "0",
        taskContent: undefined,
        createTime: undefined,
        requireId: undefined,
        overTime: undefined,
        phone: undefined,
        email: undefined,
        projectId: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList(this.$route.params.requireId);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.taskId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == "require") {
        this.$refs.require.setCheckedNodes(value ? this.requireOptions : []);
      } else if (type == "team") {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加任务";
      this.form.requireId = this.$route.params.requireId;
      this.form.projectId = this.$route.params.projectId;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const taskId = row.taskId || this.ids;
      getTask(taskId).then((response) => {
        this.form = response.data.task;
        this.open = true;
        this.title = "修改任务";
      });
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.taskId != undefined) {
            updateTask(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList(this.$route.params.requireId);
            });
          } else {
            addTask(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList(this.$route.params.requireId);
            });
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const taskId = row.taskId || this.ids;
      this.$modal
        .confirm('是否确认删除任务编号为"' + taskId + '"的数据项？')
        .then(function () {
          return delTask(taskId);
        })
        .then(() => {
          this.getList(this.$route.params.requireId);
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