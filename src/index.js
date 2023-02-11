const CONFIG = require('../config.json')
const login = require('./login')
const report = require('./report')
const { getYear, getLongMonth, getDay, getFullDate } = require('./utils/date')

require('dotenv').config();

(async () => {
  const token = await login()

  const data = await report(token)

  const rows = data.map(item => ({
    'Cliente - Nome': item['customer.name'] ?? '',
    'Empresa - Data de Criação.Ano': getYear(item?.['company.created']?.slice(0, 10), '-'),
    'Empresa - Data de Criação.Dia': getLongMonth(item?.['company.created']?.slice(0, 10)),
    'Empresa - Data de Criação.Mês': getDay(item?.['company.created']?.slice(0, 10)),
    'Tarefa - Data da entrega dos documentos solicitados.Ano': '',
    'Tarefa - Data da entrega dos documentos solicitados.Dia': '',
    'Tarefa - Data da entrega dos documentos solicitados.Mês': '',
    'Tarefa - Data de conclusão.Ano': getYear(item?.conclusion_date?.slice(0, 10)),
    'Tarefa - Data de conclusão.Dia': getDay(item?.conclusion_date?.slice(0, 10)),
    'Tarefa - Data de conclusão.Mês': getLongMonth(item?.conclusion_date?.slice(0, 10)),
    'Tarefa - Data de Criação.Ano': getYear(item?.created_at?.slice(0, 10)),
    'Tarefa - Data de Criação.Dia': getDay(item?.created_at?.slice(0, 10)),
    'Tarefa - Data de Criação.Mês': getLongMonth(item?.created_at?.slice(0, 10)),
    'Tarefa - Data de Vencimento.Ano': getYear(item?.conclusion_date?.slice(0, 10)),
    'Tarefa - Data de Vencimento.Dia': getDay(item?.conclusion_date?.slice(0, 10)),
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
    'Tarefa - Data da entrega dos documentos solicitados (completa)': '',
    'Tarefa - Data de conclusão (completa)': getFullDate(item?.conclusion_date),
    'Tarefa - Data de Vencimento (completa)': getFullDate(item?.conclusion_date),
    'Tarefa - Desconsiderada para sempre?': '',
    'Tarefa - Gera Multa?': item?.fine ? 'Sim' : 'Não',
    'Tarefa - Horário da entrega dos documentos solicitados': '',
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
    'Cliente - Dia da Mensalidade': '',
    'Cliente - Valor da Mensalidade': '',
    'Tarefa - Pontuação': item?.['company_task.score'] ?? '',
    'Tarefa - Semana do Vencimento': item?.due_iso_week ?? '',
    'Tarefa - Valor': item?.value ?? ''
  }))
})()
