"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, BarChart3,
  Bell, BookOpen, Calculator, Camera, Check, ChevronDown, Clipboard,
  Copy, CreditCard, Download, Edit3, FileCheck2, FileImage, FilePenLine,
  FileText, Fingerprint, Globe2,  Headphones, Image as ImageIcon,
  KeyRound, Languages, LayoutDashboard, Loader2, Lock, LogIn, LogOut,
  Menu, MessageSquareText, Mic, Moon, MoreHorizontal, Palette, PanelLeft,
  Paperclip, PenLine, Printer, QrCode, RefreshCw, Save, Search, Send,
  Settings, ShieldCheck, Sparkles, Sun, Trash2, Upload, User, UserPlus,
  Wallet, Wand2, Wifi, X, Zap
} from "lucide-react";
import { THEMES, DEFAULT_THEME, getSafeTheme } from "../lib/themes";
import { DEFAULT_LANGUAGE, getLocale, t as translate } from "../lib/i18n";
import { AdSenseSlot } from "../components/AdSense";

const LocaleContext = createContext(DEFAULT_LANGUAGE);
const useLocale = () => useContext(LocaleContext);
const useT = () => { const lang = useLocale(); return (key) => translate(lang, key); };

const TOOL_GROUPS = [
  { id: "studio", label: "Digital Studio", icon: Camera, tools: [
    ["scaler","Teletalk Photo & Signature","300×300 / 300×80 portal formatter"],
    ["ink","Ink Saver","Whiten scanned backgrounds"],
    ["photo","Passport / Visa / NID","Precision crop templates"],
    ["convert","Image Converter","PNG · JPG · WebP · compression"]
  ]},
  { id: "documents", label: "Documents & Legal", icon: FileText, tools: [
    ["font","Bangla Typography","Unicode ↔ Bijoy workflow"],
    ["signature","Signature Pad","Transparent high-resolution PNG"],
    ["legal","Legal Deed Architect","Formal BD document templates"],
    ["ai","AI Document Studio","Letters, notices & applications"]
  ]},
  { id: "business", label: "Business & Finance", icon: Wallet, tools: [
    ["calculator","Calculator Pack","Age · VAT · EMI"],
    ["toolkit","Shop Toolkit","QR · password · text utilities"],
    ["profile","Operator Profile","Wallet & transaction center"]
  ]}
];

const LEGAL_TEMPLATES = {
  rent: {
    title:"House Rent Agreement", fields:["Owner","Tenant","Property","Monthly Rent","Advance","Term"],
    make:(v,lang)=>lang==="en"
      ? `HOUSE RENT AGREEMENT\n\nDate: ${new Date().toLocaleDateString("en-BD")}\n\nOwner: ${v.Owner||"________________"}\nTenant: ${v.Tenant||"________________"}\nProperty: ${v.Property||"________________"}\nMonthly Rent: ${v["Monthly Rent"]||"________________"} BDT\nAdvance / Deposit: ${v.Advance||"________________"} BDT\nTerm: ${v.Term||"________________"}\n\nBoth parties agree to the rental terms stated above. The tenant will use the property responsibly, maintain cleanliness and comply with applicable Bangladesh law. Rent must be paid within the agreed period.\n\nOwner Signature: ____________________\nTenant Signature: ____________________\nWitness 1: ____________________    Witness 2: ____________________`
      : `বাড়ি ভাড়া চুক্তিনামা\n\nএই চুক্তিনামা অদ্য ${new Date().toLocaleDateString("bn-BD")} তারিখে নিম্নলিখিত পক্ষদ্বয়ের মধ্যে সম্পাদিত হলো।\n\nপ্রথম পক্ষ (বাড়ির মালিক): ${v.Owner||"________________"}\nদ্বিতীয় পক্ষ (ভাড়াটিয়া): ${v.Tenant||"________________"}\nভাড়াকৃত সম্পত্তি: ${v.Property||"________________"}\nমাসিক ভাড়া: ${v["Monthly Rent"]||"________________"} টাকা\nঅগ্রিম/জামানত: ${v.Advance||"________________"} টাকা\nচুক্তির মেয়াদ: ${v.Term||"________________"}\n\nউভয় পক্ষ পারস্পরিক সম্মতিতে উক্ত সম্পত্তি নির্ধারিত শর্তে ভাড়া প্রদান ও গ্রহণে সম্মত হলেন। ভাড়াটিয়া সম্পত্তির যথাযথ ব্যবহার, পরিচ্ছন্নতা ও প্রচলিত আইন মেনে চলবেন। ভাড়া নির্ধারিত সময়ে পরিশোধ করতে হবে। কোনো বিরোধ দেখা দিলে প্রযোজ্য বাংলাদেশি আইন অনুসরণ করা হবে।\n\nপ্রথম পক্ষের স্বাক্ষর: ____________________\nদ্বিতীয় পক্ষের স্বাক্ষর: ____________________\nসাক্ষী ১: ____________________    সাক্ষী ২: ____________________`
  },
  land: {
    title:"Land Sale Deed", fields:["Seller","Buyer","Mouza","Khatian","Dag","Area","Price"],
    make:(v,lang)=>lang==="en"
      ? `LAND SALE DEED — DRAFT\n\nSeller: ${v.Seller||"________________"}\nBuyer: ${v.Buyer||"________________"}\nMouza: ${v.Mouza||"________________"}\nKhatian No.: ${v.Khatian||"________________"}\nDag No.: ${v.Dag||"________________"}\nLand Area: ${v.Area||"________________"}\nSale Price: ${v.Price||"________________"} BDT\n\nThe seller declares that they have lawful ownership of the property and that there is no known legal restriction preventing transfer. The buyer agrees to purchase the property for the stated consideration. This draft should be legally reviewed and properly registered before official use.\n\nSeller Signature: ____________________\nBuyer Signature: ____________________\nWitnesses: ____________________`
      : `জমি বিক্রয় দলিলের খসড়া\n\nবিক্রেতা: ${v.Seller||"________________"}\nক্রেতা: ${v.Buyer||"________________"}\nমৌজা: ${v.Mouza||"________________"}\nখতিয়ান নং: ${v.Khatian||"________________"}\nদাগ নং: ${v.Dag||"________________"}\nজমির পরিমাণ: ${v.Area||"________________"}\nবিক্রয় মূল্য: ${v.Price||"________________"} টাকা\n\nবিক্রেতা ঘোষণা করছেন যে, উক্ত সম্পত্তির বৈধ মালিকানা তার রয়েছে এবং আইনগতভাবে হস্তান্তরে কোনো বাধা নেই। ক্রেতা নির্ধারিত মূল্য প্রদান করে সম্পত্তি ক্রয়ের সম্মতি জ্ঞাপন করছেন। এই খসড়া যথাযথ রেজিস্ট্রেশন ও আইনগত যাচাই সাপেক্ষে ব্যবহারযোগ্য।\n\nবিক্রেতার স্বাক্ষর: ____________________\nক্রেতার স্বাক্ষর: ____________________\nসাক্ষীগণ: ____________________`
  },
  receipt: {
    title:"Money Receipt", fields:["Received From","Amount","Purpose","Date","Reference"],
    make:(v,lang)=>lang==="en"
      ? `MONEY RECEIPT\n\nReceived from: ${v["Received From"]||"________________"}\nAmount: ${v.Amount||"________________"} BDT\nPurpose: ${v.Purpose||"________________"}\nDate: ${v.Date||new Date().toLocaleDateString("en-BD")}\nReference: ${v.Reference||"________________"}\n\nReceiver Signature: ____________________\nName: ____________________`
      : `অর্থ গ্রহণ রসিদ\n\nপ্রাপ্তি স্বীকার করা যাচ্ছে যে ${v["Received From"]||"________________"} এর নিকট হতে ${v.Amount||"________________"} টাকা গ্রহণ করা হলো।\n\nউদ্দেশ্য: ${v.Purpose||"________________"}\nতারিখ: ${v.Date||new Date().toLocaleDateString("bn-BD")}\nরেফারেন্স: ${v.Reference||"________________"}\n\nগ্রহীতার স্বাক্ষর: ____________________\nনাম: ____________________`
  },
  character: {
    title:"Character Certificate", fields:["Name","Father/Mother","Address","Purpose"],
    make:(v,lang)=>lang==="en"
      ? `CHARACTER CERTIFICATE\n\nThis is to certify that ${v.Name||"________________"}, child of ${v["Father/Mother"]||"________________"}, residing at ${v.Address||"________________"}, is known to me and has satisfactory character and conduct to the best of my knowledge. This certificate is issued for ${v.Purpose||"________________"}.\n\nAuthorized Signature: ____________________\nDate: ${new Date().toLocaleDateString("en-BD")}`
      : `চারিত্রিক সনদপত্র\n\nএই মর্মে প্রত্যয়ন করা যাচ্ছে যে ${v.Name||"________________"}, পিতা/মাতা: ${v["Father/Mother"]||"________________"}, ঠিকানা: ${v.Address||"________________"}। আমার জানামতে তার চরিত্র ও আচরণ সন্তোষজনক। তিনি এই সনদটি ${v.Purpose||"________________"} উদ্দেশ্যে ব্যবহার করতে পারবেন।\n\nপ্রদানকারী কর্তৃপক্ষের স্বাক্ষর: ____________________\nতারিখ: ${new Date().toLocaleDateString("bn-BD")}`
  }
};

