
const iconTemplates = {
  flag: `<svg viewBox="0 0 48 48"><path d="M14 40V10"/><path d="M15 11c8-5 13 5 22 0v18c-9 5-14-5-22 0"/></svg>`,
  ball: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18"/><path d="M24 6l7 8-3 9h-8l-3-9 7-8z"/><path d="M20 23l-8 5"/><path d="M28 23l8 5"/><path d="M16 38l4-8h8l4 8"/></svg>`,
  paint: `<svg viewBox="0 0 48 48"><path d="M24 6c-10 0-18 7-18 16 0 8 6 14 14 14h3c2 0 3 2 3 4 0 1 1 2 3 2 8 0 15-8 15-18C44 14 35 6 24 6z"/><circle cx="16" cy="20" r="2"/><circle cx="23" cy="15" r="2"/><circle cx="31" cy="20" r="2"/><circle cx="19" cy="29" r="2"/></svg>`,
  hands: `<svg viewBox="0 0 48 48"><path d="M15 23V12c0-3 4-3 4 0v9"/><path d="M19 22V9c0-3 5-3 5 0v13"/><path d="M24 22V11c0-3 5-3 5 0v13"/><path d="M29 24v-8c0-3 5-3 5 0v12c0 8-5 13-12 13-8 0-12-7-14-13"/><path d="M8 28c-2-4 3-6 6-1l3 4"/></svg>`,
  shield: `<svg viewBox="0 0 48 48"><path d="M24 5l16 7v12c0 10-7 17-16 20C15 41 8 34 8 24V12l16-7z"/><path d="M18 25l4 4 8-10"/></svg>`
};

let state=null;
async function loadData(){const r=await fetch("./data.json?v="+Date.now(),{cache:"no-store"});if(!r.ok)throw new Error("data.json");return await r.json()}
function setText(f,v){document.querySelectorAll(`[data-field="${f}"]`).forEach(e=>e.textContent=v)}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function attr(v){return esc(v).replace(/"/g,"&quot;")}
function render(data){
 setText("campName",(data.campName||"Зелёные горки").toUpperCase());setText("shift",data.shift||"2 смена");setText("mainWord",data.mainWord||"Рейтинг");setText("title",data.title||"деятельности отрядов");setText("subtitle",data.subtitle||"Промежуточные результаты");setText("updated",data.updated||"");
 const list=document.getElementById("rankingList");list.innerHTML="";
 (data.ranking||[]).sort((a,b)=>Number(a.place)-Number(b.place)).forEach(item=>{const row=document.createElement("article");row.className="rank-row";row.innerHTML=`<div class="place"><span class="badge">${Number(item.place)}</span></div><div class="squad">${esc(item.name)}</div><div class="counselors">${esc(item.counselors||"—")}</div><div class="score">${Number(item.score)}</div>`;list.appendChild(row)});
 const cList=document.getElementById("criteriaList");cList.innerHTML="";
 (data.criteria||[]).forEach(item=>{const card=document.createElement("article");card.className="criteria-item";card.innerHTML=`<div class="icon">${iconTemplates[item.icon]||iconTemplates.flag}</div><div class="criteria-name">${esc(item.name)}</div><div class="criteria-value">${Number(item.value)}</div>`;cList.appendChild(card)});
}
function fillEditor(data){
 state=structuredClone(data);
 document.getElementById("shiftInput").value=data.shift||"";document.getElementById("mainWordInput").value=data.mainWord||"";document.getElementById("titleInput").value=data.title||"";document.getElementById("subtitleInput").value=data.subtitle||"";document.getElementById("updatedInput").value=data.updated||"";
 const re=document.getElementById("rankingEditor");re.innerHTML="";
 (data.ranking||[]).forEach((item,i)=>{const row=document.createElement("div");row.className="squad-row";row.innerHTML=`<input type="number" min="1" data-type="ranking" data-index="${i}" data-field="place" value="${Number(item.place)}"><input type="text" data-type="ranking" data-index="${i}" data-field="name" value="${attr(item.name)}"><input type="text" data-type="ranking" data-index="${i}" data-field="counselors" value="${attr(item.counselors||"")}"><input type="number" min="0" data-type="ranking" data-index="${i}" data-field="score" value="${Number(item.score)}"><button type="button" class="delete-btn" data-delete-ranking="${i}">🗑</button>`;re.appendChild(row)});
 const ce=document.getElementById("criteriaEditor");ce.innerHTML="";
 (data.criteria||[]).forEach((item,i)=>{const row=document.createElement("div");row.className="criterion-row";row.innerHTML=`<input type="text" data-type="criteria" data-index="${i}" data-field="name" value="${attr(item.name)}"><input type="number" min="0" data-type="criteria" data-index="${i}" data-field="value" value="${Number(item.value)}"><button type="button" class="delete-btn" data-delete-criterion="${i}">🗑</button>`;ce.appendChild(row)});
 bindDelete();
}
function collect(){
 const d=structuredClone(state);d.shift=document.getElementById("shiftInput").value.trim();d.mainWord=document.getElementById("mainWordInput").value.trim();d.title=document.getElementById("titleInput").value.trim();d.subtitle=document.getElementById("subtitleInput").value.trim();d.updated=document.getElementById("updatedInput").value.trim();
 document.querySelectorAll('[data-type="ranking"]').forEach(inp=>{const i=Number(inp.dataset.index),f=inp.dataset.field;d.ranking[i][f]=["place","score"].includes(f)?Number(inp.value):inp.value.trim()});
 document.querySelectorAll('[data-type="criteria"]').forEach(inp=>{const i=Number(inp.dataset.index),f=inp.dataset.field;d.criteria[i][f]=f==="value"?Number(inp.value):inp.value.trim()});
 d.ranking.sort((a,b)=>Number(a.place)-Number(b.place));return d;
}
function download(){const d=collect();const blob=new Blob([JSON.stringify(d,null,2)],{type:"application/json;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="data.json";a.click();URL.revokeObjectURL(url)}
function bindDelete(){document.querySelectorAll("[data-delete-ranking]").forEach(b=>b.onclick=()=>{const d=collect();d.ranking.splice(Number(b.dataset.deleteRanking),1);state=d;fillEditor(d);render(d)});document.querySelectorAll("[data-delete-criterion]").forEach(b=>b.onclick=()=>{const d=collect();d.criteria.splice(Number(b.dataset.deleteCriterion),1);state=d;fillEditor(d);render(d)})}
document.getElementById("adminForm").addEventListener("submit",e=>{e.preventDefault();const d=collect();state=d;fillEditor(d);render(d)});
document.getElementById("downloadBtn").onclick=download;
document.getElementById("resetBtn").onclick=async()=>{const d=await loadData();state=d;fillEditor(d);render(d)};
document.getElementById("sortBtn").onclick=()=>{const d=collect();d.ranking.sort((a,b)=>Number(b.score)-Number(a.score)).forEach((x,i)=>x.place=i+1);state=d;fillEditor(d);render(d)};
document.getElementById("addSquadBtn").onclick=()=>{const d=collect();d.ranking.push({place:d.ranking.length+1,name:`${d.ranking.length+1} отряд`,counselors:"",score:0});state=d;fillEditor(d);render(d)};
document.getElementById("addCriterionBtn").onclick=()=>{const d=collect();d.criteria.push({name:"Новый критерий",value:0,icon:"flag"});state=d;fillEditor(d);render(d)};
loadData().then(d=>{state=d;fillEditor(d);render(d)}).catch(e=>{console.error(e);alert("Не удалось загрузить data.json")});
