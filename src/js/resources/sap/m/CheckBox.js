/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Label','./library','sap/ui/Device','sap/ui/core/Control','sap/ui/core/IconPool','sap/ui/core/EnabledPropagator','sap/ui/core/library','./CheckBoxRenderer',"sap/ui/thirdparty/jquery","sap/ui/events/KeyCodes",'sap/ui/core/LabelEnablement','sap/ui/core/message/MessageMixin'],function(L,l,D,C,I,E,c,a,q,K,b,M){"use strict";var V=c.ValueState;var T=c.TextAlign;var d=c.TextDirection;var e=C.extend("sap.m.CheckBox",{metadata:{interfaces:["sap.m.IToolbarInteractiveControl","sap.ui.core.IFormContent"],library:"sap.m",properties:{selected:{type:"boolean",group:"Data",defaultValue:false},partiallySelected:{type:"boolean",group:"Data",defaultValue:false},enabled:{type:"boolean",group:"Behavior",defaultValue:true},name:{type:"string",group:"Misc",defaultValue:null},text:{type:"string",group:"Appearance",defaultValue:null},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:d.Inherit},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:T.Begin},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:''},useEntireWidth:{type:"boolean",group:"Appearance",defaultValue:false},activeHandling:{type:"boolean",group:"Misc",defaultValue:true},editable:{type:"boolean",group:"Behavior",defaultValue:true},valueState:{type:"sap.ui.core.ValueState",group:"Data",defaultValue:V.None},valueStateText:{type:"string",group:"Misc",defaultValue:null,visibility:"hidden"},displayOnly:{type:"boolean",group:"Behavior",defaultValue:false},wrapping:{type:"boolean",group:"Appearance",defaultValue:false}},aggregations:{_label:{type:"sap.m.Label",group:"Behavior",multiple:false,visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{select:{parameters:{selected:{type:"boolean"}}}},dnd:{draggable:true,droppable:false},designtime:"sap/m/designtime/CheckBox.designtime"}});E.call(e.prototype);M.call(e.prototype);e.prototype.init=function(){this.addActiveState(this);I.insertFontFaceStyle();this._handleReferencingLabels();};e.prototype.exit=function(){this._oLabel=null;delete this._iTabIndex;};e.prototype.setText=function(t){var o=this._getLabel();this.setProperty("text",t);o.setText(t);return this;};e.prototype.setWidth=function(w){this.setProperty("width",w,true);this._setWidth();return this;};e.prototype.setUseEntireWidth=function(u){this.setProperty("useEntireWidth",u,true);this._setWidth();return this;};e.prototype.setTextDirection=function(s){var o=this._getLabel();this.setProperty("textDirection",s);o.setTextDirection(s);return this;};e.prototype.setTextAlign=function(A){var o=this._getLabel();this.setProperty("textAlign",A);o.setTextAlign(A);return this;};e.prototype.setValueStateText=function(t){return this.setProperty("valueStateText",t);};e.prototype.setWrapping=function(w){var o=this._getLabel();this.setProperty("wrapping",w);o.setWrapping(w);return this;};e.prototype.addActiveState=function(o){if(D.os.blackberry){o.addDelegate({ontouchstart:function(f){q(o.getDomRef()).addClass("sapMActive");},ontouchend:function(f){q(o.getDomRef()).removeClass("sapMActive");}});}};e.prototype.ontouchstart=function(o){o.originalEvent._sapui_handledByControl=true;};e.prototype.ontap=function(o){var s;if(this.getEnabled()&&this.getEditable()&&!this.getDisplayOnly()){this.$().trigger("focus");s=this._getSelectedState();this.setSelected(s);this.setPartiallySelected(false);this.fireSelect({selected:s});o&&o.setMarked();}};e.prototype.onkeyup=function(o){if(o&&o.which===K.SPACE&&!o.shiftKey){this.ontap(o);o.preventDefault();o.stopPropagation();}};e.prototype.onsapspace=function(o){o.preventDefault();};e.prototype.onsapenter=function(o){this.ontap(o);};e.prototype.setTabIndex=function(t){this._iTabIndex=t;this.$("CbBg").attr("tabindex",t);return this;};e.prototype.getTabIndex=function(){if(this.hasOwnProperty("_iTabIndex")){return this._iTabIndex;}return(this.getEnabled()&&!this.getDisplayOnly())?0:-1;};e.prototype._getLabel=function(){if(!this._oLabel){this._oLabel=new L(this.getId()+"-label",{labelFor:this.getId()}).addStyleClass("sapMCbLabel");this.setAggregation("_label",this._oLabel,true);}return this.getAggregation("_label");};e.prototype._setWidth=function(){var o=this._getLabel(),$=this.$(),w=this.getWidth();if(this.getUseEntireWidth()){o.setWidth("");$.outerWidth(w);}else{$.outerWidth("");o.setWidth(w);}};e.prototype._getSelectedState=function(){var s=this.getSelected(),p=this.getPartiallySelected();return(s===p)||(!s&&p);};e.prototype._getAriaChecked=function(){var s=this.getSelected();if(this.getPartiallySelected()&&s){return"mixed";}return s;};e.prototype._fnLabelTapHandler=function(){this.$().trigger("focus");};e.prototype._handleReferencingLabels=function(){var f=b.getReferencingLabels(this),t=this;if(f.length>0){f.forEach(function(s){sap.ui.getCore().byId(s).addEventDelegate({ontap:function(){t._fnLabelTapHandler();}});});}};e.prototype.getAccessibilityInfo=function(){var B=sap.ui.getCore().getLibraryResourceBundle("sap.m");return{role:"checkbox",type:B.getText("ACC_CTR_TYPE_CHECKBOX"),description:(this.getText()||"")+(this.getSelected()?(" "+B.getText("ACC_CTR_STATE_CHECKED")):""),focusable:this.getEnabled()&&!this.getDisplayOnly(),enabled:this.getEnabled(),editable:this.getEditable()};};e.prototype._getToolbarInteractive=function(){return true;};e.prototype.getFormDoNotAdjustWidth=function(){return this.getText()?false:true;};return e;});