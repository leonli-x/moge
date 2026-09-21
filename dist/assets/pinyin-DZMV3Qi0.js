import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css               */const f={shm:{id:"shm",name:"声母表",count:23,desc:"23个声母（b p m f d t n l ɡ k h j q x zh ch sh r z c s y w）",items:["b","p","m","f","d","t","n","l","ɡ","k","h","j","q","x","zh","ch","sh","r","z","c","s","y","w"]},dym:{id:"dym",name:"单韵母",count:6,desc:"6个单韵母（ɑ o e i u ü）",items:["ɑ","o","e","i","u","ü"]},fym:{id:"fym",name:"复韵母",count:9,desc:"9个复韵母（ɑi ei ui ɑo ou iu ie üe er）",items:["ɑi","ei","ui","ɑo","ou","iu","ie","üe","er"]},qbm:{id:"qbm",name:"前鼻韵母",count:5,desc:"5个前鼻韵母（ɑn en in un ün）",items:["ɑn","en","in","un","ün"]},hbm:{id:"hbm",name:"后鼻韵母",count:4,desc:"4个后鼻韵母（ɑnɡ enɡ inɡ onɡ）",items:["ɑnɡ","enɡ","inɡ","onɡ"]},ztr:{id:"ztr",name:"整体认读音节",count:16,desc:"16个整体认读音节（zhi chi shi ri zi ci si yi wu yu ye yue yuɑn yin yun yinɡ）",items:["zhi","chi","shi","ri","zi","ci","si","yi","wu","yu","ye","yue","yuɑn","yin","yun","yinɡ"]},all:{id:"all",name:"全部拼音总表",count:63,desc:"声母、韵母、整体认读音节全套总表（共63个）",items:[]},custom:{id:"custom",name:"自定义拼音",count:0,desc:"自由输入拼音字母、词语或带调音节练习",items:[]}};f.all.items=[...f.shm.items,...f.dym.items,...f.fym.items,...f.qbm.items,...f.hbm.items,...f.ztr.items];const E={ā:{base:"ɑ",tone:1},á:{base:"ɑ",tone:2},ǎ:{base:"ɑ",tone:3},à:{base:"ɑ",tone:4},ō:{base:"o",tone:1},ó:{base:"o",tone:2},ǒ:{base:"o",tone:3},ò:{base:"o",tone:4},ē:{base:"e",tone:1},é:{base:"e",tone:2},ě:{base:"e",tone:3},è:{base:"e",tone:4},ī:{base:"i",tone:1},í:{base:"i",tone:2},ǐ:{base:"i",tone:3},ì:{base:"i",tone:4},ū:{base:"u",tone:1},ú:{base:"u",tone:2},ǔ:{base:"u",tone:3},ù:{base:"u",tone:4},ǖ:{base:"ü",tone:1},ǘ:{base:"ü",tone:2},ǚ:{base:"ü",tone:3},ǜ:{base:"ü",tone:4}};function B(n){return n?n.replace(/a/g,"ɑ").replace(/g/g,"ɡ").replace(/v/g,"ü").trim():""}const $={ɑ:{width:20,strokes:[{d:"M 4.5 36 C 2 32.5 -7 32.5 -9 36.5 C -11.5 41 -11.5 47 -9 51.5 C -6.5 55.5 2 55.5 4.5 52",badge:{x:-3,y:28,text:"①"}},{d:"M 4.5 33 L 4.5 52 C 4.5 54.5 6.5 55.5 9 55.5",badge:{x:10,y:33,text:"②"}}]},b:{width:20,strokes:[{d:"M -7.5 19 L -7.5 55",badge:{x:-14,y:19,text:"①"}},{d:"M -7.5 35 C -5.5 32.5 4.5 32.5 7.5 36.5 C 11 41 11 47 7.5 51.5 C 4.5 55.5 -5.5 55.5 -7.5 53",badge:{x:5,y:28,text:"②"}}]},c:{width:19,strokes:[{d:"M 6.5 36 C 3.5 32.5 -5.5 32.5 -8.5 36.5 C -11.5 41 -11.5 47 -8.5 51.5 C -5.5 55.5 3.5 55.5 6.5 52",badge:{x:1,y:28,text:"①"}}]},d:{width:20,strokes:[{d:"M 7.5 36 C 5.5 32.5 -4.5 32.5 -7.5 36.5 C -11 41 -11 47 -7.5 51.5 C -4.5 55.5 5.5 55.5 7.5 52",badge:{x:-1,y:28,text:"①"}},{d:"M 7.5 19 L 7.5 55",badge:{x:14,y:19,text:"②"}}]},e:{width:19,strokes:[{d:"M -8 44 L 7.5 44 C 7.5 35 -4 32.5 -7.5 36.5 C -11 41 -11 47 -7.5 51.5 C -4.5 55.5 5 55.5 7.5 52",badge:{x:-14,y:44,text:"①"}}]},f:{width:16,strokes:[{d:"M 5 20 C 2 18 -3 18 -3 24 L -3 55",badge:{x:9,y:19,text:"①"}},{d:"M -8 33 L 4 33",badge:{x:-13,y:33,text:"②"}}]},ɡ:{width:20,strokes:[{d:"M 6.5 36 C 4.5 32.5 -4.5 32.5 -7.5 36.5 C -11 41 -11 47 -7.5 51.5 C -4.5 55.5 4.5 55.5 6.5 52",badge:{x:-1,y:28,text:"①"}},{d:"M 6.5 33 L 6.5 62 C 6.5 67 -2 67.5 -6 64",badge:{x:13,y:33,text:"②"}}]},h:{width:20,strokes:[{d:"M -7.5 19 L -7.5 55",badge:{x:-14,y:19,text:"①"}},{d:"M -7.5 38 C -5 33 4 32.5 6.5 36.5 L 6.5 55",badge:{x:3,y:28,text:"②"}}]},i:{width:12,strokes:[{d:"M 0 34 L 0 55",badge:{x:-6,y:35,text:"①"}},{d:"M -0.1 23.5 A 2 2 0 1 1 0.1 23.5 Z",isDot:!0,badge:{x:6,y:24,text:"②"}}]},j:{width:14,strokes:[{d:"M 2.5 34 L 2.5 62 C 2.5 67 -3.5 67.5 -6.5 64",badge:{x:-4,y:35,text:"①"}},{d:"M 2.4 23.5 A 2 2 0 1 1 2.6 23.5 Z",isDot:!0,badge:{x:9,y:24,text:"②"}}]},k:{width:20,strokes:[{d:"M -6.5 19 L -6.5 55",badge:{x:-13,y:19,text:"①"}},{d:"M 6.5 35 L -4.5 45 L 7.5 55",badge:{x:13,y:35,text:"②"}}]},l:{width:10,strokes:[{d:"M 0 19 L 0 55",badge:{x:-6,y:19,text:"①"}}]},m:{width:28,strokes:[{d:"M -11 34 L -11 55",badge:{x:-17,y:34,text:"①"}},{d:"M -11 38 C -9 33 -2 32.5 0 36.5 L 0 55",badge:{x:-3,y:28,text:"②"}},{d:"M 0 38 C 2.5 33 9 32.5 11 36.5 L 11 55",badge:{x:9,y:28,text:"③"}}]},n:{width:20,strokes:[{d:"M -7.5 34 L -7.5 55",badge:{x:-14,y:34,text:"①"}},{d:"M -7.5 38 C -5 33 4 32.5 6.5 36.5 L 6.5 55",badge:{x:3,y:28,text:"②"}}]},o:{width:20,strokes:[{d:"M 0 33 C -6.5 33 -10.5 37.5 -10.5 44 C -10.5 50.5 -6.5 55.5 0 55.5 C 6.5 55.5 10.5 50.5 10.5 44 C 10.5 37.5 5.5 33 1.2 33.2",badge:{x:-4,y:28,text:"①"}}]},p:{width:20,strokes:[{d:"M -7.5 33 L -7.5 65",badge:{x:-14,y:34,text:"①"}},{d:"M -7.5 35 C -5.5 32.5 4.5 32.5 7.5 36.5 C 11 41 11 47 7.5 51.5 C 4.5 55.5 -5.5 55.5 -7.5 53",badge:{x:5,y:28,text:"②"}}]},q:{width:20,strokes:[{d:"M 7.5 36 C 5.5 32.5 -4.5 32.5 -7.5 36.5 C -11 41 -11 47 -7.5 51.5 C -4.5 55.5 5.5 55.5 7.5 52",badge:{x:-1,y:28,text:"①"}},{d:"M 7.5 33 L 7.5 65",badge:{x:14,y:34,text:"②"}}]},r:{width:17,strokes:[{d:"M -5.5 34 L -5.5 55",badge:{x:-11,y:34,text:"①"}},{d:"M -5.5 39 C -2 33.5 4 33 7 35",badge:{x:4,y:28,text:"②"}}]},s:{width:18,strokes:[{d:"M 6 37 C 4 33 -3 33 -5 36.5 C -6.5 39.5 -4 42.5 0 44 C 5.5 46 7.5 48.5 6 52 C 4 55.5 -4.5 55.5 -6.5 52",badge:{x:7,y:30,text:"①"}}]},t:{width:16,strokes:[{d:"M -1 20 L -1 51.5 C -1 54.5 2 55.5 5.5 55.5",badge:{x:-7,y:20,text:"①"}},{d:"M -6.5 33 L 5.5 33",badge:{x:-12,y:33,text:"②"}}]},u:{width:19,strokes:[{d:"M -6.5 34 L -6.5 51.5 C -6.5 55.5 3 55.5 5.5 51.5 L 5.5 34",badge:{x:-13,y:34,text:"①"}},{d:"M 5.5 34 L 5.5 55",badge:{x:11,y:34,text:"②"}}]},ü:{width:19,strokes:[{d:"M -6.5 34 L -6.5 51.5 C -6.5 55.5 3 55.5 5.5 51.5 L 5.5 34",badge:{x:-13,y:34,text:"①"}},{d:"M 5.5 34 L 5.5 55",badge:{x:11,y:34,text:"②"}},{d:"M -4.6 23.5 A 1.8 1.8 0 1 1 -4.4 23.5 Z",isDot:!0,badge:{x:-5,y:18,text:"③"}},{d:"M 4.4 23.5 A 1.8 1.8 0 1 1 4.6 23.5 Z",isDot:!0,badge:{x:5,y:18,text:"④"}}]},w:{width:25,strokes:[{d:"M -10 34 L -5 55 L 0 36",badge:{x:-15,y:34,text:"①"}},{d:"M 0 36 L 5 55 L 10 34",badge:{x:3,y:29,text:"②"}}]},x:{width:19,strokes:[{d:"M -7 34 L 7 55",badge:{x:-13,y:34,text:"①"}},{d:"M 7 34 L -7 55",badge:{x:13,y:34,text:"②"}}]},y:{width:19,strokes:[{d:"M -7 34 L 0 47",badge:{x:-13,y:34,text:"①"}},{d:"M 7 34 L -7 65",badge:{x:13,y:34,text:"②"}}]},z:{width:18,strokes:[{d:"M -7.5 34.5 L 7.5 34.5 L -7.5 54.5 L 7.5 54.5",badge:{x:-13,y:34.5,text:"①"}}]}};function I(n){let s=(n||"").toLowerCase().trim();return s=s.replace(/ɑ/g,"a").replace(/ɡ/g,"g").replace(/ü/g,"v"),s=s.normalize("NFD").replace(/[\u0300-\u036f]/g,""),/^[a-z]+$/.test(s)?s:""}const S={1:"M -4 23 L 4 23",2:"M -4 25.5 L 3.5 20.5",3:"M -4 21.5 L 0 25.5 L 4 21.5",4:"M -3.5 20.5 L 4 25.5"},t={category:"shm",customText:`ɑ o e i u ü
b p m f d t n l
ɡ k h j q x
zh ch sh r z c s
y w`,conciseMode:!0,showStrokeOrder:!1,traceCount:3,gridColor:"red",lineStyle:"dashed-middle",orientation:"portrait"},T={red:{outer:"#e06a68",inner:"#f09695",bg:"#fffbfb",trace:"#c6ccd2"},blue:{outer:"#3b82f6",inner:"#93c5fd",bg:"#f8faff",trace:"#c6ccd2"},gray:{outer:"#6b7280",inner:"#9ca3af",bg:"#ffffff",trace:"#c6ccd2"}};function z(n){const s=B(n),d=[];for(const a of s)E[a]?d.push({char:E[a].base,tone:E[a].tone}):$[a]&&d.push({char:a,tone:0});return d}function A({item:n,isFirstCell:s=!1,isTrace:d=!1,hasBiShunImage:a=!1,gridColor:x="red",lineStyle:h="dashed-middle"}){const o=T[x]||T.red,p=h==="dashed-middle"||h==="dashed"?'stroke-dasharray="3,2.2"':"",r=`
    <svg class="pinyin-grid-svg" viewBox="0 0 100 88" preserveAspectRatio="none">
      ${s?`<line x1="0" y1="11" x2="0" y2="77" stroke="${o.outer}" stroke-width="0.8" />`:""}
      <line x1="0" y1="11" x2="100" y2="11" stroke="${o.outer}" stroke-width="0.8" />
      <line x1="0" y1="33" x2="100" y2="33" stroke="${o.inner}" stroke-width="0.75" ${p} />
      <line x1="0" y1="55" x2="100" y2="55" stroke="${o.inner}" stroke-width="0.75" ${p} />
      <line x1="0" y1="77" x2="100" y2="77" stroke="${o.outer}" stroke-width="0.8" />
      <line x1="100" y1="11" x2="100" y2="77" stroke="${o.outer}" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.6" />
    </svg>
  `;if(a)return`
      <svg class="pinyin-grid-svg" viewBox="0 0 100 88" preserveAspectRatio="none">
        <rect width="100" height="88" fill="#ffffff" />
      </svg>
    `;if(!s&&!d)return r;const c=z(n);if(c.length===0)return r;c.length;let i=0;i=c.map(u=>$[u.char]?$[u.char].width:20).reduce((u,e)=>u+e,0);let b=1;i>62&&(b=62/i);let k="",y=44-i*b/2;const m=d?o.trace:"#1c1a17",l=d?"2.4":s?"2.8":"2.5";c.forEach(u=>{const e=$[u.char];if(!e)return;const M=e.width*b,v=y+M/2;if(y+=M,e.strokes.forEach(w=>{w.isDot?k+=`
          <path d="${w.d}" transform="translate(${v}, 0) scale(${b}, 1)" 
                fill="${m}" stroke="${m}" stroke-width="0.8" />
        `:k+=`
          <path d="${w.d}" transform="translate(${v}, 0) scale(${b}, 1)" 
                fill="none" stroke="${m}" stroke-width="${l}" 
                stroke-linecap="round" stroke-linejoin="round" />
        `}),u.tone&&S[u.tone]){const w=S[u.tone];k+=`
        <path d="${w}" transform="translate(${v}, 0) scale(${b}, 1)" 
              fill="none" stroke="${m}" stroke-width="${l}" 
              stroke-linecap="round" stroke-linejoin="round" />
      `}});const C=`
    <svg class="pinyin-glyph-svg" viewBox="0 0 88 88" preserveAspectRatio="xMidYMid meet">
      ${k}
    </svg>
  `;return`${r}${C}`}function P(n=t){let s=[];if(n.category==="custom"?s=n.customText.split(/[\n,;，；、\s]+/).map(c=>B(c)).filter(c=>c.length>0):s=(f[n.category]||f.shm).items,s.length===0)return'<div class="empty-hint">请选择分类或在自定义框中输入要练习的拼音内容</div>';const d=n.orientation==="portrait",a=d?10:14,x=d?12:8,h=[];for(let r=0;r<s.length;r+=x)h.push(s.slice(r,r+x));const o=h.length;let g="拼音书写字帖";n.category==="custom"?g="拼音定制练习帖":f[n.category]&&(g=`汉语拼音${f[n.category].name}`);let p="";return h.forEach((r,c)=>{let i="";r.forEach(y=>{let m="";for(let l=0;l<a;l++){const C=l===0,u=l>0&&l<=n.traceCount,e=C&&n.showStrokeOrder?I(y):"",M=A({item:y,isFirstCell:C,hasBiShunImage:!!e,isTrace:u,gridColor:n.gridColor,lineStyle:n.lineStyle}),v=C?e?"pinyin-cell model-cell bishun-cell":"pinyin-cell model-cell":u?"pinyin-cell trace-cell":"pinyin-cell blank-cell",w=e?`<img class="pinyin-bi-shun-img" src="/pinyin_bi_shun/${e}.svg" alt="${y}" onerror="this.src='https://f.zt8.cn/img/pin_yin_bi_shun/${e}.svg'" />`:"";m+=`<div class="${v}" data-col="${l}">${M}${w}</div>`}i+=`
        <div class="pinyin-row">
          <div class="pinyin-row-label" title="${y}">${y}</div>
          <div class="pinyin-row-grids">
            ${m}
          </div>
        </div>
      `});const L=x-r.length;for(let y=0;y<L;y++){let m="";for(let l=0;l<a;l++){const C=A({item:"",isFirstCell:!1,isTrace:!1,gridColor:n.gridColor,lineStyle:n.lineStyle});m+=`<div class="pinyin-cell blank-cell" data-col="${l}">${C}</div>`}i+=`
        <div class="pinyin-row empty-pinyin-row">
          <div class="pinyin-row-label"></div>
          <div class="pinyin-row-grids">
            ${m}
          </div>
        </div>
      `}const b=n.conciseMode?"":`
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
          <span>第 ${c+1} 页 / 共 ${o} 页</span>
        </footer>
    `:`
        <footer class="pinyin-sheet-footer">
          <span>统编版语文标准四线三格 · 规范手写体</span>
          <span>第 ${c+1} 页 / 共 ${o} 页</span>
          <span>墨格 moge.site</span>
        </footer>
    `;p+=`
      <section class="sheet pinyin-sheet ${n.orientation} ${n.conciseMode?"concise-mode":""}" data-page="${c+1}">
        ${b}

        <div class="pinyin-sheet-content" style="--pinyin-cols: ${a};">
          ${i}
        </div>

        ${k}
      </section>
    `}),p}function O(){const n=document.getElementById("pages"),s=document.getElementById("page-count-badge"),d=document.getElementById("concise-mode"),a=document.getElementById("show-stroke-order"),x=document.getElementById("trace-count"),h=document.getElementById("trace-output"),o=document.getElementById("custom-pinyin-text"),g=document.getElementById("char-count"),p=document.getElementById("custom-input-section"),r=document.getElementById("toast");function c(e){r&&(r.textContent=e,r.classList.add("visible"),clearTimeout(window.__toastTimer),window.__toastTimer=setTimeout(()=>{r.classList.remove("visible")},2200))}function i(){if(!n)return;n.innerHTML=P(t);const e=n.querySelectorAll(".pinyin-sheet");s&&(s.textContent=`共 ${e.length} 页`)}const L=document.getElementById("category-tabs");L&&L.addEventListener("click",e=>{const M=e.target.closest("button[data-cat]");if(!M)return;const v=M.getAttribute("data-cat");t.category=v,L.querySelectorAll("button").forEach(w=>w.setAttribute("aria-pressed","false")),M.setAttribute("aria-pressed","true"),p&&(v==="custom"?p.removeAttribute("hidden"):p.setAttribute("hidden","")),i()}),d&&(d.checked=t.conciseMode,d.addEventListener("change",e=>{t.conciseMode=e.target.checked,c(t.conciseMode?"已开启简洁模式":"已关闭简洁模式"),i()})),a&&(a.checked=t.showStrokeOrder,a.addEventListener("change",e=>{t.showStrokeOrder=e.target.checked,c(t.showStrokeOrder?"已开启首格笔顺提示":"已关闭笔顺提示"),i()})),x&&(x.value=t.traceCount,h&&(h.textContent=`${t.traceCount} 格`),x.addEventListener("input",e=>{t.traceCount=parseInt(e.target.value,10),h&&(h.textContent=`${t.traceCount} 格`),i()}));const b=document.getElementById("grid-color-options");b&&b.addEventListener("change",e=>{t.gridColor=e.target.value,i()});const k=document.getElementById("line-style-options");k&&k.addEventListener("change",e=>{t.lineStyle=e.target.value,i()});const y=document.getElementById("orientation-options"),m=document.getElementById("print-page-style");y&&y.addEventListener("change",e=>{t.orientation=e.target.value,m&&(m.textContent=`@page { size: A4 ${t.orientation}; margin: 0; }`),i()}),o&&(o.value=t.customText,g&&(g.textContent=`${t.customText.length} 字`),o.addEventListener("input",e=>{t.customText=e.target.value,g&&(g.textContent=`${t.customText.length} 字`),t.category==="custom"&&i()}));const l=document.getElementById("btn-clear-custom");l&&l.addEventListener("click",()=>{t.customText="",o&&(o.value=""),g&&(g.textContent="0 字"),i()});const C=document.getElementById("btn-sample-custom");C&&C.addEventListener("click",()=>{t.customText=`bái yún
chūn tiān
hàn yǔ pīn yīn
zhī shí jiù shì lì liàng`,o&&(o.value=t.customText),g&&(g.textContent=`${t.customText.length} 字`),i()}),document.querySelectorAll("[data-print]").forEach(e=>{e.addEventListener("click",()=>{window.print()})});const u=document.getElementById("reset-button");u&&u.addEventListener("click",()=>{t.category="shm",t.conciseMode=!0,t.showStrokeOrder=!1,t.traceCount=3,t.gridColor="red",t.lineStyle="dashed-middle",t.orientation="portrait",d&&(d.checked=!0),a&&(a.checked=!1),x&&(x.value=3),h&&(h.textContent="3 格"),L&&L.querySelectorAll("button").forEach(e=>e.setAttribute("aria-pressed",e.getAttribute("data-cat")==="shm"?"true":"false")),p&&p.setAttribute("hidden",""),c("已恢复默认设置"),i()}),i()}typeof document<"u"&&document.addEventListener("DOMContentLoaded",()=>{O()});
