const defaultMessage = `想给手机配个便携解码耳放，提升一下音质。
平时主要用安卓手机听歌，偶尔也用 iPhone。
手里有条带 4.4 平衡口的 IEM，想把这个平衡口用上。
预算大概一千块以内吧，性价比高一点。
主要听流行和人声，不太懂参数。`;

const fallbackCards = [
  {
    id: "L1-DG-010",
    layer: "产品卡",
    title: "GO link 2 Max 平衡口小尾巴",
    score: 0.94,
    summary: "客户有 4.4 平衡线 IEM、安卓用户、预算千元内。",
    action: "推荐 GO link 2 Max：双 ESS 双单声道 + 4.4mm 平衡口 241mW，Nexis App 支持 Android。",
  },
  {
    id: "L3-CMP-004",
    layer: "选购决策",
    title: "GO link 2 vs GO link 2 Max",
    score: 0.9,
    summary: "已有 4.4 平衡线，Max 的差价买双 DAC + 平衡口是全市场最便宜平衡入场券。",
    action: "直接推荐 Max，强调 £26 差价换平衡架构。",
  },
  {
    id: "L0-BRAND-001",
    layer: "品牌卡",
    title: "iFi audio 品牌总卡",
    score: 0.86,
    summary: "客户问牌子靠不靠谱：英国原厂设计、十四年专注音频、EISA/VGP 奖项背书。",
    action: "回应三点——英国原厂、专注音频品类、国际奖项；不贬低竞品。",
  },
];

const fallbackCoach = {
  reply:
    "李先生，您手上的 IEM 是 4.4 平衡口，这点是关键——同价位里 iFi 的 GO link 2 Max（£85）直接给到双 ESS 双单声道架构 + 4.4mm 平衡口 241mW，比普通单端小尾巴分离度和推力都更好，正好把您那条平衡线用上。您主要用安卓，Nexis App 的数字滤波和 OTA 升级都能用上，后面想微调音很方便，预算一千以内它基本到顶了。\n\n关于品牌您放心，iFi 是英国原厂设计、十四年专注发烧音频的品牌，拿过 EISA、VGP 这类国际奖项，模拟电路是它家强项。要是之后想上大耳或者要更强推力，GR 2 就是很自然的下一步。您先拿 Max 试听一下？",
  risks: [
    "这推力超大，什么耳机都能推得动",
    "iPhone 蓝牙也能听无损，随便连就行",
    "国产小尾巴都是智商税，别考虑",
  ],
  questions: [
    "您手上的 IEM 灵敏度高吗？高灵敏塞接大推力设备要留意底噪。",
    "除了安卓，iPhone 会经常用吗？这会影响蓝牙和 App 方案。",
    "后面有没有升级大耳或更高端耳机的打算？可以提前规划升级路径。",
  ],
};

const initialChatTurns = [
  { role: "customer", name: "李先生", time: "14:18", text: "想给手机配个便携解码耳放，提升一下音质，平时主要用安卓听歌。" },
  { role: "sales", name: "顾问", time: "14:19", text: "好的，您现在主要用什么耳机呢？" },
  { role: "customer", name: "李先生", time: "14:20", text: "手里有条 IEM，带 4.4 平衡线的，想把这个平衡口用上。" },
  { role: "sales", name: "顾问", time: "14:21", text: "明白了，预算大概在什么范围？我帮您配一下。" },
  { role: "customer", name: "李先生", time: "14:22", text: "预算一千块以内吧，性价比高一点，主要听流行和人声。" },
  { role: "sales", name: "顾问", time: "14:22", text: "还有别的偏好吗？比如无线还是有线、品牌方面？" },
  { role: "customer", name: "李先生", time: "14:23", text: "有线就行，蓝牙暂时不需要。iFi 这个牌子靠谱吗？" },
];
let chatTurns = initialChatTurns.map((turn) => ({ ...turn }));

