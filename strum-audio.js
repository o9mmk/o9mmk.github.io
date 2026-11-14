// Open Em (022000): E2 B2 E3 G3 B3 E4.
export const CHORD=[82.406889,123.470825,164.813778,195.997718,246.941651,329.627557];
export function distortionCurve(){const curve=new Float32Array(4096);for(let i=0;i<curve.length;i++){const x=i/(curve.length-1)*2-1;curve[i]=Math.tanh(8*x)/Math.tanh(8);}return curve;}
export function strumEvents(direction='down'){
 const order=direction==='up'?[5,4,3,2,1,0]:[0,1,2,3,4,5];
 return order.map((string,i)=>({string,frequency:CHORD[string],offset:i*.018,level:[.93,.86,.82,.78,.73,.68][string]}));
}
export function stringSamples(frequency,sampleRate,voice=0){
 if(!(frequency>0&&sampleRate>=8000))throw Error('Invalid string synthesis parameters');
 const delay=sampleRate/frequency-.5,n=Math.ceil(delay)+2,ring=new Float32Array(n),excitation=new Float32Array(n);
 let seed=149+voice*7919;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647*2-1;};
 for(let i=0;i<n;i++)excitation[i]=random();
 const pick=Math.max(1,Math.round(n*.17));let mean=0;
 for(let i=0;i<n;i++){ring[i]=(excitation[i]-excitation[(i+pick)%n])*.32;mean+=ring[i]/n;}
 for(let i=0;i<n;i++)ring[i]-=mean;
 const data=new Float32Array(Math.round(sampleRate*4.8)),feedback=10**(-3/(frequency*5.8));
 let previous=0,dcIn=0,dcOut=0;
 for(let i=0;i<data.length;i++){
  const write=i%n,pos=(write-delay+n)%n,a=Math.floor(pos),fraction=pos-a;
  const sample=ring[a]*(1-fraction)+ring[(a+1)%n]*fraction;
  const filtered=(sample+previous)*.5*feedback;previous=sample;ring[write]=filtered;
  const high=filtered-dcIn+.997*dcOut;dcIn=filtered;dcOut=high;
  const attack=Math.min(1,i/(sampleRate*.0015)),fade=Math.min(1,(data.length-i)/(sampleRate*.08));
  data[i]=high*attack*fade;
 }
 return data;
}
