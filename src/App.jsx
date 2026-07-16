import { useState } from 'react'

const agents = [
  { name: '销售陪练', tone: 'yellow', copy: 'AI 扮演高压客户，把每一次对话练成成交力。', tag: '陪练' },
  { name: '智能接待', tone: 'blue', copy: '懂产品也懂话术，客户来时随时接得住。', tag: '接待' },
  { name: '内容运营', tone: 'pink', copy: '按你的品牌调性，把选题和内容持续做下去。', tag: '创作' },
  { name: '私域唤醒', tone: 'green', copy: '识别时机、组织话术，让老客户重新活跃。', tag: '增长' },
  { name: '线索分诊', tone: 'orange', copy: '自动判断意向、分配跟进，把时间留给高价值客户。', tag: '转化' },
  { name: '知识问答', tone: 'purple', copy: '把散落的经验收进来，团队随问随用。', tag: '协作' },
]

const services = [
  ['01', 'AI 业务咨询', '看清业务里最值得用 AI 的那一步，拿到能直接开工的路线图。'],
  ['02', '企业实战培训', '管理层看战略，一线团队当场练，把工具真正用进工作。'],
  ['03', '智能体落地', '把脚本、接待、内容和复盘交给数字员工，持续替你干活。'],
]

function Mark() {
  return <img className="mark" src="/assets/tellyn-mark.png" alt="Tellyn AI" />
}

function Screenshot({ className = '' }) {
  return <img className={`source-shot ${className}`} src="/assets/tellyn-reference.png" alt="智能体产品界面示意" />
}

