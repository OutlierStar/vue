import request from "@/utils/request";

// 邀请成员
export function Invate(teamId, data) {
  return request({
    url: "/system/userteam/?teamId=" + teamId,
    method: "post",
    data: data,
  });
}
