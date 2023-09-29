/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/CalendarType','sap/ui/core/Locale','sap/ui/core/LocaleData','sap/ui/core/date/UniversalDate','sap/ui/core/date/CalendarUtils','sap/ui/core/date/CalendarWeekNumbering',"sap/base/util/deepEqual",'sap/base/util/values',"sap/base/strings/formatMessage","sap/base/Log","sap/base/util/extend"],function(C,L,a,U,b,c,d,v,f,e,g){"use strict";var D=function(){throw new Error();};var m={};D.oDateInfo={oDefaultFormatOptions:{style:"medium",relativeScale:"day",relativeStyle:"wide"},aFallbackFormatOptions:[{style:"short"},{style:"medium"},{pattern:"yyyy-MM-dd"},{pattern:"yyyyMMdd",strictParsing:true}],bShortFallbackFormatOptions:true,bPatternFallbackWithoutDelimiter:true,getPattern:function(i,s,j){return i.getDatePattern(s,j);},oRequiredParts:{"text":true,"year":true,"weekYear":true,"month":true,"day":true},aRelativeScales:["year","month","week","day"],aRelativeParseScales:["year","quarter","month","week","day","hour","minute","second"],aIntervalCompareFields:["Era","FullYear","Quarter","Month","Week","Date"]};D.oDateTimeInfo={oDefaultFormatOptions:{style:"medium",relativeScale:"auto",relativeStyle:"wide"},aFallbackFormatOptions:[{style:"short"},{style:"medium"},{pattern:"yyyy-MM-dd'T'HH:mm:ss"},{pattern:"yyyyMMdd HHmmss"}],getPattern:function(i,s,j){var S=s.indexOf("/");if(S>0){return i.getCombinedDateTimePattern(s.substr(0,S),s.substr(S+1),j);}else{return i.getCombinedDateTimePattern(s,s,j);}},oRequiredParts:{"text":true,"year":true,"weekYear":true,"month":true,"day":true,"hour0_23":true,"hour1_24":true,"hour0_11":true,"hour1_12":true},aRelativeScales:["year","month","week","day","hour","minute","second"],aRelativeParseScales:["year","quarter","month","week","day","hour","minute","second"],aIntervalCompareFields:["Era","FullYear","Quarter","Month","Week","Date","DayPeriod","Hours","Minutes","Seconds"]};D.oTimeInfo={oDefaultFormatOptions:{style:"medium",relativeScale:"auto",relativeStyle:"wide"},aFallbackFormatOptions:[{style:"short"},{style:"medium"},{pattern:"HH:mm:ss"},{pattern:"HHmmss"}],getPattern:function(i,s,j){return i.getTimePattern(s,j);},oRequiredParts:{"text":true,"hour0_23":true,"hour1_24":true,"hour0_11":true,"hour1_12":true},aRelativeScales:["hour","minute","second"],aRelativeParseScales:["year","quarter","month","week","day","hour","minute","second"],aIntervalCompareFields:["DayPeriod","Hours","Minutes","Seconds"]};D.getInstance=function(i,j){return this.getDateInstance(i,j);};D.getDateInstance=function(i,j){return this.createInstance(i,j,this.oDateInfo);};D.getDateTimeInstance=function(i,j){return this.createInstance(i,j,this.oDateTimeInfo);};D.getTimeInstance=function(i,j){return this.createInstance(i,j,this.oTimeInfo);};function h(i){var P=i.oLocaleData.getIntervalPattern("",i.oFormatOptions.calendarType);P=P.replace(/[^\{\}01 ]/,"-");return P.replace(/\{(0|1)\}/g,i.oFormatOptions.pattern);}D.createInstance=function(i,j,I){var q=Object.create(this.prototype);if(i instanceof L){j=i;i=undefined;}if(!j){j=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();}q.oLocale=j;q.oLocaleData=a.getInstance(j);q.oFormatOptions=g({},I.oDefaultFormatOptions,i);if(!q.oFormatOptions.calendarType){q.oFormatOptions.calendarType=sap.ui.getCore().getConfiguration().getCalendarType();}if(q.oFormatOptions.calendarWeekNumbering&&v(c).indexOf(q.oFormatOptions.calendarWeekNumbering)<0){throw new TypeError("Illegal format option calendarWeekNumbering: '"+q.oFormatOptions.calendarWeekNumbering+"'");}if(!q.oFormatOptions.pattern){if(q.oFormatOptions.format){q.oFormatOptions.pattern=q.oLocaleData.getCustomDateTimePattern(q.oFormatOptions.format,q.oFormatOptions.calendarType);}else{q.oFormatOptions.pattern=I.getPattern(q.oLocaleData,q.oFormatOptions.style,q.oFormatOptions.calendarType);}}if(q.oFormatOptions.interval){if(q.oFormatOptions.format){q.intervalPatterns=q.oLocaleData.getCustomIntervalPattern(q.oFormatOptions.format,null,q.oFormatOptions.calendarType);if(typeof q.intervalPatterns==="string"){q.intervalPatterns=[q.intervalPatterns];}q.intervalPatterns.push(q.oLocaleData.getCustomDateTimePattern(q.oFormatOptions.format,q.oFormatOptions.calendarType));}else{q.intervalPatterns=[q.oLocaleData.getCombinedIntervalPattern(q.oFormatOptions.pattern,q.oFormatOptions.calendarType),q.oFormatOptions.pattern];}var s=h(q);q.intervalPatterns.push(s);}if(!q.oFormatOptions.fallback){if(!I.oFallbackFormats){I.oFallbackFormats={};}var t=j.toString(),u=q.oFormatOptions.calendarType,K=t+"-"+u,P,w;if(q.oFormatOptions.pattern&&I.bPatternFallbackWithoutDelimiter){K=K+"-"+q.oFormatOptions.pattern;}if(q.oFormatOptions.interval){K=K+"-"+"interval";}var x=I.oFallbackFormats[K]?Object.assign({},I.oFallbackFormats[K]):undefined;if(!x){w=I.aFallbackFormatOptions;if(I.bShortFallbackFormatOptions){P=I.getPattern(q.oLocaleData,"short");w=w.concat(D._createFallbackOptionsWithoutDelimiter(P));}if(q.oFormatOptions.pattern&&I.bPatternFallbackWithoutDelimiter){w=D._createFallbackOptionsWithoutDelimiter(q.oFormatOptions.pattern).concat(w);}x=D._createFallbackFormat(w,u,j,I,q.oFormatOptions.interval);}q.aFallbackFormats=x;}q.oRequiredParts=I.oRequiredParts;q.aRelativeScales=I.aRelativeScales;q.aRelativeParseScales=I.aRelativeParseScales;q.aIntervalCompareFields=I.aIntervalCompareFields;q.init();return q;};D.prototype.init=function(){var s=this.oFormatOptions.calendarType;this.aMonthsAbbrev=this.oLocaleData.getMonths("abbreviated",s);this.aMonthsWide=this.oLocaleData.getMonths("wide",s);this.aMonthsNarrow=this.oLocaleData.getMonths("narrow",s);this.aMonthsAbbrevSt=this.oLocaleData.getMonthsStandAlone("abbreviated",s);this.aMonthsWideSt=this.oLocaleData.getMonthsStandAlone("wide",s);this.aMonthsNarrowSt=this.oLocaleData.getMonthsStandAlone("narrow",s);this.aDaysAbbrev=this.oLocaleData.getDays("abbreviated",s);this.aDaysWide=this.oLocaleData.getDays("wide",s);this.aDaysNarrow=this.oLocaleData.getDays("narrow",s);this.aDaysShort=this.oLocaleData.getDays("short",s);this.aDaysAbbrevSt=this.oLocaleData.getDaysStandAlone("abbreviated",s);this.aDaysWideSt=this.oLocaleData.getDaysStandAlone("wide",s);this.aDaysNarrowSt=this.oLocaleData.getDaysStandAlone("narrow",s);this.aDaysShortSt=this.oLocaleData.getDaysStandAlone("short",s);this.aQuartersAbbrev=this.oLocaleData.getQuarters("abbreviated",s);this.aQuartersWide=this.oLocaleData.getQuarters("wide",s);this.aQuartersNarrow=this.oLocaleData.getQuarters("narrow",s);this.aQuartersAbbrevSt=this.oLocaleData.getQuartersStandAlone("abbreviated",s);this.aQuartersWideSt=this.oLocaleData.getQuartersStandAlone("wide",s);this.aQuartersNarrowSt=this.oLocaleData.getQuartersStandAlone("narrow",s);this.aErasNarrow=this.oLocaleData.getEras("narrow",s);this.aErasAbbrev=this.oLocaleData.getEras("abbreviated",s);this.aErasWide=this.oLocaleData.getEras("wide",s);this.aDayPeriods=this.oLocaleData.getDayPeriods("abbreviated",s);this.aFormatArray=this.parseCldrDatePattern(this.oFormatOptions.pattern);this.sAllowedCharacters=this.getAllowedCharacters(this.aFormatArray);};D._createFallbackFormat=function(i,s,j,I,q){return i.map(function(O){var t=Object.assign({},O);if(q){t.interval=true;}t.calendarType=s;t.fallback=true;var u=D.createInstance(t,j,I);u.bIsFallback=true;return u;});};D._createFallbackOptionsWithoutDelimiter=function(B){var i=/[^dMyGU]/g,j={regex:/d+/g,replace:"dd"},M={regex:/M+/g,replace:"MM"},y={regex:/[yU]+/g,replace:["yyyy","yy"]};B=B.replace(i,"");B=B.replace(j.regex,j.replace);B=B.replace(M.regex,M.replace);return y.replace.map(function(R){return{pattern:B.replace(y.regex,R),strictParsing:true};});};var p={isNumber:function(i){return i>=48&&i<=57;},findNumbers:function(V,M){var i=0;while(i<M&&this.isNumber(V.charCodeAt(i))){i++;}if(typeof V!=="string"){V=V.toString();}return V.substr(0,i);},findEntry:function(V,i){var q=-1,M=0;for(var j=0;j<i.length;j++){if(i[j]&&i[j].length>M&&V.indexOf(i[j])===0){q=j;M=i[j].length;}}return{index:q,value:q===-1?null:i[q]};},parseTZ:function(V,i){var j=0;var t=V.charAt(0)=="+"?-1:1;var P;j++;P=this.findNumbers(V.substr(j),2);var T=parseInt(P);j+=2;if(i){j++;}P=this.findNumbers(V.substr(j),2);var q=0;if(P){j+=2;q=parseInt(P);}return{length:j,tzDiff:(q+60*T)*t};},checkValid:function(t,P,i){if(t in i.oRequiredParts&&P){return false;}}};D._createPatternSymbol=function(P){var i=typeof P.isNumeric==="function"&&P.isNumeric||function(){return P.isNumeric||false;};return{name:P.name,format:P.format||function(){return"";},parse:P.parse||function(){return{};},isNumeric:i};};D.prototype.oSymbols={"":D._createPatternSymbol({name:"text",format:function(i,j,u,q){return i.value;},parse:function(V,P,i,j){var s;var q=true;var t=0;var u=0;var w="\u002d\u007E\u2010\u2011\u2012\u2013\u2014\ufe58\ufe63\uff0d\uFF5E";for(;u<P.value.length;u++){s=P.value.charAt(u);if(s===" "){while(V.charAt(t)===" "){t++;}}else if(w.includes(s)){if(!w.includes(V.charAt(t))){q=false;}t++;}else{if(V.charAt(t)!==s){q=false;}t++;}if(!q){break;}}if(q){return{length:t};}else{var x=false;if(j.index<j.formatArray.length-1){x=(j.formatArray[j.index+1].type in i.oRequiredParts);}return{valid:p.checkValid(P.type,x,i)};}}}),"G":D._createPatternSymbol({name:"era",format:function(i,j,u,q){var E=u?j.getUTCEra():j.getEra();if(i.digits<=3){return q.aErasAbbrev[E];}else if(i.digits===4){return q.aErasWide[E];}else{return q.aErasNarrow[E];}},parse:function(V,P,j,q){var E=[j.aErasWide,j.aErasAbbrev,j.aErasNarrow];for(var i=0;i<E.length;i++){var s=E[i];var t=p.findEntry(V,s);if(t.index!==-1){return{era:t.index,length:t.value.length};}}return{era:j.aErasWide.length-1,valid:p.checkValid(P.type,true,j)};}}),"y":D._createPatternSymbol({name:"year",format:function(i,j,u,q){var y=u?j.getUTCFullYear():j.getFullYear();var Y=String(y);var s=q.oFormatOptions.calendarType;if(i.digits==2&&Y.length>2){Y=Y.substr(Y.length-2);}if(s!=C.Japanese&&i.digits==1&&y<100){Y=Y.padStart(4,"0");}return Y.padStart(i.digits,"0");},parse:function(V,P,i,j){var E,s,q,t=i.oFormatOptions.calendarType;if(P.digits==1){E=4;}else if(P.digits==2){E=2;}else{E=P.digits;}s=p.findNumbers(V,E);q=s===""||j.exactLength&&s.length!==E;var y=parseInt(s);if(t!=C.Japanese&&s.length<=2){var u=U.getInstance(new Date(),t),w=u.getFullYear(),x=Math.floor(w/100),Y=x*100+y-w;if(Y<-70){y+=(x+1)*100;}else if(Y<30){y+=x*100;}else{y+=(x-1)*100;}}return{length:s.length,valid:p.checkValid(P.type,q,i),year:y};},isNumeric:true}),"Y":D._createPatternSymbol({name:"weekYear",format:function(i,j,u,q){var w=u?j.getUTCWeek(q.oLocale,q.oFormatOptions.calendarWeekNumbering):j.getWeek(q.oLocale,q.oFormatOptions.calendarWeekNumbering);var W=w.year;var s=String(W);var t=q.oFormatOptions.calendarType;if(i.digits==2&&s.length>2){s=s.substr(s.length-2);}if(t!=C.Japanese&&i.digits==1&&W<100){s=s.padStart(4,"0");}return s.padStart(i.digits,"0");},parse:function(V,P,i,j){var E,s,q,t=i.oFormatOptions.calendarType;if(P.digits==1){E=4;}else if(P.digits==2){E=2;}else{E=P.digits;}s=p.findNumbers(V,E);q=s===""||j.exactLength&&s.length!==E;var y=parseInt(s);var w;if(t!=C.Japanese&&s.length<=2){var u=U.getInstance(new Date(),t),x=u.getFullYear(),z=Math.floor(x/100),Y=z*100+w-x;if(Y<-70){w+=(z+1)*100;}else if(Y<30){w+=z*100;}else{w+=(z-1)*100;}}return{length:s.length,valid:p.checkValid(P.type,q,i),year:y,weekYear:w};},isNumeric:true}),"M":D._createPatternSymbol({name:"month",format:function(i,j,u,q){var M=u?j.getUTCMonth():j.getMonth();if(i.digits==3){return q.aMonthsAbbrev[M];}else if(i.digits==4){return q.aMonthsWide[M];}else if(i.digits>4){return q.aMonthsNarrow[M];}else{return String(M+1).padStart(i.digits,"0");}},parse:function(V,P,j,q){var M,s,t,u,w=[j.aMonthsWide,j.aMonthsWideSt,j.aMonthsAbbrev,j.aMonthsAbbrevSt,j.aMonthsNarrow,j.aMonthsNarrowSt];if(P.digits<3){s=p.findNumbers(V,Math.max(P.digits,2));t=s===""||q.exactLength&&s.length<2;u=p.checkValid(P.type,t,j);M=parseInt(s)-1;if(q.strict&&(M>11||M<0)){u=false;}}else{for(var i=0;i<w.length;i++){var x=w[i];var y=p.findEntry(V,x);if(y.index!==-1){return{month:y.index,length:y.value.length};}}u=p.checkValid(P.type,true,j);}return{month:M,length:s?s.length:0,valid:u};},isNumeric:function(i){return i<3;}}),"L":D._createPatternSymbol({name:"monthStandalone",format:function(i,j,u,q){var M=u?j.getUTCMonth():j.getMonth();if(i.digits==3){return q.aMonthsAbbrevSt[M];}else if(i.digits==4){return q.aMonthsWideSt[M];}else if(i.digits>4){return q.aMonthsNarrowSt[M];}else{return String(M+1).padStart(i.digits,"0");}},parse:function(V,P,j,q){var M,s,t,u,w=[j.aMonthsWide,j.aMonthsWideSt,j.aMonthsAbbrev,j.aMonthsAbbrevSt,j.aMonthsNarrow,j.aMonthsNarrowSt];if(P.digits<3){s=p.findNumbers(V,Math.max(P.digits,2));t=s===""||q.exactLength&&s.length<2;u=p.checkValid(P.type,t,j);M=parseInt(s)-1;if(q.strict&&(M>11||M<0)){u=false;}}else{for(var i=0;i<w.length;i++){var x=w[i];var y=p.findEntry(V,x);if(y.index!==-1){return{month:y.index,length:y.value.length};}}u=p.checkValid(P.type,true,j);}return{month:M,length:s?s.length:0,valid:u};},isNumeric:function(i){return i<3;}}),"w":D._createPatternSymbol({name:"weekInYear",format:function(i,j,u,q){var w=u?j.getUTCWeek(q.oLocale,q.oFormatOptions.calendarWeekNumbering):j.getWeek(q.oLocale,q.oFormatOptions.calendarWeekNumbering);var W=w.week;var s=String(W+1);if(i.digits<3){s=s.padStart(i.digits,"0");}else{s=q.oLocaleData.getCalendarWeek(i.digits===3?"narrow":"wide",s.padStart(2,"0"));}return s;},parse:function(V,P,i,j){var s,q,t,w,u=0;if(P.digits<3){s=p.findNumbers(V,2);u=s.length;w=parseInt(s)-1;q=!s||j.exactLength&&u<2;t=p.checkValid(P.type,q,i);}else{s=i.oLocaleData.getCalendarWeek(P.digits===3?"narrow":"wide");s=s.replace("{0}","[0-9]+");var x=new RegExp(s),R=x.exec(V);if(R){u=R[0].length;w=parseInt(R[0])-1;}else{t=p.checkValid(P.type,true,i);}}return{length:u,valid:t,week:w};},isNumeric:function(i){return i<3;}}),"W":D._createPatternSymbol({name:"weekInMonth"}),"D":D._createPatternSymbol({name:"dayInYear"}),"d":D._createPatternSymbol({name:"day",format:function(i,j,u,q){var s=u?j.getUTCDate():j.getDate();return String(s).padStart(i.digits,"0");},parse:function(V,P,i,j){var s=p.findNumbers(V,Math.max(P.digits,2)),q=s===""||j.exactLength&&s.length<2,t=p.checkValid(P.type,q,i),u=parseInt(s);if(j.strict&&(u>31||u<1)){t=false;}return{day:u,length:s.length,valid:t};},isNumeric:true}),"Q":D._createPatternSymbol({name:"quarter",format:function(i,j,u,q){var Q=u?j.getUTCQuarter():j.getQuarter();if(i.digits==3){return q.aQuartersAbbrev[Q];}else if(i.digits==4){return q.aQuartersWide[Q];}else if(i.digits>4){return q.aQuartersNarrow[Q];}else{return String(Q+1).padStart(i.digits,"0");}},parse:function(V,P,j,q){var s,t,Q,u;var w=[j.aQuartersWide,j.aQuartersWideSt,j.aQuartersAbbrev,j.aQuartersAbbrevSt,j.aQuartersNarrow,j.aQuartersNarrowSt];if(P.digits<3){s=p.findNumbers(V,Math.max(P.digits,2));t=s===""||q.exactLength&&s.length<2;u=p.checkValid(P.type,t,j);Q=parseInt(s)-1;if(q.strict&&Q>3){u=false;}}else{for(var i=0;i<w.length;i++){var x=w[i];var y=p.findEntry(V,x);if(y.index!==-1){return{quarter:y.index,length:y.value.length};}}u=p.checkValid(P.type,true,j);}return{length:s?s.length:0,quarter:Q,valid:u};},isNumeric:function(i){return i<3;}}),"q":D._createPatternSymbol({name:"quarterStandalone",format:function(i,j,u,q){var Q=u?j.getUTCQuarter():j.getQuarter();if(i.digits==3){return q.aQuartersAbbrevSt[Q];}else if(i.digits==4){return q.aQuartersWideSt[Q];}else if(i.digits>4){return q.aQuartersNarrowSt[Q];}else{return String(Q+1).padStart(i.digits,"0");}},parse:function(V,P,j,q){var s,t,Q,u;var w=[j.aQuartersWide,j.aQuartersWideSt,j.aQuartersAbbrev,j.aQuartersAbbrevSt,j.aQuartersNarrow,j.aQuartersNarrowSt];if(P.digits<3){s=p.findNumbers(V,Math.max(P.digits,2));t=s===""||q.exactLength&&s.length<2;u=p.checkValid(P.type,t,j);Q=parseInt(s)-1;if(q.strict&&Q>3){u=false;}}else{for(var i=0;i<w.length;i++){var x=w[i];var y=p.findEntry(V,x);if(y.index!==-1){return{quarter:y.index,length:y.value.length};}}u=p.checkValid(P.type,true,j);}return{length:s?s.length:0,quarter:Q,valid:u};},isNumeric:function(i){return i<3;}}),"F":D._createPatternSymbol({name:"dayOfWeekInMonth"}),"E":D._createPatternSymbol({name:"dayNameInWeek",format:function(i,j,u,q){var s=u?j.getUTCDay():j.getDay();if(i.digits<4){return q.aDaysAbbrev[s];}else if(i.digits==4){return q.aDaysWide[s];}else if(i.digits==5){return q.aDaysNarrow[s];}else{return q.aDaysShort[s];}},parse:function(V,P,j,q){var s=[j.aDaysWide,j.aDaysWideSt,j.aDaysAbbrev,j.aDaysAbbrevSt,j.aDaysShort,j.aDaysShortSt,j.aDaysNarrow,j.aDaysNarrowSt];for(var i=0;i<s.length;i++){var t=s[i];var u=p.findEntry(V,t);if(u.index!==-1){return{dayOfWeek:u.index,length:u.value.length};}}}}),"c":D._createPatternSymbol({name:"dayNameInWeekStandalone",format:function(i,j,u,q){var s=u?j.getUTCDay():j.getDay();if(i.digits<4){return q.aDaysAbbrevSt[s];}else if(i.digits==4){return q.aDaysWideSt[s];}else if(i.digits==5){return q.aDaysNarrowSt[s];}else{return q.aDaysShortSt[s];}},parse:function(V,P,j,q){var s=[j.aDaysWide,j.aDaysWideSt,j.aDaysAbbrev,j.aDaysAbbrevSt,j.aDaysShort,j.aDaysShortSt,j.aDaysNarrow,j.aDaysNarrowSt];for(var i=0;i<s.length;i++){var t=s[i];var u=p.findEntry(V,t);if(u.index!==-1){return{day:u.index,length:u.value.length};}}}}),"u":D._createPatternSymbol({name:"dayNumberOfWeek",format:function(i,j,u,q){var s=u?j.getUTCDay():j.getDay();return q._adaptDayOfWeek(s);},parse:function(V,P,i,j){var s=p.findNumbers(V,P.digits),q=j.exactLength&&s.length!==P.digits;return{dayNumberOfWeek:parseInt(s),length:s.length,valid:p.checkValid(P.type,q,i)};},isNumeric:true}),"a":D._createPatternSymbol({name:"amPmMarker",format:function(i,j,u,q){var s=u?j.getUTCDayPeriod():j.getDayPeriod();return q.aDayPeriods[s];},parse:function(V,P,i,j){var q;var s;var A=i.aDayPeriods[0],t=i.aDayPeriods[1];var u=/[aApP](?:\.)?[\x20\xA0]?[mM](?:\.)?/;var M=V.match(u);var w=(M&&M.index===0);if(w){V=M[0];A=A.replace(/[\x20\xA0]/g,"");t=t.replace(/[\x20\xA0]/g,"");V=V.replace(/[\x20\xA0]/g,"");A=A.replace(/\./g,"").toLowerCase();t=t.replace(/\./g,"").toLowerCase();V=V.replace(/\./g,"").toLowerCase();}if(V.indexOf(A)===0){q=false;s=(w?M[0].length:A.length);}else if(V.indexOf(t)===0){q=true;s=(w?M[0].length:t.length);}return{pm:q,length:s};}}),"H":D._createPatternSymbol({name:"hour0_23",format:function(i,j,u,q){var H=u?j.getUTCHours():j.getHours();return String(H).padStart(i.digits,"0");},parse:function(V,P,i,j){var s=p.findNumbers(V,Math.max(P.digits,2)),H=parseInt(s),q=s===""||j.exactLength&&s.length<2,t=p.checkValid(P.type,q,i);if(j.strict&&H>23){t=false;}return{hour:H,length:s.length,valid:t};},isNumeric:true}),"k":D._createPatternSymbol({name:"hour1_24",format:function(i,j,u,q){var H=u?j.getUTCHours():j.getHours();var s=(H===0?"24":String(H));return s.padStart(i.digits,"0");},parse:function(V,P,i,j){var s=p.findNumbers(V,Math.max(P.digits,2)),H=parseInt(s),q=s===""||j.exactLength&&s.length<2,t=p.checkValid(P.type,q,i);if(H==24){H=0;}if(j.strict&&H>23){t=false;}return{hour:H,length:s.length,valid:t};},isNumeric:true}),"K":D._createPatternSymbol({name:"hour0_11",format:function(i,j,u,q){var H=u?j.getUTCHours():j.getHours();var s=String(H>11?H-12:H);return s.padStart(i.digits,"0");},parse:function(V,P,i,j){var s=p.findNumbers(V,Math.max(P.digits,2)),H=parseInt(s),q=s===""||j.exactLength&&s.length<2,t=p.checkValid(P.type,q,i);if(j.strict&&H>11){t=false;}return{hour:H,length:s.length,valid:t};},isNumeric:true}),"h":D._createPatternSymbol({name:"hour1_12",format:function(i,j,u,q){var H=u?j.getUTCHours():j.getHours();var s;if(H>12){s=String(H-12);}else if(H==0){s="12";}else{s=String(H);}return s.padStart(i.digits,"0");},parse:function(V,P,i,j){var q=j.dateValue.pm,s=p.findNumbers(V,Math.max(P.digits,2)),H=parseInt(s),t=s===""||j.exactLength&&s.length<2,u=p.checkValid(P.type,t,i);if(H==12){H=0;q=(q===undefined)?true:q;}if(j.strict&&H>11){u=false;}return{hour:H,length:s.length,pm:q,valid:u};},isNumeric:true}),"m":D._createPatternSymbol({name:"minute",format:function(i,j,u,q){var M=u?j.getUTCMinutes():j.getMinutes();return String(M).padStart(i.digits,"0");},parse:function(V,P,i,j){var s=p.findNumbers(V,Math.max(P.digits,2)),M=parseInt(s),q=s===""||j.exactLength&&s.length<2,t=p.checkValid(P.type,q,i);if(j.strict&&M>59){t=false;}return{length:s.length,minute:M,valid:t};},isNumeric:true}),"s":D._createPatternSymbol({name:"second",format:function(i,j,u,q){var s=u?j.getUTCSeconds():j.getSeconds();return String(s).padStart(i.digits,"0");},parse:function(V,P,i,j){var E=Math.max(P.digits,2),s=p.findNumbers(V,E),q=s===""||j.exactLength&&s.length<E,S=parseInt(s),t=p.checkValid(P.type,q,i);if(j.strict&&S>59){t=false;}return{length:s.length,second:S,valid:t};},isNumeric:true}),"S":D._createPatternSymbol({name:"fractionalsecond",format:function(i,j,u,q){var M=u?j.getUTCMilliseconds():j.getMilliseconds();var s=String(M);var t=s.padStart(3,"0");t=t.substr(0,i.digits);t=t.padEnd(i.digits,"0");return t;},parse:function(V,P,i,j){var s=p.findNumbers(V,P.digits),q=s.length,t=j.exactLength&&q<P.digits;s=s.substr(0,3);s=s.padEnd(3,"0");var M=parseInt(s);return{length:q,millisecond:M,valid:p.checkValid(P.type,t,i)};},isNumeric:true}),"z":D._createPatternSymbol({name:"timezoneGeneral",format:function(i,j,u,q){if(i.digits>3&&j.getTimezoneLong&&j.getTimezoneLong()){return j.getTimezoneLong();}else if(j.getTimezoneShort&&j.getTimezoneShort()){return j.getTimezoneShort();}var t="GMT";var T=Math.abs(j.getTimezoneOffset());var P=j.getTimezoneOffset()>0;var H=Math.floor(T/60);var M=T%60;if(!u&&T!=0){t+=(P?"-":"+");t+=String(H).padStart(2,"0");t+=":";t+=String(M).padStart(2,"0");}else{t+="Z";}return t;},parse:function(V,P,i,j){var q=0;var t;var T=V.substring(0,3);if(T==="GMT"||T==="UTC"){q=3;}else if(V.substring(0,2)==="UT"){q=2;}else if(V.charAt(0)==="Z"){q=1;t=0;}else{return{error:"cannot be parsed correcly by sap.ui.core.format.DateFormat: The given timezone is not supported!"};}if(V.charAt(0)!=="Z"){var s=p.parseTZ(V.substr(q),true);q+=s.length;t=s.tzDiff;}return{length:q,tzDiff:t};}}),"Z":D._createPatternSymbol({name:"timezoneRFC822",format:function(i,j,u,q){var t=Math.abs(j.getTimezoneOffset());var P=j.getTimezoneOffset()>0;var H=Math.floor(t/60);var M=t%60;var T="";if(!u){T+=(P?"-":"+");T+=String(H).padStart(2,"0");T+=String(M).padStart(2,"0");}return T;},parse:function(V,P,i,j){return p.parseTZ(V,false);}}),"X":D._createPatternSymbol({name:"timezoneISO8601",format:function(i,j,u,q){var t=Math.abs(j.getTimezoneOffset());var P=j.getTimezoneOffset()>0;var H=Math.floor(t/60);var M=t%60;var T="";if(!u&&t!=0){T+=(P?"-":"+");T+=String(H).padStart(2,"0");if(i.digits>1||M>0){if(i.digits===3||i.digits===5){T+=":";}T+=String(M).padStart(2,"0");}}else{T+="Z";}return T;},parse:function(V,P,i,j){if(V.charAt(0)==="Z"){return{length:1,tzDiff:0};}else{return p.parseTZ(V,P.digits===3||P.digits===5);}}})};D.prototype._format=function(j,u){if(this.oFormatOptions.relative){var R=this.formatRelative(j,u,this.oFormatOptions.relativeRange);if(R){return R;}}var s=this.oFormatOptions.calendarType;var q=U.getInstance(j,s);var B=[],P,t,S;for(var i=0;i<this.aFormatArray.length;i++){P=this.aFormatArray[i];S=P.symbol||"";B.push(this.oSymbols[S].format(P,q,u,this));}t=B.join("");if(sap.ui.getCore().getConfiguration().getOriginInfo()){t=new String(t);t.originInfo={source:"Common Locale Data Repository",locale:this.oLocale.toString(),style:this.oFormatOptions.style,pattern:this.oFormatOptions.pattern};}return t;};D.prototype.format=function(j,u){var s=this.oFormatOptions.calendarType,R;if(u===undefined){u=this.oFormatOptions.UTC;}if(Array.isArray(j)){if(!this.oFormatOptions.interval){e.error("Non-interval DateFormat can't format more than one date instance.");return"";}if(j.length!==2){e.error("Interval DateFormat can only format with 2 date instances but "+j.length+" is given.");return"";}if(this.oFormatOptions.singleIntervalValue){if(j[0]===null){e.error("First date instance which is passed to the interval DateFormat shouldn't be null.");return"";}if(j[1]===null){R=this._format(j[0],u);}}if(R===undefined){var V=j.every(function(J){return J&&!isNaN(J.getTime());});if(!V){e.error("At least one date instance which is passed to the interval DateFormat isn't valid.");return"";}R=this._formatInterval(j,u);}}else{if(!j||isNaN(j.getTime())){e.error("The given date instance isn't valid.");return"";}if(this.oFormatOptions.interval){e.error("Interval DateFormat expects an array with two dates for the first argument but only one date is given.");return"";}R=this._format(j,u);}if(s==C.Japanese&&this.oLocale.getLanguage()==="ja"){R=R.replace(/(^|[^\d])1年/g,"$1元年");}return R;};D.prototype._formatInterval=function(j,u){var s=this.oFormatOptions.calendarType;var q=U.getInstance(j[0],s);var t=U.getInstance(j[1],s);var w;var P;var S;var B=[];var x;var y=[];var z=this._getGreatestDiffField([q,t],u);if(!z){return this._format(j[0],u);}if(this.oFormatOptions.format){x=this.oLocaleData.getCustomIntervalPattern(this.oFormatOptions.format,z,s);}else{x=this.oLocaleData.getCombinedIntervalPattern(this.oFormatOptions.pattern,s);}y=this.parseCldrDatePattern(x);w=q;for(var i=0;i<y.length;i++){P=y[i];S=P.symbol||"";if(P.repeat){w=t;}B.push(this.oSymbols[S].format(P,w,u,this));}return B.join("");};var F={Era:"Era",FullYear:"Year",Quarter:"Quarter",Month:"Month",Week:"Week",Date:"Day",DayPeriod:"DayPeriod",Hours:"Hour",Minutes:"Minute",Seconds:"Second"};D.prototype._getGreatestDiffField=function(i,u){var j=false,q={};this.aIntervalCompareFields.forEach(function(s){var G="get"+(u?"UTC":""),M=G+s,t=F[s],w=i[0][M].apply(i[0]),T=i[1][M].apply(i[1]);if(!d(w,T)){j=true;q[t]=true;}});if(j){return q;}return null;};D.prototype._parse=function(V,j,u,s){var N,P,q,R,S,t={valid:true},I=0,w={formatArray:j,dateValue:t,strict:s},x=this;function y(A){return x.oSymbols[A.symbol||""];}function z(A){return!!A&&y(A).isNumeric(A.digits);}for(var i=0;i<j.length;i++){S=V.substr(I);P=j[i];q=j[i-1];N=j[i+1];w.index=i;w.exactLength=z(P)&&(z(q)||z(N));R=y(P).parse(S,P,this,w)||{};t=g(t,R);if(R.valid===false){break;}I+=R.length||0;}t.index=I;if(t.pm){t.hour+=12;}if(t.dayNumberOfWeek===undefined&&t.dayOfWeek!==undefined){t.dayNumberOfWeek=this._adaptDayOfWeek(t.dayOfWeek);}if(t.quarter!==undefined&&t.month===undefined&&t.day===undefined){t.month=3*t.quarter;t.day=1;}return t;};D.prototype._parseInterval=function(V,s,u,S){var j,R,q;this.intervalPatterns.some(function(P){var t=this.parseCldrDatePattern(P);R=undefined;for(var i=0;i<t.length;i++){if(t[i].repeat){R=i;break;}}if(R===undefined){q=this._parse(V,t,u,S);if(q.index===0||q.index<V.length){q.valid=false;}if(q.valid===false){return;}j=[q,q];return true;}else{j=[];q=this._parse(V,t.slice(0,R),u,S);if(q.valid===false){return;}j.push(q);var w=q.index;q=this._parse(V.substring(w),t.slice(R),u,S);if(q.index===0||q.index+w<V.length){q.valid=false;}if(q.valid===false){return;}j.push(q);return true;}}.bind(this));return j;};var k=function(i,s,u,S,j,q){var t,y=typeof i.year==="number"?i.year:1970;if(i.valid){if(u||i.tzDiff!==undefined){t=U.getInstance(new Date(0),s);t.setUTCEra(i.era||U.getCurrentEra(s));t.setUTCFullYear(y);t.setUTCMonth(i.month||0);t.setUTCDate(i.day||1);t.setUTCHours(i.hour||0);t.setUTCMinutes(i.minute||0);t.setUTCSeconds(i.second||0);t.setUTCMilliseconds(i.millisecond||0);if(S&&(i.day||1)!==t.getUTCDate()){i.valid=false;t=undefined;}else{if(i.tzDiff){t.setUTCMinutes((i.minute||0)+i.tzDiff);}if(i.week!==undefined&&(i.month===undefined||i.day===undefined)){t.setUTCWeek({year:i.weekYear||i.year,week:i.week},q,j.calendarWeekNumbering);if(i.dayNumberOfWeek!==undefined){t.setUTCDate(t.getUTCDate()+i.dayNumberOfWeek-1);}}}}else{t=U.getInstance(new Date(1970,0,1,0,0,0),s);t.setEra(i.era||U.getCurrentEra(s));t.setFullYear(y);t.setMonth(i.month||0);t.setDate(i.day||1);t.setHours(i.hour||0);t.setMinutes(i.minute||0);t.setSeconds(i.second||0);t.setMilliseconds(i.millisecond||0);if(S&&(i.day||1)!==t.getDate()){i.valid=false;t=undefined;}else if(i.week!==undefined&&(i.month===undefined||i.day===undefined)){t.setWeek({year:i.weekYear||i.year,week:i.week},q,j.calendarWeekNumbering);if(i.dayNumberOfWeek!==undefined){t.setDate(t.getDate()+i.dayNumberOfWeek-1);}}}if(i.valid){t=t.getJSDate();return t;}}return null;};function l(i,j){if(i===j){return i;}var M={};Object.keys(i).forEach(function(K){M[K]=i[K];});Object.keys(j).forEach(function(K){if(!M.hasOwnProperty(K)){M[K]=j[K];}});return M;}function n(s,E){if(s.getTime()>E.getTime()){return false;}return true;}D.prototype.parse=function(V,u,s){V=V==null?"":String(V).trim();var i;var j=this.oFormatOptions.calendarType;if(u===undefined){u=this.oFormatOptions.UTC;}if(s===undefined){s=this.oFormatOptions.strictParsing;}if(j==C.Japanese&&this.oLocale.getLanguage()==="ja"){V=V.replace(/元年/g,"1年");}if(!this.oFormatOptions.interval){var J=this.parseRelative(V,u);if(J){return J;}i=this._parse(V,this.aFormatArray,u,s);if(i.index===0||i.index<V.length){i.valid=false;}J=k(i,j,u,s,this.oFormatOptions,this.oLocale);if(J){return J;}}else{var q=this._parseInterval(V,j,u,s);var t,w;if(q&&q.length==2){var x=l(q[0],q[1]);var y=l(q[1],q[0]);t=k(x,j,u,s,this.oFormatOptions,this.oLocale);w=k(y,j,u,s,this.oFormatOptions,this.oLocale);if(t&&w){if(this.oFormatOptions.singleIntervalValue&&t.getTime()===w.getTime()){return[t,null];}var z=n(t,w);if(s&&!z){e.error("StrictParsing: Invalid date range. The given end date is before the start date.");return[null,null];}return[t,w];}}}if(!this.bIsFallback){var A;this.aFallbackFormats.every(function(B){A=B.parse(V,u,s);if(Array.isArray(A)){return!(A[0]&&A[1]);}else{return!A;}});return A;}if(!this.oFormatOptions.interval){return null;}else{return[null,null];}};D.prototype.parseCldrDatePattern=function(P){if(m[P]){return m[P];}var j=[],i,q=false,s=null,S="",N="",A={},I=false;for(i=0;i<P.length;i++){var t=P.charAt(i),u,w,x;if(q){if(t=="'"){w=P.charAt(i-1);x=P.charAt(i-2);u=P.charAt(i+1);if(w=="'"&&x!="'"){q=false;}else if(u=="'"){i+=1;}else{q=false;continue;}}if(S=="text"){s.value+=t;}else{s={type:"text",value:t};j.push(s);S="text";}}else{if(t=="'"){q=true;}else if(this.oSymbols[t]){N=this.oSymbols[t].name;if(S==N){s.digits++;}else{s={type:N,symbol:t,digits:1};j.push(s);S=N;if(!I){if(A[N]){s.repeat=true;I=true;}else{A[N]=true;}}}}else{if(S=="text"){s.value+=t;}else{s={type:"text",value:t};j.push(s);S="text";}}}}m[P]=j;return j;};D.prototype.parseRelative=function(V,u){var P,E,j,R,q;if(!V){return null;}P=this.oLocaleData.getRelativePatterns(this.aRelativeParseScales,this.oFormatOptions.relativeStyle);for(var i=0;i<P.length;i++){E=P[i];j=new RegExp("^\\s*"+E.pattern.replace(/\{0\}/,"(\\d+)")+"\\s*$","i");R=j.exec(V);if(R){if(E.value!==undefined){return s(E.value,E.scale);}else{q=parseInt(R[1]);return s(q*E.sign,E.scale);}}}function s(t,S){var T,w=new Date(),J;if(u){T=w.getTime();}else{T=Date.UTC(w.getFullYear(),w.getMonth(),w.getDate(),w.getHours(),w.getMinutes(),w.getSeconds(),w.getMilliseconds());}J=new Date(T);switch(S){case"second":J.setUTCSeconds(J.getUTCSeconds()+t);break;case"minute":J.setUTCMinutes(J.getUTCMinutes()+t);break;case"hour":J.setUTCHours(J.getUTCHours()+t);break;case"day":J.setUTCDate(J.getUTCDate()+t);break;case"week":J.setUTCDate(J.getUTCDate()+t*7);break;case"month":J.setUTCMonth(J.getUTCMonth()+t);break;case"quarter":J.setUTCMonth(J.getUTCMonth()+t*3);break;case"year":J.setUTCFullYear(J.getUTCFullYear()+t);break;}if(u){return J;}else{return new Date(J.getUTCFullYear(),J.getUTCMonth(),J.getUTCDate(),J.getUTCHours(),J.getUTCMinutes(),J.getUTCSeconds(),J.getUTCMilliseconds());}}};D.prototype.formatRelative=function(j,u,R){var t=new Date(),i,s=this.oFormatOptions.relativeScale||"day",q,P,w;w=(j.getTime()-t.getTime())/1000;if(this.oFormatOptions.relativeScale=="auto"){s=this._getScale(w,this.aRelativeScales);}if(!R){R=this._mRanges[s];}if(s=="year"||s=="month"||s=="day"){t=new Date(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()));i=new Date(0);if(u){i.setUTCFullYear(j.getUTCFullYear(),j.getUTCMonth(),j.getUTCDate());}else{i.setUTCFullYear(j.getFullYear(),j.getMonth(),j.getDate());}j=i;}q=this._getDifference(s,[t,j]);if(this.oFormatOptions.relativeScale!="auto"&&(q<R[0]||q>R[1])){return null;}P=this.oLocaleData.getRelativePattern(s,q,w>0,this.oFormatOptions.relativeStyle);return f(P,[Math.abs(q)]);};D.prototype._mRanges={second:[-60,60],minute:[-60,60],hour:[-24,24],day:[-6,6],week:[-4,4],month:[-12,12],year:[-10,10]};D.prototype._mScales={second:1,minute:60,hour:3600,day:86400,week:604800,month:2592000,quarter:7776000,year:31536000};D.prototype._getScale=function(j,s){var S,t;j=Math.abs(j);for(var i=0;i<s.length;i++){t=s[i];if(j>=this._mScales[t]){S=t;break;}}if(!S){S=s[s.length-1];}return S;};function o(j,s){var q=["FullYear","Month","Date","Hours","Minutes","Seconds","Milliseconds"],M;var t=new Date(j.getTime());for(var i=s;i<q.length;i++){M="set"+q[s];t[M].apply(t,[0]);}return t;}var r={year:function(i,t){return t.getFullYear()-i.getFullYear();},month:function(i,t){return t.getMonth()-i.getMonth()+(this.year(i,t)*12);},week:function(i,t,j){var q=j._adaptDayOfWeek(i.getDay());var T=j._adaptDayOfWeek(t.getDay());i=o(i,3);t=o(t,3);return(t.getTime()-i.getTime()-(T-q)*j._mScales.day*1000)/(j._mScales.week*1000);},day:function(i,t,j){i=o(i,3);t=o(t,3);return(t.getTime()-i.getTime())/(j._mScales.day*1000);},hour:function(i,t,j){i=o(i,4);t=o(t,4);return(t.getTime()-i.getTime())/(j._mScales.hour*1000);},minute:function(i,t,j){i=o(i,5);t=o(t,5);return(t.getTime()-i.getTime())/(j._mScales.minute*1000);},second:function(i,t,j){i=o(i,6);t=o(t,6);return(t.getTime()-i.getTime())/(j._mScales.second*1000);}};D.prototype._adaptDayOfWeek=function(i){var s=this.oFormatOptions.calendarWeekNumbering;var j=b.getWeekConfigurationValues(s,this.oLocale).firstDayOfWeek;var q=i-(j-1);if(q<=0){q+=7;}return q;};D.prototype._getDifference=function(s,i){var j=i[0];var t=i[1];return Math.round(r[s](j,t,this));};D.prototype.getAllowedCharacters=function(j){if(this.oFormatOptions.relative){return"";}var A="";var N=false;var q=false;var P;for(var i=0;i<j.length;i++){P=j[i];switch(P.type){case"text":if(A.indexOf(P.value)<0){A+=P.value;}break;case"day":case"year":case"weekYear":case"dayNumberOfWeek":case"weekInYear":case"hour0_23":case"hour1_24":case"hour0_11":case"hour1_12":case"minute":case"second":case"fractionalsecond":if(!N){A+="0123456789";N=true;}break;case"month":case"monthStandalone":if(P.digits<3){if(!N){A+="0123456789";N=true;}}else{q=true;}break;default:q=true;break;}}if(q){A="";}return A;};D.prototype.getPlaceholderText=function(){var R=sap.ui.getCore().getLibraryResourceBundle();return R.getText("date.placeholder",[this.format.apply(this,this.getSampleValue())]);};D.prototype.getSampleValue=function(){var i,j=new Date().getFullYear(),u=this.oFormatOptions.UTC;function q(y,M,s,H,t,S,w){return u?new Date(Date.UTC(y,M,s,H,t,S,w)):new Date(y,M,s,H,t,S,w);}i=q(j,11,31,23,59,58,123);if(this.oFormatOptions.interval){return[[q(j,11,22,9,12,34,567),i]];}return[i];};return D;},true);