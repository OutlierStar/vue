import request from '@/utils/request'

// 查询团队列表
export function listTeam(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询团队列表（排除节点）
export function listTeamExcludeChild(deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询团队详细
export function getTeam(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}

// 新增团队
export function addTeam(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

// 修改团队
export function updateTeam(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

// 删除团队
export function delTeam(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}