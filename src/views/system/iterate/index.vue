<template>
    <div class="app-container">
      <!-- 搜索 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
      >
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="queryParams.projectName"
            placeholder="请输入项目名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="项目状态"
            clearable
          >
            <el-option
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
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
  
      <!-- 表上的新增 -->
      <el-row :gutter="10" class="mb8">
        <!-- 新增 -->
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
  
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>
  
      <!-- 项目表 -->
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="projectList"
        row-key="projectId"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          prop="projectId"
          label="项目id"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="projectName"
          label="项目名称"
          :show-overflow-tooltip="true"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="projectContent"
          label="简介"
          :show-overflow-tooltip="true"
          width="160"
        ></el-table-column>
            <el-table-column
            prop="leaderId"
            label="负责人"
            :show-overflow-tooltip="true"
            width="160"
        ></el-table-column>
        <el-table-column
            prop="phone"
            label="电话"
            :show-overflow-tooltip="true"
            width="160"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
  
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-position"
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
            <!-- 选择团队 -->
            <el-col :span="12">
              <el-form-item label="选择团队" prop="teamId">
                <el-select v-model="form.teamId" placeholder="请选择">
                  <el-option
                    v-for="item in teamOptions"
                    :key="item.teamId"
                    :label="item.teamName"
                    :value="item.teamId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 项目名称 -->
            <el-col :span="12">
              <el-form-item label="项目名称" prop="projectName">
                <el-input
                  v-model="form.projectName"
                  placeholder="请输入项目名称"
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
              <el-form-item label="项目简介" prop="projectContent">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入内容"
                  v-model="form.projectContent"
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
    listProject,
    getProject,
    delProject,
    addProject,
    updateProject,
  } from "@/api/system/project";
  
  import { listTeam } from "@/api/system/team";
import { listUser } from "@/api/system/user";   
  
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import IconSelect from "@/components/IconSelect";
  
  export default {
    name: "Project",
    dicts: ["sys_show_hide", "sys_normal_disable"],
    components: { IconSelect },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 项目表格数据
        projectList: [],
        // 团队选项
        teamOptions: [],
        // 负责人选项
        leaderOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否展开，默认全部折叠
        isExpandAll: false,
        // 重新渲染表格状态
        refreshTable: true,
        // 查询参数
        queryParams: {
          projectName: undefined,
          visible: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          projectName: [
            { required: true, message: "项目名称不能为空", trigger: "blur" },
          ],
        },
      };
    },
    created() {
      this.getList();
      this.getTeamList()
      this.getUserList()
    },
    methods: {
     
      /** 查询项目列表 */
      getList() {
        this.loading = true;
        listProject(this.queryParams).then((response) => {
          this.projectList = this.handleTree(response.data.projects, "projectId");
          this.loading = false;
        });
      },

      // 项目状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.projectName + '"项目吗？').then(function() {
        return changeUserStatus(row.projectId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
  
      /** 查询团队列表 */
      getTeamList() {
        this.loading = true;
        listTeam(this.queryParams).then((response) => {
          this.teamOptions = this.handleTree(response.data.teams, "teamId");
          this.loading = false;
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
          projectId: undefined,
          projectName: undefined,
          orderNum: undefined,
          teamId: undefined,
          createTime: undefined,
          status: "0",
          leaderId : undefined
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 进入操作 */
      handleEnter: function(row) {
        const projectId = row.projectId;
        this.$router.push("/system/projectInfo/"+projectId);
        },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加项目";
      },
      /** 展开/折叠操作 */
      toggleExpandAll() {
        this.refreshTable = false;
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        getProject(row.projectId).then((response) => {
          this.form = response.data.project;
          this.open = true;
          this.title = "修改项目";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.projectId != undefined) {
              updateProject(this.form).then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addProject(this.form).then((response) => {
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
        this.$modal
          .confirm('是否确认删除名称为"' + row.projectName + '"的数据项？')
          .then(function () {
            return delProject(row.projectId);
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
  