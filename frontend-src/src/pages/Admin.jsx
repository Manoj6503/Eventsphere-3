import {useState,useEffect,useContext} from 'react';import {api} from '../api.js';import {Ctx} from '../ctx.js';
export default function Admin(){const {toast}=useContext(Ctx);const [d,setD]=useState(null);
 const load=()=>Promise.all([api('/admin/stats'),api('/admin/events')]).then(([s,l])=>setD({s,l:l.events})).catch(e=>toast(e.message,1));
 useEffect(()=>{load()},[]);
 const review=async(id,action)=>{let reason='';if(action!=='approve'){reason=prompt('Reason (required):');if(!reason)return}
  try{toast((await api(`/admin/events/${id}/review`,'POST',{action,reason})).message);load()}catch(e){toast(e.message,1)}};
 if(!d)return <main><div className="sk"/></main>;const mx=Math.max(1,...d.s.byCategory.map(c=>c.n));
 return <main><h2>Admin dashboard</h2><div className="stats">{Object.entries(d.s.stats).map(([k,v])=><div className="stat" key={k}><b>{v}</b>{k}</div>)}</div>
  <div className="panel" style={{maxWidth:'none',marginBottom:20}}><b>Registrations by category</b>{d.s.byCategory.map(c=><div className="meta" key={c.category}>{c.category} ({c.n})<div className="bar" style={{width:`${c.n/mx*100}%`,minWidth:4}}/></div>)}</div>
  <table><thead><tr><th>Event</th><th>Organizer</th><th>Date</th><th>Seats</th><th>Status</th><th>Review</th></tr></thead><tbody>{d.l.map(e=><tr key={e.id}><td>{e.title}</td><td>{e.organizer}</td><td>{e.event_date}</td><td>{e.taken}/{e.capacity}</td><td className="st">{e.status.replace('_',' ')}</td>
   <td><button onClick={()=>review(e.id,'approve')}>Approve</button> <button className="o" onClick={()=>review(e.id,'changes')}>Changes</button> <button className="d" onClick={()=>review(e.id,'reject')}>Reject</button></td></tr>)}</tbody></table></main>}