function money(n){ return new Intl.NumberFormat("en-BD",{style:"currency",currency:"BDT",maximumFractionDigits:0}).format(n||0); }
function downloadBlob(content,name,type="text/plain"){ const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([content],{type})); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),500); }
function dataUrlBytes(url){ return Math.ceil((url.split(",")[1]?.length||0)*0.75); }
function useLocal(key, initial){
  const [value,setValue]=useState(initial);
  const [hydrated,setHydrated]=useState(false);
  useEffect(()=>{
    try{
      const x=localStorage.getItem(key);
      if(x!==null)setValue(JSON.parse(x));
    }catch{}
    setHydrated(true);
  },[key]);
  useEffect(()=>{
    if(!hydrated)return;
    try{ localStorage.setItem(key,JSON.stringify(value)); }catch{}
  },[key,value,hydrated]);
  return [value,setValue];
}

function Toasts({items,onRemove}){
 const t=useT();
  return <div className="fixed right-4 top-20 z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-3">
    {items.map(t=><div key={t.id} className={`toast glass-card ${t.type==="error"?"toast-error":""}`}>
      <div className="rounded-xl bg-[var(--accent)]/10 p-2 text-[var(--accent)]">{t.type==="error"?<X size={18}/>:<Check size={18}/>}</div>
      <div className="min-w-0 flex-1"><b>{t.title}</b><p>{t.message}</p></div>
      <button onClick={()=>onRemove(t.id)} className="icon-btn"><X size={15}/></button>
    </div>)}
  </div>
}

function CursorFX({enabled}){
 const t=useT();
  const ref=useRef(null);
  useEffect(()=>{
    if(!enabled)return;
    const c=ref.current,ctx=c.getContext("2d"); let raf=0; let particles=[];
    const resize=()=>{c.width=innerWidth*devicePixelRatio;c.height=innerHeight*devicePixelRatio;c.style.width=innerWidth+"px";c.style.height=innerHeight+"px";ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)};
    resize(); addEventListener("resize",resize);
    const move=e=>{ for(let i=0;i<3;i++)particles.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,a:1,s:Math.random()*3+1}); if(particles.length>90)particles.splice(0,particles.length-90); };
    addEventListener("pointermove",move);
    const draw=()=>{ctx.clearRect(0,0,innerWidth,innerHeight); particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.a*=.94;ctx.globalAlpha=p.a;ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--accent");ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fill()});raf=requestAnimationFrame(draw)};
    draw(); return()=>{cancelAnimationFrame(raf);removeEventListener("resize",resize);removeEventListener("pointermove",move)};
  },[enabled]);
  return enabled?<canvas ref={ref} className="pointer-events-none fixed inset-0 z-[80] opacity-60"/>:null;
}

function Topbar({theme,setTheme,lang,setLang,cursor,setCursor,user,onAuth,onMenu}){
 const t=useT();
 const tx={dashboard:t("Dashboard"),overview:t("Overview"),tools:t("Tools"),language:t("Language"),theme:t("Theme"),choose:t("Choose a color theme"),workspace:t("Digital-center workspace"),allSystems:t("All systems operational"),wallet:t("Wallet"),credits:t("Credits"),mouse:t("Mouse FX"),signIn:t("Sign in")};
 const activeTheme=THEMES[getSafeTheme(theme)];
 return <header className="enterprise-topbar sticky top-0 z-50">
  <div className="mx-auto flex h-[56px] max-w-[1600px] items-center gap-3 px-4 lg:px-7">
   <button onClick={onMenu} className="icon-btn lg:hidden" aria-label={t("Open navigation")}><Menu/></button>

   <div className="enterprise-brand min-w-0">
    <div className="brand-mark enterprise-brand-mark"><Sparkles size={18}/></div>
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <b className="enterprise-brand-title">{t("SMART SOLUTION")}</b>
        <span className="enterprise-badge">{t("ENTERPRISE")}</span>
      </div>
      <span className="enterprise-brand-sub">{tx.workspace}</span>
    </div>
   </div>

   <div className="ml-auto flex items-center gap-2">
    <div className="enterprise-status hidden xl:flex">
      <span className="status-dot"/><span>{tx.allSystems}</span>
    </div>

    <div className="enterprise-wallet hidden md:flex">
      <div className="enterprise-mini-icon"><Wallet size={14}/></div>
      <div><span>{tx.wallet}</span><b>75 {tx.credits}</b></div>
    </div>

    <button className={`nav-toggle enterprise-cursor-toggle ${cursor?"active":""}`} onClick={()=>setCursor(!cursor)} title={t("Toggle mouse tracking")} >
      <Activity size={15}/><span className="hidden sm:inline">{tx.mouse}</span><i/>
    </button>

    <label className="enterprise-theme-control hidden sm:flex" title={tx.theme}>
      <Palette size={15}/>
      <select value={THEMES[theme]?theme:"ocean"} onChange={e=>setTheme(THEMES[e.target.value]?e.target.value:"ocean")} aria-label={tx.choose}>
       {Object.values(THEMES).map(themeOption=><option key={themeOption.key} value={themeOption.key}>{t(themeOption.name)}</option>)}
      </select>
    </label>
    <label className="enterprise-theme-control" title={tx.language}>
      <Languages size={15}/>
      <select value={lang} onChange={e=>setLang(e.target.value)} aria-label={tx.language}>
        <option value="bn">বাংলা</option><option value="en">{t("English")}</option>
      </select>
    </label>

    <button className="enterprise-icon-action" title={t("Notifications")}><Bell size={17}/><span/></button>

    {user
      ? <button onClick={onAuth} className="enterprise-avatar" title={t("Operator profile")} >{(user.name||"U").slice(0,1).toUpperCase()}</button>
      : <button onClick={onAuth} className="primary-btn enterprise-login"><LogIn size={16}/> <span>{tx.signIn}</span></button>}
   </div>
  </div>
  <div className="enterprise-topbar-line" style={{background:`linear-gradient(90deg, transparent, ${activeTheme.accent}, ${activeTheme.accent2}, transparent)`}}/>
 </header>
}

