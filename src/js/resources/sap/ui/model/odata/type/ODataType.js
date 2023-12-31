/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/SimpleType"],function(S){"use strict";var O=S.extend("sap.ui.model.odata.type.ODataType",{constructor:function(f,c){},metadata:{"abstract":true}});O.prototype.getInterface=function(){return this;};O.prototype.getPlaceholderText=function(){return this.getFormat&&this.getFormat().getPlaceholderText&&this.getFormat().getPlaceholderText();};O.prototype.setConstraints=function(c){};O.prototype.setFormatOptions=function(f){};return O;});
