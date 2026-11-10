const S=(t,b,e)=>{let v=Math.max(0,Math.min(1,(t-b)/(e-b)));return v*v*(3-2*v);};
const E=(t,b,h,e)=>S(t,b,h)*(1-S(t,h,e));
function cross(p,x,y,r,C,a){p.beam(x-r,y,x+r,y,3,C[5],a);p.beam(x,y-r,x,y+r,3,C[6],a);}
function floor(p,x,y,r,C,a,t){
 for(let j=0;j<3;j++)p.ellipse(x,y,r-j*7,(r-j*7)*.27,C[3+j],(d)=>a*(d>.87?1:.035));
 for(let j=0;j<12;j++){let q=j*Math.PI/6+t*.3,X=x+Math.cos(q)*r*.85,Y=y+Math.sin(q)*r*.23;p.beam(X-2,Y-2,X+2,Y+2,2,C[5],a);}
 p.beam(x-r*.5,y,x+r*.5,y,2,C[5],a);p.beam(x,y-r*.16,x,y+r*.16,2,C[6],a);
}
function shield(p,x,y,w,h,C,a){
 p.poly([[x-w,y],[x,y-5],[x+w,y],[x+w,y+h*.7],[x,y+h],[x-w,y+h*.7]],C[4],a);
 p.poly([[x-w+3,y+3],[x,y],[x+w-3,y+3],[x+w-3,y+h*.66],[x,y+h-5],[x-w+3,y+h*.66]],C[2],a);
 p.poly([[x,y+1],[x+w-4,y+4],[x+w-4,y+h*.65],[x,y+h-6]],C[3],a);
 p.beam(x,y+7,x,y+h-10,3,C[6],a);p.beam(x-w+5,y+16,x+w-5,y+16,3,C[5],a);
}
function holyCleave(p,t,u,a,C){
 let v=S(t,.2,.72),f=a*E(t,.05,.35,1.5),q=-2.1+v*2.6;
 p.glow(58,-35,42,C[4],f*.14);
 for(let j=2;j>=0;j--)p.arc(38,-30,49+j*6,j?3:13,q-1.65-j*.18,q-j*.18,C[j?4:5],f*(j?.55:1));
 p.arc(38,-30,47,4,q-1.4,q,C[6],f);
 let h=a*E(t,.55,.7,1.25);cross(p,88,-22,19,C,h);p.beam(76,-34,100,-10,4,C[5],h);
 for(let j=0;j<9;j++){let z=S(t,.65,1.5);p.rect(48+j*6,-30+j%3*9+z*32,2,4,C[4+j%3],h);}
}
function shieldBash(p,t,u,a,C){
 let v=S(t,.2,.62),f=a*E(t,.02,.22,1.8),x=38+v*28- S(t,1,1.7)*8;
 shield(p,x,-51,15,47,C,f);p.glow(x+10,-25,24,C[4],f*.15);
 let h=a*E(t,.52,.7,1.4);for(let j=0;j<7;j++){let q=-1.2+j*.4,r=18+S(t,.6,1.3)*18;p.tri(79,-27,79+Math.cos(q)*r,-27+Math.sin(q)*r,83+Math.cos(q)*r*.6,-23+Math.sin(q)*r*.6,C[4+j%3],h);}
 for(let j=0;j<4;j++)p.beam(43+j*12,5+j%2*3,65+j*12,5+j%2*3,3,C[4],h);
}
function lanceCharge(p,t,u,a,C){
 let v=S(t,.18,.8),x=35+v*66,f=a*E(t,.08,.3,.95);
 p.poly([[x-42,-33],[x-7,-34],[x+16,-28],[x-7,-22],[x-42,-25]],C[4],f);
 p.beam(x-42,-28,x+5,-28,5,C[6],f);p.tri(x+17,-28,x-3,-33,x-3,-28,C[5],f);
 for(let j=0;j<3;j++)p.arc(x-25,-29,17+j*7,4,-1.8,-.1,C[3+j],f*.7);
 let h=a*E(t,.7,.85,1.6);cross(p,110,-28,17,C,h);p.ring(108,-28,8+S(t,.8,1.6)*15,3,C[5],h);
 for(let j=0;j<5;j++)p.beam(35+j*11,-10+j*5,52+j*11,-10+j*5,3,C[4],h);
}
function consecratedGround(p,t,u,a,C){
 let f=a*E(t,.02,.4,2.35),r=44*S(t,.02,.5);floor(p,62,7,r,C,f,t);
 p.glow(62,3,47,C[4],f*.16);
 for(let j=0;j<9;j++){let q=j*6.283/9+t*.9,x=62+Math.cos(q)*35,y=5+Math.sin(q)*9,h=8+6*(.5+.5*Math.sin(t*5+j));p.beam(x,y,x,y-h,3,C[5],f*.7);p.dot(x,y-h-3,C[6],f);}
}
function guardianRampart(p,t,u,a,C){
 let f=a*E(t,.02,.45,2.35);
 for(let j=0;j<4;j++){let rise=S(t,.1+j*.09,.65+j*.09),x=43+j*23,y=4-rise*(54+j%2*8);shield(p,x,y,10,54,C,f*rise);p.glow(x,y+12,14,C[4],f*.12);cross(p,x+Math.sin(t*4+j)*7,y+9+((t*17+j*11)%30),3,C,f*.7);}
 p.beam(43,-27,112,-27,5,C[4],f*.6);p.beam(43,-27,112,-27,2,C[6],f*.7);floor(p,77,10,42,C,f*.6,t);
}
function judgmentPillar(p,t,u,a,C){
 let warning=a*E(t,.02,.3,.7);floor(p,77,4,35,C,warning,t);
 let f=a*E(t,.35,.58,1.95),w=18*(1-S(t,.85,1.95));
 p.glowLine(77,-115,77,-3,24,C[4],f*.3);p.beam(77,-119,77,-1,w+10,C[3],f*.6);p.beam(77,-119,77,-1,w,C[5],f);p.beam(77,-119,77,-1,w*.42,C[6],f);
 for(let j=0;j<6;j++){let x=47+j*12;p.tri(77,-5,x,-104+j%2*18,x+4,-67,C[4],f*.4);}
 floor(p,77,5,40,C,a*E(t,.4,.65,2.15),t);for(let j=0;j<8;j++){let q=j*.785;p.beam(77+Math.cos(q)*19,5+Math.sin(q)*6,77+Math.cos(q)*38,5+Math.sin(q)*12,3,C[5],f);}
}
function orbitingHammer(p,t,u,a,C){
 let v=S(t,.12,1.65),q=-2.4+v*7.5,x=69+Math.cos(q)*32,y=-46+Math.sin(q)*24,f=a*E(t,.02,.28,1.85);
 p.arc(69,-46,34,7,q-1.5,q,C[4],f*.7);p.arc(69,-46,32,3,q-1.3,q,C[6],f);
 const point=(X,Y)=>[x+X*Math.cos(q)-Y*Math.sin(q),y+X*Math.sin(q)+Y*Math.cos(q)];
 p.beam(...point(0,0),...point(0,24),5,C[2],f);p.beam(...point(0,4),...point(0,21),2,C[5],f);
 p.poly([point(-14,-8),point(14,-8),point(14,7),point(-14,7)],C[4],f);p.poly([point(-11,-5),point(10,-5),point(10,3),point(-11,3)],C[2],f);p.beam(...point(-11,-5),...point(10,-5),3,C[6],f);
 for(let j=0;j<6;j++){let z=j*1.047;cross(p,69+Math.cos(z)*43,-46+Math.sin(z)*31,3,C,f*.6);}
 let h=a*E(t,1.55,1.72,2.3);cross(p,x,y,21,C,h);p.ring(x,y,9+S(t,1.65,2.3)*15,3,C[5],h);
}
function angelicDescent(p,t,u,a,C){
 let v=S(t,.05,.95),y=-88+v*47,f=a*E(t,.02,.35,2.35);
 p.glow(70,y,36,C[5],f*.19);
 for(let side of [-1,1])for(let j=5;j>=0;j--){let reach=24+j*4,tip=y-32+j*7+Math.sin(t*3+j)*2;p.poly([[70+side*7,y-3],[70+side*reach,tip],[70+side*(reach-3),tip+14],[70+side*12,y+15]],C[3+j%3],f);p.beam(70+side*13,y,70+side*(reach-3),tip+3,2,C[6],f*.7);}
 p.poly([[65,y-6],[75,y-6],[82,y+31],[70,y+23],[58,y+31]],C[4],f);p.poly([[68,y-4],[72,y-4],[75,y+22],[65,y+22]],C[6],f);p.circle(70,y-14,6,C[5],f);p.ellipse(70,y-25,12,4,C[6],d=>f*(d>.65?1:0));
 let h=a*S(t,.65,1)* (1-S(t,1.65,2.35));floor(p,70,6,42,C,h,t);
 for(let j=0;j<7;j++){let x=40+j*10;p.beam(x,y+22,x,1,2,C[5],h*.35);p.circle(x,5-((t*20+j*7)%34),1.5,C[6],h);}
}
export const choreography=[holyCleave,shieldBash,lanceCharge,consecratedGround,guardianRampart,judgmentPillar,orbitingHammer,angelicDescent];
