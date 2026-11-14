import {smooth} from './camera-path.js';
// Local axes: right, up, toward the front of the guitar. Sketchfab uses Z up.
const center=[-.096463745,.216195584,.623559663];
const right=[.8613,.5081,0],front=[.5081,-.8613,0];
const keys=[
 {t:0,at:[-.78,0,0],distance:4.9,yaw:0},
 {t:4,at:[-.55,.22,0],distance:4.5,yaw:-.06},
 {t:7,at:[-.22,-.65,0],distance:2.9,yaw:.10},
 // Jack surface picked through official API: [.12217,-.05560,.12412].
 {t:9,at:[-.093,-.762,.627],distance:1.45,yaw:.24},
 {t:12.3,at:[-.093,-.762,.627],distance:.8,yaw:.20},
 {t:22.5,at:[-.78,0,0],distance:4.9,yaw:-.05},
 {t:28,at:[-.78,0,0],distance:4.9,yaw:0}
];
const mix=(a,b,p)=>a+(b-a)*p;
export function varinPose(t,{manual=false,mobile=false,still=null}={}){
 let k;
 if(manual)k={at:[mobile?0:-.78,0,0],distance:4.9,yaw:0};
 else if(still)k=still==='neck'?{at:[0,1.1,0],distance:2.4,yaw:0}:still==='body'?{at:[0,-.85,0],distance:2.3,yaw:.1}:still==='jack'?{at:[-.093,-.762,.627],distance:1.1,yaw:.2}:keys[0];
 else{
  t=Math.max(0,Math.min(28,t));
  const found=keys.findIndex((key,i)=>i<keys.length-1&&t>=key.t&&t<keys[i+1].t);
  const n=found<0?keys.length-2:found;
  const a=keys[n],b=keys[n+1],p=smooth((t-a.t)/(b.t-a.t));
  k={at:a.at.map((v,i)=>mix(v,b.at[i],p)),distance:mix(a.distance,b.distance,p),yaw:mix(a.yaw,b.yaw,p)};
 }
 const at=[...k.at];
 if(mobile&&!manual&&!still&& (t<7||t>=22.5))at[0]*=t>=22.5?0:Math.min(1,smooth(t/7));
 at[0]*=.75;at[1]*=.55;at[2]*=.55;
 const target=center.map((v,i)=>v+right[i]*at[0]+(i===2?at[1]:0)+front[i]*at[2]);
 const position=target.map((v,i)=>v+k.distance*.55*(front[i]*Math.cos(k.yaw)+right[i]*Math.sin(k.yaw))+(i===2?.033:0));
 return{position,target,fov:42};
}
