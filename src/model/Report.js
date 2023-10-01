const request = require('../utils/request')
const CONFIG = require('../../config.json')
const { getYear, getLongMonth, getDay, getFullDate, getFullHours } = require('../utils/date')

/**
 * @param {string} token
 * @returns {array}
 */
module.exports = {
  report: async function (token) {
    const url = new URL('/core/customer/task/report', CONFIG.API_URL_GESTTA)

    if (!url?.href) {
      return false
    }

    const date = new Date()

    const startDate = new Date(date.getFullYear(), (date.getMonth()), 1).toJSON().slice(0, 10) + 'T00:00:00-03:00'
    const endDate = new Date(date.getFullYear(), (date.getMonth() + 1), 0).toJSON().slice(0, 10) + 'T23:59:59-03:00'

    const data = {
      type: 'CUSTOMER_TASK',
      filter: 'CURRENT_MONTH',
      dates: {
        endDate,
        startDate
      }
    }

    const headers = {
      authorization: token
    }

    const response = await request('POST', url.href, data, headers)

    if (response.status !== 200 && response.status !== 204) {
      return false
    }

    return response.data
  },

  handlerData: function (data) {
    return data.map(item => ({
      'Cliente - Nome': item['customer.name'] ?? '',
      'Empresa - Data de Criação.Ano': getYear(item?.['company.created']),
      'Empresa - Data de Criação.Dia': getLongMonth(item?.['company.created']),
      'Empresa - Data de Criação.Mês': getDay(item?.['company.created']),
      'Tarefa - Data da entrega dos documentos solicitados.Ano': getYear(item?.['document_request.requested_documents_upload_date']),
      'Tarefa - Data da entrega dos documentos solicitados.Dia': getDay(item?.['document_request.requested_documents_upload_date']),
      'Tarefa - Data da entrega dos documentos solicitados.Mês': getLongMonth(item?.['document_request.requested_documents_upload_date']),
      'Tarefa - Data de conclusão.Ano': getYear(item?.conclusion_date),
      'Tarefa - Data de conclusão.Dia': getDay(item?.conclusion_date),
      'Tarefa - Data de conclusão.Mês': getLongMonth(item?.conclusion_date),
      'Tarefa - Data de Criação.Ano': getYear(item?.created_at),
      'Tarefa - Data de Criação.Dia': getDay(item?.created_at),
      'Tarefa - Data de Criação.Mês': getLongMonth(item?.created_at),
      'Tarefa - Data de Vencimento.Ano': getYear(item?.conclusion_date),
      'Tarefa - Data de Vencimento.Dia': getDay(item?.conclusion_date),
      'Cliente - Ativo?': item?.['customer.active'] ? 'Sim' : 'Não',
      'Cliente - CNPJ': item?.['customer.cnpj'] ?? '',
      'Cliente - Código': item?.['customer.code'] ?? '',
      'Cliente - Regime estadual': item?.['customer.state_regime.name'] ?? '',
      'Cliente - Regime federal': item?.['customer.federal_regime.name'] ?? '',
      'Cliente - Regime municipal': item?.['customer.municipal_regime.name'] ?? '',
      'Empresa - Nome': item?.['company.name'] ?? '',
      'Empresa - Status': CONFIG.STATUS_EMPRESA[item?.['company.status']] ?? '',
      'Responsável - Papel': item?.['owner.role'] ?? '',
      'Tarefa - Atrasada?': item?.overdue ? 'Sim' : 'Não',
      'Tarefa - Baixada?': item?.downloaded ? 'Sim' : 'Não',
      'Tarefa - Concluída com Multa': item?.done_fine ? 'Sim' : 'Não',
      'Tarefa - Concluída em Atraso': item?.done_overdue ? 'Sim' : 'Não',
      'Tarefa - Concluído por': item?.['concluded_by.name'] ?? '',
      'Tarefa - Concluído por (Papel)': item?.['owner.role'] ?? '',
      'Tarefa - Data da entrega dos documentos solicitados (completa)': getFullDate(item?.['document_request.requested_documents_upload_date']),
      'Tarefa - Data de conclusão (completa)': getFullDate(item?.conclusion_date),
      'Tarefa - Data de Vencimento (completa)': getFullDate(item?.conclusion_date),
      'Tarefa - Desconsiderada para sempre?': item?._forever ? 'Sim' : 'Não',
      'Tarefa - Gera Multa?': item?.fine ? 'Sim' : 'Não',
      'Tarefa - Horário da entrega dos documentos solicitados': getFullHours(item?.['document_request.requested_documents_upload_date']),
      'Tarefa - ID': item?.id ?? '',
      'Tarefa - No prazo?': item?.on_time ? 'Sim' : 'Não',
      'Tarefa - Nome': item?.name ?? '',
      'Tarefa - Notifica Cliente?': item?.notify_customer ? 'Sim' : 'Não',
      'Tarefa - Responsável': item?.['owner.name'] ?? '',
      'Tarefa - Subtipo': CONFIG.SUBTYPE[item?.subtype] ?? '',
      'Tarefa - Tipo': CONFIG.TYPE[item?.type] ?? '',
      'Tarefa - Data de Vencimento.Mês': getLongMonth(item?.conclusion_date),
      'Empresa - Departamento': item?.['company_department.name'] ?? '',
      'Tarefa - Status': CONFIG.STATUS[item?.status] ?? '',
      'Cliente - Dia da Mensalidade': item?.['customer.monthly_day_payment'] ?? '',
      'Cliente - Valor da Mensalidade': item?.['customer.monthly_payment'] ?? '',
      'Tarefa - Pontuação': item?.['company_task.score'] ?? '',
      'Tarefa - Semana do Vencimento': item?.due_iso_week ?? '',
      'Tarefa - Valor': item?.value ?? ''
    }))
  }
}
