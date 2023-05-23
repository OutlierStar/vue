import request from '@/utils/request'

// 获取用户list by projectId
export function listUserByProjectId(projectId) {
    return request({
      url: '/system/userproject/list/?projectId='+projectId,
      method: 'get'
    })
  }