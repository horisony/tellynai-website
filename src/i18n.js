import { cloneElement, isValidElement, useEffect, useLayoutEffect, useState } from 'react'
import generated from './translations.generated.json' with { type: 'json' }
import { launchCopy } from './launch-content.js'
import { qixiaoCopy } from './qixiao-content.js'

export const languageOptions = [
  ['zh', '中', '中文'], ['en', 'EN', 'English'], ['ar', 'ع', 'العربية'],
]

const en = {
  '品牌说明：部分用户会搜索“Tellyn AI”；官方英文品牌拼写为 TellWin AI，官网为 tellynai.com。':'Brand note: some people search for “Tellyn AI”; the official English brand spelling is TellWin AI, and the official website is tellynai.com.',
  '出现这些信号，':'When these signals appear,','就值得启动':'it’s time to start','四个阶段，':'Four stages,','每一步都有':'each with','明确产出':'clear deliverables','项目结束时，':'At the end of the project,','留下的不只是':'you keep more than','一个 Demo':'a demo','合作之前，':'Before we work together,','把边界说清楚':'let’s make the boundaries clear','不同角色，':'Different roles','学习':'learn','不同的事':'different things','三种方式，':'Three formats','匹配团队的':'matched to your team’s','真实阶段':'actual stage','课件会过期，':'Courseware expires;','企业能力要':'enterprise capability should','留下来':'remain','安排课程前，':'Before scheduling training,',
  '出现这些信号，':'When these signals appear,','就值得启动 FDE。':'it’s time to start FDE.','四个阶段，':'Four stages,','每一步都有 明确产出。':'each with clear deliverables.','项目结束时，':'At the end of the project,','留下的不只是 一个 Demo。':'you keep more than a demo.','合作之前，':'Before we work together,','把边界说清楚。':'let’s make the boundaries clear.','不同角色，':'Different roles','学习 不同的事。':'learn different things.','三种方式，':'Three formats','匹配团队的 真实阶段。':'for your team’s actual stage.','课件会过期，':'Courseware expires;','企业能力要 留下来。':'enterprise capability should remain.','安排课程前，':'Before scheduling training,',
  '图灵驭界':'Tellyn AI','菜单':'Menu','服务':'Services','FDE 落地':'FDE Delivery','企业内训':'AI Training','案例':'Work','联系我们':'Contact','预约诊断':'Book a consult','让 AI 真正':'Put AI to work','进入你的':'across your','增长链路':'growth engine','预约免费诊断':'Book a free consultation','查看交付案例':'View our work','核心团队来自':'Core team experience','服务客户':'Clients',
  '从内容获客、线索培育到成交转化，我们不是把一套通用工具交给你，而是和管理层、一线团队一起，从业务诊断、企业内训到 FDE 共创，把 AI 做成每天有人用、能持续迭代的增长能力。':'From acquisition and lead nurturing to conversion, we work with leaders and frontline teams to turn AI into a capability people use every day.','从想清楚，':'From clarity','到':'to','真的用起来':'real adoption','按企业当前阶段切入，不用先买一套大系统。':'Start at your current stage—without buying a large system first.','· 服务':'· Service','适合：':'Best for: ','了解这项服务 →':'Explore this service →','你在哪一步，':'Start where','就从':'you are','哪一步开始':'today','没有固定套餐绑架，先把最重要的业务问题说清楚。':'No rigid packages. First, clarify the business problem that matters most.',
  '做过的项目，':'Work proven','经得起':'in the','业务现场':'real world','不展示虚构数字，只讲真实问题、做法和已经发生的改变。':'No invented metrics—only real problems, approaches, and changes.','问题':'Challenge','交付':'Delivery','结果':'Outcome','咨询类似项目 →':'Discuss a similar project →','，把线下现场':' turns field activity','变成可用的业务数据。':'into useful business data.','Tellyn 用 AI 收集销售、产品和市场的一线反馈，整理为可以被管理者理解、被团队执行的业务洞察。':'Tellyn turns frontline sales, product, and market feedback into insights leaders understand and teams can act on.','收集真实反馈':'Capture feedback','AI 数据分析':'AI analysis','辅助业务决策':'Better decisions','了解 Tellyn':'Explore Tellyn',
  '，快速生成':' creates','各类设计海报。':'editable posters in minutes.','上传产品图片，描述想要的内容和风格，SnapDesign 就能快速生成可继续编辑的视觉设计，覆盖电商海报、活动海报等常见场景。':'Upload a product image and describe the content and style. SnapDesign quickly creates editable visuals for commerce, events, and product campaigns.','电商海报':'E-commerce','活动海报':'Events','产品视觉':'Product visuals','快速生成':'Fast generation','打开 SnapDesign ↗':'Open SnapDesign ↗','开始之前，':'Before we begin,','你可能想问':'you may ask',
  '先聊一个':'Let’s start with a','真实问题':'real problem','留下联系方式，我们会在 1 个工作日内回复。第一次沟通免费，先帮你判断什么值得做、什么可以暂时不做。':'Leave your details and we’ll reply within one business day. The first conversation is free.','怎么称呼你？':'Your name','公司 / 行业':'Company / industry','微信 / 手机号':'WeChat / phone','感兴趣的服务':'Service of interest','还不确定':'Not sure yet','企业规模':'Company size','请选择':'Select','期望什么时候启动？':'When would you like to start?','一个月内':'Within a month','3 个月以后':'After 3 months','你想通过 AI 解决什么问题？':'What would you like AI to solve?','预约一次免费诊断':'Book a free consultation','提交中…':'Submitting…',
  '不是交一份方案，':'More than a proposal—','而是一起把 AI':'we build AI into','做进业务':'your operations','我们的原则':'Our principle','从一个真实场景开始，':'Start with one real use case,','让结果先发生。':'and make outcomes happen first.','诊断':'Diagnose','共创':'Co-build','陪跑':'Embed','不只学工具，':'Beyond learning tools—','而是带走':'leave with your','下一步行动':'next action','管理层路径':'Leadership track','业务骨干路径':'Business team track','形式':'Format','规模':'Group size','最终产出：':'Outcome: ','© 2026 图灵驭界 · 企业 AI 落地伙伴':'© 2026 Tellyn AI · Enterprise AI implementation partner','上海市徐汇区漕河泾超级创业者社区':'Caohejing, Xuhui District, Shanghai',
}

