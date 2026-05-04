
function safeGetStorage(key){
  try{return localStorage.getItem(key)}catch{return null}
}
function safeSetStorage(key,value){
  try{localStorage.setItem(key,value)}catch{}
}
const savedTheme=safeGetStorage('organo-theme');
document.addEventListener('click',e=>{
  const item=e.target.closest&&e.target.closest('.syllabus-item');
  if(!item) return;
  const strong=item.querySelector('strong');
  const match=strong&&strong.textContent.match(/^(\d+)\./);
  if(match){
    e.preventDefault();
    showMasterTopicDetail(Number(match[1]));
  }
});
document.addEventListener('keydown',e=>{
  if(e.key!=='Enter'&&e.key!==' ') return;
  const item=e.target.closest&&e.target.closest('.syllabus-item');
  if(!item) return;
  const strong=item.querySelector('strong');
  const match=strong&&strong.textContent.match(/^(\d+)\./);
  if(match){
    e.preventDefault();
    showMasterTopicDetail(Number(match[1]));
  }
});
if(savedTheme==='light'){
  document.body.classList.add('light-mode');
}
const themeToggle=document.getElementById('themeToggle');
function syncThemeToggle(){
  const isLight=document.body.classList.contains('light-mode');
  if(themeToggle){
    themeToggle.setAttribute('aria-label',isLight?'Switch to dark mode':'Switch to light mode');
    themeToggle.setAttribute('title',isLight?'Switch to dark mode':'Switch to light mode');
  }
}
if(themeToggle){
  themeToggle.addEventListener('click',()=>{
    document.body.classList.toggle('light-mode');
    safeSetStorage('organo-theme',document.body.classList.contains('light-mode')?'light':'dark');
    syncThemeToggle();
  });
  syncThemeToggle();
}
// ═══════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════
window.addEventListener('scroll', () => {
  const p = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progress').style.width = p + '%';
});

const atlasPages=[
  'goc','stereochemistry-page','functional-groups','redox-agents','rearrangements',
  'couplings','named-reactions','analytical-practical','pharma-industrial','advanced-concepts',
  'interview-prep','structure-editor','alcohols','mechanisms','spectroscopy'
];
function activatePage(){
  if(document.body.dataset.multiPage==='true'){
    document.body.classList.remove('page-open');
    document.querySelectorAll('.atlas-page').forEach(page=>page.classList.add('active'));
    return;
  }
  const requested=(window.location.hash||'#home').replace('#','');
  const isPage=atlasPages.includes(requested);
  document.body.classList.toggle('page-open',isPage);
  atlasPages.forEach(id=>{
    const page=document.getElementById(id);
    if(page) page.classList.toggle('active',id===requested);
  });
  document.querySelectorAll('.floating-toc a').forEach(a=>{
    a.classList.toggle('active',a.dataset.section===requested);
  });
  if(isPage) window.scrollTo({top:0,behavior:'auto'});
}
window.addEventListener('hashchange',activatePage);
activatePage();

// ═══════════════════════════════════════════
// HEADER STUDY TOOLS
// ═══════════════════════════════════════════
const corePartTools=[
  {id:'goc',num:'01',name:'General Organic Chemistry',keys:'goc bonding hybridization inductive resonance acidity basicity carbocation carbanion aromaticity solvent'},
  {id:'stereochemistry-page',num:'02',name:'Stereochemistry',keys:'stereochemistry isomerism chirality enantiomer diastereomer ez rs optical activity conformations'},
  {id:'functional-groups',num:'03',name:'Functional Group Chemistry',keys:'functional groups alkane alkene alkyne arene alkyl halide alcohol phenol carbonyl amine acid ester amide'},
  {id:'redox-agents',num:'04',name:'Oxidation & Reduction',keys:'oxidation reduction pcc kmno4 lialh4 nabh4 dibal swern lindlar birch hydrogenation'},
  {id:'rearrangements',num:'05',name:'Rearrangement Reactions',keys:'rearrangement wagner meerwein pinacol beckmann hofmann curtius baeyer villiger fries claisen'},
  {id:'couplings',num:'06',name:'Coupling Reactions',keys:'coupling suzuki heck sonogashira stille negishi wurtz glaser buchwald ullmann palladium copper'},
  {id:'named-reactions',num:'07',name:'Named Reactions',keys:'named reactions grignard aldol wittig diels alder sn1 sn2 friedel crafts finkelstein elimination oxidation reduction'},
  {id:'analytical-practical',num:'08',name:'Analytical & Practical Organic',keys:'analytical practical tlc column chromatography distillation spectroscopy ir nmr ms uv purification'},
  {id:'pharma-industrial',num:'09',name:'Industrial & Pharma Organic Chemistry',keys:'pharma industrial api impurity gti nitrosamine scale up optimization green chemistry process solvent'},
  {id:'advanced-concepts',num:'10',name:'Advanced Concepts',keys:'advanced pericyclic organometallic retrosynthesis protecting groups asymmetric synthesis woodward hoffmann'},
];
const extraStudyTools=[
  {id:'interview-prep',num:'IV',name:'Interview Preparation',keys:'interview questions answers pharma r&d qa process analytical tricky'},
  {id:'structure-editor',num:'SE',name:'Online Structure Editor',keys:'structure editor sketcher draw molecule chemical smiles inchi sdf png pubchem export'},
  {id:'alcohols',num:'A1',name:'Alcohol Deep Dive',keys:'alcohol primary secondary tertiary oxidation dehydration esterification lucas test'},
  {id:'mechanisms',num:'M1',name:'Mechanisms',keys:'mechanism electron movement eas substitution elimination intermediate'},
  {id:'spectroscopy',num:'S1',name:'Spectroscopy',keys:'spectroscopy ir nmr mass uv peaks splitting chemical shift'},
];
const headerSearchItems=[...corePartTools,...extraStudyTools];
const headerSearch=document.getElementById('headerSearch');
const headerSearchResults=document.getElementById('headerSearchResults');
function renderHeaderSearch(query=''){
  if(!headerSearchResults) return;
  const q=query.trim().toLowerCase();
  const matches=headerSearchItems.filter(item=>!q || `${item.num} ${item.name} ${item.keys}`.toLowerCase().includes(q)).slice(0,8);
  headerSearchResults.innerHTML=matches.map(item=>`<a href="#${item.id}"><span>${item.num}</span>${item.name}</a>`).join('') ||
    '<div class="nav-dropdown-note">No match found. Try reagent, reaction, NMR, TLC, or pharma.</div>';
}
if(headerSearch){
  renderHeaderSearch();
  headerSearch.addEventListener('input',e=>renderHeaderSearch(e.target.value));
}

function openRandomTopic(){
  const pool=[
    ...corePartTools,
    {id:'named-reactions',num:'Rxn',name:'Grignard / Aldol / Wittig revision'},
    {id:'redox-agents',num:'Reag',name:'PCC, KMnO4, LiAlH4 and NaBH4'},
    {id:'structure-editor',num:'Draw',name:'Draw and export a chemical structure'},
    {id:'spectroscopy',num:'Spec',name:'IR and NMR interpretation'},
    {id:'pharma-industrial',num:'API',name:'Impurity and scale-up chemistry'},
    {id:'interview-prep',num:'QA',name:'Interview question practice'}
  ];
  const pick=pool[Math.floor(Math.random()*pool.length)];
  window.location.hash=pick.id;
}
document.getElementById('randomTopicBtn')?.addEventListener('click',openRandomTopic);
document.querySelectorAll('[data-random-topic]').forEach(btn=>btn.addEventListener('click',openRandomTopic));

const progressKey='organo-part-progress';
function getPartProgress(){
  try{return JSON.parse(localStorage.getItem(progressKey)||'[]')}catch{return []}
}
function setPartProgress(done){
  localStorage.setItem(progressKey,JSON.stringify(done));
}
function currentCorePartId(){
  const hash=(window.location.hash||'').replace('#','');
  return corePartTools.some(p=>p.id===hash)?hash:null;
}
function renderPartProgress(){
  const done=getPartProgress();
  const count=corePartTools.filter(p=>done.includes(p.id)).length;
  const btn=document.getElementById('progressMenuBtn');
  if(btn) btn.textContent=`${count}/10 Done`;
  const list=document.getElementById('progressList');
  if(list){
    list.innerHTML=corePartTools.map(part=>{
      const isDone=done.includes(part.id);
      return `<button type="button" class="progress-row ${isDone?'done':''}" data-progress-id="${part.id}">
        <span><span>${part.num}</span>${part.name}</span><span class="progress-check"></span>
      </button>`;
    }).join('');
    list.querySelectorAll('[data-progress-id]').forEach(row=>{
      row.addEventListener('click',()=>{
        const id=row.dataset.progressId;
        const next=getPartProgress();
        const index=next.indexOf(id);
        if(index>=0) next.splice(index,1); else next.push(id);
        setPartProgress(next);
        renderPartProgress();
      });
    });
  }
}
document.getElementById('markCurrentDone')?.addEventListener('click',()=>{
  const id=currentCorePartId();
  if(!id) return;
  const done=getPartProgress();
  if(!done.includes(id)) done.push(id);
  setPartProgress(done);
  renderPartProgress();
});
window.addEventListener('hashchange',renderPartProgress);
renderPartProgress();

