import request from '@/utils/request'

export function getProcessDiagramByApplyId(data) {
  return request({
    url: '/bpm/processDiagram/getProcessDiagramByApplyId/' + data,
    method: 'post'
  })
}