const elements = {
  appShell: document.querySelector(".app-shell"),
  paneResizer: document.querySelector("#paneResizer"),
  messageInput: document.querySelector("#messageInput"),
  chatLog: document.querySelector("#chatLog"),
  evidenceList: document.querySelector("#evidenceList"),
  replyContext: document.querySelector("#replyContext"),
  customerProfile: document.querySelector("#customerProfile"),
  replyCard: document.querySelector("#replyCard"),
  touchpoints: document.querySelector("#touchpoints"),
  riskList: document.querySelector("#riskList"),
  questionList: document.querySelector("#questionList"),
  rawEditor: document.querySelector("#rawEditor"),
  toast: document.querySelector("#toast"),
  replyIdle: document.querySelector("#replyIdle"),
  replyLoading: document.querySelector("#replyLoading"),
  replyResult: document.querySelector("#replyResult"),
  composerInput: document.querySelector("#composerInput"),
  analysisState: document.querySelector("#analysisState"),
  dealProbValue: document.querySelector("#dealProbValue"),
};

const paneRatioStorageKey = "salesCoach.chatPaneRatio";
const defaultChatPaneRatio = 66.666;
const minChatPaneRatio = 45;
const maxChatPaneRatio = 75;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderChat(turns = chatTurns, options = {}) {
  const rows = turns
    .map((turn) => {
      const sales = turn.role === "sales";
      return `
        <div class="message-row ${sales ? "sales" : "customer"}">
          <div class="message">
            <div class="message-meta"><span>${escapeHtml(turn.name)}</span><span>${escapeHtml(turn.time)}</span></div>
            <div class="bubble">${escapeHtml(turn.text)}</div>
          </div>
        </div>
      `;
    })
    .join("");

  const trailing = options.customerTyping
    ? `
        <div class="message-row customer">
          <div class="typing-dots" aria-label="李先生正在输入">
            <span></span><span></span><span></span>
          </div>
        </div>`
    : "";

  elements.chatLog.innerHTML = rows + trailing;
  scrollChatToBottom();
}

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function scrollChatToBottom() {
  const scroller = elements.chatLog.closest(".chat-scroll");
  if (scroller) scroller.scrollTop = scroller.scrollHeight;
}

function autoSizeTextarea() {
  const el = elements.composerInput;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
}

function getChatMessage() {
  return chatTurns.map((t) => `${t.role === "sales" ? "销售" : "客户"}：${t.text}`).join("\n");
}

function getLastCustomerMessage() {
  for (let index = chatTurns.length - 1; index >= 0; index -= 1) {
    if (chatTurns[index].role === "customer") return chatTurns[index].text;
  }
  return "";
}

const customerReplies = [
  "那这个和我手上的 iPhone 能兼容吗？我偶尔也用苹果。",
  "推力够不够推我的 4.4 平衡口 IEM 呀？怕推不动。",
  "价格能再优惠一点吗？我预算就一千块。",
  "有现货吗？能不能先试听一下再决定？",
  "音色是偏暖还是偏冷？我主要听人声流行。",
  "质保多久呀？小尾巴会不会容易坏？",
  "安卓和苹果之间切换起来方便吗？",
  "那底噪呢？我听说小尾巴容易有电流声。",
];
let customerReplyIndex = 0;

function generateCustomerReply(salesText) {
  const s = salesText || "";
  if (/(价格|多少钱|£|优惠|便宜|预算)/.test(s)) {
    return "这个价格我能接受，不过还能再送点配件不？";
  }
  if (/(试听|现货|库存|有货)/.test(s)) {
    return "那我先去线下试听一下，合适再下单。";
  }
  if (/(iPhone|苹果|安卓)/.test(s)) {
    return "我两个手机换着用，方案能通用就最好了。";
  }
  if (/(推|推力|底噪|电流)/.test(s)) {
    return "我对底噪比较敏感，希望干净一点。";
  }
  if (/(音质|音色|听感|声音)/.test(s)) {
    return "我主要听流行和人声，中频舒服点就行。";
  }
  if (/[?？]|吗|呢/.test(s)) {
    return "嗯，你说得对，我主要就是图个方便和音质。";
  }
  const reply = customerReplies[customerReplyIndex % customerReplies.length];
  customerReplyIndex += 1;
  return reply;
}

