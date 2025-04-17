"use strict";(self["webpackChunkgraduados_app"]=self["webpackChunkgraduados_app"]||[]).push([[224],{1817:(a,e,n)=>{var o=n(2109),i=n(9781),t=n(7854),l=n(1702),c=n(2597),s=n(614),r=n(7976),u=n(1340),d=n(7045),v=n(9920),p=t.Symbol,g=p&&p.prototype;if(i&&s(p)&&(!("description"in g)||void 0!==p().description)){var f={},m=function(){var a=arguments.length<1||void 0===arguments[0]?void 0:u(arguments[0]),e=r(g,this)?new p(a):void 0===a?p():p(a);return""===a&&(f[e]=!0),e};v(m,p),m.prototype=g,g.constructor=m;var _="Symbol(test)"==String(p("test")),w=l(g.valueOf),h=l(g.toString),b=/^Symbol\((.*)\)[^)]+$/,k=l("".replace),y=l("".slice);d(g,"description",{configurable:!0,get:function(){var a=w(this);if(c(f,a))return"";var e=h(a),n=_?y(e,7,-1):k(e,b,"$1");return""===n?void 0:n}}),o({global:!0,constructor:!0,forced:!0},{Symbol:m})}},6224:(a,e,n)=>{n.r(e),n.d(e,{default:()=>x});n(4916),n(5306),n(6699),n(7658),n(1817);var o=n(6252),i=n(3577),t=n(2262),l=n(7305),c=n(8903),s=n(2201),r=n(3907);const u={class:"ion-padding"},d={key:0,class:"loading-container"},v={key:1,class:"aviso-detail"},p={class:"aviso-header"},g={key:0,class:"aviso-badge"},f={key:0,class:"file-preview"},m=["src"],_={class:"description-section"},w={class:"contact-section"},h={class:"contact-item"},b={class:"contact-icon"},k={class:"contact-info"},y={class:"contact-item"},C={class:"contact-icon"},D={class:"contact-info"},S={class:"meta-section"},U={class:"date"},A={key:1,class:"action-section"},W={key:2,class:"error-container"},$=(0,o.aZ)({__name:"AvisoDetail",setup(a){const e=(0,s.yj)(),n=(0,s.tv)(),$=(0,r.oR)(),j=(0,o.Fl)((()=>$.state.avisos.currentAviso)),z=(0,o.Fl)((()=>$.state.avisos.loading)),x=(0,o.Fl)((()=>{var a;return(null===(a=$.state.auth)||void 0===a?void 0:a.user)||null})),E=(0,o.Fl)((()=>{var a;return x.value&&(null===(a=j.value)||void 0===a?void 0:a.user_id)===x.value.id}));async function q(){const a=e.params.id;a&&await $.dispatch("avisos/fetchAviso",a)}function F(a){if(!a)return"/assets/img/imagen-no-disponible.jpg";const e="https://api.graduados.kame-code.com/api",n=e.replace(/\/api\/?$/,"")||"https://api.graduados.kame-code.com";let o=a;return o=/^\/?storage\//.test(o)?"/"+o.replace(/^\/+/,""):"/storage/"+o.replace(/^\/+/,""),`${n}${o}`}function I(a){var e;if(!a)return!1;const n=null===(e=a.split(".").pop())||void 0===e?void 0:e.toLowerCase();return["jpg","jpeg","png","gif","webp"].includes(n||"")}function L(a){if(!a)return;const e=F(a);window.open(e,"_blank")}function N(a){if(!a)return"";const e=new Date(a);return e.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"})}function O(a){a&&window.open(`tel:${a}`,"_system")}function H(a){a&&window.open(`mailto:${a}`,"_system")}async function P(){const a=await l.Cl.create({header:"Confirmar",message:"¿Estás seguro de que deseas cancelar este aviso? Esta acción no se puede deshacer.",buttons:[{text:"Cancelar",role:"cancel"},{text:"Confirmar",role:"confirm",handler:async()=>{if(j.value)try{const a=await $.dispatch("avisos/cancelAviso",j.value.id);a&&n.push("/classifieds")}catch(a){console.error("Error al cancelar aviso:",a)}}}]});await a.present()}function V(){n.push("/classifieds")}return(0,o.bv)((()=>{console.log("AvisoDetail component mounted"),q()})),(a,e)=>{var n;const l=(0,o.up)("ion-icon"),s=(0,o.up)("graduados-app");return(0,o.wg)(),(0,o.j4)(s,{"header-title":(null===(n=j.value)||void 0===n?void 0:n.title)||"Detalle del Aviso","header-show-back-button":!0},{default:(0,o.w5)((()=>[(0,o._)("div",u,[z.value?((0,o.wg)(),(0,o.iD)("div",d,e[4]||(e[4]=[(0,o._)("div",{class:"spinner"},null,-1),(0,o._)("p",null,"Cargando detalle...",-1)]))):j.value?((0,o.wg)(),(0,o.iD)("div",v,[(0,o._)("div",p,[(0,o._)("h1",null,(0,i.zw)(j.value.title),1),E.value?((0,o.wg)(),(0,o.iD)("div",g,"Mi Aviso")):(0,o.kq)("",!0)]),j.value.file?((0,o.wg)(),(0,o.iD)("div",f,[I(j.value.file)?((0,o.wg)(),(0,o.iD)("img",{key:0,src:F(j.value.file),alt:"Imagen del aviso",class:"aviso-image",onClick:e[0]||(e[0]=a=>L(j.value.file))},null,8,m)):((0,o.wg)(),(0,o.iD)("button",{key:1,class:"document-button",onClick:e[1]||(e[1]=a=>L(j.value.file))},[(0,o.Wm)(l,{icon:(0,t.SU)(c.Pf6)},null,8,["icon"]),e[5]||(e[5]=(0,o.Uk)(" Ver documento adjunto "))]))])):(0,o.kq)("",!0),(0,o._)("div",_,[e[6]||(e[6]=(0,o._)("h2",null,"Descripción",-1)),(0,o._)("p",null,(0,i.zw)(j.value.description),1)]),(0,o._)("div",w,[e[9]||(e[9]=(0,o._)("h2",null,"Información de contacto",-1)),(0,o._)("div",h,[(0,o._)("div",b,[(0,o.Wm)(l,{icon:(0,t.SU)(c.H7N),color:"primary"},null,8,["icon"])]),(0,o._)("div",k,[e[7]||(e[7]=(0,o._)("h3",null,"Teléfono",-1)),(0,o._)("p",null,(0,i.zw)(j.value.contact_phone),1)]),(0,o._)("button",{class:"contact-action",onClick:e[2]||(e[2]=a=>O(j.value.contact_phone))},[(0,o.Wm)(l,{icon:(0,t.SU)(c.H7N)},null,8,["icon"])])]),(0,o._)("div",y,[(0,o._)("div",C,[(0,o.Wm)(l,{icon:(0,t.SU)(c.xOl),color:"primary"},null,8,["icon"])]),(0,o._)("div",D,[e[8]||(e[8]=(0,o._)("h3",null,"Email",-1)),(0,o._)("p",null,(0,i.zw)(j.value.contact_email),1)]),(0,o._)("button",{class:"contact-action",onClick:e[3]||(e[3]=a=>H(j.value.contact_email))},[(0,o.Wm)(l,{icon:(0,t.SU)(c.xOl)},null,8,["icon"])])])]),(0,o._)("div",S,[(0,o._)("p",U,"Publicado: "+(0,i.zw)(N(j.value.created_at)),1)]),E.value?((0,o.wg)(),(0,o.iD)("div",A,[(0,o._)("button",{class:"cancel-button",onClick:P},[(0,o.Wm)(l,{icon:(0,t.SU)(c.gtu)},null,8,["icon"]),e[10]||(e[10]=(0,o.Uk)(" Cancelar Aviso "))])])):(0,o.kq)("",!0)])):((0,o.wg)(),(0,o.iD)("div",W,[(0,o.Wm)(l,{icon:(0,t.SU)(c.nLD),size:"large"},null,8,["icon"]),e[11]||(e[11]=(0,o._)("p",null,"No se pudo cargar el aviso o no existe.",-1)),(0,o._)("button",{class:"back-button",onClick:V},"Volver a la lista")]))])])),_:1},8,["header-title"])}}});var j=n(3744);const z=(0,j.Z)($,[["__scopeId","data-v-d7ebb7f0"]]),x=z}}]);
//# sourceMappingURL=224.80db3237.js.map