// ═══════════════════════════════════════════
// PARTICLE BACKGROUND
// ═══════════════════════════════════════════
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [], W, H;
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
resize();window.addEventListener('resize',resize);
function Particle(){
  this.x=Math.random()*W;this.y=Math.random()*H;
  this.vx=(Math.random()-0.5)*0.3;this.vy=(Math.random()-0.5)*0.3;
  this.r=Math.random()*1.5+0.5;
  this.color=Math.random()>0.5?'rgba(0,229,255,':'rgba(124,58,237,';
  this.a=Math.random()*0.5+0.1;
}
for(let i=0;i<100;i++)particles.push(new Particle());
function drawParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=p.color+p.a+')';ctx.fill();
  });
  // Draw connections
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<100){
        ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle=`rgba(0,229,255,${0.06*(1-d/100)})`;ctx.lineWidth=0.5;ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ═══════════════════════════════════════════
// ACCORDION
// ═══════════════════════════════════════════
function toggleAcc(id){
  const item=document.getElementById(id);
  const body=item.querySelector('.accordion-body');
  const isOpen=item.classList.contains('open');
  item.classList.toggle('open',!isOpen);
  body.classList.toggle('open',!isOpen);
}

// ═══════════════════════════════════════════
// REACTION MATRIX
// ═══════════════════════════════════════════
const reactions=[
  {n:'Grignard',y:'1900',cat:'add',cl:'cat-add'},{n:'Aldol',y:'1872',cat:'add',cl:'cat-add'},
  {n:'Wittig',y:'1953',cat:'add',cl:'cat-add'},{n:'Diels-Alder',y:'1928',cat:'cyclo',cl:'cat-cyclo'},
  {n:'Michael',y:'1887',cat:'add',cl:'cat-add'},{n:'Reformatsky',y:'1887',cat:'add',cl:'cat-add'},
  {n:'Mannich',y:'1912',cat:'add',cl:'cat-add'},{n:'Knoevenagel',y:'1896',cat:'add',cl:'cat-add'},
  {n:'Perkin',y:'1868',cat:'add',cl:'cat-add'},{n:'Henry (Nitroaldol)',y:'1895',cat:'add',cl:'cat-add'},
  {n:'Claisen',y:'1881',cat:'add',cl:'cat-add'},{n:'Robinson Annul.',y:'1935',cat:'add',cl:'cat-add'},
  {n:'SN2',y:'1935',cat:'sub',cl:'cat-sub'},{n:'SN1',y:'1935',cat:'sub',cl:'cat-sub'},
  {n:'Friedel-Crafts',y:'1877',cat:'sub',cl:'cat-sub'},{n:'Sandmeyer',y:'1884',cat:'sub',cl:'cat-sub'},
  {n:'Finkelstein',y:'1910',cat:'sub',cl:'cat-sub'},{n:'Menschutkin',y:'1890',cat:'sub',cl:'cat-sub'},
  {n:'Gabriel',y:'1887',cat:'sub',cl:'cat-sub'},{n:'Mitsunobu',y:'1967',cat:'sub',cl:'cat-sub'},
  {n:'Balz-Schiemann',y:'1927',cat:'sub',cl:'cat-sub'},{n:'Buchwald-Hartwig',y:'1994',cat:'coup',cl:'cat-coup'},
  {n:'E2 Elimination',y:'1927',cat:'elim',cl:'cat-elim'},{n:'E1 Elimination',y:'1927',cat:'elim',cl:'cat-elim'},
  {n:'Cope Elim.',y:'1949',cat:'elim',cl:'cat-elim'},{n:'Hofmann Elim.',y:'1851',cat:'elim',cl:'cat-elim'},
  {n:'Chugaev',y:'1899',cat:'elim',cl:'cat-elim'},{n:'Zaitsev Rule',y:'1875',cat:'elim',cl:'cat-elim'},
  {n:'Clemmensen',y:'1913',cat:'red',cl:'cat-red'},{n:'Wolff-Kishner',y:'1912',cat:'red',cl:'cat-red'},
  {n:'Birch Reduction',y:'1944',cat:'red',cl:'cat-red'},{n:'Lindlar',y:'1952',cat:'red',cl:'cat-red'},
  {n:'NaBH₄ Reduction',y:'1953',cat:'red',cl:'cat-red'},{n:'LiAlH₄',y:'1947',cat:'red',cl:'cat-red'},
  {n:'DIBAL-H',y:'1956',cat:'red',cl:'cat-red'},{n:'Meerwein-Ponndorf-Verley',y:'1925',cat:'red',cl:'cat-red'},
  {n:'Swern Oxidation',y:'1978',cat:'ox',cl:'cat-ox'},{n:'Jones Reagent',y:'1946',cat:'ox',cl:'cat-ox'},
  {n:'PCC Oxidation',y:'1975',cat:'ox',cl:'cat-ox'},{n:'Dess-Martin',y:'1983',cat:'ox',cl:'cat-ox'},
  {n:'Baeyer-Villiger',y:'1899',cat:'ox',cl:'cat-ox'},{n:'Wacker',y:'1959',cat:'ox',cl:'cat-ox'},
  {n:'Ozonolysis',y:'1840',cat:'ox',cl:'cat-ox'},{n:'Sharpless Epox.',y:'1980',cat:'ox',cl:'cat-ox'},
  {n:'OsO₄ Dihydrox.',y:'1912',cat:'ox',cl:'cat-ox'},{n:'KMnO₄',y:'1870',cat:'ox',cl:'cat-ox'},
  {n:'Pinacol Rearr.',y:'1859',cat:'rearr',cl:'cat-rearr'},{n:'Beckmann',y:'1886',cat:'rearr',cl:'cat-rearr'},
  {n:'Cope Rearr.',y:'1940',cat:'rearr',cl:'cat-rearr'},{n:'Claisen Rearr.',y:'1912',cat:'rearr',cl:'cat-rearr'},
  {n:'Fries Rearr.',y:'1908',cat:'rearr',cl:'cat-rearr'},{n:'Curtius',y:'1894',cat:'rearr',cl:'cat-rearr'},
  {n:'Hofmann Rearr.',y:'1881',cat:'rearr',cl:'cat-rearr'},{n:'Schmidt',y:'1923',cat:'rearr',cl:'cat-rearr'},
  {n:'Wagner-Meerwein',y:'1902',cat:'rearr',cl:'cat-rearr'},{n:'Bamford-Stevens',y:'1952',cat:'rearr',cl:'cat-rearr'},
  {n:'Suzuki',y:'1979',cat:'coup',cl:'cat-coup'},{n:'Heck',y:'1972',cat:'coup',cl:'cat-coup'},
  {n:'Sonogashira',y:'1975',cat:'coup',cl:'cat-coup'},{n:'Negishi',y:'1977',cat:'coup',cl:'cat-coup'},
  {n:'Stille',y:'1978',cat:'coup',cl:'cat-coup'},{n:'Kumada',y:'1972',cat:'coup',cl:'cat-coup'},
  {n:'Ullmann',y:'1901',cat:'coup',cl:'cat-coup'},{n:'Glaser',y:'1869',cat:'coup',cl:'cat-coup'},
  {n:'[4+2] Diels-Alder',y:'1928',cat:'cyclo',cl:'cat-cyclo'},{n:'[2+2] Cycloadd.',y:'1905',cat:'cyclo',cl:'cat-cyclo'},
  {n:'Huisgen 1,3-dipolar',y:'1963',cat:'cyclo',cl:'cat-cyclo'},{n:'Paterno-Büchi',y:'1954',cat:'cyclo',cl:'cat-cyclo'},
  {n:'Corey-Chaykovsky',y:'1962',cat:'add',cl:'cat-add'},{n:'Julia Olefination',y:'1973',cat:'elim',cl:'cat-elim'},
  {n:'HWE Reaction',y:'1958',cat:'elim',cl:'cat-elim'},{n:'Peterson Olefin.',y:'1968',cat:'elim',cl:'cat-elim'},
  {n:'Stork Enamine',y:'1954',cat:'sub',cl:'cat-sub'},{n:'Hydroboration',y:'1956',cat:'add',cl:'cat-add'},
  {n:'Paal-Knorr',y:'1885',cat:'add',cl:'cat-add'},{n:'Hantzsch Pyridine',y:'1882',cat:'add',cl:'cat-add'},
  {n:'Biginelli',y:'1893',cat:'add',cl:'cat-add'},{n:'Dakin Reaction',y:'1909',cat:'ox',cl:'cat-ox'},
];
const matrix=document.getElementById('reactionMatrix');
if(matrix){
  reactions.forEach(r=>{
    const div=document.createElement('div');
    div.className=`matrix-cell ${r.cl}`;
    div.innerHTML=`<div class="mc-cat">${r.cat}</div><div class="mc-name">${r.n}</div><div class="mc-year">${r.y}</div><span class="mc-add">+</span>`;
    div.onclick=()=>showReactionDetail(r.n);
    matrix.appendChild(div);
  });
}

function filterReactions(q){
  if(!matrix) return;
  const cells=matrix.querySelectorAll('.matrix-cell');
  cells.forEach(c=>{
    const name=c.querySelector('.mc-name').textContent.toLowerCase();
    c.style.display=q===''||name.includes(q.toLowerCase())?'':'none';
  });
}

// ═══════════════════════════════════════════
// DETAIL PANEL
// ═══════════════════════════════════════════
const reactionDetails={
  'bonding':{title:'Chemical Bonding',sub:'Covalent, Ionic, Sigma & Pi',body:`
    <div class="detail-section"><div class="detail-section-title">COVALENT BONDING</div>
    <p class="detail-text">Covalent bonds form when atoms share electron pairs. In organic molecules, carbon forms 4 covalent bonds. Bond strength increases: single < double < triple. Bond length decreases: single > double > triple.</p>
    <div class="detail-eq">Bond order ∝ Bond strength ∝ 1/Bond length</div>
    </div>
    <div class="detail-section"><div class="detail-section-title">SIGMA vs PI BONDS</div>
    <p class="detail-text">σ (sigma) bonds: head-on orbital overlap, cylindrically symmetric, free rotation possible. π (pi) bonds: side-on p-orbital overlap, restrict rotation, responsible for reactivity in alkenes/alkynes. Single bonds = 1σ. Double bonds = 1σ + 1π. Triple bonds = 1σ + 2π.</p>
    </div>
  `},
  'grignard_primary':{title:'Grignard + Formaldehyde',sub:'Synthesis of Primary Alcohols',body:`
    <div class="detail-section"><div class="detail-section-title">REACTION</div>
    <p class="detail-text">Grignard reagents (RMgX) add to formaldehyde (HCHO) to give primary alcohols after aqueous workup. Formaldehyde is unique — its carbonyl carbon bears two H atoms, so addition of any Grignard gives a primary alcohol (one more carbon than the Grignard).</p>
    <div class="detail-eq">RMgX + HCHO → [R–CH₂–OMgX] → H₃O⁺ → R–CH₂–OH (1° alcohol)</div>
    </div>
    <div class="detail-section"><div class="detail-section-title">MECHANISM</div>
    <div class="mechanism-step"><div class="step-num">1</div><div class="step-text">Preparation: R–X + Mg → R–MgX (in dry diethyl ether, anhydrous conditions)</div></div>
    <div class="mechanism-step"><div class="step-num">2</div><div class="step-text">Nucleophilic addition: Carbon of R–MgX attacks carbonyl carbon of HCHO (δ+). Mg coordinates to oxygen.</div></div>
    <div class="mechanism-step"><div class="step-num">3</div><div class="step-text">Hydrolysis: Addition of NH₄Cl(aq) or dilute H₃O⁺ breaks Mg–O bond to reveal primary alcohol.</div></div>
    </div>
    <div class="detail-section"><div class="detail-section-title">EXAMPLES</div>
    <table class="chem-table"><thead><tr><th>Grignard</th><th>+ HCHO</th><th>Product</th></tr></thead>
    <tbody>
    <tr><td>CH₃MgBr</td><td>HCHO</td><td>CH₃CH₂OH (ethanol)</td></tr>
    <tr><td>C₂H₅MgBr</td><td>HCHO</td><td>C₂H₅CH₂OH (1-propanol)</td></tr>
    <tr><td>PhMgBr</td><td>HCHO</td><td>PhCH₂OH (benzyl alcohol)</td></tr>
    </tbody></table>
    </div>
  `},
  'grignard_ketone':{title:'Grignard + Ketone',sub:'Synthesis of Tertiary Alcohols',body:`
    <div class="detail-section"><div class="detail-section-title">REACTION</div>
    <p class="detail-text">Addition of Grignard reagent to any ketone gives, after hydrolysis, a tertiary alcohol. The carbon skeleton has three carbon substituents around the carbinol carbon. This is the most general and important route to tertiary alcohols.</p>
    <div class="detail-eq">RMgX + R'COR'' → R–C(OMgX)(R')(R'') → H₃O⁺ → R–C(OH)(R')(R'')</div>
    </div>
    <div class="detail-section"><div class="detail-section-title">KEY EXAMPLES</div>
    <table class="chem-table"><thead><tr><th>Grignard</th><th>Ketone</th><th>Tertiary Alcohol</th></tr></thead>
    <tbody>
    <tr><td>CH₃MgBr (2×)</td><td>Ethyl acetate (ester)</td><td>2-methyl-2-propanol (t-BuOH)</td></tr>
    <tr><td>PhMgBr</td><td>Acetone</td><td>2-phenyl-2-propanol</td></tr>
    <tr><td>CH₃MgBr</td><td>Benzophenone</td><td>Triphenylcarbinol... wait → 1,1-diphenylethanol</td></tr>
    <tr><td>EtMgBr</td><td>Cyclohexanone</td><td>1-ethylcyclohexanol (3°)</td></tr>
    </tbody></table>
    </div>
  `},
  'hc_hydroboration':{title:'Hydroboration-Oxidation',sub:'Anti-Markovnikov Primary Alcohol Synthesis',body:`
    <div class="detail-section"><div class="detail-section-title">OVERVIEW</div>
    <p class="detail-text">Discovered by H.C. Brown (Nobel 1979). BH₃·THF adds to alkene via concerted four-centered transition state: boron goes to less hindered (terminal) carbon, H to more substituted carbon — opposite of Markovnikov. Then H₂O₂/NaOH oxidizes C–B to C–OH with retention of configuration.</p>
    <div class="detail-eq">R–CH=CH₂ + BH₃·THF → R–CH(B)–CH₃ → H₂O₂/NaOH → R–CH(OH)–CH₃... NO!</div>
    <div class="detail-eq">CH₂=CHR + BH₃·THF (syn, anti-Markov) → H₂O₂/NaOH → R–CH₂–CH₂OH (primary!)</div>
    </div>
    <div class="detail-section"><div class="detail-section-title">MECHANISM</div>
    <div class="mechanism-step"><div class="step-num">1</div><div class="step-text">Syn addition: Concerted 4-centered TS. B attacks less hindered carbon (anti-Markovnikov). H and B add to SAME face (syn addition).</div></div>
    <div class="mechanism-step"><div class="step-num">2</div><div class="step-text">Oxidation: H₂O₂ in basic solution oxidizes C–B bond with RETENTION of configuration. Boron replaced by OH.</div></div>
    </div>
    <div class="detail-section"><div class="detail-section-title">KEY FEATURES</div>
    <p class="detail-text">• Anti-Markovnikov regiochemistry (OH ends up on terminal C for terminal alkenes)<br>• syn stereochemistry (H and OH on same face)<br>• No rearrangements<br>• Internal alkenes → racemic mixture at both carbons</p>
    </div>
  `},
};

function showDetail(key){
  const d=reactionDetails[key];
  const content=document.getElementById('detailContent');
  if(d){
    content.innerHTML=`<div class="detail-title">${d.title}</div><div class="detail-subtitle">${d.sub}</div>${d.body}`;
  } else {
    const title=key.replace(/[_-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
    content.innerHTML=`<div class="detail-title">${title}</div><div class="detail-subtitle">Book Chapter Style Notes</div>
      <div class="detail-section"><div class="detail-section-title">INTRODUCTION</div><p class="detail-text">${title} is an important organic chemistry topic that should be studied through structure, reactivity, mechanism, and application. Understanding the logic behind the topic is more useful than memorizing isolated facts.</p></div>
      <div class="detail-section"><div class="detail-section-title">CORE IDEA</div><p class="detail-text">Start by identifying the functional group or reactive center. Then analyze electronic effects, steric effects, solvent, reagent strength, leaving group ability, and possible intermediates. These factors usually decide the major product and reaction pathway.</p></div>
      <div class="detail-section"><div class="detail-section-title">WHAT TO STUDY</div><ul class="checklist-bullets"><li>Definition and key terms</li><li>General structure or reaction pattern</li><li>Important examples and exceptions</li><li>Mechanism or electron-flow logic</li><li>Applications in synthesis and pharma R&D</li></ul></div>
      <div class="detail-section"><div class="detail-section-title">INTERVIEW NOTE</div><p class="detail-text">For a strong interview answer, give the definition first, then one example, then explain the reason using mechanism, stability, selectivity, or practical limitation.</p></div>
      <div class="detail-section"><div class="detail-section-title">SUMMARY</div><p class="detail-text">Revise ${title} as a concept-based chapter: definition, mechanism, examples, limitations, and applications. This makes the topic useful for exams, synthesis planning, and problem solving.</p></div>`;
  }
  openDetailPanel();
}

const reactionCategoryDetails={
  add:{sub:'Addition and C-C bond formation',eq:'Nucleophile or pi partner + electrophile -> addition product',conditions:'Often base, acid, Lewis acid, or organometallic reagent; exclude water when strong organometallics are used.',mech:['Generate the reactive nucleophile, enol/enolate, ylide, or pi partner.','Attack the electrophilic carbonyl, imine, alkene, or activated pi system.','Protonation, dehydration, or workup gives the isolated product.'],select:'Regiochemistry and stereochemistry depend on sterics, electronics, and whether the pathway is concerted or stepwise.',limit:'Competing self-condensation, proton transfer, and over-addition are common checks.'},
  sub:{sub:'Substitution and functional group exchange',eq:'R-LG + Nu -> R-Nu + LG',conditions:'Good leaving group, suitable nucleophile, and solvent chosen for SN1, SN2, or aromatic substitution.',mech:['Activate or ionize the leaving group.','Nucleophile replaces the leaving group directly or after an intermediate forms.','Workup removes salts, catalyst, or acid/base additives.'],select:'SN2 gives inversion; SN1 may racemize; aromatic reactions follow directing effects.',limit:'Steric hindrance, poor leaving groups, and competing elimination can dominate.'},
  elim:{sub:'Elimination and alkene formation',eq:'Substrate with beta H + base/heat -> alkene',conditions:'Strong base or heat; bulky bases shift products toward less substituted alkenes.',mech:['Base or heat activates the substrate.','A beta hydrogen and leaving group are removed.','The double bond forms, often under Zaitsev or Hofmann control.'],select:'Anti-periplanar geometry is crucial for E2; E1 is less stereospecific.',limit:'Substitution, rearrangement, and alkene isomer mixtures are frequent side reactions.'},
  red:{sub:'Reduction',eq:'Functional group + hydride/H2/electrons -> reduced product',conditions:'Choose NaBH4, LiAlH4, H2/catalyst, dissolving metal, or transfer hydrogenation based on strength needed.',mech:['The substrate accepts hydride, hydrogen atoms, or electrons.','An anion, radical, metal-bound, or alcoholate intermediate forms.','Protonation/workup releases the reduced product.'],select:'Chemoselectivity depends strongly on reagent strength and functional group tolerance.',limit:'Over-reduction and incompatibility with water, acid, or reducible groups must be checked.'},
  ox:{sub:'Oxidation',eq:'Substrate + oxidant -> higher oxidation-state product',conditions:'Mild oxidants for selectivity; stronger chromium, permanganate, ozone, or peroxide systems for deep oxidation.',mech:['Oxidant activates the alcohol, alkene, arene, or carbonyl derivative.','Electron transfer, oxygen transfer, or rearrangement changes oxidation state.','Hydrolysis or workup reveals the product.'],select:'Water content and workup often decide aldehyde versus acid or diol versus cleavage.',limit:'Strong oxidants can be nonselective and damage sensitive groups.'},
  rearr:{sub:'Rearrangement',eq:'Activated substrate -> migrated skeleton or functional group isomer',conditions:'Acid, heat, Lewis acid, base, or azide/nitrene conditions depending on reaction.',mech:['Activation creates a cation, oxime, acyl azide, nitrene, or cyclic transition state.','A hydride, alkyl, aryl, or acyl group migrates with its bonding pair.','Capture, hydrolysis, or tautomerization gives product.'],select:'Migratory aptitude and antiperiplanar/orbital alignment decide the major product.',limit:'Mixtures occur when more than one migration or rearrangement path is possible.'},
  cyclo:{sub:'Cycloaddition and ring construction',eq:'Pi systems or dipoles -> cyclic product',conditions:'Heat, light, Lewis acid, or metal catalyst depending on orbital symmetry.',mech:['Reactive partners align their frontier orbitals.','Two new sigma bonds form concertedly or stepwise.','The cyclic product retains much of the starting stereochemical information.'],select:'Endo/exo preference, regioselectivity, and stereospecificity are central.',limit:'Wrong conformation, poor electronics, or photochemical side reactions reduce yield.'},
  coup:{sub:'Metal-catalysed coupling',eq:'Organic halide/pseudohalide + organometallic/partner -> coupled product',conditions:'Pd, Ni, or Cu catalyst with ligand, base, and dry or aqueous solvent as required.',mech:['Oxidative addition places the electrophile on the metal.','Transmetalation, insertion, or ligand exchange adds the second partner.','Reductive elimination forms the new bond and regenerates catalyst.'],select:'Ligand, halide, base, and partner electronics control rate and selectivity.',limit:'Air/water sensitivity, homocoupling, beta-hydride elimination, or toxic reagents may matter.'}
};

const reactionSpecifics={
  'Grignard':['Organomagnesium addition','R-X + Mg -> R-MgX; then C=O -> alcohol','Dry ether/THF, anhydrous glassware, acidic workup','Strong carbon nucleophile adds to aldehydes, ketones, esters, CO2, or epoxides.','Carbonyl attack gives alkoxide; H3O+ gives alcohol.','Water, alcohols, acids, and amines destroy the reagent.'],
  'Aldol':['Enolate carbonyl addition','enolate + aldehyde/ketone -> beta-hydroxy carbonyl -> enone','NaOH, NaOEt, LDA, or acid; control crossed partners','Builds beta-hydroxy carbonyls and alpha,beta-unsaturated carbonyls.','Enolate formation, carbonyl addition, protonation, then optional dehydration.','Mixed aldols give mixtures unless one partner is controlled.'],
  'Wittig':['Phosphorus ylide olefination','Ph3P=CHR + carbonyl -> alkene + Ph3P=O','Phosphonium salt plus strong base, THF/ether/DMSO','Converts aldehydes and ketones to alkenes with predictable carbon placement.','Ylide addition gives oxaphosphetane; collapse forms alkene.','Unstabilized ylides favor Z; stabilized ylides often favor E.'],
  'Diels-Alder':['Thermal [4+2] cycloaddition','s-cis diene + dienophile -> cyclohexene','Heat or Lewis acid; electron-rich diene plus electron-poor dienophile','Concerted six-electron reaction that rapidly builds six-membered rings.','One cyclic transition state forms two sigma bonds and one pi bond.','Endo kinetic product is common; diene must access s-cis.'],
  'Michael':['1,4-conjugate addition','soft Nu + enone/enoate -> beta-substituted carbonyl','Enolates, amines, thiols, cuprates, organocatalysts','Adds nucleophiles to the beta carbon of activated alkenes.','Nucleophile attacks beta carbon, enolate forms, protonation restores carbonyl.','Hard organometallics may give 1,2-addition instead.'],
  'Reformatsky':['Zinc enolate addition','alpha-halo ester + Zn + carbonyl -> beta-hydroxy ester','Zn in dry ether/THF; iodine or Cu salts can activate','Mild organozinc route to beta-hydroxy esters.','Zinc inserts into C-X; zinc enolate adds to carbonyl; workup protonates.','Very hindered carbonyls and wet conditions reduce reliability.'],
  'Mannich':['Aminomethylation','enolizable carbonyl + aldehyde + amine -> beta-aminocarbonyl','Amine, formaldehyde/aldehyde, mild acid','Installs aminomethyl groups alpha to carbonyls through iminium ions.','Iminium formation, enol attack, deprotonation.','Over-alkylation and aldol competition are possible.'],
  'Knoevenagel':['Active methylene condensation','aldehyde + malonate/cyanoacetate -> electron-poor alkene','Piperidine, pyridine, ammonium acetate, weak amine base','Condenses aldehydes with acidic methylene compounds.','Carbanion addition to carbonyl followed by dehydration.','Ketones are slower; E alkene usually dominates.'],
  'Perkin':['Aromatic aldehyde condensation','Ar-CHO + acid anhydride -> cinnamic acid derivative','Anhydride plus sodium/potassium carboxylate, heat','Prepares cinnamic acids from aromatic aldehydes.','Anhydride enolate adds, eliminates, then hydrolyzes.','Best with aromatic aldehydes; aliphatic substrates give side reactions.'],
  'Henry (Nitroaldol)':['Nitroaldol addition','nitroalkane + carbonyl -> beta-nitro alcohol','Base or organocatalyst, low to room temperature','Makes beta-nitro alcohols and nitroalkenes.','Nitronate attacks carbonyl; protonation gives alcohol; dehydration optional.','Retro-Henry and dehydration compete under harsh conditions.'],
  'Claisen':['Ester enolate condensation','ester + ester -> beta-keto ester','Matching alkoxide base, then acid workup','Couples esters through acyl substitution.','Ester enolate attacks ester; alkoxide leaves; acidic workup.','Requires alpha hydrogens and can scramble if alkoxide mismatches.'],
  'Robinson Annul.':['Michael plus aldol annulation','enolate + enone -> cyclohexenone','Base or amine in protic solvent, controlled heat','Builds cyclohexenone rings from carbonyl/enone partners.','Michael addition, intramolecular aldol, dehydration.','Polymerization and over-annulation can occur.'],
  'SN2':['Backside substitution','Nu- + R-LG -> R-Nu','Strong nucleophile, polar aprotic solvent','Concerted substitution strongest for methyl and primary substrates.','Backside attack and leaving-group departure occur together.','Inversion at stereocenter; tertiary centers fail.'],
  'SN1':['Carbocation substitution','R-LG -> R+ -> R-Nu','Polar protic solvent, weak nucleophile, good leaving group','Stepwise substitution favored by tertiary, allylic, or benzylic substrates.','Ionization, nucleophile attack, deprotonation.','Racemization, rearrangement, and E1 elimination compete.'],
  'Friedel-Crafts':['Electrophilic aromatic substitution','Ar-H + RCl/RCOCl + AlCl3 -> Ar-R/Ar-COR','Anhydrous AlCl3, FeCl3, or BF3','Alkylates or acylates activated aromatic rings.','Electrophile generation, sigma complex formation, deprotonation.','Deactivated rings fail; alkylations rearrange and polyalkylate.'],
  'Sandmeyer':['Diazonium replacement','Ar-N2+ + CuX -> Ar-X + N2','NaNO2/HX at 0-5 C, then CuCl/CuBr/CuCN','Converts anilines into aryl halides or nitriles via diazonium salts.','Diazotization, copper-mediated radical/ligand transfer, nitrogen loss.','Diazonium salts are temperature-sensitive.'],
  'Finkelstein':['Halide exchange','R-Cl/R-Br + NaI -> R-I','NaI in dry acetone','SN2 exchange driven by precipitation of NaCl/NaBr.','Iodide backside attack displaces chloride or bromide.','Best for primary substrates; tertiary gives elimination or no SN2.'],
  'Menschutkin':['Quaternary ammonium formation','R3N + R-X -> R4N+ X-','Polar solvent, alkyl iodide/tosylate, heat if needed','Alkylates tertiary amines to ammonium salts.','Amine performs SN2 attack on alkyl electrophile.','Hindered halides react slowly and may eliminate.'],
  'Gabriel':['Primary amine synthesis','phthalimide anion + R-X -> R-NH2 after cleavage','K phthalimide then hydrazine or hydrolysis','Makes primary amines without over-alkylation.','SN2 N-alkylation followed by imide cleavage.','Aryl, vinyl, tertiary, and hindered halides are poor.'],
  'Mitsunobu':['Alcohol substitution inversion','ROH + HNu + PPh3 + DIAD -> R-Nu','PPh3, DEAD/DIAD, acidic pronucleophile','Converts alcohols into substituted products under mild conditions.','Oxyphosphonium formation, SN2 attack, phosphine oxide formation.','Secondary alcohols invert; tertiary alcohols fail.'],
  'Balz-Schiemann':['Aryl fluoride synthesis','Ar-N2+ BF4- -> Ar-F + BF3 + N2','Diazotize in HBF4, isolate salt, heat','Replaces diazonium groups by fluorine.','Thermal diazonium tetrafluoroborate decomposition gives aryl fluoride.','Requires careful diazonium salt handling.'],
  'Buchwald-Hartwig':['Pd C-N coupling','Ar-X + amine -> Ar-NR2','Pd ligand, strong or carbonate base, toluene/dioxane','Forms aryl amines from aryl halides and amines.','Oxidative addition, amido-Pd formation, reductive elimination.','Base-sensitive substrates need tuned ligands/conditions.'],
  'E2 Elimination':['Concerted beta elimination','base + R-CH2-CH(LG)-R -> alkene','Strong base, heat; bulky bases for Hofmann product','One-step beta-H removal and leaving-group loss.','Anti-periplanar C-H and C-LG bonds break as C=C forms.','Competes with SN2 on primary substrates.'],
  'E1 Elimination':['Carbocation elimination','R-LG -> carbocation -> alkene','Weak base, polar protic solvent, heat','Stepwise elimination through a carbocation.','Ionization, beta deprotonation, alkene formation.','Rearrangements and SN1 substitution compete.'],
  'Cope Elim.':['Amine oxide syn elimination','amine oxide -> alkene + hydroxylamine','Oxidize tertiary amine, then heat','Neutral thermal elimination of amine oxides.','Five-membered cyclic transition state removes syn beta H.','Requires accessible syn beta hydrogen.'],
  'Hofmann Elim.':['Ammonium elimination','R4N+OH- -> least substituted alkene','Exhaustive methylation, Ag2O/H2O, heat','Gives Hofmann alkene from quaternary ammonium salts.','Quaternary salt forms hydroxide; E2 elimination on heating.','Often gives mixtures when beta hydrogens are similar.'],
  'Chugaev':['Xanthate pyrolysis','alcohol -> xanthate -> alkene','CS2/base, MeI, heat','Dehydrates alcohols by syn elimination under neutral conditions.','Xanthate forms; cyclic transition state eliminates to alkene.','Sulfur byproducts and extra steps are drawbacks.'],
  'Zaitsev Rule':['Elimination selectivity','elimination -> more substituted alkene','Small bases or acid-catalysed equilibrating conditions','Predicts the more substituted alkene as major product.','Product/transition-state stability favors substituted C=C.','Bulky bases and ammonium leaving groups often violate it.'],
  'Clemmensen':['Acidic carbonyl reduction','aldehyde/ketone -> methylene','Zn(Hg), concentrated HCl, heat','Reduces carbonyls to hydrocarbons under acidic conditions.','Metal-surface electron/proton transfers remove oxygen.','Acid-sensitive groups are incompatible.'],
  'Wolff-Kishner':['Basic carbonyl reduction','aldehyde/ketone + NH2NH2/base -> methylene','Hydrazine, KOH, heat; Huang-Minlon variant','Reduces carbonyls to hydrocarbons under basic conditions.','Hydrazone formation, base-promoted N2 loss, protonation.','Heat/base-sensitive molecules suffer.'],
  'Birch Reduction':['Arene partial reduction','arene + Na/NH3/ROH -> 1,4-cyclohexadiene','Na/Li/K in liquid NH3 with alcohol','Converts aromatic rings into unconjugated dienes.','Electron transfer, protonation, second electron transfer, protonation.','Substituents control regioselectivity; reducible groups may not survive.'],
  'Lindlar':['Alkyne to cis alkene','alkyne + H2/Lindlar -> Z-alkene','H2, poisoned Pd/CaCO3, quinoline','Partially hydrogenates alkynes to cis alkenes.','Syn hydrogen addition on poisoned metal surface.','Over-reduction occurs if catalyst is not poisoned/monitored.'],
  'NaBH4 Reduction':['Mild carbonyl reduction','aldehyde/ketone -> alcohol','NaBH4 in MeOH/EtOH/water/THF','Selective hydride reduction of aldehydes and ketones.','Hydride attack gives alkoxide; protonation gives alcohol.','Usually too mild for esters, acids, and amides.'],
  'LiAlH4':['Strong hydride reduction','esters/acids/amides/carbonyls -> alcohols/amines','Dry ether/THF, careful aqueous workup','Powerful reducer for many polar functional groups.','Hydride transfer, collapse/repeated reduction, protonation on workup.','Violently water-reactive and often nonselective.'],
  'DIBAL-H':['Controlled partial reduction','ester/nitrile -> aldehyde','DIBAL-H at -78 C, then careful quench','Stops ester or nitrile reductions at aldehydes when cold.','Hydride addition forms aluminum-bound intermediate; hydrolysis releases aldehyde.','Excess reagent or warmth over-reduces.'],
  'Meerwein-Ponndorf-Verley':['Transfer hydrogenation','carbonyl + i-PrOH -> alcohol + acetone','Al(O-i-Pr)3 in isopropanol','Mild, chemoselective carbonyl reduction.','Six-membered transition state transfers hydride from isopropoxide.','Equilibrium and sterics can slow reaction.'],
  'Swern Oxidation':['Mild alcohol oxidation','1 alcohol -> aldehyde; 2 alcohol -> ketone','DMSO, oxalyl chloride, Et3N, -78 C','Chromium-free oxidation of alcohols.','Activated DMSO forms alkoxysulfonium salt; base eliminates.','Dimethyl sulfide odor; temperature control matters.'],
  'Jones Reagent':['Strong chromic oxidation','1 alcohol -> acid; 2 alcohol -> ketone','CrO3/H2SO4 in acetone-water','Oxidizes alcohols strongly, often to acids for primary alcohols.','Chromate ester formation and elimination; aldehyde hydrates over-oxidize.','Not aldehyde-selective and uses toxic chromium.'],
  'PCC Oxidation':['Anhydrous chromium oxidation','1 alcohol -> aldehyde; 2 alcohol -> ketone','PCC in CH2Cl2, dry conditions','Stops primary alcohol oxidation at aldehydes.','Chromate ester formation followed by elimination to carbonyl.','Acidic chromium waste and sensitive groups are concerns.'],
  'Dess-Martin':['Hypervalent iodine oxidation','alcohol -> aldehyde/ketone','Dess-Martin periodinane, CH2Cl2, room temperature','Very mild oxidation of primary and secondary alcohols.','Alcohol forms alkoxyiodinane; elimination gives carbonyl.','Moisture and reagent handling require care.'],
  'Baeyer-Villiger':['Ketone oxygen insertion','ketone + peracid -> ester/lactone','mCPBA or peracid; sometimes H2O2/Lewis acid','Inserts oxygen next to carbonyl, expanding cyclic ketones to lactones.','Criegee intermediate rearranges with migration to oxygen.','Migratory aptitude controls product; peracids can epoxidize alkenes.'],
  'Wacker':['Alkene to ketone oxidation','terminal alkene -> methyl ketone','PdCl2, CuCl, O2, water/DMF','Markovnikov oxidation of alkenes.','Pd-alkene complex, water attack, beta-hydride elimination, Pd reoxidation.','Internal alkenes may give mixtures.'],
  'Ozonolysis':['Alkene cleavage','alkene + O3 -> carbonyl fragments','O3 at low temperature; Me2S/Zn or H2O2 workup','Cleaves double bonds into aldehydes, ketones, or acids.','Molozonide formation, ozonide rearrangement, workup cleavage.','Ozonides are hazardous; workup determines oxidation level.'],
  'Sharpless Epox.':['Asymmetric epoxidation','allylic alcohol -> chiral epoxy alcohol','Ti(OiPr)4, TBHP, (+)/(-)-DET, sieves','Enantioselective epoxidation of allylic alcohols.','Titanium-tartrate complex delivers oxygen to one alkene face.','Requires allylic alcohol coordination.'],
  'OsO4 Dihydrox.':['Syn dihydroxylation','alkene -> cis-1,2-diol','Catalytic OsO4 with NMO/H2O2','Adds two OH groups to the same face of an alkene.','Cyclic osmate ester forms, then hydrolysis gives diol.','OsO4 is highly toxic.'],
  'KMnO4':['Permanganate oxidation','cold dilute -> cis diol; hot strong -> cleavage','Cold dilute basic or hot concentrated KMnO4','Condition-dependent alkene oxidation.','Cyclic manganate ester gives diol; harsher conditions cleave.','Strong, nonselective oxidant.'],
  'Pinacol Rearr.':['Diol to carbonyl rearrangement','vicinal diol + acid -> ketone/aldehyde','Strong acid or Lewis acid','Turns 1,2-diols into carbonyls by 1,2-shift.','Water loss creates cation; group migrates; carbonyl forms.','Migratory aptitude can give mixtures.'],
  'Beckmann':['Oxime to amide','ketoxime -> amide/lactam','Acid, PCl5, SOCl2, TsCl/base, PPA','Rearranges oximes to amides; cyclic oximes give lactams.','Anti group migrates as activated oxime loses leaving group.','Oxime E/Z mixture gives product mixture.'],
  'Cope Rearr.':['[3,3] sigmatropic rearrangement','1,5-diene -> rearranged 1,5-diene','Heat; oxy-Cope can be anion-accelerated','Concerted rearrangement through a six-membered transition state.','Six electrons shift in a chair-like transition state.','Needs suitable diene geometry and thermal stability.'],
  'Claisen Rearr.':['Allyl vinyl ether rearrangement','allyl vinyl ether -> unsaturated carbonyl','Heat; Johnson/Ireland variants','[3,3] rearrangement forming C-C bond and carbonyl.','Chair-like transition state, then enol-to-carbonyl tautomerization.','Requires allyl vinyl ether precursor.'],
  'Fries Rearr.':['Aryl ester acyl migration','Ar-O-COR -> o/p-HO-Ar-COR','AlCl3 or BF3, heat','Moves acyl group from oxygen to aromatic ring.','Lewis acid generates acylium character; ring acylates o/p.','Harsh Lewis acids limit sensitive groups.'],
  'Curtius':['Acyl azide rearrangement','RCON3 -> RNCO -> amine/carbamate/urea','Acyl azide heat or DPPA/base','Converts acid derivatives to isocyanates with N2 loss.','Acyl azide loses N2; R migrates to nitrogen; nucleophile traps isocyanate.','Azides/isocyanates require care.'],
  'Hofmann Rearr.':['Amide degradation','RCONH2 + Br2/NaOH -> RNH2','Br2/NaOH or NaOCl/NaOH','Primary amide to amine with one fewer carbon.','N-bromoamide, rearrangement to isocyanate, hydrolysis/decarboxylation.','Only primary amides fit the classic reaction.'],
  'Schmidt':['Azide carbonyl rearrangement','carbonyl + HN3/acid -> amide/amine products','Hydrazoic acid or safer azide variants in acid','Rearranges acids/ketones using azide chemistry.','Azide addition, N2 loss, migration, hydrolysis.','HN3 is highly hazardous.'],
  'Wagner-Meerwein':['Carbocation skeletal shift','carbocation -> rearranged carbocation','Acid, Lewis acid, solvolysis conditions','Hydride or alkyl shifts make more stable cations.','Cation forms; 1,2-shift occurs; capture/elimination follows.','Multiple rearrangements can scramble skeletons.'],
  'Bamford-Stevens':['Tosylhydrazone olefination','tosylhydrazone + base -> alkene + N2','Strong base; solvent controls ionic/carbene path','Converts aldehydes/ketones to alkenes via tosylhydrazones.','Deprotonation, diazo formation, N2 loss, alkene formation.','Strong base and diazo chemistry limit scope.'],
  'Suzuki':['Pd cross-coupling','Ar-X + Ar-B(OH)2 -> Ar-Ar','Pd catalyst, base, aqueous organic solvent','Couples organoboron reagents with aryl/vinyl halides.','Oxidative addition, transmetalation, reductive elimination.','Protodeboronation and aryl chlorides need optimization.'],
  'Heck':['Pd alkene arylation','Ar-X + alkene -> substituted alkene','Pd catalyst, base, heat','Couples aryl/vinyl halides with alkenes.','Oxidative addition, alkene insertion, beta-hydride elimination.','Often gives E alkene; regioisomers possible.'],
  'Sonogashira':['Pd/Cu alkyne coupling','Ar-X + terminal alkyne -> Ar-C#C-R','Pd catalyst, CuI, amine base','Forms aryl/vinyl alkynes.','Oxidative addition, copper acetylide transmetalation, reductive elimination.','Copper can cause Glaser homocoupling.'],
  'Negishi':['Organozinc coupling','R-ZnX + R-X -> R-R','Pd or Ni catalyst, THF/DMF','Couples organozinc reagents with halides.','Oxidative addition, zinc transmetalation, reductive elimination.','Organozincs are moisture sensitive.'],
  'Stille':['Organotin coupling','R-SnBu3 + R-X -> R-R','Pd catalyst, often LiCl/CuI additives','Reliable coupling with organostannanes.','Oxidative addition, tin transmetalation, reductive elimination.','Organotin toxicity and purification are major drawbacks.'],
  'Kumada':['Grignard coupling','R-MgX + R-X -> R-R','Ni or Pd catalyst in ether/THF','Cross-coupling using Grignard reagents.','Oxidative addition, transmetalation, reductive elimination.','Poor functional group tolerance.'],
  'Ullmann':['Copper aryl coupling','Ar-X + Cu -> Ar-Ar or Ar-heteroatom','Copper, heat; modern ligand variants milder','Copper-mediated aryl-aryl or aryl-heteroatom bond formation.','Aryl copper species form and combine/substitute.','Classical conditions are harsh.'],
  'Glaser':['Oxidative alkyne coupling','2 terminal alkynes + O2/Cu -> diyne','Cu salt, amine, oxygen','Homocouples terminal alkynes to diynes.','Copper acetylide formation and oxidative coupling.','Unsymmetrical cross-coupling is difficult.'],
  '[4+2] Diels-Alder':['[4+2] cycloaddition','diene + dienophile -> cyclohexene','Heat or Lewis acid','Six-electron ring construction with stereospecificity.','Concerted orbital overlap forms two sigma bonds.','Endo selectivity common; s-cis diene needed.'],
  '[2+2] Cycloadd.':['Cyclobutane formation','alkene + alkene -> cyclobutane','UV light or sensitizer; ketenes can react thermally','Forms four-membered rings by photochemical cycloaddition.','Excited alkene adds, then ring closes.','Photochemical mixtures are common.'],
  'Huisgen 1,3-dipolar':['1,3-dipolar cycloaddition','azide + alkyne -> triazole','Heat, or Cu(I) for click reaction','Builds five-membered heterocycles from dipoles and dipolarophiles.','Concerted cycloaddition forms two sigma bonds.','Uncatalysed reactions are slow and regioisomeric.'],
  'Paterno-Büchi':['Photochemical oxetane synthesis','carbonyl + alkene + hv -> oxetane','UV light, often sensitizer','Forms oxetanes from excited carbonyls and alkenes.','Excited carbonyl adds to alkene; diradical closes.','Norrish and regioisomer side reactions occur.'],
  'Corey-Chaykovsky':['Sulfur ylide reaction','carbonyl + sulfur ylide -> epoxide','Sulfonium/sulfoxonium salt plus base','Makes epoxides or cyclopropanes from sulfur ylides.','Ylide addition followed by intramolecular displacement.','Hindered or acidic substrates are difficult.'],
  'Julia Olefination':['Sulfone olefination','sulfone anion + aldehyde -> alkene','Strong base; Kocienski variant milder','Forms alkenes from sulfones and carbonyls.','Sulfone anion addition then elimination/reductive fragmentation.','Classical versions may need extra steps.'],
  'HWE Reaction':['Phosphonate olefination','phosphonate anion + carbonyl -> alkene','NaH, NaOMe, KHMDS, or DBU','Wittig-like route, often E-selective for enoates/enones.','Carbanion addition and phosphate elimination.','Ketones react more slowly.'],
  'Peterson Olefin.':['Silyl olefination','alpha-silyl carbanion + carbonyl -> alkene','Organosilane anion then acid or base','Acid/base-controlled alkene synthesis from beta-hydroxysilanes.','Addition makes beta-hydroxysilane; elimination gives alkene.','Requires organosilicon precursor.'],
  'Stork Enamine':['Enamine alkylation','ketone -> enamine -> alpha-substituted carbonyl','Secondary amine, electrophile, hydrolysis','Controlled enolate equivalent for alpha functionalization.','Enamine formation, electrophile attack, iminium hydrolysis.','SN2 limitations apply to alkylation partner.'],
  'Hydroboration':['Anti-Markovnikov hydration','alkene + BH3; H2O2/NaOH -> alcohol','BH3.THF or 9-BBN, then peroxide/base','Hydrates alkenes without carbocation rearrangement.','Concerted syn hydroboration then oxidation with retention.','Use bulky boranes for selectivity.'],
  'Paal-Knorr':['Five-membered heterocycle synthesis','1,4-dicarbonyl -> pyrrole/furan/thiophene','Amine, acid, or sulfur reagent','Makes pyrroles, furans, and thiophenes from 1,4-dicarbonyls.','Condensation, cyclization, dehydration/aromatization.','Needs a suitable 1,4-dicarbonyl.'],
  'Hantzsch Pyridine':['Dihydropyridine synthesis','aldehyde + 2 beta-ketoesters + NH3 -> DHP','Ammonium acetate, ethanol, heat','Multicomponent route to dihydropyridines/pyridines.','Enamine and Knoevenagel partners combine, cyclize, dehydrate.','Unsymmetrical variants can give mixtures.'],
  'Biginelli':['Dihydropyrimidinone synthesis','aldehyde + beta-ketoester + urea -> DHPM','Acid catalyst, ethanol or solvent-free heat','Three-component synthesis of DHPM heterocycles.','Iminium formation, enol addition, cyclization/dehydration.','Aldehyde electronics strongly affect rate.'],
  'Dakin Reaction':['Aryl carbonyl to phenol oxidation','o/p-hydroxy aryl aldehyde + H2O2/base -> phenol','H2O2 with base or buffer','Oxidizes activated aryl aldehydes/ketones to phenols.','Peroxide addition, aryl migration, ester hydrolysis.','Requires ortho/para donating OH or NH2 activation.']
};

const reactionAliases={
  'NaBH₄ Reduction':'NaBH4 Reduction',
  'LiAlH₄':'LiAlH4',
  'OsO₄ Dihydrox.':'OsO4 Dihydrox.',
  'KMnO₄':'KMnO4'
};

const reactionDiagrams={
  'Grignard':{file:'Grignard reaction scheme.svg',source:'Wikimedia Commons',license:'Public domain / Commons file page'},
  'Aldol':{file:'Simple aldol reaction.svg',source:'Wikimedia Commons',license:'Commons file page'},
  'Wittig':{file:'Wittig Reaktion.svg',source:'Wikimedia Commons',license:'Commons file page'},
  'Diels-Alder':{file:'Diels-Alder.svg',source:'Wikimedia Commons',license:'CC BY-SA 3.0 / GFDL'},
  '[4+2] Diels-Alder':{file:'Diels-Alder.svg',source:'Wikimedia Commons',license:'CC BY-SA 3.0 / GFDL'},
  'Heck':{file:'Heck reaction (example).svg',source:'Wikimedia Commons',license:'Public domain / Commons file page'},
  'Sonogashira':{file:'Sonogashira Catalytic Cycle.svg',source:'Wikimedia Commons',license:'Commons file page'},
  'Suzuki':{file:'Microreactor 2 Suzuki.svg',source:'Wikimedia Commons',license:'Commons file page'}
};

function commonsFileUrl(file){
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`;
}
function commonsPageUrl(file){
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(' ','_'))}`;
}
function renderReactionDiagram(diagram){
  if(!diagram) return '';
  const src=commonsFileUrl(diagram.file);
  const page=commonsPageUrl(diagram.file);
  return `<div class="detail-section"><div class="detail-section-title">SVG REACTION SCHEME</div>
    <div class="reaction-diagram"><img src="${src}" alt="${diagram.file}" loading="lazy">
    <div class="diagram-credit">Source: <a href="${page}" target="_blank" rel="noopener">${diagram.source}: ${diagram.file}</a> · ${diagram.license}</div></div></div>`;
}

function buildReactionDetail(name){
  const key=reactionAliases[name]||name;
  const base=reactions.find(r=>r.n===name)||{};
  const cat=reactionCategoryDetails[base.cat]||reactionCategoryDetails.add;
  const s=reactionSpecifics[key];
  if(!s){
    return {sub:cat.sub,eq:cat.eq,conditions:cat.conditions,overview:'A named reaction used for '+cat.sub.toLowerCase()+'.',mech:cat.mech,select:cat.select,limit:cat.limit};
  }
  return {sub:s[0],eq:s[1],conditions:s[2],overview:s[3],mech:[s[4],cat.mech[1],cat.mech[2]],select:s[5],limit:cat.limit};
}

function showReactionDetail(name){
  const panel=document.getElementById('detailPanel');
  const content=document.getElementById('detailContent');
  const d=buildReactionDetail(name);
  const diagram=renderReactionDiagram(reactionDiagrams[name]||reactionDiagrams[reactionAliases[name]]);
  const steps=d.mech.map((step,i)=>`<div class="mechanism-step"><div class="step-num">${i+1}</div><div class="step-text">${step}</div></div>`).join('');
  content.innerHTML=`<div class="detail-title">${name}</div><div class="detail-subtitle">${d.sub}</div>
    <div class="detail-section"><div class="detail-section-title">REACTION</div><div class="detail-eq">${d.eq}</div><p class="detail-text">${d.overview}</p></div>
    ${diagram}
    <div class="detail-section"><div class="detail-section-title">COMMON CONDITIONS</div><p class="detail-text">${d.conditions}</p></div>
    <div class="detail-section"><div class="detail-section-title">MECHANISM</div>${steps}</div>
    <div class="detail-section"><div class="detail-section-title">STEREOCHEMISTRY / SELECTIVITY</div><p class="detail-text">${d.select}</p></div>
    <div class="detail-section"><div class="detail-section-title">LIMITATIONS</div><p class="detail-text">${d.limit}</p></div>`;
  openDetailPanel();
}
function openDetailPanel(){
  const panel=document.getElementById('detailPanel');
  panel.scrollTop=0;
  panel.classList.add('open');
  document.getElementById('backdrop').classList.add('open');
  document.body.classList.add('detail-open');
}
function closeDetail(){
  document.getElementById('detailPanel').classList.remove('open');
  document.getElementById('backdrop').classList.remove('open');
  document.body.classList.remove('detail-open');
}

const masterTopicDetails={
  1:['Basic Concepts','Organic compounds are carbon-based molecules whose properties come from covalent bonding, carbon catenation, functional groups, and molecular shape.','Know classification by chain/ring, saturated/unsaturated, aliphatic/aromatic, homocyclic/heterocyclic, and functional group priority.','Interview focus: hybridization, bond angle, bond length, polarity, and why carbon forms stable chains.'],
  2:['Electronic Effects','Electronic effects explain how electrons shift through sigma and pi frameworks and control acidity, stability, and reactivity.','Inductive effect works through sigma bonds; mesomeric/resonance works through pi conjugation; hyperconjugation stabilizes electron-deficient centers; electromeric effect is temporary under reagent attack.','Use this to predict carbocation stability, directing effects, nucleophilicity, acidity, and product selectivity.'],
  3:['Acid-Base Chemistry','Organic acid-base chemistry is mostly about conjugate base stability and electron availability.','Lower pKa means stronger acid. Acidity increases with electronegativity, resonance, inductive withdrawal, hybridization s-character, and solvation. Basicity decreases when the lone pair is delocalized or poorly solvated.','Classic comparisons: carboxylic acid > phenol > alcohol; terminal alkyne more acidic than alkene/alkane.'],
  4:['Reaction Intermediates','Reactive intermediates are short-lived species that connect mechanism to product.','Carbocations are electron-poor and rearrange; carbanions are electron-rich and basic/nucleophilic; radicals have one unpaired electron; carbenes and nitrenes are neutral electron-deficient species.','Stability usually follows resonance, hyperconjugation, substitution, and inductive effects.'],
  5:['Reaction Mechanism Fundamentals','Mechanisms describe electron flow, bond breaking, bond making, and energy changes.','Arrow pushing starts from electron-rich sites and ends at electron-poor sites. Transition states are energy maxima. Kinetic products form faster; thermodynamic products are more stable. Hammond postulate relates transition-state structure to nearby intermediates.','Mechanism thinking is more powerful than memorizing reagents.'],
  6:['Types of Organic Reactions','Most reactions fit into substitution, elimination, addition, rearrangement, oxidation, reduction, or coupling patterns.','SN1 involves carbocation; SN2 is backside concerted attack; E1 is carbocation elimination; E2 is anti-periplanar concerted elimination; addition adds across pi bonds; rearrangement changes skeleton.','Identify substrate, reagent, solvent, temperature, and leaving group first.'],
  7:['Stability Concepts','Stability decides which intermediate, alkene, conformer, or product dominates.','Intermediates stabilize by resonance, hyperconjugation, inductive donation/withdrawal, aromaticity, and solvation. Alkene stability increases with substitution and conjugation; trans often beats cis due to sterics.','Stability is the logic behind Markovnikov addition, rearrangements, and thermodynamic control.'],
  8:['Aromaticity','Aromatic systems are cyclic, planar, fully conjugated, and follow Huckel 4n+2 pi electron rule.','Aromatic compounds are unusually stable; antiaromatic systems follow 4n pi electrons and are destabilized; non-aromatic systems fail planarity or conjugation.','Benzene prefers electrophilic substitution over addition because substitution preserves aromaticity.'],
  9:['Solvent Effects','Solvents can change mechanism, rate, and product ratio.','Polar protic solvents stabilize ions and help SN1/E1; polar aprotic solvents strengthen nucleophiles and favor SN2; non-polar solvents suit radical/pericyclic or neutral pathways.','For SN2 choose DMSO/DMF/acetone/MeCN; for SN1 choose water/alcohol/acetic acid type media.'],
  10:['Intermolecular Forces','Physical properties come from molecular attractions.','Hydrogen bonding raises boiling point and solubility; dipole-dipole interactions affect polarity; London dispersion increases with size/surface area.','Use IMF to explain extraction, crystallization, distillation, TLC movement, and formulation behavior.'],
  11:['Isomerism','Isomers have the same formula but different arrangement.','Structural isomers differ in connectivity; stereoisomers differ in spatial arrangement. Chain, position, functional, metameric, tautomeric, geometrical, optical, conformational types are key.','In pharma, isomers can have different potency, toxicity, metabolism, and patents.'],
  12:['Conformational Analysis','Conformations interconvert by rotation around single bonds.','Ethane shows staggered/eclipsed; butane shows anti/gauche; cyclohexane shows chair, axial/equatorial and ring flips.','Bulky groups prefer equatorial positions; anti conformations are usually lower energy.'],
  13:['Configurational Isomerism','Configurational isomers cannot interconvert without bond breaking.','Geometrical isomerism uses E/Z or cis/trans. Optical isomerism arises from chirality and non-superimposable mirror images.','E/Z assignment follows CIP priority, not simply largest group by size.'],
  14:['Chirality','A chiral molecule is not superimposable on its mirror image.','Chiral centers, enantiomers, diastereomers, meso compounds, and stereogenic axes/planes are common sources.','Enantiomers behave differently in chiral biological systems, making this crucial for drugs.'],
  15:['Optical Activity','Optically active compounds rotate plane-polarized light.','Specific rotation depends on compound, concentration, path length, solvent, temperature and wavelength. Racemic mixtures show zero net rotation. Enantiomeric excess measures optical purity.','R/S configuration does not predict + or - rotation.'],
  16:['Configuration Rules','Cahn-Ingold-Prelog rules assign R/S and E/Z configurations.','Priority follows atomic number, then next atoms; multiple bonds are treated as duplicated atoms. Orient lowest priority away, then read 1-2-3 clockwise or anticlockwise.','Always assign priorities before trusting a drawing.'],
  17:['Hydrocarbons','Hydrocarbons contain only carbon and hydrogen.','Alkanes undergo radical substitution/combustion; alkenes undergo electrophilic addition/oxidation; alkynes undergo addition and terminal alkyne alkylation; arenes undergo EAS.','They are the backbone for functional group installation.'],
  18:['Alkyl Halides','Alkyl halides are key electrophiles for substitution and elimination.','Reactivity depends on substrate class, leaving group, nucleophile/base, solvent, and temperature. I > Br > Cl > F as leaving group ability.','Primary favors SN2; tertiary favors SN1/E1 or E2 with strong base.'],
  19:['Alcohols & Phenols','Alcohols and phenols are oxygen nucleophiles/acids with broad synthetic utility.','Alcohols undergo oxidation, substitution, esterification, dehydration, and protection. Phenols are more acidic due to resonance-stabilized phenoxide.','Convert OH to tosylate/mesylate when a better leaving group is needed.'],
  20:['Aldehydes & Ketones','Carbonyl compounds undergo nucleophilic addition at electrophilic carbonyl carbon.','Aldehydes are more reactive than ketones. Reactions include hydride reduction, Grignard addition, imine/enamine formation, acetal protection, aldol chemistry, and oxidation.','Carbonyl planarity often creates racemic alcohols after attack.'],
  21:['Carboxylic Acids','Carboxylic acids are acidic acyl compounds and precursors to acid derivatives.','They form acid chlorides, esters, amides, anhydrides and salts. Reduction usually needs LiAlH4 or borane. Fischer esterification and amide coupling are core reactions.','Acid derivative reactivity: acid chloride > anhydride > ester/acid > amide.'],
  22:['Amines & Amides','Amines are basic/nucleophilic; amides are resonance-stabilized and weakly basic.','Amines undergo alkylation, acylation, salt formation, diazotization and coupling. Amides undergo hydrolysis/reduction under stronger conditions.','Aromatic amines are less basic than aliphatic amines due to resonance.'],
  23:['Heterocycles','Heterocycles contain N, O, or S in rings and dominate medicinal chemistry.','Pyridine-like nitrogens are basic; pyrrole-like nitrogens contribute to aromaticity and are less basic. Five- and six-membered heteroaromatics are common drug scaffolds.','Heterocycles control polarity, binding, metabolism, and patent diversity.'],
  24:['Oxidation Reactions','Oxidation increases bonds to electronegative atoms or decreases C-H bonds.','Alcohols oxidize to aldehydes/ketones/acids; alkenes oxidize to diols or cleaved carbonyls; benzylic side chains oxidize to acids; sulfides oxidize to sulfoxides/sulfones.','Mild versus strong oxidant choice controls product stage.'],
  25:['Oxidising Agents','Oxidants differ in strength, selectivity, toxicity and functional group tolerance.','PCC/Swern/DMP stop primary alcohols at aldehydes; Jones/KMnO4 push primary alcohols to acids; OsO4 gives syn diols; O3 cleaves alkenes; mCPBA epoxidizes alkenes and performs Baeyer-Villiger oxidation.','In R&D, avoid harsh/toxic oxidants when a cleaner mild alternative works.'],
  26:['Reduction Reactions','Reduction decreases heteroatom bond order or adds hydrogen.','Aldehydes/ketones reduce to alcohols; nitro groups to amines; alkenes to alkanes; nitriles/amides to amines; carbonyls to methylene by Clemmensen or Wolff-Kishner.','Chemoselectivity is the main question.'],
  27:['Reducing Agents','Reducers range from mild hydrides to strong hydrides and catalytic hydrogenation.','NaBH4 reduces aldehydes/ketones; LiAlH4 reduces esters/acids/amides/nitriles too; DIBAL-H can stop esters/nitriles at aldehydes; H2/Pd reduces alkenes/nitro groups; Clemmensen and Wolff-Kishner remove C=O.','Choose reagent by functional group tolerance and workup safety.'],
  28:['Carbocation Rearrangements','Carbocation rearrangements form more stable cations by hydride or alkyl shifts.','Wagner-Meerwein rearrangement includes 1,2-hydride shift, methyl shift and ring expansion. Rearranged cation is then trapped by nucleophile or loses proton.','Always check rearrangement whenever a carbocation is formed.'],
  29:['Nitrogen Rearrangements','Nitrogen rearrangements involve migration to electron-deficient nitrogen.','Hofmann converts primary amides to amines with one fewer carbon; Curtius converts acyl azides to isocyanates; Schmidt uses azide under acid to give amide/amine derivatives.','Migration usually occurs with retention at migrating carbon.'],
  30:['Oxygen Rearrangements','Oxygen rearrangements include oxygen insertion and diol-to-carbonyl shifts.','Baeyer-Villiger oxidizes ketones to esters/lactones; Pinacol rearrangement converts vicinal diols to carbonyls after water loss and 1,2-shift.','Migratory aptitude decides major product.'],
  31:['Pericyclic Rearrangements','Pericyclic rearrangements are concerted reactions governed by orbital symmetry.','Cope rearranges 1,5-dienes; Claisen rearranges allyl vinyl ethers to unsaturated carbonyl compounds. Chair-like transition states often predict stereochemistry.','They are stereospecific and do not need ionic intermediates.'],
  32:['Cross-Coupling Reactions','Cross-couplings join two fragments using transition metals.','Suzuki uses boronic acids; Heck uses alkenes; Sonogashira uses terminal alkynes; Stille uses organotin; Negishi uses organozinc. Common cycle: oxidative addition, transmetalation/insertion, reductive elimination.','Ligand, base, halide and solvent drive optimization.'],
  33:['Homo Coupling','Homo coupling joins two identical or similar partners.','Wurtz couples alkyl halides with sodium; Glaser oxidatively couples terminal alkynes to diynes.','Useful sometimes, but in cross-coupling it can be an impurity pathway.'],
  34:['C-N / C-O Coupling','C-N and C-O couplings install heteroatoms on aryl systems.','Buchwald-Hartwig uses Pd/ligand/base for aryl amines; Ullmann uses copper systems for aryl amines/ethers and related bonds.','These are core medicinal chemistry methods for aryl amine and aryl ether synthesis.'],
  35:['Carbon-Carbon Formation','C-C bond formation builds the carbon skeleton of target molecules.','Aldol, Claisen, Wittig, Grignard, Michael, Mannich, Knoevenagel, Suzuki and related reactions are key.','Retrosynthesis often starts by identifying which C-C bond is easiest to disconnect.'],
  36:['Substitution Reactions','Named substitution reactions exchange groups with predictable scope.','Sandmeyer replaces diazonium groups; Finkelstein exchanges halides; Gabriel makes primary amines; Mitsunobu replaces alcohol OH with inversion.','Substrate class and leaving group decide pathway.'],
  37:['Oxidation / Reduction','Named redox reactions are reliable shortcuts in synthesis planning.','Swern and Dess-Martin oxidize alcohols mildly; Birch reduces arenes; Clemmensen and Wolff-Kishner reduce carbonyls to methylene; Rosenmund reduces acid chlorides to aldehydes.','Pick acidic/basic/mild conditions based on substrate stability.'],
  38:['Cyclization / Pericyclic','Cyclization and pericyclic reactions rapidly build rings.','Diels-Alder creates cyclohexenes; Paal-Knorr makes pyrroles/furans/thiophenes; Hantzsch makes dihydropyridines; Biginelli makes DHPMs; Huisgen makes triazoles.','Ring construction is often the strategic step in complex synthesis.'],
  39:['TLC','Thin-layer chromatography monitors reaction progress and checks purity quickly.','Rf depends on compound polarity, stationary phase, solvent polarity, and visualization method. More polar compounds usually travel less on silica.','Use co-spotting to compare starting material, product and reaction mixture.'],
  40:['Column Chromatography','Column chromatography separates compounds by differential adsorption.','Silica gel is polar; non-polar compounds elute first in normal phase. Solvent gradients increase eluting strength. Fractions are monitored by TLC.','Good loading and solvent choice matter more than brute force.'],
  41:['Distillation Techniques','Distillation separates liquids by volatility.','Simple distillation suits large boiling point differences; fractional distillation suits close boiling points; vacuum distillation lowers boiling point; steam distillation handles water-immiscible volatile compounds.','Useful for solvent removal, purification and scale-up.'],
  42:['Spectroscopy','Spectroscopy proves structure and purity.','IR identifies functional groups; NMR gives proton/carbon environments, integration, splitting and connectivity; MS gives molecular weight and fragmentation.','Use all spectra together, not one technique alone.'],
  43:['Impurity Profiling','Impurity profiling identifies, controls and justifies unwanted components.','Impurities can be process-related, degradation-related, residual solvents, reagents, catalysts or carryover. Purge and fate studies explain control strategy.','Critical for regulatory filings and robust process development.'],
  44:['GTI & Nitrosamine Risk','GTIs and nitrosamines require special risk assessment because of high toxicity at low levels.','Watch alkyl halides, sulfonates, epoxides, hydrazines, azides, nitrosating agents, secondary/tertiary amines and acidic nitrite conditions.','Risk control uses route design, purge, analytical methods and acceptable intake limits.'],
  45:['Reaction Optimization','Optimization improves yield, purity, robustness and scalability.','Variables include solvent, temperature, concentration, stoichiometry, base, catalyst, ligand, order of addition, water, oxygen and time. DoE helps map interactions.','Best condition is not only highest yield; impurity and scale safety matter.'],
  46:['Scale-up Chemistry','Scale-up converts lab chemistry into safe plant chemistry.','Heat transfer, mixing, gas evolution, addition rate, crystallization, filtration, exotherms and safety margins become major issues.','A good process is robust, safe, reproducible, and easy to purify.'],
  47:['Green Chemistry','Green chemistry reduces waste, hazard and energy demand.','Focus on atom economy, catalysis, safer solvents, renewable feedstocks, fewer protecting groups, lower temperature, and easier purification.','Pharma process chemistry increasingly values sustainability metrics.'],
  48:['Pericyclic Reactions','Pericyclic reactions occur through cyclic transition states with concerted electron movement.','Electrocyclic reactions, cycloadditions and sigmatropic shifts follow orbital symmetry rules and thermal/photochemical selection rules.','They are powerful because they are stereospecific and often predictable.'],
  49:['Organometallic Chemistry','Organometallic reagents create highly useful carbon nucleophiles and catalytic cycles.','Grignard, organolithium, organocuprate, organozinc, organoboron and Pd/Ni/Cu complexes are common. Reactivity depends on metal-carbon polarity and ligand environment.','Moisture sensitivity and functional group compatibility are central.'],
  50:['Retrosynthesis','Retrosynthesis plans synthesis backward from target to simple precursors.','Use disconnections, synthons, functional group interconversion, strategic bond selection and protecting group planning.','Good retrosynthesis chooses reliable reactions and minimizes step count and risk.'],
  51:['Protecting Groups','Protecting groups temporarily mask reactive functional groups.','Alcohols use silyl ethers/benzyl/acetal; amines use Boc/Cbz/Fmoc; carbonyls use acetals; acids use esters. Orthogonality means one group can be removed without disturbing another.','Use protecting groups only when they solve a real selectivity problem.'],
  52:['Asymmetric Synthesis','Asymmetric synthesis creates enantioenriched products.','Strategies include chiral pool, chiral auxiliaries, chiral catalysts, asymmetric hydrogenation, Sharpless epoxidation/dihydroxylation and organocatalysis.','In pharma, stereoselective synthesis can improve potency, safety and patent position.']
};

const customMasterChapters={
  1:{title:'Basic Concepts',sub:'General Organic Chemistry - Foundation Chapter',sections:[
    ['1.1 Meaning and Scope of Organic Chemistry','Organic chemistry is the chemistry of carbon compounds, especially molecules containing C-H, C-C, C-O, C-N, C-X, C-S, and related covalent bonds. The subject includes medicines, polymers, dyes, agrochemicals, natural products, fuels, flavors, fragrances, and advanced materials. The special nature of carbon comes from tetravalency, moderate electronegativity, small atomic size, strong covalent bond formation, and the ability to form chains and rings.'],
    ['1.2 Why Carbon Forms So Many Compounds','Carbon forms four strong covalent bonds and bonds with itself repeatedly, a property called catenation. It forms single, double, and triple bonds, and combines with H, O, N, S, P, halogens, metals, and many other atoms. This creates variation in chain length, branching, ring formation, functional groups, stereochemistry, and oxidation level.'],
    ['1.3 Classification of Organic Compounds','Organic compounds are classified as open-chain or cyclic, saturated or unsaturated, aliphatic or aromatic, homocyclic or heterocyclic, and mono-functional or poly-functional. Aromatic compounds contain cyclic conjugated pi systems with special stability. Heterocyclic compounds contain atoms such as N, O, or S within a ring and are extremely important in pharmaceuticals.'],
    ['1.4 Hybridization and Geometry','Carbon commonly uses sp3, sp2, and sp hybridization. sp3 carbon is tetrahedral with bond angle near 109.5 degrees. sp2 carbon is trigonal planar with bond angle near 120 degrees. sp carbon is linear with bond angle 180 degrees. Hybridization controls shape, bond length, bond strength, acidity, and orbital overlap.'],
    ['1.5 Sigma and Pi Bonds','A sigma bond forms by head-on orbital overlap and is usually strong and freely rotatable. A pi bond forms by sideways overlap of p orbitals and restricts rotation. A double bond has one sigma and one pi bond; a triple bond has one sigma and two pi bonds. Pi bonds are more reactive because their electron density is exposed.'],
    ['1.6 Functional Groups','A functional group is the atom or group of atoms that gives a molecule characteristic chemistry. Alcohols contain -OH, aldehydes contain -CHO, ketones contain C=O, carboxylic acids contain -COOH, amines contain nitrogen, and alkyl halides contain C-X. In most reactions, the functional group is the reactive site.'],
    ['1.7 Physical Properties and Structure','Boiling point, melting point, solubility, polarity, and crystallinity depend on molecular size, shape, intermolecular forces, hydrogen bonding, dipole moment, and branching. Larger molecules usually have stronger dispersion forces. Hydrogen bonding increases boiling point and water solubility. Branching often lowers boiling point.'],
    ['1.8 Pharma and R&D Importance','In API research, basic organic concepts explain why a molecule dissolves, crystallizes, reacts, degrades, or forms impurities. Functional group recognition helps predict process hazards and impurity pathways. Hybridization and polarity help explain pKa, salt formation, chromatography, and spectroscopy.'],
    ['1.9 Common Mistakes','Do not memorize functional groups without connecting them to reactivity. Do not treat organic chemistry as a reaction list instead of a system based on electron movement and stability. Do not ignore geometry, because sp3, sp2, and sp centers behave differently.'],
    ['1.10 Summary','Basic concepts form the foundation of organic chemistry. Carbon tetravalency, catenation, hybridization, bonding, functional groups, and molecular structure explain diversity and reactivity. A strong foundation makes acidity, mechanisms, stereochemistry, named reactions, and pharma process chemistry easier.']
  ]},
  2:{title:'Electronic Effects',sub:'How Electron Distribution Controls Organic Reactivity',sections:[
    ['2.1 Introduction','Electronic effects describe how electron density shifts within a molecule. These shifts control acidity, basicity, nucleophilicity, electrophilicity, stability of intermediates, orientation in aromatic substitution, and product selectivity. Most organic explanations begin with one question: where are the electrons, and where can they move?'],
    ['2.2 Inductive Effect','The inductive effect is permanent polarization through sigma bonds due to electronegativity difference. Electron-withdrawing groups show -I effect, such as -NO2, -CN, -COOH, -CHO, -COR, and halogens. Alkyl groups show +I effect. The effect decreases rapidly with distance.'],
    ['2.3 Mesomeric or Resonance Effect','The mesomeric effect operates through pi bonds and lone pairs in conjugated systems. +M groups donate electron density by resonance, such as -OH, -OR, and -NH2. -M groups withdraw electron density, such as -NO2, -CHO, -COR, -COOH, -CN, and -SO3H.'],
    ['2.4 Resonance Stabilization','Resonance does not mean the molecule oscillates between drawings. The real molecule is a resonance hybrid with delocalized electrons. Resonance stabilizes carbocations, carbanions, radicals, aromatic systems, carboxylate ions, amides, and enolates.'],
    ['2.5 Hyperconjugation','Hyperconjugation is delocalization from a sigma C-H or C-C bond into an adjacent empty p orbital, pi bond, or radical center. It stabilizes carbocations, radicals, and substituted alkenes, explaining the high stability of tertiary carbocations and substituted alkenes.'],
    ['2.6 Electromeric Effect','The electromeric effect is a temporary complete shift of pi electrons during attack by a reagent. It explains additions to alkenes, alkynes, and carbonyls, where pi electrons move toward an electrophile or away from a nucleophile.'],
    ['2.7 Steric and Field Effects','Steric effects influence whether electronic effects can operate. Bulky groups can block attack, reduce planarity, or prevent resonance. Field effects operate through space rather than through bonds and matter in conformationally locked systems.'],
    ['2.8 Applications','Electronic effects explain acidity of carboxylic acids, basicity of amines, stability of intermediates, directing effects in electrophilic aromatic substitution, nucleophilicity trends, and carbonyl reactivity. Nitro groups withdraw by -I and -M; alkyl groups donate by +I and hyperconjugation.'],
    ['2.9 Interview Strategy','Define the effect, state whether it donates or withdraws electrons, give one example, and explain one consequence. Example: nitrobenzene is deactivated because -NO2 withdraws electron density by -I and -M effects and directs incoming electrophiles meta.'],
    ['2.10 Summary','Electronic effects are the logic engine of organic chemistry. Inductive effects work through sigma bonds, resonance through pi systems, hyperconjugation through sigma-pi interaction, and electromeric effects during reactions.']
  ]},
  3:{title:'Acid-Base Chemistry',sub:'pKa, Stability, and Proton Transfer Logic',sections:[
    ['3.1 Introduction','Organic acid-base chemistry is the chemistry of proton transfer and electron-pair donation. It controls reaction initiation, reagent compatibility, enolate formation, salt formation, extraction, purification, and biological ionization. Many mechanisms begin with protonation or deprotonation.'],
    ['3.2 Acid-Base Definitions','A Bronsted acid donates a proton and a Bronsted base accepts a proton. A Lewis acid accepts an electron pair and a Lewis base donates an electron pair. Carbonyl oxygens, amines, halides, alkoxides, and organometallic reagents often act as Lewis bases; carbocations and boron reagents act as Lewis acids.'],
    ['3.3 Meaning of pKa','pKa measures acid strength. Lower pKa means stronger acid. The key question is stability of the conjugate base. If the conjugate base is stabilized by resonance, electronegativity, inductive withdrawal, aromaticity, hybridization, or solvation, the acid is stronger.'],
    ['3.4 Factors Affecting Acidity','Acidity increases with electronegativity of the atom bearing negative charge, greater s-character, resonance stabilization, electron-withdrawing groups, and good solvation. Carboxylic acids are more acidic than alcohols because carboxylate ions are resonance stabilized.'],
    ['3.5 Factors Affecting Basicity','Basicity depends on availability of a lone pair. Electron-donating groups increase basicity; electron-withdrawing groups reduce it. Resonance reduces basicity if the lone pair is delocalized, as in amides and anilines. Solvation and solvent also affect apparent basicity.'],
    ['3.6 Common pKa Logic','Carboxylic acids have pKa around 4-5, phenols around 10, alcohols around 16-18, terminal alkynes around 25, and alkanes around 50. Alpha hydrogens beside carbonyls are acidic because enolates are resonance stabilized.'],
    ['3.7 Acid-Base in Mechanisms','Strong bases such as LDA, NaH, and alkoxides form carbanions or enolates. Acids activate carbonyls by protonating oxygen. Protonation can convert poor leaving groups into better leaving groups, such as -OH into water.'],
    ['3.8 Pharma Relevance','pKa controls ionization, solubility, salt formation, permeability, extraction, crystallization, and chromatographic behavior. Many APIs are formulated as salts to improve solubility or stability. Workup pH often decides impurity removal and isolation.'],
    ['3.9 Common Mistakes','Do not confuse acidity with concentration. Do not say a molecule is acidic only because it has hydrogen; the conjugate base must be stable. Do not assume all nitrogens are strongly basic, because amide nitrogen is weakly basic.'],
    ['3.10 Summary','Acid-base chemistry is a stability problem. Stronger acids give more stable conjugate bases, and stronger bases have more available electron pairs. pKa, resonance, inductive effects, hybridization, solvation, and functional group context explain most behavior.']
  ]},
  4:{title:'Reaction Intermediates',sub:'Short-Lived Species That Decide Mechanism and Product',sections:[
    ['4.1 Introduction','Reaction intermediates are short-lived species formed between reactants and products. They are not transition states; intermediates occupy local energy minima and may sometimes be detected or trapped. They decide rearrangements, stereochemistry, rate, and side products.'],
    ['4.2 Carbocations','Carbocations contain electron-deficient carbon with a positive charge and usually an empty p orbital. They are commonly sp2 hybridized and planar. Stability follows benzylic or allylic greater than tertiary greater than secondary greater than primary greater than methyl.'],
    ['4.3 Carbanions','Carbanions contain negatively charged carbon with a lone pair. They act as bases and nucleophiles. Stability increases with resonance, electron-withdrawing groups, and greater s-character. Enolates, acetylides, and organometallic reagents have carbanion-like character.'],
    ['4.4 Free Radicals','Free radicals contain one unpaired electron and are usually neutral. Stability generally follows benzylic or allylic greater than tertiary greater than secondary greater than primary. Radical reactions often proceed by initiation, propagation, and termination.'],
    ['4.5 Carbenes and Nitrenes','Carbenes are neutral divalent carbon species with six valence electrons, existing as singlet or triplet forms. They add to alkenes and insert into bonds. Nitrenes are nitrogen analogs and participate in C-H insertion, aziridination, and rearrangement chemistry.'],
    ['4.6 Arynes','Arynes such as benzyne are highly reactive intermediates containing a strained formal triple bond in an aromatic ring. They are generated from aryl halides under strong basic conditions and react with nucleophiles or dienes.'],
    ['4.7 Rearrangement Tendency','Intermediates often rearrange to more stable structures. Carbocations can undergo hydride shifts, methyl shifts, and ring expansions. Rearrangement is likely when the new intermediate is significantly more stable.'],
    ['4.8 Stereochemical Consequences','Planar carbocations can be attacked from either face, causing racemization or mixtures. Concerted reactions avoid free intermediates and often have stereospecific outcomes. Radical intermediates can also lead to mixtures due to rotation before trapping.'],
    ['4.9 Process Importance','Reactive intermediates may generate impurities, regioisomers, overreaction products, or safety hazards. Process chemists must know whether an intermediate is ionic, radical, or metal-bound to control selectivity and impurity formation.'],
    ['4.10 Summary','Intermediates are hidden decision points in reactions. Carbocations, carbanions, radicals, carbenes, nitrenes, and arynes each have characteristic stability, geometry, and reactivity. Mechanistic thinking starts by asking which intermediate is possible.']
  ]},
  5:{title:'Reaction Mechanism Fundamentals',sub:'Electron Flow, Transition States, and Reaction Pathways',sections:[
    ['5.1 Introduction','A reaction mechanism is a step-by-step description of how reactants become products. It shows bond breaking, bond making, charge movement, intermediates, transition states, and catalysts. Mechanisms are the language of organic chemistry.'],
    ['5.2 Curved Arrow Notation','Curved arrows show electron movement, not atom movement. An arrow begins at an electron source such as a lone pair, pi bond, or sigma bond, and ends at an electron-poor atom or bond-forming position. Fishhook arrows show one-electron radical movement.'],
    ['5.3 Bond Breaking and Formation','Bonds break heterolytically to give ions or homolytically to give radicals. Bond formation occurs when an electron-rich site donates to an electron-poor site. Most polar organic reactions are nucleophile-electrophile combinations.'],
    ['5.4 Transition State vs Intermediate','A transition state is the highest-energy arrangement along a reaction step and cannot be isolated. An intermediate is a real species between steps and may sometimes be detected. Energy diagrams connect activation energy to rate.'],
    ['5.5 Kinetic and Thermodynamic Control','Kinetic products form faster because they have lower activation energy. Thermodynamic products are more stable and dominate under reversible or high-temperature conditions. Product distribution depends on conditions.'],
    ['5.6 Hammond Postulate','The Hammond postulate states that a transition state resembles the species closest to it in energy. Endothermic steps have product-like transition states, while exothermic steps have reactant-like transition states.'],
    ['5.7 Catalysis','A catalyst increases reaction rate by lowering activation energy and is regenerated. Acid catalysts activate electrophiles or leaving groups; base catalysts generate nucleophiles; metal catalysts enable oxidative addition, insertion, transmetalation, and reductive elimination.'],
    ['5.8 Mechanism Validation','Mechanisms are supported by kinetics, isotope labeling, stereochemical outcome, intermediate trapping, substituent effects, and product distribution. A proposed mechanism must explain all observations, not only the major product.'],
    ['5.9 Interview Strategy','When explaining a mechanism, identify nucleophile, electrophile, leaving group, solvent, and rate-determining step. Then describe electron flow. Avoid vague phrases; say which electrons move and why.'],
    ['5.10 Summary','Mechanisms organize organic chemistry into logical steps. Curved arrows, transition states, intermediates, energy diagrams, kinetic control, thermodynamic control, and catalysis explain why reactions happen and what products form.']
  ]},
  6:{title:'Types of Organic Reactions',sub:'The Main Reaction Families',sections:[
    ['6.1 Introduction','Most organic reactions belong to a few major families: substitution, elimination, addition, rearrangement, oxidation, reduction, and coupling. Learning the family first makes individual named reactions much easier.'],
    ['6.2 Substitution','In substitution, one group replaces another. SN1 proceeds through a carbocation and is favored by tertiary substrates and polar protic solvents. SN2 is concerted backside attack and is favored by methyl or primary substrates and polar aprotic solvents.'],
    ['6.3 Elimination','Elimination removes atoms or groups to form a pi bond. E1 proceeds through carbocations and may rearrange. E2 is concerted and requires proper geometry. E1cb occurs when a carbanion forms before leaving group departure.'],
    ['6.4 Addition','Addition reactions add atoms across pi bonds. Alkenes, alkynes, carbonyls, and imines commonly undergo addition. Reagent type decides Markovnikov, anti-Markovnikov, syn, anti, reversible, or irreversible behavior.'],
    ['6.5 Rearrangement','Rearrangements change carbon skeleton or connectivity. They often proceed through carbocations, nitrenes, carbenes, or pericyclic transition states. Migration tendency and intermediate stability are central.'],
    ['6.6 Oxidation and Reduction','Oxidation increases bonds to electronegative atoms or decreases bonds to hydrogen. Reduction does the opposite. Organic redox is often tracked by functional group level: alcohol to aldehyde to acid is oxidation.'],
    ['6.7 Coupling','Coupling joins two fragments, often forming C-C, C-N, or C-O bonds. Metal-catalyzed couplings such as Suzuki, Heck, Sonogashira, Negishi, Stille, and Buchwald-Hartwig are essential in medicinal chemistry.'],
    ['6.8 Choosing a Reaction Type','Identify the starting functional group, desired product, bond to be formed or broken, substrate class, and functional group tolerance. Then choose the reaction family and finally the reagent conditions.'],
    ['6.9 Common Mistakes','Do not memorize reactions without identifying their family. Do not apply SN2 to tertiary substrates or expect SN1 without a stable carbocation. Do not ignore elimination as a side reaction.'],
    ['6.10 Summary','Reaction types are the filing system of organic chemistry. Once you classify a transformation, you can predict mechanism, conditions, side reactions, stereochemistry, and limitations.']
  ]},
  7:{title:'Stability Concepts',sub:'Why Some Structures and Products Are Favored',sections:[
    ['7.1 Introduction','Stability concepts explain why one intermediate, conformer, alkene, radical, ion, or product is favored. Stability controls rate, equilibrium, product distribution, and rearrangement pathways.'],
    ['7.2 Carbocation Stability','Carbocations are stabilized by resonance, hyperconjugation, and electron-donating groups. Benzylic and allylic carbocations are especially stable. Tertiary carbocations are more stable than secondary and primary due to hyperconjugation and inductive donation.'],
    ['7.3 Carbanion Stability','Carbanions are stabilized by electron-withdrawing groups, resonance, and high s-character. Acetylide ions are more stable than vinyl or alkyl carbanions. Enolates are stabilized by resonance between carbon and oxygen.'],
    ['7.4 Radical Stability','Radicals are stabilized by resonance and hyperconjugation. Benzylic and allylic radicals are more stable than simple alkyl radicals. Radical stability influences selectivity in halogenation and radical additions.'],
    ['7.5 Alkene Stability','More substituted alkenes are generally more stable due to hyperconjugation and alkyl donation. Trans alkenes are often more stable than cis alkenes due to reduced steric repulsion. Conjugated alkenes are more stable than isolated alkenes.'],
    ['7.6 Aromatic Stability','Aromatic compounds gain special stabilization from cyclic conjugation and Huckel 4n+2 pi electron count. Antiaromatic compounds are destabilized by cyclic conjugation with 4n pi electrons.'],
    ['7.7 Conformational Stability','Staggered conformations are more stable than eclipsed. In cyclohexane, equatorial substituents are more stable than axial substituents because they avoid 1,3-diaxial interactions.'],
    ['7.8 Kinetic vs Thermodynamic Stability','The most stable product is thermodynamic, but the fastest-forming product is kinetic. A reaction may give different products depending on temperature, reversibility, and reaction time.'],
    ['7.9 Application','Stability explains Markovnikov addition, rearrangements, Zaitsev elimination, resonance preference, conformational analysis, and aromatic substitution. It also predicts degradation and impurity formation.'],
    ['7.10 Summary','Stability is the backbone of prediction. Resonance, hyperconjugation, inductive effects, aromaticity, sterics, solvation, and conformational effects decide which species survives and which pathway dominates.']
  ]},
  8:{title:'Aromaticity',sub:'Special Stability in Cyclic Conjugated Systems',sections:[
    ['8.1 Introduction','Aromaticity is unusual stability shown by certain cyclic, planar, fully conjugated molecules. Aromatic compounds resist addition and prefer substitution because substitution preserves aromatic stabilization.'],
    ['8.2 Conditions for Aromaticity','A molecule is aromatic if it is cyclic, planar, fully conjugated, and contains 4n+2 pi electrons. Benzene has six pi electrons and is aromatic. Continuous p orbital overlap around the ring is essential.'],
    ['8.3 Antiaromatic and Non-Aromatic','Antiaromatic compounds are cyclic, planar, fully conjugated systems with 4n pi electrons and are unusually unstable. Non-aromatic compounds fail one or more requirements and do not receive aromatic stabilization or antiaromatic destabilization.'],
    ['8.4 Counting Pi Electrons','Each pi bond contributes two pi electrons. A negatively charged atom in a p orbital can contribute two. A positively charged atom with an empty p orbital contributes zero but may allow conjugation. Lone pairs count only if part of the pi system.'],
    ['8.5 Heteroaromatic Compounds','Pyridine, pyrrole, furan, thiophene, imidazole, indole, and many drug-like rings are heteroaromatic. Pyridine nitrogen lone pair is not part of the aromatic sextet; pyrrole nitrogen lone pair is part of it.'],
    ['8.6 Aromatic Reactivity','Aromatic rings undergo electrophilic aromatic substitution rather than addition. Substituents activate or deactivate the ring and direct incoming electrophiles to ortho, meta, or para positions.'],
    ['8.7 Aromatic Ions','Cyclopentadienyl anion is aromatic with six pi electrons. Tropylium ion is aromatic with six pi electrons. Cyclobutadiene is antiaromatic with four pi electrons and is highly unstable.'],
    ['8.8 Pharma Importance','Aromatic and heteroaromatic rings are common in APIs because they provide shape, pi-stacking, metabolic stability, and binding interactions. They may also undergo oxidative metabolism or carry impurity risks.'],
    ['8.9 Common Mistakes','Do not count all lone pairs automatically. Do not call every ring aromatic. Planarity and conjugation are required. Do not forget charges when counting pi electrons.'],
    ['8.10 Summary','Aromaticity requires cyclic planarity, continuous conjugation, and 4n+2 pi electrons. It explains stability and substitution chemistry of benzene, heterocycles, aromatic ions, and pharma scaffolds.']
  ]},
  9:{title:'Solvent Effects',sub:'How Medium Controls Mechanism, Rate, and Selectivity',sections:[
    ['9.1 Introduction','Solvents are not passive liquids. They stabilize or destabilize ions, hydrogen-bond with reagents, change nucleophilicity, influence transition states, affect solubility, and control mechanism selection.'],
    ['9.2 Polar and Non-Polar Solvents','Polar solvents stabilize charged species and polar transition states. Non-polar solvents are better for non-polar substrates and radical or pericyclic reactions. Polarity, donor ability, and hydrogen bonding must all be considered.'],
    ['9.3 Protic Solvents','Protic solvents such as water, methanol, ethanol, acetic acid, and ammonia donate hydrogen bonds. They stabilize anions strongly and often reduce nucleophilicity. They favor SN1 by stabilizing carbocations and leaving groups.'],
    ['9.4 Aprotic Solvents','Polar aprotic solvents such as DMSO, DMF, DMAc, acetonitrile, acetone, and NMP solvate cations better than anions. This leaves anions more reactive and enhances SN2 reactions.'],
    ['9.5 SN1 and SN2','SN1 benefits from polar protic solvents because ionization is stabilized. SN2 benefits from polar aprotic solvents because the nucleophile remains strong. Iodide is more nucleophilic in acetone or DMSO than in water.'],
    ['9.6 Elimination','E1 reactions are favored by polar protic solvents and heat. E2 depends on base strength and substrate geometry; solvent affects basicity and ion pairing. Bulky bases can shift products toward Hofmann elimination.'],
    ['9.7 Process Chemistry','Process chemists choose solvents based on reactivity, selectivity, safety, cost, boiling point, toxicity, environmental profile, crystallization behavior, and regulatory limits. A high-yield solvent may still be rejected at scale.'],
    ['9.8 Purification','Solvent affects crystallization, extraction, chromatography, precipitation, and impurity purge. A product may oil out in one solvent but crystallize cleanly in another. Mixed solvent systems are often used.'],
    ['9.9 Common Mistakes','Do not choose solvent only by polarity. Consider protic/aprotic character, boiling point, water content, miscibility, safety, and reagent compatibility. Milligram behavior may not scale directly.'],
    ['9.10 Summary','Solvent controls mechanism, rate, selectivity, isolation, and scale-up. Understanding solvent effects explains SN1/SN2 behavior, elimination, nucleophilicity, salt formation, crystallization, and process robustness.']
  ]},
  10:{title:'Intermolecular Forces',sub:'Physical Properties from Molecular Attraction',sections:[
    ['10.1 Introduction','Intermolecular forces are attractions between molecules. They control boiling point, melting point, viscosity, solubility, volatility, crystallinity, chromatography, and formulation behavior.'],
    ['10.2 London Dispersion Forces','London dispersion forces arise from temporary induced dipoles. They exist in all molecules and increase with molecular size, surface area, and polarizability. Long straight-chain hydrocarbons boil higher than highly branched isomers.'],
    ['10.3 Dipole-Dipole Interactions','Polar molecules attract through permanent dipoles. Carbonyls, nitriles, alkyl halides, sulfoxides, and many heteroatom-containing molecules show dipole interactions. Stronger dipoles generally increase boiling point and affect solubility.'],
    ['10.4 Hydrogen Bonding','Hydrogen bonding occurs when H attached to O, N, or F interacts with lone pairs on electronegative atoms. Alcohols, acids, amines, amides, and phenols can form hydrogen bonds, increasing boiling point and water solubility.'],
    ['10.5 Ionic and Ion-Dipole Interactions','Salts and ionic compounds interact strongly with polar solvents through ion-dipole forces. This is important for extraction, salt formation, API solubility, and crystallization.'],
    ['10.6 Boiling Point Trends','Boiling point increases with molecular weight, surface area, polarity, and hydrogen bonding. Branching usually lowers boiling point. Carboxylic acids often have high boiling points due to dimer formation.'],
    ['10.7 Solubility Trends','Like dissolves like is a useful starting rule. Polar compounds dissolve better in polar solvents, while non-polar compounds dissolve better in non-polar solvents. Ionization can greatly increase water solubility.'],
    ['10.8 Chromatography Connection','Intermolecular forces explain TLC and column chromatography. Polar compounds interact strongly with polar silica and move slowly in normal-phase chromatography. Less polar compounds elute faster.'],
    ['10.9 Pharma Relevance','Intermolecular forces affect crystal form, polymorphism, hygroscopicity, tablet behavior, dissolution rate, permeability, and protein binding. Salt selection and co-crystal design rely on these interactions.'],
    ['10.10 Summary','Intermolecular forces connect structure to physical behavior. Dispersion, dipole-dipole, hydrogen bonding, ionic interactions, and ion-dipole forces explain boiling point, solubility, chromatography, crystallization, and pharmaceutical performance.']
  ]}
};

function renderCustomChapter(num,chapter){
  const body=chapter.sections.map(s=>`<div class="detail-section"><div class="detail-section-title">${s[0]}</div><p class="detail-text">${s[1]}</p></div>`).join('');
  return `<div class="detail-title">Chapter ${num}: ${chapter.title}</div><div class="detail-subtitle">${chapter.sub}</div>${body}`;
}

function chapterFamily(num){
  if(num<=10) return {
    label:'General Organic Chemistry Foundation',
    focus:'structure, bonding, electronic logic, stability, and mechanism prediction',
    use:'This foundation is used every time you predict acidity, basicity, nucleophilicity, product stability, or reaction pathway.',
    examples:['Compare carbocation stability before predicting SN1 or E1 products.','Use pKa and conjugate base stability before choosing a base.','Use solvent and substrate class to separate SN1, SN2, E1, and E2 logic.']
  };
  if(num<=14) return {
    label:'Stereochemistry and Molecular Shape',
    focus:'three-dimensional structure, configuration, conformation, optical behavior, and stereochemical outcome',
    use:'This chapter family matters strongly in pharmaceuticals because biological targets are chiral and shape-selective.',
    examples:['Assign R/S or E/Z before comparing stereoisomers.','Check symmetry before calling a molecule optically active.','Predict inversion, retention, or racemization from the mechanism.']
  };
  if(num<=26) return {
    label:'Functional Group Chemistry',
    focus:'functional group recognition, reactivity patterns, preparation, reactions, and interconversion',
    use:'Functional group logic is the language of synthesis: it tells you which bond reacts, which reagent is compatible, and which impurity may form.',
    examples:['Alcohols oxidize differently depending on 1 degree, 2 degree, or 3 degree structure.','Carbonyl compounds react at electrophilic carbon and at alpha positions.','Amines combine basicity, nucleophilicity, and salt formation behavior.']
  };
  if(num<=38) return {
    label:'Named Reactions and Transformation Strategy',
    focus:'reaction class, mechanism, conditions, selectivity, scope, and limitations',
    use:'A reaction is useful only when you know why it works, what it tolerates, and what side reactions it can produce.',
    examples:['Use Grignard reactions for C-C bond formation but protect acidic protons.','Use Suzuki coupling when boronic acids and aryl halides are compatible.','Use rearrangements only when migration tendency and intermediate stability support them.']
  };
  if(num<=42) return {
    label:'Analytical and Practical Organic Chemistry',
    focus:'monitoring, purification, identification, and proof of structure',
    use:'Practical chemistry decides whether a reaction is actually successful: yield is meaningless without purity and structural confirmation.',
    examples:['Use TLC to compare starting material, product, and reaction mixture.','Use NMR integration, splitting, and chemical shift together.','Use distillation only when volatility differences make separation practical.']
  };
  if(num<=47) return {
    label:'Industrial and Pharma Organic Chemistry',
    focus:'impurity control, safety, robustness, scalability, sustainability, and regulatory thinking',
    use:'Pharma process chemistry values reproducibility, impurity purge, safety margin, and clean isolation as much as chemical yield.',
    examples:['Optimize for impurity profile, not only conversion.','Check nitrosamine risk when amines and nitrosating conditions are possible.','Consider heat transfer and mixing before scaling an exothermic reaction.']
  };
  return {
    label:'Advanced Synthesis Strategy',
    focus:'route design, stereocontrol, organometallic logic, protecting groups, and retrosynthetic planning',
    use:'Advanced organic chemistry turns reaction knowledge into synthesis design and decision-making.',
    examples:['Disconnect the most strategic bond first in retrosynthesis.','Use protecting groups only when chemoselectivity demands them.','Select asymmetric methods based on substrate class, catalyst availability, and desired enantiomeric purity.']
  };
}

function listFromText(text){
  return text.split(/;|\. /).map(s=>s.trim().replace(/\.$/,'')).filter(Boolean).slice(0,6);
}

function buildBookChapter(num,d){
  const family=chapterFamily(num);
  const study=listFromText(d[2]);
  const examples=family.examples.map(x=>`<li>${x}</li>`).join('');
  const studyItems=(study.length?study:['Definition and scope','Important examples','Mechanistic logic','Exceptions and limitations']).map(x=>`<li>${x}</li>`).join('');
  return `<div class="detail-title">Chapter ${num}: ${d[0]}</div><div class="detail-subtitle">${family.label} - Detailed Book Chapter</div>
    <div class="detail-section"><div class="detail-section-title">${num}.1 CHAPTER ORIENTATION</div><p class="detail-text"><strong>${d[0]}</strong> belongs to ${family.label.toLowerCase()}. The purpose of this chapter is to help you understand ${family.focus}. Instead of memorizing isolated lines, study this topic as a decision-making tool: identify the structure, ask what electrons can do, predict the most stable pathway, and then connect the idea to synthesis or analysis.</p><p class="detail-text">${d[1]}</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.2 LEARNING OUTCOMES</div><ul class="checklist-bullets"><li>Define ${d[0]} in precise chemical language.</li><li>Recognize the topic in structures, reactions, mechanisms, or analytical data.</li><li>Explain the reason behind the major trend using electronic, steric, stereochemical, or practical logic.</li><li>Apply the concept to exam questions, pharma interviews, and synthesis planning.</li><li>Identify common exceptions, limitations, and side reactions.</li></ul></div>
    <div class="detail-section"><div class="detail-section-title">${num}.3 CONCEPTUAL FOUNDATION</div><p class="detail-text">${d[1]}</p><p class="detail-text">The deeper logic is that organic molecules do not react randomly. Reactivity is controlled by electron density, orbital overlap, bond polarization, charge stability, steric accessibility, solvent environment, and thermodynamic or kinetic preference. Whenever you study ${d[0]}, connect the definition to these controlling factors.</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.4 KEY TERMS AND STUDY MAP</div><ul class="checklist-bullets">${studyItems}</ul><p class="detail-text">Use this map as your revision order: first learn the vocabulary, then the rule, then the exception, then a real example. This is the fastest way to convert theory into problem-solving ability.</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.5 MECHANISTIC OR PRACTICAL LOGIC</div><p class="detail-text">${family.use}</p><p class="detail-text">A good explanation should answer four questions: <strong>what is reacting, why is it reactive, what intermediate or transition state is favored, and what product or observation follows?</strong> This format works for written exams, viva answers, and R&D discussions.</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.6 REPRESENTATIVE EXAMPLES</div><ul class="checklist-bullets">${examples}</ul><p class="detail-text">When writing notes, add at least one structure or reaction under each example. For best retention, mark the reactive atom, electron movement, and reason for selectivity.</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.7 APPLICATION IN SYNTHESIS / ANALYSIS / PHARMA</div><p class="detail-text">${d[3]}</p><p class="detail-text">In pharma R&D, the practical question is not only whether the chemistry works. You also ask whether it is selective, scalable, safe, clean, easy to purify, and compatible with impurity control. This makes ${d[0]} valuable beyond textbook theory.</p></div>
    <div class="detail-section"><div class="detail-section-title">${num}.8 HOW TO ANSWER IN INTERVIEW</div><div class="mechanism-step"><div class="step-num">1</div><div class="step-text">Start with a one-line definition.</div></div><div class="mechanism-step"><div class="step-num">2</div><div class="step-text">Give one clear example, preferably from a real reaction or molecule.</div></div><div class="mechanism-step"><div class="step-num">3</div><div class="step-text">Explain the reason using stability, electron flow, stereochemistry, solvent, or reagent logic.</div></div><div class="mechanism-step"><div class="step-num">4</div><div class="step-text">Finish with one limitation, exception, or pharma/process relevance.</div></div></div>
    <div class="detail-section"><div class="detail-section-title">${num}.9 COMMON MISTAKES</div><ul class="checklist-bullets"><li>Memorizing the final result without learning the reason.</li><li>Ignoring substrate structure, solvent, temperature, reagent strength, or symmetry.</li><li>Applying a rule outside its scope.</li><li>Forgetting that stability, rate, and selectivity are different questions.</li><li>Skipping impurity, purification, or scale-up thinking in pharma-style answers.</li></ul></div>
    <div class="detail-section"><div class="detail-section-title">${num}.10 PRACTICE PROMPTS</div><ul class="checklist-bullets"><li>Write a two-line definition of ${d[0]}.</li><li>Draw one example and label the important atoms or groups.</li><li>Explain one trend or product using electron movement or stability.</li><li>Name one exception and explain why it occurs.</li><li>Give one pharma, synthesis, or analytical application.</li></ul></div>
    <div class="detail-section"><div class="detail-section-title">${num}.11 CHAPTER SUMMARY</div><p class="detail-text">${d[0]} should be revised as a concept-based chapter: definition, key terms, controlling factors, examples, exceptions, applications, and interview explanation. If you can explain the reason behind the trend, you can handle unfamiliar questions without rote memorization.</p></div>`;
}

function showMasterTopicDetail(num){
  const d=masterTopicDetails[num];
  if(!d) return;
  const content=document.getElementById('detailContent');
  if(customMasterChapters[num]){
    content.innerHTML=renderCustomChapter(num,customMasterChapters[num]);
    openDetailPanel();
    return;
  }
  if(num===14){
    content.innerHTML=`<div class="detail-title">Chapter 14: Chirality</div><div class="detail-subtitle">Stereochemistry - Book Chapter Notes</div>
      <div class="detail-section"><div class="detail-section-title">14.1 INTRODUCTION TO CHIRALITY</div><p class="detail-text">Chirality is a fundamental concept in stereochemistry that describes the geometric property of a molecule being <strong>non-superimposable on its mirror image</strong>. The term chiral is derived from the Greek word <em>cheir</em>, meaning hand, reflecting the classic analogy that the left and right hands are mirror images but cannot be perfectly aligned.</p><p class="detail-text">A molecule that exhibits chirality exists in two forms called <strong>enantiomers</strong>, which are mirror images of each other but differ in spatial arrangement. This difference, although subtle, has profound implications in chemical reactivity and biological interactions.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.2 CONDITIONS FOR CHIRALITY</div><p class="detail-text">For a molecule to be chiral, it must <strong>lack certain symmetry elements</strong>, specifically:</p><ul class="checklist-bullets"><li>Plane of symmetry (&sigma;)</li><li>Center of symmetry (i)</li></ul><p class="detail-text">Molecules possessing these symmetry elements are typically <strong>achiral</strong>, even if they contain stereocenters.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.3 CHIRAL CENTERS / STEREOGENIC CENTERS</div><p class="detail-text">A <strong>chiral center</strong>, also known as a <strong>stereogenic center</strong>, is an atom, commonly carbon, bonded to <strong>four different substituents</strong>, resulting in a tetrahedral arrangement.</p><div class="detail-eq">C* (R1, R2, R3, R4)</div><p class="detail-text"><strong>Example:</strong> Lactic acid, CH3-CHOH-COOH, contains a central carbon attached to -CH3, -OH, -COOH, and -H. Thus, it is a chiral molecule.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.4 ENANTIOMERS</div><p class="detail-text">Enantiomers are <strong>stereoisomers that are mirror images of each other but not superimposable</strong>.</p><ul class="checklist-bullets"><li>Identical physical properties such as melting point, boiling point, and density</li><li>Identical chemical behavior in achiral environments</li><li>Opposite optical rotation</li></ul><p class="detail-text">One enantiomer rotates plane-polarized light clockwise, called <strong>dextrorotatory (+)</strong>, while the other rotates it anticlockwise, called <strong>levorotatory (-)</strong>.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.5 OPTICAL ACTIVITY</div><p class="detail-text">Optical activity is the ability of a chiral molecule to rotate plane-polarized light.</p><ul class="checklist-bullets"><li><strong>Dextrorotatory (+):</strong> Clockwise rotation</li><li><strong>Levorotatory (-):</strong> Anticlockwise rotation</li></ul><p class="detail-text">Optical rotation is experimentally determined and is <strong>not directly related</strong> to the R/S configuration of the molecule.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.6 R AND S CONFIGURATION / CIP RULES</div><p class="detail-text">The absolute configuration of a chiral center is assigned using the <strong>Cahn-Ingold-Prelog (CIP) priority rules</strong>.</p><div class="mechanism-step"><div class="step-num">1</div><div class="step-text">Assign priorities to substituents based on atomic number.</div></div><div class="mechanism-step"><div class="step-num">2</div><div class="step-text">Orient the molecule so that the lowest priority group is directed away.</div></div><div class="mechanism-step"><div class="step-num">3</div><div class="step-text">Trace the path from priority 1 to 2 to 3: clockwise gives <strong>R (Rectus)</strong>, anticlockwise gives <strong>S (Sinister)</strong>.</div></div></div>
      <div class="detail-section"><div class="detail-section-title">14.7 DIASTEREOMERS</div><p class="detail-text">Diastereomers are stereoisomers that are <strong>not mirror images</strong> of each other.</p><ul class="checklist-bullets"><li>Different physical properties</li><li>Different chemical reactivity</li><li>Can be separated by conventional methods</li></ul><p class="detail-text"><strong>Example:</strong> 2,3-dichlorobutane exhibits both enantiomeric and diastereomeric forms.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.8 MESO COMPOUNDS</div><p class="detail-text">Meso compounds contain <strong>two or more chiral centers</strong> but are overall achiral due to an internal plane of symmetry.</p><ul class="checklist-bullets"><li>Optically inactive</li><li>Internal compensation of optical rotation</li><li>Identical substituents arranged symmetrically</li></ul></div>
      <div class="detail-section"><div class="detail-section-title">14.9 NUMBER OF STEREOISOMERS</div><p class="detail-text">The maximum number of stereoisomers possible for a molecule is given by:</p><div class="detail-eq">2^n</div><p class="detail-text">Here, <em>n</em> is the number of chiral centers. This number may be reduced in the presence of <strong>meso forms</strong>, which are superimposable on their mirror images.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.10 CHIRALITY WITHOUT CHIRAL CENTERS</div><p class="detail-text">Not all chiral molecules possess a stereogenic carbon. Chirality can arise from structural features such as:</p><h3 class="sub">14.10.1 Axial Chirality</h3><p class="detail-text">Observed in allenes and substituted biphenyls. Restricted rotation leads to non-superimposable mirror images.</p><h3 class="sub">14.10.2 Planar Chirality</h3><p class="detail-text">Occurs when chirality arises from a plane rather than a center, as seen in cyclophanes and metallocenes.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.11 RACEMIC MIXTURES</div><p class="detail-text">A <strong>racemic mixture</strong> contains equal amounts of both enantiomers. It is optically inactive due to external compensation and is denoted as <strong>(&plusmn;)</strong>.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.12 RESOLUTION OF RACEMIC MIXTURES</div><p class="detail-text">Resolution refers to the separation of enantiomers from a racemic mixture.</p><ul class="checklist-bullets"><li>Formation of diastereomeric salts</li><li>Chiral chromatography</li><li>Enzymatic or biochemical methods</li></ul></div>
      <div class="detail-section"><div class="detail-section-title">14.13 CHIRALITY IN PHARMACEUTICAL SCIENCES</div><p class="detail-text">Chirality plays a critical role in drug design and pharmacology because biological systems are inherently chiral.</p><ul class="checklist-bullets"><li>Enantiomers can show different pharmacological effects</li><li>One enantiomer may be therapeutically active while the other may be inactive or harmful</li></ul><p class="detail-text"><strong>Examples:</strong> Thalidomide showed dramatically different biological effects between enantiomeric forms. Ibuprofen is pharmacologically active mainly as the S-enantiomer.</p></div>
      <div class="detail-section"><div class="detail-section-title">14.14 COMMON MISCONCEPTIONS</div><ul class="checklist-bullets"><li>R/S configuration does not indicate optical rotation.</li><li>Not all molecules with chiral centers are optically active; meso compounds are exceptions.</li><li>More chiral centers do not automatically mean greater biological activity.</li></ul></div>
      <div class="detail-section"><div class="detail-section-title">14.15 SUMMARY</div><p class="detail-text">Chirality is a central concept in stereochemistry that influences molecular behavior in both chemical and biological systems. The presence of chirality leads to stereoisomerism, including enantiomers and diastereomers, which differ in spatial arrangement and often in function. Understanding chirality is essential in pharmaceuticals, where enantiomeric purity can determine drug efficacy and safety.</p></div>`;
    openDetailPanel();
    return;
  }
  content.innerHTML=buildBookChapter(num,d);
  openDetailPanel();
}

const intermediateDetails={
  'carbocation':{
    title:'Carbocation',
    sub:'Electron-deficient carbon intermediate',
    formula:'R3C+',
    points:['Carbon has only 6 electrons and an empty p orbital.','Usually sp2 hybridized and trigonal planar.','Acts as a strong electrophile and is attacked by nucleophiles.','Can rearrange by hydride shift, methyl shift, or ring expansion.'],
    stability:'Benzylic/allylic > 3° > 2° > 1° > methyl, mainly due to resonance and hyperconjugation.',
    examples:'SN1, E1, acid-catalysed alkene hydration, Friedel-Crafts alkylation, Wagner-Meerwein rearrangement.'
  },
  'carbanion':{
    title:'Carbanion',
    sub:'Electron-rich carbon intermediate',
    formula:'R3C-',
    points:['Carbon bears a negative charge and a lone pair.','Usually pyramidal/sp3, but resonance-stabilized carbanions can be planar.','Acts as a base and nucleophile.','Stabilized by electron-withdrawing groups, resonance, and higher s-character.'],
    stability:'Greater s-character stabilizes negative charge: sp > sp2 > sp3. Resonance and -I groups also increase stability.',
    examples:'Enolates, acetylide ions, Grignard-like carbanion character, aldol and Claisen reactions.'
  },
  'free-radical':{
    title:'Free Radical',
    sub:'Neutral species with one unpaired electron',
    formula:'R3C·',
    points:['Contains an unpaired electron and is highly reactive.','Often formed by homolytic bond cleavage using heat, light, or peroxides.','Reacts by chain initiation, propagation, and termination steps.','Can add to pi bonds or abstract hydrogen/halogen atoms.'],
    stability:'Benzylic/allylic > 3° > 2° > 1° > methyl, due to resonance and hyperconjugation.',
    examples:'Alkane halogenation, allylic bromination with NBS, peroxide effect in HBr addition.'
  },
  'carbene':{
    title:'Carbene',
    sub:'Neutral divalent carbon intermediate',
    formula:':CR2',
    points:['Carbon has two bonds and two nonbonding electrons.','Exists as singlet or triplet carbene.','Singlet carbenes add stereospecifically to alkenes; triplet carbenes can be stepwise.','Commonly generated from diazo compounds or haloforms.'],
    stability:'Electron-donating substituents and metal complexes can stabilize carbenes; free carbenes are very reactive.',
    examples:'Cyclopropanation of alkenes, Simmons-Smith reaction, dichlorocarbene formation from CHCl3/base.'
  },
  'nitrene':{
    title:'Nitrene',
    sub:'Neutral monovalent nitrogen intermediate',
    formula:':NR',
    points:['Nitrogen analog of carbene with only 6 valence electrons.','Can exist as singlet or triplet nitrene.','Inserts into C-H bonds or adds to alkenes.','Often generated from azides, isocyanates, or photolysis/thermolysis pathways.'],
    stability:'Electron-withdrawing substituents and metal nitrenoid formation can control reactivity.',
    examples:'Curtius rearrangement, Hofmann rearrangement, aziridination reactions, C-H amination chemistry.'
  }
};

function showIntermediateDetail(key){
  const d=intermediateDetails[key];
  if(!d) return;
  const panel=document.getElementById('detailPanel');
  const content=document.getElementById('detailContent');
  const points=d.points.map((p,i)=>`<div class="mechanism-step"><div class="step-num">${i+1}</div><div class="step-text">${p}</div></div>`).join('');
  content.innerHTML=`<div class="detail-title">${d.title}</div><div class="detail-subtitle">${d.sub}</div>
    <div class="detail-section"><div class="detail-section-title">GENERAL FORM</div><div class="detail-eq">${d.formula}</div></div>
    <div class="detail-section"><div class="detail-section-title">KEY POINTS</div>${points}</div>
    <div class="detail-section"><div class="detail-section-title">STABILITY ORDER</div><p class="detail-text">${d.stability}</p></div>
    <div class="detail-section"><div class="detail-section-title">WHERE YOU SEE IT</div><p class="detail-text">${d.examples}</p></div>`;
  openDetailPanel();
}

document.querySelectorAll('.syllabus-item').forEach(item=>{
  const strong=item.querySelector('strong');
  const match=strong&&strong.textContent.match(/^(\d+)\./);
  if(match){
    item.setAttribute('tabindex','0');
    item.setAttribute('role','button');
    item.onclick=()=>showMasterTopicDetail(Number(match[1]));
    item.onkeydown=e=>{
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        showMasterTopicDetail(Number(match[1]));
      }
    };
  }
});

document.querySelectorAll('[data-intermediate]').forEach(item=>{
  item.setAttribute('tabindex','0');
  item.setAttribute('role','button');
  item.addEventListener('click',e=>{
    e.stopPropagation();
    showIntermediateDetail(item.dataset.intermediate);
  });
  item.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){
      e.preventDefault();
      e.stopPropagation();
      showIntermediateDetail(item.dataset.intermediate);
    }
  });
});