async function simulateCustomerReply(salesText) {
  renderChat(chatTurns, { customerTyping: true });
  const history = chatTurns.map((t) => ({ role: t.role, name: t.name, text: t.text }));
  let reply;
  try {
    const data = await postJson("/customer-reply", { history });
    if (data && data.reply) {
      reply = data.reply;
    }
  } catch {
    /* network error → scripted fallback below */
  }
  if (!reply) reply = generateCustomerReply(salesText);
  chatTurns.push({ role: "customer", name: "李先生", time: nowTime(), text: reply });
  renderChat();
}

function sendMessage() {
  const text = elements.composerInput.value.trim();
  if (!text) {
    showToast("请输入要发送的消息");
    return;
  }
  chatTurns.push({ role: "sales", name: "顾问", time: nowTime(), text });
  elements.composerInput.value = "";
  autoSizeTextarea();
  renderChat();
  simulateCustomerReply(text);
}

function layerName(layer) {
  const map = {
    brand: "品牌",
    product: "产品",
    tech: "技术",
    decision: "决策",
    aftersales: "售后",
    script: "话术",
  };
  return map[layer] || layer;
}

function truncateText(value, maxLength = 52) {
  const text = String(value || "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function normalizeCards(payload) {
  const cards = payload?.context_cards || [];
  if (!cards.length) return fallbackCards;

  const layerOrder = ["brand", "product", "decision", "tech", "aftersales", "script"];
  const selected = [];
  for (const layer of layerOrder) {
    const hit = cards.find((card) => card.layer === layer);
    if (hit) selected.push(hit);
  }
  for (const card of cards) {
    if (selected.length >= 4) break;
    if (!selected.includes(card)) selected.push(card);
  }

  return selected.slice(0, 4).map((card, index) => ({
    id: card.id,
    layer: layerName(card.layer),
    title: truncateText(card.title || card.id, 34),
    relevance: index === 0 ? "高度相关" : "相关",
    summary: truncateText((card.guidance && card.guidance[0]) || (card.patterns && card.patterns[0]) || "命中客户当前表达中的关键信号。", 58),
    action: truncateText((card.guidance && card.guidance[1]) || card.output_hint || "结合当前客户语境使用。", 42),
    sourceUrl: card.source?.source_url || "",
    sourceLabel: card.source?.source_label || "",
  }));
}

function renderEvidence(cards) {
  elements.evidenceList.innerHTML = cards
    .map(
      (card, index) => `
        <article class="evidence-card">
          <div class="evidence-head">
            <span class="layer-label"><span class="layer-index">L${index + 1}</span>${escapeHtml(card.layer)}</span>
            <span class="confidence">${escapeHtml(card.relevance || "相关")}</span>
          </div>
          <h4>${escapeHtml(card.title)}</h4>
          <p>${escapeHtml(card.summary)} ${escapeHtml(card.action)}</p>
          ${card.sourceUrl ? `<a class="evidence-source" href="${escapeHtml(card.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(card.sourceLabel || "查看来源")}</a>` : ""}
        </article>
      `,
    )
    .join("");
}

function parseSuggestion(text) {
  if (text && typeof text === "object" && text.suggested_reply) {
    return {
      reply: text.suggested_reply,
      risks: Array.isArray(text.risks) ? text.risks : [],
      questions: Array.isArray(text.next_questions) ? text.next_questions : [],
      contextCards: text.context_cards || [],
      profile: text.profile || null,
    };
  }
  if (!text) return fallbackCoach;
  const reply = text.match(/推荐回复:\n([\s\S]*?)\n\n注意:/)?.[1]?.trim();
  const risks = text
    .match(/注意:\n([\s\S]*?)\n\n下一步:/)?.[1]
    ?.split("\n")
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);
  const questions = text
    .match(/下一步:\n([\s\S]*?)\n\n命中依据:/)?.[1]
    ?.split("\n")
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);

  return {
    reply: reply || fallbackCoach.reply,
    risks: risks?.length ? risks.slice(0, 3) : fallbackCoach.risks,
    questions: questions?.length ? questions.slice(0, 3) : fallbackCoach.questions,
    contextCards: [],
    profile: null,
  };
}

function sanitizeReply(text) {
  if (!text) return text;
  return String(text)
    .replace(/^客服应答要点[:：].*$/gm, "")
    .replace(/^客户问["“][^"”]*["”].*$/gm, "")
    .replace(/^答三点[—\-].*$/gm, "")
    .replace(/【[^】]*】/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function renderCoach(coach) {
  const lastCustomerMessage = getLastCustomerMessage();
  if (lastCustomerMessage) {
    elements.replyContext.innerHTML =
      `<span class="reply-context-label">客户最后一句</span>` +
      `<span class="reply-context-text">${escapeHtml(lastCustomerMessage)}</span>`;
    elements.replyContext.hidden = false;
  } else {
    elements.replyContext.hidden = true;
  }
  const profile = coach.profile;
  if (profile) {
    const type = profile.confirmed_type || profile.type_candidates?.[0]?.type || "需求探索型";
    const status = profile.customer_type_status === "confirmed" ? "已确认" : "待确认";
    const stage = profile.sales_stage || "信息探索";
    elements.customerProfile.textContent = `客户类型：${type}（${status}） · 当前阶段：${stage}`;
    elements.customerProfile.hidden = false;
  } else {
    elements.customerProfile.hidden = true;
  }
  elements.replyCard.textContent = sanitizeReply(coach.reply);
  elements.riskList.innerHTML = coach.risks.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  elements.questionList.innerHTML = coach.questions.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const tags = (coach.contextCards || []).slice(0, 3).map((card, index) => {
    const tones = ["green", "blue", "amber"];
    return `<span class="tag ${tones[index]}">${escapeHtml(card.title || card.id)}</span>`;
  });
  elements.touchpoints.innerHTML = `<span>关键依据：</span>${tags.join("") || '<span class="tag blue">当前对话</span>'}`;
  showReplyResult();
}

function showReplyResult() {
  elements.replyIdle.hidden = true;
  elements.replyLoading.hidden = true;
  elements.replyResult.hidden = false;
}

function showLoading() {
  elements.replyIdle.hidden = true;
  elements.replyResult.hidden = true;
  elements.replyLoading.hidden = false;
  elements.analysisState.innerHTML = '<span class="pulse-dot"></span>分析中';
}

function setDealScore(score) {
  const safeScore = Math.max(0, Math.min(100, score));
  if (elements.dealProbValue) elements.dealProbValue.textContent = `${safeScore}%`;
}

function clampPaneRatio(ratio) {
  return Math.max(minChatPaneRatio, Math.min(maxChatPaneRatio, ratio));
}

function setPaneRatio(ratio, persist = false) {
  const nextRatio = clampPaneRatio(ratio);
  elements.appShell.style.setProperty("--chat-pane-width", `${nextRatio}%`);
  elements.paneResizer.setAttribute("aria-valuenow", String(Math.round(nextRatio)));
  elements.paneResizer.setAttribute("aria-valuetext", `聊天窗口 ${Math.round(nextRatio)}%，分析模块 ${Math.round(100 - nextRatio)}%`);
  if (persist) {
    window.localStorage.setItem(paneRatioStorageKey, String(nextRatio));
  }
}

function getPointerRatio(event) {
  const rect = elements.appShell.getBoundingClientRect();
  return ((event.clientX - rect.left) / rect.width) * 100;
}

function setupPaneResizer() {
  const savedRatio = Number(window.localStorage.getItem(paneRatioStorageKey));
  setPaneRatio(Number.isFinite(savedRatio) ? savedRatio : defaultChatPaneRatio);

  elements.paneResizer.addEventListener("pointerdown", (event) => {
    if (window.matchMedia("(max-width: 1040px)").matches) return;
    elements.paneResizer.setPointerCapture(event.pointerId);
    document.body.classList.add("is-resizing");
    setPaneRatio(getPointerRatio(event), true);
  });

  elements.paneResizer.addEventListener("pointermove", (event) => {
    if (!elements.paneResizer.hasPointerCapture(event.pointerId)) return;
    setPaneRatio(getPointerRatio(event), true);
  });

  function stopResize(event) {
    if (elements.paneResizer.hasPointerCapture(event.pointerId)) {
      elements.paneResizer.releasePointerCapture(event.pointerId);
    }
    document.body.classList.remove("is-resizing");
  }

  elements.paneResizer.addEventListener("pointerup", stopResize);
  elements.paneResizer.addEventListener("pointercancel", stopResize);

  elements.paneResizer.addEventListener("keydown", (event) => {
    const current = Number(elements.paneResizer.getAttribute("aria-valuenow")) || defaultChatPaneRatio;
    const step = event.shiftKey ? 5 : 2;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPaneRatio(current - step, true);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPaneRatio(current + step, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      setPaneRatio(minChatPaneRatio, true);
    } else if (event.key === "End") {
      event.preventDefault();
      setPaneRatio(maxChatPaneRatio, true);
    } else if (event.key === "Enter") {
      event.preventDefault();
      setPaneRatio(defaultChatPaneRatio, true);
    }
  });
}

async function postJson(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`${path} ${response.status}`);
  return response.json();
}

async function analyze(messageOverride) {
  const message = (messageOverride && messageOverride.trim()) || getChatMessage().trim() || defaultMessage;
  const conversationHistory = chatTurns.map((turn) => ({ role: turn.role, text: turn.text }));
  showLoading();
    showToast("正在检索知识库与设备资料");
  try {
    const suggestion = await postJson("/suggest", { message, conversation_history: conversationHistory, limit: 4 });
    const recommendation = parseSuggestion(suggestion.recommendation || suggestion.suggestion);
    const cards = normalizeCards({ context_cards: recommendation.contextCards });
    renderEvidence(cards);
    renderCoach({ ...recommendation, contextCards: cards });
    setDealScore(cards.length >= 3 ? 78 : 72);
    elements.analysisState.innerHTML = '<span class="pulse-dot"></span>已检索知识库';
    showToast("已生成推荐话术");
  } catch (error) {
    renderEvidence(fallbackCards);
    renderCoach(fallbackCoach);
    setDealScore(72);
    elements.analysisState.innerHTML = '<span class="pulse-dot"></span>演示数据';
    showToast("使用内置演示数据");
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 1800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("已复制");
  } catch {
    showToast("复制失败，请手动复制");
  }
}

document.querySelector("#toggleRaw").addEventListener("click", () => {
  elements.rawEditor.hidden = !elements.rawEditor.hidden;
  document.querySelector("#toggleRaw").textContent = elements.rawEditor.hidden ? "编辑原文" : "收起原文";
});

function analyzeLatestConversation() {
  analyze(getChatMessage());
}

document.querySelector("#analyzeButton").addEventListener("click", analyzeLatestConversation);
document.querySelector("#generateButton").addEventListener("click", analyzeLatestConversation);
document.querySelector("#regenerateButton").addEventListener("click", analyzeLatestConversation);

document.querySelector("#resetButton").addEventListener("click", () => {
  chatTurns = initialChatTurns.map((t) => ({ ...t }));
  elements.messageInput.value = defaultMessage;
  renderChat();
  analyze();
});

document.querySelector("#useReply").addEventListener("click", () => {
  elements.composerInput.value = elements.replyCard.textContent;
  autoSizeTextarea();
  showToast("已填入输入框");
});

document.querySelector("#sendButton").addEventListener("click", sendMessage);
elements.composerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});
elements.composerInput.addEventListener("input", autoSizeTextarea);

document.querySelector("#copyReply").addEventListener("click", () => copyText(elements.replyCard.textContent));
document.querySelector("#copyAll").addEventListener("click", () => {
  const text = [
    "建议话术：",
    elements.replyCard.textContent,
    "",
    "追问建议：",
    ...Array.from(elements.questionList.querySelectorAll("li")).map((item) => item.textContent),
  ].join("\n");
  copyText(text);
});

function setupTabs() {
  const buttons = Array.from(document.querySelectorAll(".tab-button"));
  const panels = Array.from(document.querySelectorAll(".tab-panel"));
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach((p) => {
        p.classList.toggle("active", p.dataset.panel === target);
      });
    });
  });
}

renderChat();
renderEvidence(fallbackCards);
renderCoach(fallbackCoach);
setupPaneResizer();
setupTabs();
analyze();
