import { useState, useEffect, useRef } from "react";

// Brand Board Colors - 100% aligned
const midnight="#0A0E17",navy="#131A2B",charcoal="#1C2333",gold="#C9A84C",goldDk="#A0873D",cream="#E8DCC8",stone="#8A8577",slate="#6B7B8D",ash="#4A4640",terra="#E07A5F",green="#4A9E7D",white="#FFFFFF";

const ST={AL:{n:"Alabama",x:580,y:340,r:12},AK:{n:"Alaska",x:120,y:440,r:4},AZ:{n:"Arizona",x:200,y:320,r:18},AR:{n:"Arkansas",x:500,y:320,r:8},CA:{n:"California",x:100,y:250,r:45},CO:{n:"Colorado",x:280,y:240,r:32},CT:{n:"Connecticut",x:720,y:170,r:10},DE:{n:"Delaware",x:700,y:220,r:5},FL:{n:"Florida",x:640,y:420,r:28},GA:{n:"Georgia",x:620,y:350,r:15},HI:{n:"Hawaii",x:240,y:460,r:6},ID:{n:"Idaho",x:180,y:140,r:9},IL:{n:"Illinois",x:530,y:230,r:22},IN:{n:"Indiana",x:570,y:230,r:11},IA:{n:"Iowa",x:470,y:200,r:8},KS:{n:"Kansas",x:390,y:270,r:7},KY:{n:"Kentucky",x:590,y:270,r:10},LA:{n:"Louisiana",x:500,y:390,r:9},ME:{n:"Maine",x:740,y:90,r:11},MD:{n:"Maryland",x:690,y:230,r:14},MA:{n:"Massachusetts",x:730,y:155,r:18},MI:{n:"Michigan",x:570,y:160,r:16},MN:{n:"Minnesota",x:440,y:120,r:14},MS:{n:"Mississippi",x:540,y:360,r:6},MO:{n:"Missouri",x:480,y:270,r:13},MT:{n:"Montana",x:240,y:100,r:8},NE:{n:"Nebraska",x:380,y:210,r:6},NV:{n:"Nevada",x:140,y:230,r:10},NH:{n:"New Hampshire",x:730,y:120,r:9},NJ:{n:"New Jersey",x:710,y:205,r:15},NM:{n:"New Mexico",x:260,y:330,r:11},NY:{n:"New York",x:690,y:150,r:35},NC:{n:"North Carolina",x:660,y:290,r:19},ND:{n:"North Dakota",x:380,y:110,r:4},OH:{n:"Ohio",x:610,y:220,r:17},OK:{n:"Oklahoma",x:410,y:310,r:9},OR:{n:"Oregon",x:110,y:130,r:20},PA:{n:"Pennsylvania",x:670,y:195,r:22},RI:{n:"Rhode Island",x:735,y:168,r:5},SC:{n:"South Carolina",x:650,y:320,r:12},SD:{n:"South Dakota",x:380,y:160,r:5},TN:{n:"Tennessee",x:570,y:300,r:16},TX:{n:"Texas",x:370,y:380,r:38},UT:{n:"Utah",x:210,y:230,r:15},VT:{n:"Vermont",x:720,y:115,r:7},VA:{n:"Virginia",x:660,y:260,r:20},WA:{n:"Washington",x:120,y:80,r:22},WV:{n:"West Virginia",x:640,y:250,r:8},WI:{n:"Wisconsin",x:500,y:150,r:13},WY:{n:"Wyoming",x:270,y:170,r:6}};

const TYPES=["Marathon","Half Marathon","10K","5K","Ultra","Triathlon","Trail Run"];
const MO=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Warm-shifted imagery per brand board photo direction
const IMGS=[
  {bg:`linear-gradient(135deg,${charcoal},${midnight})`,ic:"🏔️",lb:"Mountain",tag:"Road",tagCol:gold},
  {bg:`linear-gradient(135deg,#2A3D2E,${midnight})`,ic:"🌲",lb:"Forest",tag:"Trail",tagCol:green},
  {bg:`linear-gradient(135deg,#4A3020,#1E0F08)`,ic:"🌅",lb:"Coast",tag:"Road",tagCol:gold},
  {bg:`linear-gradient(135deg,#1E2530,${midnight})`,ic:"🏙️",lb:"Urban",tag:"Road",tagCol:gold},
  {bg:`linear-gradient(135deg,#302040,${midnight})`,ic:"🌊",lb:"Ocean",tag:"Mixed",tagCol:terra},
  {bg:`linear-gradient(135deg,#4A3018,#201008)`,ic:"⛰️",lb:"Desert",tag:"Mountain",tagCol:terra},
  {bg:`linear-gradient(135deg,#1E3A28,${midnight})`,ic:"🏞️",lb:"Lake",tag:"Mixed",tagCol:green},
  {bg:`linear-gradient(135deg,#2A1E3A,${midnight})`,ic:"🌙",lb:"Night",tag:"Road",tagCol:gold},
];

