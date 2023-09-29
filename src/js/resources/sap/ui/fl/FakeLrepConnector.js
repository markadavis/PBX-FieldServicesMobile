/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/fl/write/_internal/connectors/ObjectPathConnector","sap/ui/fl/apply/_internal/connectors/ObjectStorageUtils"],function(D,O,a){"use strict";var F={};var b="sap.ui.fl";F.prototype={};F.enableFakeConnector=function(i){this.setFlexibilityServicesAndClearCache("LocalStorageConnector",i);};F.setFlexibilityServicesAndClearCache=function(s,i){this._oFlexibilityServices=sap.ui.getCore().getConfiguration().getFlexibilityServices();var c=[];if(i){O.setJsonPath(i);c.push({connector:"ObjectPathConnector"});}c.push({connector:s});sap.ui.getCore().getConfiguration().setFlexibilityServices(c);sap.ui.requireSync("sap/ui/fl/Cache").clearEntries();};F.disableFakeConnector=function(){F.prototype={};sap.ui.requireSync("sap/ui/fl/Cache").clearEntries();if(this._oFlexibilityServices){sap.ui.getCore().getConfiguration().setFlexibilityServices(this._oFlexibilityServices);delete this._oFlexibilityServices;}};F.forTesting={getNumberOfChanges:function(c,r){return c.loadFlexData({reference:r}).then(function(R){return R.reduce(function(n,o){return n+o.changes.length;},0);});},spyMethod:function(s,c,C,m){var S=s.spy(C,m);return function(n,i){i=i||0;var N=S.getCall(i).args[0].flexObjects.length;c.equal(N,n,m+" was called "+n+" times");};},clear:function(c,p){sap.ui.requireSync("sap/ui/fl/Cache").clearEntries();return c.reset(p);},setStorage:function(c,n){c.storage=n;},synchronous:{clearAll:function(s){var r=function(k){if(k.indexOf(b)===-1){return;}s.removeItem(k);};if(D.browser.msie){var S=s.length;for(var i=S-1;i>=0;i--){var k=s.key(i);r(k);}}else{Object.keys(s).map(r);}},store:function(s,k,i){var f=a.createFlexKey(k);var I=JSON.stringify(i);s.setItem(f,I);},getNumberOfChanges:function(s,r){var c=0;Object.keys(s).map(function(k){if(k.indexOf(b)===-1){return;}var f=JSON.parse(s.getItem(k));if(f.reference===r||f.reference+".Component"===r){c++;}});return c;}}};return F;},true);