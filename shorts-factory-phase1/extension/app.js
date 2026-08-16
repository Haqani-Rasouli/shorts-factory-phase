let project = null;

const $ = id => document.getElementById(id);

async function save(){
  if(project) await chrome.storage.local.set({currentProject:project});
}

async function load(){
  const data = await chrome.storage.local.get(["currentProject"]);
  if(data.currentProject){
    project=data.currentProject;
    $("topic").value=project.topic;
    $("niche").value=project.niche;
    $("duration").value=String(project.duration);
    render();
  }
}

function setStatus(text, error=false){
  const el=$("status");
  el.textContent=text;
  el.classList.remove("hidden","error");
  if(error) el.classList.add("error");
}

function render(){
  if(!project){ $("results").classList.add("hidden"); return; }
  $("results").classList.remove("hidden");
  $("scoreBadge").textContent=`${project.scores.overall}/100`;
  $("scoreGrid").innerHTML=[
    ["Demand",project.scores.demand],
    ["Curiosity",project.scores.curiosity],
    ["Visual",project.scores.visual],
    ["Retention",project.scores.retention],
    ["Competition",project.scores.competition],
    ["Originality",project.scores.originality]
  ].map(([n,v])=>`<div class="metric"><div class="metric-name">${n}</div><div class="metric-value">${v}/100</div></div>`).join("");
  $("opportunity").textContent=project.opportunity;

  $("hooks").innerHTML=project.hooks.map((h,i)=>`
    <div class="hook ${i===0?"best":""}">
      <div class="hook-top"><span>HOOK ${h.id} ${i===0?"🏆 BEST":""}</span><span class="tag">${h.score}/100</span></div>
      <div class="hook-text">${escapeHtml(h.text)}</div>
      <div class="hook-top" style="margin-top:6px">${escapeHtml(h.reason)}</div>
    </div>`).join("");

  const s=project.script;
  $("script").innerHTML=`
    <div class="block"><div class="block-title">Hook</div>${escapeHtml(s.hook)}</div>
    <div class="block"><div class="block-title">Setup</div>${escapeHtml(s.setup)}</div>
    <div class="block"><div class="block-title">Body</div>${s.body.map(x=>`<p class="script-line">${escapeHtml(x)}</p>`).join("")}</div>
    <div class="block"><div class="block-title">Payoff</div>${escapeHtml(s.payoff)}</div>
    <div class="block"><div class="block-title">Ending / Loop</div>${escapeHtml(s.ending)}</div>
    <div class="hook-top">Estimated words: ${s.estimatedWords} · Target: ${s.targetDuration}s</div>`;

  $("scenes").innerHTML=project.scenes.map(sc=>`
    <div class="scene">
      <div class="scene-head"><span>SCENE ${sc.id} · ${sc.type}</span><span class="scene-time">${sc.start}s–${sc.end}s</span></div>
      <div class="scene-label">Narration</div><div>${escapeHtml(sc.text)}</div>
      <div class="scene-label">Visual</div><div>${escapeHtml(sc.visual)}</div>
      <div class="scene-label">Generation prompt</div><div class="prompt">${escapeHtml(sc.generationPrompt)}</div>
    </div>`).join("");
}

function escapeHtml(v){
  return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

$("generate").addEventListener("click",async()=>{
  const topic=$("topic").value.trim();
  if(!topic){setStatus("Enter a topic first.",true);return;}
  const btn=$("generate"); btn.disabled=true; setStatus("Building concept…");
  await new Promise(r=>setTimeout(r,350));
  project=window.shortsEngine.generateProject({
    topic,niche:$("niche").value,duration:$("duration").value
  });
  await save(); render(); setStatus("Concept created. This phase uses a local mock engine.");
  btn.disabled=false;
});

$("newProject").addEventListener("click",async()=>{
  project=null; await chrome.storage.local.remove("currentProject");
  $("topic").value=""; $("results").classList.add("hidden"); $("status").classList.add("hidden");
});

document.addEventListener("click",async(e)=>{
  const action=e.target?.dataset?.action;
  if(!action||!project)return;
  if(action==="regen-hooks") project=window.shortsEngine.regenerateHooks(project);
  if(action==="regen-script") project=window.shortsEngine.regenerateScript(project);
  if(action==="regen-scenes") project=window.shortsEngine.regenerateScenes(project);
  await save(); render();
});

$("export").addEventListener("click",()=>{
  if(!project)return;
  const blob=new Blob([JSON.stringify(project,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url;
  a.download=`shorts-factory-${project.id}.json`; a.click();
  URL.revokeObjectURL(url);
});

$("clear").addEventListener("click",async()=>{
  if(!confirm("Delete the current project?"))return;
  project=null; await chrome.storage.local.remove("currentProject"); render();
});

load();
