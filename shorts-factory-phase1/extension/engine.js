// Phase 1 deterministic mock engine.
// Replace this module with a backend API client in Phase 2.
// The extension must never contain provider secrets.

const HOOK_TEMPLATES = [
  t => `You probably never noticed this about ${t}.`,
  t => `Scientists discovered something strange about ${t}.`,
  t => `This is why ${t} is much crazier than you think.`,
  t => `Here's the part about ${t} nobody tells you.`,
  t => `What happens with ${t} is genuinely surprising.`
];

function clamp(n){ return Math.max(0, Math.min(100, Math.round(n))); }
function hash(s){ let h=2166136261; for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)} return h>>>0; }

function scoreTopic(topic, niche){
  const h = hash(topic+niche);
  const base = 68 + (h % 18);
  return {
    overall: clamp(base),
    demand: clamp(base + ((h>>3)%13)-6),
    curiosity: clamp(base + ((h>>7)%15)-5),
    visual: clamp(base + ((h>>11)%17)-4),
    retention: clamp(base + ((h>>15)%13)-5),
    competition: clamp(100-(base-5) + ((h>>19)%10)-5),
    originality: clamp(base + ((h>>23)%19)-8)
  };
}

function makeHooks(topic){
  return HOOK_TEMPLATES.map((fn,i)=>({
    id:i+1,
    text:fn(topic),
    score: clamp(82 + ((hash(topic+String(i)) % 18))),
    reason:["strong curiosity gap","clear premise","pattern interruption","information gap","high spoken clarity"][i]
  })).sort((a,b)=>b.score-a.score);
}

function makeScript(topic, niche, duration, hooks){
  const hook = hooks[0].text;
  const body = [
    `The surprising part is that ${topic.toLowerCase()} is connected to a detail most people completely miss.`,
    `Once you look at what actually happens, the explanation becomes much more interesting than the usual version.`,
    `And that detail matters because it changes how we should think about the whole thing.`
  ];
  return {
    hook,
    setup:`Let's break down what's really happening.`,
    body,
    payoff:`So the next time you hear about ${topic.toLowerCase()}, remember that hidden detail.`,
    ending:`And that's the part almost everyone misses.`,
    targetDuration:Number(duration),
    estimatedWords: Math.round(Number(duration)*2.4)
  };
}

function makeScenes(topic, script){
  const pieces = [
    {type:"HOOK", text:script.hook, visual:`Fast, visually striking opening shot representing ${topic}. Immediate motion, strong subject separation, cinematic lighting.`, camera:"Fast push-in", text:"STOP SCROLLING"},
    {type:"SETUP", text:script.setup, visual:`Clear establishing shot explaining the central subject of ${topic}. Make the subject instantly understandable on a phone screen.`, camera:"Controlled dolly", text:"HERE'S WHAT'S HAPPENING"},
    ...script.body.map((x,i)=>({type:`BODY ${i+1}`,text:x,visual:`Cinematic explanatory visualization for ${topic}; show the specific concept being narrated rather than generic footage.`,camera:"Slow tracking movement",text:"THE DETAIL"})),
    {type:"PAYOFF", text:script.payoff, visual:`Reveal the most surprising visual implication of ${topic}. Build toward a clear payoff.`, camera:"Reveal / pull-back", text:"THE SURPRISING PART"},
    {type:"ENDING", text:script.ending, visual:`Strong final image related to ${topic} that can visually transition back to the opening shot for a loop.`, camera:"Subtle reverse movement", text:"DID YOU KNOW?"}
  ];
  const duration = 30 / pieces.length;
  return pieces.map((p,i)=>({
    id:i+1,start:Number((i*duration).toFixed(1)),end:Number(((i+1)*duration).toFixed(1)),
    ...p,
    generationPrompt:`Vertical 9:16 short-form video. ${p.visual} Camera: ${p.camera}. No text, no logos, no watermark. High visual clarity on mobile. ${topic}.`
  }));
}

window.shortsEngine = {
  generateProject({topic,niche,duration}){
    const scores = scoreTopic(topic,niche);
    const hooks = makeHooks(topic);
    const script = makeScript(topic,niche,duration,hooks);
    const scenes = makeScenes(topic,script);
    return {
      id:crypto.randomUUID(),
      createdAt:new Date().toISOString(),
      topic,niche,duration:Number(duration),
      scores,hooks,script,scenes,
      opportunity:`This is a Phase 1 heuristic score. In Phase 4, research signals such as trends, competition, questions and outlier videos should replace the mock scoring.`
    };
  },
  regenerateHooks(project){ project.hooks=makeHooks(project.topic).sort(()=>Math.random()-.5).sort((a,b)=>b.score-a.score); return project; },
  regenerateScript(project){ project.script=makeScript(project.topic,project.niche,project.duration,project.hooks); project.scenes=makeScenes(project.topic,project.script); return project; },
  regenerateScenes(project){ project.scenes=makeScenes(project.topic,project.script); return project; }
};
