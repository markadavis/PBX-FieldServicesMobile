/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control","sap/ui/core/ResizeHandler","./Core","./Loco","./ViewportHandler","./Messages","./NativeViewportRenderer","./getResourceBundle"],function(q,v,C,R,a,L,V,M,N,g){"use strict";var b=C.extend("sap.ui.vk.NativeViewport",{metadata:{library:"sap.ui.vk",properties:{limitZoomOut:{type:"boolean",group:"Behavior",defaultValue:false}},associations:{contentConnector:{type:"sap.ui.vk.ContentConnector",multiple:false}},events:{"resize":{parameters:{oldSize:"object",size:"object"}},"move":{parameters:{pan:"object",zoom:"float"}}}},constructor:function(i,s){C.apply(this,arguments);this._canvas=null;this._canvas=document.createElement("div");this._canvas.style.textAlign="left";this._canvas.id=q.sap.uid();this._resizeListenerId=null;this._viewportHandler=new V(this);this._loco=new L(this);this._loco.addHandler(this._viewportHandler,-1);this._reset();this._svgid=this.getId()+"-svg";a.observeAssociations(this);}});b.prototype.destroy=function(){this._loco.removeHandler(this._viewportHandler);this._viewportHandler.destroy();if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}C.prototype.destroy.call(this);};b.prototype.onBeforeRendering=function(){if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}};b.prototype.onAfterRendering=function(){if(this._canvas){var d=this.getDomRef();d.appendChild(this._canvas);this._resizeListenerId=R.register(this,this._handleResize.bind(this));this._handleResize({size:{width:d.clientWidth,height:d.clientHeight}});}};b.prototype._handleResize=function(e){this.fireResize({oldSize:e.oldSize,size:e.size});if(!e.oldSize||!e.oldSize.width||!e.oldSize.height||this._svgError){this._bestFit();}else{this._update();}};b.prototype._reset=function(){this._img=null;this._svg=null;this._svgError=null;this._imageW=0;this._imageH=0;this._s4BestFit=1;this._s=1;this._x=0;this._y=0;this._gx=0;this._gy=0;this._canvas.style.visibility="hidden";while(this._canvas.lastChild){this._canvas.removeChild(this._canvas.lastChild);}};b.prototype._update=function(){var i=this._svgError||this._img||this._svg;if(i){var x=this._x-(this._imageW-this._canvas.clientWidth)/2;var y=this._y-(this._imageH-this._canvas.clientHeight)/2;var t="matrix("+this._s+",0,0,"+this._s+","+x+","+y+")";i.style.transform=t;i.style.webkitTransform=t;i.style.msTransform=t;i.style.MozTransform=t;i.style.OTransform=t;}};b.prototype._bestFit=function(){if(this._svgError){this._imageW=550;this._imageH=512;}else if(this._svg){this._imageW=this._svg.clientWidth;this._imageH=this._svg.clientHeight;}else if(this._img){this._imageW=this._img.width;this._imageH=this._img.height;}else{return;}if(!this._imageW||!this._imageH||!this._canvas.clientWidth||!this._canvas.clientHeight){return;}var s=Math.min(this._canvas.clientWidth/this._imageW,this._canvas.clientHeight/this._imageH);this._s4BestFit=s;this._s=s;this._x=0;this._y=0;this._update();this._canvas.style.visibility="visible";};b.prototype.loadUrl=function(u,o,c,d,e){if(/^(svg)$/.test(e.toLowerCase())){this._reset();this._svg=document.createElement("object");this._svg.setAttribute("type","image/svg+xml");this._svg.setAttribute("data",u);this._svg.setAttribute("id",this._svgid);this._svg.setAttribute("class","SVGImage");this._canvas.appendChild(this._svg);var s=document.createElement("div");s.style.position="absolute";s.style.top=0;s.style.left=0;s.style.height="100%";s.style.width="100%";this._canvas.appendChild(s);this._svg.onload=function(){this._svg.onload=null;setTimeout(function(){this._bestFit();if(o){o();}}.bind(this),0);}.bind(this);this._svg.onerror=function(){q.sap.log.error(g().getText(M.VIT1.summary),M.VIT1.code,"sap.ui.vk.NativeViewport");this._reset();if(c){c();}}.bind(this);this._svg.src=u;return this;}else if(/^(jpg|jpeg|png|gif|bmp|tif|tiff)$/.test(e.toLowerCase())){this._reset();this._img=new Image();this._img.draggable=false;this._img.onload=function(){setTimeout(function(){this._bestFit();this._canvas.appendChild(this._img);if(o){o();}}.bind(this),0);}.bind(this);this._img.onerror=function(){q.sap.log.error(g().getText(M.VIT2.summary),M.VIT2.code,"sap.ui.vk.NativeViewport");if(c){c();}};this._img.src=u;return this;}else{q.sap.log.error(g().getText(M.VIT3.summary),M.VIT3.code,"sap.ui.vk.NativeViewport");if(c){c();}}};b.prototype.loadFailed=function(t){this._reset();this._svgError=document.createElement("div");this._svgError.className="svgErrorContainer";var s="http://www.w3.org/2000/svg";this._svgErrorElement=document.createElementNS(s,"svg");this._svgErrorElement.setAttribute("width","550px");this._svgErrorElement.setAttribute("height","512px");this._svgErrorElement.setAttribute("viewBox","-244 -244 512 512");this._svgErrorElement.setAttribute("enable-background","new -244 -244 512 512");this._svgErrorElement.setAttribute("id","SVGError");var c=document.createElementNS(s,"rect");c.setAttribute("fill","#FFFFFF");c.setAttribute("x","-244");c.setAttribute("y","-244");c.setAttribute("width","512");c.setAttribute("height","512");c.setAttribute("opacity","0.1");this._svgErrorElement.appendChild(c);var d=document.createElementNS(s,"path");d.setAttribute("fill","#474747");d.setAttribute("d","M12.833,89.742c-70.781,0-128.366-57.584-128.366-128.366c0-70.781,57.584-128.365,128.366-128.365 s128.365,57.584,128.365,128.365C141.198,32.158,83.614,89.742,12.833,89.742z M12.833-146.989 c-59.753,0-108.366,48.612-108.366,108.365c0,59.752,48.613,108.366,108.366,108.366S121.198,21.129 121.198-38.624 C121.198-98.376,72.586-146.989,12.833-146.989z");d.setAttribute("opacity","0.3");this._svgErrorElement.appendChild(d);var e=document.createElementNS(s,"rect");e.setAttribute("fill","#474747");e.setAttribute("x","-2.167");e.setAttribute("y","-120.847");e.setAttribute("width","30");e.setAttribute("height","119.447");e.setAttribute("fill","#474747");e.setAttribute("opacity","0.3");this._svgErrorElement.appendChild(e);var f=document.createElementNS(s,"rect");f.setAttribute("fill","#474747");f.setAttribute("x","-2.167");f.setAttribute("y","13.6");f.setAttribute("width","30");f.setAttribute("height","30");f.setAttribute("opacity","0.3");this._svgErrorElement.appendChild(f);var h=document.createElementNS(s,"path");h.setAttribute("fill","#474747");h.setAttribute("d","M10.833,87.33c-70.781,0-128.366-57.584-128.366-128.365c0-70.781,57.584-128.365,128.366-128.365 s128.365,57.584,128.365,128.365C139.198,29.746,81.614,87.33,10.833,87.33z M10.833-149.4 c-59.753,0-108.366,48.612-108.366,108.365S-48.92,67.33,10.833,67.33S119.198,18.718,119.198-41.035S70.586-149.4,10.833-149.4z");this._svgErrorElement.appendChild(h);var i=document.createElementNS(s,"rect");i.setAttribute("fill","#474747");i.setAttribute("x","-4.167");i.setAttribute("y","-123.259");i.setAttribute("width","30");i.setAttribute("height","119.447");i.setAttribute("fill","#474747");this._svgErrorElement.appendChild(i);var j=document.createElementNS(s,"rect");j.setAttribute("fill","#474747");j.setAttribute("x","-4.167");j.setAttribute("y","11.188");j.setAttribute("width","30");j.setAttribute("height","30");j.setAttribute("fill","#474747");this._svgErrorElement.appendChild(j);var k=document.createElementNS(s,"text");k.setAttribute("id","textError");k.setAttribute("left","auto");k.setAttribute("right","auto");k.setAttribute("y","150");k.setAttribute("x","10");k.setAttribute("display","block");k.setAttribute("text-anchor","middle");k.setAttribute("fill","#474747");k.setAttribute("style","font-family:Arial");k.setAttribute("font-size","32");k.textContent=t?t:g().getText("VIEWPORT_MESSAGEUNSUPPORTEDFILEFORMAT");this._svgErrorElement.appendChild(k);this._svgError.appendChild(this._svgErrorElement);this._bestFit();this._canvas.appendChild(this._svgError);return this;};b.prototype.beginGesture=function(x,y){this._gx=(x-this._canvas.clientWidth/2-this._x)/this._s;this._gy=(y-this._canvas.clientHeight/2-this._y)/this._s;return this;};b.prototype.endGesture=function(){this._gx=0;this._gy=0;return this;};b.prototype.pan=function(d,c){if(this._svgError){return this;}this._x+=d;this._y+=c;this._update();this.fireMove({pan:{x:d,y:c},zoom:1.0});return this;};b.prototype.rotate=function(d,c){if(this._svgError){return this;}this._x+=d;this._y+=c;this._update();this.fireMove({pan:{x:d,y:c},zoom:1.0});return this;};b.prototype._getZoomInLimit=function(){return 500;};b.prototype._getZoomOutLimit=function(){return(this.getLimitZoomOut())?this._s4BestFit*0.25:0.0001;};b.prototype._getZoomFactor=function(){return this._s;};b.prototype.zoom=function(z){if(this._svgError){return this;}var c=this._gx*this._s;var d=this._gy*this._s;var o=this._s;this._s=Math.min(Math.max(this._s*z,this._getZoomOutLimit()),this._getZoomInLimit());z=this._s/o;var e=this._gx*this._s;var f=this._gy*this._s;var h=c-e;var i=d-f;this._x+=h;this._y+=i;this._update();this.fireMove({pan:{x:h,y:i},zoom:z});return this;};b.prototype.tap=function(x,y,i){if(i){this._bestFit();}return this;};b.prototype.queueCommand=function(c){c();return this;};b.prototype.getViewInfo=function(){var c={};c.camera=[this._s,0,0,this._s,this._x,this._y];return c;};b.prototype.setViewInfo=function(c){if(this._svgError){return this;}var d=c.camera;this._s=d[0];this._x=d[4];this._y=d[5];this._update();return this;};b.prototype.getOutputSize=function(){var c=this.getViewInfo().camera,d=this.getDomRef().getBoundingClientRect();return{left:d.width/2+c[4],top:d.height/2+c[5],sideLength:this._canvas.children[0].getBoundingClientRect().width};};b.prototype.onSetContentConnector=function(c){c.attachContentReplaced(this._onContentReplaced,this);this._setImage(c.getContent());};b.prototype.onUnsetContentConnector=function(c){this._setImage(null);c.detachContentReplaced(this._onContentReplaced,this);};b.prototype._onContentReplaced=function(e){this._setImage(e.getParameter("newContent"));};b.prototype._setImage=function(i){this._reset();if(i instanceof HTMLObjectElement){this._svg=i;i.setAttribute("id",this._svgid);i.onload=function(){i.onload=null;setTimeout(function(){this._bestFit();}.bind(this),0);}.bind(this);if(sap.ui.Device.browser.msie||sap.ui.Device.browser.edge){setTimeout(function(){this._bestFit();}.bind(this),0);}this._canvas.appendChild(i);var s=document.createElement("div");s.style.position="absolute";s.style.top=0;s.style.left=0;s.style.height="100%";s.style.width="100%";this._canvas.appendChild(s);}else if(i instanceof HTMLImageElement){this._img=i;i.draggable=false;setTimeout(function(){this._bestFit();this._canvas.appendChild(i);}.bind(this),0);}return this;};var r=2;var p=2;[{key:"left",dx:-p,dy:0},{key:"right",dx:+p,dy:0},{key:"up",dx:0,dy:-p},{key:"down",dx:0,dy:+p}].forEach(function(i){b.prototype["onsap"+i.key]=function(e){this.beginGesture(this.$().width()/2,this.$().height()/2);this.pan(i.dx,i.dy);this.endGesture();e.preventDefault();e.stopPropagation();};});[{key:"left",dx:-r,dy:0},{key:"right",dx:+r,dy:0},{key:"up",dx:0,dy:-r},{key:"down",dx:0,dy:+r}].forEach(function(i){b.prototype["onsap"+i.key+"modifiers"]=function(e){if(e.shiftKey&&!(e.ctrlKey||e.altKey||e.metaKey)){this.beginGesture(this.$().width()/2,this.$().height()/2);this.rotate(i.dx,i.dy);this.endGesture();e.preventDefault();e.stopPropagation();}};});[{key:"minus",d:0.98},{key:"plus",d:1.02}].forEach(function(i){b.prototype["onsap"+i.key]=function(e){this.beginGesture(this.$().width()/2,this.$().height()/2);this.zoom(i.d);this.endGesture();e.preventDefault();e.stopPropagation();};});return b;});