const couplingDetails={
  suzuki:{
    title:'1. Suzuki Coupling',
    sub:'Pd-catalysed organoboron cross-coupling',
    diagram:'Suzuki',
    reaction:'Ar-X + Ar-B(OH)₂ → Ar-Ar',
    partners:'Aryl/vinyl halide or triflate + boronic acid/boronate ester.',
    conditions:'Pd(PPh₃)₄, Pd(dppf)Cl₂, or modern Pd/ligand systems; K₂CO₃, Na₂CO₃, Cs₂CO₃ or K₃PO₄; dioxane/water, toluene/EtOH/water, DMF/water.',
    mechanism:['Oxidative addition: Pd(0) inserts into Ar-X bond.','Base activates boronic acid to boronate.','Transmetalation transfers organic group from boron to Pd.','Reductive elimination forms C-C bond and regenerates Pd(0).'],
    notes:'Very common in pharma because boronic acids are relatively low toxicity and tolerate water. Aryl bromides/iodides are easy; aryl chlorides need stronger ligands.',
    limitations:'Protodeboronation, homocoupling, deboronation of heteroaryl boronic acids, and residual Pd control.'
  },
  heck:{
    title:'2. Heck Reaction',
    sub:'Pd-catalysed arylation/vinylation of alkenes',
    diagram:'Heck',
    reaction:'Ar-X + CH₂=CHR → Ar-CH=CHR',
    partners:'Aryl/vinyl halide + alkene.',
    conditions:'Pd(OAc)₂ or Pd(PPh₃)₄, base such as Et₃N, carbonate or acetate; DMF, MeCN, toluene; heat.',
    mechanism:['Oxidative addition of Ar-X to Pd(0).','Alkene coordination to aryl-Pd complex.','Migratory insertion into Pd-C bond.','β-hydride elimination gives substituted alkene; base regenerates Pd(0).'],
    notes:'Useful for making styrenes, cinnamates and arylated alkenes. Often gives E/trans alkene.',
    limitations:'Regioisomer issues, β-hydride requirements, alkene isomerization, and high-temperature compatibility.'
  },
  sonogashira:{
    title:'3. Sonogashira Coupling',
    sub:'Pd/Cu-catalysed aryl-alkyne coupling',
    diagram:'Sonogashira',
    reaction:'Ar-X + HC≡CR → Ar-C≡CR',
    partners:'Aryl/vinyl halide + terminal alkyne.',
    conditions:'Pd catalyst, CuI co-catalyst, amine base such as Et₃N, i-Pr₂NH or piperidine; THF/DMF/MeCN; inert atmosphere preferred.',
    mechanism:['Pd oxidative addition into Ar-X.','Base/Cu forms copper acetylide from terminal alkyne.','Transmetalation transfers alkynyl group to Pd.','Reductive elimination forms aryl-alkyne bond.'],
    notes:'Excellent for installing alkynes as SAR handles or linkers. Copper-free variants reduce alkyne homocoupling.',
    limitations:'Glaser homocoupling in presence of oxygen/Cu, terminal alkyne sensitivity, residual metal control.'
  },
  stille:{
    title:'4. Stille Coupling',
    sub:'Pd-catalysed organotin cross-coupling',
    reaction:'R-SnBu₃ + R′-X → R-R′',
    partners:'Organostannane + aryl/vinyl halide or triflate.',
    conditions:'Pd(PPh₃)₄ or Pd₂(dba)₃/ligand; toluene, DMF, dioxane; sometimes LiCl or CuI additive.',
    mechanism:['Oxidative addition of organic halide to Pd(0).','Transmetalation from tin to palladium.','Reductive elimination forms C-C bond.'],
    notes:'Broad functional group tolerance and reliable with vinyl/heteroaryl partners.',
    limitations:'Organotin toxicity, difficult tin removal, regulatory burden in pharma manufacturing.'
  },
  negishi:{
    title:'5. Negishi Coupling',
    sub:'Pd/Ni-catalysed organozinc cross-coupling',
    reaction:'R-ZnX + R′-X → R-R′',
    partners:'Organozinc reagent + aryl/vinyl/alkyl halide.',
    conditions:'Pd or Ni catalyst, THF/DMF/ether solvents, inert atmosphere; organozinc prepared by transmetalation or zinc insertion.',
    mechanism:['Oxidative addition of electrophile to metal catalyst.','Transmetalation from zinc to Pd/Ni.','Reductive elimination creates coupled product.'],
    notes:'More reactive than Suzuki in some difficult couplings and often good for sp³ coupling.',
    limitations:'Organozinc reagents are moisture sensitive; preparation and handling add operational complexity.'
  },
  wurtz:{
    title:'6. Wurtz Reaction',
    sub:'Sodium-mediated alkyl halide homo coupling',
    reaction:'2 R-X + 2 Na → R-R + 2 NaX',
    partners:'Alkyl halides, usually primary and symmetrical for clean product.',
    conditions:'Sodium metal in dry ether; strictly anhydrous.',
    mechanism:['Single electron transfer from sodium to alkyl halide.','Radical/organosodium character forms.','Coupling gives higher alkane.'],
    notes:'Classical method to prepare symmetrical alkanes.',
    limitations:'Mixtures with unsymmetrical halides, elimination side reactions, poor functional group tolerance, sodium handling hazard.'
  },
  glaser:{
    title:'7. Glaser Coupling',
    sub:'Oxidative homocoupling of terminal alkynes',
    reaction:'2 HC≡CR + O₂/Cu → RC≡C-C≡CR',
    partners:'Terminal alkynes.',
    conditions:'Cu(I)/Cu(II) salts, amine base, oxygen/air; Hay and Eglinton variants modify conditions.',
    mechanism:['Terminal alkyne forms copper acetylide.','Oxidation generates coupled copper acetylide/radical character.','Reductive steps release 1,3-diyne product.'],
    notes:'Useful for symmetrical diynes and conjugated alkyne systems.',
    limitations:'Cross-selective unsymmetrical coupling is difficult; can be unwanted side reaction in Sonogashira.'
  },
  buchwald:{
    title:'8. Buchwald-Hartwig Coupling',
    sub:'Pd-catalysed C-N bond formation',
    reaction:'Ar-X + HNR₂ → Ar-NR₂',
    partners:'Aryl halide/pseudohalide + amine, amide or related N-nucleophile.',
    conditions:'Pd catalyst with bulky electron-rich phosphine ligand; NaOtBu, Cs₂CO₃, K₃PO₄ or carbonate base; toluene, dioxane, THF.',
    mechanism:['Oxidative addition of Ar-X to Pd(0).','Amine coordination and deprotonation gives amido-Pd complex.','Reductive elimination forms Ar-N bond.'],
    notes:'Core medicinal chemistry reaction for aryl amines, heteroaryl amines and late-stage diversification.',
    limitations:'Ligand/base screening often required; amine coordination, dehalogenation, and residual Pd can be issues.'
  },
  ullmann:{
    title:'9. Ullmann Reaction',
    sub:'Copper-mediated/catalysed aryl C-N, C-O, C-S or C-C coupling',
    reaction:'Ar-X + Nu-H → Ar-Nu',
    partners:'Aryl halide + amine, phenol, thiol, amide or another aryl partner.',
    conditions:'Cu powder, CuI, CuBr or Cu(OAc)₂; ligand such as diamine/proline/phenanthroline; carbonate/phosphate base; heat.',
    mechanism:['Copper activates aryl halide and/or nucleophile.','Aryl-copper or Cu-nucleophile intermediate forms.','C-N/C-O/C-S bond forms through substitution or oxidative/reductive pathway.'],
    notes:'Cost-effective alternative to Pd couplings; useful for aryl ethers and aryl amines.',
    limitations:'Classical conditions are harsh; modern ligand systems improve scope but may still need high temperature.'
  }
};

