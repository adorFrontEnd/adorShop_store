
import baseHttpProvider from '../base/baseHttpProvider';
const searchSettlementAuditList = (params) => {
  return baseHttpProvider.postFormApi('api/settlementAudit/searchSettlementAuditList', { page: 1, size: 10, ...params },
    {
      total: true
    })
}

const examinationPassed = (params) => {
  return baseHttpProvider.getApi('api/settlementAudit/examinationPassed', params)
}

const adjustmentAmount = (params) => {
  return baseHttpProvider.getApi('api/settlementAudit/adjustmentAmount', params)
}


const searchSettlementAudit = (params) => {
  return baseHttpProvider.postFormApi('api/settlementAudit/searchSettlementAudit', { page: 1, size: 10, ...params },
    {
      total: true
    })
}
const exportSettlementAudit = (params) => {
  params = baseHttpProvider.filterAllNullKeyInParams(params)
  let result = baseHttpProvider.getReqObj('api/settlementAudit/export', params)
  if (result.url) {
    window.open(result.url, '_blank');
  }
}

export {
  searchSettlementAuditList,
  examinationPassed,
  adjustmentAmount,
  searchSettlementAudit,
  exportSettlementAudit
}