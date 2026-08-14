export const SITE_ORIGIN = 'https://tellynai.com'
export const SEO_LANGUAGES = ['zh', 'en', 'ar']

const pages = {
  home: {
    path: '',
    title: {
      zh: 'TellWin AI｜企业销售 AI 与客户对话智能落地',
      en: 'TellWin AI | Enterprise Sales AI & Conversation Intelligence',
      ar: 'TellWin AI | ذكاء محادثات المبيعات للمؤسسات',
    },
    description: {
      zh: 'TellWin AI 帮助高客单、长决策链企业，把销售对话转化为客户情报，并通过 AI 业务诊断、企业内训与 FDE 共创真正落地。',
      en: 'TellWin AI helps high-value sales teams turn customer conversations into actionable intelligence through enterprise AI diagnosis, training and FDE delivery.',
      ar: 'تساعد TellWin AI فرق المبيعات عالية القيمة على تحويل محادثات العملاء إلى معلومات قابلة للتنفيذ عبر التشخيص والتدريب والتنفيذ المشترك.',
    },
  },
  tellwin: {
    path: 'tellwin',
    title: {
      zh: 'TellWin｜销售对话分析与企业客户情报 AI',
      en: 'TellWin | AI Sales Copilot & Conversation Intelligence',
      ar: 'TellWin | مساعد مبيعات ذكي وتحليل محادثات العملاء',
    },
    description: {
      zh: 'TellWin 将线下销售与企业微信客户对话整理为结构化档案、跟进建议、产品反馈与经营洞察，适用于汽车、珠宝、房产和医疗等高客单行业。',
      en: 'TellWin turns in-person and private-channel sales conversations into customer records, follow-up actions and business intelligence for high-value sales teams.',
      ar: 'تحوّل TellWin محادثات المبيعات الميدانية والرقمية إلى ملفات عملاء وإجراءات متابعة ورؤى أعمال لفرق المبيعات عالية القيمة.',
    },
  },
  fde: {
    path: 'fde',
    title: {
      zh: 'FDE 共创落地｜把企业 AI 做进真实业务流程',
      en: 'FDE Delivery | Put Enterprise AI Into Real Workflows',
      ar: 'تنفيذ FDE | إدخال الذكاء الاصطناعي في سير العمل الفعلي',
    },
    description: {
      zh: '从业务访谈、场景优先级到真实数据试点和上线陪跑，TellWin AI 通过 FDE 共创帮助企业把 AI 做成真正有人使用的业务能力。',
      en: 'From workflow diagnosis and prioritization to real-data pilots and adoption, TellWin AI co-builds enterprise AI that teams actually use.',
      ar: 'من تشخيص سير العمل وتحديد الأولويات إلى التجارب بالبيانات الفعلية، تبني TellWin AI حلولاً تستخدمها الفرق فعلياً.',
    },
  },
  training: {
    path: 'training',
    title: {
      zh: '企业 AI 内训｜管理层工作坊与业务场景实战',
      en: 'Enterprise AI Training | Leadership Workshops & Use Cases',
      ar: 'تدريب الذكاء الاصطناعي للمؤسسات | ورش القيادة والتطبيق',
    },
    description: {
      zh: '面向管理层与业务骨干的企业 AI 内训，从真实工作流出发，形成 AI 场景地图、试点方案与首批内部推动者。',
      en: 'Practical enterprise AI training for leaders and business teams, producing a prioritized use-case map, pilot plans and internal AI champions.',
      ar: 'تدريب عملي لقادة المؤسسات وفرق الأعمال ينتج خريطة حالات استخدام وخطط تجريبية وقادة داخليين للذكاء الاصطناعي.',
    },
  },
  qixiao: {
    path: 'qixiao',
    title: {
      zh: '启晓｜企业 AI 舆情研判与公关工作系统',
      en: 'Qixiao | Enterprise AI PR Intelligence System',
      ar: 'Qixiao | نظام ذكاء العلاقات العامة للمؤسسات',
    },
    description: {
      zh: '启晓连接全网发现、语义理解、事件研判、行动建议与复盘沉淀，帮助企业公关团队更早形成有证据、可执行的风险判断。',
      en: 'Qixiao connects discovery, semantic understanding, risk assessment, action guidance and review for evidence-led enterprise PR decisions.',
      ar: 'تربط Qixiao الاكتشاف والفهم الدلالي وتقييم المخاطر وإرشاد الاستجابة والمراجعة لقرارات علاقات عامة مدعومة بالأدلة.',
    },
  },
  salesIntelligence: {
    path: 'solutions/sales-conversation-intelligence',
    title: {
      zh: '销售对话分析｜AI 销售助手与客户声音洞察',
      en: 'Sales Conversation Intelligence | AI Sales Copilot',
      ar: 'ذكاء محادثات المبيعات | مساعد مبيعات بالذكاء الاصطناعي',
    },
    description: {
      zh: 'TellWin 将面对面沟通、企业微信等渠道的销售对话整理为客户档案、购买信号、异议、跟进建议和跨团队客户声音洞察。',
      en: 'Turn sales conversations into customer records, buying signals, follow-up actions, coaching evidence and cross-team customer intelligence with TellWin.',
      ar: 'حوّل محادثات المبيعات إلى ملفات عملاء وإشارات شراء وإجراءات متابعة وأدلة تدريب ومعلومات مشتركة مع TellWin.',
    },
  },
  realEstate: {
    path: 'industries/real-estate-sales-ai',
    title: {
      zh: '房地产销售 AI｜客户对话分析与跟进助手',
      en: 'AI Sales Copilot for Dubai Real Estate | TellWin',
      ar: 'مساعد مبيعات ذكي لعقارات دبي | TellWin',
    },
    description: {
      zh: '面向迪拜及高价值房地产销售团队的 AI 销售助手，整理客户预算、区域偏好、户型需求、购买动机、异议和下一步。',
      en: 'AI sales copilot for Dubai real estate teams that structures buyer budget, location preferences, property needs, motivation, objections and next actions.',
      ar: 'مساعد مبيعات ذكي لفرق عقارات دبي ينظم ميزانية المشتري والمناطق المفضلة ومتطلبات العقار والدوافع والاعتراضات والخطوات التالية.',
    },
  },
}

export const SEO_PAGES = Object.entries(pages).map(([key, value]) => ({ key, ...value }))

export function seoPath(language, page) {
  return `/${language}/${page.path ? `${page.path}/` : ''}`
}

export function seoForRoute(language, pageKey) {
  const page = SEO_PAGES.find((item) => item.key === pageKey) || SEO_PAGES[0]
  const pathname = seoPath(language, page)
  return {
    ...page,
    language,
    pathname,
    canonical: `${SITE_ORIGIN}${pathname}`,
    localizedTitle: page.title[language],
    localizedDescription: page.description[language],
  }
}
