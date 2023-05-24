<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>团队信息</span>
          </div>
          <div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />团队名称
                <div class="pull-right">{{ team.teamName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">{{ team.phone }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">{{ team.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />负责人
                <div class="pull-right">{{ user.nickName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ team.createTime }}</div>
              </li>
              <li>
                <div style="margin-top: 20px">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-cloudy"
                    @click="goTarget()"
                    style="margin-left: 20px"
                    >返回</el-button
                  >
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" :xs="24">
        <el-card class="box-card">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="成员列表" name="member">
                <el-table
                    v-loading="loading"
                    :data="userlist"
                    row-key="userId"
                    :default-expand-all="isExpandAll"
                    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                    >
                    <el-table-column
                        prop="userId"
                        label="用户ID"
                        width="100"
                    ></el-table-column>
                    <el-table-column
                        prop="roleId"
                        label="所属角色"
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
                    </el-table-column>
                    </el-table>
            </el-tab-pane>
            <el-tab-pane label="项目列表" name="project">
                <el-table
                    v-loading="loading"
                    :data="projectlist"
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
                        prop="leaderId"
                        label="负责人"
                        :show-overflow-tooltip="true"
                        width="160"
                    ></el-table-column>
                    <el-table-column
                        prop="phone"
                        label="电话"
                        :show-overflow-tooltip="true"
                        width="140"
                    ></el-table-column>
                    <el-table-column prop="status" label="状态" width="80" align="center">
                    </el-table-column>
                    <el-table-column label="创建时间" align="center" prop="createTime">
                        <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                        </template>
                    </el-table-column>
                    </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
  
  <script>
import { getListByTeamId } from "@/api/system/project";
import { getTeam } from "@/api/system/team";
import { getUser } from "@/api/system/user";
import { getTeamMate } from "@/api/system/userteam";

export default {
  name: "ProjectInfo",
  data() {
    return {
      projectlist: [],
      user: {},
      team: {},
      userlist: [],
      activeTab: "member",
    };
  },

  created() {
    const teamId = this.$route.params && this.$route.params.teamId;
    if (teamId) {
      getTeam(teamId).then((response) => {
        this.team = response.data.team;
        getUser(this.team.leaderId).then((response) => {
          this.user = response.data.user;
        });
        getListByTeamId(teamId).then((response)=>{
            this.projectlist = response.data.projects;
        })
        getTeamMate(teamId).then((response)=>{
            this.userlist = response.data.userteams;
        })
      });
    }
  },
  methods: {
    /** 进入操作 */
    handleEnter: function (row) {
      const projectId = row.projectId;
      this.$router.push("/system/require/" + projectId);
    },
    /**返回 */
    goTarget() {
      this.$router.push("/system/team");
    },
  },
};
</script>
  <style scoped>
.scrollbar-flex-content {
  display: flex;
  /* 将横向滚动条隐藏 */
  overflow-x: auto;
}

.scrollbar-demo {
  display: flex;
}

.scrollbar-demo-username {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 80px;
  margin: 10px 3px 10px 3px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 80px;
  margin: 10px 3px 10px 3px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
  background-color: antiquewhite;
  color: var(--el-color-danger);
}

.scrollbar-demo-item-q {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 80px;
  margin-top: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.scrollbar-flex-content::-webkit-scrollbar {
  display: none;
}

.finished {
  background-color: rgb(22, 219, 111);
}
</style>