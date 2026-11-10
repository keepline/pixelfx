import { Particles, Lights, P, Rng, fit, smooth, TAU, sparkle, READY } from '../../core/index.js';
export const LEAF=['#071b17','#123d2c','#226345','#39965c','#71ca76','#b9ecac','#efffe4'];
export const GOLD=['#201b12','#514025','#856832','#b9954b','#dfbd71','#f5dfa6','#fff9df'];
export const MOON=['#101e29','#28434d','#486b74','#75979d','#acc5c6','#dae9e5','#f6ffff'];
export const KIT=['#0b211e','#204c38','#39865b','#78bc78','#ddc781','#dcece0','#f8fff2'];
export const envelope=(t,d)=>smooth(0,.12,t)*(1-smooth(d-.6,d,t));
export function ring(p,x,y,r,C,a){p.ellipse(x,y,r,r*.22,C[4],a*.12);p.glowRing(x,y,r,2,C[4],a*.15);}
export function leaf(p,x,y,a,C,k=1){p.line(x-3*Math.cos(a),y-3*Math.sin(a),x+3*Math.cos(a),y+3*Math.sin(a),C[4],k);p.line(x,y,x+2*Math.cos(a+1),y+2*Math.sin(a+1),C[3],k);}
export function glint(p,x,y,C,k){sparkle(p,x,y,3*k,C[6],C[4],k);}
export function bowAct(hits,retreat=false,ultimate=false){const b={...READY,weapon:'bow',two:true,sa:0,fx:12,fy:-24,bx:-5,by:-24,pull:1,nocked:true};return {target:{x:88},poses:[[-.25,{...b,lean:-3}],[.18,b],[.28,{...b,pull:0,nocked:false,lean:4},'snap'],[.55,{...b,x:retreat?-28:0,lean:retreat?-5:2,ghost:retreat?1:0}],[1.3,{...READY,weapon:'bow',x:retreat?-28:0}]],hits:hits.map(t=>({t,stop:ultimate?.14:.045,shake:.13,amp:ultimate?3:1,push:2,straw:10})),dust:[{t:.3,x:0,n:12,dir:retreat?1:-1}]};}

export function charge(p,t,C){if(t>.3)return;const k=1-smooth(.23,.3,t);p.glow(12,-24,33,C[3],.5*k);for(let j=0;j<12;j++){const a=j*TAU/12+t*5,r=28*(1-(t/.3)) + 4;const x=12+Math.cos(a)*r,y=-24+Math.sin(a)*r;p.line(x,y,12+Math.cos(a)*r*.5,-24+Math.sin(a)*r*.5,C[j%3===0?5:3],k);leaf(p,x,y,a,C,k);}glint(p,12,-24,C,k*2);}
export function ribbon(p,x,y,len,dy,t,C,k=1){p.glowLine(x-len,y-dy,x,y,12,C[3],k*.35);for(let j=-3;j<=3;j++){const pts=[];for(let z=0;z<=30;z++){const u=z/30;pts.push([x-len*u,y-dy*u+Math.sin(u*9-t*20+j)*Math.sin(u*Math.PI)*6+j*.8]);}p.polyline(pts,C[j===0?6:Math.abs(j)===3?4:3],k);}p.line(x-12,y-dy*12/len,x+4,y,C[6],k);p.line(x+4,y,x-3,y-4,C[5],k);p.line(x+4,y,x-3,y+4,C[5],k);for(let j=1;j<7;j++)leaf(p,x-len*j/7,y-dy*j/7+Math.sin(j+t*9)*8,j+t,C,k);}
export function bloom(p,t,start,x,y,C,seed){const age=t-start;if(age<0||age>1.2)return;const k=1-smooth(.35,1.2,age),r=new Rng(seed);p.glow(x,y,45,C[3],k*.5);p.glow(x,0,44,C[3],k*.3);p.arc(x,y,4+age*28,2,0,TAU,C[4],k*.6);for(let j=0;j<36;j++){const a=r.range(0,TAU),v=r.range(15,62),xx=x+Math.cos(a)*v*age,yy=Math.min(8,y+Math.sin(a)*v*age+6*age*age);if(j%3===0)leaf(p,xx,yy,a+age*3,C,k);else {p.line(xx,yy,xx-Math.cos(a)*4,yy-Math.sin(a)*4,C[j%2?5:4],k);if(j%5===0)glint(p,xx,yy,C,k);}}}