const genRaces=(sc)=>{
  const s=ST[sc];if(!s)return[];
  const tpl=[
    {n:`${s.n} Marathon`,t:"Marathon",tr:"Road",f:1,p:"$120",ii:0},
    {n:`${s.n} Half Marathon`,t:"Half Marathon",tr:"Road",f:0,p:"$85",ii:2},
    {n:`Downtown ${s.n} 10K`,t:"10K",tr:"Road",f:0,p:"$45",ii:3},
    {n:`${s.n} Trail Ultra 50K`,t:"Ultra",tr:"Trail",f:1,p:"$175",ii:1},
    {n:`${s.n} Sprint Triathlon`,t:"Triathlon",tr:"Mixed",f:0,p:"$130",ii:6},
    {n:`${s.n} Mountain Challenge`,t:"Trail Run",tr:"Mountain",f:1,p:"$95",ii:5},
    {n:`Sunset ${s.n} 5K`,t:"5K",tr:"Beach",f:0,p:"$35",ii:4},
    {n:`${s.n} Iron Distance Tri`,t:"Triathlon",tr:"Mixed",f:1,p:"$350",ii:0},
    {n:`${s.n} Heritage Run`,t:"Half Marathon",tr:"Road",f:0,p:"$75",ii:3},
    {n:`${s.n} Night Run 10K`,t:"10K",tr:"Road",f:0,p:"$50",ii:7},
    {n:`${s.n} Endurance Fest`,t:"Ultra",tr:"Trail",f:1,p:"$200",ii:1},
    {n:`Lake ${s.n} Triathlon`,t:"Triathlon",tr:"Mixed",f:0,p:"$145",ii:6},
  ];
  return tpl.slice(0,Math.min(s.r,12)).map((r,i)=>({
    id:`${sc}-${i}`,name:r.n,type:r.t,terrain:r.tr,featured:!!r.f,img:IMGS[r.ii],price:r.p,
    date:`${MO[(i*3+sc.charCodeAt(0))%12]} ${(i*7+5)%28+1}, 2026`,
    city:`${s.n} City`,state:s.n,
    participants:Math.floor(Math.random()*5e3)+500,
    rating:(4+Math.random()).toFixed(1),
  }));
};

const ALL_R=Object.keys(ST).flatMap(c=>genRaces(c));

const EDIT=[
  {id:1,title:"48 Hours in Big Sur",sub:"Run the Marathon, Stay for the Magic",tag:"RACE-CATION GUIDE",rt:"8 min",exc:"The Big Sur International Marathon isn't just a race — it's a pilgrimage. Here's how to turn 26.2 miles of coastline into the weekend of a lifetime.",feat:1,img:IMGS[2],auth:"Sarah Chen",dt:"Jan 15, 2026",
    content:[
      {t:"intro",tx:"There are marathons you run, and then there are marathons you experience. The Big Sur International Marathon belongs firmly in the latter category — a 26.2-mile journey along one of the most breathtaking stretches of coastline on Earth."},
      {t:"h",tx:"Day One: Arrive, Breathe, Prepare"},
      {t:"p",tx:"Fly into Monterey Regional Airport, a small, stress-free airport that immediately sets the tone. Pick up your rental and drive south along Highway 1 — arguably the most scenic commute to a hotel you'll ever make. Check into Ventana Big Sur or Post Ranch Inn if you're going all out, or a charming Airbnb in Carmel Valley for something more intimate."},
      {t:"p",tx:"Spend your afternoon doing a gentle shakeout run along the Carmel River Trail — flat, forested, and a world away from the drama of tomorrow's course. Have dinner at Sierra Mar at Post Ranch Inn, perched 1,200 feet above the Pacific."},
      {t:"h",tx:"Day Two: Race Day Magic"},
      {t:"p",tx:"The Big Sur Marathon starts in the dark, and that's part of the magic. Buses carry runners south to Pfeiffer Big Sur State Park, and as the sun rises over the Santa Lucia Mountains, you'll understand why people fly across the world for this."},
      {t:"q",tx:"You don't run Big Sur for a PR. You run it for the photos, the tears at Bixby Bridge, and the story you'll tell for the rest of your life."},
      {t:"h",tx:"Day Three: Recover Like Royalty"},
      {t:"p",tx:"This is where the race-cation earns its name. Book a deep tissue massage at Ventana. Soak in the Japanese hot baths overlooking the canyon. Have a long, slow brunch at Deetjen's Big Sur Inn."},
      {t:"side",title:"Where to Stay",items:["Ventana Big Sur — From $750/night","Post Ranch Inn — From $1,200/night","Carmel Valley Ranch — From $450/night","Airbnb Luxe, Carmel — From $300/night"]},
    ]
  },
  {id:2,title:"The 10 Most Beautiful Races in America",sub:"Finish Lines Worth Flying For",tag:"EDITORIAL",rt:"12 min",exc:"From the volcanic trails of Hawaii to the covered bridges of Vermont, these are the races that redefine what a finish line can feel like.",feat:1,img:IMGS[0],auth:"Marcus Rivera",dt:"Jan 8, 2026"},
  {id:3,title:"Post-Race Recovery at The Ritz",sub:"When Your Cool Down Includes a Spa",tag:"LUXURY STAYS",rt:"6 min",exc:"The best luxury hotels near America's top races — because you deserve more than a foam roller after 13.1 miles.",feat:0,img:IMGS[5],auth:"Emily Park",dt:"Dec 20, 2025"},
  {id:4,title:"Chicago Marathon Race Recap 2025",sub:"Records, Rain, and Redemption",tag:"RACE RECAP",rt:"10 min",exc:"Over 40,000 runners took to the streets of Chicago for one of the most dramatic marathon days in recent memory.",feat:0,img:IMGS[3],auth:"James Okafor",dt:"Oct 15, 2025"},
  {id:5,title:"Planning a Tri-cation in Kona",sub:"The Ultimate Ironman Spectator Guide",tag:"RACE-CATION GUIDE",rt:"9 min",exc:"Even if you're not racing, Kona during Ironman week is unlike anything else on earth.",feat:0,img:IMGS[6],auth:"Sarah Chen",dt:"Sep 28, 2025"},
];

