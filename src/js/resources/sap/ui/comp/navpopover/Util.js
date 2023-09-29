/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/comp/library','./Factory','./LinkData',"sap/base/Log"],function(C,F,L,c){"use strict";var U={getContactAnnotationPath:function(o,s){var a=o.getContactAnnotationPath();if(a===undefined&&s&&s.getContactAnnotationPaths()&&s.getContactAnnotationPaths()[o.getFieldName()]!==undefined){a=s.getContactAnnotationPaths()[o.getFieldName()];}return a;},getForceLinkRendering:function(o,s){return o.getForceLinkRendering()||(s&&s.getForceLinkRendering()&&s.getForceLinkRendering()[o.getFieldName()]);},getStorableAvailableActions:function(m){return m.filter(function(M){return M.key!==undefined;});},sortArrayAlphabetical:function(n){var l;try{l=sap.ui.getCore().getConfiguration().getLocale().toString();if(typeof window.Intl!=='undefined'){var o=window.Intl.Collator(l,{numeric:true});n.sort(function(a,b){return o.compare(a,b);});}else{n.sort(function(a,b){return a.localeCompare(b,l,{numeric:true});});}}catch(e){}},retrieveNavigationTargets:function(s,a,A,o,S,m,p,O,b,l){var n={mainNavigation:undefined,ownNavigation:undefined,availableActions:[]};var x=F.getService("CrossApplicationNavigation");var u=F.getService("URLParsing");if(!x||!u){c.error("Service 'CrossApplicationNavigation' or 'URLParsing' could not be obtained");return Promise.resolve(n);}var d=[s].concat(a);var P=d.map(function(e){return[{semanticObject:e,params:S?S[e]:undefined,appStateKey:A,ui5Component:o,sortResultsBy:"text"}];});var f;return new Promise(function(r){x.getLinks(P).then(function(e){return r(e);});}).then(function(e){f=e;return(f&&f.length)?this.retrieveSemanticObjectUnavailableActions(p,O,b):Promise.resolve({});}.bind(this)).then(function(e){if(!f||!f.length){return Promise.resolve(n);}var g=x.hrefForExternal();if(g&&g.indexOf("?")!==-1){g=g.split("?")[0];}if(g){g+="?";}var I=function(j,k){return!!e&&!!e[j]&&e[j].indexOf(k)>-1;};f[0][0].forEach(function(j){var k=u.parseShellHash(j.intent);var K=(k.semanticObject&&k.action)?k.semanticObject+"-"+k.action:undefined;var q=(j.tags&&j.tags.indexOf("superiorAction")>-1);if(j.intent.indexOf(g)===0){var r=new L({key:K,href:j.intent,visible:true,isSuperiorAction:q});r.setText(j.text);n.ownNavigation=r;return;}if(k.action&&k.action==='displayFactSheet'&&!I(k.semanticObject,k.action)){n.mainNavigation=new L({key:K,href:j.intent,text:sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"),visible:true,isSuperiorAction:q});if(l){l.addSemanticObjectIntent(k.semanticObject,{text:j.text,intent:j.intent});}return;}if(!I(k.semanticObject,k.action)){var t=new L({key:K,href:j.intent,visible:true,isSuperiorAction:q});t.setText(j.text);n.availableActions.push(t);if(l){l.addSemanticObjectIntent(k.semanticObject,{text:j.text,intent:j.intent});}}});if(!n.mainNavigation&&typeof m==="string"){var M=new L({visible:true});M.setText(m);n.mainNavigation=M;}var h=[];for(var i=1;i<d.length;i++){h=h.concat(f[i][0]);}h.forEach(function(j){var k=u.parseShellHash(j.intent);if(I(k.semanticObject,k.action)){return;}var q=(j.tags&&j.tags.indexOf("superiorAction")>-1);var r=new L({key:(k.semanticObject&&k.action)?k.semanticObject+"-"+k.action:undefined,href:j.intent,visible:true,isSuperiorAction:q});r.setText(j.text);n.availableActions.push(r);if(l){l.addSemanticObjectIntent(k.semanticObject,{text:j.text,intent:j.intent});}});return Promise.resolve(n);});},retrieveSemanticObjectMapping:function(p,o,b){return this._getEntityTypeAnnotationOfProperty(p,o,b).then(function(P){if(!P){return Promise.resolve(null);}if(!P[0]["com.sap.vocabularies.Common.v1.SemanticObjectMapping"]){return Promise.resolve(null);}var s=this._getSemanticObjectMappingsOfProperty(P[0],this._getSemanticObjectsOfProperty(P[0]));var S={};for(var q in s){S[s[q].name]=s[q].mapping;}return Promise.resolve(S);}.bind(this));},retrieveSemanticObjectUnavailableActions:function(p,o,b){return this._getEntityTypeAnnotationOfProperty(p,o,b).then(function(P){if(!P){return Promise.resolve(null);}if(!P[0]["com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions"]){return Promise.resolve(null);}var s=this._getSemanticObjectUnavailableActionsOfProperty(P[0],this._getSemanticObjectsOfProperty(P[0]));var S={};for(var q in s){S[s[q].name]=s[q].unavailableActions;}return Promise.resolve(S);}.bind(this));},_getEntityTypeAnnotationOfProperty:function(p,o,b){if(!p){return Promise.resolve(null);}if(!o||!o.getMetaModel()){return Promise.resolve(null);}var m=o.getMetaModel();return m.loaded().then(function(){var M;try{M=m.getMetaContext(b);}catch(e){c.error("sap.ui.comp.navpopover.Util._getEntityTypeAnnotationOfProperty: binding path '"+b+"' is not valid. Error has been caught: "+e);return Promise.resolve(null);}if(!M){return Promise.resolve(null);}var E=M.getProperty(M.getPath());if(!E.property){return Promise.resolve(null);}var P=E.property.filter(function(a){return a.name===p;});if(P.length!==1){return Promise.resolve(null);}return Promise.resolve(P);});},_getSemanticObjectsOfProperty:function(p){var s={};for(var a in p){var A=a.split("#")[0];var q=a.split("#")[1]||"";if(A.startsWith("com.sap.vocabularies.Common.v1.SemanticObject")&&A.endsWith("com.sap.vocabularies.Common.v1.SemanticObject")){s[q]={name:p[a]["String"],mapping:undefined};}}return s;},_getSemanticObjectMappingsOfProperty:function(p,s){var g=function(S){var m={};if(Array.isArray(S)){S.forEach(function(P){m[P.LocalProperty.PropertyPath]=P.SemanticObjectProperty.String;});}return m;};for(var a in p){var A=a.split("#")[0];var q=a.split("#")[1]||"";if(A.startsWith("com.sap.vocabularies.Common.v1.SemanticObjectMapping")&&A.endsWith("com.sap.vocabularies.Common.v1.SemanticObjectMapping")){if(s[q]){s[q].mapping=g(p[a]);}}}return s;},_getSemanticObjectUnavailableActionsOfProperty:function(p,s){var g=function(S){var u=[];if(Array.isArray(S)){S.forEach(function(o){u.push(o.String);});}return u;};for(var a in p){var A=a.split("#")[0];var q=a.split("#")[1]||"";if(A.startsWith("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions")&&A.endsWith("com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions")){if(s[q]){s[q].unavailableActions=g(p[a]);}}}return s;}};return U;},true);