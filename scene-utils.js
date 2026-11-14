import * as T from 'three';
import{mergeGeometries}from'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/utils/BufferGeometryUtils.js';
export function batchStaticMeshes(root){
 root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert(),batches=new Map(),originals=[];
 root.traverse(o=>{if(!o.isMesh||o.isInstancedMesh)return;const m=o.material;let b=batches.get(m);if(!b){b=[];batches.set(m,b);}const matrix=new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld);let geo=o.geometry.clone();if(geo.index){const expanded=geo.toNonIndexed();geo.dispose();geo=expanded;}b.push(geo.applyMatrix4(matrix));originals.push(o);});
 for(const[material,geometries]of batches){const geometry=mergeGeometries(geometries);if(!geometry)throw new Error('Static geometry merge failed');const object=new T.Mesh(geometry,material);object.castShadow=true;object.receiveShadow=true;root.add(object);geometries.forEach(g=>g.dispose());}
 originals.forEach(o=>{o.removeFromParent();o.geometry.dispose();});
}
