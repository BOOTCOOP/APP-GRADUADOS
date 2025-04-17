"use strict";(self["webpackChunkgraduados_app"]=self["webpackChunkgraduados_app"]||[]).push([[940],{6091:(e,a,l)=>{l.d(a,{Z:()=>_});var t=l(6252),u=l(2262),n=l(3577),d=l(9963),r=l(7305);const i=(0,t.aZ)({__name:"FormSearchBar",props:{placeholder:{required:!0,type:String},debounce:{required:!1,default:600}},emits:["updated"],setup(e,{emit:a}){const l=a;function n(e){l("updated",e.target.value)}return(a,l)=>((0,t.wg)(),(0,t.j4)((0,u.SU)(r.VI),(0,t.dG)(a.$attrs,{debounce:e.debounce,placeholder:e.placeholder,onIonChange:n}),null,16,["debounce","placeholder"]))}}),s=i,o=s;var c=l(3907);const p={key:0,class:"filters"},v={class:"ion-text-center"},m={class:"ion-padding-vertical ion-text-center"},f=(0,t.aZ)({__name:"InfinitePagination",props:{fetchDataStore:{type:String,required:!0},loadingSpinner:{default:"circular"},loadingText:{default:""},emptyResultsText:{default:"No hay resultados para mostrar"},perPage:{type:Number,default:8},filters:{type:Object,default:()=>({})},hasSearcher:{default:!1},searchValue:{default:""},searchPlaceholder:{default:"Buscar..."}},setup(e,{expose:a}){const l=(0,u.iH)(!0),i=(0,u.iH)(!1),s=(0,c.oR)(),f=(0,u.iH)([]),g=(0,u.iH)(""),h=(0,u.iH)([]),_=(0,u.iH)(1),w=(0,t.Fl)((()=>{var e;return(null===(e=h.value)||void 0===e?void 0:e.current_page)!=h.value.last_page})),S=e;function W(){l.value=!0,_.value=1,y(),f.value=[]}function y(){return new Promise((e=>{i.value=!0,s.dispatch(S.fetchDataStore,{page:_.value,per_page:S.perPage,filters:S.filters,search:g.value}).then((a=>{f.value=f.value.concat(a.data.data),h.value=a.data.meta,l.value=!1,e(!0)})).finally((()=>i.value=!1))}))}function b(e){_.value++,y().then((()=>e.target.complete()))}function k(e){const a="object"==typeof e?e.id:e;f.value=f.value.filter((e=>e.id!=a))}return(0,t.bv)((()=>y())),(0,t.YP)(h,(e=>_.value=e.current_page)),(0,t.YP)((()=>S.filters),(()=>W())),(0,t.YP)((()=>S.searchValue),(e=>g.value=e)),(0,t.YP)(g,(()=>W())),a({removeItem:k}),(a,s)=>((0,t.wg)(),(0,t.iD)(t.HY,null,[(0,t.WI)(a.$slots,"filters",{loading:i.value},(()=>[S.hasSearcher?((0,t.wg)(),(0,t.iD)("div",p,[(0,t.Wm)(o,{placeholder:e.searchPlaceholder,onUpdated:s[0]||(s[0]=e=>g.value=e),disabled:i.value},null,8,["placeholder","disabled"]),(0,t.WI)(a.$slots,"filter-extra",{loading:i.value})])):(0,t.kq)("",!0)])),l.value?(0,t.WI)(a.$slots,"skeleton",{key:0,loading:i.value},(()=>[(0,t._)("div",v,[(0,t.Wm)((0,u.SU)(r.PQ))])])):(0,t.kq)("",!0),(0,t.wy)((0,t._)("div",null,[f.value.length?(0,t.WI)(a.$slots,"default",{key:0,loading:i.value,items:f.value,page:_.value,hasMorePages:w.value}):(0,t.kq)("",!0),f.value.length||i.value?(0,t.kq)("",!0):(0,t.WI)(a.$slots,"empty",{key:1},(()=>[(0,t._)("h3",m,(0,n.zw)(S.emptyResultsText),1)])),(0,t.Wm)((0,u.SU)(r.ju),{disabled:!w.value,onIonInfinite:b},{default:(0,t.w5)((()=>[(0,t.WI)(a.$slots,"loader",{},(()=>[(0,t.Wm)((0,u.SU)(r.MB),{"loading-text":S.loadingText,"loading-spinner":S.loadingSpinner},null,8,["loading-text","loading-spinner"])]))])),_:3},8,["disabled"])],512),[[d.F8,!l.value]])],64))}});var g=l(3744);const h=(0,g.Z)(f,[["__scopeId","data-v-5a377e8b"]]),_=h},940:(e,a,l)=>{l.r(a),l.d(a,{default:()=>p});var t=l(6252),u=l(2262),n=l(3577),d=l(7305),r=l(6091);const i=["alt","src"],s=(0,t.aZ)({__name:"Feeds",setup(e){return(e,a)=>{const l=(0,t.up)("graduados-app");return(0,t.wg)(),(0,t.j4)(l,{"header-title":"Noticias"},{default:(0,t.w5)((()=>[(0,t.Wm)(r.Z,{"fetch-data-store":"feeds/fetchAll"},{skeleton:(0,t.w5)((()=>[(0,t.Wm)((0,u.SU)(d.q_),null,{default:(0,t.w5)((()=>[((0,t.wg)(),(0,t.iD)(t.HY,null,(0,t.Ko)([1,2,3,4,5],(e=>(0,t.Wm)((0,u.SU)(d.Ie),{key:e,class:"ion-margin-bottom"},{default:(0,t.w5)((()=>[(0,t.Wm)((0,u.SU)(d.Bs),{slot:"start"},{default:(0,t.w5)((()=>[(0,t.Wm)((0,u.SU)(d.CK),{animated:!0})])),_:1}),(0,t.Wm)((0,u.SU)(d.Q$),null,{default:(0,t.w5)((()=>[(0,t._)("h3",null,[(0,t.Wm)((0,u.SU)(d.CK),{animated:!0,style:{width:"100%"}})]),(0,t._)("p",null,[(0,t.Wm)((0,u.SU)(d.CK),{animated:!0,style:{width:"80%"}})]),(0,t._)("p",null,[(0,t.Wm)((0,u.SU)(d.CK),{animated:!0,style:{width:"30%"}})])])),_:1})])),_:2},1024))),64))])),_:1})])),default:(0,t.w5)((({items:e})=>[((0,t.wg)(!0),(0,t.iD)(t.HY,null,(0,t.Ko)(e,(e=>((0,t.wg)(),(0,t.j4)((0,u.SU)(d.PM),{"router-link":"/noticia/"+e.slug,class:"ion-no-margin ion-margin-bottom",key:e.id},{default:(0,t.w5)((()=>[(0,t.Wm)((0,u.SU)(d.Bs),null,{default:(0,t.w5)((()=>[(0,t._)("img",{alt:e.title,src:e.thumb.absolute_path},null,8,i)])),_:2},1024),(0,t.Wm)((0,u.SU)(d.Q$),{class:"ion-padding"},{default:(0,t.w5)((()=>[(0,t._)("div",null,[(0,t.Wm)((0,u.SU)(d.yW),{color:"medium"},{default:(0,t.w5)((()=>[(0,t._)("small",null,(0,n.zw)(e.date),1)])),_:2},1024)]),(0,t.Uk)(" "+(0,n.zw)(e.title),1)])),_:2},1024)])),_:2},1032,["router-link"])))),128))])),_:1})])),_:1})}}});var o=l(3744);const c=(0,o.Z)(s,[["__scopeId","data-v-2cf41eb5"]]),p=c}}]);
//# sourceMappingURL=940-legacy.f805447a.js.map