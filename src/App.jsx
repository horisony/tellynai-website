import { createContext, useContext, useEffect, useState } from "react";
import {
  cases,
  fdeFaqs,
  homeFaqs,
  services,
  trainingFaqs,
  trainingPrograms,
} from "./content";
import {
  languageOptions,
  localizeNode,
  translateValue,
  useLanguage,
  usePageTranslation,
} from "./i18n";

const LocaleContext = createContext({ language: "zh", setLanguage: () => {} });

function Localized({ children }) {
  const { language } = useContext(LocaleContext);
  return localizeNode(children, language);
}

const clients = [
  "成都泉源堂",
  "上海赫本珠宝",
  "上海临床转化研究院",
  "宁波中工美",
  "福州跨境电商公司",
];

function Mark() {
  return (
    <Localized>
      <img className="mark" src="/assets/tuling-logo.png" alt="图灵驭界 AI" />
    </Localized>
  );
}
function Brand() {
  return (
    <Localized>
      <a className="brand" href="/" aria-label="图灵驭界 AI 首页">
        <Mark />
        <span>图灵驭界</span>
        <b>AI</b>
      </a>
    </Localized>
  );
}

function Header({ contactHref = "#contact" }) {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useContext(LocaleContext);
  return (
    <Localized>
      <header className="site-header">
        <Brand />
        <button
          className="menu-button"
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          菜单
        </button>
        <nav className={open ? "open" : ""} aria-label="主导航">
          <a href="/#services">服务</a>
          <a href="/fde">FDE 落地</a>
          <a href="/training">企业内训</a>
          <a href="/#cases">案例</a>
          <a href="/#tellwin">TellWin</a>
          <a href="/#qixiao">启晓</a>
          <a href={contactHref}>联系我们</a>
        </nav>
        <label className="language-switch">
          <svg
            className="language-globe"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21M12 3C9.6 5.5 8.4 8.5 8.4 12s1.2 6.5 3.6 9" />
          </svg>
          <span className="language-current" aria-hidden="true">
            {languageOptions.find(([code]) => code === language)?.[1]}
          </span>
          <svg
            className="language-chevron"
            viewBox="0 0 12 12"
            aria-hidden="true"
          >
            <path d="m2.5 4.5 3.5 3 3.5-3" />
          </svg>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Language"
          >
            {languageOptions.map(([code, short, label]) => (
              <option key={code} value={code} aria-label={label}>
                {short}
              </option>
            ))}
          </select>
        </label>
        <a className="header-cta" href="#contact">
          预约诊断
        </a>
      </header>
    </Localized>
  );
}

function Footer() {
  return (
    <Localized>
      <footer>
        <Brand />
        <span>© 2026 图灵驭界 · 企业 AI 落地伙伴</span>
        <span className="address">上海市徐汇区漕河泾超级创业者社区</span>
        <a href="mailto:baolyang@tellynai.com">baolyang@tellynai.com</a>
      </footer>
    </Localized>
  );
}

function SectionTitle({ eyebrow, title, children }) {
  return (
    <Localized>
      <div className="section-heading">
        <span className="eyebrow">
          <i />
          {eyebrow}
        </span>
        <h2 dangerouslySetInnerHTML={{ __html: title }} />
        {children && <p>{children}</p>}
      </div>
    </Localized>
  );
}

function Faq({ items }) {
  return (
    <Localized>
      <div className="faq-list">
        {items.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span>＋</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </Localized>
  );
}

function Contact({ source = "首页", defaultService = "", id = "contact" }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    contact: "",
    need: "",
    service: defaultService,
    companySize: "",
    startTime: "",
  });
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || "提交失败，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Localized>
      <section className="section-shell contact" id={id}>
        <div className="contact-copy">
          <span className="eyebrow inverse">
            <i />
            START SMALL
          </span>
          <h2>
            先聊一个
            <br />
            <em>真实问题</em>。
          </h2>
          <p>
            留下联系方式，我们会在 1
            个工作日内回复。第一次沟通免费，先帮你判断什么值得做、什么可以暂时不做。
          </p>
          <a href="mailto:baolyang@tellynai.com">baolyang@tellynai.com</a>
        </div>
        {submitted ? (
          <div className="success">
            <b>收到！</b>
            <p>我们会在 1 个工作日内联系你。</p>
            <button type="button" onClick={() => setSubmitted(false)}>
              再提交一份需求
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="form-row">
              <label>
                怎么称呼你？
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="例如：王先生"
                />
              </label>
              <label>
                公司 / 行业
                <input
                  name="company"
                  value={form.company}
                  onChange={update}
                  placeholder="例如：零售"
                />
              </label>
            </div>
            <label>
              微信 / 手机号
              <input
                required
                name="contact"
                value={form.contact}
                onChange={update}
                placeholder="方便联系你的方式"
              />
            </label>
            <div className="form-row">
              <label>
                感兴趣的服务
                <select name="service" value={form.service} onChange={update}>
                  <option value="">还不确定</option>
                  <option>AI 业务诊断</option>
                  <option>企业 AI 内训</option>
                  <option>FDE 共创落地</option>
                  <option>AI 产品开发</option>
                </select>
              </label>
              <label>
                企业规模
                <select
                  name="companySize"
                  value={form.companySize}
                  onChange={update}
                >
                  <option value="">请选择</option>
                  <option>1–20 人</option>
                  <option>21–100 人</option>
                  <option>101–500 人</option>
                  <option>500 人以上</option>
                </select>
              </label>
            </div>
            <label>
              期望什么时候启动？
              <select name="startTime" value={form.startTime} onChange={update}>
                <option value="">还不确定</option>
                <option>一个月内</option>
                <option>1–3 个月</option>
                <option>3 个月以后</option>
              </select>
            </label>
            <label>
              你想通过 AI 解决什么问题？
              <textarea
                name="need"
                value={form.need}
                onChange={update}
                placeholder="说说目前的流程、难点或想验证的方向"
                rows="3"
              />
            </label>
            {submitError && <p className="form-error">{submitError}</p>}
            <button className="button yellow" disabled={submitting}>
              {submitting ? "提交中…" : "预约一次免费诊断"}
            </button>
          </form>
        )}
      </section>
    </Localized>
  );
}