const TIERS=[
  {name:"Presenting Sponsor",price:"$10,000/mo",color:gold,feats:["Homepage hero placement","All state page banners","Editorial integration","Custom branded race guides","Monthly report","Priority support"]},
  {name:"Destination Partner",price:"$5,000/mo",color:stone,pop:1,feats:["State page sidebar","'Where to Stay' integration","Quarterly editorial feature","Race-cation guide placement","Analytics dashboard"]},
  {name:"Featured Brand",price:"$2,000/mo",color:slate,feats:["Rotating banner ads","Race card sponsorship","Monthly newsletter feature","Basic analytics"]},
];

// Terrain tag color mapping per brand board
const terrainColor=(t)=>{if(t==="Trail"||t==="Mountain")return green;if(t==="Mixed"||t==="Beach")return terra;return gold;};

const ImgCard=({img,children,style,hover=true,...p})=>(
  <div style={{background:img?.bg||navy,borderRadius:16,position:"relative",overflow:"hidden",transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",cursor:"pointer",...style}}
    onMouseEnter={e=>{if(hover){e.currentTarget.style.transform="translateY(-5px) scale(1.01)";e.currentTarget.style.boxShadow="0 20px 60px rgba(0,0,0,0.4)";}}}
    onMouseLeave={e=>{if(hover){e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow="none";}}} {...p}>
    <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0.75) 100%)",zIndex:1}}/>
    {img?.ic&&<div style={{position:"absolute",top:16,left:16,fontSize:40,zIndex:0,opacity:0.12}}>{img.ic}</div>}
    <div style={{position:"relative",zIndex:2}}>{children}</div>
  </div>
);

const RaceCard=({race:r})=>(
  <ImgCard img={r.img} style={{border:r.featured?`1px solid rgba(201,168,76,0.4)`:`1px solid rgba(255,255,255,0.06)`}}>
    <div style={{padding:24}}>
      {r.featured&&<div style={{display:"inline-block",background:`linear-gradient(135deg,${gold},${goldDk})`,color:midnight,fontSize:9,fontWeight:800,letterSpacing:1.5,padding:"3px 10px",borderRadius:20,textTransform:"uppercase",marginBottom:12}}>★ Featured</div>}
      <div style={{fontSize:36,marginBottom:12,filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.3))"}}>{r.img.ic}</div>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
        <span style={{color:gold,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase"}}>{r.type}</span>
        <span style={{background:`rgba(${terrainColor(r.terrain)==green?"74,158,125":terrainColor(r.terrain)==terra?"224,122,95":"201,168,76"},0.15)`,color:terrainColor(r.terrain),fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,letterSpacing:0.5}}>{r.terrain}</span>
      </div>
      <div style={{color:white,fontSize:18,fontWeight:700,lineHeight:1.3,marginBottom:10,textShadow:"0 1px 3px rgba(0,0,0,0.5)"}}>{r.name}</div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:14}}>
        <span style={{color:"rgba(255,255,255,0.7)",fontSize:12}}>📅 {r.date}</span>
        <span style={{color:"rgba(255,255,255,0.7)",fontSize:12}}>📍 {r.city}</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:12}}>
        <span style={{color:"rgba(255,255,255,0.55)",fontSize:11}}>⭐ {r.rating} · {r.participants.toLocaleString()} runners</span>
        <span style={{color:gold,fontWeight:700,fontSize:15}}>{r.price}</span>
      </div>
    </div>
  </ImgCard>
);

const EditCard=({a,big,onClick})=>(
  <ImgCard img={a.img} style={{height:"100%",border:`1px solid rgba(255,255,255,0.06)`}} onClick={onClick}>
    <div style={{padding:big?36:24,display:"flex",flexDirection:"column",minHeight:big?340:200}}>
      <div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>{a.tag}</div>
      <div style={{flex:1}}>
        <div style={{color:white,fontSize:big?28:18,fontWeight:800,lineHeight:1.2,marginBottom:6,textShadow:"0 2px 8px rgba(0,0,0,0.5)"}}>{a.title}</div>
        <div style={{color:"rgba(255,255,255,0.7)",fontSize:big?15:13,fontStyle:"italic",marginBottom:12}}>{a.sub}</div>
        {big&&<div style={{color:"rgba(255,255,255,0.55)",fontSize:13,lineHeight:1.6}}>{a.exc}</div>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:12}}>
        <span style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>{a.auth}</span>
        <span style={{color:"rgba(255,255,255,0.35)",fontSize:11}}>{a.rt}</span>
      </div>
    </div>
  </ImgCard>
);

