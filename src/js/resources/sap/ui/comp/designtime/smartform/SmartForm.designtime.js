/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(function(){"use strict";return{aggregations:{groups:{propagateRelevantContainer:true,childNames:{singular:"GROUP_CONTROL_NAME",plural:"GROUP_CONTROL_NAME_PLURAL"},actions:{move:"moveGroups",createContainer:{changeType:"addGroup",isEnabled:true,getCreatedContainerId:function(n){return n;}}}},customToolbar:{propagateMetadata:function(e){if(e.isA(["sap.m.ToolbarSpacer","sap.m.ToolbarSeparator"])){return{actions:"not-adaptable"};}}}},name:"{name}",description:"{description}",properties:{title:{ignore:false},useHorizontalLayout:{ignore:false},horizontalLayoutGroupElementMinWidth:{ignore:true},checkButton:{ignore:false},entityType:{ignore:true},expandable:{ignore:false},expanded:{ignore:false},editTogglable:{ignore:false},editable:{ignore:false},ignoredFields:{ignore:true},flexEnabled:{ignore:true},validationMode:{ignore:true}}};},true);
