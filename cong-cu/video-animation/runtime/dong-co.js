// ===== Onsen video animation — động cơ dựng cảnh (chạy trong trang, HyperFrames tua theo timeline) =====
// Dữ liệu: window.ONSEN (onsen-video.mjs sinh từ video.json). Mốc thời gian (s, e, t_muc, t_chinh, caps) đã tính sẵn.
(function(){
const O=window.ONSEN, P=1600;
const $=s=>document.querySelector(s), root=$('#root');
root.classList.add(O.phong_cach);
root.style.setProperty('--chinh',O.mau.chinh); root.style.setProperty('--phu',O.mau.phu);
const tl=gsap.timeline({paused:true});

// ---------- tiện ích ----------
function mk(parent,cls,html,st){const d=document.createElement('div');if(cls)d.className=cls;if(html!=null)d.innerHTML=html;if(st)Object.assign(d.style,st);(parent||root).appendChild(d);return d;}
function show(e,s,o={}){tl.fromTo(e,{opacity:0,y:o.y==null?60:o.y,x:o.x||0,scale:o.sc||.94,rotationX:o.rx||0,rotationY:o.ry||0,transformPerspective:P},
  {opacity:o.op==null?1:o.op,y:0,x:0,scale:1,rotationX:0,rotationY:0,duration:o.d||.5,ease:o.ease||'back.out(1.4)'},s);}
function count(el,from,to,s,d,fmt){const o={v:from};el.textContent=fmt(from);
  tl.fromTo(o,{v:from},{v:to,duration:d,ease:'power3.out',onUpdate(){el.textContent=fmt(o.v);},immediateRender:false},s);}
function click(el,t){tl.fromTo(el,{scale:1},{scale:.92,duration:.08,yoyo:true,repeat:1,ease:'power1.inOut',immediateRender:false},t);}
function shake(el,t,n){tl.fromTo(el,{x:0},{x:12,yoyo:true,repeat:n||5,duration:.04,ease:'none',immediateRender:false},t);}
const CUR='<svg viewBox="0 0 24 24" width="64" height="64"><path d="M3 2l7 18 2.6-7.4L20 10z" fill="#0F172A" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
function cursor(parent,pts,fadeOut){const c=mk(parent,'cursor',CUR);const [t0,x0,y0]=pts[0];
  tl.fromTo(c,{opacity:0,x:x0,y:y0},{opacity:1,x:x0,y:y0,duration:.2},t0);
  for(let i=1;i<pts.length;i++){const [t,x,y]=pts[i],[tp,xp,yp]=pts[i-1];
    tl.fromTo(c,{x:xp,y:yp},{x,y,duration:Math.max(.1,t-tp-.05),ease:'power2.inOut',immediateRender:false},tp+.05);}
  tl.fromTo(c,{opacity:1},{opacity:0,duration:.2,immediateRender:false},fadeOut);return c;}
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nh=s=>esc(s).replace(/\{([^}]*)\}/g,'<span class="k">$1</span>');      // {từ nhấn} → màu thương hiệu
const bo=s=>String(s==null?'':s).replace(/[{}]/g,'');
const fmtSo=v=>Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const laSo=v=>typeof v==='number'&&isFinite(v);
function coChu(t,base){const n=bo(t).length;return Math.round(n<=10?base:n<=20?base*.84:n<=34?base*.7:n<=50?base*.6:base*.5);}
// vùng nội dung an toàn: x 70–1010, y 290–1320 (trên là nhãn cảnh, dưới là phụ đề)
function zone(w,gap){return mk(w,'abs','',{left:'70px',top:'290px',width:'940px',height:'1030px',display:'flex',flexDirection:'column',
  alignItems:'center',justifyContent:'center',gap:(gap==null?34:gap)+'px'});}
const F={position:'relative',left:'auto',top:'auto',width:'100%'};
const anh=(src,st)=>'<img class="logo-img" src="'+esc(src)+'" style="'+(st||'')+'">';
const TH=O.thuong_hieu||{}, chuCai=(TH.ten||'?').trim().charAt(0).toUpperCase();
const ICO={ok:'✓',x:'✕'};

// ---------- nền sáng/tối + màu phụ đề theo từng cảnh ----------
let toiTruoc=null;
O.canh.forEach((sc,i)=>{const toi=sc.nen==='toi';
  if(toiTruoc===null){tl.set('#nenToi',{opacity:toi?1:0},0);
    tl.set(root,{'--cap-chu':toi?'#ffffff':'var(--chu)','--cap-nhan':toi?'var(--phu)':'var(--chinh)'},0);}
  else if(toi!==toiTruoc){tl.fromTo('#nenToi',{opacity:toi?0:1},{opacity:toi?1:0,duration:.35,immediateRender:false},sc.s);
    tl.set(root,{'--cap-chu':toi?'#ffffff':'var(--chu)','--cap-nhan':toi?'var(--phu)':'var(--chinh)'},sc.s+.15);}
  toiTruoc=toi;});

// ---------- thư viện cảnh ----------
const B={};
B['so-lon']=(w,sc)=>{const {s,e}=sc,d=e-s,z=zone(w,30);
  const txt=laSo(sc.so)?fmtSo(sc.so)+' '+(sc.don_vi||''):bo(sc.chu);
  const big=mk(z,'h1','',Object.assign({},F,{fontSize:Math.min(230,Math.round(1500/Math.max(4,txt.length)))+'px'}));
  if(laSo(sc.so)){big.innerHTML='<span class="sv"></span>'+(sc.don_vi?'<span class="k" style="font-size:.42em;margin-left:12px">'+esc(sc.don_vi)+'</span>':'');
    count(big.querySelector('.sv'),0,sc.so,s+.1,Math.min(1.6,d*.5),fmtSo);}
  else big.innerHTML=nh(sc.chu);
  show(big,s,{y:40,d:.5});
  if(sc.dong_phu){const k=mk(z,'kick',esc(sc.dong_phu),F);show(k,s+.25,{y:20,d:.4});}
  const bar=mk(z,'',null,{width:'440px',height:'8px',borderRadius:'8px',background:'var(--grad)',transformOrigin:'0 50%'});
  tl.fromTo(bar,{scaleX:0},{scaleX:1,duration:.9,ease:'power3.out'},s+.35);};

B['tieu-de']=(w,sc)=>{const {s}=sc,z=zone(w,26);
  const h=mk(z,'h1',nh(sc.chu),Object.assign({},F,{fontSize:coChu(sc.chu,140)+'px'}));show(h,s,{y:50,d:.5});
  if(sc.gach){const g=mk(z,'',null,{position:'relative',display:'inline-block'});
    const gh=mk(g,'h1',esc(sc.gach),Object.assign({},F,{width:'auto',fontSize:coChu(sc.gach,120)+'px',color:'var(--chu-phu)'}));
    show(g,s+.3,{y:40,d:.45});
    const st=mk(g,'abs','',{left:'-10px',right:'-10px',top:'52%',height:'12px',borderRadius:'8px',background:'var(--sai)',transformOrigin:'0 50%'});
    tl.fromTo(st,{scaleX:0},{scaleX:1,duration:.35,ease:'power3.out'},sc.t_chinh);}
  if(sc.dong_phu){const k=mk(z,'kick',esc(sc.dong_phu),F);show(k,s+.35,{y:20,d:.4});}};

B['tin-nhan']=(w,sc)=>{const {s}=sc,z=zone(w,40),tin=sc.tin||[];
  const c=mk(z,'c','',{position:'relative',width:'940px'});
  c.innerHTML='<div class="row" style="gap:20px;padding:30px 34px 0"><div class="av">'+esc(chuCai)+'</div><div style="font-weight:800;font-size:38px;flex:1">'+esc(sc.tieu_de||'Tin nhắn')+'</div>'+(laSo(sc.dem)?'<div class="badge">0</div>':'')+'</div>';
  const col=mk(c,'',null,{padding:'26px 34px 34px',display:'flex',flexDirection:'column',gap:'16px'});
  show(c,s,{y:100,rx:10,d:.55,ease:'power3.out'});
  tin.forEach((t,i)=>{const b=mk(col,'bubble'+(i%2?' me':''),esc(t),{maxWidth:'680px',width:'max-content'});
    tl.fromTo(b,{opacity:0,y:26,x:i%2?40:-40},{opacity:1,y:0,x:0,duration:.35,ease:'back.out(1.6)'},sc.t_muc[i]);});
  if(laSo(sc.dem))count(c.querySelector('.badge'),0,sc.dem,s+.3,Math.max(.6,(sc.t_muc[tin.length-1]||s+1)-s),v=>Math.round(v));
  const td=sc.the_duoi;
  if(td){const c2=mk(z,'c','<div class="row" style="gap:20px;padding:30px 34px 0"><div class="av" style="background:var(--chu)"></div><div style="font-weight:800;font-size:38px;flex:1">'+esc(td.tieu_de||'')+'</div></div>'+
      '<div style="text-align:center;font-family:var(--font-td);font-size:200px;font-weight:var(--w-td);line-height:1.05;letter-spacing:-.04em;color:'+(td.xau?'var(--sai)':'var(--chinh)')+'">'+esc(td.so)+'</div>'+
      '<div class="lab" style="text-align:center;padding-bottom:30px">'+esc(td.ghi_chu||'')+'</div>',{position:'relative',width:'940px'});
    tl.fromTo(c,{opacity:1,scale:1},{opacity:.55,scale:.97,duration:.3,immediateRender:false},sc.t_chinh);
    show(c2,sc.t_chinh,{x:420,y:0,ry:-24,sc:.9,d:.5,ease:'back.out(1.3)'});
    if(td.xau)shake(c2,sc.t_chinh+.5,5);}};

B['chi-so']=(w,sc)=>{const {s,e}=sc,o=(sc.o||[]).slice(0,6),rows=Math.ceil(o.length/2),h=rows*240+(rows-1)*40,top=290+(1030-h)/2-(sc.minh_hoa?20:0);
  const pos=o.map((_,i)=>[o.length===1?315:70+(i%2)*490,top+Math.floor(i/2)*280]);
  o.forEach((m,i)=>{const t=mk(w,'c tile','<div class="lab">'+esc(m.ten)+'</div><div class="v">'+(laSo(m.gia_tri)?'':esc(m.gia_tri==null?'?':m.gia_tri))+'</div><div class="s">'+esc(m.ghi_chu||'')+'</div>',
      {left:pos[i][0]+'px',top:pos[i][1]+'px'});
    show(t,sc.t_muc[i],{y:60,rx:12,d:.45});
    if(laSo(m.gia_tri))count(t.querySelector('.v'),0,m.gia_tri,sc.t_muc[i]+.1,.9,v=>fmtSo(v)+(m.don_vi||''));});
  if(sc.minh_hoa)mk(w,'ghi','Số liệu minh hoạ',{top:(top+h+28)+'px'});
  if(sc.con_tro&&o.length){const pts=[[sc.t_muc[0]+.2,900,1300]];o.forEach((_,i)=>pts.push([sc.t_muc[i]+.45,pos[i][0]+330,pos[i][1]+150]));cursor(w,pts,e-.2);}};

B['bieu-do']=(w,sc)=>{const {s,e}=sc,d=e-s,p=(sc.diem||[10,30,20,60,90]).map(Number),n=p.length,mx=Math.max(...p,1),mn=Math.min(...p,0);
  const W=860,H=480,X=i=>Math.round(i*W/(n-1||1)),Y=v=>Math.round(H-20-(v-mn)/(mx-mn||1)*(H-60));
  const path=p.map((v,i)=>(i?'L':'M')+X(i)+' '+Y(v)).join(' ');
  const len=p.reduce((a,v,i)=>i?a+Math.hypot(X(i)-X(i-1),Y(v)-Y(p[i-1])):0,0)+10;
  const col=sc.xu_huong==='giam'?'var(--sai)':'var(--chinh)';
  const c=mk(w,'c','<div class="lab" style="padding:30px 40px 0">'+esc(sc.tieu_de||'')+'</div>',{left:'70px',top:'470px',width:'940px',height:'640px'});
  c.insertAdjacentHTML('beforeend','<svg class="abs" style="left:40px;top:110px;overflow:visible" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'">'+
    '<g stroke="var(--o-nhat)" stroke-width="2">'+[0,1,2,3].map(k=>'<line x1="0" x2="'+W+'" y1="'+(40+k*(H-60)/3)+'" y2="'+(40+k*(H-60)/3)+'"/>').join('')+'</g>'+
    '<path class="dg" d="'+path+'" fill="none" stroke="'+col+'" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="'+len+'" stroke-dashoffset="'+len+'"/>'+
    p.map((v,i)=>'<circle class="pt" cx="'+X(i)+'" cy="'+Y(v)+'" r="11" fill="var(--the)" stroke="'+col+'" stroke-width="6" opacity="0"/>').join('')+'</svg>');
  show(c,s,{y:80,rx:8,d:.5});
  const dur=Math.min(1.8,d*.6);
  tl.fromTo(c.querySelector('.dg'),{strokeDashoffset:len},{strokeDashoffset:0,duration:dur,ease:'power2.inOut'},sc.t_chinh);
  c.querySelectorAll('.pt').forEach((pt,i)=>tl.fromTo(pt,{opacity:0},{opacity:1,duration:.15},sc.t_chinh+dur*i/(n-1||1)));
  (sc.chip||[]).forEach((ch,j)=>{const i=Math.max(0,Math.min(n-1,ch.i|0));
    const el=mk(c,'abs chip',esc(ch.chu),{left:Math.max(20,Math.min(700,40+X(i)-90))+'px',top:Math.max(60,110+Y(p[i])-80)+'px',background:ch.xau?'var(--sai)':'var(--chu)'});
    show(el,sc.t_muc[j],{y:20,sc:.6,d:.35,ease:'back.out(2)'});});
  if(sc.minh_hoa)mk(w,'ghi','Số liệu minh hoạ',{top:'1140px'});};

B['danh-sach']=(w,sc)=>{const {s}=sc,z=zone(w),m=sc.muc||[],x=sc.dau==='x';
  const c=mk(z,'c','',{position:'relative',width:'940px',padding:'44px 48px'});
  if(sc.tieu_de)mk(c,'',nh(sc.tieu_de),{fontFamily:'var(--font-td)',fontWeight:'var(--w-td)',fontSize:'54px',lineHeight:'1.1',marginBottom:'34px',letterSpacing:'var(--gian-td)'});
  const col=mk(c,'',null,{display:'flex',flexDirection:'column',gap:'28px'});
  show(c,s,{y:80,rx:8,d:.5});
  m.forEach((t,i)=>{const it=mk(col,'item','<span class="mark '+(x?'x':'ok')+'">'+(x?ICO.x:ICO.ok)+'</span><span>'+nh(t)+'</span>');
    tl.fromTo(it,{opacity:0,x:-40},{opacity:1,x:0,duration:.35,ease:'back.out(1.6)'},sc.t_muc[i]);
    tl.fromTo(it.querySelector('.mark'),{scale:0},{scale:1,duration:.3,ease:'back.out(2.4)'},sc.t_muc[i]+.08);});};

B['so-sanh']=(w,sc)=>{const {s}=sc,z=zone(w,36),A=sc.trai||{},Bp=sc.phai||{},a=(A.muc||[]).length;
  const card=(side,ok)=>{const c=mk(z,'c','',{position:'relative',width:'940px',padding:'34px 44px',borderWidth:ok?'3px':'1px',borderColor:ok?'var(--chinh)':''});
    mk(c,'',esc(side.tieu_de||''),{display:'inline-block',padding:'10px 26px',borderRadius:'999px',background:ok?'var(--grad)':'var(--o-nhat)',color:ok?'#fff':'var(--chu-phu)',fontWeight:'800',fontSize:'28px',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:'24px'});
    const col=mk(c,'',null,{display:'flex',flexDirection:'column',gap:'20px'});
    const its=(side.muc||[]).map(t=>mk(col,'item','<span class="mark '+(ok?'ok':'x')+'">'+(ok?ICO.ok:ICO.x)+'</span><span>'+nh(t)+'</span>',{fontSize:'36px'}));
    return [c,its];};
  const [c1,i1]=card(A,false),[c2,i2]=card(Bp,true);
  show(c1,s,{y:70,d:.5});show(c2,sc.t_chinh,{y:70,d:.5});
  i1.concat(i2).forEach((it,k)=>tl.fromTo(it,{opacity:0,x:-30},{opacity:1,x:0,duration:.3,ease:'back.out(1.6)'},sc.t_muc[k]));
  tl.fromTo(c1,{opacity:1},{opacity:.6,duration:.3,immediateRender:false},sc.t_chinh);};

B['cau-hoi']=(w,sc)=>{const {s}=sc,q=sc.cau||[];
  const big=mk(w,'qm','?',{left:'600px',top:'180px',fontSize:'1000px',opacity:0,transformOrigin:'30% 60%'});
  tl.fromTo(big,{opacity:0,scale:.5,rotation:-12},{opacity:.13,scale:1,rotation:8,duration:.55,ease:'back.out(2)'},s);
  const z=zone(w,30);
  const cs=q.map(t=>mk(z,'c','<div style="padding:38px 44px;font-family:var(--font-td);font-weight:var(--w-td);font-size:'+coChu(t,64)+'px;line-height:1.12;letter-spacing:var(--gian-td)">'+nh(t)+'</div>',{position:'relative',width:'940px'}));
  cs.forEach((c,i)=>show(c,sc.t_muc[i],{y:70,rx:8,d:.5}));
  if(cs.length)tl.fromTo(cs,{scale:1},{scale:1.02,yoyo:true,repeat:3,duration:.5,ease:'sine.inOut',immediateRender:false},sc.t_muc[cs.length-1]+.6);};

B['dau-moc']=(w,sc)=>{const {s}=sc,z=zone(w,60);
  if(sc.tren){const k=mk(z,'kick',esc(sc.tren),Object.assign({},F,{fontSize:'40px'}));show(k,s+.1,{y:30,d:.4});}
  const st=mk(z,'stamp','<span>'+esc(sc.chu||'')+'</span>',{position:'relative',left:'auto',width:'100%'});
  tl.fromTo(st,{opacity:0,scale:2.6},{opacity:1,scale:1,duration:.17,ease:'power4.in'},sc.t_chinh);
  shake(w,sc.t_chinh+.17,5);};

B['san-pham']=(w,sc)=>{const {s,e}=sc;
  const c=mk(w,'c','',{left:'130px',top:'300px',width:'820px',height:'1000px'});
  const img=sc.anh?'<div style="height:560px;background:var(--o-nhat)"><img src="'+esc(sc.anh)+'" style="width:100%;height:100%;object-fit:cover;display:block"></div>'
    :'<div class="ph" style="height:560px"><div class="av" style="width:180px;height:180px;font-size:90px">'+esc(chuCai)+'</div></div>';
  c.innerHTML=img+'<div style="padding:34px 44px 0"><div style="font-family:var(--font-td);font-weight:var(--w-td);font-size:'+coChu(sc.ten,58)+'px;line-height:1.1;letter-spacing:var(--gian-td)">'+nh(sc.ten)+'</div>'+
    '<div class="row" style="gap:22px;margin-top:18px"><span style="font-size:60px;font-weight:800;color:var(--chinh)">'+esc(sc.gia||'')+'</span>'+(sc.gia_cu?'<span style="font-size:38px;color:var(--chu-phu);text-decoration:line-through">'+esc(sc.gia_cu)+'</span>':'')+'</div></div>';
  const btn=mk(c,'abs btn',esc(sc.nut||'Đặt ngay'),{left:'44px',right:'44px',bottom:'40px',height:'110px',fontSize:'44px'});
  if(sc.nhan_dan){const nd=mk(c,'abs chip',esc(sc.nhan_dan),{left:'30px',top:'30px',background:'var(--sai)',fontSize:'34px'});show(nd,s+.6,{y:0,sc:.3,d:.35,ease:'back.out(2.5)'});}
  show(c,s,{y:90,rx:10,d:.55,ease:'power3.out'});
  click(btn,sc.t_chinh);
  if(sc.con_tro!==false)cursor(w,[[Math.max(s+.5,sc.t_chinh-1),980,1500],[sc.t_chinh-.05,560,1215]],e-.15);};

B['thong-bao']=(w,sc)=>{const tb=(sc.tb||[]).slice(0,5);
  tb.forEach((n,i)=>{const c=mk(w,'c','<div class="row" style="gap:24px;padding:28px 32px"><div class="av" style="width:84px;height:84px">'+esc(chuCai)+'</div>'+
      '<div style="flex:1;min-width:0"><div class="row" style="justify-content:space-between"><b style="font-size:34px">'+esc(n.tieu_de||'')+'</b><span class="lab" style="font-size:22px">'+esc(n.gio||'vừa xong')+'</span></div>'+
      '<div style="font-size:30px;color:var(--chu-phu);margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(n.noi_dung||'')+'</div></div></div>',
      {left:'70px',top:(300+i*200)+'px',width:'940px'});
    show(c,sc.t_muc[i],{y:-60,sc:.96,d:.4,ease:'back.out(1.5)'});});};

B['ket']=(w,sc)=>{const {s}=sc;
  [[40,330,.16],[690,250,.13],[760,860,.1],[-30,900,.13],[380,1220,.09],[740,1200,.12]].forEach(([x,y,o],i)=>{
    const m=mk(w,'mini','',{left:x+'px',top:y+'px',filter:'blur(8px)',opacity:o});
    tl.fromTo(m,{y:0},{y:(i%2?-50:50),duration:Math.max(2,sc.e-s),ease:'sine.inOut'},s);});
  const z=zone(w,40);
  const lg=TH.logo?mk(z,'','<div style="width:520px;height:220px;background:#fff;border-radius:var(--bo);padding:26px">'+anh(TH.logo)+'</div>',{position:'relative'})
    :mk(z,'h1',esc(TH.ten||''),Object.assign({},F,{fontSize:coChu(TH.ten,130)+'px',color:'#fff'}));
  tl.fromTo(lg,{opacity:0,scale:.4},{opacity:1,scale:1,duration:.45,ease:'back.out(2)'},sc.t_chinh);
  if(sc.dong_phu){const k=mk(z,'kick',esc(sc.dong_phu),F);show(k,sc.t_chinh+.3,{y:20,d:.4});}
  if(sc.cta){const b=mk(z,'btn',esc(sc.cta),{position:'relative',padding:'30px 70px',fontSize:'48px'});show(b,sc.t_chinh+.55,{y:30,sc:.7,d:.45,ease:'back.out(2)'});
    tl.fromTo(b,{scale:1},{scale:1.05,yoyo:true,repeat:3,duration:.4,ease:'sine.inOut',immediateRender:false},sc.t_chinh+1.1);}
  const lh=sc.lien_he||TH.lien_he;
  if(lh){const t=mk(z,'',esc(lh),{color:'rgba(255,255,255,.85)',fontSize:'40px',fontWeight:'600',letterSpacing:'.04em'});show(t,sc.t_chinh+.8,{y:20,d:.4});}};

// ---------- dựng từng cảnh ----------
O.canh.forEach((sc,i)=>{const w=mk($('#canh'),'canh'+(sc.nen==='toi'?' toi':''));
  if(i===0)tl.set(w,{opacity:1},0);else tl.fromTo(w,{opacity:0},{opacity:1,duration:.25},sc.s);
  if(i<O.canh.length-1)tl.fromTo(w,{opacity:1},{opacity:0,duration:.25,immediateRender:false},sc.e-.05);
  (B[sc.kieu]||B['tieu-de'])(w,sc);
  if(sc.nhan){const sp=document.createElement('span');sp.innerHTML='<i class="dot"></i>'+esc(sc.nhan);$('#nhan').appendChild(sp);
    tl.fromTo(sp,{opacity:0,y:-20},{opacity:1,y:0,duration:.3,ease:'back.out(1.6)'},sc.s+.1).fromTo(sp,{opacity:1},{opacity:0,duration:.2,immediateRender:false},sc.e-.15);}});

// ---------- phụ đề ----------
O.caps.forEach((c,i)=>{const nx=O.caps[i+1],e=nx?Math.min(c.e+.15,nx.s-.02):c.e+.3;
  const el=mk($('#phude'),'cap',c.h);
  tl.fromTo(el,{opacity:0,scale:.94,y:14},{opacity:1,scale:1,y:0,duration:.2,ease:'back.out(1.5)'},c.s)
    .fromTo(el,{opacity:1},{opacity:0,duration:.1,immediateRender:false},Math.max(c.s+.25,e-.1));});

tl.to({},{duration:.001},O.tong-.001);
window.__timelines=window.__timelines||{};window.__timelines["root"]=tl;
})();
