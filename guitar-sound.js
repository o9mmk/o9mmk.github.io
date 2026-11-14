import {CHORD,strumEvents,stringSamples,distortionCurve} from './strum-audio.js';

export class GuitarSound{
 constructor(){this.context=null;this.buffers=[];this.groups=[];this.muted=false;}
 setMuted(muted){this.muted=muted;if(this.master)this.master.gain.setTargetAtTime(muted?0:.8,this.context.currentTime,.018);}
 initialize(){
  const c=this.context=new AudioContext(),high=c.createBiquadFilter(),body=c.createBiquadFilter(),low=c.createBiquadFilter();
  high.type='highpass';high.frequency.value=90;
  body.type='peaking';body.frequency.value=950;body.Q.value=.7;body.gain.value=4;
  low.type='lowpass';low.frequency.value=3800;low.Q.value=.6;
  const drive=c.createGain(),amp=c.createWaveShaper(),output=c.createGain();
  drive.gain.value=8;amp.curve=distortionCurve();amp.oversample='4x';output.gain.value=.22;
  this.input=high;high.connect(body).connect(drive).connect(amp).connect(low).connect(output);
  const compressor=c.createDynamicsCompressor();compressor.threshold.value=-16;compressor.knee.value=12;compressor.ratio.value=3;compressor.attack.value=.008;compressor.release.value=.22;
  this.master=c.createGain();this.master.gain.value=this.muted?0:.8;
  output.connect(compressor);compressor.connect(this.master).connect(c.destination);
  const room=c.createConvolver(),impulse=c.createBuffer(2,Math.round(c.sampleRate*.8),c.sampleRate);
  for(let ch=0;ch<2;ch++){
   const a=impulse.getChannelData(ch);let seed=9127+ch*4147;
   for(let i=Math.round(c.sampleRate*.018);i<a.length;i++){seed=(seed*16807)%2147483647;a[i]=(seed/2147483647*2-1)*Math.exp(-i/c.sampleRate*9);}
  }
  room.buffer=impulse;const wet=c.createGain();wet.gain.value=.07;output.connect(room).connect(wet).connect(compressor);
 }
 async strum(direction='down'){
  if(!this.context)this.initialize();const c=this.context;await c.resume();
  if(c.state!=='running')throw Error('Audio output is not running');
  if(!this.buffers.length)this.buffers=CHORD.map((hz,i)=>{
   const samples=stringSamples(hz,c.sampleRate,i),buffer=c.createBuffer(1,samples.length,c.sampleRate);buffer.copyToChannel(samples,0);return buffer;
  });
  const start=c.currentTime+.025,group=c.createGain(),events=strumEvents(direction);group.gain.value=.65;group.connect(this.input);
  // Bound rapid repeated strums, with a short release instead of hard clicks.
  const entry={gain:group,sources:[]};this.groups.push(entry);
  if(this.groups.length>4){const old=this.groups.shift();old.gain.gain.setTargetAtTime(0,start,.025);old.sources.forEach(source=>source.stop(start+.2));}
  let remaining=6;
  for(const event of events){
   const source=c.createBufferSource(),gain=c.createGain();source.buffer=this.buffers[event.string];gain.gain.value=event.level;
   source.connect(gain).connect(group);source.start(start+event.offset);entry.sources.push(source);
   source.onended=()=>{source.disconnect();gain.disconnect();if(--remaining===0){group.disconnect();this.groups=this.groups.filter(item=>item!==entry);}};
  }
  return{events,performanceAt:performance.now()/1000+(start-c.currentTime)};
 }
}
