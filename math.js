// 墨格 - 小学生口算练习卡生成器
// 提供1-6年级数学专题、自定义四则运算、逆向填空、比大小、自动A4分页排版与参考答案生成

const STORAGE_KEY = "moge-math-settings-v1";

// 预设专题配置
const PRESETS = {
  1: {
    label: "一年级",
    subpresets: [
      { id: "g1_10_addsub", name: "10以内加减法", ops: ["+", "-"], max: 10, terms: 2, qType: "standard", carry: "any" },
      { id: "g1_20_nocarry", name: "20以内不进位不退位", ops: ["+", "-"], max: 20, terms: 2, qType: "standard", carry: "no-carry" },
      { id: "g1_20_carry_add", name: "20以内进位加(凑十法)", ops: ["+"], max: 20, terms: 2, qType: "standard", carry: "carry" },
      { id: "g1_20_borrow_sub", name: "20以内退位减(破十法)", ops: ["-"], max: 20, terms: 2, qType: "standard", carry: "carry" },
      { id: "g1_20_mix", name: "20以内加减混合(连加连减)", ops: ["+", "-"], max: 20, terms: 3, qType: "standard", carry: "any" },
      { id: "g1_blank", name: "20以内逆向填空( )+5=12", ops: ["+", "-"], max: 20, terms: 2, qType: "fill-blank", carry: "any" },
      { id: "g1_compare", name: "20以内比较大小○", ops: ["+", "-"], max: 20, terms: 2, qType: "compare-size", carry: "any" }
    ]
  },
  2: {
    label: "二年级",
    subpresets: [
      { id: "g2_100_addsub", name: "100以内两位数加减法", ops: ["+", "-"], max: 100, terms: 2, qType: "standard", carry: "any" },
      { id: "g2_100_carry", name: "100以内进退位加减法", ops: ["+", "-"], max: 100, terms: 2, qType: "standard", carry: "carry" },
      { id: "g2_mult_table", name: "九九表内乘法口诀", ops: ["*"], max: 81, terms: 2, qType: "standard", special: "table_mult" },
      { id: "g2_div_table", name: "表内除法(口诀求商)", ops: ["/"], max: 81, terms: 2, qType: "standard", special: "table_div" },
      { id: "g2_mix_multadd", name: "乘加乘减两步运算", ops: ["*", "+", "-"], max: 100, terms: 3, qType: "standard", special: "mult_add" },
      { id: "g2_fill_mult", name: "乘除法填未知数", ops: ["*", "/"], max: 81, terms: 2, qType: "fill-blank", special: "table_mult_div" }
    ]
  },
  3: {
    label: "三年级",
    subpresets: [
      { id: "g3_1000_addsub", name: "万/千以内笔算口算", ops: ["+", "-"], max: 1000, terms: 2, qType: "standard", carry: "any" },
      { id: "g3_mult_1digit", name: "两位/三位数乘一位数", ops: ["*"], max: 1000, terms: 2, qType: "standard", special: "mult_1digit" },
      { id: "g3_div_rem", name: "有余数除法专项", ops: ["/"], max: 100, terms: 2, qType: "standard", special: "div_remainder" },
      { id: "g3_div_exact", name: "除数是一位数的除法", ops: ["/"], max: 100, terms: 2, qType: "standard", special: "div_exact" },
      { id: "g3_mix_step2", name: "三年级综合两步计算", ops: ["+", "-", "*", "/"], max: 100, terms: 3, qType: "standard", carry: "any" }
    ]
  },
  4: {
    label: "四年级",
    subpresets: [
      { id: "g4_mix_paren", name: "四则运算(含小括号)", ops: ["+", "-", "*", "/"], max: 200, terms: 3, qType: "standard", special: "parenthesis" },
      { id: "g4_mult_2digit", name: "三位数乘两位数速算", ops: ["*"], max: 500, terms: 2, qType: "standard", special: "mult_2digit" },
      { id: "g4_decimal_addsub", name: "小数加减法(一位小数)", ops: ["+", "-"], max: 50, terms: 2, qType: "standard", special: "decimal_1" },
      { id: "g4_compare_mix", name: "混合运算比较大小", ops: ["+", "-", "*"], max: 100, terms: 2, qType: "compare-size", carry: "any" }
    ]
  },
  5: {
    label: "五六年级",
    subpresets: [
      { id: "g5_decimal_ops", name: "小数四则混合练习", ops: ["+", "-", "*"], max: 50, terms: 2, qType: "standard", special: "decimal_1" },
      { id: "g5_mix_hard", name: "高年级四则综合计算", ops: ["+", "-", "*", "/"], max: 500, terms: 3, qType: "standard", special: "parenthesis" },
      { id: "g5_fill_unknown", name: "逆向求未知数综合", ops: ["+", "-", "*", "/"], max: 200, terms: 2, qType: "fill-blank", carry: "any" }
    ]
  }
};

