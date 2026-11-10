import {createFrame,painterFor} from './fx.js';
import {choreography as knight} from './medieval/knight.js';
import {choreography as mage} from './medieval/mage.js';
import {choreography as assassin} from './medieval/assassin.js';
import {choreography as dwarf} from './medieval/dwarf.js';
const kits=[knight,mage,assassin,dwarf];
// Shared pure pixel characters and choreography. No mutable frame state.
import {fit} from './color.js';
import {smooth} from './math.js';
export const phases=['anticipation','release','sustain','recovery'];
export const palettes=[['#171827','#36465c','#7289a0','#c1d6df','#c49b42','#ffe9a1','#ffffff'],['#0c142b','#152b59','#285b91','#51a9cd','#8adeef','#c5faff','#ffffff'],['#210f22','#491728','#85263d','#cb4353','#ed857b','#f9c5ad','#ffffff'],['#231c25','#503332','#985735','#c18a4d','#e7b66e','#ffe0a0','#ffffff']];
const recipes=[
 [['slash',-5,3,-17,-16,26,-12,-24,-8,38,2],['bash',8,5,8,-24,15,-30,25,-24,20,-52],['charge',14,9,-9,-16,27,-22,-18,-12,57,-22],['kneel',-3,18,-12,-6,10,-7,-18,-3,15,0],['guard',-6,5,-4,-35,12,-28,-10,-48,16,-54],['judgment',-5,2,-17,-42,8,-48,-22,-60,8,-72],['throw',9,4,-13,-22,32,-38,-20,-28,49,-44],['invoke',0,1,-25,-47,25,-47,-33,-64,33,-64]],
 [['point',7,3,28,-28,15,-22,43,-28,18,-55],['ground',-7,17,-18,-4,12,-8,-25,0,22,-20],['raise',-4,2,-23,-42,17,-51,-29,-58,18,-70],['overhead',5,4,-9,-55,12,-56,-18,-72,21,-73],['guard',-8,7,-17,-26,23,-31,-25,-35,28,-59],['cage',3,10,-27,-18,29,-18,-35,-30,35,-41],['comet',-10,2,-22,-52,27,-39,-34,-68,40,-55],['channel',12,8,29,-23,29,-32,48,-23,48,-32]],
 [['crossed',2,5,14,-29,-14,-29,-17,-46,17,-46],['crouch-backstab',16,21,-22,-8,30,-15,-34,-4,48,-15],['toss',-7,8,-24,-13,21,-44,-32,-8,29,-57],['throw',10,3,-20,-32,34,-27,-30,-40,53,-27],['stab',18,13,24,-12,35,-21,42,-12,55,-21],['dash',22,17,-28,-18,12,-8,-43,-12,29,-5],['pull',-12,10,19,-26,24,-33,37,-28,44,-37],['execute',-4,4,-18,-54,19,-53,-24,-72,27,-70]],
 [['slam',8,17,17,-7,25,-4,30,0,43,0],['toss',-6,5,-20,-19,23,-46,-29,-14,32,-58],['recoil',-13,9,16,-24,25,-23,35,-24,48,-23],['place',11,19,-9,-3,24,-2,-15,0,34,0],['dash',19,12,-24,-25,17,-17,-37,-31,33,-13],['trap',-8,20,-23,-4,14,-8,-34,0,23,-2],['brace',-10,12,13,-31,24,-34,29,-40,43,-42],['signal',2,3,-20,-20,13,-56,-31,-16,16,-74]]
];
export function poseOf(k,n,t){
 const [name,...v]=recipes[k][n],u=smooth(.12,.65,t)*(1-smooth(1.25,2.4,t));
 const idle=[0,0,-13,-22,15,-25,-18,-34,19,-49];
 const values=v.map((x,i)=>idle[i]+(x-idle[i])*u);
 const [lean,crouch,leftHandX,leftHandY,rightHandX,rightHandY,leftWeaponX,leftWeaponY,rightWeaponX,rightWeaponY]=values;
 return {name:['knight','mage','assassin','dwarf'][k]+'-'+name,lean,crouch,leftHandX,leftHandY,rightHandX,rightHandY,leftWeaponX,leftWeaponY,rightWeaponX,rightWeaponY,x:Math.round(((k===0&&n===2)?40*smooth(.18,.8,t):(k===3&&n===4)?40*smooth(.12,1.1,t):(k===2&&n===1)?(t>=.5?68:0):(k===2&&n===5)?65*smooth(.12,1.05,t):0)*(1-smooth(1.55,2.3,t))),y:0,alpha:k===2&&n===1&&t>.28&&t<.5?0:1};
}
export function character(p,t,k,C,pose=poseOf(k,0,t)){
 const x=pose.x,y=pose.y,wide=k===3?13:9;
 const breath=(t<.12||t>2.3)?Math.round(Math.sin(t*18)):0;
 const point=(a,b)=>[x+a+pose.lean*Math.max(0,-b)/40,y+b*(k===3?.8:1)+pose.crouch*Math.max(0,-b)/40+(b< -8?breath:0)];
 const r=(a,b,w,h,c)=>{const [xx,yy]=point(a,b);p.rect(xx,yy,w,Math.max(1,h*(k===3?.8:1)),C[c]);};
 const poly=(v,c)=>p.poly(v.map(([a,b])=>point(a,b)),C[c]);
 if(k===1||k===2)poly([[-10,-30],[-18-breath,-3],[13+breath,-3],[9,-30]],1);
 r(-wide,-29,wide*2,23,0);r(-wide+2,-28,wide*2-4,18,2);r(-wide+3,-27,4,15,3);
 r(-8,-8,6,8,1);r(3,-8,7,8,1);r(-10,-2,9,3,0);r(2,-2,10,3,0);
 r(-wide,-11,wide*2,3,1);r(-2,-12,5,4,4);
 if(k===1){poly([[-8,-29],[-13,-4],[13,-4],[7,-29]],1);r(-6,-39,13,12,0);r(-4,-37,9,8,2);r(-2,-34,6,3,5);for(let j=0;j<3;j++)r(-7+j*6,-22,1,16,3);}
 else if(k===2){poly([[-12,-31],[-4,-45],[8,-40],[12,-29]],1);r(-7,-36,16,7,0);r(-4,-34,3,1,5);r(3,-34,3,1,5);}
 else {r(-7,-40,16,12,0);r(-6,-39,14,10,k===0?3:2);
 if(k===0){r(-5,-35,12,3,1);r(-1,-39,2,10,4);r(-9,-30,20,3,4);r(-13,-29,8,6,3);r(7,-29,8,6,3);}
 else {r(-12,-35,23,4,1);r(-9,-36,7,6,5);r(1,-36,7,6,5);r(-7,-35,3,3,3);r(3,-35,3,3,3);poly([[-8,-28],[9,-28],[5,-17],[-2,-13]],4);r(-3,-27,2,10,5);}}
 for(const side of ['left','right']){
 const hx=x+pose[side+'HandX'],hy=y+pose[side+'HandY'],wx=x+pose[side+'WeaponX'],wy=y+pose[side+'WeaponY'];
 const [sx,sy]=point(side==='left'?-wide:wide,-25),ex=(sx+hx)/2+(side==='left'?-4:4),ey=(sy+hy)/2+5;
 p.beam(sx,sy,ex,ey,k===3?7:5,C[0]);p.beam(ex,ey,hx,hy,k===3?6:4,C[2]);p.rect(hx-2,hy-2,5,5,C[3]);
 const dx=wx-hx,dy=wy-hy,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
 if(k===0&&side==='left'){
 const cx=hx+dx*.15,cy=hy+dy*.15;
 const shield=(scale,c)=>p.poly([[-9,-12],[8,-12],[10,2],[0,13],[-10,2]].map(([a,b])=>[cx+a*scale,cy+b*scale]),C[c]);
 shield(1,0);shield(.88,4);shield(.68,3);p.beam(cx,cy-6,cx,cy+6,2,C[5]);
 }else if(k===1&&side==='left'){
 p.beam(hx,hy,wx,wy,1,C[4]);p.rect(hx-3,hy-5,2,4,C[5]);p.dot(wx-3,wy-2,C[6]);p.dot(wx+3,wy+2,C[5]);
 }else if(k===3&&side==='left'){p.rect(hx-3,hy-3,6,6,C[1]);p.beam(hx,hy,wx,wy,2,C[2]);}
 else if(k===1){
 p.beam(hx-dx*.65,hy-dy*.65,wx,wy,4,C[1]);p.beam(hx-dx*.65+1,hy-dy*.65,wx+1,wy,1,C[2]);p.beam(wx-nx*5,wy-ny*5,wx+nx*5,wy+ny*5,3,C[4]);
 p.poly([[wx,wy-9],[wx+5,wy],[wx,wy+6],[wx-5,wy]],C[4]);p.beam(wx,wy-6,wx,wy+2,2,C[6]);
 }else if(k===3){p.beam(hx,hy,wx,wy,5,C[1]);p.beam(hx,hy,wx,wy,2,C[4]);p.poly([[wx-11,wy-7],[wx+9,wy-7],[wx+12,wy-3],[wx+12,wy+6],[wx-11,wy+6]],C[0]);p.rect(wx-10,wy-6,20,11,C[2]);p.rect(wx-8,wy-5,16,3,C[5]);p.rect(wx-8,wy-1,16,5,C[3]);}
 else {
 const reach=k===0?Math.max(1,29/len):1;
 p.beam(hx,hy,hx+dx*reach,hy+dy*reach,k===0?4:3,C[3]);p.beam(hx,hy,hx+dx*reach,hy+dy*reach,1,C[6]);p.beam(hx-nx*5,hy-ny*5,hx+nx*5,hy+ny*5,3,C[k===0?4:2]);
 }
 }

}
export function skill(p,t,o,k,n){if(t<0||t>=2.4)return;const C=fit(o.palette,7),start=.18+n*.025+k*.015,u=smooth(start,start+.26+n*.025,t),a=smooth(0,.12,t)*(1-smooth(1.55+n*.04,2.4,t));if(t>=start)kits[k][n](p,t,u,a,C);}