function Sidebar({active,setActive,open,onClose,collapsed,setCollapsed}){
 const t=useT();
 const tx={tools:t("Tools")};
 return <aside className={`app-sidebar ${open?"mobile-open":""} ${collapsed?"sidebar-collapsed":""}`}>
   <div className="sidebar-head"><b className={collapsed?"sr-only":""}>{tx.tools}</b><div className="flex gap-1"><button onClick={()=>setCollapsed(!collapsed)} className="icon-btn hidden lg:grid" title={t(collapsed?"Expand navigation":"Collapse navigation")}><PanelLeft size={17}/></button><button onClick={onClose} className="icon-btn lg:hidden" aria-label={t("Close navigation")}><X/></button></div></div>
   <nav className="sidebar-scroll" aria-label={tx.tools}>
    {TOOL_GROUPS.map(g=><div key={g.id} className="sidebar-group"><div className={`mb-2 px-2 text-[10px] font-extrabold uppercase tracking-[.18em] text-[var(--muted)] ${collapsed?"sr-only":""}`}>{t(g.label)}</div>
      <div className="space-y-1">{g.tools.map(([id,label,desc])=><button key={id} onClick={()=>{setActive(id);onClose()}} title={collapsed?t(label):undefined} className={`tool-nav ${collapsed?"justify-center":""} ${active===id?"active":""}`}><ToolIcon id={id}/><span className={`min-w-0 flex-1 text-left ${collapsed?"hidden":""}`}><b>{t(label)}</b><small>{t(desc)}</small></span>{active===id&&!collapsed&&<ChevronDown size={15}/>}</button>)}</div>
    </div>)}
   </nav>
 </aside>
}
function ToolIcon({id}){
 const t=useT(); const M={scaler:BadgeCheck,ink:Printer,photo:Camera,convert:ImageIcon,font:Languages,signature:PenLine,legal:FileText,ai:Wand2,calculator:Calculator,toolkit:QrCode,profile:User}; const I=M[id]||Zap; return <I size={18}/> }

function ShellCard({children,className=""}){
 const t=useT();return <section className={`glass-card ${className}`}>{children}</section>}
function SectionHeader({icon:Icon,title,subtitle,action}){
 const t=useT();return <div className="mb-5 flex items-start gap-3"><div className="section-icon"><Icon size={20}/></div><div className="min-w-0 flex-1"><h2 className="text-xl font-extrabold tracking-tight">{title}</h2><p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p></div>{action}</div>}
function FileInput({onFile,accept,label,multiple=false}){
 const t=useT();return <label className="dropzone"><Upload size={20}/><b>{label || t("Upload file")}</b><span>{t("Drag & drop or browse")}</span><input type="file" accept={accept} multiple={multiple} onChange={e=>onFile(multiple?[...e.target.files]:e.target.files[0])}/></label>}
function DownloadButton({onClick,children="Download"}){
 const t=useT();return <button onClick={onClick} className="secondary-btn"><Download size={16}/>{children}</button>}

