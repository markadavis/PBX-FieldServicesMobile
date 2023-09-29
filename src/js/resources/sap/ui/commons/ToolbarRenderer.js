/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/base/Log','sap/base/assert','./library','./ToolbarSeparator'],function(q,L,a,l,T){"use strict";var b=l.ToolbarSeparatorDesign;var c={};c.render=function(r,t){var d=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");a(t&&t.isA("sap.ui.commons.Toolbar"),"ToolbarRenderer.render: oToolbar must be a toolbar");r.write("<div role='toolbar' tabindex='0'");r.writeControlData(t);if(t.getWidth()){r.addStyle("width",t.getWidth());}var s=t.getTooltip_AsString();if(s){r.writeAttributeEscaped("title",s);}r.addClass("sapUiTb");r.addClass("sapUiTbDesign"+t.getDesign());if(t.getStandalone()){r.addClass("sapUiTbStandalone");}r.writeStyles();r.writeClasses();r.write(">");var R=t.getRightItems();var e=R.length;var h=e>0;var I="<div class='sapUiTbInner' id='"+t.getId()+"-inner"+"'>";if(h){r.write("<div class='sapUiTbCont sapUiTbContLeft'>"+I);}else{r.write("<div class='sapUiTbCont'>"+I);}var f=t.getItems();var g=f.length;for(var i=0;i<g;i++){var o=f[i];if(o){a(o.getMetadata().isInstanceOf("sap.ui.commons.ToolbarItem"),"ToolbarRenderer.render: oToolbarItem must be a ToolbarItem");if(o instanceof T){c.renderSeparator(r,o);}else{r.renderControl(o);}}}r.write("<div id='");r.write(t.getId());r.write("-mn' class='sapUiTbOB' role='button' aria-haspopup='true' title='"+d.getText("TOOLBAR_OVERFLOW")+"' tabindex='-1'></div></div></div>");if(h){r.write("<div class='sapUiTbInnerRight' >");for(var i=0;i<e;i++){var o=R[i];if(o){a(o.getMetadata().isInstanceOf("sap.ui.commons.ToolbarItem"),"ToolbarRenderer.render: oToolbarItem must be a ToolbarItem");if(o instanceof T){c.renderSeparator(r,o);}else{r.renderControl(o);}}}r.write("</div>");}r.write("</div>");};c.renderSeparator=function(r,t){if(t.getDisplayVisualSeparator()){r.write("<span ");r.writeElementData(t);if(t.getDesign()===b.FullHeight){r.write(" class='sapUiTbSeparator sapUiTbSepFullHeight' role='separator'></span>");}else{r.write(" class='sapUiTbSeparator' role='separator'></span>");}}else{r.write("<span ");r.writeElementData(t);r.write(" class='sapUiTbSpacer' role='separator'></span>");}};c.fillOverflowPopup=function(t){var p=t.getDomRef("pu");if(!p){p=c.initOverflowPopup(t).firstChild;}var $=q(p.parentNode),v=t.getVisibleItemInfo(true).count,o=t.getDomRef().firstChild.firstChild,P=0,C=o.firstChild,O=t.getId()+"-mn",i=$.width(),B=0;while(C){var n=C.nextSibling;if(P>=v){if(C.id===O){break;}B=B<q(C).outerWidth(true)?q(C).outerWidth(true):B;p.appendChild(C);}C=n;P++;}if(B>i){var d=12;$.width(B+d);}};c.initOverflowPopup=function(t){var s=sap.ui.getCore().getStaticAreaRef();var p=document.createElement("div");p.className="sapUiTbDD sapUiTbDesignFlat";p.innerHTML="<div id='"+t.getId()+"-pu' data-sap-ui="+t.getId()+" tabindex='0' role='menu'></div>";s.appendChild(p);return p;};c.emptyOverflowPopup=function(t,m){var p=t.getDomRef("pu"),d=t.getDomRef(),C=null,M='',A=[];if(m===undefined){m=true;}if(p){if(m&&d){C=d.firstChild.firstChild;M='insertBefore';A=[t.getDomRef("mn")];}else if(!m){C=p;M='removeChild';}else{L.error("The renderer 'sap.ui.commons.ToolbarRenderer' cannot empty the toolbar overflow popup.");return;}while(p.hasChildNodes()){var e=[p.firstChild].concat(A);C[M].apply(C,e);}if(d&&t.sOriginalStylePropertyWidth){q(d).width(t.sOriginalStylePropertyWidth);t.sOriginalStylePropertyWidth=null;}}};c.getPopupArea=function(t){return t.getDomRef("pu");};c.setActive=function(t){t.$("mn").addClass("sapUiTbOBAct");};c.unsetActive=function(t){t.$("mn").removeClass("sapUiTbOBAct");};return c;},true);