export function App() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', contact: '', need: '' })
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Tellyn AI 首页"><Mark /><span>Tellyn</span><b>AI</b></a>
        <nav aria-label="主导航">
          <a href="#services">业务</a><a href="#agents">数字员工</a><a href="#cases">案例</a><a href="#about">团队</a>
        </nav>
        <a className="header-cta" href="#contact">预约咨询</a>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><i />Tellyn · AI 咨询 × 培训 × 落地</div>
          <h1>把 <em>会干活的 AI</em><br />装进你的业务</h1>
          <p>Tellyn 帮企业想清楚 AI 怎么用、教会团队怎么用，再把营销获客的活儿直接交给 AI 干。不是报告里的概念，是每天在岗的数字员工。</p>
          <div className="hero-actions"><a className="button dark" href="#contact">预约免费咨询</a><a className="button outline" href="#cases">看看它干过的活</a></div>
          <div className="mini-proof"><span><strong>3</strong> 条业务线</span><span>咨询 + 培训 + 产品</span><span>首次沟通免费</span></div>
        </div>
        <div className="hero-visual" aria-label="Tellyn Agent 产品界面">
          <div className="browser-top"><span>TELLYN AGENT</span><b><i />正在干活</b></div>
          <div className="hero-shot-wrap"><Screenshot className="hero-shot" /></div>
          <div className="status-row"><span>脚本已生成 128 条</span><span>客户接待中</span><b>转化率 ↑ 37%</b></div>
        </div>
      </section>

      <section className="section-shell intro" id="services">
        <div className="section-heading"><div className="eyebrow coral"><i />业务</div><h2>同一颗脑袋，<br />会有 <em>十种性格</em>。</h2><p>从“要不要用 AI”到“AI 每天都在干活”，中间每一步都有人陪你跑完。</p></div>
        <div className="service-grid">
          {services.map(([number, title, copy]) => <article className="service-card" key={number}><small>{number} · 服务</small><h3>{title}</h3><p>{copy}</p><span>了解更多</span></article>)}
        </div>
      </section>

      <section className="section-shell agent-section" id="agents">
        <div className="section-heading compact"><div className="eyebrow"><i />数字员工</div><h2>不是工具，<br />是 <em>住进团队</em> 的同事。</h2></div>
        <div className="agent-grid">
          {agents.map((agent, index) => <article className={`agent-card ${agent.tone}`} key={agent.name}>
            <div className="agent-media"><Screenshot className={`agent-shot shot-${index}`} /><span>{agent.tag}</span></div>
            <div className="agent-content"><h3>{agent.name}</h3><p>{agent.copy}</p><a href="#contact">让它上岗</a></div>
          </article>)}
        </div>
        <div className="agent-footnotes"><span><b>咨询</b> 先选对能赢的战场</span><span><b>培训</b> 再让团队学会把 AI 当同事</span><span><b>落地</b> 最后让智能体按业务结果交付</span></div>
      </section>

      <section className="demos" id="cases"><div className="section-shell">
        <div className="section-heading"><div className="eyebrow coral"><i />案例</div><h2>能听会看，<br />不只 <em>能打字</em>。</h2><p>把客户的真实流程装进智能体，跑得越久，越懂你的业务。</p></div>
        <div className="case-grid">
          <article className="case-card"><div className="case-title"><span>跨境电商</span><b>FlyDirector · TikTok 脚本智能体</b></div><div className="case-screen black"><div><i />正在为户外收纳箱生成短视频脚本</div><strong>“前三秒用真实痛点抓住用户”</strong></div><p>输入产品信息，自动拆解钩子、卖点、口播和分镜。原来憋一天的脚本，现在一小时就能拿到 20 条能拍的。</p></article>
          <article className="case-card"><div className="case-title"><span>珠宝零售</span><b>企微话术智能体</b></div><div className="case-screen commerce"><Screenshot className="case-shot" /><div>客户正在犹豫价格<br /><strong>建议：先确认预算，再推荐克重方案</strong></div></div><p>接入企业微信，实时给导购递出下一句。把金牌销售的经验，变成每位新导购都用得上的标准动作。</p></article>
        </div>
      </div></section>

      <section className="section-shell about" id="about"><div className="about-copy"><div className="eyebrow"><i />团队</div><h2>既懂 AI，<br />也 <em>懂生意</em>。</h2><p>一半来自大模型应用一线，一半在增长和销售现场摸爬滚打过。方案落不落地，我们自己先跑一遍。</p></div><div className="about-points"><article><small>经验</small><b>100+</b><span>场企业实战培训</span></article><article><small>方法</small><b>从想</b><span>到干的一体化陪跑</span></article><article><small>目标</small><b>结果</b><span>而不是一份漂亮的 PPT</span></article></div></section>

      <section className="section-shell contact" id="contact"><div className="contact-copy"><div className="eyebrow inverse"><i />开始聊聊</div><h2>给你的业务<br />领一个 <em>Tellyn</em>。</h2><p>留下联系方式，1 个工作日内回复。第一次沟通完全免费，至少带走一份可以执行的思路。</p><a href="mailto:hello@tellynai.com">hello@tellynai.com</a></div>
        {submitted ? <div className="success"><b>收到！</b><p>我们会在 1 个工作日内联系你，坐等好消息。</p><button type="button" onClick={() => setSubmitted(false)}>再提交一份需求</button></div> : <form onSubmit={submit}><label>怎么称呼你？<input required name="name" value={form.name} onChange={update} placeholder="例如：王先生" /></label><label>公司 / 行业<input name="company" value={form.company} onChange={update} placeholder="例如：跨境电商" /></label><label>微信 / 手机号<input required name="contact" value={form.contact} onChange={update} placeholder="方便联系你的方式" /></label><label>想用 AI 解决什么问题？<textarea name="need" value={form.need} onChange={update} placeholder="随便写两句" rows="3" /></label><button className="button yellow" type="submit">提交预约</button></form>}
      </section>

      <footer><a className="brand" href="#top"><Mark /><span>Tellyn</span><b>AI</b></a><span>© 2026 Tellyn AI · 一个帮企业把 AI 用起来的团队</span><a href="mailto:hello@tellynai.com">hello@tellynai.com</a></footer>
    </main>
  )
}
