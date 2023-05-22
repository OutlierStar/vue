import request from '@/utils/request'

// 根据项目ID查询需求列表
export function listRequireById(projectId) {
    return request({
      url: '/system/require/list/'+projectId,
      method: 'get',
    })
  }

  // 查询需求详细
export function getRequire(requireId) {
    return request({
      url: '/system/require/' + requireId,
      method: 'get'
    })
  }
  
  // 新增需求
  export function addRequire(data) {
    return request({
      url: '/system/require',
      method: 'post',
      data: data
    })
  }
  
  // 修改需求
  export function updateRequire(data) {
    return request({
      url: '/system/require',
      method: 'put',
      data: data
    })
  }
  
  
  // 需求状态修改
  export function changeRequireStatus(requireId, status) {
    const data = {
      requireId,
      status
    }
    return request({
      url: '/system/require/changeStatus',
      method: 'put',
      data: data
    })
  }
  
  // 删除需求
  export function delRequire(requireId) {
    return request({
      url: '/system/require/' + requireId,
      method: 'delete'
    })
  }