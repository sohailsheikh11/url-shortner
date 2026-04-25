import { useState } from "react";

import { useNavigate } from "react-router-dom";

/**
 * Navbar for snip.ly
 * Props:
 *   isLoggedIn  boolean
 *   user        { name, email }
 *   onLogout    fn
 *   activePage  "home" | "dashboard" | "pricing"
 *   onNavigate  fn(page)
 */

const LinkIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const DashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

function Avatar({ name }) {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  return (
    <div style={{ width:32, height:32, borderRadius:"50%", background:"#2a1f17", border:"1.5px solid #d4956a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:500, color:"#d4956a", flexShrink:0 }}>
      {initials}
    </div>
  );
}

function NavLink({ label, active, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:active?600:400, color:active?"#d4956a":hover?"#c0a898":"#6b5e54", padding:"4px 2px", position:"relative", transition:"color 0.15s" }}>
      {label}
      {active && <div style={{ position:"absolute", bottom:-2, left:0, right:0, height:1.5, background:"#d4956a", borderRadius:1 }}/>}
    </button>
  );
}

function DropMenuItem({ icon, label, danger, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px", background:hover?(danger?"rgba(192,57,43,0.08)":"#1a1410"):"none", border:"none", cursor:"pointer", color:hover?(danger?"#e07060":"#d4956a"):(danger?"#7a4a40":"#8a7a6e"), fontSize:13, fontFamily:"'DM Sans',sans-serif", textAlign:"left", transition:"all 0.12s" }}>
      {icon}{label}
    </button>
  );
}

