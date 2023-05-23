import request from '@/utils/request'

// 查询公告列表
export function listMessage(query) {
  return request({
    url: '/system/message/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getMessage(messageId) {
  return request({
    url: '/system/message/get?messageId=' + messageId,
    method: 'get'
  })
}

// 新增公告
export function addMessage(data) {
  return request({
    url: '/system/message/add',
    method: 'put',
    data: data
  })
}

// 阅读公告
export function readMessage(messageId) {
  return request({
    url: '/system/message/read?messageId=' + messageId,
    method: 'post',
  })
}

// 删除公告
export function delMessage(messageId) {
  return request({
    url: '/system/message/delete?messageId=' + messageId,
    method: 'delete'
  })
}

// 批量删除公告
export function delMessageList(data) {
  return request({
    url: '/system/message/deletelist',
    method: 'delete',
    data: data
  })
}