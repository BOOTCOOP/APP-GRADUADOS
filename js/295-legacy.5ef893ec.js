"use strict";(self["webpackChunkgraduados_app"]=self["webpackChunkgraduados_app"]||[]).push([[295],{6091:(e,a,t)=>{t.d(a,{Z:()=>_});var l=t(6252),n=t(2262),r=t(3577),u=t(9963),d=t(7305);const i=(0,l.aZ)({__name:"FormSearchBar",props:{placeholder:{required:!0,type:String},debounce:{required:!1,default:600}},emits:["updated"],setup(e,{emit:a}){const t=a;function r(e){t("updated",e.target.value)}return(a,t)=>((0,l.wg)(),(0,l.j4)((0,n.SU)(d.VI),(0,l.dG)(a.$attrs,{debounce:e.debounce,placeholder:e.placeholder,onIonChange:r}),null,16,["debounce","placeholder"]))}}),o=i,s=o;var c=t(3907);const p={key:0,class:"filters"},v={class:"ion-text-center"},f={class:"ion-padding-vertical ion-text-center"},g=(0,l.aZ)({__name:"InfinitePagination",props:{fetchDataStore:{type:String,required:!0},loadingSpinner:{default:"circular"},loadingText:{default:""},emptyResultsText:{default:"No hay resultados para mostrar"},perPage:{type:Number,default:8},filters:{type:Object,default:()=>({})},hasSearcher:{default:!1},searchValue:{default:""},searchPlaceholder:{default:"Buscar..."}},setup(e,{expose:a}){const t=(0,n.iH)(!0),i=(0,n.iH)(!1),o=(0,c.oR)(),g=(0,n.iH)([]),h=(0,n.iH)(""),m=(0,n.iH)([]),_=(0,n.iH)(1),w=(0,l.Fl)((()=>{var e;return(null===(e=m.value)||void 0===e?void 0:e.current_page)!=m.value.last_page})),y=e;function S(){t.value=!0,_.value=1,W(),g.value=[]}function W(){return new Promise((e=>{i.value=!0,o.dispatch(y.fetchDataStore,{page:_.value,per_page:y.perPage,filters:y.filters,search:h.value}).then((a=>{g.value=g.value.concat(a.data.data),m.value=a.data.meta,t.value=!1,e(!0)})).finally((()=>i.value=!1))}))}function k(e){_.value++,W().then((()=>e.target.complete()))}function I(e){const a="object"==typeof e?e.id:e;g.value=g.value.filter((e=>e.id!=a))}return(0,l.bv)((()=>W())),(0,l.YP)(m,(e=>_.value=e.current_page)),(0,l.YP)((()=>y.filters),(()=>S())),(0,l.YP)((()=>y.searchValue),(e=>h.value=e)),(0,l.YP)(h,(()=>S())),a({removeItem:I}),(a,o)=>((0,l.wg)(),(0,l.iD)(l.HY,null,[(0,l.WI)(a.$slots,"filters",{loading:i.value},(()=>[y.hasSearcher?((0,l.wg)(),(0,l.iD)("div",p,[(0,l.Wm)(s,{placeholder:e.searchPlaceholder,onUpdated:o[0]||(o[0]=e=>h.value=e),disabled:i.value},null,8,["placeholder","disabled"]),(0,l.WI)(a.$slots,"filter-extra",{loading:i.value})])):(0,l.kq)("",!0)])),t.value?(0,l.WI)(a.$slots,"skeleton",{key:0,loading:i.value},(()=>[(0,l._)("div",v,[(0,l.Wm)((0,n.SU)(d.PQ))])])):(0,l.kq)("",!0),(0,l.wy)((0,l._)("div",null,[g.value.length?(0,l.WI)(a.$slots,"default",{key:0,loading:i.value,items:g.value,page:_.value,hasMorePages:w.value}):(0,l.kq)("",!0),g.value.length||i.value?(0,l.kq)("",!0):(0,l.WI)(a.$slots,"empty",{key:1},(()=>[(0,l._)("h3",f,(0,r.zw)(y.emptyResultsText),1)])),(0,l.Wm)((0,n.SU)(d.ju),{disabled:!w.value,onIonInfinite:k},{default:(0,l.w5)((()=>[(0,l.WI)(a.$slots,"loader",{},(()=>[(0,l.Wm)((0,n.SU)(d.MB),{"loading-text":y.loadingText,"loading-spinner":y.loadingSpinner},null,8,["loading-text","loading-spinner"])]))])),_:3},8,["disabled"])],512),[[u.F8,!t.value]])],64))}});var h=t(3744);const m=(0,h.Z)(g,[["__scopeId","data-v-5a377e8b"]]),_=m},8295:(e,a,t)=>{t.r(a),t.d(a,{default:()=>m});var l=t(6252),n=t(2262),r=t(3577),u=t(7305),d=t(6091),i=t(8903);const o={style:{"flex-grow":"1"}},s={class:"ion-margin-top"},c={style:{"flex-grow":"1"}},p=["innerHTML"],v=["href"],f=(0,l.aZ)({__name:"InformationOfInterest",setup(e){return(e,a)=>{const t=(0,l.up)("graduados-app");return(0,l.wg)(),(0,l.j4)(t,{"header-title":"Información de interés"},{default:(0,l.w5)((()=>[(0,l.Wm)(d.Z,{"fetch-data-store":"interests/fetchAll"},{skeleton:(0,l.w5)((()=>[((0,l.wg)(),(0,l.iD)(l.HY,null,(0,l.Ko)([1,2,3,4,5,6,7],(e=>(0,l.Wm)((0,n.SU)(u.PM),{class:"ion-padding",key:e},{default:(0,l.w5)((()=>[(0,l._)("div",o,[(0,l.Wm)((0,n.SU)(u.CK),{animated:!0,style:{width:"30%",height:"20px"}}),(0,l._)("div",s,[(0,l.Wm)((0,n.SU)(u.Q$),null,{default:(0,l.w5)((()=>[(0,l.Wm)((0,n.SU)(u.CK),{animated:!0,style:{width:"60%"}}),(0,l.Wm)((0,n.SU)(u.CK),{animated:!0,style:{width:"50%"}})])),_:1})])]),(0,l.Wm)((0,n.SU)(u.CK),{animated:!0,style:{width:"20px",height:"20px"}})])),_:2},1024))),64))])),default:(0,l.w5)((({items:e})=>[((0,l.wg)(!0),(0,l.iD)(l.HY,null,(0,l.Ko)(e,(e=>((0,l.wg)(),(0,l.j4)((0,n.SU)(u.PM),{key:e.id},{default:(0,l.w5)((()=>[(0,l.Wm)((0,n.SU)(u.FN),{class:"content"},{default:(0,l.w5)((()=>[(0,l._)("div",c,[(0,l.Wm)((0,n.SU)(u.yW),{color:"primary"},{default:(0,l.w5)((()=>[(0,l._)("h6",null,[(0,l._)("strong",null,(0,r.zw)(e.title),1)])])),_:2},1024),(0,l._)("div",{class:"info-content",innerHTML:e.content},null,8,p)]),(0,l._)("a",{href:e.url,target:"_blank"},[(0,l.Wm)((0,n.SU)(u.gu),{md:(0,n.SU)(i.gmo),ios:(0,n.SU)(i.gmo),color:"primary"},null,8,["md","ios"])],8,v)])),_:2},1024)])),_:2},1024)))),128))])),_:1})])),_:1})}}});var g=t(3744);const h=(0,g.Z)(f,[["__scopeId","data-v-c3e41f30"]]),m=h}}]);
//# sourceMappingURL=295-legacy.5ef893ec.js.map