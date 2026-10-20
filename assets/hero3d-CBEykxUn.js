import{T as Et,V as g,a as N,W as Gt,S as Yt,b as Dt,P as Nt,G as yt,l as It,B as wt,c as At,C as kt,d as Ht,e as G,A as jt,f as qt,M as Ut,R as Jt,g as Kt,D as Qt,h as Zt,i as $t,j as te,r as ee,s as ie,k as oe,m as re}from"./gyro-CYkREfcx.js";import{g as ae}from"./main-DrtdfgrQ.js";const d=new Et,Y=new g,xt=new N,Mt=new N,St=new N;class ne{constructor(e){this.geometry=e.geometry,this.randomFunction=Math.random,this.indexAttribute=this.geometry.index,this.positionAttribute=this.geometry.getAttribute("position"),this.normalAttribute=this.geometry.getAttribute("normal"),this.colorAttribute=this.geometry.getAttribute("color"),this.uvAttribute=this.geometry.getAttribute("uv"),this.weightAttribute=null,this.distribution=null}setWeightAttribute(e){return this.weightAttribute=e?this.geometry.getAttribute(e):null,this}build(){const e=this.indexAttribute,n=this.positionAttribute,c=this.weightAttribute,u=e?e.count/3:n.count/3,f=new Float32Array(u);for(let l=0;l<u;l++){let s=1,r=3*l,h=3*l+1,b=3*l+2;e&&(r=e.getX(r),h=e.getX(h),b=e.getX(b)),c&&(s=c.getX(r)+c.getX(h)+c.getX(b)),d.a.fromBufferAttribute(n,r),d.b.fromBufferAttribute(n,h),d.c.fromBufferAttribute(n,b),s*=d.getArea(),f[l]=s}const i=new Float32Array(u);let o=0;for(let l=0;l<u;l++)o+=f[l],i[l]=o;return this.distribution=i,this}setRandomGenerator(e){return this.randomFunction=e,this}sample(e,n,c,u){const f=this._sampleFaceIndex();return this._sampleFace(f,e,n,c,u)}_sampleFaceIndex(){const e=this.distribution[this.distribution.length-1];return this._binarySearch(this.randomFunction()*e)}_binarySearch(e){const n=this.distribution;let c=0,u=n.length-1,f=-1;for(;c<=u;){const i=Math.ceil((c+u)/2);if(i===0||n[i-1]<=e&&n[i]>e){f=i;break}else e<n[i]?u=i-1:c=i+1}return f}_sampleFace(e,n,c,u,f){let i=this.randomFunction(),o=this.randomFunction();i+o>1&&(i=1-i,o=1-o);const l=this.indexAttribute;let s=e*3,r=e*3+1,h=e*3+2;return l&&(s=l.getX(s),r=l.getX(r),h=l.getX(h)),d.a.fromBufferAttribute(this.positionAttribute,s),d.b.fromBufferAttribute(this.positionAttribute,r),d.c.fromBufferAttribute(this.positionAttribute,h),n.set(0,0,0).addScaledVector(d.a,i).addScaledVector(d.b,o).addScaledVector(d.c,1-(i+o)),c!==void 0&&(this.normalAttribute!==void 0?(d.a.fromBufferAttribute(this.normalAttribute,s),d.b.fromBufferAttribute(this.normalAttribute,r),d.c.fromBufferAttribute(this.normalAttribute,h),c.set(0,0,0).addScaledVector(d.a,i).addScaledVector(d.b,o).addScaledVector(d.c,1-(i+o)).normalize()):d.getNormal(c)),u!==void 0&&this.colorAttribute!==void 0&&(d.a.fromBufferAttribute(this.colorAttribute,s),d.b.fromBufferAttribute(this.colorAttribute,r),d.c.fromBufferAttribute(this.colorAttribute,h),Y.set(0,0,0).addScaledVector(d.a,i).addScaledVector(d.b,o).addScaledVector(d.c,1-(i+o)),u.r=Y.x,u.g=Y.y,u.b=Y.z),f!==void 0&&this.uvAttribute!==void 0&&(xt.fromBufferAttribute(this.uvAttribute,s),Mt.fromBufferAttribute(this.uvAttribute,r),St.fromBufferAttribute(this.uvAttribute,h),f.set(0,0).addScaledVector(xt,i).addScaledVector(Mt,o).addScaledVector(St,1-(i+o))),this}}const Rt=new kt("#5ef2d0"),se=new g(99,99,99),le=`
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vWPos;
  varying vec3 vLPos;
  void main() {
    vUv = uv;
    vLPos = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWPos = wp.xyz;
    vec4 mv = viewMatrix * wp;
    vV = -mv.xyz;
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }`,ce=`
  uniform sampler2D uMap;
  uniform vec3 uColor;
  uniform vec3 uMouse;
  uniform float uTime, uReveal, uScanY, uOpacity, uForce, uRadius;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vWPos;
  varying vec3 vLPos;
  void main() {
    float d = vWPos.y - uReveal;
    if (d > 0.0) discard;

    vec3 tex = texture2D(uMap, vUv).rgb;
    float lum = dot(tex, vec3(0.299, 0.587, 0.114));
    vec3 base = mix(tex * 1.15, uColor * (lum * 1.9 + 0.1), 0.5);

    float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
    float lines = 0.76 + 0.24 * sin(vWPos.y * 520.0 - uTime * 3.0);
    float flick = 0.96 + 0.04 * sin(uTime * 23.0) * sin(uTime * 7.3);
    float band = smoothstep(0.03, 0.0, abs(vWPos.y - uScanY));
    float edge = smoothstep(0.02, 0.0, -d);

    float md = length(vLPos - uMouse);
    float inside = smoothstep(uRadius, uRadius * 0.55, md) * uForce;
    float ring = smoothstep(0.01, 0.0, abs(md - uRadius)) * uForce;

    vec3 col = base * lines * flick
      + uColor * fres * 1.2
      + vec3(0.85, 1.0, 0.95) * (band * 1.1 + edge * 1.6)
      + uColor * ring * 1.8;
    float a = (0.62 + fres * 0.35 + band * 0.3 + ring) * (1.0 - inside * 0.8) * uOpacity;
    gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
    #include <colorspace_fragment>
  }`,ue=`
  uniform float uTime, uAssemble, uDisperse, uForce, uRadius, uSize, uPixelRatio;
  uniform vec3 uMouse;
  attribute vec3 aNormal;
  attribute vec3 aScatter;
  attribute float aRand;
  varying float vRand;
  varying float vForce;
  void main() {
    float start = aRand * 0.45;
    float k = smoothstep(start, start + 0.55, uAssemble);
    vec3 p = mix(aScatter, position, k);
    p += aNormal * sin(uTime * 1.7 + aRand * 6.2831) * 0.003;
    p += aNormal * uDisperse * (0.1 + aRand * 0.8);

    vec3 dir = p - uMouse;
    float dist = length(dir);
    float f = smoothstep(uRadius, 0.0, dist) * uForce;
    p += normalize(dir + 1e-5) * f * uRadius;

    vRand = aRand;
    vForce = f;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * uPixelRatio * (0.7 + aRand * 0.6 + f * 1.6) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }`,de=`
  uniform vec3 uColor;
  uniform float uOpacity, uDisperse;
  varying float vRand;
  varying float vForce;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    vec3 col = mix(vec3(0.92, 1.0, 0.97), uColor, 0.35 + vForce * 0.5);
    float a = (uOpacity * (0.5 + vRand * 0.5) + vForce * 0.8 + uDisperse) * smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
  }`,D="ABCDEFGHJKLMNPQRSTUVWXYZ0123456789<>/{}=+*#";function me(m){const e=document.createElement("canvas");e.className="hero__rain",e.setAttribute("aria-hidden","true"),m.prepend(e);const n=e.getContext("2d"),c=15;let u=[],f=0,i=0,o=0;const l=()=>{const s=Math.min(window.devicePixelRatio||1,2);f=m.clientWidth,i=m.clientHeight,e.width=f*s,e.height=i*s,n.setTransform(s,0,0,s,0,0),u=Array.from({length:Math.ceil(f/c)},()=>({y:Math.random()*-i,speed:.4+Math.random()*.9}))};return l(),{resize:l,draw(s){s-o<50||(o=s,n.fillStyle="rgba(14, 15, 18, 0.16)",n.fillRect(0,0,f,i),n.font=`${c-2}px "JetBrains Mono", monospace`,u.forEach((r,h)=>{const b=D[Math.random()*D.length|0],v=h*c;n.fillStyle="rgba(214, 255, 244, 0.9)",n.fillText(b,v,r.y),n.fillStyle="rgba(94, 242, 208, 0.55)",n.fillText(D[Math.random()*D.length|0],v,r.y-c),r.y+=c*r.speed,r.y>i+c*4&&(r.y=Math.random()*-i*.5,r.speed=.4+Math.random()*.9)}))}}}async function he({container:m,onProgress:e,onStatus:n,onReady:c,onFail:u}){const f=Math.min(window.devicePixelRatio||1,2),i=window.innerWidth<768;let o;try{o=new Gt({antialias:!0,alpha:!0,powerPreference:"high-performance"})}catch{u?.();return}o.setPixelRatio(f),o.outputColorSpace=Yt,o.domElement.setAttribute("aria-hidden","true"),o.domElement.className="hero__canvas",m.appendChild(o.domElement);const l=new Dt,s=new Nt(30,1,.05,20);s.position.set(0,.02,2.5);const r=new yt;l.add(r);let h;try{h=await It(e)}catch(t){console.warn("[hero3d] model failed to load",t),o.dispose(),o.domElement.remove(),u?.();return}const b=h.scene.clone(!0);let v;if(b.traverse(t=>{t.isMesh&&!v&&(v=t)}),!v){u?.();return}const tt=new wt().setFromObject(b).getSize(new g);tt.z>tt.x*1.2&&(b.rotation.y=-Math.PI/2),b.updateMatrixWorld(!0);const et=new wt().setFromObject(b),I=et.getSize(new g),Pt=et.getCenter(new g),k=1.12/I.y,H=new yt;H.add(b),b.position.sub(Pt),H.scale.setScalar(k),r.add(H),r.updateMatrixWorld(!0);const Ft=.17/v.getWorldScale(new g).x,M={uTime:{value:0},uColor:{value:Rt},uMouse:{value:se.clone()},uForce:{value:0},uRadius:{value:Ft}},zt=v.material.map??null,C=new At({vertexShader:le,fragmentShader:ce,transparent:!0,uniforms:{...M,uMap:{value:zt},uReveal:{value:-1},uScanY:{value:-1},uOpacity:{value:0}}});v.material=C;const z=i?14e3:28e3,Bt=new ne(v).build(),it=new Float32Array(z*3),ot=new Float32Array(z*3),rt=new Float32Array(z*3),at=new Float32Array(z),T=new g,_=new g,nt=v.geometry.boundingBox??(v.geometry.computeBoundingBox(),v.geometry.boundingBox),j=nt.getCenter(new g),Xt=nt.getSize(new g).length()*.9;for(let t=0;t<z;t++){Bt.sample(T,_),it.set([T.x,T.y,T.z],t*3),ot.set([_.x,_.y,_.z],t*3);const a=new g().randomDirection().multiplyScalar(Xt*(.5+Math.random()*.8));rt.set([j.x+a.x,j.y+a.y,j.z+a.z],t*3),at[t]=Math.random()}const B=new Ht;B.setAttribute("position",new G(it,3)),B.setAttribute("aNormal",new G(ot,3)),B.setAttribute("aScatter",new G(rt,3)),B.setAttribute("aRand",new G(at,1));const O=new At({vertexShader:ue,fragmentShader:de,transparent:!0,depthWrite:!1,blending:jt,uniforms:{...M,uAssemble:{value:0},uDisperse:{value:0},uOpacity:{value:.9},uSize:{value:i?4:3.4},uPixelRatio:{value:f}}}),X=new qt(B,O);X.frustumCulled=!1,X.position.copy(v.position),X.quaternion.copy(v.quaternion),X.scale.copy(v.scale),v.parent.add(X);const V=-I.y*k*.5,L=new Ut(new Jt(.4,.405,96),new Kt({color:Rt,transparent:!0,opacity:.5,side:Qt}));L.rotation.x=-Math.PI/2,L.position.y=V-.01,l.add(L);const q=new Zt(.6,12,4,64,1915702,1915702);q.position.y=V-.012,l.add(q);const S=V-.02,st=-V+.02,Ct=st-S,y={assemble:0,reveal:S,opacity:0,pointOpacity:.9};let w;const U=(t=!0)=>{w?.kill(),w=ae.timeline(),t?Object.assign(y,{assemble:0,reveal:S,opacity:0,pointOpacity:.9}):(w.to(y,{opacity:0,pointOpacity:.9,duration:.35,ease:"power2.in"}),w.to(y,{assemble:0,duration:.6,ease:"power3.in"}),w.set(y,{reveal:S})),w.call(()=>n?.("> GENERATING HOLOGRAM...")),w.to(y,{assemble:1,duration:2.2,ease:"power3.out"}),w.call(()=>n?.(null)),w.to(y,{reveal:st,opacity:1,duration:1.6,ease:"power2.inOut"},"-=0.4"),w.to(y,{pointOpacity:.28,duration:1.2},"<0.6")};U();const lt=me(m),W={x:0,y:0},A={x:0,y:0,active:!1},ct=new N,ut=new $t,Tt=new te(new g(0,0,1),-(I.z*k*.25)),J=new g;let R=!1,P=0,F=0;const p={id:null,startX:0,startY:0,lastX:0,moved:!1,endedAt:0},K=t=>{const a=m.getBoundingClientRect();return ct.set((t.clientX-a.left)/a.width*2-1,-((t.clientY-a.top)/a.height)*2+1),a},dt=t=>{if(t.pointerType!=="mouse")return;W.x=t.clientX/window.innerWidth*2-1,W.y=t.clientY/window.innerHeight*2-1;const a=K(t);R=t.clientX>=a.left&&t.clientX<=a.right&&t.clientY>=a.top&&t.clientY<=a.bottom};window.addEventListener("pointermove",dt,{passive:!0}),m.addEventListener("pointerleave",t=>{t.pointerType==="mouse"&&(R=!1)}),m.addEventListener("pointerdown",t=>{t.pointerType!=="mouse"&&(ee(),p.id=t.pointerId,p.startX=p.lastX=t.clientX,p.startY=t.clientY,p.moved=!1,F=0,R=!0,K(t))}),m.addEventListener("pointermove",t=>{if(t.pointerId!==p.id)return;K(t);const a=t.clientX-p.lastX;p.lastX=t.clientX,(Math.abs(t.clientX-p.startX)>8||Math.abs(t.clientY-p.startY)>8)&&(p.moved=!0),F=a*.01,P+=F});const mt=(t,a)=>{t.pointerId===p.id&&(!a&&!p.moved&&U(!1),p.id=null,p.endedAt=performance.now(),R=!1)};m.addEventListener("pointerup",t=>mt(t,!1)),m.addEventListener("pointercancel",t=>mt(t,!0)),m.addEventListener("click",()=>{performance.now()-p.endedAt>700&&U(!1)});const _t=ie(t=>{A.x=t.x,A.y=t.y,A.active=!0}),ft=()=>{const{clientWidth:t,clientHeight:a}=m;!t||!a||(o.setSize(t,a,!1),s.aspect=t/a,s.position.z=t/a<.9?2.5/Math.max(t/a,.55)*.9:2.5,s.updateProjectionMatrix(),lt.resize())};new ResizeObserver(ft).observe(m),ft();let vt=!0;new IntersectionObserver(([t])=>{vt=t.isIntersecting}).observe(m);const Ot=m.closest(".hero")??m,Q=new oe;let Z=0,E=0,$=0,pt=!1;o.setAnimationLoop(t=>{if(pt||!vt||document.hidden){Q.getDelta();return}const a=Math.min(Q.getDelta(),.1),x=Q.elapsedTime;M.uTime.value=x;const ht=Ot.getBoundingClientRect(),bt=re.clamp(-ht.top/Math.max(ht.height,1),0,1);C.uniforms.uReveal.value=y.reveal,C.uniforms.uOpacity.value=y.opacity*(1-bt*.9);const gt=x%5/2.6;if(C.uniforms.uScanY.value=gt<=1?S+gt*Ct:S-1,O.uniforms.uAssemble.value=y.assemble,O.uniforms.uOpacity.value=y.pointOpacity,O.uniforms.uDisperse.value=bt*.5,M.uForce.value+=((R?1:0)-M.uForce.value)*.12,R&&(ut.setFromCamera(ct,s),ut.ray.intersectPlane(Tt,J)&&(v.worldToLocal(J),M.uMouse.value.lerp(J,.35))),p.id===null){P+=F,F*=.92;const Wt=Math.round(P/(Math.PI*2))*Math.PI*2;Math.abs(F)<.002&&(P+=(Wt-P)*.04)}const Vt=A.active?A.x:W.x,Lt=A.active?A.y:W.y;r.rotation.y+=(P+Vt*.45+Math.sin(x*.4)*.06-r.rotation.y)*.08,r.rotation.x+=(Lt*.14-r.rotation.x)*.06,r.position.y=Math.sin(x*1.1)*.012,L.rotation.z=x*.3,q.rotation.y=-x*.1,lt.draw(t),o.render(l,s),Z++,E+=a,E>=2&&($=Z/E<28&&x>5?$+1:0,Z=0,E=0,$>=2&&(pt=!0,o.setAnimationLoop(null),window.removeEventListener("pointermove",dt),_t(),o.domElement.remove(),m.querySelector(".hero__rain")?.remove(),o.dispose(),u?.("slow")))}),c?.()}export{he as initHero3D};