const DEFAULT_STATE = {
  grade: "1",
  subpresetId: "g1_20_carry_add",
  ops: ["+"],
  maxNumber: 20,
  termCount: 2,
  questionType: "standard",
  carryRule: "carry",
  allowRemainder: false,
  special: "",
  sheetTitle: "小学数学口算天天练",
  problemCount: 50,
  gridCols: 4,
  showNum: true,
  showAnswerSheet: true,
  orientation: "portrait"
};

let state = loadState();
let generatedProblems = [];
let toastTimer = null;

// DOM 元素引用
const els = {
  gradeTabs: document.querySelector("#grade-tabs"),
  subpresetContainer: document.querySelector("#subpreset-container"),
  customRuleBox: document.querySelector("#custom-rule-box"),
  opChips: document.querySelector("#op-chips"),
  maxNumber: document.querySelector("#max-number"),
  termCount: document.querySelector("#term-count"),
  questionType: document.querySelector("#question-type"),
  carryRule: document.querySelector("#carry-rule"),
  allowRemainder: document.querySelector("#allow-remainder"),
  sheetTitle: document.querySelector("#sheet-title"),
  problemCount: document.querySelector("#problem-count"),
  gridCols: document.querySelector("#grid-cols"),
  showNum: document.querySelector("#show-num"),
  showAnswerSheet: document.querySelector("#show-answer-sheet"),
  orientationOptions: document.querySelector("#orientation-options"),
  printStyle: document.querySelector("#print-page-style"),
  pages: document.querySelector("#pages"),
  sheetInfoBadge: document.querySelector("#sheet-info-badge"),
  toast: document.querySelector("#toast"),
  btnRefreshHead: document.querySelector("#btn-refresh-head"),
  btnRefresh: document.querySelector("#btn-refresh"),
  btnToolbarRefresh: document.querySelector("#btn-toolbar-refresh"),
  btnCopyText: document.querySelector("#btn-copy-text"),
  printButtons: [...document.querySelectorAll("[data-print]")]
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : { ...DEFAULT_STATE };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// 随机数与辅助函数
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 单题生成器
function generateSingleProblem() {
  const { ops, maxNumber, termCount, questionType, carryRule, allowRemainder, special } = state;

  // 特殊题型生成
  if (special === "table_mult") {
    const a = randInt(1, 9);
    const b = randInt(1, 9);
    return formatProblem([a, b], ["×"], a * b, questionType);
  }

  if (special === "table_div") {
    const b = randInt(1, 9);
    const a = randInt(1, 9);
    const c = a * b;
    return formatProblem([c, b], ["÷"], a, questionType);
  }

  if (special === "table_mult_div") {
    const isMult = Math.random() < 0.5;
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    if (isMult) {
      return formatProblem([a, b], ["×"], a * b, questionType);
    } else {
      return formatProblem([a * b, b], ["÷"], a, questionType);
    }
  }

  if (special === "mult_add") {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const op2 = Math.random() < 0.6 ? "+" : "-";
    const prod = a * b;
    const c = op2 === "+" ? randInt(1, 30) : randInt(1, Math.max(1, prod - 1));
    const ans = op2 === "+" ? prod + c : prod - c;
    return formatProblem([a, b, c], ["×", op2], ans, questionType);
  }

  if (special === "div_remainder") {
    const divisor = randInt(2, 9);
    const quotient = randInt(1, 9);
    const remainder = randInt(1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    return {
      raw: `${dividend} ÷ ${divisor} = ${quotient}……${remainder}`,
      expr: `${dividend} ÷ ${divisor} = `,
      answer: `${quotient}……${remainder}`,
      key: `${dividend}÷${divisor}`
    };
  }

  if (special === "div_exact") {
    const divisor = randInt(2, 9);
    const quotient = randInt(2, Math.floor(maxNumber / divisor));
    const dividend = divisor * quotient;
    return formatProblem([dividend, divisor], ["÷"], quotient, questionType);
  }

  if (special === "mult_1digit") {
    const a = randInt(11, 99);
    const b = randInt(2, 9);
    return formatProblem([a, b], ["×"], a * b, questionType);
  }

  if (special === "mult_2digit") {
    const a = randInt(11, 49);
    const b = randInt(11, 25);
    return formatProblem([a, b], ["×"], a * b, questionType);
  }

  if (special === "decimal_1") {
    const op = ops[randInt(0, ops.length - 1)] || "+";
    const a = (randInt(10, Math.min(maxNumber * 10, 400)) / 10).toFixed(1);
    const b = (randInt(10, Math.min(maxNumber * 10, 400)) / 10).toFixed(1);
    let valA = parseFloat(a);
    let valB = parseFloat(b);
    if (op === "-" && valA < valB) {
      [valA, valB] = [valB, valA];
    }
    const ans = op === "+" ? (valA + valB).toFixed(1) : (valA - valB).toFixed(1);
    const displayOp = op === "+" ? "+" : "−";
    return formatProblem([valA, valB], [displayOp], ans, questionType);
  }

  if (special === "parenthesis") {
    // (a + b) × c or (a - b) × c
    const isPlus = Math.random() < 0.6;
    const a = randInt(5, 30);
    const b = isPlus ? randInt(2, 20) : randInt(1, a - 1);
    const c = randInt(2, 6);
    const inner = isPlus ? a + b : a - b;
    const ans = inner * c;
    const exprText = `(${a} ${isPlus ? "+" : "−"} ${b}) × ${c}`;
    if (questionType === "compare-size") {
      const delta = randInt(-10, 10);
      const rightVal = Math.max(0, ans + delta);
      const symbol = ans > rightVal ? ">" : ans < rightVal ? "<" : "=";
      return {
        raw: `${exprText} ${symbol} ${rightVal}`,
        expr: `${exprText} <span class="circle-symbol"></span> ${rightVal}`,
        answer: symbol,
        key: exprText
      };
    }
    return {
      raw: `${exprText} = ${ans}`,
      expr: `${exprText} = `,
      answer: String(ans),
      key: exprText
    };
  }

  // 通用加减乘除生成
  const chosenOps = (ops && ops.length) ? ops : ["+"];
  if (termCount === 3) {
    // 3 数运算
    const op1 = chosenOps[randInt(0, chosenOps.length - 1)];
    const op2 = chosenOps[randInt(0, chosenOps.length - 1)];
    return generateThreeTerms(op1, op2, maxNumber, questionType);
  }

  // 2 数运算
  const op = chosenOps[randInt(0, chosenOps.length - 1)];
  return generateTwoTerms(op, maxNumber, carryRule, allowRemainder, questionType);
}

function generateTwoTerms(op, maxNum, carryRule, allowRemainder, questionType) {
  let a, b, ans, opSymbol;

  if (op === "+") {
    opSymbol = "+";
    let attempts = 0;
    do {
      attempts++;
      a = randInt(1, maxNum - 1);
      b = randInt(1, maxNum - a);
      if (carryRule === "carry") {
        // 必须进位
        if ((a % 10) + (b % 10) < 10) continue;
      } else if (carryRule === "no-carry") {
        // 必须不进位
        if ((a % 10) + (b % 10) >= 10) continue;
      }
      break;
    } while (attempts < 50);
    ans = a + b;
  } else if (op === "-") {
    opSymbol = "−";
    let attempts = 0;
    do {
      attempts++;
      a = randInt(2, maxNum);
      b = randInt(1, a); // 保证减法非负
      if (carryRule === "carry") {
        // 必须退位
        if ((a % 10) >= (b % 10)) continue;
      } else if (carryRule === "no-carry") {
        // 必须不退位
        if ((a % 10) < (b % 10)) continue;
      }
      break;
    } while (attempts < 50);
    ans = a - b;
  } else if (op === "*") {
    opSymbol = "×";
    const limit = Math.floor(Math.sqrt(maxNum)) + 2;
    a = randInt(2, limit);
    b = randInt(2, Math.floor(maxNum / a));
    ans = a * b;
  } else {
    // 除法
    opSymbol = "÷";
    b = randInt(2, Math.min(10, Math.floor(maxNum / 2)));
    if (!allowRemainder) {
      ans = randInt(1, Math.floor(maxNum / b));
      a = b * ans;
    } else {
      ans = randInt(1, Math.floor(maxNum / b));
      const rem = randInt(1, b - 1);
      a = b * ans + rem;
      return {
        raw: `${a} ÷ ${b} = ${ans}……${rem}`,
        expr: `${a} ÷ ${b} = `,
        answer: `${ans}……${rem}`,
        key: `${a}÷${b}`
      };
    }
  }

  return formatProblem([a, b], [opSymbol], ans, questionType);
}

function generateThreeTerms(op1, op2, maxNum, questionType) {
  let a, b, c, ans;
  const sym1 = op1 === "-" ? "−" : op1 === "*" ? "×" : op1 === "/" ? "÷" : "+";
  const sym2 = op2 === "-" ? "−" : op2 === "*" ? "×" : op2 === "/" ? "÷" : "+";

  // 为保证低年级非负数，采用连加连减加减混合保护
  let attempts = 0;
  do {
    attempts++;
    a = randInt(5, maxNum);
    b = randInt(1, Math.min(a, Math.floor(maxNum / 2)));
    const step1 = sym1 === "+" ? a + b : sym1 === "−" ? a - b : a * b;
    if (step1 < 0 || step1 > maxNum * 1.5) continue;

    c = randInt(1, Math.min(step1, Math.floor(maxNum / 2)));
    ans = sym2 === "+" ? step1 + c : sym2 === "−" ? step1 - c : step1 * c;
    if (ans >= 0 && ans <= maxNum * 2) {
      return formatProblem([a, b, c], [sym1, sym2], ans, questionType);
    }
  } while (attempts < 60);

  // fallback to simple 3 addition
  a = randInt(1, 10);
  b = randInt(1, 10);
  c = randInt(1, 10);
  return formatProblem([a, b, c], ["+", "+"], a + b + c, questionType);
}

function formatProblem(nums, ops, ans, questionType) {
  let exprDisplay = "";
  for (let i = 0; i < nums.length; i++) {
    exprDisplay += nums[i];
    if (i < ops.length) {
      exprDisplay += ` ${ops[i]} `;
    }
  }

  if (questionType === "fill-blank") {
    // 随机将第 1 个数或第 2 个数替换为括号填空
    const blankIdx = Math.random() < 0.5 ? 0 : 1;
    let blankExpr = "";
    for (let i = 0; i < nums.length; i++) {
      if (i === blankIdx) {
        blankExpr += `<span class="blank-symbol"></span>`;
      } else {
        blankExpr += nums[i];
      }
      if (i < ops.length) {
        blankExpr += ` ${ops[i]} `;
      }
    }
    blankExpr += ` = ${ans}`;
    return {
      raw: `${exprDisplay} = ${ans} (填: ${nums[blankIdx]})`,
      expr: blankExpr,
      answer: String(nums[blankIdx]),
      key: `blank_${exprDisplay}_${blankIdx}`
    };
  }

  if (questionType === "compare-size") {
    // 比较大小题：算式 ○ 目标数
    const deltaOptions = [-3, -2, -1, 0, 0, 1, 2, 3];
    const delta = deltaOptions[randInt(0, deltaOptions.length - 1)];
    const targetVal = Math.max(0, Number(ans) + delta);
    const compSymbol = Number(ans) > targetVal ? ">" : Number(ans) < targetVal ? "<" : "=";
    return {
      raw: `${exprDisplay} ${compSymbol} ${targetVal}`,
      expr: `${exprDisplay} <span class="circle-symbol"></span> ${targetVal}`,
      answer: compSymbol,
      key: `comp_${exprDisplay}_${targetVal}`
    };
  }

  // 标准算式
  return {
    raw: `${exprDisplay} = ${ans}`,
    expr: `${exprDisplay} = `,
    answer: String(ans),
    key: `std_${exprDisplay}`
  };
}

// 批量生成题单（去重 + 乱序）
function generateWorksheet() {
  const count = parseInt(state.problemCount, 10) || 50;
  const list = [];
  const seen = new Set();

  let maxAttempts = count * 6;
  let attempts = 0;

  while (list.length < count && attempts < maxAttempts) {
    attempts++;
    const prob = generateSingleProblem();
    if (!prob || seen.has(prob.key)) continue;
    seen.add(prob.key);
    list.push(prob);
  }

  // 如果去重后仍不够，补充无严格去重的题目
  while (list.length < count) {
    list.push(generateSingleProblem());
  }

  generatedProblems = list;
}

// 计算单页容量并分页
function paginateProblems(problems) {
  const { orientation, gridCols, showAnswerSheet } = state;
  const cols = parseInt(gridCols, 10) || 4;

  // 纵向 A4 (210x297mm) 与 横向 A4 (297x210mm) 的题目容纳计算
  // 首页含标题、激励语与姓名班级考务栏
  const page1Rows = orientation === "portrait" ? 14 : 9;
  const otherPageRows = orientation === "portrait" ? 19 : 13;

  const page1Cap = page1Rows * cols;
  const otherCap = otherPageRows * cols;

  const pages = [];
  let remaining = [...problems];

  // 第 1 页
  if (remaining.length <= page1Cap) {
    pages.push({
      pageNumber: 1,
      isFirstPage: true,
      items: remaining
    });
    remaining = [];
  } else {
    pages.push({
      pageNumber: 1,
      isFirstPage: true,
      items: remaining.slice(0, page1Cap)
    });
    remaining = remaining.slice(page1Cap);
  }

  // 后续练习页
  let pageIdx = 2;
  while (remaining.length > 0) {
    const chunk = remaining.slice(0, otherCap);
    pages.push({
      pageNumber: pageIdx++,
      isFirstPage: false,
      items: chunk
    });
    remaining = remaining.slice(otherCap);
  }

  const practicePageCount = pages.length;

  // 如果开启了参考答案页
  let answerPage = null;
  if (showAnswerSheet) {
    answerPage = {
      pageNumber: practicePageCount + 1,
      isAnswerKey: true,
      items: problems
    };
  }

  return { practicePages: pages, answerPage, totalPages: practicePageCount + (answerPage ? 1 : 0) };
}

// 渲染 A4 试卷 HTML
function renderSheet(pageData, totalPages) {
  const { pageNumber, isFirstPage, isAnswerKey, items } = pageData;
  const { orientation, gridCols, showNum, sheetTitle } = state;
  const orientationClass = orientation === "portrait" ? "portrait" : "landscape";

  if (isAnswerKey) {
    // 渲染参考答案页（紧凑 5 或 6 列排版）
    const ansCols = orientation === "portrait" ? 5 : 6;
    const answerItemsHtml = items.map((prob, idx) => `
      <div class="answer-item">
        <span class="answer-num">${idx + 1}.</span>
        <span class="answer-val">${prob.answer}</span>
      </div>
    `).join("");

    return `
      <section class="sheet math-sheet answer-key ${orientationClass}" aria-label="参考答案第 ${pageNumber} 页" data-page-label="${pageNumber} / ${totalPages}">
        <div class="math-sheet-header">
          <div class="math-header-top">
            <h2 class="math-sheet-title">${escapeHtml(sheetTitle)} · 参考答案</h2>
            <span class="answer-key-badge">家长/老师批改专用</span>
          </div>
          <p class="math-sheet-motto">参考答案与题目序号一一对应 · 建议核对后进行错题归纳</p>
        </div>
        <div class="math-problems-container">
          <div class="answer-grid" style="--ans-cols: ${ansCols}">
            ${answerItemsHtml}
          </div>
        </div>
        <div class="math-sheet-footer">
          <span>墨格教育 · 口算天天练</span>
          <span>第 ${pageNumber} 页 / 共 ${totalPages} 页</span>
        </div>
      </section>
    `;
  }

  // 练习题渲染
  // 计算题目全局序号起始值
  const prevItemsCount = (pageNumber === 1) ? 0 : (pageData.offsetIndex || 0);

  const problemsHtml = items.map((prob, idx) => {
    const globalIdx = prevItemsCount + idx + 1;
    const numHtml = showNum ? `<span class="problem-num">${globalIdx}.</span>` : "";
    const blankLine = prob.expr.endsWith("= ") ? `<span class="problem-blank-line"></span>` : "";
    return `
      <div class="math-problem">
        ${numHtml}
        <span class="problem-expr">${prob.expr}</span>
        ${blankLine}
      </div>
    `;
  }).join("");

  // 卷头信息栏
  const headerHtml = isFirstPage ? `
    <div class="math-sheet-header">
      <div class="math-header-top">
        <h2 class="math-sheet-title">${escapeHtml(sheetTitle)}</h2>
        <span class="math-sheet-tag">A4 口算练习单</span>
      </div>
      <p class="math-sheet-motto">认真审题 · 细心计算 · 书写工整 · 速度与准确兼备</p>
      <div class="math-sheet-info-bar">
        <span class="info-field">班级：<span class="info-line"></span></span>
        <span class="info-field">姓名：<span class="info-line"></span></span>
        <span class="info-field">日期：<span class="info-line"></span></span>
        <span class="info-field">用时：<span class="info-line"></span></span>
        <span class="info-field">得分：<span class="info-line wide"></span></span>
        <span class="info-field">评级：<span class="info-stars">☆☆☆☆☆</span></span>
      </div>
    </div>
  ` : `
    <div class="math-sheet-header" style="padding-bottom: 4px; margin-bottom: 10px;">
      <div class="math-header-top">
        <strong style="font-size: 13px; color: #444;">${escapeHtml(sheetTitle)} (续)</strong>
        <span class="info-field" style="font-size: 11px;">姓名：<span class="info-line" style="min-width: 50px;"></span></span>
      </div>
    </div>
  `;

  return `
    <section class="sheet math-sheet ${orientationClass}" aria-label="口算练习单第 ${pageNumber} 页" data-page-label="${pageNumber} / ${totalPages}">
      ${headerHtml}
      <div class="math-problems-container">
        <div class="math-grid" style="--math-cols: ${gridCols}">
          ${problemsHtml}
        </div>
      </div>
      <div class="math-sheet-footer">
        <span>持之以恒，每天进步一点点！</span>
        <span>第 ${pageNumber} 页 / 共 ${totalPages} 页</span>
      </div>
    </section>
  `;
}

// 主渲染流程
function render() {
  if (!generatedProblems.length) {
    generateWorksheet();
  }

  const { practicePages, answerPage, totalPages } = paginateProblems(generatedProblems);

  // 标注入练习页的全局偏移序号
  let currentOffset = 0;
  practicePages.forEach(p => {
    p.offsetIndex = currentOffset;
    currentOffset += p.items.length;
  });

  const allPagesToRender = [...practicePages];
  if (answerPage) {
    allPagesToRender.push(answerPage);
  }

  els.printStyle.textContent = `@page { size: A4 ${state.orientation}; margin: 0; }`;
  els.sheetInfoBadge.textContent = `共 ${generatedProblems.length} 题 · ${totalPages} 页 · ${state.orientation === "portrait" ? "纵向" : "横向"}`;

  els.pages.innerHTML = allPagesToRender.map(p => renderSheet(p, totalPages)).join("");
  persistState();
}

// 更新专项预设按钮列表
function updateSubpresetButtons() {
  const currentGrade = state.grade;
  const presetData = PRESETS[currentGrade];

  if (!presetData) {
    els.subpresetContainer.innerHTML = `<span style="font-size: 12px; color: var(--ink-soft);">自由配置下方所有运算类型与数值条件</span>`;
    els.customRuleBox.style.display = "block";
    return;
  }

  els.subpresetContainer.innerHTML = presetData.subpresets.map(sp => `
    <button type="button" class="math-preset-btn ${sp.id === state.subpresetId ? "active" : ""}" data-subpreset="${sp.id}">
      ${sp.name}
    </button>
  `).join("");

  // 根据预设控制自定义折叠
  els.customRuleBox.style.display = "block";
}

// 应用特定子预设
function applySubpreset(subpresetId) {
  const gradeData = PRESETS[state.grade];
  if (!gradeData) return;
  const found = gradeData.subpresets.find(sp => sp.id === subpresetId);
  if (!found) return;

  state.subpresetId = found.id;
  state.ops = [...found.ops];
  state.maxNumber = found.max;
  state.termCount = found.terms;
  state.questionType = found.qType || "standard";
  state.carryRule = found.carry || "any";
  state.special = found.special || "";

  syncControlsWithState();
  generateWorksheet();
  render();
  showToast(`已应用：${found.name}`);
}

// 将当前 state 同步到 UI 控件
function syncControlsWithState() {
  // 年级
  [...els.gradeTabs.children].forEach(btn => {
    btn.setAttribute("aria-pressed", btn.dataset.grade === String(state.grade));
  });

  // 操作符复选框
  const opCheckboxes = els.opChips.querySelectorAll("input[type='checkbox']");
  opCheckboxes.forEach(cb => {
    cb.checked = state.ops.includes(cb.value);
  });

  // 基础下拉框
  els.maxNumber.value = String(state.maxNumber);
  els.termCount.value = String(state.termCount);
  els.questionType.value = state.questionType;
  els.carryRule.value = state.carryRule;
  els.allowRemainder.checked = Boolean(state.allowRemainder);

  // 卷面
  els.sheetTitle.value = state.sheetTitle;
  els.problemCount.value = String(state.problemCount);
  els.gridCols.value = String(state.gridCols);
  els.showNum.checked = Boolean(state.showNum);
  els.showAnswerSheet.checked = Boolean(state.showAnswerSheet);

  // 方向
  const radio = document.querySelector(`input[name="orientation"][value="${state.orientation}"]`);
  if (radio) radio.checked = true;

  updateSubpresetButtons();
}

// 打印 / 导出 PDF
function printWorksheet() {
  els.printButtons.forEach(btn => { btn.disabled = true; });
  showToast("正在准备 A4 试卷打印…");

  render();

  setTimeout(() => {
    window.print();
    els.printButtons.forEach(btn => { btn.disabled = false; });
  }, 220);
}

// 复制纯文本题目
function copyPlainText() {
  if (!generatedProblems.length) return;
  const lines = [
    `【${state.sheetTitle}】`,
    `班级：_______ 姓名：_______ 得分：_______`,
    `----------------------------------------`
  ];

  generatedProblems.forEach((prob, i) => {
    const num = state.showNum ? `${i + 1}. ` : "";
    lines.push(`${num}${prob.raw.split("=")[0]}= `);
  });

  if (state.showAnswerSheet) {
    lines.push(`\n【参考答案】`);
    generatedProblems.forEach((prob, i) => {
      lines.push(`${i + 1}. ${prob.answer}`);
    });
  }

  navigator.clipboard.writeText(lines.join("\n")).then(() => {
    showToast("✓ 题目已复制到剪贴板，可粘贴到微信或文档！");
  }).catch(() => {
    showToast("复制失败，请手动选择复制。");
  });
}

function showToast(msg) {
  clearTimeout(toastTimer);
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2800);
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;"
  }[tag] || tag));
}

