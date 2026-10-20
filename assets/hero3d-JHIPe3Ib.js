import{T as ze,V as b,a as E,W as Be,S as Ce,b as _e,P as Oe,G as fe,l as Ve,B as ve,c as pe,C as We,d as Te,e as T,A as Le,f as De,M as Ee,R as Ge,g as Xe,D as Ne,h as ke,i as Ye,j as He,k as je,m as Ie}from"./peterModel-xDzzOYkp.js";import{g as Ue}from"./main-Df5rUWKa.js";const u=new ze,L=new b,he=new E,be=new E,ge=new E;class qe{constructor(e){this.geometry=e.geometry,this.randomFunction=Math.random,this.indexAttribute=this.geometry.index,this.positionAttribute=this.geometry.getAttribute("position"),this.normalAttribute=this.geometry.getAttribute("normal"),this.colorAttribute=this.geometry.getAttribute("color"),this.uvAttribute=this.geometry.getAttribute("uv"),this.weightAttribute=null,this.distribution=null}setWeightAttribute(e){return this.weightAttribute=e?this.geometry.getAttribute(e):null,this}build(){const e=this.indexAttribute,a=this.positionAttribute,l=this.weightAttribute,c=e?e.count/3:a.count/3,m=new Float32Array(c);for(let s=0;s<c;s++){let n=1,r=3*s,p=3*s+1,h=3*s+2;e&&(r=e.getX(r),p=e.getX(p),h=e.getX(h)),l&&(n=l.getX(r)+l.getX(p)+l.getX(h)),u.a.fromBufferAttribute(a,r),u.b.fromBufferAttribute(a,p),u.c.fromBufferAttribute(a,h),n*=u.getArea(),m[s]=n}const t=new Float32Array(c);let o=0;for(let s=0;s<c;s++)o+=m[s],t[s]=o;return this.distribution=t,this}setRandomGenerator(e){return this.randomFunction=e,this}sample(e,a,l,c){const m=this._sampleFaceIndex();return this._sampleFace(m,e,a,l,c)}_sampleFaceIndex(){const e=this.distribution[this.distribution.length-1];return this._binarySearch(this.randomFunction()*e)}_binarySearch(e){const a=this.distribution;let l=0,c=a.length-1,m=-1;for(;l<=c;){const t=Math.ceil((l+c)/2);if(t===0||a[t-1]<=e&&a[t]>e){m=t;break}else e<a[t]?c=t-1:l=t+1}return m}_sampleFace(e,a,l,c,m){let t=this.randomFunction(),o=this.randomFunction();t+o>1&&(t=1-t,o=1-o);const s=this.indexAttribute;let n=e*3,r=e*3+1,p=e*3+2;return s&&(n=s.getX(n),r=s.getX(r),p=s.getX(p)),u.a.fromBufferAttribute(this.positionAttribute,n),u.b.fromBufferAttribute(this.positionAttribute,r),u.c.fromBufferAttribute(this.positionAttribute,p),a.set(0,0,0).addScaledVector(u.a,t).addScaledVector(u.b,o).addScaledVector(u.c,1-(t+o)),l!==void 0&&(this.normalAttribute!==void 0?(u.a.fromBufferAttribute(this.normalAttribute,n),u.b.fromBufferAttribute(this.normalAttribute,r),u.c.fromBufferAttribute(this.normalAttribute,p),l.set(0,0,0).addScaledVector(u.a,t).addScaledVector(u.b,o).addScaledVector(u.c,1-(t+o)).normalize()):u.getNormal(l)),c!==void 0&&this.colorAttribute!==void 0&&(u.a.fromBufferAttribute(this.colorAttribute,n),u.b.fromBufferAttribute(this.colorAttribute,r),u.c.fromBufferAttribute(this.colorAttribute,p),L.set(0,0,0).addScaledVector(u.a,t).addScaledVector(u.b,o).addScaledVector(u.c,1-(t+o)),c.r=L.x,c.g=L.y,c.b=L.z),m!==void 0&&this.uvAttribute!==void 0&&(he.fromBufferAttribute(this.uvAttribute,n),be.fromBufferAttribute(this.uvAttribute,r),ge.fromBufferAttribute(this.uvAttribute,p),m.set(0,0).addScaledVector(he,t).addScaledVector(be,o).addScaledVector(ge,1-(t+o))),this}}const ye=new We("#5ef2d0"),Je=new b(99,99,99),Ke=`
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
  }`,Qe=`
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
  }`,Ze=`
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
  }`,$e=`
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
  }`,D="ABCDEFGHJKLMNPQRSTUVWXYZ0123456789<>/{}=+*#";function et(v){const e=document.createElement("canvas");e.className="hero__rain",e.setAttribute("aria-hidden","true"),v.prepend(e);const a=e.getContext("2d"),l=15;let c=[],m=0,t=0,o=0;const s=()=>{const n=Math.min(window.devicePixelRatio||1,2);m=v.clientWidth,t=v.clientHeight,e.width=m*n,e.height=t*n,a.setTransform(n,0,0,n,0,0),c=Array.from({length:Math.ceil(m/l)},()=>({y:Math.random()*-t,speed:.4+Math.random()*.9}))};return s(),{resize:s,draw(n){n-o<50||(o=n,a.fillStyle="rgba(14, 15, 18, 0.16)",a.fillRect(0,0,m,t),a.font=`${l-2}px "JetBrains Mono", monospace`,c.forEach((r,p)=>{const h=D[Math.random()*D.length|0],f=p*l;a.fillStyle="rgba(214, 255, 244, 0.9)",a.fillText(h,f,r.y),a.fillStyle="rgba(94, 242, 208, 0.55)",a.fillText(D[Math.random()*D.length|0],f,r.y-l),r.y+=l*r.speed,r.y>t+l*4&&(r.y=Math.random()*-t*.5,r.speed=.4+Math.random()*.9)}))}}}async function rt({container:v,onProgress:e,onStatus:a,onReady:l,onFail:c}){const m=Math.min(window.devicePixelRatio||1,2),t=window.innerWidth<768;let o;try{o=new Be({antialias:!0,alpha:!0,powerPreference:"high-performance"})}catch{c?.();return}o.setPixelRatio(m),o.outputColorSpace=Ce,o.domElement.setAttribute("aria-hidden","true"),o.domElement.className="hero__canvas",v.appendChild(o.domElement);const s=new _e,n=new Oe(30,1,.05,20);n.position.set(0,.02,2.5);const r=new fe;s.add(r);let p;try{p=await Ve(e)}catch(i){console.warn("[hero3d] model failed to load",i),o.dispose(),o.domElement.remove(),c?.();return}const h=p.scene.clone(!0);let f;if(h.traverse(i=>{i.isMesh&&!f&&(f=i)}),!f){c?.();return}const q=new ve().setFromObject(h).getSize(new b);q.z>q.x*1.2&&(h.rotation.y=-Math.PI/2),h.updateMatrixWorld(!0);const J=new ve().setFromObject(h),G=J.getSize(new b),we=J.getCenter(new b),X=1.12/G.y,N=new fe;N.add(h),h.position.sub(we),N.scale.setScalar(X),r.add(N),r.updateMatrixWorld(!0);const Ae=.17/f.getWorldScale(new b).x,A={uTime:{value:0},uColor:{value:ye},uMouse:{value:Je.clone()},uForce:{value:0},uRadius:{value:Ae}},xe=f.material.map??null,F=new pe({vertexShader:Ke,fragmentShader:Qe,transparent:!0,uniforms:{...A,uMap:{value:xe},uReveal:{value:-1},uScanY:{value:-1},uOpacity:{value:0}}});f.material=F;const M=t?14e3:28e3,Me=new qe(f).build(),K=new Float32Array(M*3),Q=new Float32Array(M*3),Z=new Float32Array(M*3),$=new Float32Array(M),P=new b,z=new b,ee=f.geometry.boundingBox??(f.geometry.computeBoundingBox(),f.geometry.boundingBox),k=ee.getCenter(new b),Se=ee.getSize(new b).length()*.9;for(let i=0;i<M;i++){Me.sample(P,z),K.set([P.x,P.y,P.z],i*3),Q.set([z.x,z.y,z.z],i*3);const d=new b().randomDirection().multiplyScalar(Se*(.5+Math.random()*.8));Z.set([k.x+d.x,k.y+d.y,k.z+d.z],i*3),$[i]=Math.random()}const S=new Te;S.setAttribute("position",new T(K,3)),S.setAttribute("aNormal",new T(Q,3)),S.setAttribute("aScatter",new T(Z,3)),S.setAttribute("aRand",new T($,1));const B=new pe({vertexShader:Ze,fragmentShader:$e,transparent:!0,depthWrite:!1,blending:Le,uniforms:{...A,uAssemble:{value:0},uDisperse:{value:0},uOpacity:{value:.9},uSize:{value:t?4:3.4},uPixelRatio:{value:m}}}),R=new De(S,B);R.frustumCulled=!1,R.position.copy(f.position),R.quaternion.copy(f.quaternion),R.scale.copy(f.scale),f.parent.add(R);const C=-G.y*X*.5,_=new Ee(new Ge(.4,.405,96),new Xe({color:ye,transparent:!0,opacity:.5,side:Ne}));_.rotation.x=-Math.PI/2,_.position.y=C-.01,s.add(_);const Y=new ke(.6,12,4,64,1915702,1915702);Y.position.y=C-.012,s.add(Y);const x=C-.02,te=-C+.02,Re=te-x,g={assemble:0,reveal:x,opacity:0,pointOpacity:.9};let y;const oe=(i=!0)=>{y?.kill(),y=Ue.timeline(),i?Object.assign(g,{assemble:0,reveal:x,opacity:0,pointOpacity:.9}):(y.to(g,{opacity:0,pointOpacity:.9,duration:.35,ease:"power2.in"}),y.to(g,{assemble:0,duration:.6,ease:"power3.in"}),y.set(g,{reveal:x})),y.call(()=>a?.("> GENERATING HOLOGRAM...")),y.to(g,{assemble:1,duration:2.2,ease:"power3.out"}),y.call(()=>a?.(null)),y.to(g,{reveal:te,opacity:1,duration:1.6,ease:"power2.inOut"},"-=0.4"),y.to(g,{pointOpacity:.28,duration:1.2},"<0.6")};oe();const ie=et(v),O={x:0,y:0},re=new E,ae=new Ye,Fe=new He(new b(0,0,1),-(G.z*X*.25)),H=new b;let V=!1;const ne=i=>{O.x=i.clientX/window.innerWidth*2-1,O.y=i.clientY/window.innerHeight*2-1;const d=v.getBoundingClientRect();V=i.clientX>=d.left&&i.clientX<=d.right&&i.clientY>=d.top&&i.clientY<=d.bottom,re.set((i.clientX-d.left)/d.width*2-1,-((i.clientY-d.top)/d.height)*2+1)};window.addEventListener("pointermove",ne,{passive:!0}),v.addEventListener("pointerleave",()=>{V=!1}),v.addEventListener("click",()=>oe(!1));const se=()=>{const{clientWidth:i,clientHeight:d}=v;!i||!d||(o.setSize(i,d,!1),n.aspect=i/d,n.position.z=i/d<.9?2.5/Math.max(i/d,.55)*.9:2.5,n.updateProjectionMatrix(),ie.resize())};new ResizeObserver(se).observe(v),se();let le=!0;new IntersectionObserver(([i])=>{le=i.isIntersecting}).observe(v);const Pe=v.closest(".hero")??v,j=new je;let I=0,W=0,U=0,ce=!1;o.setAnimationLoop(i=>{if(ce||!le||document.hidden){j.getDelta();return}const d=Math.min(j.getDelta(),.1),w=j.elapsedTime;A.uTime.value=w;const ue=Pe.getBoundingClientRect(),de=Ie.clamp(-ue.top/Math.max(ue.height,1),0,1);F.uniforms.uReveal.value=g.reveal,F.uniforms.uOpacity.value=g.opacity*(1-de*.9);const me=w%5/2.6;F.uniforms.uScanY.value=me<=1?x+me*Re:x-1,B.uniforms.uAssemble.value=g.assemble,B.uniforms.uOpacity.value=g.pointOpacity,B.uniforms.uDisperse.value=de*.5,A.uForce.value+=((V?1:0)-A.uForce.value)*.12,V&&(ae.setFromCamera(re,n),ae.ray.intersectPlane(Fe,H)&&(f.worldToLocal(H),A.uMouse.value.lerp(H,.35))),r.rotation.y+=(O.x*.4+Math.sin(w*.4)*.06-r.rotation.y)*.05,r.rotation.x+=(O.y*.1-r.rotation.x)*.05,r.position.y=Math.sin(w*1.1)*.012,_.rotation.z=w*.3,Y.rotation.y=-w*.1,ie.draw(i),o.render(s,n),I++,W+=d,W>=2&&(U=I/W<28&&w>5?U+1:0,I=0,W=0,U>=2&&(ce=!0,o.setAnimationLoop(null),window.removeEventListener("pointermove",ne),o.domElement.remove(),v.querySelector(".hero__rain")?.remove(),o.dispose(),c?.("slow")))}),l?.()}export{rt as initHero3D};
