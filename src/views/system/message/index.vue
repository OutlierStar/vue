<template>
  <div class="app-container">
    <!-- 搜索  -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="消息标题" prop="messageTitle">
        <el-input
          v-model="queryParams.messageTitle"
          placeholder="请输入消息标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="消息内容" prop="messageContent">
        <el-input
          v-model="queryParams.messageContent"
          placeholder="请输入消息内容"
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

      <el-form-item label="类型" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="消息类型"
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

    <!-- 表上操作按钮 -->
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

    <!-- 数据表 -->
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
        label="消息标题"
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

      <el-table-column label="状态" align="center" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="danger">未读</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success"
            >已读</el-tag
          >
          <el-tag v-else-if="scope.row.status === 2" type="warning"
            >已删</el-tag
          >
          <el-tag v-else type="warning">已删</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="项目"
        align="center"
        prop="projectId"
        width="100"
      />

      <el-table-column label="任务" align="center" prop="taskId" width="100" />

      <!-- 表中操作 -->
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
            @click="handleRead(scope.row)"
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

    <!-- 添加消息对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="780px"
      append-to-body
      v-dialogDrag
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="消息标题" prop="messageTitle">
              <el-input
                v-model="form.messageTitle"
                placeholder="请输入消息标题"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="消息类型" prop="menuType">
              <el-radio-group v-model="form.menuType"  >
                <el-radio label="M">项目</el-radio>
                <el-radio label="C">任务</el-radio>
                <el-radio label="F">成员</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12" >
            <el-form-item label="选择项目" placeholder="请选择" prop="projectId">
              <el-select v-model="form.projectId" filterable @change="selectChange(form.projectId)" placeholder="请选择项目">
                <el-option
                  v-for="project in projectOptions"
                  :key="project.projectName"
                  :label="project.projectName"
                  :value="project.projectId"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item label="选择任务" prop="taskId">
              <el-select v-model="form.taskId" filterable placeholder="请选择任务">
                <el-option
                  v-for="task in taskOptions"
                  :key="task.taskName"
                  :label="task.taskName"
                  :value="task.taskId"
                />

              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="form.menuType == 'F'">
            <el-form-item label="选择成员" prop="userId">
              <el-select v-model="form.userId" filterable placeholder="请选择成员">
                <el-option
                  v-for="user in userOptions"
                  :key="user.userName"
                  :label="`${user.nickName}(${user.userName})`"
                  :value="user.userId"
                />

              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="内容">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 5 }"
                placeholder="请输入内容"
                v-model="form.messageContent"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看消息对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="detailopen"
      width="780px"
      append-to-body
      v-dialogDrag
    >
      <el-row>
        <el-col :span="24">
          <el-label>消息标题</el-label>
          <p>{{ this.detail.message.messageTitle }}</p>
        </el-col>

        <el-col :span="24">
          <el-label>消息内容</el-label>
          <p>{{ this.detail.message.messageContent }}</p>
        </el-col>
        <el-col v-if="this.detail.project != null" :span="12">
          <el-label>项目</el-label>
          <p>
            <a @click="toProjectInfo()">{{
              this.detail.project.projectName
            }}</a>
          </p>
        </el-col>

        <el-col v-if="this.detail.task != null" :span="12">
          <el-label>任务</el-label>
          <p>{{ this.detail.task.taskName }}</p>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRead">确 定</el-button>
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
  readMessage,
  delMessageList,
} from "@/api/system/message";

import { listProject, getProject } from "@/api/system/project";
import { listTaskByProjectId } from "@/api/system/task";
import { listUserByProjectId } from "@/api/system/userProject";

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
      // 消息表格数据
      messageList: [],
      // 项目list
      projectOptions: [],
      taskOptions:[],
      userOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示新增弹出层
      open: false,
      // 是否显示详情弹出层
      detailopen: false,
      // 查询参数
      queryParams: {
        messageTitle: undefined,
        messageContent: undefined,
        projectId: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 消息详情
      detail: {
        message: {
          messageId: undefined,
          messageTitle: undefined,
          messageContent: undefined,
          projectId: undefined,
          status: undefined,
        },
        project: undefined,
        task: undefined,
      },
      // 表单校验
      rules: {
        messageTitle: [
          { required: true, message: "消息标题不能为空", trigger: "blur" },
        ],
        messageContent: [
          { required: true, message: "消息内容不能为空", trigger: "change" },
        ],
        menuType: [
          { required: true, message: "消息类型不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getprojectOptions();
  },
  methods: {
    /** 查询消息列表 */
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
        this.projectOptions = this.handleTree(
          response.data.projects,
          "projectId"
        );
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.detailopen = false;
      this.reset();
      this.resetDetail();
    },
    // 表单重置
    reset() {
      this.form = {
        messageTitle: undefined,
        messageContent: undefined,
        status: "0",
        menuType: "M",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.pageNum = 1;
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
      this.title = "添加消息";
    },
    // 表单重置
    resetDetail() {
      this.detail.message = {
        messageId: undefined,
        messageTitle: undefined,
        messageContent: undefined,
        status: "0",
      };
    },
    /** 阅读详情按钮操作 */
    handleRead(row) {
      this.resetDetail();
      const messageId = row.messageId;
      getMessage(messageId).then((response) => {
        this.detail.message = response.data.message;
        console.log(this.detail.message);
        this.detailopen = true;
        this.title = "消息详情";
        if (this.detail.message.projectId != null) {
          getProject(this.detail.message.projectId).then((response) => {
            this.detail.project = response.data.project;
          });
        }
        if (this.detail.message.taskId != null) {
          getTask(this.detail.message.taskId).then((response) => {
            this.detail.task = response.data.task;
          });
        }
      });
    },
    /** 提交已阅操作 */
    submitRead() {
      const messageId = this.detail.message.messageId;
      readMessage(messageId).then((response) => {
        this.detailopen = false;
        this.getList();
      });
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.messageId == undefined) {
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
        .confirm('是否确认删除消息编号为"' + messageIds + '"的数据项？')
        .then(function () {
          if (typeof messageIds == "object") {
            console.log("666");
            return delMessageList(messageIds);
          }
          console.log("777");
          return delMessage(messageIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    
    /** 跳转项目详情 */
    toProjectInfo() {
      this.$router.push("/system/projectInfo/" + this.detail.project.projectId);
    },
    /** 跳转项目详情 */
    selectChange(projectId) {
      listUserByProjectId(projectId).then((response) => {
          this.userOptions = response.data.users;
      });
      listTaskByProjectId(projectId).then((response) => {
          this.taskOptions = response.data.tasks;
      });
      
    },
    
  },
};
</script>
