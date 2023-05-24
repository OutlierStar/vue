import request from "@/utils/request";

// 邀请成员
export function Invate(teamId, data) {
  return request({
    url: "/system/userteam/?teamId=" + teamId,
    method: "post",
    data: data,
  });
}

//获取团队成员
export function getTeamMate(teamId) {
  return request({
    url: "/system/userteam/" + teamId,
    method: "get",
  });
}
