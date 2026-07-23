#!/usr/bin/env node
/** Compact, PII-safe Webvisor visit feature extractor. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const input = path.resolve(root, process.argv[2] || 'analytics/webvisor-20260717-20260723/visits');
const output = path.resolve(root, process.argv[3] || 'analytics/visit-features');
const success = 'Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.';
const sections = ['hero','about','program','injuries','legal','emotional_photo','instructors','pricing','registration','footer'];
const stops = [.1301,.1947,.4314,.5327,.6384,.7020,.7930,.8747,.9894,1];
const safeAttrs = new Set(['id','class','name','type','role','href','action','aria-label','placeholder','data-testid','data-section']);
const parse = x => { if (typeof x !== 'string') return x; try { return JSON.parse(x); } catch { return x; } };
const clean = x => String(x || '').replace(/\s+/g, ' ').trim().slice(0, 240);
const sec = r => sections[Math.min(sections.length - 1, stops.findIndex(x => r <= x) < 0 ? sections.length - 1 : stops.findIndex(x => r <= x))];
function descriptor(nodes, id) {
  const out=[]; let n=nodes.get(Number(id)); let i=0;
  while(n && i++ < 4) { const a=n.attrs || {}; out.push({tag:n.tag, id:a.id, class:a.class, name:a.name, type:a.type, role:a.role, text:clean(n.text)}); n=nodes.get(Number(n.parent)); }
  return out.map(x=>({...x,text:x.text.slice(0,100)}));
}
function getEvents(v) { return (v.responses?.fetchHit || []).flatMap(x => x?.result?.data?.events || []); }
function feature(file) {
  const visit=JSON.parse(fs.readFileSync(file,'utf8')), raw=getEvents(visit), nodes=new Map(), pages=[], events=[], mutations=[];
  let pageHeight=0, viewport={};
  for (const r of raw) { const d=parse(r.data); if (!d || typeof d !== 'object') continue;
    if (r.group === 'page') { const m=d.meta || {}; viewport=m.viewport || m.screen || viewport; pageHeight=Math.max(pageHeight, m.pageHeight || 0); pages.push({time:d.stamp ?? r.stamp ?? 0,address:m.address || m.location?.href || '',title:clean(m.title),viewport}); for (const n of d.content || []) nodes.set(Number(n.id),{tag:n.name,attrs:Object.fromEntries(Object.entries(n.attributes || {}).filter(([k])=>safeAttrs.has(k))),text:clean(n.content),parent:n.parent}); }
    if (r.group === 'event') { const type=d.type || r.type; const meta=d.meta || {}; if(type==='resize') { viewport={width:meta.width,height:meta.height}; pageHeight=Math.max(pageHeight,meta.pageHeight||0); } if(type) events.push({type,time:d.time ?? r.stamp ?? 0,target:d.target, x:meta.x,y:meta.y,meta}); }
    if (r.group === 'mutation') mutations.push({time:d.stamp ?? r.stamp ?? 0,data:d});
  }
  const times=events.map(x=>x.time).filter(Number.isFinite), height=Math.max(1,pageHeight), ordered=events.sort((a,b)=>a.time-b.time);
  let currentScrollY=0;
  for (const event of ordered) {
    if (event.type==='scroll' && Number.isFinite(event.y)) currentScrollY=Math.max(0,event.y);
    event.scrollY=currentScrollY;
  }
  const scrolls=ordered.filter(x=>x.type==='scroll' && Number.isFinite(x.y));
  const ratio=e=>Math.max(0,Math.min(1,(Number.isFinite(e.scrollY)?e.scrollY:e.y||0)/height)), max=Math.max(0,...scrolls.map(ratio));
  const relevant=new Set(['click','focus','change','keydown','keyup','input','submit']);
  const actions=events.filter(x=>relevant.has(x.type)).slice(-120).map(x=>({type:x.type,time:x.time,target:descriptor(nodes,x.target),section:sec(ratio(x)),coordinates:Number.isFinite(x.y)?{x:x.x,y:x.y}:undefined}));
  const edits={}; for(const a of actions) if(['change','input','keydown','keyup'].includes(a.type)){ const n=a.target[0]||{}, key=n.name||n.id||n.type||'unknown'; edits[key]=(edits[key]||0)+1; }
  const evidence=[]; for(const m of mutations){ const s=JSON.stringify(m.data); if(s.includes(success)) evidence.push({time:m.time,kind:'success',text:success}); else if(/ошибк|error|не удалось|неверн/i.test(s)) evidence.push({time:m.time,kind:'error'}); }
  const pageSuccess=pages.some(p=>p.title.includes(success)); const confirmed=pageSuccess || evidence.some(x=>x.kind==='success');
  const formAction=actions.some(a=>a.type==='submit'||a.target.some(n=>n.tag==='form'||n.type==='submit'||/submit|заявк|отправ/i.test(`${n.text} ${n.id} ${n.class}`))) || Object.keys(edits).length>0;
  const status=confirmed?'confirmed':formAction?'attempted':'not_attempted';
  const activity={}; const all=ordered.filter(e=>e.type!=='mousemove'); for(let i=0;i<all.length;i++){ const s=sec(ratio(all[i])); activity[s]??={events:0,dwell_ms:0}; activity[s].events++; if(i+1<all.length && sec(ratio(all[i+1]))===s) activity[s].dwell_ms+=Math.min(30000,Math.max(0,all[i+1].time-all[i].time)); }
  const deepestIndex=sections.indexOf(sec(max)), seen=sections.slice(0,deepestIndex+1);
  return {metadata:{visit_id:String(visit.visit_id || path.basename(file,'.json')),source:path.basename(file),status:visit.status,recorded_at:visit.metadata?.date || null},data_quality:{raw_events:raw.length,parsed_events:events.length,has_page:pages.length>0,has_dom:nodes.size>0,page_height:pageHeight,viewport},pages,duration_ms:times.length?Math.max(...times)-Math.min(...times):0,max_scroll_ratio:+max.toFixed(4),deepest_section:sec(max),sections_seen:seen,exit_section:sec(ratio(all.at(-1)||{})),section_activity:activity,key_actions:actions,form_evidence:{field_edit_counts:edits,submit_or_form_interaction:formAction,mutation_evidence:evidence},conversion:{status,success_text:confirmed?success:null}};
}
fs.mkdirSync(output,{recursive:true});
const files=fs.readdirSync(input).filter(x=>x.endsWith('.json')).sort(); const manifest=[]; let oversized=0;
for(const name of files){ const f=feature(path.join(input,name)), dst=path.join(output,`${f.metadata.visit_id}.json`), json=JSON.stringify(f); if(Buffer.byteLength(json)>40000) oversized++; fs.writeFileSync(dst,json); manifest.push({visit_id:f.metadata.visit_id,file:path.basename(dst),conversion:f.conversion.status,max_scroll_ratio:f.max_scroll_ratio,duration_ms:f.duration_ms}); }
fs.writeFileSync(path.join(output,'manifest.jsonl'),manifest.map(x=>JSON.stringify(x)).join('\n')+'\n');
const counts=Object.fromEntries(['confirmed','attempted','not_attempted'].map(k=>[k,manifest.filter(x=>x.conversion===k).length]));
fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify({input,output,visits:manifest.length,conversion:counts,oversized_files:oversized,generated_at:new Date().toISOString()}));
console.log(JSON.stringify({visits:manifest.length,conversion:counts,oversized}));
