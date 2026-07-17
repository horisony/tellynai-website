import { useState } from 'react'

const services = [
  ['01', 'AI 咨询', '从业务诊断开始，判断 AI 应该优先进入哪些场景，给出可落地的增长路线图。'],
  ['02', 'AI 培训', '让管理者看懂方向，让一线团队学会实操，把 AI 变成每个人能用的工作能力。'],
  ['03', 'AI 产品开发', '围绕营销、销售和运营提效，把业务经验开发成真正可以上岗的 AI 产品。'],
]

const clients = ['成都泉源堂', '上海赫本珠宝', '上海临床转化研究院', '宁波中工美']

function Mark() {
  return <img className="mark" src="/assets/tuling-logo.png" alt="图灵驭界 AI" />
}

function Screenshot({ className = '' }) {
  return <img className={`source-shot ${className}`} src="/assets/tellyn-reference.png" alt="智能体产品界面示意" />
}

function TeamHero() {
  return <img className="bao-hero" src="/assets/team-hero.png" alt="图灵驭界团队插图" />
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
        <a className="brand" href="#top" aria-label="图灵驭界 AI 首页"><Mark /><span>图灵驭界</span><b>AI</b></a>
        <nav aria-label="主导航">
          <a href="#services">服务</a><a href="#cases">案例</a><a href="#tellyn">Tellyn</a><a href="#contact">联系</a>
        </nav>
        <a className="header-cta" href="#contact">联系我们</a>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <h1>图灵驭界，<br />一家 <em>AI 咨询公司</em></h1>
          <p>我们帮企业想清楚 AI 怎么用，并在营销、销售、运营提效等关键环节，把 AI 变成持续增长的能力。团队成员来自腾讯、字节等。</p>
          <div className="hero-actions"><a className="button dark" href="#contact">联系我们</a><a className="button outline" href="#cases">查看交付案例</a></div>
          <div className="mini-proof"><span><strong>AI 咨询</strong></span><span>AI 培训</span><span>AI 产品开发</span></div>
        </div>
        <div className="hero-visual" aria-label="Tellyn Agent 产品界面">
          <div className="hero-shot-wrap"><TeamHero /></div>
        </div>
      </section>

      <section className="section-shell intro" id="services">
        <div className="section-heading"><h2>从想清楚，<br />到 <em>真的增长</em>。</h2><p>从确定 AI 战略，到团队能力建设，再到产品上线，我们陪企业把每一个关键环节跑通。</p></div>
        <div className="service-grid">
          {services.map(([number, title, copy]) => <article className="service-card" key={number}><small>{number} · 服务</small><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="client-section section-shell" aria-labelledby="clients-title">
        <div className="client-label" id="clients-title"><i />服务客户</div>
        <div className="client-logos">{clients.map((client) => <div className="client-logo" key={client}>{client}</div>)}</div>
      </section>

      <section className="demos" id="cases"><div className="section-shell">
        <div className="section-heading"><h2>做过的项目，<br />经得起 <em>业务现场</em>。</h2><p>把客户的真实流程、业务语言和增长目标装进产品，给出可以被一线团队直接使用的结果。</p></div>
        <div className="case-grid">
          <article className="case-card"><div className="case-title"><span>跨境电商</span><b>FlyDirector 脚本智能体</b></div><p>输入产品信息，自动拆解钩子、卖点、口播和分镜。原来憋一天的脚本，现在一小时就能拿到 20 条能拍的。</p></article>
          <article className="case-card"><div className="case-title"><span>珠宝零售</span><b>企微话术智能体</b></div><p>接入企业微信，实时给导购递出下一句。把金牌销售的经验，变成每位新导购都用得上的标准动作。</p></article>
        </div>
      </div></section>

      <section className="section-shell tellyn-product" id="tellyn">
        <div className="tellyn-copy"><h2><em>Tellyn</em>，把线下现场<br />变成可用的业务数据。</h2><p>Tellyn 用 AI 辅助企业收集线下销售、产品和市场的真实反馈，完成数据整理与分析，为管理者提供更贴近业务现场的决策辅助。</p><div className="tellyn-list"><span>收集真实反馈</span><span>AI 数据分析</span><span>辅助业务决策</span></div><a className="button dark" href="#contact">了解 Tellyn</a></div>
        <div className="tellyn-flow" aria-label="Tellyn 从线下录音到各业务部门迭代更新的流程">
          <div className="flow-kicker">从真实现场，到业务迭代</div>
          <div className="flow-track">
            <article className="flow-stage"><span>01</span><h3>录音采集</h3><p>记录线下销售、产品与市场的真实反馈。</p></article>
            <article className="flow-stage insight"><span>02</span><h3>AI 洞察</h3><div className="insight-tags"><b>销售话术分析</b><b>产品评价</b><b>竞品评价</b><b>改进建议</b></div></article>
            <article className="flow-stage"><span>03</span><h3>迭代更新</h3><div className="team-tags"><b>产品部</b><b>市场部</b><b>销售部</b></div><p>把洞察变成下一轮行动。</p></article>
          </div>
        </div>
      </section>

      <section className="section-shell contact" id="contact"><div className="contact-copy"><h2>联系我们</h2><p>留下联系方式，1 个工作日内回复。第一次沟通完全免费，至少带走一份可以执行的 AI 增长思路。</p><a href="mailto:baolyang@tellynai.com">baolyang@tellynai.com</a></div>
        {submitted ? <div className="success"><b>收到！</b><p>我们会在 1 个工作日内联系你，坐等好消息。</p><button type="button" onClick={() => setSubmitted(false)}>再提交一份需求</button></div> : <form onSubmit={submit}><label>怎么称呼你？<input required name="name" value={form.name} onChange={update} placeholder="例如：王先生" /></label><label>公司 / 行业<input name="company" value={form.company} onChange={update} placeholder="例如：跨境电商" /></label><label>微信 / 手机号<input required name="contact" value={form.contact} onChange={update} placeholder="方便联系你的方式" /></label><label>你想通过 AI 解决什么问题？<textarea name="need" value={form.need} onChange={update} placeholder="例如：提高销售转化、梳理市场反馈" rows="3" /></label><button className="button yellow" type="submit">提交咨询</button></form>}
      </section>

      <footer><a className="brand" href="#top"><Mark /><span>图灵驭界</span><b>AI</b></a><span>© 2026 图灵驭界 · 企业 AI 咨询与产品开发</span><a href="mailto:baolyang@tellynai.com">baolyang@tellynai.com</a></footer>
    </main>
  )
}
