import { polyphonic } from "pinyin-pro";
import cnchar from "cnchar";
import radicalPlugin from "cnchar-radical";
import HanziWriter from "hanzi-writer";

cnchar.use(radicalPlugin);
const STORAGE_KEY = "moge-settings-v3";
const MAX_CHARACTERS = 300;
const LEGACY_GRADE1_UPPER_PRESET = "一二三上口目耳手日田禾火虫云山八十了子人大月儿头里可东西天四是女开水去来不小少牛果鸟早书刀尺本木";

// Textbook order cross-checked against the 12 volume 统编版语文写字表 index.
// Source: https://zitie.xueyuqu.com/elementary (pages /zg/0..11/dictations).
const textbookSources = {
  1: {
    label: "一",
    upper: "一二三上口耳目手日火田禾六七八十九王午下去年了子大人可叶东西竹马牙用几四小鸟是天女开关先云雨虫山水力男土木心尺本刀不少中五风立正工厂门卫月儿头里见在我左右和也又才爸妈比巴长公只个多石出来半你有牛羊果白地他足站坐川路学校班级姓名哥弟画花桌纸读书打棋积鱼鸭乌鸦字词句星期语文数写会菜瓜桥流柳雪夜色美蓝草原冰行车晚昨今明这秋气树黄片从飞江南采莲戏间北的家鸡步没参加说春青蛙夏着皮就冬反后内外对歌清绿桃红尖尘众双林森条金包作业笔宝贝课早升国旗们声起么向老师医院生船弯两看闪影前常黑狗它好朋友件做办到能爷奶叔姐妹尾谁短把伞兔最喝处找许法放进高点彩空问回答方久更爪旦拼音",
    lower: "春冬风雪花飞入姓什么双国王方青清气晴情请生字左右红时动万吃叫主江住没以多会走北京门广太阳校金秋因为他地河说也听哥单种居招呼快乐玩很当音讲行许思床前光低故乡色外看爸晚笑再午节叶米真分豆那到高兴千成间迷造运池欢网古凉细夕李语香打拍跑足声身体之相近习远玉义首采无树爱尖角亮机台放鱼朵美直呀边呢吗吧加文次找平办让包钟丁元共"
  },
  2: {
    label: "二",
    upper: "两就哪宽顶睛肚皮孩跳变极片傍海洋作坏给带法如脚它娃她毛更知识园孔桥群队旗铜号领巾杨壮桐枫松柏棉杉化桂歌丛深处六熊猫九朋友季吹肥农事忙归戴辛苦称柱底杆秤做岁站",
    lower: "诗童趁碧妆绿丝剪冲寻姑娘仔吐柳荡桃杏鲜邮递员原叔局堆认礼邓植格引注满休息锋昨冒留弯背洒温暖能桌味买具甘甜菜劳匹妹波纹像景恋舍求州华岛峡族谊齐奋贴街舟艾敬转团热闹贝壳甲骨钱币与财购烧茄烤鸭肉鸡蛋炒饭彩梦森拉结苹般精灵伞"
  },
  3: {
    label: "三",
    upper: "晨绒球汉艳服装扮静停孔雀粗落荒笛舞狂罚假互所够猜扬臂寒径斜霜赠刘盖菊残君橙送挑铺泥晶院墙印排列规则乱棕迟盒颜料票争仙闻勾紧洞油曲丰柴旧裙怜饿蜡烛伸忽板富颗奶旅咱偷救命拼",
    lower: "融燕鸳鸯惠崇芦芽梅溪泛减凑拂集聚形掠偶尔沾倦闲纤痕瓣止蹈蓬胀裂姿势仿佛随守株待宋耕触颈释其骄傲谦虚懦弱尘捧代价鹿塘映欣赏匀致配传哎狮叹旧符欲魂借酒何牧兄独异佳术伟录册保存约验阿欧洲社赵省县匠设计史创举且智慧历斗芬芳内醒寿苏强"
  },
  4: {
    label: "四",
    upper: "潮据堤阔笼罩盼滚顿逐渐犹崩震余淘牵鹅卵坑洼填庄稼俗跃葡萄稻熟豌按舒适恐僵硬枪耐探愉曾沟达蚊即科横竖绳系蝇证研究驾驶唤纪技改程超亿核奥益联质哲任善暮吟题侧峰庐缘降阁费须逊输虎操占嫩顺均叠隙茎柄萎瞧固宅临慎选择址良穴厅卧专卫较睁翻劈缓浊丈撑竭累血液奔",
    lower: "杂稀篱蜻蜓蝶宿徐疏茅檐翁赖剥构饰蹲凤序例率觅耸踏倘绘谐寄眠慰藉卜锐滩帐烁蝙蝠霸鹰怒吼脂拭餐"
  },
  5: {
    label: "五",
    upper: "宜鹤嫌朱嵌框匣哨恩韵亩播浇吩咐亭榨慕矮谈懂兰箩婆糕饼浸缠茶捡汛访鞋挽隔懒惰稳衡协召臣议缺宫献诺典抄罪怯拒荆冠俯喷枚箭筒束赤圈置侵略筑堡党丘妨蔽陷拐酬",
    lower: "昼耘桑晓蝴蚱嗡樱榆拔瞎铲锄割尾承拴瓢逛妒忌曹督委鲁遮疑惑擂呐插冈饥碟斤俺榜杖申兼勿拖悉坠膛截仞岳摩遗涕巫彭拟谋瑞损锻炼眷赴"
  },
  6: {
    label: "六",
    upper: "毯陈裳虹蹄腐稍微缀幽雅案拙薄糊蕾襟恍怨德鹊蝉律崖渡索寇副榴弹抡贯棋悬沸涧雹屹悦迈屈政府宾盏栏汇爆",
    lower: "醋饺摊拌筝眨宵燃戚贩彼贺轿骆驼腊粥腻咽匙搅稠肿熬褐缸脏筷侯章皎泣盈脉栖鸦惧凄寞宴霉籍聊乏控贷剔毙抵袭覆藏挪徘徊蒸裸媚砖蚁叨绊绞耽"
  }
};

