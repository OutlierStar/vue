import request from '@/utils/request'

// 查询团队列表
export function listDept(query) {
  return request({
    url: '/system/team/list',
    method: 'get',
    params: query
  })
}

// 查询团队列表（排除节点）
export function listDeptExcludeChild(teamId) {
  return request({
    url: '/system/team/list/exclude/' + teamId,
    method: 'get'
  })
}

// 查询团队详细
export function getDept(teamId) {
  return request({
    url: '/system/team/' + teamId,
    method: 'get'
  })
}

// 新增团队
export function addDept(data) {
  return request({
    url: '/system/team',
    method: 'post',
    data: data
  })
}

// 修改团队
export function updateDept(data) {
  return request({
    url: '/system/team',
    method: 'put',
    data: data
  })
}

// 删除团队
export function delDept(teamId) {
  return request({
    url: '/system/team/' + teamId,
    method: 'delete'
  })
}