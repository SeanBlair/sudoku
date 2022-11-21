(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))l(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&l(r)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerpolicy&&(i.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?i.credentials="include":o.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();function G(){}const ze=e=>e;function $e(e){return e()}function be(){return Object.create(null)}function $(e){e.forEach($e)}function se(e){return typeof e=="function"}function ue(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function Ze(e){return Object.keys(e).length===0}function qe(e){return e==null?"":e}const Ue=typeof window<"u";let xe=Ue?()=>window.performance.now():()=>Date.now(),ce=Ue?e=>requestAnimationFrame(e):G;const U=new Set;function je(e){U.forEach(t=>{t.c(e)||(U.delete(t),t.f())}),U.size!==0&&ce(je)}function et(e){let t;return U.size===0&&ce(je),{promise:new Promise(n=>{U.add(t={c:e,f:n})}),abort(){U.delete(t)}}}function g(e,t){e.appendChild(t)}function De(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t&&t.host?t:e.ownerDocument}function tt(e){const t=b("style");return nt(De(e),t),t.sheet}function nt(e,t){return g(e.head||e,t),t.sheet}function I(e,t,n){e.insertBefore(t,n||null)}function E(e){e.parentNode&&e.parentNode.removeChild(e)}function X(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function b(e){return document.createElement(e)}function z(e){return document.createTextNode(e)}function H(){return z(" ")}function fe(){return z("")}function q(e,t,n,l){return e.addEventListener(t,n,l),()=>e.removeEventListener(t,n,l)}function C(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function lt(e){return Array.from(e.childNodes)}function ee(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function y(e,t,n){e.classList[n?"add":"remove"](t)}function ot(e,t,{bubbles:n=!1,cancelable:l=!1}={}){const o=document.createEvent("CustomEvent");return o.initCustomEvent(e,n,l,t),o}const Y=new Map;let Z=0;function it(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}function rt(e,t){const n={stylesheet:tt(t),rules:{}};return Y.set(e,n),n}function st(e,t,n,l,o,i,r,s=0){const f=16.666/l;let u=`{
`;for(let V=0;V<=1;V+=f){const A=t+(n-t)*i(V);u+=V*100+`%{${r(A,1-A)}}
`}const c=u+`100% {${r(n,1-n)}}
}`,a=`__svelte_${it(c)}_${s}`,d=De(e),{stylesheet:_,rules:k}=Y.get(d)||rt(d,e);k[a]||(k[a]=!0,_.insertRule(`@keyframes ${a} ${c}`,_.cssRules.length));const O=e.style.animation||"";return e.style.animation=`${O?`${O}, `:""}${a} ${l}ms linear ${o}ms 1 both`,Z+=1,a}function ut(e,t){const n=(e.style.animation||"").split(", "),l=n.filter(t?i=>i.indexOf(t)<0:i=>i.indexOf("__svelte")===-1),o=n.length-l.length;o&&(e.style.animation=l.join(", "),Z-=o,Z||ct())}function ct(){ce(()=>{Z||(Y.forEach(e=>{const{ownerNode:t}=e.stylesheet;t&&E(t)}),Y.clear())})}let ae;function F(e){ae=e}function ft(e,t){const n=e.$$.callbacks[t.type];n&&n.slice().forEach(l=>l.call(this,t))}const P=[],Se=[],K=[],ke=[],at=Promise.resolve();let le=!1;function dt(){le||(le=!0,at.then(Pe))}function x(e){K.push(e)}const ne=new Set;let B=0;function Pe(){const e=ae;do{for(;B<P.length;){const t=P[B];B++,F(t),ht(t.$$)}for(F(null),P.length=0,B=0;Se.length;)Se.pop()();for(let t=0;t<K.length;t+=1){const n=K[t];ne.has(n)||(ne.add(n),n())}K.length=0}while(P.length);for(;ke.length;)ke.pop()();le=!1,ne.clear(),F(e)}function ht(e){if(e.fragment!==null){e.update(),$(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(x)}}let D;function mt(){return D||(D=Promise.resolve(),D.then(()=>{D=null})),D}function ye(e,t,n){e.dispatchEvent(ot(`${t?"intro":"outro"}${n}`))}const W=new Set;let M;function oe(){M={r:0,c:[],p:M}}function ie(){M.r||$(M.c),M=M.p}function N(e,t){e&&e.i&&(W.delete(e),e.i(t))}function T(e,t,n,l){if(e&&e.o){if(W.has(e))return;W.add(e),M.c.push(()=>{W.delete(e),l&&(n&&e.d(1),l())}),e.o(t)}else l&&l()}const _t={duration:0};function gt(e,t,n){let l=t(e,n),o=!0,i;const r=M;r.r+=1;function s(){const{delay:f=0,duration:u=300,easing:c=ze,tick:a=G,css:d}=l||_t;d&&(i=st(e,1,0,u,f,c,d));const _=xe()+f,k=_+u;x(()=>ye(e,!1,"start")),et(O=>{if(o){if(O>=k)return a(0,1),ye(e,!1,"end"),--r.r||$(r.c),!1;if(O>=_){const V=c((O-_)/u);a(1-V,V)}}return o})}return se(l)?mt().then(()=>{l=l(),s()}):s(),{end(f){f&&l.tick&&l.tick(1,0),o&&(i&&ut(e,i),o=!1)}}}function Fe(e){e&&e.c()}function de(e,t,n,l){const{fragment:o,after_update:i}=e.$$;o&&o.m(t,n),l||x(()=>{const r=e.$$.on_mount.map($e).filter(se);e.$$.on_destroy?e.$$.on_destroy.push(...r):$(r),e.$$.on_mount=[]}),i.forEach(x)}function he(e,t){const n=e.$$;n.fragment!==null&&($(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function pt(e,t){e.$$.dirty[0]===-1&&(P.push(e),dt(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function me(e,t,n,l,o,i,r,s=[-1]){const f=ae;F(e);const u=e.$$={fragment:null,ctx:[],props:i,update:G,not_equal:o,bound:be(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(f?f.$$.context:[])),callbacks:be(),dirty:s,skip_bound:!1,root:t.target||f.$$.root};r&&r(u.root);let c=!1;if(u.ctx=n?n(e,t.props||{},(a,d,..._)=>{const k=_.length?_[0]:d;return u.ctx&&o(u.ctx[a],u.ctx[a]=k)&&(!u.skip_bound&&u.bound[a]&&u.bound[a](k),c&&pt(e,a)),d}):[],u.update(),c=!0,$(u.before_update),u.fragment=l?l(u.ctx):!1,t.target){if(t.hydrate){const a=lt(t.target);u.fragment&&u.fragment.l(a),a.forEach(E)}else u.fragment&&u.fragment.c();t.intro&&N(e.$$.fragment),de(e,t.target,t.anchor,t.customElement),Pe()}F(f)}class _e{$destroy(){he(this,1),this.$destroy=G}$on(t,n){if(!se(n))return G;const l=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return l.push(n),()=>{const o=l.indexOf(n);o!==-1&&l.splice(o,1)}}$set(t){this.$$set&&!Ze(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function vt(e,{delay:t=0,duration:n=400,easing:l=ze}={}){const o=+getComputedStyle(e).opacity;return{delay:t,duration:n,easing:l,css:i=>`opacity: ${i*o}`}}function we(e,t,n){const l=e.slice();return l[7]=t[n],l}function bt(e){let t,n=e[3],l=[];for(let o=0;o<n.length;o+=1)l[o]=Ce(we(e,n,o));return{c(){for(let o=0;o<l.length;o+=1)l[o].c();t=fe()},m(o,i){for(let r=0;r<l.length;r+=1)l[r].m(o,i);I(o,t,i)},p(o,i){if(i&24){n=o[3];let r;for(r=0;r<n.length;r+=1){const s=we(o,n,r);l[r]?l[r].p(s,i):(l[r]=Ce(s),l[r].c(),l[r].m(t.parentNode,t))}for(;r<l.length;r+=1)l[r].d(1);l.length=n.length}},d(o){X(l,o),o&&E(t)}}}function St(e){let t,n;return{c(){t=b("span"),n=z(e[2]),C(t,"class","svelte-2adzpe"),y(t,"highlight",e[4]===e[2])},m(l,o){I(l,t,o),g(t,n)},p(l,o){o&4&&ee(n,l[2]),o&20&&y(t,"highlight",l[4]===l[2])},d(l){l&&E(t)}}}function Ce(e){let t,n=e[7]+"",l;return{c(){t=b("span"),l=z(n),C(t,"class","svelte-2adzpe"),y(t,"highlight",e[4]===e[7])},m(o,i){I(o,t,i),g(t,l)},p(o,i){i&8&&n!==(n=o[7]+"")&&ee(l,n),i&24&&y(t,"highlight",o[4]===o[7])},d(o){o&&E(t)}}}function kt(e){let t,n,l;function o(s,f){return s[2]?St:bt}let i=o(e),r=i(e);return{c(){t=b("div"),r.c(),C(t,"class","svelte-2adzpe"),y(t,"isSet",e[2]),y(t,"isSelected",e[0]),y(t,"isSiblingSelected",e[1]),y(t,"isLocked",e[5])},m(s,f){I(s,t,f),r.m(t,null),n||(l=q(t,"click",e[6]),n=!0)},p(s,[f]){i===(i=o(s))&&r?r.p(s,f):(r.d(1),r=i(s),r&&(r.c(),r.m(t,null))),f&4&&y(t,"isSet",s[2]),f&1&&y(t,"isSelected",s[0]),f&2&&y(t,"isSiblingSelected",s[1]),f&32&&y(t,"isLocked",s[5])},i:G,o:G,d(s){s&&E(t),r.d(),n=!1,l()}}}function yt(e,t,n){let{isSelected:l}=t,{isSiblingSelected:o}=t,{value:i}=t,{options:r}=t,{numberToHighlight:s}=t,{isLocked:f}=t;function u(c){ft.call(this,e,c)}return e.$$set=c=>{"isSelected"in c&&n(0,l=c.isSelected),"isSiblingSelected"in c&&n(1,o=c.isSiblingSelected),"value"in c&&n(2,i=c.value),"options"in c&&n(3,r=c.options),"numberToHighlight"in c&&n(4,s=c.numberToHighlight),"isLocked"in c&&n(5,f=c.isLocked)},[l,o,i,r,s,f,u]}class wt extends _e{constructor(t){super(),me(this,t,yt,kt,ue,{isSelected:0,isSiblingSelected:1,value:2,options:3,numberToHighlight:4,isLocked:5})}}const re=[1,2,3,4,5,6,7,8,9];function Je(){return Array(9).fill("")}function Q(e){return JSON.parse(JSON.stringify(e))}function Be(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e)+e)}function ge(e){return new Set(rowValues).size===rowValues.length}const pe="boardHistory";function Ct(){return localStorage.getItem(pe)!==null}function Et(){const e=localStorage.getItem(pe);return JSON.parse(e)}function Ee(e){localStorage.setItem(pe,JSON.stringify(e))}function Vt(){let e=Ve(),t=1;for(;!It(e);)e=Ve(),t++;return console.log(`Attempts: ${t}`),e}function It(e){return e.flat().every(t=>t!==void 0)}function Ve(){const e=Ot();for(let t=0;t<9;t++)for(let n=0;n<9;n++)if(Nt(e),!e[t][n]){const l=Ke(e,t,n);e[t][n]=l[Be(0,l.length)]}return e}function Ot(){const e=[];for(let t=0;t<9;t++){const n=Array(9).fill(0);e.push(n)}return e}function Nt(e){let t=Ie(e);for(;t!=null;)e[t.row][t.column]=t.value,t=Ie(e)}function Ie(e){for(let t=0;t<9;t++)for(let n=0;n<9;n++)if(!e[t][n]){const l=Ke(e,t,n,!0);if(l.length===1)return{row:t,column:n,value:l[0]}}return null}function Ke(e,t,n,l=!1){const o=e[t].filter(u=>u>0),i=Ht(e,n),r=Oe(e,t,n);if(!l&&Gt(n)&&Lt(t)){const a=Oe(e,t,8).filter(d=>!o.includes(d)&&!i.includes(d)&&!r.includes(d));if(a.length>0)return a}const s=[...o,...i,...r];return re.filter(u=>!s.includes(u))}function Gt(e){return[3,4,5].includes(e)}function Lt(e){return[1,4,7].includes(e)}function Oe(e,t,n){const l=[[0,1,2],[3,4,5],[6,7,8]],o=l.find(s=>s.includes(t)),i=l.find(s=>s.includes(n)),r=[];return o.forEach(s=>{i.forEach(f=>{const u=e[s][f];u>0&&r.push(u)})}),r}function Ht(e,t){const n=[];for(let l=0;l<9;l++){const o=e[l][t];o>0&&n.push(o)}return n}function Ne(){const e=[[1,2,3],[4,5,6],[7,8,9]],t=e,n=e,l=Vt(),o=[];return t.forEach(i=>{n.forEach(r=>{const s=[];i.forEach(f=>{r.forEach(u=>{s.push(At(l,f,u))})}),o.push(s)})}),o}function At(e,t,n){const l=Be(0,3)===0,o=ve(t,n);return l&&(o.value=Rt(e,t,n),o.isLocked=!0),o}function ve(e,t){return{row:e,column:t,value:"",isSelected:!1,isSiblingSelected:!1,options:Je(),isLocked:!1}}function Rt(e,t,n){return e[t-1][n-1]}function Mt(e,t,n){return e.map(l=>l.map(o=>(o.isSelected=o.row===t&&o.column===n,o.isSiblingSelected=We(o,ve(t,n)),o)))}function We(e,t){if(e.row===t.row&&e.column===t.column)return!1;const l=e.row===t.row,o=e.column===t.column;return l||o||Tt(e,t)}function Tt(e,t){const n=[[1,2,3],[4,5,6],[7,8,9]],l=n.find(i=>i.includes(e.row)),o=n.find(i=>i.includes(e.column));return l.includes(t.row)&&o.includes(t.column)}function zt(e,t,n){const l=Qe(e);if(!(!l||l.isLocked))return n?qt(l,t):(l.value=t,l.options=Je(),$t(e,l,t)),e}function $t(e,t,n){const l=n-1;e.forEach(o=>{o.forEach(i=>{We(i,t)&&(i.options[l]="")})})}function qt(e,t){const n=t-1;e.options[n]?e.options[n]="":e.options[n]=t}function Ut(e){const t=Qe(e);return t?Q(t):ve(0,0)}function Qe(e){return e.flat().find(t=>t.isSelected)}function jt(e){const t=Array(10);for(let n=1;n<=9;n++)t[n]=Dt(e,n);return t}function Dt(e,t){let n=9;return e.forEach(l=>{l.forEach(o=>{o.value===t&&n--})}),n}function Pt(e){return Ft(e)&&Jt(e)&&Bt(e)}function Ft(e){const t=e.flat();for(let n=1;n<=9;n++)if(t.filter(l=>l.row===n&&l.value>0).map(l=>l.value),!ge())return!1;return!0}function Jt(e){const t=e.flat();for(let n=1;n<=9;n++)if(t.filter(l=>l.column===n&&l.value>0).map(l=>l.value),!ge())return!1;return!0}function Bt(e){return e.forEach(t=>{if(t.filter(n=>n.value>0),!ge())return!1}),!0}function Ge(e,t,n){const l=e.slice();return l[20]=t[n],l}function Le(e,t,n){const l=e.slice();return l[23]=t[n],l[25]=n,l}function He(e,t,n){const l=e.slice();return l[26]=t[n],l[28]=n,l}function Kt(e){let t;return{c(){t=b("div"),C(t,"class",qe(`${Xe(e[28])?"horizontal":"vertical"}-divider`)+" svelte-h43v39")},m(n,l){I(n,t,l)},p:G,d(n){n&&E(t)}}}function Ae(e){let t,n,l=Ye(e[28]),o,i;function r(){return e[11](e[26])}t=new wt({props:{isSelected:e[26].isSelected,isSiblingSelected:e[26].isSiblingSelected,value:e[26].value,options:e[26].options,numberToHighlight:e[5].value,isLocked:e[26].isLocked}}),t.$on("click",r);let s=l&&Kt(e);return{c(){Fe(t.$$.fragment),n=H(),s&&s.c(),o=fe()},m(f,u){de(t,f,u),I(f,n,u),s&&s.m(f,u),I(f,o,u),i=!0},p(f,u){e=f;const c={};u&1&&(c.isSelected=e[26].isSelected),u&1&&(c.isSiblingSelected=e[26].isSiblingSelected),u&1&&(c.value=e[26].value),u&1&&(c.options=e[26].options),u&32&&(c.numberToHighlight=e[5].value),u&1&&(c.isLocked=e[26].isLocked),t.$set(c),l&&s.p(e,u)},i(f){i||(N(t.$$.fragment,f),i=!0)},o(f){T(t.$$.fragment,f),i=!1},d(f){he(t,f),f&&E(n),s&&s.d(f),f&&E(o)}}}function Wt(e){let t;return{c(){t=b("div"),C(t,"class",qe(`${Xe(e[25])?"horizontal":"vertical"}-divider`)+" svelte-h43v39")},m(n,l){I(n,t,l)},p:G,d(n){n&&E(t)}}}function Re(e){let t,n,l=Ye(e[25]),o,i,r=e[23],s=[];for(let c=0;c<r.length;c+=1)s[c]=Ae(He(e,r,c));const f=c=>T(s[c],1,1,()=>{s[c]=null});let u=l&&Wt(e);return{c(){t=b("div");for(let c=0;c<s.length;c+=1)s[c].c();n=H(),u&&u.c(),o=fe(),C(t,"class","cell-group svelte-h43v39")},m(c,a){I(c,t,a);for(let d=0;d<s.length;d+=1)s[d].m(t,null);I(c,n,a),u&&u.m(c,a),I(c,o,a),i=!0},p(c,a){if(a&161){r=c[23];let d;for(d=0;d<r.length;d+=1){const _=He(c,r,d);s[d]?(s[d].p(_,a),N(s[d],1)):(s[d]=Ae(_),s[d].c(),N(s[d],1),s[d].m(t,null))}for(oe(),d=r.length;d<s.length;d+=1)f(d);ie()}l&&u.p(c,a)},i(c){if(!i){for(let a=0;a<r.length;a+=1)N(s[a]);i=!0}},o(c){s=s.filter(Boolean);for(let a=0;a<s.length;a+=1)T(s[a]);i=!1},d(c){c&&E(t),X(s,c),c&&E(n),u&&u.d(c),c&&E(o)}}}function Me(e){let t,n,l=e[20]+"",o,i,r,s=e[4][e[20]]+"",f,u,c,a;function d(){return e[12](e[20])}return{c(){t=b("button"),n=b("div"),o=z(l),i=H(),r=b("div"),f=z(s),C(n,"class","number-input svelte-h43v39"),t.disabled=u=e[4][e[20]]<=0,C(t,"class","svelte-h43v39"),y(t,"highlight",e[1]&&e[5].options.includes(e[20]))},m(_,k){I(_,t,k),g(t,n),g(n,o),g(t,i),g(t,r),g(r,f),c||(a=q(t,"click",d),c=!0)},p(_,k){e=_,k&16&&s!==(s=e[4][e[20]]+"")&&ee(f,s),k&16&&u!==(u=e[4][e[20]]<=0)&&(t.disabled=u),k&34&&y(t,"highlight",e[1]&&e[5].options.includes(e[20]))},d(_){_&&E(t),c=!1,a()}}}function Te(e){let t,n=e[2]?"Is":"Is Not",l,o,i,r;return{c(){t=b("div"),l=z(n),o=z(" Valid!"),C(t,"class","validity svelte-h43v39"),y(t,"isValid",e[2])},m(s,f){I(s,t,f),g(t,l),g(t,o),r=!0},p(s,f){(!r||f&4)&&n!==(n=s[2]?"Is":"Is Not")&&ee(l,n),(!r||f&4)&&y(t,"isValid",s[2])},i(s){r||(i&&i.end(1),r=!0)},o(s){i=gt(t,vt,{}),r=!1},d(s){s&&E(t),s&&i&&i.end()}}}function Qt(e){let t,n,l,o,i,r,s,f,u,c,a,d,_,k,O,V,A,J,L=e[0],p=[];for(let h=0;h<L.length;h+=1)p[h]=Re(Le(e,L,h));const te=h=>T(p[h],1,1,()=>{p[h]=null});let R=re,v=[];for(let h=0;h<R.length;h+=1)v[h]=Me(Ge(e,R,h));let S=e[3]&&Te(e);return{c(){t=b("div"),n=b("div");for(let h=0;h<p.length;h+=1)p[h].c();l=H(),o=b("div");for(let h=0;h<v.length;h+=1)v[h].c();i=H(),r=b("button"),r.textContent="/",s=H(),f=b("div"),u=b("button"),u.textContent="New Game",c=H(),a=b("button"),a.textContent="Validate",d=H(),_=b("button"),_.textContent="Undo",k=H(),O=b("div"),S&&S.c(),C(n,"class","board svelte-h43v39"),C(r,"class","svelte-h43v39"),y(r,"optionsMode",e[1]),C(o,"class","number-inputs svelte-h43v39"),C(u,"class","svelte-h43v39"),C(a,"class","svelte-h43v39"),C(_,"class","svelte-h43v39"),C(f,"class","controls svelte-h43v39"),C(t,"class","game svelte-h43v39")},m(h,w){I(h,t,w),g(t,n);for(let m=0;m<p.length;m+=1)p[m].m(n,null);g(t,l),g(t,o);for(let m=0;m<v.length;m+=1)v[m].m(o,null);g(o,i),g(o,r),g(t,s),g(t,f),g(f,u),g(f,c),g(f,a),g(f,d),g(f,_),g(t,k),g(t,O),S&&S.m(O,null),V=!0,A||(J=[q(r,"click",e[13]),q(u,"click",e[14]),q(a,"click",e[15]),q(_,"click",e[16])],A=!0)},p(h,[w]){if(w&161){L=h[0];let m;for(m=0;m<L.length;m+=1){const j=Le(h,L,m);p[m]?(p[m].p(j,w),N(p[m],1)):(p[m]=Re(j),p[m].c(),N(p[m],1),p[m].m(n,null))}for(oe(),m=L.length;m<p.length;m+=1)te(m);ie()}if(w&306){R=re;let m;for(m=0;m<R.length;m+=1){const j=Ge(h,R,m);v[m]?v[m].p(j,w):(v[m]=Me(j),v[m].c(),v[m].m(o,i))}for(;m<v.length;m+=1)v[m].d(1);v.length=R.length}(!V||w&2)&&y(r,"optionsMode",h[1]),h[3]?S?(S.p(h,w),w&8&&N(S,1)):(S=Te(h),S.c(),N(S,1),S.m(O,null)):S&&(oe(),T(S,1,1,()=>{S=null}),ie())},i(h){if(!V){for(let w=0;w<L.length;w+=1)N(p[w]);N(S),V=!0}},o(h){p=p.filter(Boolean);for(let w=0;w<p.length;w+=1)T(p[w]);T(S),V=!1},d(h){h&&E(t),X(p,h),X(v,h),S&&S.d(),A=!1,$(J)}}}function Xe(e){return e===2||e===5}function Ye(e){return e<8}function Xt(e,t,n){let l,o,i=[],r=[],s=!1,f=!1,u=!1;c();function c(){Ct()?(r=Et(),n(0,i=Q(r.at(-1)))):(n(0,i=Ne()),d())}function a(){n(0,i=Ne()),r=[],d()}function d(){r.push(Q(i)),Ee(r)}function _(v,S){n(0,i=Mt(i,v,S))}function k(v){n(0,i=zt(i,v,s)),d()}function O(){r.length>1&&(r.pop(),Ee(r),n(0,i=Q(r.at(-1))))}function V(){n(2,f=Pt(i)),n(3,u=!0),setTimeout(()=>n(3,u=!1),2e3)}const A=v=>_(v.row,v.column),J=v=>k(v),L=()=>n(1,s=!s),p=()=>a(),te=()=>V(),R=()=>O();return e.$$.update=()=>{e.$$.dirty&1&&n(5,l=Ut(i)),e.$$.dirty&1&&n(4,o=jt(i))},[i,s,f,u,o,l,a,_,k,O,V,A,J,L,p,te,R]}class Yt extends _e{constructor(t){super(),me(this,t,Xt,Qt,ue,{})}}function Zt(e){let t,n,l;return n=new Yt({}),{c(){t=b("main"),Fe(n.$$.fragment)},m(o,i){I(o,t,i),de(n,t,null),l=!0},p:G,i(o){l||(N(n.$$.fragment,o),l=!0)},o(o){T(n.$$.fragment,o),l=!1},d(o){o&&E(t),he(n)}}}class xt extends _e{constructor(t){super(),me(this,t,null,Zt,ue,{})}}new xt({target:document.getElementById("app")});