// 绑定交互事件
function initEvents() {
  // 年级切换
  els.gradeTabs.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const grade = btn.dataset.grade;
    state.grade = grade;
    if (PRESETS[grade]) {
      // 默认选中该年级第一个专题
      applySubpreset(PRESETS[grade].subpresets[0].id);
    } else {
      state.subpresetId = "";
      state.special = "";
      syncControlsWithState();
      generateWorksheet();
      render();
    }
  });

  // 专项子预设点击
  els.subpresetContainer.addEventListener("click", e => {
    const btn = e.target.closest(".math-preset-btn");
    if (!btn) return;
    applySubpreset(btn.dataset.subpreset);
  });

  // 运算符勾选
  els.opChips.addEventListener("change", () => {
    const checked = [...els.opChips.querySelectorAll("input:checked")].map(i => i.value);
    if (!checked.length) {
      showToast("请至少选择一种运算符号");
      els.opChips.querySelector("input[value='+']").checked = true;
      state.ops = ["+"];
    } else {
      state.ops = checked;
    }
    state.special = ""; // 用户自定义修改了运算
    state.subpresetId = "";
    updateSubpresetButtons();
    generateWorksheet();
    render();
  });

  // 下拉与开关更新
  const handleConfigChange = () => {
    state.maxNumber = parseInt(els.maxNumber.value, 10);
    state.termCount = parseInt(els.termCount.value, 10);
    state.questionType = els.questionType.value;
    state.carryRule = els.carryRule.value;
    state.allowRemainder = els.allowRemainder.checked;
    state.sheetTitle = els.sheetTitle.value.trim() || "小学数学口算天天练";
    state.problemCount = parseInt(els.problemCount.value, 10);
    state.gridCols = parseInt(els.gridCols.value, 10);
    state.showNum = els.showNum.checked;
    state.showAnswerSheet = els.showAnswerSheet.checked;

    state.special = "";
    state.subpresetId = "";
    updateSubpresetButtons();
    generateWorksheet();
    render();
  };

  els.maxNumber.addEventListener("change", handleConfigChange);
  els.termCount.addEventListener("change", handleConfigChange);
  els.questionType.addEventListener("change", handleConfigChange);
  els.carryRule.addEventListener("change", handleConfigChange);
  els.allowRemainder.addEventListener("change", handleConfigChange);

  els.sheetTitle.addEventListener("input", () => {
    state.sheetTitle = els.sheetTitle.value.trim() || "小学数学口算天天练";
    render();
  });

  els.problemCount.addEventListener("change", () => {
    state.problemCount = parseInt(els.problemCount.value, 10);
    generateWorksheet();
    render();
  });

  els.gridCols.addEventListener("change", () => {
    state.gridCols = parseInt(els.gridCols.value, 10);
    render();
  });

  els.showNum.addEventListener("change", () => {
    state.showNum = els.showNum.checked;
    render();
  });

  els.showAnswerSheet.addEventListener("change", () => {
    state.showAnswerSheet = els.showAnswerSheet.checked;
    render();
  });

  // 纸张方向
  els.orientationOptions.addEventListener("change", e => {
    const val = e.target.value;
    if (val) {
      state.orientation = val;
      render();
    }
  });

  // 换一批题目
  const refreshAll = () => {
    generateWorksheet();
    render();
    showToast("已重新随机生成一套新题目！");
  };

  els.btnRefreshHead?.addEventListener("click", refreshAll);
  els.btnRefresh?.addEventListener("click", refreshAll);
  els.btnToolbarRefresh?.addEventListener("click", refreshAll);

  // 复制文本
  els.btnCopyText?.addEventListener("click", copyPlainText);

  // 打印按钮
  els.printButtons.forEach(btn => {
    btn.addEventListener("click", printWorksheet);
  });
}

function init() {
  syncControlsWithState();
  initEvents();
  generateWorksheet();
  render();
}

init();
