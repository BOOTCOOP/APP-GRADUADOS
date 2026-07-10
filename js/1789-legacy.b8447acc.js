"use strict";(self["webpackChunkgraduados_app"]=self["webpackChunkgraduados_app"]||[]).push([[1789],{1789(t,e,n){
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const r=()=>{document.addEventListener("backbutton",()=>{})},a=()=>{const t=document;let e=!1;t.addEventListener("backbutton",()=>{if(e)return;let n=0,r=[];const a=new CustomEvent("ionBackButton",{bubbles:!1,detail:{register(t,e){r.push({priority:t,handler:e,id:n++})}}});t.dispatchEvent(a);const o=async t=>{try{if(null===t||void 0===t?void 0:t.handler){const e=t.handler(i);null!=e&&await e}}catch(e){console.error(e)}},i=()=>{if(r.length>0){let t={priority:Number.MIN_SAFE_INTEGER,handler:()=>{},id:-1};r.forEach(e=>{e.priority>=t.priority&&(t=e)}),e=!0,r=r.filter(e=>e.id!==t.id),o(t).then(()=>e=!1)}};i()})};n.d(e,["blockHardwareBackButton",0,r,"startHardwareBackButton",0,a])}}]);
//# sourceMappingURL=1789-legacy.b8447acc.js.map