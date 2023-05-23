<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="公告标题" prop="messageTitle">
        <el-input
          v-model="queryParams.messageTitle"
          placeholder="请输入公告标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="项目" prop="projectId">
        <el-select
          v-model="queryParams.projectId"
          placeholder="选择项目"
          clearable
        >
          <el-option
            v-for="project in projectOptions"
            :key="project.projectName"
            :label="project.projectName"
            :value="project.projectId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="类型" prop="messageType">
        <el-select
          v-model="queryParams.messageType"
          placeholder="公告类型"
          clearable
        >
          <el-option key="0" label="未读" value="0" />
          <el-option key="1" label="已读" value="1" />
          <el-option key="3" label="全部" value="3" />
        </el-select>
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
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="messageList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="序号"
        align="center"
        prop="messageId"
        width="40"
      />
      <el-table-column
        label="公告标题"
        align="center"
        prop="messageTitle"
        width="100"
      />
      <el-table-column
        label="消息内容"
        align="center"
        prop="messageContent"
        :show-overflow-tooltip="true"
      />
      
      <el-table-column 
        label="状态" 
        align="center" 
        prop="status" 
        width="100"
      />
      
      <el-table-column
        label="项目id"
        align="center"
        prop="projectId"
        width="100"
      />

      <el-table-column
        label="任务id"
        align="center"
        prop="taskId"
        width="100"
      />

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
            >阅读</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>

    </el-table>

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="messageTitle">
              <el-input
                v-model="form.messageTitle"
                placeholder="请输入公告标题"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="messageType">
              <el-select
                v-model="form.messageType"
                placeholder="请选择公告类型"
              >
                <el-option key="0" label="未读" value="0" />
                <el-option key="1" label="已读" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="24">
            <el-form-item label="内容">
              <editor v-model="form.messageContent" :min-height="192" />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMessage,
  getMessage,
  delMessage,
  addMessage,
  updateMessage,
} from "@/api/system/message";

import { listProject } from "@/api/system/project";

export default {
  name: "Message",
  dicts: ["sys_show_hide", "sys_normal_disable"],
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
      // 总条数
      total: 0,
      // 公告表格数据
      messageList: [],
      // 项目list
      projectOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        messageTitle: undefined,
        projectId: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        messageTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" },
        ],
        messageType: [
          { required: true, message: "公告类型不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getprojectOptions();
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      listMessage(this.queryParams).then((response) => {
        this.messageList = response.data.messages;
        this.loading = false;
      });
    },
    getprojectOptions() {
      this.loading = true;
      listProject(this.queryParams).then((response) => {
        this.projectOptions = this.handleTree(response.data.projects, "projectId");
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
        messageTitle: undefined,
        messageContent: undefined,
        status: "0",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.messageId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const messageId = row.messageId || this.ids;
      getMessage(messageId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公告";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.messageId != undefined) {
            updateMessage(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMessage(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const messageIds = row.messageId || this.ids;
      this.$modal
        .confirm('是否确认删除公告编号为"' + messageIds + '"的数据项？')
        .then(function () {
          return delMessage(messageIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