function showCouplingDetail(key){
  const d=couplingDetails[key];
  if(!d) return;
  const panel=document.getElementById('detailPanel');
  const content=document.getElementById('detailContent');
  const diagram=renderReactionDiagram(reactionDiagrams[d.diagram]);
  const steps=d.mechanism.map((s,i)=>`<div class="mechanism-step"><div class="step-num">${i+1}</div><div class="step-text">${s}</div></div>`).join('');
  content.innerHTML=`<div class="detail-title">${d.title}</div><div class="detail-subtitle">${d.sub}</div>
    <div class="detail-section"><div class="detail-section-title">GENERAL REACTION</div><div class="detail-eq">${d.reaction}</div></div>
    ${diagram}
    <div class="detail-section"><div class="detail-section-title">PARTNERS</div><p class="detail-text">${d.partners}</p></div>
    <div class="detail-section"><div class="detail-section-title">COMMON CONDITIONS</div><p class="detail-text">${d.conditions}</p></div>
    <div class="detail-section"><div class="detail-section-title">MECHANISM</div>${steps}</div>
    <div class="detail-section"><div class="detail-section-title">NOTES / R&D USE</div><p class="detail-text">${d.notes}</p></div>
    <div class="detail-section"><div class="detail-section-title">LIMITATIONS</div><p class="detail-text">${d.limitations}</p></div>`;
  openDetailPanel();
}

document.querySelectorAll('[data-coupling]').forEach(item=>{
  item.setAttribute('tabindex','0');
  item.setAttribute('role','button');
  item.addEventListener('click',e=>{
    e.stopPropagation();
    showCouplingDetail(item.dataset.coupling);
  });
  item.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){
      e.preventDefault();
      e.stopPropagation();
      showCouplingDetail(item.dataset.coupling);
    }
  });
});

// ═══════════════════════════════════════════
// SCROLL ANIMATIONS
// ═══════════════════════════════════════════
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.style.opacity='1';
      e.target.style.transform='translateY(0)';
    }
  });
},{threshold:0.1});
document.querySelectorAll('.topic-card,.reaction-card,.mini-reaction,.fg-card,.matrix-cell,.chapter-link,.quick-map-inner').forEach(el=>{
  el.style.opacity='0';
  el.style.transform='translateY(15px)';
  el.style.transition='opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

