// Local raster building blocks; each action owns its timing and silhouette.
const s=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const env=(t,b,e,r=.16)=>s((t-b)/r)*(1-s((t-e)/r));
function dagger(p,x,y,ang,a,C,green=false){
 const cs=Math.cos(ang),sn=Math.sin(ang),pt=(X,Y)=>[x+X*cs-Y*sn,y+X*sn+Y*cs];
 p.poly([pt(-8,-4),pt(10,-4),pt(25,0),pt(8,5),pt(-8,3)],C[3],a);
 p.poly([pt(-6,-3),pt(25,0),pt(5,1)],green?(0xff000000 | 0x70dc48):C[6],a);
 p.poly([pt(-9,-8),pt(-5,-7),pt(-5,8),pt(-9,7)],C[4],a);
 const A=pt(-18,0),B=pt(-9,0);p.beam(...A,...B,5,C[1],a);p.beam(...A,...B,1,C[5],a);
}
function crossedDaggers(p,t,u,a,C){
 const q=s((t-.25)/.48),v=a*env(t,.14,.91,.28);
 for(const d of [-1,1]){const y=-34+d*27;const X=40+q*53,Y=y-d*q*54;
 p.glowLine(40,y,X,Y,12,C[3],v*.18);p.beam(40,y,X,Y,10,C[3],v);p.beam(40,y-2,X,Y-2,6,C[4],v);p.beam(40,y-4,X,Y-4,2,C[6],v);}
 const h=a*env(t,.6,.94,.13);p.circle(67,-34,12,C[4],h);p.circle(67,-34,6,C[6],h);
 for(let j=0;j<9;j++){const z=Math.max(0,t-.65),x=48+j*5,y=-37+z*z*55-j%3*8;p.tri(x,y,x+4,y+6,x-2,y+9,C[3+j%3],a*env(t,.65,1.55,.22));}
}
function shadowBackstab(p,t,u,a,C){
 const v=a*env(t,.05,.62,.23);for(let j=0;j<7;j++)p.circle(-27+j*3,-16-j%3*10,10+j%3,C[j%2],v);
 for(let j=0;j<6;j++){const h=a*env(t,.22+j*.055,.58+j*.055,.13);p.beam(30+j*11,-29-j%2*4,38+j*11,-31,5,C[2],h);}
 const h=a*env(t,.59,1.04,.18);p.arc(88,-32,27,10,-2.8,1.3,C[3],h);p.arc(88,-32,27,3,-2.8,1.3,C[6],h);dagger(p,70,-30,-.3,h,C);
 for(let j=0;j<5;j++)p.tri(84,-29,102+j*3,-54+j*10,93,-25,C[4+j%2],h);
 p.poly([[72,-64],[84,-57],[89,-10],[68,-15]],C[1],a*env(t,.64,1.3,.24));
}
function smokeScreen(p,t,u,a,C){
 const q=s((t-.14)/.9),v=a*env(t,.12,1.88,.35);
 for(let j=0;j<17;j++){const ang=j*2.4,x=77+Math.cos(ang)*(12+q*17),y=-32+Math.sin(ang)*22-6*q;
 const r=9+q*(5+j%5);p.circle(x,y,r,C[1],v);p.arc(x,y,r,2,3.4,5.7,C[3],v*.65);p.circle(x-3,y+3,r*.73,C[j%3===0?2:0],v*.8);}
 for(let j=0;j<23;j++){const x=45+j*17%62,y=-64+(j*13+t*12)%58;p.rect(x,y,2,2,C[4],v*.5);}
}
function flyingBlades(p,t,u,a,C){
 for(let j=0;j<3;j++){const start=.18+j*.27,q=s((t-start)/.55),v=a*env(t,start,start+.53,.12),x=31+q*70,y=-52+j*19;
 p.beam(x-24,y+2,x-5,y,7,C[2],v*.7);p.beam(x-20,y,x-4,y,2,C[4],v);dagger(p,x,y,(1-q)*-.6,v,C);
 const h=a*env(t,start+.5,start+.72,.12);p.arc(105,y,11,4,-2.7,1.2,C[4],h);p.beam(101,y,115,y-7,3,C[6],h);p.beam(103,y+2,111,y+9,3,C[3],h);}
}
function venomBurst(p,t,u,a,C){
 const q=s((t-.2)/.4);dagger(p,28+q*48,-30,.12,a*env(t,.12,.69,.18),C,true);
 const v=a*env(t,.57,1.68,.32),z=s((t-.57)/.65);
 p.glow(86,-29,28,(0xff000000 | 0x70dc48),v*.14);
 for(let j=0;j<9;j++){const ang=j*2.4,x=86+Math.cos(ang)*z*21,y=-28+Math.sin(ang)*z*23;
 p.circle(x,y,8+3*z,0xff234a28,v);p.circle(x-2,y-2,6,0xff408f35,v);p.arc(x,y,8,2,3.4,5.7,(0xff000000 | 0x70dc48),v);}
 for(let j=0;j<7;j++){const x=66+j*7,y=-29-s((t-.7)/1)*32-j%3*5;p.ring(x,y,3+j%3,1,(0xff000000 | 0x70dc48),a*env(t,.7+j*.05,1.9,.25));}
}
function phantomStep(p,t,u,a,C){
 for(let j=0;j<5;j++){const x=38+j*17,y=-7-j%2*5,v=a*env(t,.12+j*.17,.65+j*.17,.22);
 p.poly([[x-7,y-32],[x+2,y-47],[x+10,y-34],[x+15,y],[x-10,y-3]],C[1],v);
 p.poly([[x-5,y-32],[x+1,y-43],[x+7,y-32]],C[3],v);p.beam(x-2,y-32,x+5,y-32,2,C[5],v);
 p.poly([[x+4,y-27],[x-18,y-24],[x-26,y-30],[x-9,y-31]],C[3],v);p.poly([[x+3,y-23],[x+10,y-3],[x-3,y-6]],C[2],v);
 dagger(p,x+9,y-19,-.65,v,C);p.ellipse(x-3,y+3,13,3,C[2],v*.6);}
}
function chainHook(p,t,u,a,C){
 const q=s((t-.18)/.55)*(1-s((t-1.12)/.67)),end=31+q*76,v=a*env(t,.12,1.85,.23);
 for(let j=0;j<16;j++){const f=j/15,x=25+(end-25)*f,y=-28+Math.sin(f*Math.PI)*(1-q)*19;
 p.ellipse(x,y,4, j%2?2:4,C[2],v);p.ring(x,y,3,1,C[5],v);p.dot(x-1,y-2,C[6],v);}
 p.arc(end,-32,13,5,-1.9,2.7,C[3],v);p.arc(end,-32,13,2,-1.9,2.7,C[6],v);p.tri(end-4,-23,end-13,-29,end-8,-17,C[5],v);
 const h=a*env(t,.69,.98,.12);for(let j=0;j<5;j++)p.beam(106,-32,108+Math.cos(j*1.3)*14,-32+Math.sin(j*1.3)*14,3,C[j%2?4:6],h);
}
function crimsonExecution(p,t,u,a,C){
 const q=s((t-.35)/.65),v=a*env(t,.12,1.18,.3),ang=-2.9+q*2.5;
 p.arc(66,-38,57, f=>8+17*Math.sin(f*Math.PI),ang,ang+1.8,C[2],v);
 p.arc(66,-38,54,f=>6+13*Math.sin(f*Math.PI),ang,ang+1.7,C[4],v);
 p.arc(66,-38,55,3,ang,ang+1.7,C[6],v);p.glow(80,-68,28,C[3],v*.13);
 const h=a*env(t,.91,1.25,.13);p.poly([[78,-91],[93,-71],[87,4],[73,11],[82,-43]],C[3],h);p.beam(85,-79,80,5,5,C[6],h);
 const g=a*env(t,1.02,1.65,.2);p.ellipse(81,7,29,6,C[2],g);p.beam(55,8,107,3,3,C[4],g);p.polyline([[64,12],[76,3],[91,12],[100,3]],C[5],g);
 for(let j=0;j<11;j++){const z=Math.max(0,t-1.05),x=49+j*6,y=-65+j%4*12+z*z*65;p.tri(x,y,x+3,y+9,x-3,y+5,C[3+j%3],a*env(t,1.05,1.95,.24));}
}
export const choreography=[crossedDaggers,shadowBackstab,smokeScreen,flyingBlades,venomBurst,phantomStep,chainHook,crimsonExecution];