function getTextbookPreset(grade = 1, semester = "upper") {
  const item = textbookSources[grade] || textbookSources[1];
  const chars = [...new Set([...item[semester]])].join("");
  return {
    label: item.label,
    name: `${item.label}年级${semester === "upper" ? "上" : "下"}册写字表`,
    summary: "统编版语文 · 按图片教材顺序",
    chars
  };
}

const metaRows = [
  "一|yī|一|一天 一心", "二|èr|二|二月 二人", "三|sān|一|三天 三个", "四|sì|囗|四季 四方", "五|wǔ|二|五月 五星", "六|liù|八|六一 六月", "七|qī|一|七天 七月", "八|bā|八|八方 八个", "九|jiǔ|丿|九月 九九", "十|shí|十|十足 十分",
  "日|rì|日|日出 日光", "月|yuè|月|月亮 月光", "山|shān|山|高山 山水", "水|shuǐ|水|河水 水田", "火|huǒ|火|火山 火光", "木|mù|木|树木 木头", "人|rén|人|人民 大人", "大|dà|大|大小 大山", "小|xiǎo|小|大小 小手", "上|shàng|一|上学 上下", "下|xià|一|下雨 上下", "天|tiān|大|天空 天地", "地|dì|土|大地 土地", "口|kǒu|口|人口 入口", "手|shǒu|手|小手 双手", "足|zú|足|手足 足球", "田|tián|田|田地 水田", "左|zuǒ|工|左右 左手", "右|yòu|口|左右 右手", "多|duō|夕|多少 许多", "少|shǎo|小|多少 少年", "中|zhōng|丨|中国 中间", "正|zhèng|止|正好 正直", "国|guó|囗|中国 祖国",
  "春|chūn|日|春天 春风", "夏|xià|夂|夏天 立夏", "秋|qiū|禾|秋天 秋风", "冬|dōng|夂|冬天 冬日", "风|fēng|风|风雨 大风", "雨|yǔ|雨|下雨 风雨", "花|huā|艹|花草 开花", "草|cǎo|艹|小草 草地", "树|shù|木|树木 大树", "学|xué|子|学习 学校", "校|xiào|木|学校 校园", "老|lǎo|老|老师 老人", "师|shī|巾|老师 师生", "同|tóng|口|同学 共同", "友|yǒu|又|朋友 友好", "读|dú|讠|读书 阅读", "写|xiě|冖|写字 书写", "画|huà|田|画画 图画", "唱|chàng|口|唱歌 合唱",
  "晨|chén|日|早晨 清晨", "晚|wǎn|日|晚上 早晚", "光|guāng|儿|光明 阳光", "明|míng|日|明亮 光明", "勇|yǒng|力|勇敢 勇气", "敢|gǎn|攵|勇敢 果敢", "诚|chéng|讠|诚实 真诚", "实|shí|宀|诚实 实在", "帮|bāng|巾|帮助 帮忙", "助|zhù|力|帮助 助力", "希|xī|巾|希望 希求", "望|wàng|月|希望 远望", "快|kuài|忄|快乐 飞快", "乐|lè|丿|快乐 乐园", "温|wēn|氵|温暖 温和", "暖|nuǎn|日|温暖 暖和", "观|guān|见|观察 观看", "察|chá|宀|观察 察看", "发|fā|又|发现 出发", "现|xiàn|王|发现 现在", "认|rèn|讠|认真 认识", "真|zhēn|十|认真 真心",
  "江|jiāng|氵|长江 江水", "河|hé|氵|河流 黄河", "湖|hú|氵|湖水 湖面", "海|hǎi|氵|大海 海洋", "森|sēn|木|森林 森严", "林|lín|木|森林 树林", "城|chéng|土|城市 长城", "市|shì|巾|城市 市区", "历|lì|厂|历史 经历", "史|shǐ|口|历史 史书", "文|wén|文|文化 中文", "化|huà|亻|文化 变化", "科|kē|禾|科学 学科", "知|zhī|矢|知识 知道", "识|shí|讠|知识 认识", "梦|mèng|木|梦想 梦中", "想|xiǎng|心|梦想 想法", "创|chuàng|刂|创造 创新", "劳|láo|力|劳动 功劳",
  "阅|yuè|门|阅读 阅览", "思|sī|心|思考 思想", "考|kǎo|老|思考 考试", "理|lǐ|王|理解 道理", "解|jiě|角|理解 解决", "表|biǎo|衣|表达 表面", "达|dá|辶|表达 到达", "坚|jiān|土|坚持 坚强", "持|chí|扌|坚持 保持", "责|zé|贝|责任 负责", "任|rèn|亻|责任 任务", "合|hé|口|合作 合力", "作|zuò|亻|合作 作业", "尊|zūn|寸|尊重 尊敬", "重|zhòng|里|尊重 重要", "智|zhì|日|智慧 智力", "慧|huì|心|智慧 聪慧", "践|jiàn|足|实践 践行", "探|tàn|扌|探索 探求", "索|suǒ|糸|探索 线索",
  "想|xiǎng|心|理想 想法", "信|xìn|亻|信念 相信", "念|niàn|心|信念 想念", "成|chéng|戈|成长 成功", "长|zhǎng|长|成长 长大", "独|dú|犭|独立 单独", "立|lì|立|独立 立正", "选|xuǎn|辶|选择 选手", "择|zé|扌|选择 择优", "担|dān|扌|担当 承担", "当|dāng|彐|担当 应当", "宽|kuān|宀|宽容 宽广", "容|róng|宀|宽容 内容", "感|gǎn|心|感恩 感动", "恩|ēn|心|感恩 恩情", "奋|fèn|大|奋斗 兴奋", "斗|dòu|斗|奋斗 战斗", "未|wèi|木|未来 未知", "来|lái|木|未来 来到", "青|qīng|青|青春 青年", "春|chūn|日|青春 春天"
];

