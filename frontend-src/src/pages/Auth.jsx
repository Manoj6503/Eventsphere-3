import {useState,useContext} from 'react';import {api} from '../api.js';import {Ctx} from '../ctx.js';
export default function Auth({mode}){const {setMe,go,toast}=useContext(Ctx);const login=mode==='login';
 const [f,setF]=useState({name:'',email:'',password:'',role:'student'});const set=k=>e=>setF({...f,[k]:e.target.value});
 const submit=async e=>{e.preventDefault();try{
  if(!login){await api('/signup','POST',f);toast('Account created, please log in');return go('login')}
  await api('/login','POST',{email:f.email,password:f.password});setMe((await api('/me')).user);go('home')}catch(err){toast(err.message,1)}};
 return <main><form className="box" onSubmit={submit}><h2>{login?'Welcome back':'Create account'}</h2>
  {!login&&<label>Full name<input value={f.name} onChange={set('name')} required/></label>}
  <label>Email<input type="email" value={f.email} onChange={set('email')} required/></label>
  <label>Password (8+ chars)<input type="password" minLength={8} value={f.password} onChange={set('password')} required/></label>
  {!login&&<label>I am a<select value={f.role} onChange={set('role')}><option value="student">Student</option><option value="organizer">Event Organizer</option></select></label>}
  <br/><button>{login?'Login':'Sign up'}</button></form></main>}