// Raster descriptors are generated by the same painter used for display.
export function medievalActor(k,t=0,C=palettes[k],n=0){
 const pose=poseOf(k,n,t),f=createFrame(256,224);if(pose.alpha)character(painterFor(f).place(100,160),t,k,fit(C,7),pose);
 let l=256,r=-1,top=224,b=-1;f.color.forEach((c,i)=>{if(c){l=Math.min(l,i%256);r=Math.max(r,i%256);top=Math.min(top,Math.floor(i/256));b=Math.max(b,Math.floor(i/256));}});
 if(r<0){l=100;r=100;top=160;b=160;}
 const w=r-l+1,h=b-top+1,pixels=new Uint32Array(w*h);for(let yy=0;yy<h;yy++)pixels.set(f.color.subarray((top+yy)*256+l,(top+yy)*256+l+w),yy*w);
 return {identity:['templar','frost-mage','crimson-assassin','dwarf-artificer'][k],x:l-100,y:top-160,w,h,head:[pose.x+pose.lean,pose.y-40*(k===3?.8:1)+pose.crouch+((t<.12||t>2.3)?Math.round(Math.sin(t*18)):0)],chest:[pose.x+pose.lean*.6,pose.y-24*(k===3?.8:1)+pose.crouch*.6],alpha:pose.alpha,pixels,mask:{w,h,data:Uint8Array.from(pixels,c=>c?1:0)},draw(p,a=1){for(let i=0;i<pixels.length;i++)if(pixels[i])p.dot(i%w+l-100,Math.floor(i/w)+top-160,pixels[i],a*pose.alpha);}};
}
export function actorFactory(k,n){return o=>{const actor=medievalActor(k,0,o.palette,n);actor.setTime=t=>Object.assign(actor,medievalActor(k,t,o.palette,n));return actor;};}
