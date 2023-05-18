import request from '@/utils/request'

// 查询项目列表
export function listProject(query) {
  return request({
    url: '/system/project/list',
    method: 'get',
    params: query
  })
}

// 查询项目详细
export function getProject(projectId) {
  return request({
    url: '/system/project/?projectId=' + projectId,
    method: 'get'
  })
}

// 查询项目下拉树结构
export function treeselect() {
  return request({
    url: '/system/project/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询项目下拉树结构
export function roleProjectTreeselect(roleId) {
  return request({
    url: '/system/project/roleProjectTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增项目
export function addProject(data) {
  return request({
    url: '/system/project',
    method: 'post',
    data: data
  })
}

// 修改项目
export function updateProject(data) {
  return request({
    url: '/system/project',
    method: 'put',
    data: data
  })
}

// 删除项目
export function delProject(projectId) {
  return request({
    url: '/system/project/' + projectId,
    method: 'delete'
  })
}