const ar = {
  '品牌说明：部分用户会搜索“Tellyn AI”；官方英文品牌拼写为 TellWin AI，官网为 tellynai.com。':'ملاحظة حول العلامة: يبحث بعض المستخدمين عن “Tellyn AI”؛ والتهجئة الإنجليزية الرسمية هي TellWin AI، والموقع الرسمي هو tellynai.com.',
  '出现这些信号，':'عندما تظهر هذه المؤشرات،','就值得启动':'يصبح الوقت مناسباً لبدء','四个阶段，':'أربع مراحل،','每一步都有':'ولكل خطوة','明确产出':'مخرجات واضحة','项目结束时，':'عند انتهاء المشروع،','留下的不只是':'يبقى لديك أكثر من','一个 Demo':'مجرد نموذج تجريبي','合作之前，':'قبل أن نعمل معاً،','把边界说清楚':'لنوضح الحدود','不同角色，':'الأدوار المختلفة','学习':'تتعلم','不同的事':'أشياء مختلفة','三种方式，':'ثلاث صيغ','匹配团队的':'تناسب','真实阶段':'المرحلة الفعلية للفريق','课件会过期，':'تنتهي صلاحية المواد التدريبية؛','企业能力要':'لكن قدرات المؤسسة يجب أن','留下来':'تبقى','安排课程前，':'قبل جدولة التدريب،',
  '出现这些信号，':'عندما تظهر هذه المؤشرات،','就值得启动 FDE。':'يصبح الوقت مناسباً لبدء FDE.','四个阶段，':'أربع مراحل،','每一步都有 明确产出。':'ولكل خطوة مخرجات واضحة.','项目结束时，':'عند انتهاء المشروع،','留下的不只是 一个 Demo。':'يبقى لديك أكثر من مجرد نموذج تجريبي.','合作之前，':'قبل أن نعمل معاً،','把边界说清楚。':'لنوضح الحدود.','不同角色，':'الأدوار المختلفة','学习 不同的事。':'تتعلم أشياء مختلفة.','三种方式，':'ثلاث صيغ','匹配团队的 真实阶段。':'تناسب المرحلة الفعلية لفريقك.','课件会过期，':'تنتهي صلاحية المواد التدريبية؛','企业能力要 留下来。':'لكن قدرات المؤسسة يجب أن تبقى.','安排课程前，':'قبل جدولة التدريب،',
  '图灵驭界':'Tellyn AI','菜单':'القائمة','服务':'الخدمات','FDE 落地':'تنفيذ FDE','企业内训':'تدريب الذكاء الاصطناعي','案例':'أعمالنا','联系我们':'تواصل معنا','预约诊断':'احجز استشارة','让 AI 真正':'اجعل الذكاء الاصطناعي يعمل','进入你的':'في منظومة','增长链路':'نمو أعمالك','预约免费诊断':'احجز استشارة مجانية','查看交付案例':'شاهد أعمالنا','核心团队来自':'خبرات فريقنا','服务客户':'عملاؤنا',
  '从内容获客、线索培育到成交转化，我们不是把一套通用工具交给你，而是和管理层、一线团队一起，从业务诊断、企业内训到 FDE 共创，把 AI 做成每天有人用、能持续迭代的增长能力。':'نعمل مع الإدارة والفرق الميدانية لتحويل الذكاء الاصطناعي إلى قدرة عملية تُستخدم يومياً وتتطور باستمرار.','从想清楚，':'من وضوح الفكرة','到':'إلى','真的用起来':'التطبيق الفعلي','按企业当前阶段切入，不用先买一套大系统。':'ابدأ من المرحلة الحالية لشركتك دون شراء نظام ضخم أولاً.','· 服务':'· خدمة','适合：':'مناسب لـ: ','了解这项服务 →':'اكتشف الخدمة ←','你在哪一步，':'ابدأ من','就从':'مرحلتك','哪一步开始':'الحالية','没有固定套餐绑架，先把最重要的业务问题说清楚。':'لا باقات جامدة؛ نبدأ بتحديد أهم مشكلة في العمل.',
  '做过的项目，':'أعمال مثبتة','经得起':'في','业务现场':'الواقع العملي','不展示虚构数字，只讲真实问题、做法和已经发生的改变。':'لا أرقام مختلقة—فقط مشكلات حقيقية وتغييرات تحققت.','问题':'التحدي','交付':'التنفيذ','结果':'النتيجة','咨询类似项目 →':'ناقش مشروعاً مشابهاً ←','，把线下现场':' يحوّل الواقع الميداني','变成可用的业务数据。':'إلى بيانات أعمال مفيدة.','Tellyn 用 AI 收集销售、产品和市场的一线反馈，整理为可以被管理者理解、被团队执行的业务洞察。':'يحوّل Tellyn ملاحظات المبيعات والمنتج والسوق إلى رؤى تفهمها الإدارة وتنفذها الفرق.','收集真实反馈':'جمع الملاحظات','AI 数据分析':'تحليل بالذكاء الاصطناعي','辅助业务决策':'قرارات أفضل','了解 Tellyn':'اكتشف Tellyn',
  '，快速生成':' ينشئ بسرعة','各类设计海报。':'ملصقات قابلة للتحرير.','上传产品图片，描述想要的内容和风格，SnapDesign 就能快速生成可继续编辑的视觉设计，覆盖电商海报、活动海报等常见场景。':'ارفع صورة المنتج وصف المحتوى والأسلوب، وسيُنشئ SnapDesign تصاميم قابلة للتحرير.','电商海报':'التجارة الإلكترونية','活动海报':'الفعاليات','产品视觉':'صور المنتجات','快速生成':'إنشاء سريع','打开 SnapDesign ↗':'افتح SnapDesign ↗','开始之前，':'قبل أن نبدأ،','你可能想问':'قد ترغب في السؤال',
  '先聊一个':'لنبدأ بمناقشة','真实问题':'مشكلة حقيقية','留下联系方式，我们会在 1 个工作日内回复。第一次沟通免费，先帮你判断什么值得做、什么可以暂时不做。':'اترك بياناتك وسنرد خلال يوم عمل. اللقاء الأول مجاني.','怎么称呼你？':'الاسم','公司 / 行业':'الشركة / القطاع','微信 / 手机号':'WeChat / الهاتف','感兴趣的服务':'الخدمة المطلوبة','还不确定':'غير متأكد','企业规模':'حجم الشركة','请选择':'اختر','期望什么时候启动？':'متى تريد البدء؟','一个月内':'خلال شهر','3 个月以后':'بعد 3 أشهر','你想通过 AI 解决什么问题？':'ما المشكلة التي تريد حلها بالذكاء الاصطناعي؟','预约一次免费诊断':'احجز استشارة مجانية','提交中…':'جارٍ الإرسال…',
  '不是交一份方案，':'أكثر من مجرد خطة—','而是一起把 AI':'نبني الذكاء الاصطناعي داخل','做进业务':'عملياتك','我们的原则':'مبدؤنا','从一个真实场景开始，':'ابدأ بحالة استخدام حقيقية،','让结果先发生。':'واجعل النتائج تحدث أولاً.','诊断':'تشخيص','共创':'بناء مشترك','陪跑':'مرافقة','不只学工具，':'أكثر من تعلّم الأدوات—','而是带走':'اخرج ومعك','下一步行动':'الخطوة التالية','管理层路径':'مسار الإدارة','业务骨干路径':'مسار فريق الأعمال','形式':'الصيغة','规模':'الحجم','最终产出：':'المخرجات: ','© 2026 图灵驭界 · 企业 AI 落地伙伴':'© 2026 Tellyn AI · شريك تنفيذ الذكاء الاصطناعي للمؤسسات','上海市徐汇区漕河泾超级创业者社区':'شوجيا هوي، شنغهاي',
}

