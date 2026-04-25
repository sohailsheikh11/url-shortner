import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";


const API_BASE = "http://localhost:3000/api/v1";

const EyeIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>) : (<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>)}
  </svg>
);

const LinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const btnStyle = {
  display:"flex", alignItems:"center", justifyContent:"center",
  height:48, padding:"0 24px",
  background:"#d4956a", border:"none", borderRadius:8,
  color:"#1a0f0a", fontSize:15, fontWeight:700,
  fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
  transition:"background 0.2s", letterSpacing:"0.01em",
};

function Field({ label, type="text", value, onChange, error, placeholder }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";
  return (
    <div style={{ marginBottom:20 }}>
      <label style={{ display:"block", fontSize:11, fontWeight:600, color:"#8a7a6e", letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:7, fontFamily:"'DM Mono',monospace" }}>{label}</label>
      <div style={{ position:"relative" }}>
        <input
          type={isPassword ? (show?"text":"password") : type}
          value={value} onChange={onChange} placeholder={placeholder}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{
            width:"100%", height:48, padding:isPassword?"0 46px 0 16px":"0 16px",
            background: focused?"#1c1814":"#161210",
            border: error?"1.5px solid #c0392b": focused?"1.5px solid #d4956a":"1.5px solid #2a201a",
            borderRadius:8, color:"#f0e8e0", fontSize:14,
            fontFamily:"'DM Sans',sans-serif", outline:"none",
            transition:"all 0.2s", boxSizing:"border-box",
          }}
        />
        {isPassword && (
          <button type="button" onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#5a4e46", padding:0, display:"flex", alignItems:"center" }}
            onMouseEnter={e=>e.currentTarget.style.color="#d4956a"} onMouseLeave={e=>e.currentTarget.style.color="#5a4e46"}>
            <EyeIcon open={show}/>
          </button>
        )}
      </div>
      {error && <div style={{ marginTop:5, fontSize:12, color:"#e07060" }}>{error}</div>}
    </div>
  );
}

function StrengthBar({ password }) {
  const score = [/.{8,}/,/[A-Z]/,/[0-9]/,/[^a-zA-Z0-9]/].filter(r=>r.test(password)).length;
  const colors = ["#2e2620","#c0392b","#e07030","#c8a020","#2ecc71"];
  const labels = ["","Weak","Fair","Good","Strong"];
  if (!password) return null;
  return (
    <div style={{ marginBottom:16, marginTop:-10 }}>
      <div style={{ display:"flex", gap:4, marginBottom:4 }}>
        {[1,2,3,4].map(i=>(
          <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=score?colors[score]:"#2a201a", transition:"background 0.3s" }}/>
        ))}
      </div>
      <div style={{ fontSize:11, color:colors[score], fontFamily:"'DM Mono',monospace" }}>{labels[score]}</div>
    </div>
  );
}

function GridLines() {
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      {[...Array(7)].map((_,i)=>(
        <div key={i} style={{ position:"absolute", left:`${i*17}%`, top:0, bottom:0, width:"0.5px", background:"rgba(212,149,106,0.05)" }}/>
      ))}
      {[...Array(9)].map((_,i)=>(
        <div key={i} style={{ position:"absolute", top:`${i*13}%`, left:0, right:0, height:"0.5px", background:"rgba(212,149,106,0.04)" }}/>
      ))}
      <div style={{ position:"absolute", top:"12%", right:"6%", width:200, height:200, borderRadius:"50%", border:"0.5px solid rgba(212,149,106,0.07)" }}/>
      <div style={{ position:"absolute", top:"6%", right:"10%", width:320, height:320, borderRadius:"50%", border:"0.5px solid rgba(212,149,106,0.04)" }}/>
      <div style={{ position:"absolute", bottom:"8%", left:"4%", width:140, height:140, borderRadius:"50%", border:"0.5px solid rgba(212,149,106,0.05)" }}/>
    </div>
  );
}

function SuccessState({ title, subtitle, action, actionLabel }) {
  return (
    <div style={{ textAlign:"center", padding:"1.5rem 0", animation:"fadeUp 0.4s ease" }}>
      <div style={{ width:60, height:60, borderRadius:"50%", background:"rgba(46,204,113,0.08)", border:"1.5px solid rgba(46,204,113,0.25)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", color:"#2ecc71" }}>
        <CheckCircleIcon/>
      </div>
      <div style={{ fontSize:22, fontWeight:400, color:"#f0e8e0", fontFamily:"'DM Serif Display',serif", marginBottom:8 }}>{title}</div>
      <div style={{ fontSize:14, color:"#5a4e46", marginBottom:24 }}>{subtitle}</div>
      <button onClick={action} style={{ ...btnStyle, margin:"0 auto" }}>{actionLabel}</button>
    </div>
  );
}

