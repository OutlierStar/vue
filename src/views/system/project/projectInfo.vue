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
                <div class="pull-right" v-if="project.teamId">{{ team.teamName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />负责人
                <div class="pull-right">{{ user.nickName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ project.createTime }}</div>
              </li>
              <li>
                <div style="margin-top:20px;">
                  <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-cloudy"
                  @click="goTarget()"
                  style="margin-left:20px"
                  >返回</el-button
                >
                <el-button
                  size="mini"
                  icon="el-icon-s-home"
                  @click="handleEnter(project)"
                  style="margin-left:30px"
                  >管理需求</el-button
                >
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="简介" name="projectinfo">
              <p><span>{{ project.projectContent }}</span></p>
            </el-tab-pane>
            
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

export default {
  name: "ProjectInfo",
  data() {
    return {
      project: {},
      user: {},
      team: {},
      activeTab: "projectinfo"
    };
  },
  
  created() {
    const projectId = this.$route.params && this.$route.params.projectId;
    if(projectId){
      getProject(projectId).then((response) => {
        this.project = response.data.project;
        getUser(this.project.leaderId).then((response) => {
        this.user = response.data.user;
        });
        getTeam(this.project.teamId).then((response) => {
          this.team = response.data.team;
        });
      });
    }
  },
  methods:{
    /** 进入操作 */
    handleEnter: function(row) {
        const projectId = row.projectId;
        this.$router.push("/system/project");
        },
    goTarget() {
       this.$router.push("/system/iterate");
      },
  },
};
</script>
