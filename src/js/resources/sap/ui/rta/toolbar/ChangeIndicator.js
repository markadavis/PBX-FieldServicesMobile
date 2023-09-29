/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Fragment","sap/ui/model/json/JSONModel","sap/ui/core/Control","sap/m/Text","sap/ui/core/format/DateFormat","sap/ui/core/Icon","sap/ui/dt/OverlayRegistry"],function(F,J,C,T,D,I,O){"use strict";return C.extend("sap.ui.rta.toolbar.ChangeIndicator",{metadata:{properties:{mode:{type:"string",defaultValue:"change"},parentId:{type:"string",defaultValue:""},changes:{type:"any",defaultValue:""}},aggregations:{_popover:{type:"sap.m.Popover",multiple:false,visibility:"hidden"},_text:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_icon:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}},defaultAggregation:"content"},init:function(){this.setAggregation("_text",new T({text:this.getChanges().length}).addStyleClass("sapUiRtaChangeIndicatorText"));this.setAggregation("_icon",new I({src:"sap-icon://display",visible:false}).addStyleClass("sapUiRtaChangeIndicatorIcon"));},addChange:function(c){this.getChanges().push(c);this.getAggregation("_text").setText(this.getChanges().length);},renderer:{apiVersion:2,render:function(r,c){r.openStart("div",c);r.class("sapUiRtaChangeIndicator");r.class("sapUiRtaChangeIndicator-"+c.getMode());r.openEnd();r.openStart("div");r.openEnd();r.renderControl(c.getAggregation("_icon"));if(c.getChanges().length>1){r.renderControl(c.getAggregation("_text"));}r.close("div");r.close("div");}},onAfterRendering:function(){var e=document.getElementById(this.sId);var p=document.getElementById(this.getParentId());p.appendChild(e);var h=p.offsetHeight;if(h>50){h=50;}h-=2;e.style.width=h+"px";e.style.height=h+"px";if(this.getAggregation("_text").getDomRef()){this.getAggregation("_text").getDomRef().style.fontSize=(h/3)+"px";if(h<25){this.getAggregation("_text").getDomRef().style.height=h+"px";this.getAggregation("_text").getDomRef().style.width=h+"px";this.getAggregation("_text").getDomRef().style.fontSize=(h-2)+"px";}}if(this.getAggregation("_icon").getDomRef()){this.getAggregation("_icon").getDomRef().style.fontSize=(h*0.5)+"px";}this.attachBrowserEvent("click",function(E){E.stopPropagation();this.openDetailPopover();});},remove:function(){this.removeDependentElements();var p="";if(!document.getElementById(this.sId)){p="sap-ui-invisible-";}var n=document.getElementById(p+this.sId);n.parentNode.removeChild(n);},hide:function(){this.setVisible(false);},reveal:function(){this.setVisible(true);},showDependentElements:function(e){this.detachBrowserEvent("click",this.openDetailPopover);this.getAggregation("_icon").setVisible(true);this.getAggregation("_text").setVisible(false);this.hideChangeIndicators();this.reveal();this.getAggregation("_popover").close();this.addStyleClass("sapUiRtaChangeIndicator-change-solid");this.aDependentElementsChangeIndicators=[];var c;if(this.getChanges().length>1){var b=e.getSource().getBindingContext("changesModel");c=b.getModel().getProperty(b.getPath()).change;}else{c=this.getChanges()[0];}this.getChangedElements(c,true).then(function(a){a.forEach(function(o){var d=this.createChangeIndicator(c,o,"dependent");if(d&&d.getParentId()!==this.getParentId()){this.aDependentElementsChangeIndicators.push(d);this.getParent().addContent(d);}}.bind(this));this.attachBrowserEvent("click",this.hideDependentElements);}.bind(this));},removeDependentElements:function(){if(this.aDependentElementsChangeIndicators){this.aDependentElementsChangeIndicators.forEach(function(c){c.remove();c.destroy();});}this.aDependentElementsChangeIndicators=[];},hideDependentElements:function(){this.detachBrowserEvent("click",this.hideDependentElements);this.removeDependentElements();this.revealChangeIndicators();this.getAggregation("_popover").openBy(this);this.getAggregation("_icon").setVisible(false);this.getAggregation("_text").setVisible(true);this.removeStyleClass("sapUiRtaChangeIndicator-change-solid");this.attachBrowserEvent("click",this.click);},getChangesModelItem:function(c){return this.getChangedElements(c,false).then(function(a){var o=a[0];var b=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");var s=c.getDefinition().support.command;var m=this.getMode();var d;var e=(s).charAt(0).toUpperCase()+(s).slice(1);var f;var E=false;var g=" ";var h=O.getOverlay(o);if(h){g="'"+h.getDesignTimeMetadata().getLabel(o)+"'";}d=b.getText("TXT_CHANGEVISUALIZATION_"+m.toUpperCase()+"_"+s.toUpperCase(),g);f=D.getDateTimeInstance().format(new Date(c.getCreation()));E=(m==="change"&&(s==="move"||s==="split"));var i={change:c,changeTitle:e,description:d,date:f,enableDetailButton:E};return i;}.bind(this));},openDetailPopover:function(){var c={changes:[]};var p=[];this.getChanges().forEach(function(o){p.push(this.getChangesModelItem(o));}.bind(this));Promise.all(p).then(function(r){r.forEach(function(i){c.changes.push(i);});if(!this.getAggregation("_popover")){var f="sap.ui.rta.toolbar.ChangeIndicatorPopover";if(c.changes.length===1){f="sap.ui.rta.toolbar.SingleChangeIndicatorPopover";}F.load({name:f,id:this.getId()+"_fragment",controller:this}).then(function(a){var m=new J(c);a.setModel(m,"changesModel");this.setAggregation("_popover",a);this.getAggregation("_popover").openBy(this);}.bind(this));}else{this.getAggregation("_popover").openBy(this);}}.bind(this));}});});