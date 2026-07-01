/**
 * dashboardData_complete.ts — البيانات الكاملة مع النماذج والأدوات
 * ═══════════════════════════════════════════════════════════
 */

import { DASHBOARD_DATA } from './dashboardData';

// إضافة النماذج والأدوات الموصى بها لكل داشبورد
export const COMPLETE_DASHBOARD_DATA = {
  ...DASHBOARD_DATA,
  
  // تحديث كل داشبورد بالنماذج والأدوات
  contracting: {
    ...DASHBOARD_DATA.contracting,
    recommendedDocuments: [
      'contract_construction',
      'quotation',
      'invoice',
      'project_proposal',
      'progress_report',
      'completion_certificate',
      'work_order',
      'purchase_order'
    ],
    recommendedTools: [
      'project_management',
      'cost_calculator',
      'basic_analytics',
      'weyaak_chat',
      'team_chat',
      'file_sharing'
    ]
  },

  interior: {
    ...DASHBOARD_DATA.interior,
    recommendedDocuments: [
      'contract_service',
      'quotation',
      'invoice',
      'project_proposal',
      'company_profile',
      'brochure',
      'presentation'
    ],
    recommendedTools: [
      'project_management',
      'design_generator',
      'weyaak_chat',
      'basic_analytics',
      'team_chat',
      'file_sharing'
    ]
  },

  healthcare: {
    ...DASHBOARD_DATA.healthcare,
    recommendedDocuments: [
      'invoice',
      'receipt',
      'quotation',
      'contract_service',
      'work_order',
      'inspection_report'
    ],
    recommendedTools: [
      'project_management',
      'basic_analytics',
      'weyaak_chat',
      'team_chat',
      'auto_reminders'
    ]
  },

  legal: {
    ...DASHBOARD_DATA.legal,
    recommendedDocuments: [
      'contract_standard',
      'contract_service',
      'nda',
      'contract_partnership',
      'contract_employment',
      'legal_notice',
      'invoice',
      'quotation',
      'case_study'
    ],
    recommendedTools: [
      'project_management',
      'crm',
      'basic_analytics',
      'weyaak_chat',
      'team_chat',
      'file_sharing'
    ]
  },

  education: {
    ...DASHBOARD_DATA.education,
    recommendedDocuments: [
      'invoice',
      'receipt',
      'quotation',
      'contract_service',
      'completion_certificate',
      'company_profile',
      'brochure'
    ],
    recommendedTools: [
      'project_management',
      'crm',
      'basic_analytics',
      'weyaak_chat',
      'team_chat',
      'auto_reminders'
    ]
  },

  retail: {
    ...DASHBOARD_DATA.retail,
    recommendedDocuments: [
      'invoice',
      'receipt',
      'quotation',
      'delivery_note',
      'purchase_order',
      'proforma'
    ],
    recommendedTools: [
      'inventory_management',
      'basic_analytics',
      'weyaak_chat',
      'smart_search',
      'team_chat',
      'auto_reminders'
    ]
  },

  hr: {
    ...DASHBOARD_DATA.hr,
    recommendedDocuments: [
      'contract_employment',
      'invoice',
      'receipt',
      'work_order',
      'expense_report',
      'completion_certificate'
    ],
    recommendedTools: [
      'hr_management',
      'project_management',
      'basic_analytics',
      'weyaak_chat',
      'team_chat',
      'auto_reminders'
    ]
  },

  marketing: {
    ...DASHBOARD_DATA.marketing,
    recommendedDocuments: [
      'quotation',
      'invoice',
      'project_proposal',
      'company_profile',
      'brochure',
      'case_study',
      'presentation'
    ],
    recommendedTools: [
      'design_generator',
      'advanced_analytics',
      'weyaak_chat',
      'smart_search',
      'team_chat',
      'file_sharing'
    ]
  },

  events: {
    ...DASHBOARD_DATA.events,
    recommendedDocuments: [
      'quotation',
      'invoice',
      'receipt',
      'contract_service',
      'project_proposal',
      'work_order',
      'completion_certificate'
    ],
    recommendedTools: [
      'project_management',
      'crm',
      'basic_analytics',
      'weyaak_chat',
      'team_chat',
      'auto_reminders'
    ]
  },

  finance: {
    ...DASHBOARD_DATA.finance,
    recommendedDocuments: [
      'invoice',
      'receipt',
      'quotation',
      'proforma',
      'purchase_order',
      'expense_report',
      'financial_statement',
      'budget_plan'
    ],
    recommendedTools: [
      'financial_analytics',
      'advanced_analytics',
      'custom_reports',
      'weyaak_chat',
      'auto_invoicing',
      'workflow_automation'
    ]
  }
};

export default COMPLETE_DASHBOARD_DATA;
