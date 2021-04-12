(self.webpackChunk=self.webpackChunk||[]).push([[50],{7092:(e,n,t)=>{"use strict";t.d(n,{gB:()=>g,X5:()=>b,on:()=>y,R8:()=>w,_N:()=>O,n5:()=>k,_9:()=>I,vs:()=>S,yJ:()=>j,Ke:()=>E,wT:()=>A}),t(5901),t(2189),t(3938),t(8010),t(5623),t(7471),t(5769),t(1013),t(2410),t(3238),t(1418),t(2077),t(895),t(1514),t(2482),t(5849),t(4078),t(6248);var r=t(7378),o=t(4760),a=t(7596),i=t.n(a),u=t(9412),c=t.n(u),l=t(4598),s=t.n(l),f=t(4606);function d(e){return function(e){if(Array.isArray(e))return v(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||p(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,n){if(e){if("string"==typeof e)return v(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?v(e,n):void 0}}function v(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}function h(e,n,t,r,o,a,i){try{var u=e[a](i),c=u.value}catch(e){return void t(e)}u.done?n(c):Promise.resolve(c).then(r,o)}function m(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){h(a,r,o,i,u,"next",e)}function u(e){h(a,r,o,i,u,"throw",e)}i(void 0)}))}}var g=function(e,n,t,r,o,a){var i=arguments.length>6&&void 0!==arguments[6]&&arguments[6],u=s()({action:"redirect",payload:{window:a,owner:e,repo:n,type:t,branch:r,nodePath:o,openInNewTab:i}});f.default.toBg("Redirect request -> bg",u),c().runtime.sendMessage(u)},b=function(){var e=m(regeneratorRuntime.mark((function e(n){var t,r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t={action:"change-active-tab",payload:{destinationTabId:n}},f.default.toBg("Change active tab request -> bg",t),e.next=5,c().runtime.sendMessage(t);case 5:if(!(null==(r=e.sent)?void 0:r.complete)){e.next=8;break}return e.abrupt("return",!0);case 8:e.next=14;break;case 10:return e.prev=10,e.t0=e.catch(0),f.default.error("Error changing active tab",e.t0),e.abrupt("return",!1);case 14:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(n){return e.apply(this,arguments)}}(),y=function(){var e=m(regeneratorRuntime.mark((function e(n){var t,r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t={action:"close-tab",payload:{tabId:n}},f.default.toBg("Close tab request -> bg",t),e.next=5,c().runtime.sendMessage(t);case 5:if(!(null==(r=e.sent)?void 0:r.complete)){e.next=8;break}return e.abrupt("return",!0);case 8:e.next=14;break;case 10:return e.prev=10,e.t0=e.catch(0),f.default.error("Error closing tab",e.t0),e.abrupt("return",!1);case 14:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(n){return e.apply(this,arguments)}}(),x=function(e){if(!e)return{parentPath:"",fileName:"/"};var n=e.split("/");return{parentPath:n.slice(0,-1).join("/"),fileName:n.slice(-1)}},w=function(e){var n=e.subpage;if("repository"===n){var t=x(e.nodeName),r=t.parentPath,o=t.fileName;return{primaryText:decodeURI(o),secondaryText:r,subpageText:e.name}}return"issues"===n||"pulls"===n?{primaryText:e.nodeName,secondaryText:e.id,subpageText:n}:{primaryText:"/",secondaryText:"",subpageText:n}},O=function(e){var n,t=x(e.path),r=t.parentPath,o=t.fileName;return{primaryText:decodeURI(o),secondaryText:r,subpageText:null==e||null===(n=e.branch)||void 0===n?void 0:n.name}},k=function(e,n,t){for(var r="\n".concat(e,"\n"),o=2,a=!1,i=2,u=!1,c=n,l=t;c>0&&"\n"!==r[c]&&0!==o;c--)" "===n&&o--;for(;l<r.length&&"\n"!==r[l]&&0!==i;l++)" "===n&&i--;return n-c>50&&(c=n-50,a=!0),l-t>50&&(l=t+50,u=!0),{matchFragment:"".concat(a?"...":"").concat(r.slice(c,l)).concat(u?"...":""),start:n-c+1+(a?3:0),end:t-c+1+(a?3:0)}},I=function(e){if(!(null==e?void 0:e.repo)||!(null==e?void 0:e.path))return null;var n=e.repo,t=e.branch,r=e.path;return o.resolve("https://github.com/",i().join("/".concat(n.owner,"/").concat(n.name),"/blob/".concat(null==t?void 0:t.name,"/").concat(r)))},S=function(e,n){var t=function(e,n){var t=e.split(" ").filter((function(e){return!e.includes(":")})).join(" ").toLowerCase(),r=n.toLowerCase(),o=function(){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=d(arguments.length>0&&void 0!==arguments[0]?arguments[0]:""),t=d(e),r=Array(t.length+1).fill(null).map((function(){return Array(n.length+1).fill(null)})),o=0;o<=n.length;o+=1)r[0][o]=0;for(var a=0;a<=t.length;a+=1)r[a][0]=0;for(var i=0,u=0,c=0,l=1;l<=t.length;l+=1)for(var s=1;s<=n.length;s+=1)n[s-1]===t[l-1]?r[l][s]=r[l-1][s-1]+1:r[l][s]=0,r[l][s]>i&&(i=r[l][s],u=s,c=l);if(0===i)return"";for(var f="";r[c][u]>0;)f=n[u-1]+f,c-=1,u-=1;return f}(t,r);if(!o)return{start:-1,end:-1};var a=r.indexOf(o);return{start:a,end:a+o.length}}(n,e),o=t.start,a=t.end;return-1===o||-1===a?e:r.createElement("span",null,e.slice(0,o),r.createElement("span",{className:"highlight"},e.slice(o,a)),e.slice(a))},j=function(e,n){return e.current&&(n.target===e.current||e.current.contains(n.target))},E=function(e,n,t,r){return{bookmarkId:"bookmark-".concat(e,":").concat(n,":").concat(r.path),pinned:!1,name:r.name,path:r.path,repo:{owner:e,name:n},branch:{name:t}}},A=function(e,n){if(0===n.length)return[e];var t=[],o=0,a=e.length;return n.forEach((function(i,u){var c=function(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var t=[],r=!0,o=!1,a=void 0;try{for(var i,u=e[Symbol.iterator]();!(r=(i=u.next()).done)&&(t.push(i.value),!n||t.length!==n);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw a}}return t}}(e,n)||p(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}(i,2),l=c[0],s=c[1];l>=a||(t.push(e.slice(o,l)),t.push(r.createElement("span",{key:"".concat(l,"-").concat(s),className:"highlight"},e.slice(l,Math.min(s,a)))),u===n.length-1&&s!==a&&t.push(e.slice(s)),o=s)})),t}},703:(e,n,t)=>{"use strict";t.d(n,{Z:()=>h}),t(2410);var r=t(7378),o=(t(3615),t(3974)),a=t(6654),i=t(8115),u=t(4865),c=t(1764);function l(){var e=d(["\n      &:hover {\n        background-color: ",";\n      }\n    "]);return l=function(){return e},e}function s(){var e=d(["\n        transform: rotate(\n          ","deg\n        );\n      "]);return s=function(){return e},e}function f(){var e=d(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  margin-right: ","px;\n\n  svg {\n    fill: ",";\n    transition: transform 100ms;\n    transform: rotate(","deg);\n    ","\n  }\n\n  ","\n"]);return f=function(){return e},e}function d(e,n){return n||(n=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}var p=o.ZP.div(f(),u.ICON.SIDE_MARGIN,i.$U,(function(e){return e.startDeg}),(function(e){return!e.noRotate&&(0,o.iv)(s(),(function(e){var n=e.startDeg;return e.open?90+n:n}))}),(function(e){return e.highlightOnHover&&(0,o.iv)(l(),i.Tk)})),v=(0,r.forwardRef)((function(e,n){var t=e.open,o=e.onClick,a=e.highlightOnHover,i=e.Icon,l=e.noRotate,s=e.startDeg,f=(0,c.Z)().spacing;return r.createElement(p,{open:t,onClick:o,highlightOnHover:a,noRotate:l,startDeg:s,ref:n},(0,r.cloneElement)(i,{size:u.ICON.SIZE({theme:{spacing:f}}),verticalAlign:"middle"}))}));v.propTypes={},v.defaultProps={open:!1,onClick:function(){},highlightOnHover:!1,Icon:r.createElement(a.XCv,null),startDeg:0,noRotate:!1};const h=v},6731:(e,n,t)=>{"use strict";t.d(n,{Z:()=>i}),t(5901),t(7471),t(2410);var r=t(7378);function o(){var e,n,t=(e=["\n  width: 100%;\n  height: ",";\n  overflow: scroll;\n  scrollbar-width: thin;\n"],n||(n=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}})));return o=function(){return t},t}var a=t(3974).ZP.div(o(),(function(e){return e.height||"100%"}));const i=function(e){e.height;var n=e.children,t=function(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}(e,["height","children"]);return r.createElement(a,t,n)}},565:(e,n,t)=>{"use strict";t.d(n,{S$:()=>d,eg:()=>p,jz:()=>v,ZG:()=>h}),t(2410);var r=t(3974),o=t(4865),a=t(8115);function i(){var e=f(["\n  display: flex;\n  flex-direction: column;\n  left: 0;\n  right: 0;\n  min-width: fit-content;\n  height: 100%;\n\n  div.node:nth-of-type(even) {\n    background-color: ",";\n  }\n  div.node:nth-of-type(odd) {\n    background-color: ",";\n  }\n"]);return i=function(){return e},e}function u(){var e=f(["\n  text-transform: uppercase;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-size: ",";\n  line-height: ","px;\n  font-weight: bold;\n  user-select: none;\n  overflow: hidden;\n"]);return u=function(){return e},e}function c(){var e=f(["\n      box-shadow: 0px 2px 1px 0px ",";\n    "]);return c=function(){return e},e}function l(){var e=f(["\n  display: flex;\n  flex-direction: row;\n  cursor: pointer;\n  padding-left: calc("," - ","px - ","px);\n  z-index: ",";\n  height: ","px;\n  max-height: ","px;\n\n  border-top: 1px solid ",";\n  ","\n"]);return l=function(){return e},e}function s(){var e=f(["\n  display: flex;\n  overflow: hidden;\n  flex-direction: column;\n  height: 100%;\n  user-select: none;\n  transition: 0.2s height;\n  box-sizing: border-box;\n  z-index: 1;\n"]);return s=function(){return e},e}function f(e,n){return n||(n=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}var d=r.ZP.div(s()),p=r.ZP.div(l(),a.YG,o.ICON.SIZE,o.ICON.SIDE_MARGIN,(function(e){return e.zIndex}),o.NODE.HEIGHT,o.NODE.HEIGHT,a.tv,(function(e){return e.hasShadow&&(0,r.iv)(c(),a.nm)})),v=r.ZP.div(u(),a.JB,o.NODE.HEIGHT),h=r.ZP.div(i(),a.uN,a.ls)},9117:(e,n,t)=>{"use strict";t.d(n,{Z:()=>d}),t(5901),t(2189),t(5769),t(2410),t(3238),t(1418),t(895),t(4078),t(6248);var r=t(7378),o=t(6304),a=t(366),i=t(3597);function u(e,n,t,r,o,a,i){try{var u=e[a](i),c=u.value}catch(e){return void t(e)}u.done?n(c):Promise.resolve(c).then(r,o)}function c(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var a=e.apply(n,t);function i(e){u(a,r,o,i,c,"next",e)}function c(e){u(a,r,o,i,c,"throw",e)}i(void 0)}))}}function l(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var t=[],r=!0,o=!1,a=void 0;try{for(var i,u=e[Symbol.iterator]();!(r=(i=u.next()).done)&&(t.push(i.value),!n||t.length!==n);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw a}}return t}}(e,n)||function(e,n){if(e){if("string"==typeof e)return s(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?s(e,n):void 0}}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}var f=1e3;const d=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"None",t=(0,o.Z)(),u=(0,a.ZA)(),s=u.addPendingRequest,d=u.removePendingRequest,p=(0,a.LM)(),v=p.getUserBookmark,h=(0,r.useState)(!!v(e.repo.owner,e.repo.name,e.bookmarkId)),m=l(h,2),g=m[0],b=m[1],y=function(){var e=c(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:s(n),b(t);case 2:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}();(0,r.useEffect)((function(){setTimeout((function(){d(n)}),f)}),[g]);var x=(0,i.Z)(g,f);return(0,r.useEffect)((function(){!function(){var r=c(regeneratorRuntime.mark((function r(){var o,a;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(!(!(o=v(e.repo.owner,e.repo.name,e.bookmarkId))&&x||o&&!x)){r.next=13;break}if(!x){r.next=9;break}return r.next=6,t.addBookmark(e);case 6:a=r.sent,r.next=12;break;case 9:return r.next=11,t.removeBookmark(e);case 11:a=r.sent;case 12:"error"===a.status&&y(o);case 13:d(n);case 14:case"end":return r.stop()}}),r)})));return function(){return r.apply(this,arguments)}}()()}),[x]),[g,y]}},3597:(e,n,t)=>{"use strict";t.d(n,{Z:()=>a}),t(5901),t(2189),t(5769),t(2410),t(3238),t(895),t(4078);var r=t(7378);function o(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}const a=function(e,n){var t,a,i=(t=(0,r.useState)(e),a=2,function(e){if(Array.isArray(e))return e}(t)||function(e,n){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var t=[],r=!0,o=!1,a=void 0;try{for(var i,u=e[Symbol.iterator]();!(r=(i=u.next()).done)&&(t.push(i.value),!n||t.length!==n);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==u.return||u.return()}finally{if(o)throw a}}return t}}(t,a)||function(e,n){if(e){if("string"==typeof e)return o(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?o(e,n):void 0}}(t,a)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),u=i[0],c=i[1];return(0,r.useEffect)((function(){var t=setTimeout((function(){c(e)}),n);return function(){clearTimeout(t)}}),[e,n]),u}},6697:(e,n,t)=>{"use strict";t.d(n,{nL:()=>i,Uh:()=>u,$f:()=>c});var r=t(9412),o=t.n(r),a=t(4606),i=function(e){var n={action:"redirect-to-url",payload:{url:e}};a.default.toBg("Redirect to url request -> bg",n),o().runtime.sendMessage(n)},u=function(e){var n={action:"redirect-to-session",payload:{session:e}};a.default.toBg("Redirect to url request -> bg",n),o().runtime.sendMessage(n)},c=function(e,n){var t={action:"sidebar-side-updated",payload:{prevSide:e,nextSide:n}};a.default.toBg("Update sidebar side request -> bg",t),o().runtime.sendMessage(t)}}}]);