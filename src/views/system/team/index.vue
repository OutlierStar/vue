<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="团队名称" prop="teamName">
        <el-input
          v-model="queryParams.teamName"
          placeholder="请输入团队名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="团队状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          
          @click="handleDelete(scope.row)"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="teamList"
      row-key="teamId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="teamId" label="团队编号" width="100"></el-table-column>
      <el-table-column prop="teamName" label="团队名称" width="100"></el-table-column>
      <el-table-column label="状态" align="center" width="140">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="leaderId" label="负责人" width="140"></el-table-column>
      <el-table-column prop="phone" label="电话" width="140"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleInvate(scope.row)"
          >邀请</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-position"
            @click="handleEnter(scope.row)"
          >进入</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="团队ID" prop="teamId">
              <el-input v-model="form.teamId" placeholder="团队ID自动生成" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="团队名称" prop="teamName">
              <el-input v-model="form.teamName" placeholder="请输入团队名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="选负责人" prop="leaderId">
              <el-select v-model="form.leaderId" placeholder="请选择">
                <el-option
                  v-for="item in leaderList"
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
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="项目状态" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio label="0">正常</el-radio>
                  <el-radio label="1">完结</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--邀请框-->
    <el-dialog :title="title" :visible.sync="invate" width="300px" append-to-body>
        <el-form ref="invates" :model="invates" label-width="80px">
          <el-form-item label="邀请成员" prop="leaderId">
              <el-select v-model="invates.userId" multiple placeholder="请选择">
                <el-option
                  v-for="item in leaderList"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm1">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTeam, getTeam, delTeam, addTeam, updateTeam } from "@/api/system/team";
import { listUser } from "@/api/system/user";
import { Invate, getTeamMate} from "@/api/system/userteam";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Team",
  dicts: ['sys_normal_disable'],
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      teamList: [],
      //团队中用户数据
      userteams: [],
      //用户数据
      leaderList:[],
      // 团队树选项
      teamOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 邀请框是否显示
      invate:false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        teamName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 邀请列表
      invates:{},
      //信息表
      message:{},
      // 重置信息表
      resetDetail() {
        this.message = {
          messageId: undefined,
          messageTitle: undefined,
          messageContent: undefined,
          status: "0",
        };
      },
      rules: {  
        teamName: [
          { required: true, message: "团队名称不能为空", trigger: "blur" }
        ],
        leaderId: [
          { required: true, message: "必须为某用户ID", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getUserList();
  },
  methods: {
    /** 查询团队列表 */
    getList() {
      this.loading = true;
      listTeam(this.queryParams).then((response) => {
        this.teamList = this.handleTree(response.data.teams, "teamId");
        this.loading = false;
      });
    },

    // 团队状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.teamName + '"团队吗？').then(function() {
        return changeUserStatus(row.teamId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    //进入团队
    handleEnter(row){
      this.loading = true;
      getTeamMate(row.teamId).then((response)=>{
        this.userteams = response.data.userteams;
        this.loading = false;
        console.log(this.userteams);
      })
      this.$router.push("/system/userteam/"+row.teamId)
    },
    /** 查询用户列表 */
    getUserList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
        this.leaderList = this.handleTree(response.data.users, "userId");
        this.loading = false;
      });
    },
    
    // 取消按钮
    cancel() {
      this.open = false;
      this.invate = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        teamId: undefined,
        teamName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0",
        leaderId: undefined
      };
      this.invates = {
        teamId: undefined,
        userId: [],
      }
      this.resetForm("form");
      this.resetForm("invates");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.teamId;
      }
      this.open = true;
      this.title = "添加团队";
      listTeam().then(response => {
        this.teamOptions = this.handleTree(response.data.team, "teamId");
      });
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
      getTeam(row.teamId).then(response => {
        this.form = response.data.team;
        this.open = true;
        this.title = "修改团队";
        
      });
    },

    /**邀请按钮操作 */
    handleInvate(row){
      this.invate = true;
      this.title = "邀请成员"
      this.invates.teamId = row.teamId
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.teamId != undefined) {
            updateTeam(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeam(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 邀请框提交按钮 */
    submitForm1: function() {
      this.$refs["invates"].validate(valid => {
        if (valid) {
          if(this.invates!=null){
              var ids = this.invates.userId;
              Invate(this.invates.teamId,ids).then((response)=>{
                this.$modal.msgSuccess("邀请成功");
              this.invate = false;
              })
            };
          }else{
            this.$modal.msgSuccess("邀请失败");
              this.invate = false;
          }
          })
      },
    
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除名称为"' + row.teamName + '"的数据项？').then(function() {
        return delTeam(row.teamId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    
  }
  }}
</script>
