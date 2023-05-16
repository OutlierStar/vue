import request from '@/utils/request'

// 查询菜单列表
export function listProject(query) {
  return request({
    url: '/system/project/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getProject(projectId) {
  return request({
    url: '/system/project/' + projectId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/project/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleProjectTreeselect(roleId) {
  return request({
    url: '/system/project/roleProjectTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addProject(data) {
  return request({
    url: '/system/project',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateProject(data) {
  return request({
    url: '/system/project',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delProject(projectId) {
  return request({
    url: '/system/project/' + projectId,
    method: 'delete'
  })
}