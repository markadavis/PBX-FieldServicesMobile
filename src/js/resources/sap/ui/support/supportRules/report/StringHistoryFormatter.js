/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var _=Array(196).join("-"),a="|";function f(t,g){var h="",t=t||"";if(!g){g=50;}h=t.replace(/(\r\n|\n|\r)/gm," ").replace(/(\")/gm,"");if(h.length>g){h=h.substring(0,g-3)+"...";}else{while(h.length<g){h+=" ";}}return h;}function b(r){if(r.issues.length){var t=_+"\n";t+=a+f("rule id: "+r.id,193)+a+"\n";t+=a+f("name: "+r.name,193)+a+"\n";t+=a+f("library: "+r.library,193)+a+"\n";t+=a+f("categories: "+r.categories.join(", "),193)+a+"\n";t+=a+f("audiences: "+r.audiences.join(", "),193)+a+"\n";t+=a+f("description: "+r.description,193)+a+"\n";t+=a+f("resolution: "+r.resolution,193)+a+"\n";t+=_+"\n";t+=a+f("id",50);t+=a+f("class name",30);t+=a+f("status",10);t+=a+f("details",100);t+=a+"\n";t+=_+"\n";for(var i=0;i<r.issues.length;i++){t+=a+f(r.issues[i].context.id,50);t+=a+f(r.issues[i].context.className,30);t+=a+f(r.issues[i].severity,10);t+=a+f(r.issues[i].details,100);t+=a+"\n";}t+=_+"\n";return t;}return"";}function c(l){var t="";if(!l){return t;}for(var g in l){if(l[g].issueCount){for(var r in l[g]["rules"]){t+=b(l[g]["rules"][r]);}t+="\n";}}t+="\n";return t;}function d(r){var t="Rule Preset / ID : ";if(r){t+=r.title+" / "+r.id;}else{t+="none";}return t;}function e(g){var t="";if(!g){return t;}for(var i=0;i<g.length;i++){t+="\n";t+="Run "+(i+1)+" - executed on "+g[i].analysisInfo.date+"\n";t+=d(g[i].analysisInfo.rulePreset);t+="\n";t+=c(g[i].loadedLibraries);t+="\n";}return t;}return{format:e};},true);