const Search=({onState,onRace})=>{
  const[q,setQ]=useState(""),[foc,setFoc]=useState(false);
  const ql=q.toLowerCase();
  const sts=q.length<2?[]:Object.entries(ST).filter(([c,s])=>s.n.toLowerCase().includes(ql)||c.toLowerCase()===ql).slice(0,3);
  const rcs=q.length<2?[]:ALL_R.filter(r=>r.name.toLowerCase().includes(ql)||r.city.toLowerCase().includes(ql)||r.type.toLowerCase().includes(ql)).slice(0,5);
  const has=sts.length>0||rcs.length>0;
  return(
    <div style={{position:"relative",width:"100%",maxWidth:560,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,background:charcoal,border:foc?`1px solid rgba(201,168,76,0.5)`:`1px solid rgba(255,255,255,0.08)`,borderRadius:has&&foc?"16px 16px 0 0":16,padding:"14px 20px",transition:"all 0.3s"}}>
        <span style={{fontSize:18,opacity:0.5}}>🔍</span>
        <input value={q} onChange={e=>setQ(e.target.value)} onFocus={()=>setFoc(true)} onBlur={()=>setTimeout(()=>setFoc(false),200)}
          placeholder="Search races, cities, or states..." style={{background:"transparent",border:"none",outline:"none",color:cream,fontSize:15,width:"100%",fontFamily:"inherit"}}/>
        {q&&<span onClick={()=>setQ("")} style={{cursor:"pointer",color:slate,fontSize:14}}>✕</span>}
      </div>
      {foc&&has&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,background:navy,border:`1px solid rgba(201,168,76,0.3)`,borderTop:"none",borderRadius:"0 0 16px 16px",backdropFilter:"blur(20px)",maxHeight:380,overflowY:"auto"}}>
          {sts.length>0&&<div style={{padding:"12px 20px 4px"}}><div style={{color:gold,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>States</div></div>}
          {sts.map(([c,s])=>(
            <div key={c} onClick={()=>{onState(c);setQ("");}} style={{padding:"10px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",transition:"background 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{color:cream,fontSize:14}}>📍 {s.n}</span><span style={{color:slate,fontSize:12}}>{s.r} races</span>
            </div>
          ))}
          {rcs.length>0&&<div style={{padding:"12px 20px 4px",borderTop:sts.length?`1px solid rgba(255,255,255,0.04)`:"none"}}><div style={{color:gold,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>Races</div></div>}
          {rcs.map(r=>(
            <div key={r.id} onClick={()=>{onRace(r);setQ("");}} style={{padding:"10px 20px",cursor:"pointer",transition:"background 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(201,168,76,0.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{color:cream,fontSize:14}}>{r.name}</div>
              <div style={{color:slate,fontSize:12,marginTop:2}}>{r.type} · {r.date} · {r.state}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EmailCap=()=>{
  const[em,setEm]=useState(""),[done,setDone]=useState(false);
  return(
    <div style={{background:`linear-gradient(135deg,rgba(201,168,76,0.08),${navy},rgba(201,168,76,0.04))`,border:`1px solid rgba(201,168,76,0.15)`,borderRadius:24,padding:"56px 40px",textAlign:"center",maxWidth:700,margin:"0 auto"}}>
      {done?(
        <><div style={{fontSize:48,marginBottom:16}}>🎉</div><div style={{color:cream,fontSize:24,fontFamily:"Georgia,serif",fontWeight:700,marginBottom:8}}>You're in!</div><div style={{color:stone,fontSize:15}}>Check your inbox for a welcome from STRIDE.</div></>
      ):(
        <>
          <div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>Join 25,000+ Endurance Athletes</div>
          <div style={{color:cream,fontSize:28,fontFamily:"Georgia,serif",fontWeight:700,lineHeight:1.2,marginBottom:8}}>Never Miss a Start Line</div>
          <div style={{color:stone,fontSize:15,maxWidth:440,margin:"0 auto 28px",lineHeight:1.6}}>Weekly curated race picks, destination guides, and exclusive deals from our hotel and gear partners.</div>
          <div style={{display:"flex",gap:12,maxWidth:460,margin:"0 auto"}}>
            <input value={em} onChange={e=>setEm(e.target.value)} placeholder="Enter your email"
              style={{flex:1,background:charcoal,border:`1px solid rgba(255,255,255,0.08)`,borderRadius:12,padding:"14px 18px",color:cream,fontSize:14,outline:"none",fontFamily:"inherit"}}
              onFocus={e=>e.target.style.borderColor="rgba(201,168,76,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.08)"}/>
            <button onClick={()=>{if(em.includes("@"))setDone(true);}} style={{background:`linear-gradient(135deg,${gold},${goldDk})`,color:midnight,border:"none",borderRadius:12,padding:"14px 28px",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>Join Free</button>
          </div>
          <div style={{color:ash,fontSize:11,marginTop:12}}>No spam. Unsubscribe anytime.</div>
        </>
      )}
    </div>
  );
};

export default function App(){
  const[pg,setPg]=useState("home"),[sel,setSel]=useState(null),[hov,setHov]=useState(null),[tf,setTf]=useState("All"),[races,setRaces]=useState([]),[subT,setSubT]=useState("featured"),[art,setArt]=useState(null),[hi,setHi]=useState(0);

  useEffect(()=>{const t=setInterval(()=>setHi(p=>(p+1)%3),6e3);return()=>clearInterval(t);},[]);
  useEffect(()=>{if(sel)setRaces(genRaces(sel));},[sel]);

  const fr=tf==="All"?races:races.filter(r=>r.type===tf);
  const goS=c=>{setSel(c);setPg("state");setTf("All");};
  const goA=a=>{setArt(a);setPg("article");};
  const goH=()=>{setPg("home");setSel(null);setArt(null);};

  // Hero backgrounds - warm shifted per brand board
  const heros=[`linear-gradient(135deg,#1A1520,${navy},#1A2535,${midnight})`,`linear-gradient(135deg,${midnight},#1A2028,#25201A,${midnight})`,`linear-gradient(135deg,#1A1028,#20182E,#1A2535,${midnight})`];

  const Nav=()=>(
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(10,14,23,0.82)",backdropFilter:"blur(24px)",borderBottom:`1px solid rgba(201,168,76,0.08)`}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
        <div onClick={goH} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>⚡</span>
          <span style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:cream,letterSpacing:5,textTransform:"uppercase"}}>STRIDE</span>
        </div>
        <div style={{display:"flex",gap:28}}>
          {[["Discover","home"],["Editorial","editorial"],["List Your Race","submit"],["Partner With Us","partner"]].map(([l,p])=>(
            <span key={p} onClick={()=>{setPg(p);setSel(null);setArt(null);}} style={{color:pg===p?gold:slate,fontSize:12,fontWeight:600,letterSpacing:.5,cursor:"pointer",transition:"color 0.2s"}}
              onMouseEnter={e=>e.target.style.color=gold} onMouseLeave={e=>{if(pg!==p)e.target.style.color=slate;}}>{l}</span>
          ))}
        </div>
      </div>
    </nav>
  );

  const Map=()=>(
    <div style={{position:"relative",width:"100%",maxWidth:800,margin:"0 auto"}}>
      <svg viewBox="0 0 800 500" style={{width:"100%"}}>
        {Object.entries(ST).map(([c,s])=>{const h=hov===c;return(
          <g key={c} onClick={()=>goS(c)} onMouseEnter={()=>setHov(c)} onMouseLeave={()=>setHov(null)} style={{cursor:"pointer"}}>
            <circle cx={s.x} cy={s.y} r={h?18:12} fill={h?"rgba(201,168,76,0.9)":"rgba(201,168,76,0.25)"} stroke={gold} strokeWidth={h?2:.5} style={{transition:"all 0.3s cubic-bezier(0.16,1,0.3,1)"}}/>
            {h&&<circle cx={s.x} cy={s.y} r={24} fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth={1}/>}
            <text x={s.x} y={s.y+1} textAnchor="middle" dominantBaseline="middle" fill={h?midnight:cream} fontSize={h?9:7.5} fontWeight="700" fontFamily="sans-serif" style={{transition:"all 0.3s",pointerEvents:"none"}}>{c}</text>
          </g>
        );})}
      </svg>
      {hov&&<div style={{position:"absolute",top:10,right:10,background:navy,border:`1px solid rgba(201,168,76,0.3)`,borderRadius:14,padding:"14px 20px",backdropFilter:"blur(16px)"}}>
        <div style={{color:gold,fontSize:15,fontWeight:700}}>{ST[hov].n}</div>
        <div style={{color:stone,fontSize:12,marginTop:3}}>{ST[hov].r} upcoming races</div>
        <div style={{color:"rgba(201,168,76,0.6)",fontSize:11,marginTop:4}}>Click to explore →</div>
      </div>}
    </div>
  );

  const Home=()=>(
    <div>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",padding:"100px 24px 40px",background:heros[hi],transition:"background 2s ease"}}>
        <div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:5,textTransform:"uppercase",marginBottom:28,background:"rgba(201,168,76,0.08)",padding:"8px 24px",borderRadius:24,border:`1px solid rgba(201,168,76,0.15)`,display:"inline-block"}}>✦ The Modern Race Discovery Platform ✦</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(48px,6.5vw,72px)",fontWeight:700,color:cream,lineHeight:1.05,margin:"0 0 20px",maxWidth:800}}>Find Your Next<br/><span style={{color:gold,textShadow:"0 0 60px rgba(201,168,76,0.3)"}}>Finish Line</span></h1>
        <p style={{color:stone,fontSize:17,maxWidth:520,lineHeight:1.75,margin:"0 auto 36px"}}>Discover races, plan race-cations, and explore destinations. Curated for runners, triathletes, and adventure seekers.</p>
        <Search onState={goS} onRace={r=>{const c=Object.entries(ST).find(([k,s])=>s.n===r.state)?.[0];if(c)goS(c);}}/>
        <div style={{width:"100%",maxWidth:900,marginTop:48}}><Map/><p style={{color:ash,fontSize:11,marginTop:12,letterSpacing:1}}>Click any state to explore upcoming races</p></div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"80px 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
          <div><div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>Curated For You</div><h2 style={{fontFamily:"Georgia,serif",fontSize:34,color:cream,margin:0}}>Featured Adventures</h2></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
          {genRaces("CO").filter(r=>r.featured).slice(0,3).map(r=><RaceCard key={r.id} race={r}/>)}
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px 80px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
          <div><div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>From The Journal</div><h2 style={{fontFamily:"Georgia,serif",fontSize:34,color:cream,margin:0}}>Stories & Guides</h2></div>
          <span onClick={()=>setPg("editorial")} style={{color:gold,fontSize:12,cursor:"pointer",fontWeight:600}}>View All →</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <EditCard a={EDIT[0]} big onClick={()=>goA(EDIT[0])}/>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <EditCard a={EDIT[1]} onClick={()=>goA(EDIT[1])}/>
            <EditCard a={EDIT[2]} onClick={()=>goA(EDIT[2])}/>
          </div>
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px 40px",textAlign:"center"}}>
        <div style={{color:ash,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",marginBottom:24}}>Trusted By World-Class Brands</div>
        <div style={{display:"flex",justifyContent:"center",gap:48,flexWrap:"wrap"}}>
          {[["Ritz-Carlton","🏨"],["Airbnb Luxe","🏡"],["On Running","👟"],["Gatorade","💧"]].map(([n,e])=>(
            <div key={n} style={{display:"flex",alignItems:"center",gap:10,color:ash,fontSize:15,fontWeight:600,transition:"color 0.2s",cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.color=stone} onMouseLeave={e=>e.currentTarget.style.color=ash}>
              <span style={{fontSize:22}}>{e}</span><span>{n}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"40px 24px 80px"}}><EmailCap/></div>
    </div>
  );

  const StatePg=()=>{const s=ST[sel];if(!s)return null;return(
    <div style={{padding:"100px 24px 60px",maxWidth:1200,margin:"0 auto"}}>
      <div onClick={goH} style={{color:gold,fontSize:13,cursor:"pointer",marginBottom:24,fontWeight:500}}>← Back to Map</div>
      <div style={{marginBottom:48}}>
        <div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>Race Calendar</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:44,color:cream,margin:"0 0 8px"}}>{s.n}</h1>
        <p style={{color:stone,fontSize:15,margin:0}}>{s.r} upcoming races · Updated weekly</p>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:32,flexWrap:"wrap"}}>
        {["All",...TYPES].map(t=>(
          <button key={t} onClick={()=>setTf(t)} style={{background:tf===t?gold:charcoal,color:tf===t?midnight:slate,border:`1px solid ${tf===t?gold:"rgba(255,255,255,0.06)"}`,borderRadius:24,padding:"8px 18px",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all 0.2s",letterSpacing:.5}}>{t}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:32}}>
        <div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>{fr.map(r=><RaceCard key={r.id} race={r}/>)}</div>
        {fr.length===0&&<div style={{textAlign:"center",padding:60,color:ash}}><div style={{fontSize:48,marginBottom:16}}>🔍</div><div>No {tf} races found.</div></div>}</div>
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          <div style={{background:navy,border:`1px solid rgba(201,168,76,0.15)`,borderRadius:16,padding:24}}>
            <div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>Where To Stay</div>
            {[{n:"The Ritz-Carlton",e:"🏨",d:"Race-day packages from $299/night. Late checkout & spa.",t:"Luxury",tc:gold},{n:"Airbnb Luxe",e:"🏡",d:"Curated homes near start lines. Group-friendly.",t:"Private",tc:green},{n:"Four Seasons",e:"✨",d:"Post-race brunch with complimentary spa access.",t:"Premium",tc:terra}].map((h,i)=>(
              <div key={i} style={{marginBottom:i<2?16:0,paddingBottom:i<2?16:0,borderBottom:i<2?`1px solid rgba(255,255,255,0.04)`:"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{color:cream,fontSize:15,fontWeight:600}}>{h.e} {h.n}</span>
                  <span style={{color:h.tc,fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",background:`rgba(${h.tc===gold?"201,168,76":h.tc===green?"74,158,125":"224,122,95"},0.12)`,padding:"2px 8px",borderRadius:10}}>{h.t}</span>
                </div>
                <div style={{color:slate,fontSize:12,lineHeight:1.5}}>{h.d}</div>
              </div>
            ))}
            <div style={{color:ash,fontSize:10,marginTop:12,fontStyle:"italic"}}>Sponsored placement</div>
          </div>
          <div style={{background:navy,border:`1px solid rgba(255,255,255,0.06)`,borderRadius:16,padding:24}}>
            <div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>Race-cation Guide</div>
            <div style={{color:cream,fontSize:15,fontWeight:600,marginBottom:8}}>Make it a weekend ✨</div>
            <div style={{color:slate,fontSize:13,lineHeight:1.6}}>Curated guide to {s.n} — restaurants, recovery spots, and weekend plans.</div>
            <div style={{color:gold,fontSize:12,fontWeight:600,marginTop:14,cursor:"pointer"}}>Read the guide →</div>
          </div>
          <div style={{background:navy,border:`1px solid rgba(255,255,255,0.06)`,borderRadius:16,padding:24}}>
            <div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>Race Alert</div>
            <div style={{color:cream,fontSize:15,fontWeight:600,marginBottom:8}}>Get notified 🔔</div>
            <div style={{color:slate,fontSize:13,lineHeight:1.6,marginBottom:12}}>New {s.n} races delivered to your inbox.</div>
            <button style={{width:"100%",background:`rgba(201,168,76,0.1)`,color:gold,border:`1px solid rgba(201,168,76,0.3)`,borderRadius:12,padding:10,fontSize:12,fontWeight:700,cursor:"pointer"}}>Set Alert →</button>
          </div>
        </div>
      </div>
    </div>
  );};

  const ArticlePg=()=>{if(!art)return null;const c=art.content;return(
    <div style={{padding:"100px 24px 60px",maxWidth:800,margin:"0 auto"}}>
      <div onClick={()=>setPg("editorial")} style={{color:gold,fontSize:13,cursor:"pointer",marginBottom:24,fontWeight:500}}>← Back to Journal</div>
      <ImgCard img={art.img} hover={false} style={{marginBottom:40}}><div style={{padding:"80px 40px 60px"}}>
        <div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>{art.tag}</div>
        <div style={{color:white,fontSize:40,fontWeight:800,fontFamily:"Georgia,serif",lineHeight:1.1,marginBottom:10,textShadow:"0 2px 12px rgba(0,0,0,0.6)"}}>{art.title}</div>
        <div style={{color:"rgba(255,255,255,0.7)",fontSize:18,fontStyle:"italic"}}>{art.sub}</div>
      </div></ImgCard>
      <div style={{display:"flex",gap:20,marginBottom:48,color:stone,fontSize:13,borderBottom:`1px solid rgba(255,255,255,0.06)`,paddingBottom:20}}>
        <span>By <strong style={{color:cream}}>{art.auth}</strong></span><span>·</span><span>{art.dt}</span><span>·</span><span>{art.rt}</span>
      </div>
      {c?c.map((s,i)=>{
        if(s.t==="intro")return<p key={i} style={{color:"#B8AE9C",fontSize:19,lineHeight:1.85,marginBottom:32,fontFamily:"Georgia,serif"}}>{s.tx}</p>;
        if(s.t==="h")return<h2 key={i} style={{color:cream,fontSize:24,fontFamily:"Georgia,serif",marginTop:48,marginBottom:16}}>{s.tx}</h2>;
        if(s.t==="p")return<p key={i} style={{color:stone,fontSize:16,lineHeight:1.85,marginBottom:20}}>{s.tx}</p>;
        if(s.t==="q")return<blockquote key={i} style={{borderLeft:`3px solid ${gold}`,margin:"40px 0",padding:"16px 24px",background:"rgba(201,168,76,0.04)",borderRadius:"0 12px 12px 0"}}><p style={{color:cream,fontSize:18,fontStyle:"italic",fontFamily:"Georgia,serif",lineHeight:1.7,margin:0}}>{s.tx}</p></blockquote>;
        if(s.t==="side")return<div key={i} style={{background:navy,border:`1px solid rgba(201,168,76,0.15)`,borderRadius:16,padding:28,margin:"40px 0"}}><div style={{color:gold,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>{s.title}</div>{s.items.map((it,j)=><div key={j} style={{color:stone,fontSize:14,marginBottom:10,paddingLeft:16,borderLeft:`2px solid rgba(201,168,76,0.2)`}}>{it}</div>)}</div>;
        return null;
      }):<div style={{color:stone,fontSize:17,lineHeight:1.85}}>{art.exc}<div style={{color:ash,marginTop:40,textAlign:"center",fontStyle:"italic"}}>Full article coming soon...</div></div>}
    </div>
  );};

  const EditPg=()=>(
    <div style={{padding:"100px 24px 60px",maxWidth:1200,margin:"0 auto"}}>
      <div style={{marginBottom:48}}>
        <div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>The Journal</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:44,color:cream,margin:"0 0 8px"}}>Stories & Guides</h1>
        <p style={{color:stone,fontSize:15,margin:0}}>Race recaps, destination guides, and inspiration.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
        {EDIT.filter(a=>a.feat).map(a=><EditCard key={a.id} a={a} big onClick={()=>goA(a)}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
        {EDIT.filter(a=>!a.feat).map(a=><EditCard key={a.id} a={a} onClick={()=>goA(a)}/>)}
      </div>
    </div>
  );

  const SubmitPg=()=>(
    <div style={{padding:"100px 24px 60px",maxWidth:900,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:60}}>
        <div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>For Race Directors</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:44,color:cream,margin:"0 0 12px"}}>List Your Race</h1>
        <p style={{color:stone,fontSize:15,margin:"0 auto",maxWidth:480}}>Get your event in front of thousands of active, travel-ready athletes.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:48}}>
        {[{id:"free",nm:"Basic Listing",pr:"Free",fs:["Race name & details","Calendar placement","Map pin","Registration link"]},{id:"featured",nm:"Featured Listing",pr:"$99/race",hl:1,fs:["Everything in Basic","★ Featured badge & top placement","Premium map pin","Editorial roundup eligibility","Social media feature","'Where to Stay' pairing"]}].map(t=>(
          <div key={t.id} onClick={()=>setSubT(t.id)} style={{background:t.hl?`linear-gradient(135deg,rgba(201,168,76,0.1),${navy})`:navy,border:subT===t.id?`2px solid ${gold}`:`1px solid rgba(255,255,255,0.06)`,borderRadius:20,padding:32,cursor:"pointer",transition:"all 0.3s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            {t.hl&&<div style={{color:gold,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>Most Popular</div>}
            <div style={{color:cream,fontSize:22,fontWeight:700,marginBottom:4}}>{t.nm}</div>
            <div style={{color:gold,fontSize:28,fontWeight:700,fontFamily:"Georgia,serif",marginBottom:20}}>{t.pr}</div>
            {t.fs.map((f,i)=><div key={i} style={{color:stone,fontSize:14,marginBottom:10,display:"flex",alignItems:"center",gap:8}}><span style={{color:green}}>✓</span>{f}</div>)}
          </div>
        ))}
      </div>
      <div style={{background:navy,border:`1px solid rgba(255,255,255,0.06)`,borderRadius:20,padding:40}}>
        <h3 style={{color:cream,fontSize:20,fontFamily:"Georgia,serif",marginTop:0,marginBottom:24}}>Submit Your Event</h3>
        {["Race Name","Race Type","Date","Location (City, State)","Website URL","Contact Email"].map((l,i)=>(
          <div key={i} style={{marginBottom:20}}>
            <label style={{color:stone,fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:8}}>{l}</label>
            <input placeholder={l} style={{width:"100%",background:charcoal,border:`1px solid rgba(255,255,255,0.06)`,borderRadius:12,padding:"12px 16px",color:cream,fontSize:15,outline:"none",boxSizing:"border-box",transition:"border 0.2s",fontFamily:"inherit"}}
              onFocus={e=>e.target.style.borderColor="rgba(201,168,76,0.5)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.06)"}/>
          </div>
        ))}
        <button style={{width:"100%",background:`linear-gradient(135deg,${gold},${goldDk})`,color:midnight,border:"none",borderRadius:12,padding:"16px 32px",fontSize:15,fontWeight:700,letterSpacing:1,cursor:"pointer",textTransform:"uppercase"}}>Submit {subT==="featured"?"Featured":"Basic"} Listing →</button>
      </div>
    </div>
  );

  const PartnerPg=()=>(
    <div style={{padding:"100px 24px 60px",maxWidth:1100,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:60}}>
        <div style={{color:gold,fontSize:10,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>For Brands & Destinations</div>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:44,color:cream,margin:"0 0 12px"}}>Partner With STRIDE</h1>
        <p style={{color:stone,fontSize:15,margin:"0 auto",maxWidth:600,lineHeight:1.7}}>Reach an engaged audience of affluent, active, travel-ready endurance athletes.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,marginBottom:60}}>
        {[["250K+","Monthly Visitors"],["$125K","Avg. Household Income"],["73%","Travel for Races"],["4.2","Races Per Year"]].map(([n,l],i)=>(
          <div key={i} style={{background:navy,border:`1px solid rgba(255,255,255,0.06)`,borderRadius:16,padding:24,textAlign:"center"}}>
            <div style={{color:gold,fontSize:32,fontWeight:700,fontFamily:"Georgia,serif"}}>{n}</div>
            <div style={{color:stone,fontSize:12,letterSpacing:1,textTransform:"uppercase",marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,marginBottom:60}}>
        {TIERS.map(t=>(
          <div key={t.name} style={{background:t.pop?`linear-gradient(135deg,rgba(201,168,76,0.12),${navy})`:navy,border:t.pop?`2px solid rgba(201,168,76,0.5)`:`1px solid rgba(255,255,255,0.06)`,borderRadius:20,padding:32,position:"relative",transition:"all 0.3s",cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            {t.pop&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:gold,color:midnight,fontSize:10,fontWeight:700,padding:"4px 16px",borderRadius:20,letterSpacing:1.5,textTransform:"uppercase"}}>Most Popular</div>}
            <div style={{width:12,height:12,borderRadius:"50%",background:t.color,marginBottom:16}}/>
            <div style={{color:cream,fontSize:20,fontWeight:700,marginBottom:4}}>{t.name}</div>
            <div style={{color:gold,fontSize:28,fontWeight:700,fontFamily:"Georgia,serif",marginBottom:24}}>{t.price}</div>
            {t.feats.map((f,i)=><div key={i} style={{color:stone,fontSize:13,marginBottom:10,display:"flex",alignItems:"center",gap:8}}><span style={{color:t.color}}>✓</span>{f}</div>)}
            <button style={{width:"100%",marginTop:20,background:t.pop?`linear-gradient(135deg,${gold},${goldDk})`:"transparent",color:t.pop?midnight:gold,border:t.pop?"none":`1px solid rgba(201,168,76,0.4)`,borderRadius:12,padding:"12px 24px",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:1,textTransform:"uppercase"}}>Get Started</button>
          </div>
        ))}
      </div>
      <div style={{background:`linear-gradient(135deg,rgba(201,168,76,0.1),${navy})`,border:`1px solid rgba(201,168,76,0.2)`,borderRadius:24,padding:48,textAlign:"center"}}>
        <h2 style={{fontFamily:"Georgia,serif",color:cream,fontSize:28,margin:"0 0 12px"}}>Ready to reach race-day audiences?</h2>
        <p style={{color:stone,fontSize:15,maxWidth:500,margin:"0 auto 24px",lineHeight:1.6}}>Let's build a partnership that moves.</p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          <button style={{background:`linear-gradient(135deg,${gold},${goldDk})`,color:midnight,border:"none",borderRadius:12,padding:"14px 32px",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:1,textTransform:"uppercase"}}>Download Media Kit</button>
          <button style={{background:"transparent",color:gold,border:`1px solid rgba(201,168,76,0.4)`,borderRadius:12,padding:"14px 32px",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:1,textTransform:"uppercase"}}>Schedule a Call</button>
        </div>
      </div>
    </div>
  );

  const Footer=()=>(
    <footer style={{borderTop:`1px solid rgba(255,255,255,0.06)`,padding:"48px 24px",maxWidth:1200,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:32}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span style={{fontSize:20}}>⚡</span><span style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:cream,letterSpacing:3}}>STRIDE</span></div>
          <div style={{color:slate,fontSize:13,maxWidth:280,lineHeight:1.6}}>The modern platform for race discovery and adventure planning.</div>
        </div>
        {[{h:"Discover",l:["Race Calendar","Interactive Map","Race-cation Guides","Editorial"]},{h:"For Partners",l:["List Your Race","Advertise","Media Kit","Contact"]},{h:"Company",l:["About","Careers","Press","Privacy"]}].map(c=>(
          <div key={c.h}>
            <div style={{color:gold,fontSize:10,fontWeight:700,letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>{c.h}</div>
            {c.l.map(l=><div key={l} style={{color:slate,fontSize:13,marginBottom:10,cursor:"pointer"}} onMouseEnter={e=>e.target.style.color=cream} onMouseLeave={e=>e.target.style.color=slate}>{l}</div>)}
          </div>
        ))}
      </div>
      <div style={{borderTop:`1px solid rgba(255,255,255,0.06)`,marginTop:40,paddingTop:24,display:"flex",justifyContent:"space-between"}}>
        <div style={{color:ash,fontSize:12}}>© 2026 STRIDE. All rights reserved.</div>
        <div style={{color:ash,fontSize:12}}>Made with passion for the endurance community.</div>
      </div>
    </footer>
  );

  return(
    <div style={{background:midnight,minHeight:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'Inter',sans-serif",color:cream,overflowX:"hidden"}}>
      <Nav/>
      {pg==="home"&&<Home/>}
      {pg==="state"&&<StatePg/>}
      {pg==="editorial"&&<EditPg/>}
      {pg==="article"&&<ArticlePg/>}
      {pg==="submit"&&<SubmitPg/>}
      {pg==="partner"&&<PartnerPg/>}
      <Footer/>
    </div>
  );
}
