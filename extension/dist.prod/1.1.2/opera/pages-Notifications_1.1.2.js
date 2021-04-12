(self.webpackChunk=self.webpackChunk||[]).push([[177],{2117:(n,e,r)=>{"use strict";r.d(e,{Z:()=>c}),r(5901),r(2189);var t=r(7378),o=(r(3615),r(5212)),i=r(8115),l=function(n){var e=n.title,r=n.description,i=n.children,l=n.highlightOnHover,c=n.evenPadding,a=n.center,u=n.onClick,f=n.rightPanel,s=n.flag,d=n.borderLeftColor,v=n.backgroundColor,g=n.closable,h=n.borderRadius,m=n.titlefontColor,p=n.descriptionFontColor;return t.createElement(o.ZP.Container,{onClick:u,highlightOnHover:l,borderLeftColor:d,borderRadius:h,fontColor:m,evenPadding:c,bgColor:v},t.createElement(o.ZP.LeftPanel,null,e&&t.createElement(o.ZP.Title,{fontColor:m},t.createElement("span",{className:s?"strikethrough":void 0},e),t.createElement("span",null,s)),g&&"closable",r&&t.createElement(o.ZP.Description,{isLast:!i,fontColor:p},r),t.createElement(o.ZP.Content,{center:a},i)),f&&t.createElement(o.ZP.RightPanel,null,f))};l.propTypes={},l.defaultProps={title:null,description:null,children:null,highlightOnHover:!0,evenPadding:!1,center:!1,onClick:null,rightPanel:null,flag:null,borderLeftColor:null,backgroundColor:i.Cz,closable:!1,borderRadius:"0",titlefontColor:i.zP,descriptionFontColor:i.Eh};const c=l},5212:(n,e,r)=>{"use strict";r.d(e,{te:()=>x,uW:()=>Z,HA:()=>k,hR:()=>j,ZP:()=>w}),r(5901),r(3938),r(7471),r(2410);var t=r(3974),o=r(8706),i=r.n(o),l=r(8115),c=r(7595);function a(){var n=O(["\n  display: flex;\n  flex-direction: column;\n  align-items: ",";\n  width: 100%;\n"]);return a=function(){return n},n}function u(){var n=O(["\n  font-size: ",";\n  color: ",";\n  margin-bottom: ",";\n  line-height: ",";\n"]);return u=function(){return n},n}function f(){var n=O(["\n  font-size: ",";\n  font-weight: 600;\n  color: ",";\n  margin-bottom: ",";\n\n  span.strikethrough {\n    text-decoration: line-through;\n  }\n\n  span {\n    margin-right: 0.2rem;\n  }\n"]);return f=function(){return n},n}function s(){var n=O(["\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  justify-content: center;\n  font-size: ",";\n"]);return s=function(){return n},n}function d(){var n=O(["\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  flex: 1;\n"]);return d=function(){return n},n}function v(){var n=O(["\n      cursor: pointer;\n    "]);return v=function(){return n},n}function g(){var n=O(["\n      &:hover {\n        background-color: ",";\n      }\n    "]);return g=function(){return n},n}function h(){var n=O(["\n      border-left: 5px solid ",";\n    "]);return h=function(){return n},n}function m(){var n=O(["\n  display: flex;\n  flex-direction: row;\n  background-color: 'transparent';\n  border-radius: ",";\n\n  color: ",";\n\n  ","\n\n  padding: ",";\n\n  ",";\n\n  ","\n"]);return m=function(){return n},n}function p(){var n=O(["\n  height: ",";\n"]);return p=function(){return n},n}function b(){var n=O(["\n  display: flex;\n  color: ",";\n  font-size: ",";\n  padding: 0 calc("," - ",") 0.25rem ",";\n\n  .spacer {\n    flex: 1;\n  }\n"]);return b=function(){return n},n}function y(n,e){if(null==n)return{};var r,t,o=function(n,e){if(null==n)return{};var r,t,o={},i=Object.keys(n);for(t=0;t<i.length;t++)r=i[t],e.indexOf(r)>=0||(o[r]=n[r]);return o}(n,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);for(t=0;t<i.length;t++)r=i[t],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(n,r)&&(o[r]=n[r])}return o}function C(){var n=O(["\n  margin: -1px calc("," - ",");\n  height: 1px;\n  background-color: ",";\n"]);return C=function(){return n},n}function P(){var n=O(["\n  padding: "," calc("," - ",");\n"]);return P=function(){return n},n}function O(n,e){return e||(e=n.slice(0)),Object.freeze(Object.defineProperties(n,{raw:{value:Object.freeze(e)}}))}var E=i()("spacing",{compact:"0.6rem",cozy:"0.8rem",comfortable:"1.2rem"}),x=t.ZP.div(P(),l.YG,l.YG,E),Z=t.ZP.div(C(),l.YG,E,(function(n){var e=n.bgColor,r=void 0===e?l.Cz:e,t=y(n,["bgColor"]);return(0,c.ce)(r(t),(0,l.uS)(t))})),k=t.ZP.div(b(),l.TY,l.oD,l.YG,E,l.YG),j=t.ZP.div(p(),E);const w={Container:t.ZP.div(m(),(function(n){return n.borderRadius}),(function(n){return n.fontColor}),(function(n){var e=n.borderLeftColor,r=y(n,["borderLeftColor"]);return e&&(0,t.iv)(h(),e(r))}),(function(n){var e=n.evenPadding,r=y(n,["evenPadding"]);return e?E(r):"calc(".concat(E(r)," * 1.5) ").concat(E(r),"}")}),(function(n){var e=n.highlightOnHover,r=n.bgColor,o=y(n,["highlightOnHover","bgColor"]);return e&&(0,t.iv)(g(),(0,c.ce)(r(o),(0,l.uS)(o)))}),(function(n){return n.onClick&&(0,t.iv)(v())})),LeftPanel:t.ZP.div(d()),RightPanel:t.ZP.div(s(),l.JB),Title:t.ZP.div(f(),l.HM,(function(n){return(0,n.fontColor)(y(n,["fontColor"]))}),l.lC),Description:t.ZP.div(u(),l.JB,(function(n){return(0,n.fontColor)(y(n,["fontColor"]))}),(function(n){var e=n.isLast,r=y(n,["isLast"]);return e?"0":"".concat((0,l.lC)(r))}),l.Nv),Content:t.ZP.div(a(),(function(n){return n.center?"center":"flex-start"}))}},6731:(n,e,r)=>{"use strict";r.d(e,{Z:()=>l}),r(5901),r(7471),r(2410);var t=r(7378);function o(){var n,e,r=(n=["\n  width: 100%;\n  height: ",";\n  overflow: scroll;\n  scrollbar-width: thin;\n"],e||(e=n.slice(0)),Object.freeze(Object.defineProperties(n,{raw:{value:Object.freeze(e)}})));return o=function(){return r},r}var i=r(3974).ZP.div(o(),(function(n){return n.height||"100%"}));const l=function(n){n.height;var e=n.children,r=function(n,e){if(null==n)return{};var r,t,o=function(n,e){if(null==n)return{};var r,t,o={},i=Object.keys(n);for(t=0;t<i.length;t++)r=i[t],e.indexOf(r)>=0||(o[r]=n[r]);return o}(n,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);for(t=0;t<i.length;t++)r=i[t],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(n,r)&&(o[r]=n[r])}return o}(n,["height","children"]);return t.createElement(i,r,e)}},4412:(n,e,r)=>{"use strict";r.r(e),r.d(e,{default:()=>v}),r(5901),r(2189),r(5769),r(1013),r(190),r(2410),r(3238),r(895),r(4078);var t=r(7378),o=r(5450),i=r(6304),l=r(366),c=r(2117),a=r(5212),u=r(4086),f=r(6731),s=r(8115);function d(n,e){(null==e||e>n.length)&&(e=n.length);for(var r=0,t=new Array(e);r<e;r++)t[r]=n[r];return t}const v=(0,o.Pi)((function(){(0,i.S)();var n=(0,l.ZA)(),e=n.notifications,r=n.removeNotification,o=n.clearNotifications,v=!(e&&!e.size);return t.createElement(f.Z,null,t.createElement(a.HA,null,t.createElement("div",null,v?e.size:0," notifications"),v&&t.createElement(t.Fragment,null,t.createElement("div",{className:"spacer"}),t.createElement("div",null,t.createElement(u.A,{onClick:o},"Clear all")))),v&&t.createElement(a.te,null,Array.from(e).reverse().map((function(n){var e,o,i=(e=n,o=2,function(n){if(Array.isArray(n))return n}(e)||function(n,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(n)){var r=[],t=!0,o=!1,i=void 0;try{for(var l,c=n[Symbol.iterator]();!(t=(l=c.next()).done)&&(r.push(l.value),!e||r.length!==e);t=!0);}catch(n){o=!0,i=n}finally{try{t||null==c.return||c.return()}finally{if(o)throw i}}return r}}(e,o)||function(n,e){if(n){if("string"==typeof n)return d(n,e);var r=Object.prototype.toString.call(n).slice(8,-1);return"Object"===r&&n.constructor&&(r=n.constructor.name),"Map"===r||"Set"===r?Array.from(n):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?d(n,e):void 0}}(e,o)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())[1];return t.createElement(t.Fragment,{key:i.id},t.createElement(c.Z,{title:i.title,description:i.message,borderLeftColor:s.pp[i.type],onClick:function(){r(i)}}),t.createElement(a.hR,null))}))))}))},190:(n,e,r)=>{"use strict";var t=r(1695),o=r(6526),i=[].reverse,l=[1,2];t({target:"Array",proto:!0,forced:String(l)===String(l.reverse())},{reverse:function(){return o(this)&&(this.length=this.length),i.call(this)}})}}]);