const dictionaries = {
  zh: {},
  en: { ...en, ...generated.en },
  ar: { ...ar, ...generated.ar },
}

// This is the single production content configuration consumed by the UI.
// Every source phrase resolves to an explicit zh/en/ar record before render.
const legacyCopy = Object.fromEntries(
  [...new Set([...Object.keys(dictionaries.en), ...Object.keys(dictionaries.ar)])].map((source) => [source, Object.freeze({
    zh: source,
    en: dictionaries.en[source],
    ar: dictionaries.ar[source],
  })]),
)
export const copyConfig = Object.freeze({ ...legacyCopy, ...launchCopy, ...qixiaoCopy })

function translateText(source, language) {
  if (typeof source !== 'string' || language === 'zh') return source
  const key = source.trim()
  if (!key) return source
  const translated = copyConfig[key]?.[language]
  return translated ? source.replace(key, translated) : source
}

const translatedAttributes = ['placeholder', 'aria-label', 'alt', 'title']

// Localize the React tree before it reaches the DOM. This intentionally avoids
// DOM walking/mutation, so content stays deterministic during SSR and hydration.
export function localizeNode(node, language) {
  if (typeof node === 'string') return translateText(node, language)
  if (Array.isArray(node)) return node.map((child, index) => {
    const localized = localizeNode(child, language)
    return isValidElement(localized) && localized.key == null ? cloneElement(localized, { key: index }) : localized
  })
  if (!isValidElement(node)) return node

  const nextProps = {}
  for (const attribute of translatedAttributes) {
    if (typeof node.props[attribute] === 'string') nextProps[attribute] = translateText(node.props[attribute], language)
  }
  if (node.props.dangerouslySetInnerHTML?.__html) {
    nextProps.dangerouslySetInnerHTML = { __html: translateValue(node.props.dangerouslySetInnerHTML.__html, language) }
  } else if ('children' in node.props) {
    nextProps.children = localizeNode(node.props.children, language)
  }
  return cloneElement(node, nextProps)
}
function fromCountry(country=''){ const c=country.toUpperCase(); if(['CN','TW','HK','MO','SG'].includes(c))return'zh'; if(['AE','SA','EG','IQ','JO','KW','LB','LY','MA','OM','QA','SY','TN','YE','BH','DZ','SD','PS','MR'].includes(c))return'ar'; return'en' }
export function useLanguage(initialLanguage=''){ const [language,setState]=useState(()=>initialLanguage||(typeof localStorage!=='undefined'?localStorage.getItem('tellyn-language')||'':'')); useEffect(()=>{const sync=(e)=>setState(e.detail);window.addEventListener('tellyn-language',sync);if(!language)(async()=>{try{let r=await fetch('/api/locale');if(!r.ok)r=await fetch('https://ipapi.co/json/');const d=await r.json();const next=fromCountry(d.country||d.country_code);setState(next);window.dispatchEvent(new CustomEvent('tellyn-language',{detail:next}))}catch{const b=navigator.language.toLowerCase();const next=b.startsWith('zh')?'zh':b.startsWith('ar')?'ar':'en';setState(next);window.dispatchEvent(new CustomEvent('tellyn-language',{detail:next}))}})();return()=>window.removeEventListener('tellyn-language',sync)},[]); return [language||initialLanguage||'zh',(next)=>{if(typeof localStorage!=='undefined')localStorage.setItem('tellyn-language',next);setState(next);if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('tellyn-language',{detail:next}))}] }
export function usePageTranslation(language){useLayoutEffect(()=>{if(typeof document==='undefined')return;document.documentElement.lang=language==='zh'?'zh-CN':language;document.documentElement.dir=language==='ar'?'rtl':'ltr'},[language])}
export function translateValue(source, language){return copyConfig[source]?.[language]||source}