function PageHero({
  kicker,
  title,
  copy,
  tags = [],
  action = "预约一次 AI 场景诊断",
}) {
  return (
    <Localized>
      <section className="inner-hero section-shell">
        <div>
          <span className="eyebrow">
            <i />
            {kicker}
          </span>
          <h1 dangerouslySetInnerHTML={{ __html: title }} />
          <p>{copy}</p>
          <div className="hero-actions">
            <a className="button dark" href="#contact">
              {action}
            </a>
            <a className="button outline" href="/#cases">
              查看交付案例
            </a>
          </div>
        </div>
        <div className="principle-card">
          <small>我们的原则</small>
          <strong>
            从一个真实场景开始，
            <br />
            让结果先发生。
          </strong>
          <div>
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>
    </Localized>
  );
}

function Home() {
  return (
    <Localized>
      <>
        <Header />
        <section className="hero section-shell" id="top">
          <div className="hero-copy">
            <h1>
              让 AI 真正
              <br />
              进入你的 <em>增长链路</em>
            </h1>
            <p>
              从内容获客、线索培育到成交转化，我们不是把一套通用工具交给你，而是和管理层、一线团队一起，从业务诊断、企业内训到
              FDE 共创，把 AI 做成每天有人用、能持续迭代的增长能力。
            </p>
            <div className="hero-actions">
              <a className="button dark" href="#contact">
                预约免费诊断
              </a>
              <a className="button outline" href="#cases">
                查看交付案例
              </a>
            </div>
            <div className="team-origin">
              <strong>核心团队来自</strong>
              <div>
                <img src="/assets/team-tencent-cloud.svg" alt="腾讯云" />
                <img src="/assets/team-nio.png" alt="NIO 蔚来" />
                <img
                  src="/assets/team-bytedance.svg"
                  alt="ByteDance 字节跳动"
                />
                <img src="/assets/team-meituan.png" alt="美团" />
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="bao-hero"
              src="/assets/team-hero.png"
              alt="图灵驭界团队手绘插图"
            />
          </div>
        </section>
        <section className="client-section section-shell">
          <div className="client-label">
            <i />
            服务客户
          </div>
          <div className="client-marquee">
            <div className="client-track">
              {clients.concat(clients).map((c, i) => (
                <div className="client-logo" key={i}>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section-shell block" id="services">
          <SectionTitle
            eyebrow="WHAT WE DO"
            title={"从想清楚，<br />到 <em>真的用起来</em>。"}
          >
            按企业当前阶段切入，不用先买一套大系统。
          </SectionTitle>
          <div className="service-grid four">
            {services.map((s) => (
              <article className="service-card" key={s.id}>
                <small>{s.number} · 服务</small>
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
                <div className="card-meta">
                  <span>适合：{s.fit}</span>
                  <b>{s.deliverable}</b>
                </div>
                <a href={s.href}>了解这项服务 →</a>
              </article>
            ))}
          </div>
        </section>
        <section className="tinted">
          <div className="section-shell block">
            <SectionTitle
              eyebrow="HOW TO CHOOSE"
              title={"你在哪一步，<br />就从 <em>哪一步开始</em>。"}
            >
              没有固定套餐绑架，先把最重要的业务问题说清楚。
            </SectionTitle>
            <div className="choice-grid">
              {services.map((s) => (
                <a href={s.href} key={s.id}>
                  <small>{s.number}</small>
                  <p>{s.fit}</p>
                  <strong>{s.title} →</strong>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section className="tinted" id="cases">
          <div className="section-shell block">
            <SectionTitle
              eyebrow="SELECTED WORK"
              title={"做过的项目，<br />经得起 <em>业务现场</em>。"}
            >
              不展示虚构数字，只讲真实问题、做法和已经发生的改变。
            </SectionTitle>
            <div className="case-preview-grid">
              {cases.slice(0, 3).map((c) => (
                <article key={c.slug}>
                  <img src={c.image} alt="" />
                  <div>
                    <span>
                      {c.industry} · {c.service}
                    </span>
                    <h3>{c.title}</h3>
                    <p>
                      <b>问题</b>
                      {c.challenge}
                    </p>
                    <p>
                      <b>交付</b>
                      {c.action}
                    </p>
                    <p>
                      <b>结果</b>
                      {c.result}
                    </p>
                    <a href="#contact">咨询类似项目 →</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section-shell wecom-sales" id="wecom-sales">
          <SectionTitle
            eyebrow="WECOM SALES ANALYSIS"
            title={"企微销售分析，<br />让客户对话变成 <em>可行动的洞察</em>。"}
          >
            汇总企微里的真实沟通，识别客户意向、销售表现和待跟进事项，帮助团队更及时地复盘与行动。
          </SectionTitle>
          <a
            className="wecom-sales-link"
            href="https://sales-words-hifiaudio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="打开企微销售分析体验页面"
          >
            <img
              className="wecom-sales-shot"
              src="/assets/wecom-sales-assistant.webp"
              alt="企微销售分析界面"
              loading="lazy"
            />
            <span className="wecom-sales-cta">体验企微销售分析 ↗</span>
          </a>
        </section>
        <section className="section-shell tellyn-product" id="tellwin1">
          <div className="tellyn-copy">
            <span className="eyebrow">
              <i />
              OUR PRODUCT
            </span>
            <h2>
              <em>TellWin</em>，把线下现场
              <br />
              变成可用的业务数据。
            </h2>
            <p>
              TellWin 用 AI
              收集销售、产品和市场的一线反馈，整理为可以被管理者理解、被团队执行的业务洞察。
            </p>
            <div className="tellyn-list">
              <span>收集真实反馈</span>
              <span>AI 数据分析</span>
              <span>辅助业务决策</span>
            </div>
            <a className="button dark" href="/#tellwin">
              了解 TellWin
            </a>
          </div>
          <img
            className="product-shot"
            src="/assets/tellyn-dashboard.png"
            alt="TellWin 产品界面"
          />
        </section>
        <section
          className="section-shell tellyn-product snapdesign-product"
          id="snapdesign"
        >
          <div className="product-video">
            <iframe
              src="https://www.youtube.com/embed/WMDGoGlz3vI?autoplay=1&mute=1&loop=1&playlist=WMDGoGlz3vI&controls=1&playsinline=1&rel=0"
              title="SnapDesign 快速生成设计海报演示"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="tellyn-copy">
            <span className="eyebrow">
              <i />
              DESIGN WITH AI
            </span>
            <h2>
              <em>SnapDesign</em>，快速生成
              <br />
              各类设计海报。
            </h2>
            <p>
              上传产品图片，描述想要的内容和风格，SnapDesign
              就能快速生成可继续编辑的视觉设计，覆盖电商海报、活动海报等常见场景。
            </p>
            <div className="tellyn-list">
              <span>电商海报</span>
              <span>活动海报</span>
              <span>产品视觉</span>
              <span>快速生成</span>
            </div>
            <a
              className="button dark"
              href="https://www.snapdesign.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              打开 SnapDesign ↗
            </a>
          </div>
        </section>
        <section className="qixiao-home" id="qixiao1">
          <div className="section-shell tellyn-product qixiao-product">
            <img
              className="product-shot"
              src="/assets/qixiao-dashboard.png"
              alt="启晓 AI 公关工作系统总览"
            />
            <div className="tellyn-copy">
              <span className="eyebrow"><i />AI PR WORK SYSTEM</span>
              <h2><em>启晓</em>，把全网舆情<br />变成可执行的<em>公关判断</em>。</h2>
              <p>启晓以企业专属模型、知识库与智能体重构舆情工作流，从全网发现、事件研判到行动建议和复盘沉淀，帮助公关团队更早看见真正的风险。</p>
              <div className="tellyn-list">
                <span>语义理解</span><span>事件研判</span><span>行动建议</span><span>持续学习</span>
              </div>
              <a className="button dark" href="/#qixiao">了解启晓</a>
            </div>
          </div>
        </section>
        <section className="section-shell block faq-section">
          <SectionTitle
            eyebrow="FAQ"
            title={"开始之前，<br /><em>你可能想问</em>。"}
          />
          <Faq items={homeFaqs} />
        </section>
        <Contact />
        <Footer />
      </>
    </Localized>
  );
}

function QixiaoPage() {
  const problems = [
    ["01", "关键词命中，不等于真实风险", "玩梗、反讽、二创与搬运会制造大量噪声。企业需要理解讨论对象、语气、意图和语境，而不只是看词有没有出现。"],
    ["02", "声量高低，不等于舆情伤害", "一条高传播切片可能比大量低互动链接更值得优先处理，需要结合账号权重、传播速度与跨平台扩散判断影响。"],
    ["03", "静态报告，赶不上风险变化", "新梗、新账号和新议题不断出现，固定规则与项目制排期很难持续跟上公关团队的判断节奏。"],
  ];
  const workflow = [
    ["01 · DISCOVER", "全网发现", "汇聚公开媒体、社交平台与长尾社区信息，清洗多源内容，并把零散线索聚合成可持续跟踪的话题与事件。"],
    ["02 · UNDERSTAND", "语义理解", "结合品牌语境判断相关性、情绪、意图、反讽与二次传播，过滤无效命中，把注意力留给真正的品牌风险。"],
    ["03 · DECIDE", "事件研判", "综合原文证据、账号影响、传播链路与历史参考，给出风险等级、判断依据和置信度，关键结论由负责人复核。"],
    ["04 · ACT", "行动建议", "围绕事件生成处置策略、回应口径与执行清单，并通过飞书群、微信群等现有协作渠道推送给相关团队。"],
    ["05 · LEARN", "复盘沉淀", "团队的确认、排除、改标签与处置反馈回到专属知识库，让同类事件的下一次判断更快、更贴近品牌标准。"],
  ];
  const capabilities = [
    ["01", "话题监控", "把长期议题的持续观察与突发事件的主动侦察放在同一视图，按影响力而不是简单声量排序。"],
    ["02", "事件情报", "将零散帖子合并为事件，识别首发源头、关键节点，以及原始内容、二创切片与搬运扩散之间的关系。"],
    ["03", "水军雷达", "通过企业专属风险标签辅助识别可疑账号与营销号，持续追踪其活跃话题和平台。"],
    ["04", "多平台热搜", "聚合不同平台的相关热点与榜单，帮助团队及时看见议题是否发生跨平台迁移。"],
    ["05", "分析报告", "以结论先行的结构化报告呈现趋势、风险判断和行动建议，并可按企业模板与品牌视觉配置。"],
    ["06", "舆情专家 Agent", "通过对话导入内容、调整关注重点和发起追踪任务；智能体持续汇总、优先推送并形成每日总结。"],
  ];
  const fit = [
    ["内容与社区平台", "同时面对用户生态、内容合规、商业化争议与跨圈层传播，需要理解平台黑话、二创和社区语境。"],
    ["上市公司与硬科技", "需要共同观察媒体、投资者社区、监管口径和行业观点，并保留完整证据支持审慎判断。"],
    ["高关注消费品牌", "产品安全、服务体验与社交内容容易相互放大，需要尽早识别隐性风险与跨平台扩散。"],
  ];
  return (
    <Localized>
      <>
        <Header contactHref="#qixiao-contact" />
        <main className="tellyn-page qixiao-page">
          <section className="tellyn-hero qixiao-hero section-shell">
            <div className="tellyn-hero-copy">
              <div className="tellyn-lockup"><strong>启晓</strong><span>AI PR Work System</span></div>
              <h1>不只看见舆情，<br />更早形成<em>可执行的判断</em>。</h1>
              <p>启晓是面向企业与品牌定制的 AI 公关工作系统。它以专属模型、企业知识库和 Agent 工作流，连接发现、研判、响应与复盘，让公关团队从信息汇总走向决策协同。</p>
              <div className="hero-actions">
                <a className="button dark" href="#qixiao-contact">预约产品演示</a>
                <a className="button outline" href="#qixiao-workflow">了解工作闭环</a>
              </div>
              <div className="tellyn-promise"><span>发现</span><b>→</b><span>理解</span><b>→</b><span>研判</span><b>→</b><span>行动</span><b>→</b><span>复盘</span></div>
            </div>
            <div className="qixiao-hero-screen"><img src="/assets/qixiao-dashboard.png" alt="启晓 AI 公关工作系统总览" /></div>
          </section>

          <section className="tellyn-problem">
            <div className="section-shell">
              <p>传统舆情工具的问题，不在于能不能监测，而在于能不能快速理解、判断和迭代。</p>
              <h2>当风险进入语境、圈层与传播链路，<br />只看关键词和声量，已经<em>不够了</em>。</h2>
              <div className="problem-grid">{problems.map(([n,t,c]) => <article key={n}><small>{n}</small><h3>{t}</h3><p>{c}</p></article>)}</div>
            </div>
          </section>

          <section className="section-shell qixiao-workflow" id="qixiao-workflow">
            <div className="tellyn-section-head"><span>THE PR DECISION LOOP</span><h2>从“看见信息”，<br />走到<em>处理与复盘</em>。</h2><p>AI 负责发现、聚合、研判与报告起草，团队聚焦事实确认、策略选择与最终对外口径。高风险结论始终保留原文证据、判断依据和人工复核。</p></div>
            <div className="qixiao-step-grid">{workflow.map(([tag,title,copy]) => <article key={tag}><small>{tag}</small><h3>{title}</h3><p>{copy}</p></article>)}</div>
          </section>

          <section className="qixiao-proof-band">
            <div className="section-shell qixiao-proof-layout">
              <div className="tellyn-section-head"><span>ONE SHARED CONTROL CENTER</span><h2>零散帖子变成事件，<br />事件进入<em>同一个工作台</em>。</h2><p>总览、话题、事件、可疑账号、多平台热搜与分析报告共享上下文，公关团队不必在不同工具间重复拼接判断。</p></div>
              <div className="dashboard-frame"><img src="/assets/qixiao-dashboard.png" alt="启晓舆情监测与智能管控中心" /></div>
            </div>
          </section>

          <section className="section-shell qixiao-capabilities">
            <div className="tellyn-section-head"><span>CORE CAPABILITIES</span><h2>不是一张大屏，<br />而是一套会<em>完成任务</em>的系统。</h2></div>
            <div className="capability-list">{capabilities.map(([n,t,c]) => <article key={n}><span>{n}</span><div><h3>{t}</h3><p>{c}</p></div></article>)}</div>
          </section>

          <section className="qixiao-agent-section">
            <div className="section-shell validation-layout">
              <div><span>AGENT + KNOWLEDGE</span><h2>每一次人工判断，<br />都成为品牌自己的<em>公关资产</em>。</h2><p>启晓将历史事件、品牌口径、合规红线与团队反馈沉淀到企业专属知识库。系统不是固定交付后停止变化，而是在明确的人机边界内持续吸收判断力。</p><div className="validation-points"><span>品牌专属模型</span><span>客户知识库</span><span>Agent 工作流</span><span>持续反馈</span></div></div>
              <img src="/assets/qixiao-agent-workflow.png" alt="启晓舆情专家 Agent 工作流程" />
            </div>
          </section>

          <section className="section-shell qixiao-fit">
            <div className="tellyn-section-head"><span>BUILT FOR COMPLEX REPUTATION RISK</span><h2>适合风险语境复杂、<br />需要跨团队协同的<em>企业与品牌</em>。</h2></div>
            <div className="department-grid">{fit.map(([t,lead],i) => <article key={t}><small>0{i+1}</small><h3>{t}</h3><p>{lead}</p></article>)}</div>
          </section>

          <section className="qixiao-report-section">
            <div className="section-shell validation-layout">
              <div><span>DECISION-READY REPORTING</span><h2>不止告诉你发生了什么，<br />更把<em>下一步依据</em>说清楚。</h2><p>报告以多维分析、传播演化和风险评估为基础，结构化呈现证据、重点与建议。模板和视觉可按企业需要配置，便于管理层快速阅读与团队协同。</p></div>
              <img src="/assets/qixiao-report.png" alt="启晓舆情分析报告示例" />
            </div>
          </section>
        </main>
        <Contact source="启晓产品页" defaultService="AI 产品开发" id="qixiao-contact" />
        <Footer />
      </>
    </Localized>
  );
}

function TellynPage() {
  const problems = [
    ["01", "客户资产跟着销售流动", "客户偏好、沟通历史与关键关系分散在个人设备和记忆里，人员变化时，企业很难完整接续。"],
    ["02", "优秀经验无法规模复制", "成交方法藏在少数人的表达与判断里，新人缺少真实语料，主管也难以定位辅导重点。"],
    ["03", "决策层听不到客户原声", "产品需求、竞品比较和真实异议经过层层转述，最终很难进入产品、营销与经营决策。"],
  ];
  const systemLayers = [
    ["01 · CAPTURE", "无感采集", "线下面对面沟通由录音终端采集，线上私域可对接企业微信；在获得客户同意与明确数据边界的前提下，让关键对话持续进入企业。"],
    ["02 · STRUCTURE", "对话变成客户档案", "AI 自动识别诉求、预算、决策人、异议、竞品提及与待办，并可写入飞书多维表格或现有 CRM，减少销售手工整理。"],
    ["03 · ACT", "洞察进入业务动作", "围绕销售策略、客户需求、产品反馈、市场反馈与竞品动态形成角色看板和经营报告，让不同团队看到各自的下一步。"],
  ];
  const departmentValue = [
    ["销售团队", "让每次沟通更接近成交", "对比成交与流失对话，沉淀有效问法和异议处理；为一线生成客户摘要、跟进建议和协同事项。"],
    ["产品团队", "让产品定义回到客户原声", "持续聚类需求、抱怨与竞品反馈，保留原始语境，为功能、定价与优先级判断提供一手材料。"],
    ["市场团队", "让传播语言贴近成交语言", "从真实客户表达中发现高频问题、内容主题和有效说法，让投放素材与门店成交语境保持一致。"],
  ];
  const industries = [
    {
      number: "01",
      image: "/assets/tellyn-healthcare.png",
      title: "医疗与医疗器械",
      lead: "一次专业沟通，不能只留在销售的记忆里。",
      scene:
        "医生、科室与采购关心的问题不同，产品信息专业，决策链长，复盘往往依赖销售手写笔记。",
      value: [
        "还原产品问题与临床关注点",
        "区分使用顾虑、采购条件与关键人",
        "生成准确的会后摘要与内部协同事项",
      ],
    },
    {
      number: "02",
      image: "/assets/tellyn-real-estate.png",
      title: "汽车销售",
      lead: "试驾结束后，真正的销售工作才刚开始。",
      scene:
        "预算、车型偏好、旧车置换、家庭意见和竞品比较散落在一段长对话里，跟进很容易只剩一句“再考虑”。",
      value: [
        "提取车型偏好、预算与购买时点",
        "识别价格、配置与竞品异议",
        "给销售清晰的下一次触达建议",
      ],
    },
    {
      number: "03",
      image: "/assets/tellyn-automotive.png",
      title: "房产销售",
      lead: "每次带看，都应该让下一套推荐更准确。",
      scene:
        "客户会在通勤、学区、户型、楼层、付款安排之间反复权衡，多次带看的信息难以被团队完整接续。",
      value: [
        "沉淀显性需求与未说出口的顾虑",
        "整理决策人、时间线和资金安排",
        "帮助经纪人准备更贴合的房源与话术",
      ],
    },
  ];
  const comparison = [
    ["采集场景", "个人随手记录", "通用会议", "线下销售 + 线上私域"],
    ["核心产出", "转写与摘要", "会议纪要", "结构化客户档案与行动建议"],
    ["服务对象", "个人", "参会者", "销售、产品、市场与管理层"],
    ["行业能力", "通用", "通用", "随真实交付持续沉淀行业模板"],
  ];
  const businessModel = [
    ["硬件入口", "让面对面销售对话稳定进入系统，降低一线使用门槛。硬件承担采集入口，不作为唯一价值来源。"],
    ["SaaS 订阅", "以客户档案、分析看板、团队知识与经营报告承接持续价值，是标准产品的长期收入基础。"],
    ["FDE 共创", "围绕标杆客户做业务调研、系统接入和智能体定制，把真实交付经验沉淀为可复用的行业模板。"],
  ];
  const flywheel = [
    ["01", "深度交付", "进入真实销售现场，找到高价值问题"],
    ["02", "模板沉淀", "形成行业热词、分析框架与成功方法"],
    ["03", "产品复制", "把经验注入 SaaS，降低下一次交付成本"],
    ["04", "数据增强", "更多真实反馈让行业理解持续变准"],
  ];
  return (
    <Localized>
      <>
      <Header contactHref="#tellwin-contact" />
      <main className="tellyn-page">
        <section className="tellyn-hero section-shell">
          <div className="tellyn-hero-copy">
            <div className="tellyn-lockup">
              <img src="/assets/tellyn-mark.png" alt="TellWin" />
              <strong>TellWin</strong>
              <span>AI Sales Copilot</span>
            </div>
            <h1>
              把每一次销售对话，
              <br />
              变成企业的<em>客户情报资产</em>。
            </h1>
            <p>
              TellWin 面向汽车、珠宝、家装、医疗等高客单、长决策链行业，通过 AI
              录音硬件与行业化 SaaS，把散落在现场和私域里的客户对话，整理成企业可掌握、团队可执行、持续可积累的业务资产。
            </p>
            <div className="hero-actions">
              <a className="button dark" href="#tellwin-contact">
                预约产品演示
              </a>
              <a className="button outline" href="#tellwin-industries">
                了解产品如何工作
              </a>
            </div>
            <div className="tellyn-promise">
              <span>客户对话</span>
              <b>→</b>
              <span>结构化档案</span>
              <b>→</b>
              <span>业务洞察</span>
              <b>→</b>
              <span>组织资产</span>
            </div>
          </div>
          <div className="tellyn-hero-art">
            <img
              src="/assets/tellyn-hero-sales.png"
              alt="汽车销售向客户介绍车辆的手绘插图"
            />
            <div>
              <small>AI 整理完成</small>
              <strong>3 个购买信号</strong>
              <span>2 项待跟进事项</span>
            </div>
          </div>
        </section>

        <section className="tellyn-problem">
          <div className="section-shell">
            <p>高客单生意真正稀缺的，不是更多表格，而是完整的客户语境。</p>
            <h2>
              当对话结束，最有价值的需求、异议与承诺，
              <br />
              不该继续锁在销售的<em>脑子和手机里</em>。
            </h2>
            <div className="problem-grid">
              {problems.map(([number, title, copy]) => (
                <article key={number}>
                  <small>{number}</small>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell tellyn-system" id="tellwin-industries">
          <div className="tellyn-section-head">
            <span>HOW TELLWIN WORKS</span>
            <h2>销售正常接待客户，<br />TellWin 完成<em>剩下的工作</em>。</h2>
            <p>两条数据管道汇入同一套分析引擎：线下对话通过录音终端采集，线上沟通通过企业微信等业务系统接入，再由 AI 完成结构化、分析与分发。</p>
          </div>
          <div className="system-layers">
            {systemLayers.map(([tag, title, copy]) => (
              <article key={tag}>
                <small>{tag}</small>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <div className="system-output">
            <span>面对面录音</span><b>＋</b><span>企业微信</span><b>→</b><span>客户档案</span><b>→</b><span>角色看板与经营报告</span>
          </div>
        </section>

        <section className="tellyn-departments">
          <div className="section-shell">
            <div className="tellyn-section-head">
              <span>ONE ASSET, THREE TEAMS</span>
              <h2>一份客户情报资产，<br />同时服务<em>三个部门</em>。</h2>
              <p>TellWin 不止缩短整理时间，更让客户原声从销售现场进入产品与市场决策。这是它与单纯录音、转写和会议纪要工具的本质区别。</p>
            </div>
            <div className="department-grid">
              {departmentValue.map(([title, lead, copy], index) => (
                <article key={title}>
                  <small>0{index + 1}</small>
                  <h3>{title}</h3>
                  <strong>{lead}</strong>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell tellyn-industries">
          <div className="tellyn-section-head">
            <span>BUILT FOR HIGH-VALUE SALES</span>
            <h2>
              同一套客户情报引擎，
              <br />
              适配不同的<em>高价值销售现场</em>。
            </h2>
            <p>
              我们优先服务万元级客单、依赖深度沟通成交、客户资产容易随人员流动的行业。底层能力保持一致，按行业补充热词、档案字段和分析模板。
            </p>
          </div>
          <div className="industry-grid">
            {industries.map((item) => (
              <article key={item.number}>
                <small>{item.number}</small>
                <div className="industry-illustration" aria-hidden="true">
                  <img src={item.image} alt="" />
                </div>
                <h3>{item.title}</h3>
                <strong>{item.lead}</strong>
                <p>{item.scene}</p>
                <ul>
                  {item.value.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="industry-band" aria-label="更多适用行业">
            {['珠宝与奢侈品', '家装与定制家居', '保险与财富管理', '留学与移民服务', 'B2B 设备销售', '高端专业服务'].map((item) => <span key={item}>{item}</span>)}
          </div>
        </section>

        <section className="tellyn-flow">
          <div className="section-shell">
            <div className="tellyn-section-head">
              <span>WHY NOW</span>
              <h2>
                现在，客户对话第一次能够
                <br />
                以可持续成本成为<em>结构化数据</em>。
              </h2>
              <p>大模型显著降低了长对话理解与结构化的成本；线下录音硬件与 AI 订阅模式逐渐被市场接受；当流量红利减弱，企业也更需要经营已经发生的每一次客户接触。</p>
            </div>
            <div className="why-now-grid">
              <article><small>TECHNOLOGY</small><h3>对话理解走向可用</h3><p>从逐字稿进一步提取角色、意图、异议和行动，复杂销售语境开始能够被稳定整理。</p></article>
              <article><small>BEHAVIOR</small><h3>采集入口正在成熟</h3><p>硬件与私域系统共同覆盖面对面和线上沟通，让数据采集不再依赖销售额外填写。</p></article>
              <article><small>BUSINESS</small><h3>企业转向经营存量</h3><p>获客越来越难，企业必须提升已有线索的转化质量，并保护长期积累的客户关系。</p></article>
            </div>
          </div>
        </section>

        <section className="section-shell tellyn-business">
          <div className="tellyn-section-head">
            <span>BUSINESS MODEL</span>
            <h2>硬件打开现场，SaaS 承接价值，<br />FDE 让产品<em>持续进化</em>。</h2>
            <p>商业模式围绕同一份客户情报资产展开：既能从单团队切入，也能随门店、角色与系统接入逐步扩展。</p>
          </div>
          <div className="business-grid">
            {businessModel.map(([title, copy], index) => <article key={title}><small>0{index + 1}</small><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="tellyn-compare">
          <div className="section-shell compare-layout">
            <div className="tellyn-section-head">
              <span>POSITIONING</span>
              <h2>不是更聪明的录音笔，<br />而是企业的<em>客户情报基础设施</em>。</h2>
              <p>通用工具解决“记下来”，TellWin 解决“归企业、能分析、可行动、会积累”。行业模板与客户成功方法来自持续交付，并反过来提高标准产品的适配度。</p>
            </div>
            <div className="comparison-table" role="table" aria-label="TellWin 与通用工具对比">
              <div className="comparison-row comparison-head" role="row"><b>能力维度</b><b>个人效率工具</b><b>通用会议 AI</b><b>TellWin</b></div>
              {comparison.map((row) => <div className="comparison-row" role="row" key={row[0]}>{row.map((cell, index) => index === 0 ? <b key={`${row[0]}-${index}`}>{cell}</b> : <span key={`${row[0]}-${index}`}>{cell}</span>)}</div>)}
            </div>
          </div>
        </section>

        <section className="section-shell tellyn-flywheel">
          <div className="tellyn-section-head">
            <span>COMPOUNDING ADVANTAGE</span>
            <h2>每一次真实交付，<br />都在加深<em>下一次复制的壁垒</em>。</h2>
            <p>TellWin 用 FDE 保持对行业现场的理解，再把行业知识沉淀到模板、产品和数据中，形成从服务到软件的增强循环。</p>
          </div>
          <div className="flywheel-grid">
            {flywheel.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>

        <section className="tellyn-validation">
          <div className="section-shell validation-layout">
            <div>
              <span>PAID VALIDATION</span>
              <h2>已经有人为真实的<br /><em>销售对话分析</em>买单。</h2>
              <p>在上海高端珠宝定制场景中，我们围绕企业微信真实成交记录构建销售知识库与话术分析能力，为一线提供更一致的回复建议。该项目已完成付费交付，验证了客户对“把对话变成团队能力”的明确需求。</p>
              <div className="validation-points"><span>高客单定制场景</span><span>企业微信真实语料</span><span>已完成付费交付</span></div>
            </div>
            <a href="/#wecom-showcase" aria-label="查看企微销售分析案例"><img src="/assets/wecom-sales-assistant.webp" alt="企微销售分析界面" /></a>
          </div>
        </section>

        <section className="section-shell tellyn-product-proof">
          <div className="tellyn-section-head">
            <span>ONE SHARED VIEW</span>
            <h2>
              管理者看见共性，
              <br />
              一线得到<em>具体帮助</em>。
            </h2>
            <p>
              单次对话服务于跟进，跨门店与跨团队的对话则帮助管理者发现反复出现的客户问题、产品反馈与流程阻塞。
            </p>
          </div>
          <div className="dashboard-frame">
            <img
              src="/assets/tellyn-dashboard.png"
              alt="TellWin 销售洞察与经营总览界面"
            />
          </div>
          <div className="proof-grid tellyn-proof-grid">
            <article>
              <b>对销售</b>
              <p>更少整理时间，更清楚的客户上下文和下一步。</p>
            </article>
            <article>
              <b>对主管</b>
              <p>看见团队共性问题，辅导不再只凭结果猜原因。</p>
            </article>
            <article>
              <b>对产品与市场</b>
              <p>让客户之声持续进入产品、市场与经营决策。</p>
            </article>
          </div>
          <div className="proof-note">当前页面展示已公开能力与交付方向。具体效果取决于行业、数据基础与团队使用方式，将在试点中逐项验证。</div>
        </section>

      </main>
      <Contact source="TellWin 产品页" defaultService="AI 产品开发" id="tellwin-contact" />
      <Footer />
      </>
    </Localized>
  );
}

function FdePage() {
  const stages = [
    [
      "01",
      "业务访谈与机会评估",
      "进入真实流程，梳理角色、数据、系统与业务目标。",
    ],
    ["02", "优先级与方案设计", "用业务价值、实现难度和风险选出首个试点。"],
    ["03", "与业务骨干共创试点", "快速做出可运行版本，在真实任务中验证。"],
    ["04", "上线陪跑与持续优化", "接入工作流，建立评测、反馈和迭代机制。"],
  ];
  return (
    <Localized>
      <>
        <Header />
        <PageHero
          kicker="FDE · FORWARD DEPLOYED"
          title={"不是交一份方案，<br />而是一起把 AI <em>做进业务</em>。"}
          copy="FDE 同时理解业务和工程，进入真实流程，和你的团队共同完成诊断、试点、上线与迭代。"
          tags={["诊断", "共创", "陪跑"]}
        />
        <section className="tinted">
          <div className="section-shell block">
            <SectionTitle
              eyebrow="WHEN TO START"
              title={"出现这些信号，<br />就值得启动 <em>FDE</em>。"}
            />
            <div className="signal-grid">
              {[
                "有大量重复流程，但一直靠人工衔接",
                "尝试过 AI 工具，却无法进入生产环境",
                "业务与技术团队之间缺少翻译者",
                "希望沉淀企业自己的 AI 能力",
              ].map((x, i) => (
                <article key={x}>
                  <span>0{i + 1}</span>
                  <h3>{x}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section-shell block">
          <SectionTitle
            eyebrow="HOW WE DELIVER"
            title={"四个阶段，<br />每一步都有 <em>明确产出</em>。"}
          />
          <div className="stage-list">
            {stages.map(([n, t, c]) => (
              <article key={n}>
                <span>{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{c}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="tinted">
          <div className="section-shell block">
            <SectionTitle
              eyebrow="DELIVERABLES"
              title={"项目结束时，<br />留下的不只是 <em>一个 Demo</em>。"}
            />
            <div className="deliverable-grid">
              {[
                "AI 场景地图",
                "场景优先级评分",
                "业务流程与产品方案",
                "可运行的业务试点",
                "知识与技能资产",
                "评测指标和迭代路线图",
              ].map((x) => (
                <div key={x}>{x}</div>
              ))}
            </div>
            <div className="commercial-note">
              <b>典型合作方式</b>
              <p>
                先进行 1–2
                周诊断，再根据试点范围制定交付周期。项目制报价，正式方案确认后提供起步范围，不在网站展示未经确认的数字。
              </p>
            </div>
          </div>
        </section>
        <section className="section-shell block faq-section">
          <SectionTitle
            eyebrow="FDE FAQ"
            title={"合作之前，<br /><em>把边界说清楚</em>。"}
          />
          <Faq items={fdeFaqs} />
        </section>
        <Contact source="FDE 落地页" defaultService="FDE 共创落地" />
        <Footer />
      </>
    </Localized>
  );
}

function TrainingPage() {
  return (
    <Localized>
      <>
        <Header />
        <PageHero
          kicker="ENTERPRISE AI TRAINING"
          title={"不只学工具，<br />而是带走 <em>下一步行动</em>。"}
          copy="让管理层形成判断，让业务骨干围绕真实流程完成场景共创，培训结束就能进入试点。"
          tags={["管理共识", "业务实战", "场景产出"]}
          action="预约企业内训沟通"
        />
        <section className="section-shell block">
          <SectionTitle
            eyebrow="TWO LEARNING PATHS"
            title={"不同角色，<br />学习 <em>不同的事</em>。"}
          />
          <div className="path-grid">
            <article>
              <small>管理层路径</small>
              <h3>建立判断，而不是追热点</h3>
              <ul>
                {[
                  "AI 能力边界",
                  "业务机会判断",
                  "投入优先级",
                  "组织协作与风险",
                ].map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </article>
            <article>
              <small>业务骨干路径</small>
              <h3>围绕真实工作，做出试点</h3>
              <ul>
                {[
                  "工作流拆解",
                  "提示与智能体实践",
                  "真实场景共创",
                  "试点方案设计",
                ].map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>
        <section className="tinted">
          <div className="section-shell block">
            <SectionTitle
              eyebrow="PROGRAMS"
              title={"三种方式，<br />匹配团队的 <em>真实阶段</em>。"}
            />
            <div className="program-grid">
              {trainingPrograms.map((p, i) => (
                <article key={p.title}>
                  <span>0{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.audience}</p>
                  <dl>
                    <div>
                      <dt>形式</dt>
                      <dd>{p.format}</dd>
                    </div>
                    <div>
                      <dt>规模</dt>
                      <dd>{p.size}</dd>
                    </div>
                  </dl>
                  <ul>
                    {p.modules.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <strong>最终产出：{p.output}</strong>
                </article>
              ))}
            </div>
            <div className="commercial-note">
              <b>关于周期与报价</b>
              <p>
                标准课程提供明确周期，定制训练营根据人数、行业场景和陪跑深度报价。正式金额确认后再公开，不以虚构低价吸引咨询。
              </p>
            </div>
          </div>
        </section>
        <section className="section-shell block outcome">
          <SectionTitle
            eyebrow="WHAT REMAINS"
            title={"课件会过期，<br />企业能力要 <em>留下来</em>。"}
          />
          <div>
            <b>01</b>
            <span>一份企业 AI 场景地图</span>
            <b>02</b>
            <span>若干可执行的试点方案</span>
            <b>03</b>
            <span>首批内部 AI 推动者</span>
          </div>
        </section>
        <section className="section-shell block faq-section">
          <SectionTitle
            eyebrow="TRAINING FAQ"
            title={"安排课程前，<br /><em>你可能想问</em>。"}
          />
          <Faq items={trainingFaqs} />
        </section>
        <Contact source="企业内训页" defaultService="企业 AI 内训" />
        <Footer />
      </>
    </Localized>
  );
}

export function App() {
  const [language, setLanguage] = useLanguage();
  const [hash, setHash] = useState(() => window.location.hash);
  usePageTranslation(language);
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const isTellWinHash =
    path === "/" && (hash === "#tellwin" || hash.startsWith("#tellwin-"));
  const isTellWinPage =
    path === "/tellwin" || path === "/tellyn" || isTellWinHash;
  const isQixiaoHash = path === "/" && (hash === "#qixiao" || hash.startsWith("#qixiao-"));
  const isQixiaoPage = path === "/qixiao" || isQixiaoHash;
  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);
  useEffect(() => {
    const titles = {
      "/": "图灵驭界｜企业 AI 落地伙伴",
      "/fde": "FDE 共创落地｜图灵驭界",
      "/training": "企业 AI 内训｜图灵驭界",
      "/tellwin": "TellWin｜高价值销售团队的 AI Copilot",
      "/tellyn": "TellWin｜高价值销售团队的 AI Copilot",
      "/qixiao": "启晓｜AI 公关舆情工作系统",
    };
    const title = isTellWinPage ? titles["/tellwin"] : isQixiaoPage ? titles["/qixiao"] : titles[path] || titles["/"];
    document.title = translateValue(title, language);
    if (hash === "#tellwin" || hash === "#qixiao") {
      window.scrollTo(0, 0);
    } else if (hash) {
      requestAnimationFrame(() =>
        document.querySelector(hash)?.scrollIntoView(),
      );
    } else {
      window.scrollTo(0, 0);
    }
  }, [path, hash, language, isTellWinPage, isQixiaoPage]);
  const page =
    path === "/fde" ? (
      <FdePage />
    ) : path === "/training" ? (
      <TrainingPage />
    ) : isTellWinPage ? (
      <TellynPage />
    ) : isQixiaoPage ? (
      <QixiaoPage />
    ) : (
      <Home />
    );
  return (
    <LocaleContext.Provider value={{ language, setLanguage }}>
      {page}
    </LocaleContext.Provider>
  );
}
