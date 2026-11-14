import * as T from 'three';
export {JACK,JACK_NORMAL,NUT,SCALE,NOTES,tunerPosition,stringX,fretY} from './guitar-layout.js';
// Outline proportions studied from Fender front photographs; not a CAD replica.
export function bodyOutline(){
 const s=new T.Shape();s.moveTo(-.41,.58);
 s.bezierCurveTo(-.43,.19,-1.1,.25,-1.36,.65);
 s.bezierCurveTo(-1.68,1.06,-1.35,1.57,-1.6,1.54);
 s.bezierCurveTo(-2.04,1.54,-2.17,.76,-2.07,.24);
 s.bezierCurveTo(-2.07,-.39,-1.85,-.93,-1.82,-1.54);
 s.bezierCurveTo(-1.78,-2.18,-2.36,-2.83,-2.44,-3.65);
 s.bezierCurveTo(-2.73,-4.8,-1.52,-5.02,-.1,-5.02);
 s.bezierCurveTo(1.49,-5.02,2.48,-4.86,2.45,-3.78);
 s.bezierCurveTo(2.45,-2.98,1.78,-2.19,1.76,-1.51);
 s.bezierCurveTo(1.71,-.91,2.04,-.3,1.99,.06);
 s.bezierCurveTo(2.12,.68,1.97,1.03,1.72,.6);
 s.bezierCurveTo(1.54,.3,1.72,-.26,1.14,-.29);
 s.bezierCurveTo(.81,-.36,.51,-.34,.41,-.17);
 s.lineTo(.41,.58);s.closePath();return s;
}
export function guardOutline(){
 const s=new T.Shape();s.moveTo(-.42,-.18);s.lineTo(-.64,-.08);
 s.bezierCurveTo(-.94,.12,-.79,-.37,-.75,-.64);
 s.bezierCurveTo(-.53,-1.62,-1.19,-2.17,-1.09,-2.89);
 s.bezierCurveTo(-1.06,-3.19,-.88,-3.34,-.57,-3.3);
 s.lineTo(-.57,-3.08);s.lineTo(.56,-3.08);s.lineTo(.56,-3.32);
 s.bezierCurveTo(1.18,-3.3,1.42,-3.58,1.83,-3.78);
 s.bezierCurveTo(2.3,-3.97,2.04,-3.25,1.78,-2.66);
 s.bezierCurveTo(1.46,-2.02,1.29,-1.81,1.48,-1.2);
 s.bezierCurveTo(1.69,-.56,1.96,-.1,1.86,.36);
 s.bezierCurveTo(1.76,.76,1.67,.18,1.53,-.07);
 s.bezierCurveTo(1.16,-.61,.71,-.57,.42,-.39);
 s.lineTo(.42,-.57);s.lineTo(-.42,-.57);s.closePath();return s;
}
export function headOutline(){
 const s=new T.Shape();s.moveTo(-.304,6.2);
 s.bezierCurveTo(-.31,6.39,-.48,6.42,-.47,6.66);
 s.lineTo(-.16,8.35);s.bezierCurveTo(-.12,8.62,.13,8.73,.38,8.67);
 s.bezierCurveTo(.72,8.62,.84,8.39,.67,8.21);
 s.bezierCurveTo(.57,8.1,.39,8.17,.31,8.12);
 s.bezierCurveTo(.2,8.01,.49,7.48,.55,7.14);
 s.bezierCurveTo(.59,6.9,.36,6.83,.31,6.58);
 s.bezierCurveTo(.29,6.42,.304,6.29,.304,6.2);s.closePath();return s;
}