function Signup({ onSwitch }) {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const set = f => e => setForm(p=>({...p,[f]:e.target.value}));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "At least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true); setApiError("");
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name:form.name, email:form.email, password:form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Signup failed");
      setSuccess(true);
    } catch(err) { setApiError(err.message); }
    finally { setLoading(false); }
  };

  if (success) return <SuccessState title="Account created!" subtitle="You're all set. Sign in to start shortening links." action={onSwitch} actionLabel="Go to login" />;

  return (
    <div style={{ animation:"fadeUp 0.3s ease" }}>
      <Field label="Full name" value={form.name} onChange={set("name")} error={errors.name} placeholder="Ada Lovelace"/>
      <Field label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} placeholder="ada@example.com"/>
      <Field label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} placeholder="Min 8 characters"/>
      <StrengthBar password={form.password}/>
      <Field label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} placeholder="Repeat password"/>
      {apiError && <div style={{ padding:"10px 14px", background:"rgba(192,57,43,0.1)", border:"1px solid rgba(192,57,43,0.25)", borderRadius:8, color:"#e07060", fontSize:13, marginBottom:16 }}>{apiError}</div>}
      <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle, width:"100%", opacity:loading?0.6:1, cursor:loading?"not-allowed":"pointer" }}>
        {loading ? "Creating account…" : "Create account"}
      </button>
      <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"#4a3e36" }}>
        Already have an account?{" "}
        <button onClick={onSwitch} style={{ background:"none", border:"none", color:"#d4956a", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>Sign in</button>
      </div>
    </div>
  );
}

function Login({ onSwitch}) {
  const [form, setForm] = useState({ email:"", password:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const set = f => e => setForm(p=>({...p,[f]:e.target.value}));
  const navigate = useNavigate();
   

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true); setApiError("");
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ email:form.email, password:form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Login failed");
      if (data.token) localStorage.setItem("snip_token", data.token);

      console.log("this is the users data" , form.email);
      if(form.email) localStorage.setItem("email",form.email);
      setSuccess(true);
      navigate("/dashboard")
       
      
    } catch(err) { setApiError(err.message); }
    finally { setLoading(false); }
  };

  if (success) return <SuccessState title="Welcome back!" subtitle="Token saved. Redirecting to your dashboard…" action={()=>setSuccess(false)} actionLabel="Back to login" />;

  return (
    <div style={{ animation:"fadeUp 0.3s ease" }} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}>
      <Field label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} placeholder="ada@example.com"/>
      <Field label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} placeholder="Your password"/>
      <div style={{ textAlign:"right", marginBottom:20, marginTop:-12 }}>
        <button style={{ background:"none", border:"none", color:"#4a3e36", cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif" }}
          onMouseEnter={e=>e.currentTarget.style.color="#d4956a"} onMouseLeave={e=>e.currentTarget.style.color="#4a3e36"}>
          Forgot password?
        </button>
      </div>
      {apiError && <div style={{ padding:"10px 14px", background:"rgba(192,57,43,0.1)", border:"1px solid rgba(192,57,43,0.25)", borderRadius:8, color:"#e07060", fontSize:13, marginBottom:16 }}>{apiError}</div>}
      <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle, width:"100%", opacity:loading?0.6:1, cursor:loading?"not-allowed":"pointer" }}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"#4a3e36" }}>
        Don't have an account?{" "}
        <button onClick={onSwitch} style={{ background:"none", border:"none", color:"#d4956a", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>Sign up</button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  
  return (
    <>
    <Navbar activePage="home"/>
    <div style={{ minHeight:"100vh", background:"#0e0c0a", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", padding:"2rem", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        input::placeholder { color:#2e2620 !important; }
      `}</style>
      <GridLines/>
      <div style={{ width:"100%", maxWidth:420, background:"#110e0c", border:"1px solid #2a201a", borderRadius:16, padding:"2.25rem 2.5rem", position:"relative", animation:"fadeUp 0.4s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1.75rem" }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"#d4956a", display:"flex", alignItems:"center", justifyContent:"center", color:"#1a0f0a" }}>
            <LinkIcon/>
          </div>
          <div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#f0e8e0", lineHeight:1 }}>snip.ly</div>
            <div style={{ fontSize:11, color:"#3d342c", fontFamily:"'DM Mono',monospace", marginTop:3 }}>url shortener</div>
          </div>
        </div>

        <div style={{ display:"flex", background:"#0e0c0a", borderRadius:8, padding:3, marginBottom:"1.75rem", border:"1px solid #1e1814" }}>
          {["login","signup"].map(tab=>(
            <button key={tab} onClick={()=>setMode(tab)} style={{
              flex:1, height:36, border:"none", borderRadius:6,
              background:mode===tab?"#1e1814":"transparent",
              color:mode===tab?"#d4956a":"#4a3e36",
              fontSize:13, fontWeight:600,
              fontFamily:"'DM Sans',sans-serif",
              cursor:"pointer", transition:"all 0.2s",
            }}>
              {tab==="login"?"Sign in":"Sign up"}
            </button>
          ))}
        </div>

        <div style={{ marginBottom:"1.5rem" }}>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:"#f0e8e0", fontWeight:400, margin:0, lineHeight:1.2 }}>
            {mode==="login" ? "Welcome back" : "Create account"}
          </h1>
          <p style={{ fontSize:13, color:"#4a3e36", margin:"6px 0 0" }}>
            {mode==="login" ? "Sign in to manage your short links." : "Start shortening URLs in seconds."}
          </p>
        </div>

        {mode==="login"
          ? <Login key="login" onSwitch={()=>setMode("signup")}/>
          : <Signup key="signup" onSwitch={()=>setMode("login")}/>
        }
      </div>
    </div>
    </>
  );
}