const meta = Object.fromEntries(metaRows.map(row => {
  const [char, pinyin, radical] = row.split("|");
  return [char, { pinyin, radical }];
}));

const defaults = { grade: 1, semester: "upper", characters: getTextbookPreset().chars, grid: "tian", trace: 3, pinyin: true, orientation: "portrait" };
let state = loadState();
let toastTimer;
const strokeData = new Map();
const strokeLoads = new Map();

const els = {
  grades: document.querySelector("#grade-tabs"), characters: document.querySelector("#characters"), charCount: document.querySelector("#char-count"),
  charError: document.querySelector("#characters-error"), presetName: document.querySelector("#preset-name"), presetSummary: document.querySelector("#preset-summary"),
  presetCard: document.querySelector("#preset-card"), trace: document.querySelector("#trace-count"), traceOutput: document.querySelector("#trace-output"),
  pinyin: document.querySelector("#show-pinyin"), pages: document.querySelector("#pages"),
  pageCount: document.querySelector("#page-count"), reset: document.querySelector("#reset-button"), toast: document.querySelector("#toast"), printStyle: document.querySelector("#print-page-style"),
  semesterOptions: document.querySelector("#semester-options"), printButtons: [...document.querySelectorAll("[data-print]")]
};

function loadState() {
  try {
    const saved = { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    if (!textbookSources[saved.grade]) saved.grade = 1;
    if (!['upper', 'lower'].includes(saved.semester)) saved.semester = "upper";
    if (saved.grade === 1 && saved.semester === "upper" && saved.characters === LEGACY_GRADE1_UPPER_PRESET) {
      saved.characters = getTextbookPreset(1, "upper").chars;
    }
    return saved;
  }
  catch { return { ...defaults }; }
}

function uniqueHan(text) {
  return [...new Set((text.match(/[\u3400-\u9fff]/g) || []))].slice(0, MAX_CHARACTERS).join("");
}

function init() {
  els.grades.innerHTML = Object.entries(textbookSources).map(([key, item]) => `<button type="button" data-grade="${key}" aria-pressed="${Number(key) === state.grade}">${item.label}年级</button>`).join("");
  els.characters.value = state.characters;
  els.trace.value = state.trace;
  els.pinyin.checked = state.pinyin;
  document.querySelector(`input[name="grid"][value="${state.grid}"]`).checked = true;
  document.querySelector(`input[name="orientation"][value="${state.orientation}"]`).checked = true;
  document.querySelector(`input[name="semester"][value="${state.semester}"]`).checked = true;
  bindEvents();
  updatePreset();
  render();
}

function bindEvents() {
  els.grades.addEventListener("click", event => {
    const button = event.target.closest("button[data-grade]");
    if (!button) return;
    selectGrade(Number(button.dataset.grade));
  });
  els.presetCard.addEventListener("click", () => selectGrade(state.grade));
  els.semesterOptions.addEventListener("change", event => {
    state.semester = event.target.value;
    selectGrade(state.grade);
  });
  els.characters.addEventListener("input", () => {
    const cleaned = uniqueHan(els.characters.value);
    state.characters = cleaned;
    els.charError.textContent = els.characters.value && !cleaned ? "没有识别到汉字，请重新输入。" : "";
    render();
  });
  els.characters.addEventListener("blur", () => { els.characters.value = state.characters; });
  document.querySelector("#grid-options").addEventListener("change", event => { state.grid = event.target.value; render(); });
  els.trace.addEventListener("input", () => { state.trace = Number(els.trace.value); render(); });
  els.pinyin.addEventListener("change", () => { state.pinyin = els.pinyin.checked; render(); });
  document.querySelector("#orientation-options").addEventListener("change", event => { state.orientation = event.target.value; render(); });
  els.printButtons.forEach(button => button.addEventListener("click", printWorksheet));
  els.reset.addEventListener("click", resetSettings);
}

function selectGrade(grade) {
  state.grade = grade;
  const preset = getTextbookPreset(grade, state.semester);
  state.characters = preset.chars;
  els.characters.value = state.characters;
  [...els.grades.children].forEach(button => button.setAttribute("aria-pressed", Number(button.dataset.grade) === grade));
  updatePreset();
  render();
  showToast(`已载入${preset.name}`);
}

function updatePreset() {
  const item = getTextbookPreset(state.grade, state.semester);
  els.presetName.textContent = item.name;
  els.presetSummary.textContent = `${item.summary} · 共 ${[...item.chars].length} 字`;
  els.presetCard.querySelector(".preset-icon").textContent = item.chars[0];
}

function modelCell(char) {
  const data = strokeData.get(char);
  if (data && Array.isArray(data.strokes) && data.strokes.length) {
    const paths = data.strokes.map(path => `<path d="${path}" fill="#201d1a"/>`).join("");
    return `<div class="grid-cell stroke-cell model-cell ${state.grid}" title="${char} 范字"><svg viewBox="0 0 1024 1024" aria-hidden="true"><g transform="translate(0 900) scale(1 -1)">${paths}</g></svg></div>`;
  }
  return `<div class="grid-cell ${state.grid}"><span class="cell-char model">${char}</span></div>`;
}

function traceCell(char) {
  const data = strokeData.get(char);
  if (data && Array.isArray(data.strokes) && data.strokes.length) {
    const paths = data.strokes.map(path => `<path d="${path}" fill="#b8b8b8"/>`).join("");
    return `<div class="grid-cell stroke-cell trace-cell ${state.grid}" title="${char} 描红"><svg viewBox="0 0 1024 1024" aria-hidden="true"><g transform="translate(0 900) scale(1 -1)">${paths}</g></svg></div>`;
  }
  return `<div class="grid-cell ${state.grid}"><span class="cell-char trace">${char}</span></div>`;
}

function practiceRow(char, extraRows = 0) {
  const info = getCharacterInfo(char);
  const { columns, strokeTotal, traceSlots, totalRows: contentAndPracticeRows } = getRowLayout(char);
  const totalRows = contentAndPracticeRows + extraRows;
  const totalCells = columns * totalRows;
  const cells = [];
  cells.push(modelCell(char));
  cells.push(...strokeStepCells(char, strokeTotal));
  for (let i = 0; i < traceSlots; i++) cells.push(traceCell(char));
  while (cells.length < totalCells) cells.push(`<div class="grid-cell ${state.grid}"></div>`);
  const metaMarkup = state.pinyin
    ? `<div class="meta-item meta-pinyin"><b>拼音</b><strong>${info.pinyin || "&nbsp;"}</strong></div><div class="meta-item"><b>部首</b><strong>${info.radical}</strong><span>${info.struct} · 共${info.strokeCount}画</span></div>`
    : `<div class="meta-item meta-character"><b>汉字</b><strong>${char} · ${info.struct} · 共${info.strokeCount}画</strong></div>`;
  return `<article class="practice-row"><div class="char-meta">${metaMarkup}</div><div class="practice-grid" style="--grid-columns:${columns};--grid-rows:${totalRows}">${cells.join("")}</div></article>`;
}

function getRowLayout(char) {
  const columns = state.orientation === "portrait" ? 9 : 13;
  const strokeTotal = strokeData.get(char)?.strokes.length || 0;
  const traceSlots = state.trace;
  const contentRows = Math.max(1, Math.ceil((1 + strokeTotal + traceSlots) / columns));
  return { columns, strokeTotal, traceSlots, totalRows: contentRows + 1 };
}

function strokeStepCells(char, maxSteps) {
  const data = strokeData.get(char);
  if (!data) return [];
  const total = data.strokes.length;
  const stepCount = Math.min(maxSteps, total);
  const steps = [];
  for (let step = 1; step <= stepCount; step++) {
    const visibleCount = step;
    const paths = data.strokes.slice(0, visibleCount).map((path, index) =>
      `<path d="${path}" fill="${index === visibleCount - 1 ? "#7f7f7f" : "#b8b8b8"}"/>`
    ).join("");
    steps.push(`<div class="grid-cell stroke-cell ${state.grid}" title="第 ${visibleCount} 画"><svg viewBox="0 0 1024 1024" aria-hidden="true"><g transform="translate(0 900) scale(1 -1)">${paths}</g></svg><b>${visibleCount}</b></div>`);
  }
  return steps;
}

function loadStrokeData(char) {
  if (strokeData.has(char)) return Promise.resolve(strokeData.get(char));
  if (strokeLoads.has(char)) return strokeLoads.get(char);
  const request = HanziWriter.loadCharacterData(char)
    .then(data => { strokeData.set(char, data); return data; })
    .catch(() => { strokeData.set(char, null); return null; })
    .finally(() => strokeLoads.delete(char));
  strokeLoads.set(char, request);
  return request;
}

function prepareStrokeData(chars, rerender = true) {
  const missing = chars.filter(char => !strokeData.has(char));
  if (!missing.length) return Promise.resolve();
  return Promise.all(missing.map(loadStrokeData)).then(() => { if (rerender) render(false); });
}

function getCharacterInfo(char) {
  const radicalInfo = cnchar.radical(char)?.[0] || {};
  const generatedPinyin = [...new Set(polyphonic(char, { toneType: "symbol", type: "array" })[0] || [])].join(" / ");
  return {
    pinyin: generatedPinyin,
    radical: radicalInfo.radical || "—",
    radicalCount: radicalInfo.radicalCount ?? "—",
    struct: radicalInfo.struct || "结构待查",
    strokeCount: cnchar.stroke(char) || "—"
  };
}

function renderSheet(items, pageNumber, totalPages) {
  const orientationClass = state.orientation === "portrait" ? "portrait" : "landscape";
  return `<section class="sheet ${orientationClass}" aria-label="字帖第 ${pageNumber} 页" data-page-label="${pageNumber} / ${totalPages}">
    <div class="practice-list">${items.map(item => practiceRow(item.char, item.extraRows)).join("")}</div>
  </section>`;
}

function paginateCharacters(chars) {
  const capacity = state.orientation === "portrait" ? 12.95 : 8.95;
  const metaUnits = 0.46;
  const gapUnits = state.orientation === "portrait" ? 0.13 : 0.19;
  const pages = [];
  let items = [];
  let used = 0;

  const finishPage = () => {
    if (!items.length) return;
    const fillerRows = Math.max(0, Math.floor(capacity - used));
    items[items.length - 1].extraRows += fillerRows;
    pages.push(items);
    items = [];
    used = 0;
  };

  chars.forEach(char => {
    const rowUnits = getRowLayout(char).totalRows + metaUnits;
    const required = rowUnits + (items.length ? gapUnits : 0);
    if (items.length && used + required > capacity) finishPage();
    used += rowUnits + (items.length ? gapUnits : 0);
    items.push({ char, extraRows: 0 });
  });
  finishPage();
  return pages;
}

function render(loadStrokes = true) {
  const chars = [...uniqueHan(state.characters)];
  const pageGroups = paginateCharacters(chars);
  els.charCount.textContent = `${chars.length} / ${MAX_CHARACTERS}`;
  els.traceOutput.textContent = `${state.trace} 格`;
  els.printStyle.textContent = `@page { size: A4 ${state.orientation}; margin: 0; }`;
  els.pageCount.textContent = `${pageGroups.length || 0} 页 · ${state.orientation === "portrait" ? "纵向" : "横向"}`;
  els.pages.innerHTML = pageGroups.length
    ? pageGroups.map((group, index) => renderSheet(group, index + 1, pageGroups.length)).join("")
    : `<div class="empty-preview"><div><strong>还没有练习内容</strong><span>在左侧输入汉字，字帖会立即出现在这里。</span></div></div>`;
  persist();
  if (loadStrokes) prepareStrokeData(chars);
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function printWorksheet() {
  const chars = [...uniqueHan(state.characters)];
  if (!chars.length) {
    els.characters.focus();
    els.charError.textContent = "请先输入至少一个汉字，再生成 PDF。";
    return;
  }
  els.printButtons.forEach(button => { button.disabled = true; });
  showToast("正在准备可打印笔顺…");
  await prepareStrokeData(chars, false);
  render(false);
  els.printButtons.forEach(button => { button.disabled = false; });
  showToast("正在打开打印设置…");
  setTimeout(() => window.print(), 180);
}

function resetSettings() {
  state = { ...defaults };
  els.characters.value = state.characters;
  els.trace.value = state.trace;
  els.pinyin.checked = state.pinyin;
  document.querySelector(`input[name="grid"][value="${state.grid}"]`).checked = true;
  document.querySelector(`input[name="orientation"][value="${state.orientation}"]`).checked = true;
  document.querySelector(`input[name="semester"][value="${state.semester}"]`).checked = true;
  [...els.grades.children].forEach(button => button.setAttribute("aria-pressed", Number(button.dataset.grade) === state.grade));
  updatePreset();
  render();
  showToast("已恢复默认设置");
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}

init();
