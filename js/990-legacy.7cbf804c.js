"use strict";(self["webpackChunkgraduados_app"]=self["webpackChunkgraduados_app"]||[]).push([[990],{8990:(e,t,n)=>{n.r(t),n.d(t,{createSwipeBackGesture:()=>o});var r=n(6587),a=n(545),s=n(6515);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const o=(e,t,n,o,c)=>{const i=e.ownerDocument.defaultView;let u=(0,a.i)(e);const d=e=>{const t=50,{startX:n}=e;return u?n>=i.innerWidth-t:n<=t},h=e=>u?-e.deltaX:e.deltaX,l=e=>u?-e.velocityX:e.velocityX,p=n=>(u=(0,a.i)(e),d(n)&&t()),k=e=>{const t=h(e),n=t/i.innerWidth;o(n)},w=e=>{const t=h(e),n=i.innerWidth,a=t/n,s=l(e),o=n/2,u=s>=0&&(s>.2||t>o),d=u?1-a:a,p=d*n;let k=0;if(p>5){const e=p/Math.abs(s);k=Math.min(e,540)}c(u,a<=0?.01:(0,r.h)(0,a,.9999),k)};return(0,s.createGesture)({el:e,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:p,onStart:n,onMove:k,onEnd:w})}}}]);
//# sourceMappingURL=990-legacy.7cbf804c.js.map