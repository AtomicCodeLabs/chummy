(self.webpackChunk=self.webpackChunk||[]).push([[226],{3176:(n,e,t)=>{"use strict";t.r(e),t.d(e,{default:()=>b}),t(5901),t(7471),t(2410);var r=t(7378),a=(t(3615),t(3974)),i=t(4865),o=t(8115),l=t(4086);function c(){var n=f(["\n  display: flex;\n  justify-content: center;\n  flex-direction: column;\n  align-items: center;\n  padding: 1rem;\n  margin-top: calc(10vh * -1);\n  max-width: calc(2 * ","px);\n  min-width: calc(1.5 * ","px);\n  text-align: center;\n"]);return c=function(){return n},n}function u(){var n=f(["\n  & {\n    /* animation: loader 5s linear infinite; */\n    display: flex;\n    justify-content: center;\n    flex-direction: column;\n    align-items: center;\n  }\n  @keyframes loader {\n    0% {\n      left: -100px;\n    }\n    100% {\n      left: 110%;\n    }\n  }\n  #box {\n    width: 50px;\n    height: 50px;\n    background: ",";\n    animation: animate 0.5s linear infinite;\n    border-radius: 3px;\n  }\n  @keyframes animate {\n    17% {\n      border-bottom-right-radius: 3px;\n    }\n    25% {\n      transform: translateY(9px) rotate(22.5deg);\n    }\n    50% {\n      transform: translateY(18px) scale(1, 0.9) rotate(45deg);\n      border-bottom-right-radius: 40px;\n    }\n    75% {\n      transform: translateY(9px) rotate(67.5deg);\n    }\n    100% {\n      transform: translateY(0) rotate(90deg);\n    }\n  }\n  #shadow {\n    margin-top: 9px;\n    width: 50px;\n    height: 5px;\n    background: #000;\n    opacity: 0.1;\n    border-radius: 50%;\n    animation: shadow 0.5s linear infinite;\n  }\n  @keyframes shadow {\n    50% {\n      transform: scale(1.2, 1);\n    }\n  }\n"]);return u=function(){return n},n}function s(){var n=f(["\n  height: ",";\n"]);return s=function(){return n},n}function f(n,e){return e||(e=n.slice(0)),Object.freeze(Object.defineProperties(n,{raw:{value:Object.freeze(e)}}))}var d=a.ZP.div(s(),o.Z$),m=a.ZP.div(u(),(function(n){var e=n.iconColor,t=function(n,e){if(null==n)return{};var t,r,a=function(n,e){if(null==n)return{};var t,r,a={},i=Object.keys(n);for(r=0;r<i.length;r++)t=i[r],e.indexOf(t)>=0||(a[t]=n[t]);return a}(n,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);for(r=0;r<i.length;r++)t=i[r],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(n,t)&&(a[t]=n[t])}return a}(n,["iconColor"]);return e||(0,o.$U)(t)})),p=a.ZP.div(c(),i.ICON.SPLASH.SIZE,i.ICON.SPLASH.SIZE),x=function(n){var e=n.text,t=n.iconColor;return r.createElement(p,null,r.createElement(m,{iconColor:t},r.createElement("div",{id:"box"}),r.createElement("div",{id:"shadow"})),e&&r.createElement(r.Fragment,null,r.createElement(d,null),r.createElement(l.P,null,e)))};x.propTypes={},x.defaultProps={text:null,iconColor:null};const b=x}}]);