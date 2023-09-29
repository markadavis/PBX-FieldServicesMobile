/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var V={};V.render=function(r,v){r.write("<div");r.writeControlData(v);r.addClass("sapVizKitViewport");r.writeClasses();r.writeAttribute("tabindex",0);r.writeAttribute("aria-label","Image");r.writeAttribute("role","figure");r.addStyle("width",v.getWidth());r.addStyle("height",v.getHeight());r.addStyle("background-image","linear-gradient("+v.getBackgroundColorTop()+","+v.getBackgroundColorBottom()+")");r.writeStyles();r.write(">");r.write("<svg xmlns=\"http://www.w3.org/2000/svg\"");r.writeAttribute("width","100%");r.writeAttribute("height","100%");r.writeAttribute("viewBox",v._getViewBox().join(" "));r.write(">");r.write("			<defs>				<filter id='halo'>					<feGaussianBlur in='SourceAlpha' result='Outline' stdDeviation='4' />					<feColorMatrix in='Outline' result='ColorOutline' type='matrix' values='0 0 0 0 0, 0 0 0 0 0.75, 0 0 0 0 1, 0 0 0 3 0' />					<feMerge>						<feMergeNode in='ColorOutline' />						<feMergeNode in='SourceGraphic' />					</feMerge>				</filter>			</defs>		");var s=v.getScene();if(s){var a=v._getViewStateManagerSVG();s.getRootElement().render(r,a?a._mask:(-1|0));}v._selectionRect.render(r,0|0);r.write("</svg>");var i,l;var t=v.getTools();for(i=0,l=t.length;i<l;i++){var b=sap.ui.getCore().byId(t[i]);var g=b.getGizmoForContainer(v);if(g&&g.hasDomElement()){r.renderControl(g);}}var c=v.getContent();for(i=0,l=c.length;i<l;i++){r.renderControl(c[i]);}r.write("</div>");};return V;},true);