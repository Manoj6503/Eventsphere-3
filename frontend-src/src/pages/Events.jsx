import {useState,useEffect,useContext} from 'react';import {api} from '../api.js';import {Ctx} from '../ctx.js';import {CATS,CC} from '../common.js';
export function EventCard({e,mode,onRegister,onEdit}){const left=e.capacity-e.taken,c=CC[e.category]||CC.Other,img=/^https?:\/\//.test(e.banner||'');
 return <div className="card"><div className="ban" style={img?{backgroundImage:`url(${JSON.stringify(e.banner)})`}:{background:`linear-gradient(135deg,${c[0]},${c[1]})`}}><span className="date">{e.event_date}</span>{!img&&<i className="em">{c[2]}</i>}</div>
  <div className="cb"><span className="tag">{e.category}</span><h3>{e.title}</h3><div className="meta">📍 {e.venue} · {e.start_time||''}</div>
  <div className="meta">by {e.organizer} · {left>0?`${left} of ${e.capacity} seats left`:'Full'}</div><div className="meta">{(e.description||'').slice(0,90)}</div>
  <div className="row">{mode==='pub'?<button disabled={left<1} onClick={()=>onRegister(e.id)}>{left<1?'Full':'Register'}</button>
   :<><span className="st">{e.status.replace('_',' ')}</span><button className="o" onClick={()=>onEdit(e)}>Edit</button></>}</div></div></div>}

export function MyEvents(){const {go,toast}=useContext(Ctx);const [ev,setEv]=useState(null);
 useEffect(()=>{api('/my/events').then(r=>setEv(r.events)).catch(e=>toast(e.message,1))},[]);
 return <main><h2>My events</h2>{!ev?<div className="grid"><div className="sk"/></div>:<div className="grid">{ev.map(e=><EventCard key={e.id} e={e} mode="own" onEdit={x=>go('form',x)}/>)}{!ev.length&&<div className="empty">No proposals yet.</div>}</div>}</main>}

export function EventForm({data:ev}){const {go,toast}=useContext(Ctx);ev=ev||{};
 const [f,setF]=useState({title:ev.title||'',description:ev.description||'',category:ev.category||'Technical',banner:ev.banner||'',venue:ev.venue||'',event_date:ev.event_date||'',start_time:ev.start_time||'',end_time:ev.end_time||'',reg_open:ev.reg_open||'',reg_close:ev.reg_close||'',capacity:ev.capacity||50,eligibility:ev.eligibility||'',contact:ev.contact||''});
 const set=k=>e=>setF({...f,[k]:e.target.value});
 const inp=(k,l,t='text',req=true)=><label>{l}<input type={t} value={f[k]} onChange={set(k)} required={req}/></label>;
 const submit=async e=>{e.preventDefault();try{const r=await api(ev.id?`/events/${ev.id}/update`:'/events','POST',f);toast(r.message);go('myev')}catch(err){toast(err.message,1)}};
 return <main><form className="box" onSubmit={submit}><h2>{ev.id?'Edit event':'Propose an event'}</h2>{inp('title','Title')}
  <label>Description<textarea rows={3} value={f.description} onChange={set('description')}/></label>
  <div className="two"><label>Category<select value={f.category} onChange={set('category')}>{CATS.map(c=><option key={c}>{c}</option>)}</select></label>{inp('capacity','Capacity','number')}</div>
  {inp('banner','Banner image URL','url',false)}{inp('venue','Venue')}
  <div className="two">{inp('event_date','Event date','date')}{inp('start_time','Start','time',false)}{inp('end_time','End','time',false)}{inp('reg_open','Registration opens','date')}{inp('reg_close','Registration closes','date')}</div>
  {inp('eligibility','Eligibility','text',false)}{inp('contact','Contact details','text',false)}<br/><button>Submit for approval</button></form></main>}
