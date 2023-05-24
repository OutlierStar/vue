import request from '@/utils/request'

// 根据项目ID查询任务列表
export function listTaskById(requireId) {
  return request({
    url: '/system/task/list/' + requireId,
    method: 'get',
  })
}

// 查询任务详细
export function getTask(taskId) {
  return request({
    url: '/system/task/' + taskId,
    method: 'get'
  })
}

// 新增任务
export function addTask(data) {
  return request({
    url: '/system/task',
    method: 'post',
    data: data
  })
}

// 修改任务
export function updateTask(data) {
  return request({
    url: '/system/task',
    method: 'put',
    data: data
  })
}


// 任务状态修改
export function changeTaskStatus(taskId, status) {
  const data = {
    taskId,
    status
  }
  return request({
    url: '/system/task/changeStatus',
    method: 'put',
    data: data
  })
}

// 删除任务
export function delTask(taskId) {
  return request({
    url: '/system/task/' + taskId,
    method: 'delete'
  })
}

// 根据projectId查询任务list
export function listTaskByProjectId(projectId) {
  return request({
    url: '/system/task?projectId=' + projectId,
    method: 'get'
  })
}

// 根据项目id以用户id为分组按任务结束时间为序返回任务
export function listTaskByProjectIdGroupByUserOrderByOverTime(projectId) {
  return request({
    url: '/system/taskbyprojectidgroupbyuser?projectId=' + projectId,
    method: 'get'
  })
}