(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))o(l);new MutationObserver(l=>{for(const i of l)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function t(l){const i={};return l.integrity&&(i.integrity=l.integrity),l.referrerpolicy&&(i.referrerPolicy=l.referrerpolicy),l.crossorigin==="use-credentials"?i.credentials="include":l.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(l){if(l.ep)return;l.ep=!0;const i=t(l);fetch(l.href,i)}})();function G(){}const $e=e=>e;function ze(e){return e()}function Re(){return Object.create(null)}function B(e){e.forEach(ze)}function pe(e){return typeof e=="function"}function he(e,n){return e!=e?n==n:e!==n||e&&typeof e=="object"||typeof e=="function"}function wn(e){return Object.keys(e).length===0}function Pe(e){return e==null?"":e}const Qe=typeof window<"u";let Sn=Qe?()=>window.performance.now():()=>Date.now(),ge=Qe?e=>requestAnimationFrame(e):G;const D=new Set;function Ke(e){D.forEach(n=>{n.c(e)||(D.delete(n),n.f())}),D.size!==0&&ge(Ke)}function On(e){let n;return D.size===0&&ge(Ke),{promise:new Promise(t=>{D.add(n={c:e,f:t})}),abort(){D.delete(n)}}}function h(e,n){e.appendChild(n)}function Je(e){if(!e)return document;const n=e.getRootNode?e.getRootNode():e.ownerDocument;return n&&n.host?n:e.ownerDocument}function In(e){const n=w("style");return vn(Je(e),n),n.sheet}function vn(e,n){return h(e.head||e,n),n.sheet}function E(e,n,t){e.insertBefore(n,t||null)}function k(e){e.parentNode&&e.parentNode.removeChild(e)}function ee(e,n){for(let t=0;t<e.length;t+=1)e[t]&&e[t].d(n)}function w(e){return document.createElement(e)}function M(e){return document.createTextNode(e)}function H(){return M(" ")}function _e(){return M("")}function W(e,n,t,o){return e.addEventListener(n,t,o),()=>e.removeEventListener(n,t,o)}function S(e,n,t){t==null?e.removeAttribute(n):e.getAttribute(n)!==t&&e.setAttribute(n,t)}function yn(e){return Array.from(e.childNodes)}function le(e,n){n=""+n,e.wholeText!==n&&(e.data=n)}function v(e,n,t){e.classList[t?"add":"remove"](n)}function kn(e,n,{bubbles:t=!1,cancelable:o=!1}={}){const l=document.createEvent("CustomEvent");return l.initCustomEvent(e,t,o,n),l}const ne=new Map;let te=0;function xn(e){let n=5381,t=e.length;for(;t--;)n=(n<<5)-n^e.charCodeAt(t);return n>>>0}function bn(e,n){const t={stylesheet:In(n),rules:{}};return ne.set(e,t),t}function Vn(e,n,t,o,l,i,s,u=0){const f=16.666/o;let r=`{
`;for(let x=0;x<=1;x+=f){const N=n+(t-n)*i(x);r+=x*100+`%{${s(N,1-N)}}
`}const c=r+`100% {${s(t,1-t)}}
}`,a=`__svelte_${xn(c)}_${u}`,d=Je(e),{stylesheet:g,rules:C}=ne.get(d)||bn(d,e);C[a]||(C[a]=!0,g.insertRule(`@keyframes ${a} ${c}`,g.cssRules.length));const q=e.style.animation||"";return e.style.animation=`${q?`${q}, `:""}${a} ${o}ms linear ${l}ms 1 both`,te+=1,a}function En(e,n){const t=(e.style.animation||"").split(", "),o=t.filter(n?i=>i.indexOf(n)<0:i=>i.indexOf("__svelte")===-1),l=t.length-o.length;l&&(e.style.animation=o.join(", "),te-=l,te||Rn())}function Rn(){ge(()=>{te||(ne.forEach(e=>{const{ownerNode:n}=e.stylesheet;n&&k(n)}),ne.clear())})}let Ce;function K(e){Ce=e}function qn(e,n){const t=e.$$.callbacks[n.type];t&&t.slice().forEach(o=>o.call(this,n))}const Q=[],qe=[],Y=[],Ae=[],An=Promise.resolve();let ce=!1;function Nn(){ce||(ce=!0,An.then(Xe))}function oe(e){Y.push(e)}const ue=new Set;let X=0;function Xe(){const e=Ce;do{for(;X<Q.length;){const n=Q[X];X++,K(n),Gn(n.$$)}for(K(null),Q.length=0,X=0;qe.length;)qe.pop()();for(let n=0;n<Y.length;n+=1){const t=Y[n];ue.has(t)||(ue.add(t),t())}Y.length=0}while(Q.length);for(;Ae.length;)Ae.pop()();ce=!1,ue.clear(),K(e)}function Gn(e){if(e.fragment!==null){e.update(),B(e.before_update);const n=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,n),e.after_update.forEach(oe)}}let P;function Tn(){return P||(P=Promise.resolve(),P.then(()=>{P=null})),P}function Ne(e,n,t){e.dispatchEvent(kn(`${n?"intro":"outro"}${t}`))}const Z=new Set;let L;function fe(){L={r:0,c:[],p:L}}function ae(){L.r||B(L.c),L=L.p}function A(e,n){e&&e.i&&(Z.delete(e),e.i(n))}function j(e,n,t,o){if(e&&e.o){if(Z.has(e))return;Z.add(e),L.c.push(()=>{Z.delete(e),o&&(t&&e.d(1),o())}),e.o(n)}else o&&o()}const Hn={duration:0};function Ln(e,n,t){let o=n(e,t),l=!0,i;const s=L;s.r+=1;function u(){const{delay:f=0,duration:r=300,easing:c=$e,tick:a=G,css:d}=o||Hn;d&&(i=Vn(e,1,0,r,f,c,d));const g=Sn()+f,C=g+r;oe(()=>Ne(e,!1,"start")),On(q=>{if(l){if(q>=C)return a(0,1),Ne(e,!1,"end"),--s.r||B(s.c),!1;if(q>=g){const x=c((q-g)/r);a(1-x,x)}}return l})}return pe(o)?Tn().then(()=>{o=o(),u()}):u(),{end(f){f&&o.tick&&o.tick(1,0),l&&(i&&En(e,i),l=!1)}}}function Ye(e){e&&e.c()}function we(e,n,t,o){const{fragment:l,after_update:i}=e.$$;l&&l.m(n,t),o||oe(()=>{const s=e.$$.on_mount.map(ze).filter(pe);e.$$.on_destroy?e.$$.on_destroy.push(...s):B(s),e.$$.on_mount=[]}),i.forEach(oe)}function Se(e,n){const t=e.$$;t.fragment!==null&&(B(t.on_destroy),t.fragment&&t.fragment.d(n),t.on_destroy=t.fragment=null,t.ctx=[])}function jn(e,n){e.$$.dirty[0]===-1&&(Q.push(e),Nn(),e.$$.dirty.fill(0)),e.$$.dirty[n/31|0]|=1<<n%31}function Oe(e,n,t,o,l,i,s,u=[-1]){const f=Ce;K(e);const r=e.$$={fragment:null,ctx:[],props:i,update:G,not_equal:l,bound:Re(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(f?f.$$.context:[])),callbacks:Re(),dirty:u,skip_bound:!1,root:n.target||f.$$.root};s&&s(r.root);let c=!1;if(r.ctx=t?t(e,n.props||{},(a,d,...g)=>{const C=g.length?g[0]:d;return r.ctx&&l(r.ctx[a],r.ctx[a]=C)&&(!r.skip_bound&&r.bound[a]&&r.bound[a](C),c&&jn(e,a)),d}):[],r.update(),c=!0,B(r.before_update),r.fragment=o?o(r.ctx):!1,n.target){if(n.hydrate){const a=yn(n.target);r.fragment&&r.fragment.l(a),a.forEach(k)}else r.fragment&&r.fragment.c();n.intro&&A(e.$$.fragment),we(e,n.target,n.anchor,n.customElement),Xe()}K(f)}class Ie{$destroy(){Se(this,1),this.$destroy=G}$on(n,t){if(!pe(t))return G;const o=this.$$.callbacks[n]||(this.$$.callbacks[n]=[]);return o.push(t),()=>{const l=o.indexOf(t);l!==-1&&o.splice(l,1)}}$set(n){this.$$set&&!wn(n)&&(this.$$.skip_bound=!0,this.$$set(n),this.$$.skip_bound=!1)}}function Mn(e,{delay:n=0,duration:t=400,easing:o=$e}={}){const l=+getComputedStyle(e).opacity;return{delay:n,duration:t,easing:o,css:i=>`opacity: ${i*l}`}}function Ge(e,n,t){const o=e.slice();return o[7]=n[t],o}function Fn(e){let n,t=e[3],o=[];for(let l=0;l<t.length;l+=1)o[l]=Te(Ge(e,t,l));return{c(){for(let l=0;l<o.length;l+=1)o[l].c();n=_e()},m(l,i){for(let s=0;s<o.length;s+=1)o[s].m(l,i);E(l,n,i)},p(l,i){if(i&24){t=l[3];let s;for(s=0;s<t.length;s+=1){const u=Ge(l,t,s);o[s]?o[s].p(u,i):(o[s]=Te(u),o[s].c(),o[s].m(n.parentNode,n))}for(;s<o.length;s+=1)o[s].d(1);o.length=t.length}},d(l){ee(o,l),l&&k(n)}}}function Bn(e){let n,t;return{c(){n=w("span"),t=M(e[2]),S(n,"class","svelte-1a31dr7"),v(n,"highlight",e[4]===e[2])},m(o,l){E(o,n,l),h(n,t)},p(o,l){l&4&&le(t,o[2]),l&20&&v(n,"highlight",o[4]===o[2])},d(o){o&&k(n)}}}function Te(e){let n,t=e[7]+"",o;return{c(){n=w("span"),o=M(t),S(n,"class","svelte-1a31dr7"),v(n,"highlight",e[4]===e[7])},m(l,i){E(l,n,i),h(n,o)},p(l,i){i&8&&t!==(t=l[7]+"")&&le(o,t),i&24&&v(n,"highlight",l[4]===l[7])},d(l){l&&k(n)}}}function Wn(e){let n,t,o;function l(u,f){return u[2]?Bn:Fn}let i=l(e),s=i(e);return{c(){n=w("div"),s.c(),S(n,"class","svelte-1a31dr7"),v(n,"isSet",e[2]),v(n,"isSelected",e[0]),v(n,"isSiblingSelected",e[1]),v(n,"isLocked",e[5])},m(u,f){E(u,n,f),s.m(n,null),t||(o=W(n,"click",e[6]),t=!0)},p(u,[f]){i===(i=l(u))&&s?s.p(u,f):(s.d(1),s=i(u),s&&(s.c(),s.m(n,null))),f&4&&v(n,"isSet",u[2]),f&1&&v(n,"isSelected",u[0]),f&2&&v(n,"isSiblingSelected",u[1]),f&32&&v(n,"isLocked",u[5])},i:G,o:G,d(u){u&&k(n),s.d(),t=!1,o()}}}function Dn(e,n,t){let{isSelected:o}=n,{isSiblingSelected:l}=n,{value:i}=n,{options:s}=n,{numberToHighlight:u}=n,{isLocked:f}=n;function r(c){qn.call(this,e,c)}return e.$$set=c=>{"isSelected"in c&&t(0,o=c.isSelected),"isSiblingSelected"in c&&t(1,l=c.isSiblingSelected),"value"in c&&t(2,i=c.value),"options"in c&&t(3,s=c.options),"numberToHighlight"in c&&t(4,u=c.numberToHighlight),"isLocked"in c&&t(5,f=c.isLocked)},[o,l,i,s,u,f,r]}class Un extends Ie{constructor(n){super(),Oe(this,n,Dn,Wn,he,{isSelected:0,isSiblingSelected:1,value:2,options:3,numberToHighlight:4,isLocked:5})}}const O=[1,2,3,4,5,6,7,8,9],R=0;function Ze(){return Array(9).fill("")}function F(e){return JSON.parse(JSON.stringify(e))}function U(e){return new Set(e).size===e.length}function en(e){return e.sort((n,t)=>.5-Math.random())}const ve="boardHistory";function $n(){return localStorage.getItem(ve)!==null}function zn(){const e=localStorage.getItem(ve);return JSON.parse(e)}function He(e){localStorage.setItem(ve,JSON.stringify(e))}function nn(e){let n=nt(e);return Jn(n),de(n),Xn(n)||(n=Pn(n)),ft(n)}function Pn(e){let n=F(e);const t=[];e:for(let o=0;o<O.length;o++)for(let l=0;l<O.length;l++){for(de(n);!ie(n);)if(t.length>0){const s=t.pop();n=s.board,o=s.rowIndex,l=s.columnIndex,de(n)}else break e;const i=n.cellRows[o][l];rn(i)||Qn(i,o,l,n,t)}return n}function Qn(e,n,t,o,l){const i=e.options.filter(u=>u!==R);if(i.length<2)throw new Error("Found a cell with less than 2 options, not sure what to do here...");const s=i[Math.floor(Math.random()*i.length)];Kn(s,n,t,o,l),e.onlyOptionValue=s,tn(e,o)}function Kn(e,n,t,o,l){const i=F(o),s=i.cellRows[n][t];s.options[e]=R,s.optionsCount--,s.optionsCount===1&&i.singleOptionCellCoordinates.push({rowIndex:s.rowIndex,columnIndex:s.columnIndex}),on(e,s,i),l.push({board:i,rowIndex:n,columnIndex:t})}function Jn(e){ot(e),ut(e)}function ie(e){return!e.hasCellWithNoOptions&&!e.hasCellThatIsOnlyOptionForMultipleValues}function Xn(e){return e.valuesCount===81}function de(e){for(;ie(e)&&Yn(e);)Zn(e),rt(e)}function Yn(e){return e.singleOptionCellCoordinates.length>0||e.onlyOptionCellCoordinates.length>0}function Zn(e){for(;e.onlyOptionCellCoordinates.length>0&&ie(e);){const n=e.onlyOptionCellCoordinates.shift(),t=e.cellRows[n.rowIndex][n.columnIndex];t.value||tn(t,e)}}function tn(e,n){const t=e.onlyOptionValue;dn(e,t,n);const o=e.options.filter(l=>l!==t&&l!==R);ke(e),et(e,o,n)}function et(e,n,t){n.forEach(o=>{on(o,e,t)})}function on(e,n,t){ln(e,n,t),sn(e,n,t),un(e,n,t)}function ln(e,n,t){const o=t.rowsOptionsCounts[n.rowIndex];o[e]--,o[e]===1&&an(e,n.rowIndex,t)}function sn(e,n,t){const o=t.columnsOptionsCounts[n.columnIndex];o[e]--,o[e]===1&&fn(e,n.columnIndex,t)}function un(e,n,t){const o=t.squaresOptionsCounts[n.squareIndex];o[e]--,o[e]===1&&cn(e,n.squareIndex,t)}function nt(e){const n=()=>Array(O.length+1).fill(0),t=()=>Array(O.length).fill().map(n),o={cellRows:Array(O.length).fill().map(()=>Array()),valuesCount:0,rowsOptionsCounts:t(),columnsOptionsCounts:t(),squaresOptionsCounts:t(),singleOptionCellCoordinates:[],onlyOptionCellCoordinates:[],hasCellWithNoOptions:!1,hasCellThatIsOnlyOptionForMultipleValues:!1};return e.forEach((l,i)=>{l.forEach((s,u)=>{const f=_t(i,u),r=tt(s,i,u,f);s!==R&&(o.valuesCount++,ke(r)),o.cellRows[i].push(r)})}),o}function tt(e,n,t,o){return{value:e,rowIndex:n,columnIndex:t,squareIndex:o,optionsCount:0,options:Array(O.length+1).fill(0)}}function ot(e){e.cellRows.forEach(n=>{n.forEach(t=>{rn(t)||(lt(t,e),t.optionsCount===0&&(e.hasCellWithNoOptions=!0),t.optionsCount===1&&e.singleOptionCellCoordinates.push({rowIndex:t.rowIndex,columnIndex:t.columnIndex}))})})}function rn(e){return e.value!==R}function lt(e,n){O.forEach(t=>{it(t,e,n)&&st(t,e,n)})}function it(e,n,t){const o=u=>u.value===e,l=()=>t.cellRows[n.rowIndex].some(o),i=()=>t.cellRows.some(u=>o(u[n.columnIndex])),s=()=>{const u=be(n.squareIndex);for(let f=u.minRow;f<=u.maxRow;f++)for(let r=u.minColumn;r<=u.maxColumn;r++)if(o(t.cellRows[f][r]))return!0;return!1};return!l()&&!i()&&!s()}function st(e,n,t){n.options[e]=e,n.optionsCount++,t.rowsOptionsCounts[n.rowIndex][e]++,t.columnsOptionsCounts[n.columnIndex][e]++,t.squaresOptionsCounts[n.squareIndex][e]++}function ut(e){e.rowsOptionsCounts.forEach((n,t)=>{re(n,t,e,an)}),e.columnsOptionsCounts.forEach((n,t)=>{re(n,t,e,fn)}),e.squaresOptionsCounts.forEach((n,t)=>{re(n,t,e,cn)})}function re(e,n,t,o){e.forEach((l,i)=>{l===1&&o(i,n,t)})}function cn(e,n,t){let o;const l=be(n);e:for(let i=l.minRow;i<=l.maxRow;i++)for(let s=l.minColumn;s<=l.maxColumn;s++){const u=t.cellRows[i][s];if(u.options&&u.options.includes(e)){o=u;break e}}ye(e,o,t)}function fn(e,n,t){let o;for(let l=0;l<O.length;l++){const i=t.cellRows[l][n];if(i.options&&i.options.includes(e)){o=i;break}}ye(e,o,t)}function an(e,n,t){const o=t.cellRows[n].find(l=>l.options&&l.options.includes(e));ye(e,o,t)}function ye(e,n,t){n.optionsCount===1||(n.onlyOptionValue?n.onlyOptionValue!==e&&(t.hasCellThatIsOnlyOptionForMultipleValues=!0):(n.onlyOptionValue=e,t.onlyOptionCellCoordinates.push({rowIndex:n.rowIndex,columnIndex:n.columnIndex})))}function rt(e){for(;e.singleOptionCellCoordinates.length>0&&ie(e);){const n=e.singleOptionCellCoordinates.shift(),t=e.cellRows[n.rowIndex][n.columnIndex];t.value||ct(t,e)}}function ct(e,n){const t=e.options.find(o=>o!==R);dn(e,t,n),ke(e)}function ke(e){e.options=null,e.optionsCount=0}function dn(e,n,t){e.value=n,t.valuesCount++,dt(e,n,t),at(e,n,t)}function ft(e){const n=[];return e.cellRows.forEach(t=>{const o=[];t.forEach(l=>{o.push(l.value)}),n.push(o)}),n}function at(e,n,t){mt(e,t).forEach(l=>{l.options[n]!==R&&(l.options[n]=R,l.optionsCount--,l.optionsCount===1&&t.singleOptionCellCoordinates.push({rowIndex:l.rowIndex,columnIndex:l.columnIndex}),l.optionsCount===0&&(t.hasCellWithNoOptions=!0),l.rowIndex!==e.rowIndex&&ln(n,l,t),l.columnIndex!==e.columnIndex&&sn(n,l,t),l.squareIndex!==e.squareIndex&&un(n,l,t))})}function dt(e,n,t){t.rowsOptionsCounts[e.rowIndex][n]=0,t.columnsOptionsCounts[e.columnIndex][n]=0,t.squaresOptionsCounts[e.squareIndex][n]=0}function mt(e,n){const t=pt(e,n),o=ht(e,n),l=gt(e,n).filter(i=>i.rowIndex!==e.rowIndex&&i.columnIndex!==e.columnIndex);return[...t,...o,...l]}function pt(e,n){return n.cellRows[e.rowIndex].filter(t=>xe(t,e))}function ht(e,n){const t=[];return n.cellRows.forEach(o=>{const l=o[e.columnIndex];xe(l,e)&&t.push(l)}),t}function gt(e,n){const t=[],o=be(e.squareIndex);for(let l=o.minRow;l<=o.maxRow;l++)for(let i=o.minColumn;i<=o.maxColumn;i++){const s=n.cellRows[l][i];xe(s,e)&&t.push(s)}return t}function xe(e,n){return e!==n&&e.options}function _t(e,n){const t=[0,0,0,3,3,3,6,6,6],o=[0,0,0,1,1,1,2,2,2],l=t[e],i=o[n];return l+i}function be(e){const n=[0,0,0,3,3,3,6,6,6],t=[2,2,2,5,5,5,8,8,8],o=[0,3,6,0,3,6,0,3,6],l=[2,5,8,2,5,8,2,5,8];return{minRow:n[e],maxRow:t[e],minColumn:o[e],maxColumn:l[e]}}function Ct(){return St()}function wt(e){return mn(nn(e))}function St(){const e=bt();return Ot(e)}function Ot(e){return en(yt()).forEach(t=>{const o=e[t.row][t.column];e[t.row][t.column]=R,It(e)||(e[t.row][t.column]=o)}),e}function It(e){return vt(e)===1}function vt(e){if(!kt(e))return mn(e)?1:0;const n=2;let t=0;for(let o=0;o<O.length;o++)for(let l=0;l<O.length;l++)if(xt(e,o,l)){let i=0;const s=en(Gt(e,o,l));for(let u=0;u<s.length;u++){const f=F(e);if(f[o][l]=s[u],wt(f)){if(i++,i===n)return i;t=i}}}return t}function yt(){const e=[];return O.forEach((n,t)=>{O.forEach((o,l)=>{e.push({row:t,column:l})})}),e}function kt(e){return e.flat().some(n=>n===R)}function xt(e,n,t){return e[n][t]===R}function bt(){return nn(Nt())}function mn(e){return Et(e)}function Vt(e){return e.flat().every(n=>O.includes(n))}function Et(e){return Vt(e)&&Rt(e)&&qt(e)&&At(e)}function Rt(e){return e.every(n=>U(n))}function qt(e){return O.every((n,t)=>{const o=pn(e,t);return U(o)})}function At(e){const n=[0,4,7],t=n,o=n;return t.every(l=>o.every(i=>{const s=me(e,l,i);return U(s)}))}function Nt(){const e=[];for(let n=0;n<O.length;n++){const t=Array(O.length).fill(R);e.push(t)}return e}function Gt(e,n,t,o=!1){const l=Lt(e,n),i=pn(e,t),s=me(e,n,t);if(!o&&Tt(t)&&Ht(n)){const a=me(e,n,8).filter(d=>!l.includes(d)&&!i.includes(d)&&!s.includes(d));if(a.length>0)return a}const u=[...l,...i,...s];return O.filter(r=>!u.includes(r))}function Tt(e){return[3,4,5].includes(e)}function Ht(e){return[1,4,7].includes(e)}function me(e,n,t){const o=[[0,1,2],[3,4,5],[6,7,8]],l=o.find(u=>u.includes(n)),i=o.find(u=>u.includes(t)),s=[];return l.forEach(u=>{i.forEach(f=>{s.push(e[u][f])})}),Ve(s)}function pn(e,n){const t=[];for(let o=0;o<O.length;o++)t.push(e[o][n]);return Ve(t)}function Lt(e,n){return Ve(e[n])}function Ve(e){return e.filter(n=>n!==R)}function Le(){const e=[[1,2,3],[4,5,6],[7,8,9]],n=e,t=e,o=Ct(),l=[];return n.forEach(i=>{t.forEach(s=>{const u=[];i.forEach(f=>{s.forEach(r=>{u.push(jt(o,f,r))})}),l.push(u)})}),l}function jt(e,n,t){const o=Ee(n,t),l=Mt(e,n,t);return l!==0&&(o.value=l,o.isLocked=!0),o}function Ee(e,n){return{row:e,column:n,value:"",isSelected:!1,isSiblingSelected:!1,options:Ze(),isLocked:!1}}function Mt(e,n,t){return e[n-1][t-1]}function Ft(e,n,t){return e.map(o=>o.map(l=>(l.isSelected=l.row===n&&l.column===t,l.isSiblingSelected=hn(l,Ee(n,t)),l)))}function hn(e,n){if(e.row===n.row&&e.column===n.column)return!1;const o=e.row===n.row,l=e.column===n.column;return o||l||Bt(e,n)}function Bt(e,n){const t=[[1,2,3],[4,5,6],[7,8,9]],o=t.find(i=>i.includes(e.row)),l=t.find(i=>i.includes(e.column));return o.includes(n.row)&&l.includes(n.column)}function Wt(e,n,t){const o=gn(e);if(!(!o||o.isLocked))return t?Ut(o,n):(o.value=n,o.options=Ze(),Dt(e,o,n)),e}function Dt(e,n,t){const o=t-1;e.forEach(l=>{l.forEach(i=>{hn(i,n)&&(i.options[o]="")})})}function Ut(e,n){const t=n-1;e.options[t]?e.options[t]="":e.options[t]=n}function $t(e){const n=gn(e);return n?F(n):Ee(0,0)}function gn(e){return e.flat().find(n=>n.isSelected)}function zt(e){const n=Array(10);for(let t=1;t<=9;t++)n[t]=Pt(e,t);return n}function Pt(e,n){let t=9;return e.forEach(o=>{o.forEach(l=>{l.value===n&&t--})}),t}function Qt(e){return Kt(e)&&Jt(e)&&Xt(e)}function Kt(e){const n=e.flat();for(let t=1;t<=9;t++){const o=n.filter(l=>l.row===t&&l.value>0).map(l=>l.value);if(!U(o))return!1}return!0}function Jt(e){const n=e.flat();for(let t=1;t<=9;t++){const o=n.filter(l=>l.column===t&&l.value>0).map(l=>l.value);if(!U(o))return!1}return!0}function Xt(e){return e.forEach(n=>{const t=n.filter(o=>o.value>0);if(!U(t))return!1}),!0}function je(e,n,t){const o=e.slice();return o[20]=n[t],o}function Me(e,n,t){const o=e.slice();return o[23]=n[t],o[25]=t,o}function Fe(e,n,t){const o=e.slice();return o[26]=n[t],o[28]=t,o}function Yt(e){let n;return{c(){n=w("div"),S(n,"class",Pe(`${_n(e[28])?"horizontal":"vertical"}-divider`)+" svelte-4nrjud")},m(t,o){E(t,n,o)},p:G,d(t){t&&k(n)}}}function Be(e){let n,t,o=Cn(e[28]),l,i;function s(){return e[11](e[26])}n=new Un({props:{isSelected:e[26].isSelected,isSiblingSelected:e[26].isSiblingSelected,value:e[26].value,options:e[26].options,numberToHighlight:e[5].value,isLocked:e[26].isLocked}}),n.$on("click",s);let u=o&&Yt(e);return{c(){Ye(n.$$.fragment),t=H(),u&&u.c(),l=_e()},m(f,r){we(n,f,r),E(f,t,r),u&&u.m(f,r),E(f,l,r),i=!0},p(f,r){e=f;const c={};r&1&&(c.isSelected=e[26].isSelected),r&1&&(c.isSiblingSelected=e[26].isSiblingSelected),r&1&&(c.value=e[26].value),r&1&&(c.options=e[26].options),r&32&&(c.numberToHighlight=e[5].value),r&1&&(c.isLocked=e[26].isLocked),n.$set(c),o&&u.p(e,r)},i(f){i||(A(n.$$.fragment,f),i=!0)},o(f){j(n.$$.fragment,f),i=!1},d(f){Se(n,f),f&&k(t),u&&u.d(f),f&&k(l)}}}function Zt(e){let n;return{c(){n=w("div"),S(n,"class",Pe(`${_n(e[25])?"horizontal":"vertical"}-divider`)+" svelte-4nrjud")},m(t,o){E(t,n,o)},p:G,d(t){t&&k(n)}}}function We(e){let n,t,o=Cn(e[25]),l,i,s=e[23],u=[];for(let c=0;c<s.length;c+=1)u[c]=Be(Fe(e,s,c));const f=c=>j(u[c],1,1,()=>{u[c]=null});let r=o&&Zt(e);return{c(){n=w("div");for(let c=0;c<u.length;c+=1)u[c].c();t=H(),r&&r.c(),l=_e(),S(n,"class","cell-group svelte-4nrjud")},m(c,a){E(c,n,a);for(let d=0;d<u.length;d+=1)u[d].m(n,null);E(c,t,a),r&&r.m(c,a),E(c,l,a),i=!0},p(c,a){if(a&161){s=c[23];let d;for(d=0;d<s.length;d+=1){const g=Fe(c,s,d);u[d]?(u[d].p(g,a),A(u[d],1)):(u[d]=Be(g),u[d].c(),A(u[d],1),u[d].m(n,null))}for(fe(),d=s.length;d<u.length;d+=1)f(d);ae()}o&&r.p(c,a)},i(c){if(!i){for(let a=0;a<s.length;a+=1)A(u[a]);i=!0}},o(c){u=u.filter(Boolean);for(let a=0;a<u.length;a+=1)j(u[a]);i=!1},d(c){c&&k(n),ee(u,c),c&&k(t),r&&r.d(c),c&&k(l)}}}function De(e){let n,t,o=e[20]+"",l,i,s,u=e[4][e[20]]+"",f,r,c,a;function d(){return e[12](e[20])}return{c(){n=w("button"),t=w("div"),l=M(o),i=H(),s=w("div"),f=M(u),S(t,"class","number-input svelte-4nrjud"),n.disabled=r=e[4][e[20]]<=0,S(n,"class","svelte-4nrjud"),v(n,"highlight",e[1]&&e[5].options.includes(e[20]))},m(g,C){E(g,n,C),h(n,t),h(t,l),h(n,i),h(n,s),h(s,f),c||(a=W(n,"click",d),c=!0)},p(g,C){e=g,C&16&&u!==(u=e[4][e[20]]+"")&&le(f,u),C&16&&r!==(r=e[4][e[20]]<=0)&&(n.disabled=r),C&34&&v(n,"highlight",e[1]&&e[5].options.includes(e[20]))},d(g){g&&k(n),c=!1,a()}}}function Ue(e){let n,t=e[2]?"Is":"Is Not",o,l,i,s;return{c(){n=w("div"),o=M(t),l=M(" Valid!"),S(n,"class","svelte-4nrjud"),v(n,"isValid",e[2])},m(u,f){E(u,n,f),h(n,o),h(n,l),s=!0},p(u,f){(!s||f&4)&&t!==(t=u[2]?"Is":"Is Not")&&le(o,t),(!s||f&4)&&v(n,"isValid",u[2])},i(u){s||(i&&i.end(1),s=!0)},o(u){i=Ln(n,Mn,{}),s=!1},d(u){u&&k(n),u&&i&&i.end()}}}function eo(e){let n,t,o,l,i,s,u,f,r,c,a,d,g,C,q,x,N,$,J,T=e[0],_=[];for(let m=0;m<T.length;m+=1)_[m]=We(Me(e,T,m));const se=m=>j(_[m],1,1,()=>{_[m]=null});let V=O,b=[];for(let m=0;m<V.length;m+=1)b[m]=De(je(e,V,m));let I=e[3]&&Ue(e);return{c(){n=w("div"),t=w("div");for(let m=0;m<_.length;m+=1)_[m].c();o=H(),l=w("div"),i=w("div");for(let m=0;m<b.length;m+=1)b[m].c();s=H(),u=w("button"),u.textContent="Options Mode",f=H(),r=w("div"),c=w("button"),c.textContent="New Game",a=H(),d=w("button"),d.textContent="Validate",g=H(),C=w("button"),C.textContent="Undo",q=H(),x=w("div"),I&&I.c(),S(t,"class","board svelte-4nrjud"),S(u,"class","svelte-4nrjud"),v(u,"optionsMode",e[1]),S(i,"class","number-inputs svelte-4nrjud"),S(c,"class","svelte-4nrjud"),S(d,"class","svelte-4nrjud"),S(C,"class","svelte-4nrjud"),S(r,"class","controls svelte-4nrjud"),S(x,"class","validity svelte-4nrjud"),S(l,"class","inputs svelte-4nrjud"),S(n,"class","game svelte-4nrjud")},m(m,y){E(m,n,y),h(n,t);for(let p=0;p<_.length;p+=1)_[p].m(t,null);h(n,o),h(n,l),h(l,i);for(let p=0;p<b.length;p+=1)b[p].m(i,null);h(i,s),h(i,u),h(l,f),h(l,r),h(r,c),h(r,a),h(r,d),h(r,g),h(r,C),h(l,q),h(l,x),I&&I.m(x,null),N=!0,$||(J=[W(u,"click",e[13]),W(c,"click",e[14]),W(d,"click",e[15]),W(C,"click",e[16])],$=!0)},p(m,[y]){if(y&161){T=m[0];let p;for(p=0;p<T.length;p+=1){const z=Me(m,T,p);_[p]?(_[p].p(z,y),A(_[p],1)):(_[p]=We(z),_[p].c(),A(_[p],1),_[p].m(t,null))}for(fe(),p=T.length;p<_.length;p+=1)se(p);ae()}if(y&306){V=O;let p;for(p=0;p<V.length;p+=1){const z=je(m,V,p);b[p]?b[p].p(z,y):(b[p]=De(z),b[p].c(),b[p].m(i,s))}for(;p<b.length;p+=1)b[p].d(1);b.length=V.length}(!N||y&2)&&v(u,"optionsMode",m[1]),m[3]?I?(I.p(m,y),y&8&&A(I,1)):(I=Ue(m),I.c(),A(I,1),I.m(x,null)):I&&(fe(),j(I,1,1,()=>{I=null}),ae())},i(m){if(!N){for(let y=0;y<T.length;y+=1)A(_[y]);A(I),N=!0}},o(m){_=_.filter(Boolean);for(let y=0;y<_.length;y+=1)j(_[y]);j(I),N=!1},d(m){m&&k(n),ee(_,m),ee(b,m),I&&I.d(),$=!1,B(J)}}}function _n(e){return e===2||e===5}function Cn(e){return e<8}function no(e,n,t){let o,l,i=[],s=[],u=!1,f=!1,r=!1;c();function c(){$n()?(s=zn(),t(0,i=F(s.at(-1)))):(t(0,i=Le()),d())}function a(){t(0,i=Le()),s=[],d()}function d(){s.push(F(i)),He(s)}function g(V,b){t(0,i=Ft(i,V,b))}function C(V){t(0,i=Wt(i,V,u)),d()}function q(){s.length>1&&(s.pop(),He(s),t(0,i=F(s.at(-1))))}function x(){t(2,f=Qt(i)),t(3,r=!0),setTimeout(()=>t(3,r=!1),2e3)}const N=V=>g(V.row,V.column),$=V=>C(V),J=()=>t(1,u=!u),T=()=>a(),_=()=>x(),se=()=>q();return e.$$.update=()=>{e.$$.dirty&1&&t(5,o=$t(i)),e.$$.dirty&1&&t(4,l=zt(i))},[i,u,f,r,l,o,a,g,C,q,x,N,$,J,T,_,se]}class to extends Ie{constructor(n){super(),Oe(this,n,no,eo,he,{})}}function oo(e){let n,t,o;return t=new to({}),{c(){n=w("main"),Ye(t.$$.fragment),S(n,"class","svelte-66lomk")},m(l,i){E(l,n,i),we(t,n,null),o=!0},p:G,i(l){o||(A(t.$$.fragment,l),o=!0)},o(l){j(t.$$.fragment,l),o=!1},d(l){l&&k(n),Se(t)}}}class lo extends Ie{constructor(n){super(),Oe(this,n,null,oo,he,{})}}new lo({target:document.getElementById("app")});
