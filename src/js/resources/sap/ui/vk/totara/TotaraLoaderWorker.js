(function(){"use strict";var m={};["getVersion","initializeConnection","getScene","getMesh","getParametric","getGeomMesh","getAnnotation","getMaterial","getGeometry","getImage","getSequence","getTrack","getView","getHighlightStyle"].reverse().forEach(function(n,i){m[n]=i;});var t=new Map();function H(){this._url=null;this._url2=null;this._correlationId=null;this._authorizationToken=null;this._tenantUuidToken=null;this._onResponse=null;this._onError=null;this._requestQueue=[];this._maxActiveRequests=4;this._activeRequestCount=0;}H.prototype.init=function(s,a,b){this._url=s;this._correlationId=b;var e=this;return new Promise(function(i,k){if(a){a(s).then(function(n){e._authorizationToken=n?n.token_type+" "+n.access_token:null;e._tenantUuidToken=n?n.tenant_uuid:null;i({});}).catch(function(n){return k(n);});}else{i({});}});};H.prototype.close=function(){};H.prototype.getURL=function(){return this._url;};H.prototype.setCachingURL=function(a){this._url2=a;};H.prototype.getCachingURL=function(){return this._url2;};H.prototype.setMaxActiveRequests=function(a){this._maxActiveRequests=a;};H.prototype.send=function(a,b,o){if(!a){return;}this._requestQueue.push({message:(o?this._url2:this._url)+a,context:b,priority:m[b&&b.method]||0,onResponse:o||this._onResponse});if(this._activeRequestCount<this._maxActiveRequests){this._processNextRequest();}};H.prototype._processNextRequest=function(){if(!this._requestQueue.length){return;}this._requestQueue.sort(function(a,b){return a.priority-b.priority;});var e=this._requestQueue.pop();this._activeRequestCount++;var i=this;this._makeRequestPromise(encodeURI(e.message)).then(function(a){if(e.onResponse){e.onResponse(a);}i._activeRequestCount--;i._processNextRequest();}).catch(function(a){if(i._onError){i._onError({errorText:"Could not connect to server: "+i._url,error:a.status,reason:a.message?a.message:a,context:e.context});}i._activeRequestCount--;i._processNextRequest();});};H.prototype._makeRequestPromise=function(a){var b=this;var p=new Promise(function(e,i){var x=new XMLHttpRequest();x.onload=function(){if(this.status>=200&&this.status<300){if(this.getAllResponseHeaders().includes("tile-width")){var k=this.getResponseHeader("tile-width");var n=new RegExp("[^\/]+$");var o=this.responseURL.match(n);t.set(o[0],k);}e(this.response);}else{i({status:this.status,statusText:this.statusText});}};x.onerror=function(){i({status:this.status,statusText:this.statusText});};x.open("GET",a,true);if(b._authorizationToken){x.setRequestHeader("Authorization",b._authorizationToken);}if(b._tenantUuidToken){x.setRequestHeader("X-TenantUuid",b._tenantUuidToken);}x.setRequestHeader("X-CorrelationID",b._correlationId);x.responseType="arraybuffer";x.send();});return p;};function W(){this._url=null;this._webSocket=null;this._onResponse=null;this._onError=null;this._isInitialised=false;this._timerId=0;}W.prototype.init=function(s,a){this._url=s;var b=this;return new Promise(function(i,k){var w=b._webSocket=new WebSocket(s);w.binaryType="arraybuffer";w.onopen=function(){b._isInitialised=true;if(a!=null){a(s).then(function(e){if(e!=null){var n={"token":e.access_token};if(e.tenant_uuid){n.tenantUuid=e.tenant_uuid;}var o=JSON.stringify(n);var p="setStreamingToken"+("["+o.length+"]")+o;w.send(p);}b._keepAlive();i({});}).catch(function(e){return k(e);});}else{b._keepAlive();i({});}};w.onclose=function(){b._cancelKeepAlive();};w.onmessage=function(e){var n=e.data;if(b._onResponse){b._onResponse(n);}};w.onerror=function(e){if(!b._isInitialised){k("error connecting to "+s);}else if(b._onError){b._onError({errorText:e});}};});};W.prototype.getURL=function(){return this._url;};W.prototype.close=function(){if(this._webSocket){this._webSocket.close();this._webSocket=null;}};W.prototype._keepAlive=function(){var a=60000;if(this._webSocket===null){this._cancelKeepAlive();return;}if(this._webSocket.readyState===1){this._webSocket.send("");}this._timerId=setTimeout(this._keepAlive,a);};W.prototype._cancelKeepAlive=function(){if(this._timerId){clearTimeout(this._timerId);this._timerId=0;}};W.prototype.send=function(a,b){if(!a){return;}if(this._webSocket&&this._webSocket.readyState===1){try{this._webSocket.send(a);}catch(e){if(this._onError){this._onError({errorText:e,context:b});}}}else if(this._onError){this._onError({errorText:"websocket connection lost",context:b,error:4});}};function g(a){var b=a.split(",");if(b.length<0||b.length>2){throw"invalid content length";}var i=0;var k=0;try{i=parseInt(b[0],10);if(b.length===2){k=parseInt(b[1],10);}}catch(e){throw"invalid content length";}return{jsonContentLength:i,binaryContentLength:k};}function c(a){var b="[".charCodeAt(0);var e="]".charCodeAt(0);var i=[];var s=0;var k=0;var n;var o;var p;var q=new Uint8Array(a);while(k<a.byteLength){k=q.indexOf(b,s);if(k===-1){break;}var v=d(a,s,k).replace(/\n|\r|\s/g,"");s=k+1;k=q.indexOf(e,s);if(k===-1){throw"No matching [] for command length. abort";}n=g(d(a,s,k));s=k+1;k=s+n.jsonContentLength;o=d(a,s,k);if(n.binaryContentLength){s=k;k=s+n.binaryContentLength;p=new Uint8Array(a,s,n.binaryContentLength);}else{p=undefined;}s=k;var w={name:v,jsonString:o};if(p){w.binaryContent=p;}i.push(w);}return i;}var u;function d(a,s,b){if(TextDecoder){if(!u){u=new TextDecoder();}return u.decode(new DataView(a,s,b-s));}var i="";var M=1000;try{while(s<b){var k=Math.min(M,b-s);var n=new Uint8Array(a,s,k);i+=String.fromCharCode.apply(null,n);s+=k;}}catch(e){return"";}return decodeURIComponent(escape(i));}function L(){this.resolveFunctions=[];this.rejectFunctions=[];this.init=function(e,i,k){this._connection=e;this._connectionHTTP=i;this._sceneBuilderId=k;if(!e){throw"no connection provided for loader!";}this._connection._onResponse=function(n){var o=c(n);p(o);};this._connection.send("getVersion[2]{}",{method:"getVersion"});};var a=this;function b(v){a.protocolVersion=v.split(".").map(function(s){return parseInt(s,10);});}function p(e){var k;var s=-1;var v,i;var n=false;var o=false;var q=false;var w;for(i=0;i<e.length;i++){k=e[i];if(k.name==="setView"){if(!w){w=JSON.parse(k.jsonString).sceneId;}if(!n){if(!JSON.parse(k.jsonString).viewId){n=true;}}o=true;}else if(k.name==="setViewNode"){if(v===undefined){v=JSON.parse(k.jsonString).viewId;}}else if(k.name==="setSequence"&&o){q=true;}}if(v&&n){for(i=0;i<e.length;i++){k=e[i];if(k.name==="setView"){k.jsonContent={viewId:v};break;}}}if(w){self.postMessage({name:"suppressSendRequests",jsonContent:{sceneId:w}});}var x=function(k){if(k.binaryContent){self.postMessage({name:k.name,jsonString:k.jsonString,jsonContent:k.jsonContent,binaryContent:k.binaryContent},[k.binaryContent.buffer]);}else{self.postMessage({name:k.name,jsonString:k.jsonString,jsonContent:k.jsonContent});}};for(i=0;i<e.length;i++){k=e[i];if(k.name==="protocol"){b(JSON.parse(k.jsonString).version);}if(k.name==="setPlayback"&&q){s=i;continue;}if(k.name==="setImage"){var y=k.jsonContent.id;var z=y?t.get(y):null;if(z){k.jsonContent.tileWidth=z;}}if(k.name==="setScene"&&e.length>1){continue;}x(k);}if(s!==-1){k=e[s];x(k);}if(w){self.postMessage({name:"unsuppressSendRequests",jsonContent:{sceneId:w}});}}this.getConnection=function(){return this._connection;};this.getConnectionHTTP=function(){return this._connectionHTTP;};this._sendGetImage=function(e){var i;if(this.protocolVersion&&(this.protocolVersion[0]>1||this.protocolVersion[1]>0)){if(e.materialId){i="scenes/"+e.sceneId+"/materials/"+e.materialId+"/images/"+e.imageId;}else if(e.viewId){i="scenes/"+e.sceneId+"/views/"+e.viewId+"/images/"+e.imageId;}}i=i||("images/"+e.imageId);this._connectionHTTP.send(i,e,function(k){p([{name:"setImage",jsonContent:{sceneId:e.sceneId,id:e.imageId},binaryContent:new Uint8Array(k)}]);});};this._sendGetGeometries=function(e){var k=e.geometryIds;var n="geometry?";for(var i=0;i<k.length;i++){n+=(i>0?"&id=":"id=")+k[i];}this._connectionHTTP.send(n,e,function(o){var q=new DataView(o);var s=q.getUint16(2,true),v=0;var w=[];while(s-->0){var x={sceneId:e.sceneId,id:q.getUint32(v+4,true).toString(),box:[q.getFloat32(v+14,true),q.getFloat32(v+18,true),q.getFloat32(v+22,true),q.getFloat32(v+26,true),q.getFloat32(v+30,true),q.getFloat32(v+34,true)]};var y=q.getUint16(v+12,true);v+=38;if(y!==3){x.flags=q.getUint16(v,true);x.quality=q.getFloat32(v+4,true);x.pointCount=q.getUint16(v+8,true);x.elementCount=q.getUint16(v+10,true);v+=14;}var z=q.getUint32(v,true);var A=new Uint8Array(o,v+4,z);v+=z;w.push({name:"setGeometry",jsonContent:x,binaryContent:A.slice()});}p(w);});};this._sendGetGeomMeshes=function(e){var k="scenes/"+e.sceneId+"/meshes?ids=";var n=e.meshIds;for(var i=0;i<n.length;i++){k+=(i>0?",":"")+n[i];}this._connectionHTTP.send(k,e,function(o){var q=c(o);q.forEach(function(s){s.jsonContent={sceneId:e.sceneId};});p(q);});};this.send=function(e){if(this._connectionHTTP){switch(e.method){case"getImage":this._sendGetImage(e);return;case"getGeometry":this._sendGetGeometries(e);return;case"getGeomMesh":if(e.meshIds){this._sendGetGeomMeshes(e);return;}break;default:break;}}if(this._connection){this._connection.send(e.command,{method:e.method});}};this.setSceneBuilderId=function(i){this._sceneBuilderId=i;};this.getSceneBuilderId=function(){return this._sceneBuilderId;};this.authorizationHandler=function(e){var a=this;return new Promise(function(i,k){var n={name:"getAuthorization",jsonContent:{url:e},sceneId:a.sceneId};a.resolveFunctions.push(i);a.rejectFunctions.push(k);self.postMessage(n);});}.bind(this);}var l=new L();var r=function(e){self.postMessage({name:"notifyError",jsonContent:e});};var f=function(a,b,e,s,i,k){var n;var o;switch(a){case"getGeometry":n="?id=";if(!e){o=Number.MAX_SAFE_INTEGER;}else{o=k-(e+"geometry"+n).length;}break;case"getGeomMesh":n="?ids=";if(!e){o=Number.MAX_SAFE_INTEGER;}else{o=k-(e+"scenes/"+s+"/meshes"+n).length;}break;default:n="?request="+encodeURI(a+"["+k+"]"+JSON.stringify({sceneId:s,ids:[],token:i}));if(b.indexOf("ws")===0){o=Number.MAX_SAFE_INTEGER;}else{o=k-(b+n).length;}break;}return o;};var h=function(a){switch(a){case"getGeometry":return"&id=".length;default:return",".length;}};var j=function(a,b,s,e,i){a=a.indexOf("?")===-1?a:a.substring(0,a.indexOf("?"));var k=["getMesh","getAnnotation","getMaterial","getGeometry","getGeomMesh","getSequence","getTrack"];var n={};k.forEach(function(o){n[o]={maxBatchStringLength:f(o,a,b,s,e,i),separatorLength:h(o)};});return n;};self.onmessage=function(e){var a=e.data;switch(a.method){case"initializeConnection":{if(!a.url){break;}if(a.sceneId){l.sceneId=a.sceneId;}var b="";if(a.url[a.url.length-1]!=="/"){a.url+="/";}if(a.url.toLowerCase().startsWith("ws")){b=a.url+"streaming?";}else if(a.url.toLowerCase().startsWith("http")){b=a.url+"streaming-http?request=";}else{b=(a.useSecureConnection?"wss://":"ws://")+a.url+"streaming?";}var i=a.cid;var k=l.getConnection();var n,o;if(!k||k._url!==b){if(k){k.close();}var p;var q=null;if(a.url.toLowerCase().startsWith("ws")){p=new W();}else if(a.url.toLowerCase().startsWith("http")){p=new H();p.setCachingURL(a.url);p.setMaxActiveRequests(a.maxActiveRequests);}else{p=new W();q=(a.useSecureConnection?"https://":"http://")+a.url;}p._onError=r;p.init(b,l.authorizationHandler,i).then(function(){var w=function(p,x){l.init(p,x,a.sceneBuilderId);n=p.getURL();o=x?x.getCachingURL():p.getCachingURL();self.postMessage({name:"batchSizeInfo",jsonContent:{sceneId:a.sceneId,batchSizeInfo:j(n,o,a.sceneId,a.cid,a.maxUrlLength)}});if(a.command){l.send(a);}};if(q){var x=new H();x.setCachingURL(q);x.init(q,l.authorizationHandler,i).then(function(){w(p,x);}).catch(function(y){r(y);});}else{w(p,p instanceof H?p:null);}}).catch(function(w){r(w);});}else{n=l.getConnection().getURL();o=l.getConnectionHTTP()?l.getConnectionHTTP().getCachingURL():l.getConnection().getCachingURL();self.postMessage({name:"batchSizeInfo",jsonContent:{sceneId:a.sceneId,batchSizeInfo:j(n,o,a.sceneId,a.cid,a.maxUrlLength)}});if(a.command){l.send(a);}}break;}case"setMaxActiveRequests":{if(l.getConnection()instanceof H){l.getConnection().setMaxActiveRequests(a.maxActiveRequests);}break;}case"setAuthorization":{var s=l.resolveFunctions.shift();var v=l.rejectFunctions.shift();if(a.error==null){s(a.authorizationToken);}else{v(a.error);}break;}case"close":{self.close();break;}default:{if(a.command){l.send(a);}break;}}};self.postMessage({ready:true});})();