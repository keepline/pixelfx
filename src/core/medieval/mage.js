const s=(t,b,e)=>{let v=Math.max(0,Math.min(1,(t-b)/(e-b)));return v*v*(3-2*v);};
const env=(t,b=.1,e=.5,r=1.8)=>s(t,b,e)*(1-s(t,r,2.38));
function crystal(p,x,y,w,h,C,a){p.poly([[x,y-h],[x+w,y-2],[x+2,y+h*.4],[x-w,y+2]],C[3],a);p.tri(x,y-h,x+w,y-2,x,y+3,C[5],a);p.line(x,y-h,x,y+h*.3,C[6],a);}
function iceLance(p,t,u,a,C){
 const q=s(t,.3,1.05),v=a*env(t,.05,.28,1.3),x=38+q*61;
 if(t<1.12){p.glow(x,-30,18,C[4],v*.22);p.poly([[x-45,-35],[x,-36],[x+24,-30],[x,-24],[x-45,-27]],C[2],v);p.poly([[x-42,-31],[x,-33],[x+24,-30],[x,-28]],C[5],v);p.tri(x,-36,x+24,-30,x,-30,C[6],v);for(let j=0;j<3;j++)crystal(p,x-16-j*12,-43+j*12,3,7,C,v*.7);}
 const h=a*s(t,.96,1.12)*(1-s(t,1.35,2.2));p.glow(105,-29,23,C[5],h*.3);for(let j=0;j<10;j++){let z=j*2.4,d=s(t,1,1.8)*20;crystal(p,104+Math.cos(z)*d,-29+Math.sin(z)*d,3,5,C,h);}p.ellipse(102,-1,22,4,C[3],h*.5);
}
function freezingNova(p,t,u,a,C){
 const v=a*env(t),r=12+65*s(t,.25,1.5);p.ellipse(45,1,r,14,C[2],v*.65);p.ellipse(45,-1,r-4,10,C[4],v*.55);p.ellipse(45,-2,r-10,6,C[0],v*.8);
 for(let j=0;j<18;j++){let z=j*Math.PI/9,x=45+Math.cos(z)*r,y=-1+Math.sin(z)*12;crystal(p,x,y,4,7+(j%3)*3,C,v);p.beam(45+Math.cos(z)*18,0,x,y,2,C[5],v*.6);p.line(x,y,x-6,y-5,C[6],v);}
}
function glacierWall(p,t,u,a,C){
 const v=a*env(t,.05,.3,1.85);p.ellipse(77,1,43,7,C[3],v*.6);
 for(let j=0;j<5;j++){let x=39+j*16,h=(49+j%2*17)*s(t,.18+j*.1,.65+j*.1);p.poly([[x,0],[x-2,-h+8],[x+4,-h],[x+15,-h+3],[x+17,0]],C[2],v);p.poly([[x+4,-h],[x+13,-h+5],[x+13,-3],[x+5,-6]],C[4],v);p.tri(x-2,-h+8,x+4,-h,x+15,-h+3,C[6],v);p.polyline([[x+6,-h+13],[x+10,-h+23],[x+6,-h+30],[x+11,-h+39]],C[1],v);p.beam(x+3,-h+10,x+3,-8,2,C[5],v);let y=-h+(t*25+j*9)%Math.max(1,h);p.line(x+5,y,x+12,y-4,C[6],v*.7);}
}
function blizzard(p,t,u,a,C){
 const v=a*env(t,.05,.5,1.85);for(let j=0;j<6;j++){let x=46+j*12,y=-94+Math.sin(t*3+j)*4;p.ellipse(x,y,18,12,C[1+j%2],v);p.ellipse(x,y-4,15,7,C[3],v*.7);p.line(x-9,y-7,x+7,y-9,C[5],v*.5);}
 p.ellipse(79,0,38,8,C[3],v*s(t,.5,1.6));p.ellipse(79,-2,29,4,C[5],v*.6);
 for(let j=0;j<32;j++){let x=43+(j*23+t*15)%70,y=-79+(j*19+t*76)%76;crystal(p,x,y,2+j%2,4+j%4,C,v*.8);p.line(x-2,y-7,x+2,y-13,C[4],v*.5);}
}
function iceAegis(p,t,u,a,C){
 const v=a*env(t,.02,.5,1.85),q=s(t,.1,.6),pts=[[-29,-6],[-32,-43],[-15,-63],[11,-65],[34,-46],[38,-9],[13,8],[-12,8],[-29,-6]];
 for(let j=1;j<pts.length;j++){let [x,y]=pts[j-1],[X,Y]=pts[j];p.beam(x*q,y*q,X*q,Y*q,7,C[2],v);p.beam(x*q,y*q,X*q,Y*q,3,C[5],v);p.line(x*q,y*q,X*q,Y*q,C[6],v*.8);}
 for(let j=0;j<7;j++){let z=t*1.2+j*6.28/7;crystal(p,3+Math.cos(z)*34,-28+Math.sin(z)*34,4,7,C,v);}
 p.glow(3,-62,12,C[5],v*.2);for(let j=0;j<5;j++)p.ellipse(-25+j*14,9+Math.sin(t*3+j)*2,8,3,C[3],v*.35);
}
function frozenPrison(p,t,u,a,C){
 const v=a*env(t,.05,.35,1.85),h=65*s(t,.25,.85);p.ellipse(82,1,30,9,C[2],v);p.ellipse(82,0,25,5,C[4],v);p.ellipse(82,0,19,3,C[1],v);
 for(let j=0;j<7;j++){let z=j*6.28/7,x=82+Math.cos(z)*25,y=Math.sin(z)*6;p.beam(x,y,x,-h+y,7,C[2],v);p.beam(x-1,y,x-1,-h+y,3,C[5],v);crystal(p,x,-h+y,4,8,C,v);p.line(x+2,-h+y+10,x+2,y-8,C[6],v*.7);}
 p.ellipse(82,-h,27,7,C[3],v);p.ellipse(82,-h-2,20,3,C[5],v);for(let j=0;j<8;j++){let z=j*.785+t*.25;p.line(82+Math.cos(z)*32,Math.sin(z)*10,82+Math.cos(z)*27,Math.sin(z)*8,C[6],v);}
}
function cometFall(p,t,u,a,C){
 const q=s(t,.25,1.12),v=a*env(t,.04,.25,1.3),x=49+q*44,y=-94+q*79;
 if(t<1.15){for(let j=0;j<3;j++){p.beam(x-18-j*6,y-26+j*3,x,y,12-j*3,C[2+j],v*.8);}p.glow(x,y,20,C[4],v*.25);crystal(p,x,y,12,18,C,v);p.tri(x-5,y-12,x+8,y-2,x,y+6,C[6],v);}
 const h=a*s(t,1.02,1.18)*(1-s(t,1.65,2.38)),d=s(t,1.1,1.9);p.ellipse(93,0,15+23*d,8,C[2],h);p.ellipse(93,-2,10+17*d,4,C[5],h);p.glow(93,-8,25,C[5],h*.25);for(let j=0;j<12;j++){let z=j*2.4;crystal(p,93+Math.cos(z)*(8+25*d),-8-Math.abs(Math.sin(z))*35*d+15*d*d,4,8,C,h);}
}
function absoluteRay(p,t,u,a,C){
 const v=a*env(t,.1,.55,1.8),x=29+90*s(t,.3,.75),w=18*s(t,.15,.6);p.glowLine(30,-29,x,-29,15,C[4],v*.2);p.beam(30,-29,x,-29,w+6,C[1],v);p.beam(30,-29,x,-29,w,C[3],v);p.beam(30,-29,x,-29,w*.55,C[5],v);p.beam(30,-29,x,-29,3,C[6],v);
 for(let j=0;j<9;j++){let X=32+(j*13+t*48)%85;if(X>x)continue;let y=-29+Math.sin(X*.12-t*9)*9;crystal(p,X,y,4,6,C,v);p.line(X-5,y,X+4,y,C[6],v);}
 p.ellipse(x,-29,8,19,C[4],v*.7);p.ellipse(x,-29,4,12,C[6],v);for(let j=0;j<6;j++)crystal(p,115+(j%2)*8,-53+j*9,3,5,C,v*.7);
}
export const choreography=[iceLance,freezingNova,glacierWall,blizzard,iceAegis,frozenPrison,cometFall,absoluteRay];