function Scaler(){
 const t=useT();
 const [kind,setKind]=useState("photo"),[src,setSrc]=useState(""),[out,setOut]=useState(""),[busy,setBusy]=useState(false),[valid,setValid]=useState(false),[meta,setMeta]=useState(null);
 const spec=kind==="photo"?{w:300,h:300,max:100}:{w:300,h:80,max:60};
 const process=file=>{ if(!file)return; const im=new Image(); im.onload=()=>{const c=document.createElement("canvas");c.width=spec.w;c.height=spec.h;const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);const scale=Math.max(spec.w/im.width,spec.h/im.height),nw=im.width*scale,nh=im.height*scale;x.drawImage(im,(spec.w-nw)/2,(spec.h-nh)/2,nw,nh);let q=.92,url=c.toDataURL("image/jpeg",q);while(dataUrlBytes(url)>spec.max*1024&&q>.25){q-=.05;url=c.toDataURL("image/jpeg",q)}setSrc(URL.createObjectURL(file));setOut(url);setMeta({w:spec.w,h:spec.h,size:dataUrlBytes(url),q});setValid(spec.w===300&&spec.h===spec.h&&dataUrlBytes(url)<spec.max*1024)};im.src=URL.createObjectURL(file)};
 return <ShellCard><SectionHeader icon={BadgeCheck} title={t("Teletalk Portal Multi-Scaler")}  subtitle={t("Strict 300×300 photo and 300×80 signature validation.")} />
 <div className="segmented"><button className={kind==="photo"?"active":""} onClick={()=>{setKind("photo");setOut("")}}>{t("Photo · 100KB")}</button><button className={kind==="signature"?"active":""} onClick={()=>{setKind("signature");setOut("")}}>{t("Signature · 60KB")}</button></div>
 <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]"><div><FileInput accept="image/*" label={`Upload ${kind}`} onFile={process}/>{out&&<div className="mt-5 flex flex-wrap items-center gap-3"><span className="status-good"><Check size={14}/> Teletalk Validated</span><span className="chip">{meta.w}×{meta.h}</span><span className="chip">{(meta.size/1024).toFixed(1)} KB</span></div>}</div>
 <div className="preview-paper"><div className="checker"/>{out?<img src={out} className={kind==="signature"?"h-20 w-[300px] object-contain":"h-[300px] w-[300px] object-contain max-w-full"} alt="output"/>:<span className="text-xs text-[var(--muted)]">{t("Exact portal preview")}</span>}</div></div>
 {out&&<div className="mt-5 flex justify-end"><DownloadButton onClick={()=>{const a=document.createElement("a");a.href=out;a.download=`teletalk-${kind}.jpg`;a.click()}}>{t("Download Portal File")}</DownloadButton></div>}</ShellCard>
}

function InkSaver(){
 const t=useT();
 const [src,setSrc]=useState(""),[file,setFile]=useState(null),[out,setOut]=useState(""),[threshold,setThreshold]=useState(215),[busy,setBusy]=useState(false);
 const run=(file,thresholdValue=threshold)=>{if(!file)return;setFile(file);setBusy(true);const im=new Image();im.onload=()=>{const c=document.createElement("canvas");c.width=im.width;c.height=im.height;const x=c.getContext("2d");x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){const r=p[i],g=p[i+1],b=p[i+2],avg=(r+g+b)/3;const spread=Math.max(r,g,b)-Math.min(r,g,b);if(avg>=thresholdValue&&spread<45){p[i]=p[i+1]=p[i+2]=255}else if(avg>145&&spread<35){const v=Math.min(255,Math.round(avg+((255-avg)*.55)));p[i]=p[i+1]=p[i+2]=v}}x.putImageData(d,0,0);setOut(c.toDataURL("image/jpeg",.92));setBusy(false)};im.src=URL.createObjectURL(file);setSrc(URL.createObjectURL(file))};
 return <ShellCard><SectionHeader icon={Printer} title={t("Print-Shop Ink Saver")}  subtitle={t("Turn gray/off-white scan backgrounds into clean white while preserving dark text.")} />
 <div className="grid gap-5 lg:grid-cols-[1fr_320px]"><div><FileInput accept="image/*" onFile={f=>run(f)} label={t("Upload scanned document")}/>
 <div className="mt-6 rounded-2xl border border-[var(--border)] p-4"><div className="mb-2 flex justify-between text-sm"><b>{t("Background threshold")}</b><span>{threshold}</span></div><input type="range" min="160" max="250" value={threshold} onChange={e=>{const t=+e.target.value;setThreshold(t);if(file)run(file,t)}} className="w-full accent-[var(--accent)]"/><p className="mt-2 text-xs text-[var(--muted)]">{t("Higher values whiten more light-gray pixels. The preview updates locally as the threshold changes.")}</p></div>
 {busy&&<div className="mt-4 loading-line"><Loader2 className="animate-spin" size={16}/> Processing pixels locally…</div>}
 {out&&<div className="mt-5 flex justify-end"><DownloadButton onClick={()=>{const a=document.createElement("a");a.href=out;a.download="ink-saver-clean.jpg";a.click()}}>{t("Download Clean Scan")}</DownloadButton></div>}</div>
 <div className="grid grid-cols-2 gap-3">{[["Original",src],["Ink Saved",out]].map(([labelValue,srcValue])=><div key={labelValue} className="preview-paper !min-h-[280px]"><small className="absolute left-3 top-3 rounded-full bg-black/5 px-2 py-1">{t(labelValue)}</small>{srcValue?<img src={srcValue} className="max-h-[350px] max-w-full object-contain"/>:<span className="text-xs text-[var(--muted)]">{t("Preview")}</span>}</div>)}</div></div></ShellCard>
}

function PhotoCropper(){
 const t=useT();
 const [mode,setMode]=useState("passport"),[src,setSrc]=useState(""),[out,setOut]=useState("");
 const specs={passport:{label:"BD Passport",w:45,h:55,ratio:45/55},visa:{label:"Standard Visa",w:35,h:45,ratio:35/45},nid:{label:"NID Portrait",w:35,h:45,ratio:35/45}};
 const crop=file=>{const im=new Image();im.onload=()=>{const s=specs[mode],ratio=s.ratio;let sw=im.width,sh=im.height;if(sw/sh>ratio)sw=sh*ratio;else sh=sw/ratio;const sx=(im.width-sw)/2,sy=(im.height-sh)/2,c=document.createElement("canvas");c.width=900;c.height=Math.round(900/ratio);c.getContext("2d").drawImage(im,sx,sy,sw,sh,0,0,c.width,c.height);setSrc(URL.createObjectURL(file));setOut(c.toDataURL("image/jpeg",.94))};im.src=URL.createObjectURL(file)};
 return <ShellCard><SectionHeader icon={Camera} title={t("Passport · Visa · NID Photo Cropper")}  subtitle={t("Precision aspect-ratio grids for common Bangladeshi document photo workflows.")} />
 <div className="segmented">{Object.entries(specs).map(([k,v])=><button key={k} className={mode===k?"active":""} onClick={()=>{setMode(k);setOut("")}}>{v.label}</button>)}</div>
 <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_380px]"><FileInput accept="image/*" onFile={crop}/><div className="preview-paper"><div className="crop-guide"/>{out?<img src={out} className="max-h-[420px] max-w-full object-contain"/>:<span className="text-xs text-[var(--muted)]">{specs[mode].w}mm × {specs[mode].h}mm ratio grid</span>}</div></div>
 {out&&<div className="mt-5 flex justify-end"><DownloadButton onClick={()=>{const a=document.createElement("a");a.href=out;a.download=`${mode}-photo.jpg`;a.click()}}>{t("Download Cropped Photo")}</DownloadButton></div>}</ShellCard>
}

function Converter(){
 const t=useT();
 const [src,setSrc]=useState(""),[file,setFile]=useState(null),[out,setOut]=useState(""),[format,setFormat]=useState("image/jpeg"),[quality,setQuality]=useState(.82),[scale,setScale]=useState(100);
 const go=file=>{if(!file)return;setFile(file);const im=new Image();im.onload=()=>{const c=document.createElement("canvas"),r=scale/100;c.width=Math.max(1,im.width*r);c.height=Math.max(1,im.height*r);c.getContext("2d").drawImage(im,0,0,c.width,c.height);setSrc(URL.createObjectURL(file));setOut(c.toDataURL(format,quality))};im.src=URL.createObjectURL(file)};
 return <ShellCard><SectionHeader icon={ImageIcon} title={t("Image Format Converter & Compressor")}  subtitle={t("Convert PNG, JPG and WebP with browser-native canvas encoding.")} />
 <div className="grid gap-5 lg:grid-cols-[1fr_340px]"><div><FileInput accept="image/*" onFile={go}/><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="field"><span>{t("Output format")}</span><select value={format} onChange={e=>setFormat(e.target.value)}><option value="image/jpeg">{t("JPG")}</option><option value="image/png">{t("PNG")}</option><option value="image/webp">{t("WebP")}</option></select></label><label className="field"><span>{t("Quality")} {Math.round(quality*100)}%</span><input type="range" min=".1" max="1" step=".01" value={quality} onChange={e=>setQuality(+e.target.value)}/></label><label className="field sm:col-span-2"><span>{t("Scale")} {scale}%</span><input type="range" min="10" max="100" value={scale} onChange={e=>setScale(+e.target.value)}/></label></div><button onClick={()=>file&&go(file)} className="mt-4 secondary-btn">{t("Adjust output")}</button></div>
 <div className="preview-paper">{out?<img src={out} className="max-h-[400px] max-w-full object-contain"/>:<span className="text-xs text-[var(--muted)]">{t("Converted preview")}</span>}</div></div>
 {out&&<div className="mt-5 flex justify-end"><DownloadButton onClick={()=>{const ext=format.split("/")[1];const a=document.createElement("a");a.href=out;a.download=`converted.${ext}`;a.click()}}>Download {format.split("/")[1].toUpperCase()}</DownloadButton></div>}</ShellCard>
}

const UNICODE_BIJOY = {"অ":"A","আ":"Av","ই":"B","ঈ":"C","উ":"D","ঊ":"E","এ":"G","ঐ":"H","ও":"I","ঔ":"J","ক":"K","খ":"L","গ":"M","ঘ":"N","ঙ":"O","চ":"P","ছ":"Q","জ":"R","ঝ":"S","ঞ":"T","ট":"U","ঠ":"V","ড":"W","ঢ":"X","ণ":"Y","ত":"Z","থ":"_","দ":"`","ধ":"a","ন":"b","প":"c","ফ":"d","ব":"e","ভ":"f","ম":"g","য":"h","র":"i","ল":"j","শ":"k","ষ":"l","স":"m","হ":"n","ড়":"o","ঢ়":"p","য়":"q","ৎ":"r","ং":"s","ঃ":"t","ঁ":"u","া":"v","ি":"w","ী":"x","ু":"y","ূ":"z","ে":"‡","ৈ":"ˆ","ো":"‰","ৌ":"Š","্":"&","০":"0","১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9"};
function FontConverter(){
 const t=useT();
 const [mode,setMode]=useState("u2b"),[text,setText]=useState("");
 const BIJOY_UNICODE=useMemo(()=>Object.fromEntries(Object.entries(UNICODE_BIJOY).map(([u,b])=>[b,u])),[]); const converted=useMemo(()=>mode==="u2b"?[...text].map(c=>UNICODE_BIJOY[c]??c).join(""):[...text].map(c=>BIJOY_UNICODE[c]??c).join(""),[mode,text,BIJOY_UNICODE]);
 return <ShellCard><SectionHeader icon={Languages} title={t("Bangla Font Typographic Converter")}  subtitle={t("Local Unicode ↔ Bijoy ANSI workflow for shop operators and graphics applications.")} />
 <div className="segmented"><button className={mode==="u2b"?"active":""} onClick={()=>setMode("u2b")}>{t("Unicode → Bijoy")}</button><button className={mode==="b2u"?"active":""} onClick={()=>setMode("b2u")}>Bijoy → Unicode</button></div>
 <div className="mt-5 grid gap-4 lg:grid-cols-2"><textarea value={text} onChange={e=>setText(e.target.value)} className="textarea min-h-[260px]" placeholder={mode==="u2b"?"বাংলা Unicode text লিখুন…":"Bijoy ANSI text paste করুন…"}/><div className="relative"><textarea value={converted} readOnly className="textarea min-h-[260px]" placeholder={t("Converted output…")}/><button className="absolute right-3 top-3 icon-btn" onClick={()=>navigator.clipboard?.writeText(converted)}><Copy size={16}/></button></div></div>
 <div className="mt-4 flex justify-end"><DownloadButton onClick={()=>downloadBlob(converted,"bangla-converted.txt")}>{t("Download Text")}</DownloadButton></div></ShellCard>
}

function SignaturePad(){
 const t=useT();
 const ref=useRef(null),[drawing,setDrawing]=useState(false),[history,setHistory]=useState([]);
 useEffect(()=>{const c=ref.current,x=c.getContext("2d");x.lineWidth=3;x.lineCap="round";x.strokeStyle="#111827";x.fillStyle="white";x.fillRect(0,0,c.width,c.height)},[]);
 const pos=e=>{const r=ref.current.getBoundingClientRect();return{x:(e.clientX-r.left)*ref.current.width/r.width,y:(e.clientY-r.top)*ref.current.height/r.height}};
 const down=e=>{setDrawing(true);setHistory(h=>[...h,ref.current.toDataURL()]);const p=pos(e);const x=ref.current.getContext("2d");x.beginPath();x.moveTo(p.x,p.y)};
 const move=e=>{if(!drawing)return;const p=pos(e),x=ref.current.getContext("2d");x.lineTo(p.x,p.y);x.stroke()};
 const clear=()=>{const c=ref.current,x=c.getContext("2d");x.clearRect(0,0,c.width,c.height);x.fillStyle="white";x.fillRect(0,0,c.width,c.height)};
 const undo=()=>{const last=history[history.length-1];if(!last)return;const im=new Image();im.onload=()=>ref.current.getContext("2d").drawImage(im,0,0);im.src=last;setHistory(h=>h.slice(0,-1))};
 return <ShellCard><SectionHeader icon={PenLine} title={t("Digital Signature Pad")}  subtitle={t("High-resolution canvas signature with clear, undo and transparent-ready export.")} />
 <div className="signature-board"><canvas ref={ref} width={1400} height={500} onPointerDown={down} onPointerMove={move} onPointerUp={()=>setDrawing(false)} onPointerLeave={()=>setDrawing(false)}/><span>{t("Sign here")}</span></div>
 <div className="mt-4 flex justify-end gap-2"><button onClick={undo} className="secondary-btn"><ArrowLeft size={16}/> Undo</button><button onClick={clear} className="secondary-btn"><Trash2 size={16}/> Clear</button><DownloadButton onClick={()=>{const a=document.createElement("a");a.href=ref.current.toDataURL("image/png");a.download="signature.png";a.click()}}>{t("Download PNG")}</DownloadButton></div></ShellCard>
}

function Legal(){
 const t=useT(); const lang=useLocale();
 const [type,setType]=useState("rent"),[vals,setVals]=useState({}),[doc,setDoc]=useState("");
 const tpl=LEGAL_TEMPLATES[type];
 const generate=()=>setDoc(tpl.make(vals,lang));
 return <ShellCard><SectionHeader icon={FileText} title={t("Bangladeshi Legal Deed & Affidavit Architect")}  subtitle={t("Formal client-side templates with print-safe 300 TK stamp-paper margins.")} />
 <div className="grid gap-5 lg:grid-cols-[360px_1fr]"><div><label className="field"><span>{t("Document type")}</span><select value={type} onChange={e=>{setType(e.target.value);setDoc("")}}><option value="rent">{t("House Rent Agreement")}</option><option value="land">{t("Land Sale Deed")}</option><option value="receipt">{t("Money Receipt")}</option><option value="character">{t("Character Certificate")}</option></select></label><div className="mt-4 space-y-3">{tpl.fields.map(f=><label className="field" key={f}><span>{t(f)}</span><input value={vals[f]||""} onChange={e=>setVals({...vals,[f]:e.target.value})}/></label>)}</div><button onClick={generate} className="primary-btn mt-4 w-full"><FilePenLine size={16}/> Generate Legal Draft</button></div>
 <div className="legal-paper">{doc?<pre>{doc}</pre>:<div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">{t("Your formal document will appear here.")}</div>}</div></div>
 {doc&&<div className="mt-4 flex justify-end gap-2"><DownloadButton onClick={()=>downloadBlob(doc,`${tpl.title}.txt`)}>{t("Download")}</DownloadButton><button onClick={()=>window.print()} className="secondary-btn"><Printer size={16}/> Print / PDF</button></div>}</ShellCard>
}

function CalculatorPack(){
 const t=useT();
 const [tab,setTab]=useState("age"),[dob,setDob]=useState("2000-01-01"),[vat,setVat]=useState(5),[amount,setAmount]=useState(10000),[principal,setPrincipal]=useState(100000),[rate,setRate]=useState(12),[months,setMonths]=useState(24);
 const age=useMemo(()=>{const d=new Date(dob),n=new Date();let y=n.getFullYear()-d.getFullYear(),m=n.getMonth()-d.getMonth(),day=n.getDate()-d.getDate();if(day<0){m--;day+=new Date(n.getFullYear(),n.getMonth(),0).getDate()}if(m<0){y--;m+=12}const next=new Date(n.getFullYear(),d.getMonth(),d.getDate());if(next<n)next.setFullYear(next.getFullYear()+1);return {y,m,day,next:Math.ceil((next-n)/86400000)}},[dob]);
 const tax=amount*vat/100;
 const r=rate/12/100, emi=r?principal*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1):principal/months,total=emi*months;
 return <ShellCard><SectionHeader icon={Calculator} title={t("Advanced Calculator Pack")}  subtitle={t("Age breakdown, Bangladesh-style VAT estimator and EMI repayment math.")} />
 <div className="segmented"><button className={tab==="age"?"active":""} onClick={()=>setTab("age")}>{t("Age")}</button><button className={tab==="vat"?"active":""} onClick={()=>setTab("vat")}>{t("VAT / Tax")}</button><button className={tab==="emi"?"active":""} onClick={()=>setTab("emi")}>{t("EMI")}</button></div>
 {tab==="age"&&<div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="field"><span>{t("Date of birth")}</span><input type="date" value={dob} onChange={e=>setDob(e.target.value)}/></label><div className="metric-card"><span>{t("Exact age")}</span><b>{age.y}y {age.m}m {age.day}d</b><small>{t("Next birthday in")} {age.next} {t("days")}</small></div></div>}
 {tab==="vat"&&<div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="field"><span>{t("Base amount")}</span><input type="number" value={amount} onChange={e=>setAmount(+e.target.value)}/></label><label className="field"><span>{t("Rate")}</span><select value={vat} onChange={e=>setVat(+e.target.value)}>{[5,7.5,10,15].map(x=><option key={x}>{x}%</option>)}</select></label><div className="metric-card sm:col-span-2"><span>{t("VAT / Tax")}</span><b>{money(tax)}</b><small>{t("Gross total")}: {money(amount+tax)}</small></div></div>}
 {tab==="emi"&&<div className="mt-5 grid gap-4 sm:grid-cols-3"><label className="field"><span>{t("Principal")}</span><input type="number" value={principal} onChange={e=>setPrincipal(+e.target.value)}/></label><label className="field"><span>{t("Annual rate")} {rate}%</span><input type="range" min="0" max="30" value={rate} onChange={e=>setRate(+e.target.value)}/></label><label className="field"><span>{t("Months")} {months}</span><input type="range" min="3" max="84" value={months} onChange={e=>setMonths(+e.target.value)}/></label><div className="metric-card sm:col-span-3"><span>{t("Monthly EMI")}</span><b>{money(emi)}</b><small>{t("Total repayment")} {money(total)} · {t("Interest")} {money(total-principal)}</small></div></div>}
 </ShellCard>
}

function Toolkit(){
 const t=useT();
 const [tab,setTab]=useState("qr"),[qrType,setQrType]=useState("url"),[text,setText]=useState("https://smartsolution.bd"),[qr,setQr]=useState(""),[pass,setPass]=useState(""),[length,setLength]=useState(16),[caseText,setCaseText]=useState(""),[pdfText,setPdfText]=useState("");
 const makeQR=async()=>{try{const QR=await import("qrcode");const payload=qrType==="wifi"?`WIFI:T:WPA;S:${text};P:${pass};;`:text;setQr(await QR.toDataURL(payload,{width:360,margin:2,errorCorrectionLevel:"M"}));}catch(e){setQr("")}};
 const genPass=()=>{const chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";let p="";for(let i=0;i<length;i++)p+=chars[Math.floor(Math.random()*chars.length)];setPass(p)};
 const stats=useMemo(()=>({words:caseText.trim()?caseText.trim().split(/\s+/).length:0,chars:caseText.length,upper:caseText.toUpperCase(),lower:caseText.toLowerCase()}),[caseText]);
 return <ShellCard><SectionHeader icon={QrCode} title={t("Essential Shop Toolkit")}  subtitle={t("Fast QR generation, secure password creation, text analytics and PDF-ready document printing.")} />
 <div className="segmented"><button className={tab==="qr"?"active":""} onClick={()=>setTab("qr")}>{t("QR Engine")}</button><button className={tab==="pass"?"active":""} onClick={()=>setTab("pass")}>{t("Password")}</button><button className={tab==="text"?"active":""} onClick={()=>setTab("text")}>{t("Text Counter")}</button><button className={tab==="pdf"?"active":""} onClick={()=>setTab("pdf")}>{t("Text → PDF")}</button></div>
 {tab==="qr"&&<div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]"><div><label className="field"><span>{t("Payload type")}</span><select value={qrType} onChange={e=>setQrType(e.target.value)}><option value="url">{t("URL")}</option><option value="text">{t("Text")}</option><option value="wifi">{t("WiFi")}</option></select></label><label className="field mt-3"><span>{qrType==="wifi"?"Network name / SSID":"Text / URL"}</span><textarea className="textarea" value={text} onChange={e=>setText(e.target.value)}/></label>{qrType==="wifi"&&<label className="field mt-3"><span>{t("WiFi password")}</span><input type="password" value={pass} onChange={e=>setPass(e.target.value)}/></label>}<button onClick={makeQR} className="primary-btn mt-4"><QrCode size={16}/> Generate QR</button></div><div className="qr-paper">{qr?<><img src={qr} className="h-[250px] w-[250px]" alt="QR code"/><div className="mt-3 flex gap-2"><button className="secondary-btn" onClick={()=>{const a=document.createElement("a");a.href=qr;a.download="smart-solution-qr.png";a.click()}}><Download size={15}/> Download PNG</button><button className="secondary-btn" onClick={()=>window.print()}><Printer size={15}/> Print</button></div></>:<span className="text-xs text-[var(--muted)]">{t("QR preview")}</span>}</div></div>}
 {tab==="pass"&&<div className="mt-5 grid gap-4 sm:grid-cols-[1fr_160px]"><label className="field"><span>{t("Length")} {length}</span><input type="range" min="8" max="48" value={length} onChange={e=>setLength(+e.target.value)}/></label><button onClick={genPass} className="primary-btn"><KeyRound size={16}/> Generate</button>{pass&&<div className="metric-card sm:col-span-2"><b className="break-all">{pass}</b><button onClick={()=>navigator.clipboard?.writeText(pass)} className="secondary-btn mt-3"><Copy size={15}/> {t("Copy")}</button></div>}</div>}
 {tab==="text"&&<div className="mt-5"><textarea className="textarea min-h-[280px]" value={caseText} onChange={e=>setCaseText(e.target.value)} placeholder={t("Paste or type text…")}/><div className="mt-3 grid gap-3 sm:grid-cols-4"><div className="metric-card"><span>{t("Words")}</span><b>{stats.words}</b></div><div className="metric-card"><span>{t("Characters")}</span><b>{stats.chars}</b></div><button onClick={()=>setCaseText(stats.upper)} className="secondary-btn">{t("UPPER CASE")}</button><button onClick={()=>setCaseText(stats.lower)} className="secondary-btn">{t("lower case")}</button></div></div>}
 {tab==="pdf"&&<div className="mt-5"><textarea className="textarea min-h-[300px]" value={pdfText} onChange={e=>setPdfText(e.target.value)} placeholder={t("Type the document you want to print/export as PDF…")}/><div className="mt-4 flex justify-end"><button onClick={()=>{const w=window.open("","_blank","width=900,height=700");if(!w)return;w.document.write(`<html><head><title>Smart Solution Document</title><style>body{font-family:Arial,sans-serif;padding:45px;line-height:1.8;white-space:pre-wrap}@page{size:A4;margin:18mm}</style></head><body>${pdfText.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</body></html>`);w.document.close();w.focus();setTimeout(()=>w.print(),250)}} className="primary-btn"><Printer size={16}/> Print / Save as PDF</button></div></div>}
 </ShellCard>
}

function AIStudio({toast}){
 const t=useT(); const lang=useLocale();
 const [key,setKey]=useState(""),[demo,setDemo]=useState(true),[type,setType]=useState("Job Cover Letter"),[tone,setTone]=useState("Formal"),[keywords,setKeywords]=useState("Software Engineer, Flutter, Bangladesh"),[out,setOut]=useState(""),[busy,setBusy]=useState(false);
 useEffect(()=>{setKey(sessionStorage.getItem("smart-ai-key")||"")},[]);
 const generate=async()=>{setBusy(true);setOut("");const text=lang==="bn"?`${t(type)}

বিষয়: ${t(type)}

জনাব/জনাবা,

${keywords} বিষয়ে একটি ${t(tone).toLowerCase()} খসড়া প্রস্তুত করা হলো। এই Smart Solution খসড়াটি বাংলাদেশ-কেন্দ্রিক অপারেটর ও ব্যবসায়িক ব্যবহারের জন্য সাজানো হয়েছে। অফিসিয়াল ব্যবহারের আগে নাম, তারিখ, ঠিকানা, আইনগত তথ্য ও প্রয়োজনীয় সংযুক্তি যাচাই করুন।

মূল বিষয়সমূহ:
• ${keywords}
• পরিষ্কার উদ্দেশ্য ও প্রাসঙ্গিক তথ্য
• প্রফেশনাল ব্যবসায়িক যোগাযোগের ধরন

${t("Sincerely")},
[নাম]
[মোবাইল]
[তারিখ]`:`${t(type)}

Subject: ${t(type)}

Dear Sir/Madam,

I am writing this document in a ${t(tone).toLowerCase()} tone regarding ${keywords}. This client-side Smart Solution draft is structured for a Bangladesh-focused operator workflow. Please review names, dates, legal facts, addresses and supporting documents before official submission.

Key points:
• ${keywords}
• Clear purpose and supporting context
• Professional Bangladeshi business communication style

${t("Sincerely")},
[Name]
[Mobile]
[Date]`;for(let i=0;i<text.length;i++){await new Promise(r=>setTimeout(r,9));setOut(text.slice(0,i+1))}setBusy(false)};
 const saveKey=v=>{setKey(v);sessionStorage.setItem("smart-ai-key",v)};
 return <ShellCard><SectionHeader icon={Wand2} title={t("AI Smart Document Studio")}  subtitle={t("Secure client interface with Demo Mode and optional session-only API key storage.")} />
 <div className="grid gap-5 xl:grid-cols-[360px_1fr]"><div className="space-y-3"><div className="rounded-2xl border border-[var(--border)] p-4"><div className="flex items-center justify-between"><b>{t("Demo Mode")}</b><button onClick={()=>setDemo(!demo)} className={`switch ${demo?"on":""}`}><i/></button></div><p className="mt-2 text-xs text-[var(--muted)]">{t("Runs the local template engine without sending data anywhere.")}</p></div><label className="field"><span>{t("Document")}</span><select value={type} onChange={e=>setType(e.target.value)}>{["Job Cover Letter","Formal Notice","Leave Application","Bangla-to-English Business Email"].map(x=><option key={x}>{t(x)}</option>)}</select></label><label className="field"><span>{t("Tone")}</span><select value={tone} onChange={e=>setTone(e.target.value)}>{["Formal","Creative","Urgent"].map(x=><option key={x}>{t(x)}</option>)}</select></label><label className="field"><span>{t("Keywords")}</span><textarea value={keywords} onChange={e=>setKeywords(e.target.value)} className="textarea"/></label>{!demo&&<label className="field"><span>{t("OpenAI API Key · session only")}</span><input type="password" value={key} onChange={e=>saveKey(e.target.value)} placeholder="sk-…"/></label>}<button disabled={busy} onClick={generate} className="primary-btn w-full">{busy?<Loader2 className="animate-spin"/>:<Sparkles size={16}/>} Generate with AI</button></div>
 <div className="terminal"><div className="terminal-head"><span/><span/><span/><b>smart-ai://stream</b></div><pre>{busy&&!out?<span className="shimmer-text">{t("AI is reading local document parameters…")}</span>:out||t("Generated output will stream here…")}</pre>{out&&<div className="terminal-actions"><button onClick={()=>navigator.clipboard?.writeText(out)}><Copy size={14}/> {t("Copy")}</button><button onClick={()=>downloadBlob(out,"smart-ai-draft.txt")}><Download size={14}/> .txt</button><button onClick={()=>downloadBlob(`<html><body><pre>${out}</pre></body></html>`,"smart-ai-draft.doc")}><Download size={14}/> {t("Word")}</button></div>}</div></div></ShellCard>
}

function Profile({user,setUser,onLogout,onSignIn}){
 const t=useT();
 const [tab,setTab]=useState("profile"),[password,setPassword]=useState(""),[credits,setCredits]=useLocal("smart-credits",75),[tx,setTx]=useLocal("smart-transactions",[["28 Sep 2026","bKash","+50","Completed"],["18 Sep 2026","Nagad","+25","Completed"]]);
 if(!user)return <ShellCard><SectionHeader icon={User} title={t("Operator Profile & Wallet")}  subtitle={t("Sign in to access your local operator profile, wallet and security controls.")} /><div className="py-12 text-center"><div className="brand-mark mx-auto"><Lock size={19}/></div><h3 className="mt-4 text-xl font-black">{t("Authentication required")}</h3><p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">{t("Your profile is stored locally in this browser and is available after sign-in or registration.")}</p><button onClick={onSignIn} className="primary-btn mt-5"><LogIn size={16}/>{t("Sign in")}</button></div></ShellCard>;
 const topup=(method,amount)=>{setCredits(c=>c+amount);setTx(t=>[[new Date().toLocaleDateString("en-BD"),method,`+${amount}`,"Completed"],...t]);};

 const update=e=>setUser({...user,[e.target.name]:e.target.value});
 return <ShellCard><SectionHeader icon={User} title={t("Operator Profile & Wallet")}  subtitle={t("LocalStorage-backed account, wallet and security center.")} />
 <div className="grid gap-5 lg:grid-cols-[300px_1fr]"><div className="rounded-3xl border border-[var(--border)] p-5 text-center"><div className="mx-auto avatar large">{(user.name||"U").slice(0,1).toUpperCase()}</div><h3 className="mt-3 text-xl font-black">{user.name}</h3><p className="text-sm text-[var(--muted)]">{user.email}</p><div className="mt-5 rounded-2xl bg-[var(--accent)]/10 p-4"><Wallet className="mx-auto text-[var(--accent)]"/><b className="mt-2 block text-2xl">{credits} Credits</b><small className="text-[var(--muted)]">{t("Available balance")}</small></div><button onClick={onLogout} className="secondary-btn mt-4 w-full"><LogOut size={15}/> Sign out</button></div>
 <div><div className="segmented"><button className={tab==="profile"?"active":""} onClick={()=>setTab("profile")}>{t("Profile")}</button><button className={tab==="wallet"?"active":""} onClick={()=>setTab("wallet")}>{t("Transactions")}</button><button className={tab==="security"?"active":""} onClick={()=>setTab("security")}>{t("Security")}</button></div>
 {tab==="profile"&&<div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="field"><span>{t("Full name")}</span><input name="name" value={user.name||""} onChange={update}/></label><label className="field"><span>{t("Email")}</span><input name="email" value={user.email||""} onChange={update}/></label><label className="field"><span>{t("Mobile")}</span><input name="mobile" value={user.mobile||""} onChange={update}/></label><div className="metric-card"><span>{t("Member since")}</span><b>{new Date(user.created||Date.now()).toLocaleDateString("en-BD")}</b></div></div>}
 {tab==="wallet"&&<div className="mt-5"><div className="flex flex-wrap gap-2 mb-4"><button onClick={()=>topup("bKash",50)} className="secondary-btn">+50 bKash</button><button onClick={()=>topup("Nagad",100)} className="secondary-btn">+100 Nagad</button></div><div className="overflow-hidden rounded-2xl border border-[var(--border)]"><table className="w-full text-sm"><thead><tr><th>{t("Date")}</th><th>{t("Method")}</th><th>Credits</th><th>{t("Status")}</th></tr></thead><tbody>{tx.map((r,i)=><tr key={`${r[0]}-${i}`}>{r.map((x,j)=><td key={j}>{x}</td>)}</tr>)}</tbody></table></div></div>}
 {tab==="security"&&<div className="mt-5 max-w-md space-y-4"><label className="field"><span>{t("New password")}</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button onClick={()=>setPassword("")} className="primary-btn"><ShieldCheck size={16}/> Update Password</button></div>}
 </div></div></ShellCard>
}

function Dashboard({setActive,user,lang}){
 const t=useT();
 const tx={dashboard:t("Dashboard"),overview:t("Overview"),workspace:t("Digital-center workspace"),subtitle:t("Photos, documents, finance, QR and business tasks in one place."),start:t("Start a job"),ai:t("Open AI Studio"),local:t("Local-first"),instant:t("Instant processing"),bd:t("Bangladesh ready"),popular:t("Popular operator tools"),core:t("core tools"),open:t("Open workspace"),features:t("What you can do"),qr:t("QR Code"),utilities:t("Core utilities"),wallet:t("Wallet"),session:t("Session"),credits:t("Credits"),dataSafe:t("Your data stays in your browser")};
 const cards=[
  ["scaler",t("Teletalk Multi-Scaler"),BadgeCheck,t("300×300 photo · 300×80 signature")],
  ["ink",t("Ink Saver Engine"),Printer,t("Clean scanned backgrounds before printing")],
  ["legal",t("Legal Architect"),FileText,t("Stamp-paper-ready document drafting")],
  ["ai",t("AI Studio"),Wand2,t("Letters, notices & business writing")],
  ["toolkit",t("Shop Toolkit"),QrCode,t("QR, passwords, text & operator utilities")]
 ];
 return <div className="space-y-6">
  <section className="enterprise-hero glass-card">
   <div className="enterprise-hero-grid">
    <div className="relative z-10">
      <div className="eyebrow"><span className="eyebrow-pulse"/><Zap size={13}/> {tx.workspace}</div>
      <h1>{t("Every digital-center task.")}<br/><em>{t("One intelligent workspace.")}</em></h1>
      <p>{tx.subtitle}</p>
      <div className="mt-6 flex flex-wrap gap-2">
       <button onClick={()=>setActive("scaler")} className="primary-btn enterprise-cta"><Camera size={16}/> {tx.start} <ArrowRight size={15}/></button>
       <button onClick={()=>setActive("ai")} className="secondary-btn"><Wand2 size={16}/> {tx.ai}</button>
      </div>
      <div className="enterprise-hero-meta">
       <span><ShieldCheck size={14}/> {tx.local}</span><span><Zap size={14}/> {tx.instant}</span><span><Globe2 size={14}/> {tx.bd}</span>
      </div>
    </div>
    <div className="enterprise-visual" aria-hidden="true">
      <div className="enterprise-orbit orbit-one"/><div className="enterprise-orbit orbit-two"/>
      <div className="enterprise-core"><Sparkles size={30}/><span>SMART<br/>OPS</span></div>
      <div className="floating-plate plate-a"><FileCheck2 size={16}/><span>{t("Portal Ready")}</span><BadgeCheck size={14}/></div>
      <div className="floating-plate plate-b"><Printer size={16}/><span>{t("Print Optimized")}</span></div>
      <div className="floating-plate plate-c"><Wallet size={16}/><span>75 {tx.credits}</span></div>
    </div>
   </div>
  </section>

  <section>
   <div className="section-heading"><div><span className="section-kicker">{t("Dashboard")}</span><h2>{t("Popular operator tools")}</h2></div><span className="section-count">{cards.length} {tx.core}</span></div>
   <div className="enterprise-tool-grid">
    {cards.map(([id,title,I,desc],i)=><button key={id} onClick={()=>setActive(id)} className="enterprise-tool-card text-left" style={{"--delay":`${i*55}ms`}}>
      <div className="tool-card-top"><div className="feature-icon"><I/></div><span className="tool-arrow"><ArrowUpRight size={16}/></span></div>
      <b>{title}</b><p>{desc}</p><span className="tool-open">{tx.open} <ArrowRight size={14}/></span>
    </button>)}
   </div>
  </section>

  <section>
   <div className="section-heading"><div><span className="section-kicker">{t("What you can do")}</span><h2>{t("See what you can do")}</h2></div></div>
   <div className="feature-preview-grid">
    <div className="feature-preview-card"><div className="preview-art photo-preview"><Camera size={28}/><div><b>{t("Prepare photos")}</b><small>{t("Passport, NID, visa & signature")}</small></div></div><button onClick={()=>setActive("photo")} className="secondary-btn">{tx.open}</button></div>
    <div className="feature-preview-card"><div className="preview-art doc-preview"><FileText size={28}/><div><b>{t("Create documents")}</b><small>{t("Letters, applications, receipts & drafts")}</small></div></div><button onClick={()=>setActive("legal")} className="secondary-btn">{tx.open}</button></div>
    <div className="feature-preview-card"><div className="preview-art qr-preview"><QrCode size={28}/><div><b>{t("Generate QR codes")}</b><small>{t("URL, text & Wi‑Fi QR")}</small></div></div><button onClick={()=>setActive("toolkit")} className="secondary-btn">{tx.qr}</button></div>
   </div>
  </section>

  <section className="enterprise-metrics">
   <div className="metric-card"><span>{tx.utilities}</span><b>12+</b><small>{t("Client-side tools available")}</small></div>
   <div className="metric-card"><span>{tx.wallet.toUpperCase()}</span><b>75</b><small>{t("Credits available")}</small></div>
   <div className="metric-card"><span>{t("DATA MODEL")}</span><b>{t("Local-first")}</b><small>{tx.dataSafe}</small></div>
   <div className="metric-card"><span>{tx.session.toUpperCase()}</span><b>{user?t("Active"):t("Guest")}</b><small>{user?t("Operator account connected"):t("Personal use — sign in to personalize")}</small></div>
  </section>

  <section className="enterprise-ad-plate" aria-label="Advertisement">
   <div className="ad-label">{t("ADVERTISEMENT")}</div>
   <div className="ad-auto-note">{t("Automatic ads are enabled for this site")}</div>
  </section>
 </div>
}

export default function Page(){
 const router=useRouter();
 const [theme,setTheme]=useLocal("smart-theme",DEFAULT_THEME),[lang,setLang]=useLocal("smart-language",DEFAULT_LANGUAGE),[cursor,setCursor]=useLocal("smart-cursor",true),[active,setActive]=useState("home"),[mobile,setMobile]=useState(false),[sidebarCollapsed,setSidebarCollapsed]=useLocal("smart-sidebar-collapsed",false),[user,setUser]=useLocal("smart-user",null),[toasts,setToasts]=useState([]);
 const safeTheme=getSafeTheme(theme);
 const safeLang=getLocale(lang);
 const t=(key)=>translate(safeLang,key);
 const toast=(title,message,type="success")=>{const id=Date.now()+Math.random();setToasts(x=>[...x,{id,title,message,type}]);setTimeout(()=>setToasts(x=>x.filter(t=>t.id!==id)),3500)};
 useEffect(()=>{const safeTheme=getSafeTheme(theme);const safeLang=getLocale(lang);if(safeTheme!==theme)setTheme(safeTheme);if(safeLang!==lang)setLang(safeLang);document.documentElement.dataset.theme=safeTheme;document.documentElement.lang=safeLang},[theme,lang,setTheme,setLang]);
 const content=active==="home"?<Dashboard setActive={setActive} user={user} lang={safeLang}/>:active==="scaler"?<Scaler/>:active==="ink"?<InkSaver/>:active==="photo"?<PhotoCropper/>:active==="convert"?<Converter/>:active==="font"?<FontConverter/>:active==="signature"?<SignaturePad/>:active==="legal"?<Legal/>:active==="calculator"?<CalculatorPack/>:active==="toolkit"?<Toolkit/>:active==="ai"?<AIStudio toast={toast}/>:<Profile user={user} setUser={setUser} onLogout={()=>setUser(null)} onSignIn={()=>router.push("/login")}/>;
 return <LocaleContext.Provider value={safeLang}><div className="min-h-screen text-[var(--text)]"><CursorFX enabled={cursor}/><Topbar theme={safeTheme} setTheme={setTheme} lang={safeLang} setLang={setLang} cursor={cursor} setCursor={setCursor} user={user} onAuth={()=>router.push("/login")} onMenu={()=>setMobile(true)}/><div className="app-layout mx-auto max-w-[1500px]"><Sidebar active={active} setActive={setActive} open={mobile} onClose={()=>setMobile(false)} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}/><main className="app-main min-w-0 p-4 lg:p-6"><div className="mb-5 flex items-center gap-2 text-xs text-[var(--muted)]"><button onClick={()=>setActive("home")} className="hover:text-[var(--accent)]">{t("Dashboard")}</button><ArrowRight size={12}/><span>{active==="home"?t("Overview"):t(TOOL_GROUPS.flatMap(g=>g.tools).find(x=>x[0]===active)?.[1]||"Workspace")}</span></div>{content}</main></div><footer className="app-footer"><span>© {new Date().getFullYear()} Smart Solution</span><span>{t("Development by")} <strong>MSR Technologies</strong></span></footer><Toasts items={toasts} onRemove={id=>setToasts(x=>x.filter(t=>t.id!==id))}/></div></LocaleContext.Provider>
}