export default function Navbar({
  isLoggedIn=false,
  user={name:"Ada Lovelace",email:"ada@example.com"},
  onLogout=()=>{},
  activePage="home",
  
}) {

   const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const navLinks = [{id:"home",label:"Home"},{id:"dashboard",label:"Dashboard"},{id:"pricing",label:"Pricing"}];

  function onNavigate(place){
    navigate("/"+place);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        .snip-hamburger{display:none!important}
        .snip-desktop-links{display:flex!important}
        @media(max-width:640px){.snip-hamburger{display:flex!important}.snip-desktop-links{display:none!important}.snip-auth-btns{display:none!important}}
      `}</style>

      <nav style={{ background:"#0e0c0a", borderBottom:"1px solid #1e1814", padding:"0 1.5rem", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", zIndex:100, fontFamily:"'DM Sans',sans-serif" }}>

        {/* Logo */}
        <button onClick={()=>onNavigate("home")} style={{ display:"flex", alignItems:"center", gap:9, background:"none", border:"none", cursor:"pointer", padding:0 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:"#d4956a", display:"flex", alignItems:"center", justifyContent:"center", color:"#1a0f0a" }}>
            <LinkIcon/>
          </div>
          <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:"#f0e8e0", lineHeight:1 }}>
            snip<span style={{ color:"#3d342c" }}>.ly</span>
          </span>
        </button>

        {/* Center nav links */}
        <div className="snip-desktop-links" style={{ alignItems:"center", gap:28, position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
          {navLinks.map(l=><NavLink key={l.id} label={l.label} active={activePage===l.id} onClick={()=>onNavigate(l.id)}/>)}
        </div>

        {/* Right */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {isLoggedIn ? (
            <div style={{ position:"relative" }}>
              <button onClick={()=>setDropOpen(d=>!d)}
                style={{ display:"flex", alignItems:"center", gap:8, background:dropOpen?"#1a1410":"none", border:"1px solid "+(dropOpen?"#2e2620":"transparent"), borderRadius:8, padding:"4px 10px 4px 6px", cursor:"pointer", transition:"all 0.15s" }}
                onMouseEnter={e=>{if(!dropOpen){e.currentTarget.style.background="#161210";e.currentTarget.style.borderColor="#2a201a";}}}
                onMouseLeave={e=>{if(!dropOpen){e.currentTarget.style.background="none";e.currentTarget.style.borderColor="transparent";}}}>
                <Avatar name={user.name}/>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:13, fontWeight:600, color:"#d4c4b8", lineHeight:1.2 }}>{user.name.split(" ")[0]}</div>
                </div>
                <div style={{ color:"#4a3e36", marginLeft:2, transform:dropOpen?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s" }}>
                  <ChevronDown/>
                </div>
              </button>

              {dropOpen && <div onClick={()=>setDropOpen(false)} style={{ position:"fixed", inset:0, zIndex:90 }}/>}

              {dropOpen && (
                <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", width:210, background:"#110e0c", border:"1px solid #2a201a", borderRadius:10, overflow:"hidden", zIndex:100, animation:"dropIn 0.18s ease", boxShadow:"0 8px 24px rgba(0,0,0,0.4)" }}>
                  <div style={{ padding:"12px 14px", borderBottom:"1px solid #1e1814" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#d4c4b8" }}>{user.name}</div>
                    <div style={{ fontSize:11, color:"#4a3e36", marginTop:2, fontFamily:"'DM Mono',monospace" }}>{user.email}</div>
                  </div>
                  <DropMenuItem icon={<DashIcon/>} label="Dashboard" onClick={()=>{onNavigate("dashboard");setDropOpen(false);}}/>
                  <DropMenuItem icon={<SettingsIcon/>} label="Settings" onClick={()=>{onNavigate("settings");setDropOpen(false);}}/>
                  <div style={{ borderTop:"1px solid #1e1814" }}>
                    <DropMenuItem icon={<LogoutIcon/>} label="Sign out" danger onClick={()=>{onLogout();setDropOpen(false);}}/>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="snip-auth-btns" style={{ display:"flex", gap:8 }}>
              <button onClick={()=>onNavigate("login")}
                style={{ height:36, padding:"0 16px", background:"none", border:"1px solid #2a201a", borderRadius:7, color:"#8a7a6e", fontSize:13, fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", transition:"all 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="#4a3e36";e.currentTarget.style.color="#c0a898";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#2a201a";e.currentTarget.style.color="#8a7a6e";}}>
                Sign in
              </button>
              <button onClick={()=>onNavigate("signup")}
                style={{ height:36, padding:"0 16px", background:"#d4956a", border:"none", borderRadius:7, color:"#1a0f0a", fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif", cursor:"pointer", transition:"opacity 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                Get started
              </button>
            </div>
          )}

          {/* Hamburger */}
          <button onClick={()=>setMenuOpen(m=>!m)} className="snip-hamburger"
            style={{ background:"none", border:"1px solid #2a201a", borderRadius:7, padding:7, color:"#6b5e54", cursor:"pointer", display:"none", alignItems:"center", justifyContent:"center" }}>
            {menuOpen ? <CloseIcon/> : <MenuIcon/>}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background:"#110e0c", borderBottom:"1px solid #1e1814", padding:"0.75rem 1.25rem", display:"flex", flexDirection:"column", gap:4, animation:"slideDown 0.2s ease" }}>
          {navLinks.map(l=>(
            <button key={l.id} onClick={()=>{navigate(l.id);setMenuOpen(false);}}
              style={{ background:activePage===l.id?"#1a1410":"none", border:"none", borderRadius:7, padding:"10px 12px", textAlign:"left", cursor:"pointer", color:activePage===l.id?"#d4956a":"#6b5e54", fontSize:14, fontWeight:activePage===l.id?600:400, fontFamily:"'DM Sans',sans-serif" }}>
              {l.label}
            </button>
          ))}
          {!isLoggedIn && (
            <div style={{ display:"flex", gap:8, marginTop:4, paddingTop:12, borderTop:"1px solid #1e1814" }}>
              <button onClick={()=>{onNavigate("login");setMenuOpen(false);}} style={{ flex:1, height:38, background:"none", border:"1px solid #2a201a", borderRadius:7, color:"#8a7a6e", fontSize:13, fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>Sign in</button>
              <button onClick={()=>{onNavigate("signup");setMenuOpen(false);}} style={{ flex:1, height:38, background:"#d4956a", border:"none", borderRadius:7, color:"#1a0f0a", fontSize:13, fontWeight:700, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>Get started</button>
            </div>
          )}
          {isLoggedIn && (
            <div style={{ display:"flex", gap:8, marginTop:4, paddingTop:12, borderTop:"1px solid #1e1814" }}>
              <button onClick={()=>{onLogout();setMenuOpen(false);}} style={{ flex:1, height:38, background:"rgba(192,57,43,0.08)", border:"1px solid rgba(192,57,43,0.2)", borderRadius:7, color:"#e07060", fontSize:13, fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:"pointer" }}>Sign out</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}