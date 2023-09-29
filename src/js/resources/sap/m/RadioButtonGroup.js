/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Control','sap/ui/core/delegate/ItemNavigation','sap/ui/core/library','./RadioButton','./RadioButtonGroupRenderer',"sap/base/Log"],function(l,C,I,c,R,a,L){"use strict";var T=c.TextDirection;var V=c.ValueState;var b=C.extend("sap.m.RadioButtonGroup",{metadata:{interfaces:["sap.ui.core.IFormContent"],library:"sap.m",designtime:"sap/m/designtime/RadioButtonGroup.designtime",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},columns:{type:"int",group:"Appearance",defaultValue:1},editable:{type:"boolean",group:"Behavior",defaultValue:true},valueState:{type:"sap.ui.core.ValueState",group:"Data",defaultValue:V.None},selectedIndex:{type:"int",group:"Data",defaultValue:0},enabled:{type:"boolean",group:"Behavior",defaultValue:true},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:T.Inherit}},defaultAggregation:"buttons",aggregations:{buttons:{type:"sap.m.RadioButton",multiple:true,singularName:"button",bindable:"bindable"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{select:{parameters:{selectedIndex:{type:"int"}}}}}});b.prototype.init=function(){this._iSelectionNumber=-1;};b.prototype.exit=function(){this.destroyButtons();if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation;}};b.prototype.onBeforeRendering=function(){var B=this.getButtons();var e=this.getEditable();var d=-1;B.forEach(function(r){if(r.getSelected()){d=Math.max(d,r._iSelectionNumber);}});if(d===-1&&this._iSelectionNumber===-1){this._iSelectionNumber=R.getNextSelectionNumber();}B.forEach(function(r,i){r._setEditableParent(e);if(i===this.getSelectedIndex()&&this._iSelectionNumber>d&&r.isPropertyInitial("selected")){r.setSelected(true);}},this);if(this.aRBs){var v=this.getValueState();this.aRBs.forEach(function(r){r.setValueState(v);});}};b.prototype.onAfterRendering=function(){this._initItemNavigation();};b.prototype._initItemNavigation=function(){var d=[];var h=false;var r=this.getEnabled();for(var i=0;i<this.aRBs.length;i++){d.push(this.aRBs[i].getDomRef());h=h||this.aRBs[i].getEnabled();}if(!h||!r){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation;}return;}if(!this._oItemNavigation){this._oItemNavigation=new I();this._oItemNavigation.attachEvent(I.Events.AfterFocus,this._handleAfterFocus,this);this.addDelegate(this._oItemNavigation);}this._oItemNavigation.setRootDomRef(this.getDomRef());this._oItemNavigation.setItemDomRefs(d);this._oItemNavigation.setCycling(true);this._oItemNavigation.setColumns(this.getColumns());this._oItemNavigation.setSelectedIndex(this._getSelectedIndexInRange());this._oItemNavigation.setFocusedIndex(this._getSelectedIndexInRange());this._oItemNavigation.setDisabledModifiers({sapnext:["alt","meta"],sapprevious:["alt","meta"]});};b.prototype.setSelectedIndex=function(s){var i=this.getSelectedIndex();var h=document.activeElement&&document.activeElement.parentNode&&document.activeElement.parentNode.parentNode===this.getDomRef();var d=!!(this.aRBs&&this.aRBs[s]);if(s<-1){L.warning("Invalid index, will not be changed");return this;}this.setProperty("selectedIndex",s,true);this._iSelectionNumber=R.getNextSelectionNumber();if(!isNaN(i)&&this.aRBs&&this.aRBs[i]){this.aRBs[i].setSelected(false);this.aRBs[i].setTabIndex(-1);}if(this.aRBs&&this.aRBs[s]){this.aRBs[s].setSelected(true);}if(this._oItemNavigation){this._oItemNavigation.setFocusedIndex(s);this._oItemNavigation.setSelectedIndex(s);}if(d&&h){this.aRBs[s].getDomRef().focus();}return this;};b.prototype.setSelectedButton=function(s){if(!s){return this.setSelectedIndex(-1);}var B=this.getButtons();for(var i=0;i<B.length;i++){if(s.getId()==B[i].getId()){return this.setSelectedIndex(i);}}return this;};b.prototype.getSelectedButton=function(){return this.getButtons()[this.getSelectedIndex()];};b.prototype.addButton=function(B){if(!this.aRBs){this.aRBs=[];}var i=this.aRBs.length;this.aRBs[i]=this._createRadioButton(B);this.addAggregation("buttons",this.aRBs[i]);return this;};b.prototype.insertButton=function(B,d){if(!this.aRBs){this.aRBs=[];}var e=this.aRBs.length,m=this.getButtons().length;d=Math.max(Math.min(d,m),0);if(!this._bUpdateButtons){if(this.getSelectedIndex()===undefined||e==0){this.setSelectedIndex(0);}else if(this.getSelectedIndex()>=d){this.setProperty("selectedIndex",this.getSelectedIndex()+1,true);}}if(d>=e){this.aRBs[d]=this._createRadioButton(B);}else{for(var i=(e);i>d;i--){this.aRBs[i]=this.aRBs[i-1];if((i-1)==d){this.aRBs[i-1]=this._createRadioButton(B);}}}this.insertAggregation("buttons",B,d);return this;};b.prototype._createRadioButton=function(B){if(this.iIDCount==undefined){this.iIDCount=0;}else{this.iIDCount++;}B.setValueState(this.getValueState());B.setGroupName(this.getId());B.attachEvent("select",this._handleRBSelect,this);return B;};b.prototype.removeButton=function(e){var i=e;if(typeof(e)=="string"){e=sap.ui.getCore().byId(e);}if(typeof(e)=="object"){i=this.indexOfButton(e);}var B=this.removeAggregation("buttons",i);if(!this.aRBs){this.aRBs=[];}if(!this.aRBs[i]){return null;}this.aRBs.splice(i,1);if(!this._bUpdateButtons){if(this.aRBs.length==0){this.setSelectedIndex(-1);}else if(this.getSelectedIndex()==i){this.setSelectedIndex(0);}else{if(this.getSelectedIndex()>i){this.setProperty("selectedIndex",this.getSelectedIndex()-1,true);}}}return B;};b.prototype.removeAllButtons=function(){if(!this._bUpdateButtons){this.setSelectedIndex(-1);}this.aRBs=[];return this.removeAllAggregation("buttons");};b.prototype.destroyButtons=function(){this.destroyAggregation("buttons");if(this.aRBs){while(this.aRBs.length>0){this.aRBs[0].destroy();this.aRBs.splice(0,1);}}return this;};b.prototype.updateButtons=function(){this._bUpdateButtons=true;this.updateAggregation("buttons");this._bUpdateButtons=undefined;};b.prototype.clone=function(){var B=this.getButtons();var i=0;for(i=0;i<B.length;i++){B[i].detachEvent("select",this._handleRBSelect,this);}var o=C.prototype.clone.apply(this,arguments);for(i=0;i<B.length;i++){B[i].attachEvent("select",this._handleRBSelect,this);}return o;};b.prototype._handleRBSelect=function(o){for(var i=0;i<this.aRBs.length;i++){if(this.aRBs[i].getId()==o.getParameter("id")&&o.getParameter("selected")){this.setSelectedIndex(i);this.fireSelect({selectedIndex:i});break;}}};b.prototype._handleAfterFocus=function(o){var i=o.getParameter("index");var e=o.getParameter("event");if(e.keyCode===undefined){return;}if(i!=this.getSelectedIndex()&&!(e.ctrlKey||e.metaKey)&&this.aRBs[i].getEditable()&&this.aRBs[i].getEnabled()&&this.getEditable()&&this.getEnabled()){this.setSelectedIndex(i);this.fireSelect({selectedIndex:i});this.aRBs.filter(function(r){return r.getEditable()&&r.getEnabled();}).forEach(function(r){if(r===this.aRBs[i]){r.setTabIndex(0);return;}r.setTabIndex(-1);}.bind(this));}};b.prototype._getSelectedIndexInRange=function(o){var i=this.getButtons().length,d=this.getSelectedIndex();if(d>=-1&&d<i){return d;}return-1;};return b;});