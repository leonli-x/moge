import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css               */const C={shm:{id:"shm",name:"声母表",count:23,desc:"23个声母（b p m f d t n l ɡ k h j q x zh ch sh r z c s y w）",items:["b","p","m","f","d","t","n","l","ɡ","k","h","j","q","x","zh","ch","sh","r","z","c","s","y","w"]},dym:{id:"dym",name:"单韵母",count:6,desc:"6个单韵母（ɑ o e i u ü）",items:["ɑ","o","e","i","u","ü"]},fym:{id:"fym",name:"复韵母",count:9,desc:"9个复韵母（ɑi ei ui ɑo ou iu ie üe er）",items:["ɑi","ei","ui","ɑo","ou","iu","ie","üe","er"]},qbm:{id:"qbm",name:"前鼻韵母",count:5,desc:"5个前鼻韵母（ɑn en in un ün）",items:["ɑn","en","in","un","ün"]},hbm:{id:"hbm",name:"后鼻韵母",count:4,desc:"4个后鼻韵母（ɑnɡ enɡ inɡ onɡ）",items:["ɑnɡ","enɡ","inɡ","onɡ"]},ztr:{id:"ztr",name:"整体认读音节",count:16,desc:"16个整体认读音节（zhi chi shi ri zi ci si yi wu yu ye yue yuɑn yin yun yinɡ）",items:["zhi","chi","shi","ri","zi","ci","si","yi","wu","yu","ye","yue","yuɑn","yin","yun","yinɡ"]},all:{id:"all",name:"全部拼音总表",count:63,desc:"声母、韵母、整体认读音节全套总表（共63个）",items:[]},custom:{id:"custom",name:"自定义拼音",count:0,desc:"自由输入拼音字母、词语或带调音节练习",items:[]}};C.all.items=[...C.shm.items,...C.dym.items,...C.fym.items,...C.qbm.items,...C.hbm.items,...C.ztr.items];const E={ā:{base:"ɑ",tone:1},á:{base:"ɑ",tone:2},ǎ:{base:"ɑ",tone:3},à:{base:"ɑ",tone:4},ō:{base:"o",tone:1},ó:{base:"o",tone:2},ǒ:{base:"o",tone:3},ò:{base:"o",tone:4},ē:{base:"e",tone:1},é:{base:"e",tone:2},ě:{base:"e",tone:3},è:{base:"e",tone:4},ī:{base:"i",tone:1},í:{base:"i",tone:2},ǐ:{base:"i",tone:3},ì:{base:"i",tone:4},ū:{base:"u",tone:1},ú:{base:"u",tone:2},ǔ:{base:"u",tone:3},ù:{base:"u",tone:4},ǖ:{base:"ü",tone:1},ǘ:{base:"ü",tone:2},ǚ:{base:"ü",tone:3},ǜ:{base:"ü",tone:4}};function B(n){return n?n.replace(/a/g,"ɑ").replace(/g/g,"ɡ").replace(/v/g,"ü").trim():""}const $={ɑ:{width:20,strokes:[{d:"M 4.5 36 C 2 32.5 -7 32.5 -9 36.5 C -11.5 41 -11.5 47 -9 51.5 C -6.5 55.5 2 55.5 4.5 52",badge:{x:-3,y:28,text:"①"}},{d:"M 4.5 33 L 4.5 52 C 4.5 54.5 6.5 55.5 9 55.5",badge:{x:10,y:33,text:"②"}}]},b:{width:20,strokes:[{d:"M -7.5 19 L -7.5 55",badge:{x:-14,y:19,text:"①"}},{d:"M -7.5 35 C -5.5 32.5 4.5 32.5 7.5 36.5 C 11 41 11 47 7.5 51.5 C 4.5 55.5 -5.5 55.5 -7.5 53",badge:{x:5,y:28,text:"②"}}]},c:{width:19,strokes:[{d:"M 6.5 36 C 3.5 32.5 -5.5 32.5 -8.5 36.5 C -11.5 41 -11.5 47 -8.5 51.5 C -5.5 55.5 3.5 55.5 6.5 52",badge:{x:1,y:28,text:"①"}}]},d:{width:20,strokes:[{d:"M 7.5 36 C 5.5 32.5 -4.5 32.5 -7.5 36.5 C -11 41 -11 47 -7.5 51.5 C -4.5 55.5 5.5 55.5 7.5 52",badge:{x:-1,y:28,text:"①"}},{d:"M 7.5 19 L 7.5 55",badge:{x:14,y:19,text:"②"}}]},e:{width:19,strokes:[{d:"M -8 44 L 7.5 44 C 7.5 35 -4 32.5 -7.5 36.5 C -11 41 -11 47 -7.5 51.5 C -4.5 55.5 5 55.5 7.5 52",badge:{x:-14,y:44,text:"①"}}]},f:{width:16,strokes:[{d:"M 5 20 C 2 18 -3 18 -3 24 L -3 55",badge:{x:9,y:19,text:"①"}},{d:"M -8 33 L 4 33",badge:{x:-13,y:33,text:"②"}}]},ɡ:{width:20,strokes:[{d:"M 6.5 36 C 4.5 32.5 -4.5 32.5 -7.5 36.5 C -11 41 -11 47 -7.5 51.5 C -4.5 55.5 4.5 55.5 6.5 52",badge:{x:-1,y:28,text:"①"}},{d:"M 6.5 33 L 6.5 62 C 6.5 67 -2 67.5 -6 64",badge:{x:13,y:33,text:"②"}}]},h:{width:20,strokes:[{d:"M -7.5 19 L -7.5 55",badge:{x:-14,y:19,text:"①"}},{d:"M -7.5 38 C -5 33 4 32.5 6.5 36.5 L 6.5 55",badge:{x:3,y:28,text:"②"}}]},i:{width:12,strokes:[{d:"M 0 34 L 0 55",badge:{x:-6,y:35,text:"①"}},{d:"M -0.1 23.5 A 2 2 0 1 1 0.1 23.5 Z",isDot:!0,badge:{x:6,y:24,text:"②"}}]},j:{width:14,strokes:[{d:"M 2.5 34 L 2.5 62 C 2.5 67 -3.5 67.5 -6.5 64",badge:{x:-4,y:35,text:"①"}},{d:"M 2.4 23.5 A 2 2 0 1 1 2.6 23.5 Z",isDot:!0,badge:{x:9,y:24,text:"②"}}]},k:{width:20,strokes:[{d:"M -6.5 19 L -6.5 55",badge:{x:-13,y:19,text:"①"}},{d:"M 6.5 35 L -4.5 45 L 7.5 55",badge:{x:13,y:35,text:"②"}}]},l:{width:10,strokes:[{d:"M 0 19 L 0 55",badge:{x:-6,y:19,text:"①"}}]},m:{width:28,strokes:[{d:"M -11 34 L -11 55",badge:{x:-17,y:34,text:"①"}},{d:"M -11 38 C -9 33 -2 32.5 0 36.5 L 0 55",badge:{x:-3,y:28,text:"②"}},{d:"M 0 38 C 2.5 33 9 32.5 11 36.5 L 11 55",badge:{x:9,y:28,text:"③"}}]},n:{width:20,strokes:[{d:"M -7.5 34 L -7.5 55",badge:{x:-14,y:34,text:"①"}},{d:"M -7.5 38 C -5 33 4 32.5 6.5 36.5 L 6.5 55",badge:{x:3,y:28,text:"②"}}]},o:{width:20,strokes:[{d:"M 0 33 C -6.5 33 -10.5 37.5 -10.5 44 C -10.5 50.5 -6.5 55.5 0 55.5 C 6.5 55.5 10.5 50.5 10.5 44 C 10.5 37.5 5.5 33 1.2 33.2",badge:{x:-4,y:28,text:"①"}}]},p:{width:20,strokes:[{d:"M -7.5 33 L -7.5 65",badge:{x:-14,y:34,text:"①"}},{d:"M -7.5 35 C -5.5 32.5 4.5 32.5 7.5 36.5 C 11 41 11 47 7.5 51.5 C 4.5 55.5 -5.5 55.5 -7.5 53",badge:{x:5,y:28,text:"②"}}]},q:{width:20,strokes:[{d:"M 7.5 36 C 5.5 32.5 -4.5 32.5 -7.5 36.5 C -11 41 -11 47 -7.5 51.5 C -4.5 55.5 5.5 55.5 7.5 52",badge:{x:-1,y:28,text:"①"}},{d:"M 7.5 33 L 7.5 65",badge:{x:14,y:34,text:"②"}}]},r:{width:17,strokes:[{d:"M -5.5 34 L -5.5 55",badge:{x:-11,y:34,text:"①"}},{d:"M -5.5 39 C -2 33.5 4 33 7 35",badge:{x:4,y:28,text:"②"}}]},s:{width:18,strokes:[{d:"M 6 37 C 4 33 -3 33 -5 36.5 C -6.5 39.5 -4 42.5 0 44 C 5.5 46 7.5 48.5 6 52 C 4 55.5 -4.5 55.5 -6.5 52",badge:{x:7,y:30,text:"①"}}]},t:{width:16,strokes:[{d:"M -1 20 L -1 51.5 C -1 54.5 2 55.5 5.5 55.5",badge:{x:-7,y:20,text:"①"}},{d:"M -6.5 33 L 5.5 33",badge:{x:-12,y:33,text:"②"}}]},u:{width:19,strokes:[{d:"M -6.5 34 L -6.5 51.5 C -6.5 55.5 3 55.5 5.5 51.5 L 5.5 34",badge:{x:-13,y:34,text:"①"}},{d:"M 5.5 34 L 5.5 55",badge:{x:11,y:34,text:"②"}}]},ü:{width:19,strokes:[{d:"M -6.5 34 L -6.5 51.5 C -6.5 55.5 3 55.5 5.5 51.5 L 5.5 34",badge:{x:-13,y:34,text:"①"}},{d:"M 5.5 34 L 5.5 55",badge:{x:11,y:34,text:"②"}},{d:"M -4.6 23.5 A 1.8 1.8 0 1 1 -4.4 23.5 Z",isDot:!0,badge:{x:-5,y:18,text:"③"}},{d:"M 4.4 23.5 A 1.8 1.8 0 1 1 4.6 23.5 Z",isDot:!0,badge:{x:5,y:18,text:"④"}}]},w:{width:25,strokes:[{d:"M -10 34 L -5 55 L 0 36",badge:{x:-15,y:34,text:"①"}},{d:"M 0 36 L 5 55 L 10 34",badge:{x:3,y:29,text:"②"}}]},x:{width:19,strokes:[{d:"M -7 34 L 7 55",badge:{x:-13,y:34,text:"①"}},{d:"M 7 34 L -7 55",badge:{x:13,y:34,text:"②"}}]},y:{width:19,strokes:[{d:"M -7 34 L 0 47",badge:{x:-13,y:34,text:"①"}},{d:"M 7 34 L -7 65",badge:{x:13,y:34,text:"②"}}]},z:{width:18,strokes:[{d:"M -7.5 34.5 L 7.5 34.5 L -7.5 54.5 L 7.5 54.5",badge:{x:-13,y:34.5,text:"①"}}]}};function I(n){let i=(n||"").toLowerCase().trim();return i=i.replace(/ɑ/g,"a").replace(/ɡ/g,"g").replace(/ü/g,"v"),i=i.normalize("NFD").replace(/[\u0300-\u036f]/g,""),/^[a-z]+$/.test(i)?i:""}const T={1:"M -4 23 L 4 23",2:"M -4 25.5 L 3.5 20.5",3:"M -4 21.5 L 0 25.5 L 4 21.5",4:"M -3.5 20.5 L 4 25.5"},t={category:"shm",customText:`ɑ o e i u ü
b p m f d t n l
ɡ k h j q x
zh ch sh r z c s
y w`,conciseMode:!0,showStrokeOrder:!1,traceCount:3,gridColor:"red",lineStyle:"dashed-middle",orientation:"portrait"},S={red:{outer:"#e06a68",inner:"#f09695",bg:"#fffbfb",trace:"#c6ccd2"},blue:{outer:"#3b82f6",inner:"#93c5fd",bg:"#f8faff",trace:"#c6ccd2"},gray:{outer:"#6b7280",inner:"#9ca3af",bg:"#ffffff",trace:"#c6ccd2"}};function z(n){const i=B(n),c=[];for(const d of i)E[d]?c.push({char:E[d].base,tone:E[d].tone}):$[d]&&c.push({char:d,tone:0});return c}function A({item:n,isFirstCell:i=!1,isTrace:c=!1,hasBiShunImage:d=!1,gridColor:x="red",lineStyle:y="dashed-middle"}){const r=S[x]||S.red,b=y==="dashed-middle"||y==="dashed"?'stroke-dasharray="3,2.2"':"";let o=`
    <!-- 四线三格 -->
    <line x1="0" y1="16" x2="80" y2="16" stroke="${r.outer}" stroke-width="0.8" />
    <line x1="0" y1="32" x2="80" y2="32" stroke="${r.inner}" stroke-width="0.75" ${b} />
    <line x1="0" y1="48" x2="80" y2="48" stroke="${r.inner}" stroke-width="0.75" ${b} />
    <line x1="0" y1="64" x2="80" y2="64" stroke="${r.outer}" stroke-width="0.8" />
    <line x1="80" y1="16" x2="80" y2="64" stroke="${r.outer}" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.6" />
  `;if(d)return`
      <svg class="pinyin-cell-svg" viewBox="0 0 80 80" width="100%" height="100%">
        <rect width="80" height="80" fill="#ffffff" />
      </svg>
    `;if(!i&&!c)return`
      <svg class="pinyin-cell-svg" viewBox="0 0 80 80" width="100%" height="100%">
        ${o}
      </svg>
    `;const l=z(n);if(l.length===0)return`
      <svg class="pinyin-cell-svg" viewBox="0 0 80 80" width="100%" height="100%">
        ${o}
      </svg>
    `;l.length;let s=0;s=l.map(a=>$[a.char]?$[a.char].width:20).reduce((a,f)=>a+f,0);let p=1;s>56&&(p=56/s);let k="",h=40-s*p/2;const m=c?r.trace:"#1c1a17",u=c?"2.4":i?"2.8":"2.5";return l.forEach(a=>{const f=$[a.char];if(!f)return;const e=f.width*p,L=h+e/2;if(h+=e,f.strokes.forEach(w=>{w.isDot?k+=`
          <path d="${w.d}" transform="translate(${L}, 0) scale(${p}, 1)" 
                fill="${m}" stroke="${m}" stroke-width="0.8" />
        `:k+=`
          <path d="${w.d}" transform="translate(${L}, 0) scale(${p}, 1)" 
                fill="none" stroke="${m}" stroke-width="${u}" 
                stroke-linecap="round" stroke-linejoin="round" />
        `}),a.tone&&T[a.tone]){const w=T[a.tone];k+=`
        <path d="${w}" transform="translate(${L}, 0) scale(${p}, 1)" 
              fill="none" stroke="${m}" stroke-width="${u}" 
              stroke-linecap="round" stroke-linejoin="round" />
      `}}),`
    <svg class="pinyin-cell-svg" viewBox="0 0 80 80" width="100%" height="100%">
      ${o}
      ${k}
    </svg>
  `}function P(n=t){let i=[];if(n.category==="custom"?i=n.customText.split(/[\n,;，；、\s]+/).map(l=>B(l)).filter(l=>l.length>0):i=(C[n.category]||C.shm).items,i.length===0)return'<div class="empty-hint">请选择分类或在自定义框中输入要练习的拼音内容</div>';const c=n.orientation==="portrait",d=c?10:14,x=c?12:8,y=[];for(let o=0;o<i.length;o+=x)y.push(i.slice(o,o+x));const r=y.length;let g="拼音书写字帖";n.category==="custom"?g="拼音定制练习帖":C[n.category]&&(g=`汉语拼音${C[n.category].name}`);let b="";return y.forEach((o,l)=>{let s="";o.forEach(h=>{let m="";for(let u=0;u<d;u++){const a=u===0,f=u>0&&u<=n.traceCount,e=a&&n.showStrokeOrder?I(h):"",L=A({item:h,isFirstCell:a,hasBiShunImage:!!e,isTrace:f,gridColor:n.gridColor,lineStyle:n.lineStyle}),w=a?e?"pinyin-cell model-cell bishun-cell":"pinyin-cell model-cell":f?"pinyin-cell trace-cell":"pinyin-cell blank-cell",M=e?`<img class="pinyin-bi-shun-img" src="/pinyin_bi_shun/${e}.svg" alt="${h}" onerror="this.src='https://f.zt8.cn/img/pin_yin_bi_shun/${e}.svg'" />`:"";m+=`<div class="${w}" data-col="${u}">${L}${M}</div>`}s+=`
        <div class="pinyin-row">
          <div class="pinyin-row-label" title="${h}">${h}</div>
          <div class="pinyin-row-grids">
            ${m}
          </div>
        </div>
      `});const v=x-o.length;for(let h=0;h<v;h++){let m="";for(let u=0;u<d;u++){const a=A({item:"",isFirstCell:!1,isTrace:!1,gridColor:n.gridColor,lineStyle:n.lineStyle});m+=`<div class="pinyin-cell blank-cell" data-col="${u}">${a}</div>`}s+=`
        <div class="pinyin-row empty-pinyin-row">
          <div class="pinyin-row-label"></div>
          <div class="pinyin-row-grids">
            ${m}
          </div>
        </div>
      `}const p=n.conciseMode?"":`
        <header class="pinyin-sheet-header">
          <div class="pinyin-sheet-seal">墨</div>
          <div class="pinyin-header-text">
            <h2 class="pinyin-sheet-title">${g}</h2>
            <div class="pinyin-sheet-info-bar">
              <span class="info-item">姓名：<span class="underline"></span></span>
              <span class="info-item">班级：<span class="underline"></span></span>
              <span class="info-item">日期：<span class="underline"></span></span>
              <span class="info-item">评价：<span class="underline"></span></span>
            </div>
          </div>
        </header>
    `,k=n.conciseMode?`
        <footer class="pinyin-sheet-footer concise">
          <span>第 ${l+1} 页 / 共 ${r} 页</span>
        </footer>
    `:`
        <footer class="pinyin-sheet-footer">
          <span>统编版语文标准四线三格 · 规范手写体</span>
          <span>第 ${l+1} 页 / 共 ${r} 页</span>
          <span>墨格 moge.site</span>
        </footer>
    `;b+=`
      <section class="sheet pinyin-sheet ${n.orientation} ${n.conciseMode?"concise-mode":""}" data-page="${l+1}">
        ${p}

        <div class="pinyin-sheet-content" style="--pinyin-cols: ${d};">
          ${s}
        </div>

        ${k}
      </section>
    `}),b}function O(){const n=document.getElementById("pages"),i=document.getElementById("page-count-badge"),c=document.getElementById("concise-mode"),d=document.getElementById("show-stroke-order"),x=document.getElementById("trace-count"),y=document.getElementById("trace-output"),r=document.getElementById("custom-pinyin-text"),g=document.getElementById("char-count"),b=document.getElementById("custom-input-section"),o=document.getElementById("toast");function l(e){o&&(o.textContent=e,o.classList.add("visible"),clearTimeout(window.__toastTimer),window.__toastTimer=setTimeout(()=>{o.classList.remove("visible")},2200))}function s(){if(!n)return;n.innerHTML=P(t);const e=n.querySelectorAll(".pinyin-sheet");i&&(i.textContent=`共 ${e.length} 页`)}const v=document.getElementById("category-tabs");v&&v.addEventListener("click",e=>{const L=e.target.closest("button[data-cat]");if(!L)return;const w=L.getAttribute("data-cat");t.category=w,v.querySelectorAll("button").forEach(M=>M.setAttribute("aria-pressed","false")),L.setAttribute("aria-pressed","true"),b&&(w==="custom"?b.removeAttribute("hidden"):b.setAttribute("hidden","")),s()}),c&&(c.checked=t.conciseMode,c.addEventListener("change",e=>{t.conciseMode=e.target.checked,l(t.conciseMode?"已开启简洁模式":"已关闭简洁模式"),s()})),d&&(d.checked=t.showStrokeOrder,d.addEventListener("change",e=>{t.showStrokeOrder=e.target.checked,l(t.showStrokeOrder?"已开启首格笔顺提示":"已关闭笔顺提示"),s()})),x&&(x.value=t.traceCount,y&&(y.textContent=`${t.traceCount} 格`),x.addEventListener("input",e=>{t.traceCount=parseInt(e.target.value,10),y&&(y.textContent=`${t.traceCount} 格`),s()}));const p=document.getElementById("grid-color-options");p&&p.addEventListener("change",e=>{t.gridColor=e.target.value,s()});const k=document.getElementById("line-style-options");k&&k.addEventListener("change",e=>{t.lineStyle=e.target.value,s()});const h=document.getElementById("orientation-options"),m=document.getElementById("print-page-style");h&&h.addEventListener("change",e=>{t.orientation=e.target.value,m&&(m.textContent=`@page { size: A4 ${t.orientation}; margin: 0; }`),s()}),r&&(r.value=t.customText,g&&(g.textContent=`${t.customText.length} 字`),r.addEventListener("input",e=>{t.customText=e.target.value,g&&(g.textContent=`${t.customText.length} 字`),t.category==="custom"&&s()}));const u=document.getElementById("btn-clear-custom");u&&u.addEventListener("click",()=>{t.customText="",r&&(r.value=""),g&&(g.textContent="0 字"),s()});const a=document.getElementById("btn-sample-custom");a&&a.addEventListener("click",()=>{t.customText=`bái yún
chūn tiān
hàn yǔ pīn yīn
zhī shí jiù shì lì liàng`,r&&(r.value=t.customText),g&&(g.textContent=`${t.customText.length} 字`),s()}),document.querySelectorAll("[data-print]").forEach(e=>{e.addEventListener("click",()=>{window.print()})});const f=document.getElementById("reset-button");f&&f.addEventListener("click",()=>{t.category="shm",t.conciseMode=!0,t.showStrokeOrder=!1,t.traceCount=3,t.gridColor="red",t.lineStyle="dashed-middle",t.orientation="portrait",c&&(c.checked=!0),d&&(d.checked=!1),x&&(x.value=3),y&&(y.textContent="3 格"),v&&v.querySelectorAll("button").forEach(e=>e.setAttribute("aria-pressed",e.getAttribute("data-cat")==="shm"?"true":"false")),b&&b.setAttribute("hidden",""),l("已恢复默认设置"),s()}),s()}typeof document<"u"&&document.addEventListener("DOMContentLoaded",()=>{O()});
