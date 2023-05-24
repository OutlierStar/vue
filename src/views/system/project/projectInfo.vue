<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>项目信息</span>
          </div>
          <div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />项目名称
                <div class="pull-right">{{ project.projectName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">{{ project.phone }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">{{ project.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree" />所属团队
                <div class="pull-right" v-if="project.teamId">
                  {{ team.teamName }}
                </div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />负责人
                <div class="pull-right">{{ user.nickName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ project.createTime }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />结束时间
                <div class="pull-right">{{ project.overTime }}</div>
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
                  <el-button
                    size="mini"
                    icon="el-icon-s-home"
                    @click="handleEnter(project)"
                    style="margin-left: 30px"
                    >管理需求</el-button
                  >
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="进度" name="info">
              <!-- 展示任务进度 -->
              <el-row>
                <el-col :span="3" :xs="24"><span>总任务进度</span></el-col>
                <el-col :span="8" :xs="24"
                  ><el-progress
                    :text-inside="true"
                    :stroke-width="18"
                    :percentage="50"
                    color="rgb(22, 219, 111)"
                  ></el-progress
                ></el-col>
                <el-col :span="2" :xs="24"><span>5/10</span></el-col>
              </el-row>
              
              <el-row>
                <el-col :span="3" :xs="24"><span>本周任务进度</span></el-col>
                <el-col :span="8" :xs="24"
                  ><el-progress
                    :text-inside="true"
                    :stroke-width="18"
                    :percentage="60"
                  ></el-progress
                ></el-col>
                <el-col :span="2" :xs="24"><span>3/5</span></el-col>
              </el-row>

              <!-- 展示任务 -->
              <el-row  v-for="i in usersList" :key="i.userId" v-show="showProjectTask">
                <el-col :span="2" :xs="24">
                  <p class="scrollbar-demo-username">
                    <span>{{ i.user.nickName }}</span>
                  </p>
                </el-col>
                <el-col :span="22" :xs="24">
                  <el-card class="box-card">
                    <el-scrollbar>
                      <div class="scrollbar-flex-content">
                        <div
                          v-for="(item, idx) in i.tasks"
                          :key="idx"
                          class="scrollbar-demo"
                        >
                          <p 
                          :class="item.status == '2'? 'scrollbar-demo-item finished' : 'scrollbar-demo-item'"
                          >
                            {{ item.taskName }}
                          </p>
                          <p class="scrollbar-demo-item-q">
                            {{ idx === i.tasks.length - 1 ? " " : "&gt;" }}
                          </p>
                        </div>
                      </div>
                    </el-scrollbar>
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>

            <el-tab-pane label="简介" name="content">
              <p>
                <span>{{ project.projectContent }}</span>
              </p>
            </el-tab-pane>
            <el-tab-pane label="其他" name="other"> </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getProject } from "@/api/system/project";
import { getTeam } from "@/api/system/team";
import { getUser } from "@/api/system/user";
import { listTaskByProjectIdGroupByUserOrderByOverTime } from "@/api/system/task";

export default {
  name: "ProjectInfo",
  data() {
    return {
      project: {},
      user: {},
      team: {},
      // 显示项目任务进度
      showProjectTask: false,
      activeTab: "info",
      usersList: [
        {
          user: {
            userId: 1,
            userName: "",
            nickName: "",
            userType: "00",
            email: "",
            phonenumber: "",
            sex: "",
            avatar: "",
            password: "0",
            status: "0",
            delFlag: "0",
            loginIp: "",
            loginDate: null,
            createId: null,
            createTime: null,
            updateId: null,
            updateTime: null,
            remark: "",
          },
          tasks: [
            {
              taskId: 0,
              taskName: "",
              taskContent: "",
              projectId: 0,
              requireId: 0,
              leaderId: 0,
              phone: "",
              email: "",
              status: "0",
              createId: 0,
              createTime: "",
              updateId: 0,
              updateTime: "",
              overTime: "",
            }
          ],
        },
      ],
    };
  },

  created() {
    const projectId = this.$route.params && this.$route.params.projectId;
    if (projectId) {
      getProject(projectId).then((response) => {
        this.project = response.data.project;
        getUser(this.project.leaderId).then((response) => {
          this.user = response.data.user;
        });
        getTeam(this.project.teamId).then((response) => {
          this.team = response.data.team;
        });
        listTaskByProjectIdGroupByUserOrderByOverTime(this.project.projectId).then((response) => {
          this.usersList = response.data.users;
          this.showProjectTask = true;
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
    goTarget() {
      this.$router.push("/system/iterate");
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
  width: 80px;
  height: 80px;
  margin: 10px 30px 10px 0px;
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