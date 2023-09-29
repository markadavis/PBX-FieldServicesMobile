/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides control sap.m.P13nConditionPanel

sap.ui.define([
    'sap/m/P13nConditionPanel',
	'sap/m/library',
	'sap/ui/core/library',
	'sap/ui/core/Control',
	'sap/ui/core/IconPool',
	'sap/ui/Device',
	'sap/ui/core/InvisibleText',
	'sap/ui/core/ResizeHandler',
	'sap/ui/core/Item',
	'sap/ui/core/ListItem',
	'sap/ui/model/odata/type/Boolean',
	'sap/ui/model/type/String',
	'sap/ui/model/odata/type/String',
	'sap/ui/model/type/Date',
	'sap/ui/model/type/Time',
	'sap/ui/model/odata/type/DateTime',
	'sap/ui/model/type/Float',
	'sap/m/Button',
	'sap/m/OverflowToolbar',
	'sap/m/OverflowToolbarLayoutData',
	'sap/m/ToolbarSpacer',
	'sap/m/Text',
	'sap/m/SearchField',
	'sap/m/CheckBox',
	'sap/m/ComboBox',
	'sap/m/Select',
	'sap/m/Label',
	'sap/m/Input',
	'sap/m/DatePicker',
	'sap/m/TimePicker',
	'sap/m/DateTimePicker',
	'sap/base/Log',
	'sap/ui/thirdparty/jquery',
	'sap/ui/comp/valuehelpdialog/P13nOperationsHelper',
	'sap/m/P13nConditionPanelRenderer'
], function(
    P13nConditionPanelBase,
	library,
	coreLibrary,
	Control,
	IconPool,
	Device,
	InvisibleText,
	ResizeHandler,
	Item,
	ListItem,
	BooleanOdataType,
	StringType,
	StringOdataType,
	DateType,
	TimeType,
	DateTimeOdataType,
	FloatType,
	Button,
	OverflowToolbar,
	OverflowToolbarLayoutData,
	ToolbarSpacer,
	Text,
	SearchField,
	CheckBox,
	ComboBox,
	Select,
	Label,
	Input,
	DatePicker,
	TimePicker,
	DateTimePicker,
	Log,
	jQuery,
	P13nOperationsHelper,
	P13nConditionPanelRenderer
) {
	"use strict";
	var Grid,
		GridData,
		ButtonType = library.ButtonType,
		P13nConditionOperation = library.P13nConditionOperation,
		P13nConditionOperationType = library.P13nConditionOperationType;

	/**
	 * Constructor for an fiscal date type.
	 *
	 * @class The ConditionPanel Control will be used to to define filter-specific settings for {@link sap.ui.comp.valuehelpdialog.ValueHelpDialog} personalization
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @version 1.84.38
	 * @experimental
	 * @private
	 * @extends sap.ui.model.odata.type.Stringsap.m.P13nConditionPanel
	 * @alias {sap.ui.comp.valuehelpdialog.P13nConditionPanel}
	 */
	var P13nConditionPanel = P13nConditionPanelBase.extend("sap.ui.comp.valuehelpdialog.P13nConditionPanel", /** @lends sap.m.P13nConditionPanel.prototype */ {
		metadata: {
			library: "sap.ui.comp.valuehelpdialog"
		},
		renderer: P13nConditionPanelRenderer.renderer
	});

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype.init = function() {
		P13nConditionPanelBase.prototype.init.apply(this);
		this._oOperationsHelper = new P13nOperationsHelper();
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype.setOperations = function(aOperations, sType, bExclude) {
		var sOperationType = bExclude ? P13nConditionOperationType.Exclude : P13nConditionOperationType.Include;
		sType = sType || "default";

		if (this._oTypeOperations[sType] === undefined) {
			this._oTypeOperations[sType] = {};
		}
		this._oTypeOperations[sType][sOperationType] = aOperations;

		this._updateAllOperations();
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype.setValues = function(aValues, sType) {
		sType = sType || "default";
		this._oTypeValues[sType] = aValues;
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype.addOperation = function(oOperation, sType, bExclude) {
		var sOperationType = bExclude ? P13nConditionOperationType.Exclude : P13nConditionOperationType.Include;
		sType = sType || "default";

		if (this._oTypeOperations[sType] === undefined) {
			this._oTypeOperations[sType] = {};
		}

		if (this._oTypeOperations[sType][sOperationType] === undefined) {
			this._oTypeOperations[sType][sOperationType] = [];
		}

		this._oTypeOperations[sType][sOperationType].push(oOperation);

		this._updateAllOperations();
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype.getOperations = function(sType, bExclude) {
		var sOperationType,
			aIncludeOparations,
			aExcludeOparations,
			aResultOperations;

		sType = sType || "default";
		if (bExclude !== undefined) {
			sOperationType = bExclude ? P13nConditionOperationType.Exclude : P13nConditionOperationType.Include;
			aResultOperations = this._oTypeOperations[sType] && this._oTypeOperations[sType][sOperationType] || [];
		} else {
			aIncludeOparations = this._oTypeOperations[sType] && this._oTypeOperations[sType][P13nConditionOperationType.Include] || [];
			aExcludeOparations = this._oTypeOperations[sType] && this._oTypeOperations[sType][P13nConditionOperationType.Exclude] || [];
			aResultOperations = aIncludeOparations.concat(aExcludeOparations);
		}

		return aResultOperations;
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._updatePaginatorToolbar = function() {
		if (this._sConditionType !== "Filter" || this.getMaxConditions() !== "-1") {
			return;
		}

		var iItems = this._aConditionKeys.length;
		var iPages = 1 + Math.floor(Math.max(0, iItems - 1) / this._iConditionPageSize);
		var iPage = 1 + Math.floor(this._iFirstConditionIndex / this._iConditionPageSize);

		var oParent = this.getParent();

		if (!this._oPaginatorToolbar) {
			if (iItems > this._iConditionPageSize) {
				this._createPaginatorToolbar();
				this.insertAggregation("content", this._oPaginatorToolbar, 0);
				this._onGridResize();
			} else {
				if (oParent && oParent.getMetadata().getName() === "sap.m.Panel") {
					if (this._sOrgHeaderText == undefined) {
						this._sOrgHeaderText = oParent.getHeaderText();
					}
				}
				return;
			}
		}

		this._oPrevButton.setEnabled(this._iFirstConditionIndex > 0);
		this._oNextButton.setEnabled(this._iFirstConditionIndex + this._iConditionPageSize < iItems);

		if (oParent && oParent.setHeaderToolbar) {
			if (!oParent.getHeaderToolbar()) {
				this.removeAggregation("content", this._oPaginatorToolbar);
				oParent.setHeaderToolbar(this._oPaginatorToolbar);

				oParent.attachExpand(function(oEvent) {
					this._setToolbarElementVisibility(oEvent.getSource().getExpanded() && this._bPaginatorButtonsVisible);
				}.bind(this));
			}
		}

		if (oParent && oParent.getMetadata().getName() === "sap.m.Panel") {
			if (this._sOrgHeaderText == undefined) {
				this._sOrgHeaderText = oParent.getHeaderText();
			}

			var sHeader = this._sOrgHeaderText + (iItems > 0 ? " (" + iItems + ")" : "");
			this._oHeaderText.setText(sHeader);
		} else {
			this._oHeaderText.setText(iItems + " Conditions");
		}

		this._oPageText.setText(iPage + "/" + iPages);

		this._bPaginatorButtonsVisible = this._bPaginatorButtonsVisible || iPages > 1;
		this._setToolbarElementVisibility(this._bPaginatorButtonsVisible);

		if (iPage > iPages) {
			// update the FirstConditionIndex and rerender
			this._iFirstConditionIndex -= Math.max(0, this._iConditionPageSize);
			this._clearConditions();
			this._fillConditions();
		}

		var nValidGrids = 0;
		this._oConditionsGrid.getContent().forEach(function(oGrid) {
			if (oGrid.select.getSelected()) {
				nValidGrids++;
			}
		}, this);

		if (iPages == iPage && (iItems - this._iFirstConditionIndex) > nValidGrids) {
			// check if we have to rerender the current last page
			this._clearConditions();
			this._fillConditions();
		}
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._setToolbarElementVisibility = function(bVisible) {
		this._oPrevButton.setVisible(bVisible);
		this._oNextButton.setVisible(bVisible);
		this._oPageText.setVisible(bVisible);
		this._oFilterField.setVisible(false); //bVisible);
		this._setLayoutVisible(this._oAddButton, bVisible);
		this._setLayoutVisible(this._oRemoveAllButton, bVisible);
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._unregisterResizeHandler = function() {
		if (this._sContainerResizeListener) {
			ResizeHandler.deregister(this._sContainerResizeListener);
			this._sContainerResizeListener = null;
		}
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._registerResizeHandler = function() {
		if (this.getContainerQuery()) {
			this._sContainerResizeListener = ResizeHandler.register(this._oConditionsGrid, this._onGridResize.bind(this));
			this._onGridResize();
		}
	};

	/**
	 * press handler for the remove Condition buttons
	 *
	 * @private
	 * @param {grid} oTargetGrid the main grid
	 * @param {grid} oConditionGrid from where the Remove is triggered
	 */
	P13nConditionPanel.prototype._handleRemoveCondition = function(oTargetGrid, oConditionGrid) {
		// search index of the condition grid to set the focus later to the previous condition
		var idx = oTargetGrid.getContent().indexOf(oConditionGrid);

		this._removeCondition(oTargetGrid, oConditionGrid);

		if (this.getAutoReduceKeyFieldItems()) {
			this._updateKeyFieldItems(oTargetGrid, false);
		}

		// set the focus on the remove button of the newly added condition
		if (idx >= 0) {
			idx = Math.min(idx, oTargetGrid.getContent().length - 1);
			var oConditionGrid = oTargetGrid.getContent()[idx];
			setTimeout(function() {
				oConditionGrid.remove.focus();
			});
		}

		this._updatePaginatorToolbar();
	};

	/**
	 * returns the selectedKeyFields item from the KeyField control.
	 *
	 * @private
	 * @param {control} oKeyFieldCtrl the Select/ComboBox
	 * @returns {object} the selected Keyfields object
	 */
	P13nConditionPanel.prototype._getCurrentKeyFieldItem = function(oKeyFieldCtrl) {
		if (oKeyFieldCtrl.getSelectedKey && oKeyFieldCtrl.getSelectedKey()) {
			var sKey = oKeyFieldCtrl.getSelectedKey();
			var aItems = this._aKeyFields;
			for (var iItem in aItems) {
				var oItem = aItems[iItem];
				if (oItem.key === sKey) {
					return oItem;
				}
			}
		}
		return null;
	};

	/**
	 * appends a new condition grid with all containing controls in the main grid
	 *
	 * @private
	 * @param {grid} oTargetGrid the main grid in which the new condition grid will be added
	 * @param {object} oConditionGridData the condition data for the new added condition grid controls
	 * @param {string} sKey the key for the new added condition grid
	 * @param {int} iPos the index of the new condition in the targetGrid
	 * @param {boolean} bUseRowFromAbove use the key from the row above for creating a new row
	 */
	 P13nConditionPanel.prototype._createConditionRow = function(oTargetGrid, oConditionGridData, sKey, iPos, bUseRowFromAbove) {
		var oGrid,
			that = this,
			Grid = P13nConditionPanel._getGridConstructor(),
			GridData = P13nConditionPanel._getGridDataConstructor();

		if (iPos === undefined) {
			iPos = oTargetGrid.getContent().length;
		}

		var oConditionGrid = new Grid({
			width: "100%",
			defaultSpan: "L12 M12 S12",
			hSpacing: 1,
			vSpacing: 0,
			containerQuery: this.getContainerQuery()
		}).data("_key", sKey);
		// sapUiRespGridOverflowHidden style class is causing buttons to be cut off on smaller screens
		// so we remove it from the ConditionGrid - this is fix for Gerrit Change 5489093.
		// oConditionGrid.addStyleClass("sapUiRespGridOverflowHidden");

		/* eslint-disable no-loop-func */
		for (var iField in this._aConditionsFields) {
			var oControl;
			var field = this._aConditionsFields[iField];

			switch (field["Control"]) {
				case "CheckBox":
					// the CheckBox is not visible and only used internal to validate if a condition is
					// filled correct.
					oControl = new CheckBox({
						enabled: false,
						layoutData: new GridData({
							span: field["Span" + this._sConditionType]
						})
					});
					this._setLayoutVisible(oControl, false);

					if (field["ID"] === "showIfGrouped") {
						oControl.setEnabled(true);
						oControl.setText(field["Label"]);
						oControl.attachSelect(function() {
							that._changeField(oConditionGrid);
						});

						oControl.setSelected(oConditionGridData ? oConditionGridData.showIfGrouped : true);
					} else {
						if (oConditionGridData) {
							oControl.setSelected(true);
							oControl.setEnabled(true);
						}
					}
					break;

				case "ComboBox":
					if (field["ID"] === "keyField") {
						oControl = new ComboBox({ // before we used the new sap.m.Select control
							width: "100%",
							ariaLabelledBy: this._oInvisibleTextField
						});

						var fOriginalKey = oControl.setSelectedKey.bind(oControl);
						oControl.setSelectedKey = function(sKey) {
							fOriginalKey(sKey);
							var fValidate = that.getValidationExecutor();
							if (fValidate) {
								fValidate();
							}
						};

						var fOriginalItem = oControl.setSelectedItem.bind(oControl);
						oControl.setSelectedItem = function(oItem) {
							fOriginalItem(oItem);
							var fValidate = that.getValidationExecutor();
							if (fValidate) {
								fValidate();
							}
						};

						oControl.setLayoutData(new GridData({
							span: field["Span" + this._sConditionType]
						}));

						this._fillKeyFieldListItems(oControl, this._aKeyFields);

						if (oControl.attachSelectionChange) {
							oControl.attachSelectionChange(function(oEvent) {
								var fValidate = that.getValidationExecutor();
								if (fValidate) {
									fValidate();
								}

								that._handleSelectionChangeOnKeyField(oTargetGrid, oConditionGrid);
							});
						}

						if (oControl.attachChange) {
							oControl.attachChange(function(oEvent) {
								oConditionGrid.keyField.close();
								that._handleChangeOnKeyField(oTargetGrid, oConditionGrid);
							});
						}

						if (oControl.setSelectedItem) {
							if (oConditionGridData) {
								oControl.setSelectedKey(oConditionGridData.keyField);
								this._aKeyFields.forEach(function(oKeyField, index) {
									var key = oKeyField.key;
									if (key === undefined) {
										key = oKeyField;
									}
									if (oConditionGridData.keyField === key) {
										oControl.setSelectedItem(oControl.getItems()[index]);
									}
								}, this);
							} else {
								if (this.getUsePrevConditionSetting() && !this.getAutoReduceKeyFieldItems()) {
									// select the key from the condition above
									if (iPos > 0 && !sKey && bUseRowFromAbove) { //bUseRowFromAbove determines, if the default needs to be used
										oGrid = oTargetGrid.getContent()[iPos - 1];
										if (oGrid.keyField.getSelectedKey()) {
											oControl.setSelectedKey(oGrid.keyField.getSelectedKey());
										} else {
											// if no item is selected, we have to select at least the first keyFieldItem
											if (!oControl.getSelectedItem() && oControl.getItems().length > 0) {
												oControl.setSelectedItem(oControl.getItems()[0]);
											}
										}
									} else {
										this._aKeyFields.some(function(oKeyField, index) {
											if (oKeyField.isDefault) {
												oControl.setSelectedItem(oControl.getItems()[index]);
												return true;
											}
											if (!oControl.getSelectedItem() && oKeyField.type !== "boolean") {
												oControl.setSelectedItem(oControl.getItems()[index]);
											}
										}, this);

										// if no item is selected, we have to select at least the first keyFieldItem
										if (!oControl.getSelectedItem() && oControl.getItems().length > 0) {
											oControl.setSelectedItem(oControl.getItems()[0]);
										}
									}
								} else {
									this._aKeyFields.forEach(function(oKeyField, index) {
										if (oKeyField.isDefault) {
											oControl.setSelectedItem(oControl.getItems()[index]);
										}
									}, this);
								}
							}
						}
					}

					if (field["ID"] === "operation") {
						oControl = new Select({
							width: "100%",
							ariaLabelledBy: this._oInvisibleTextOperator,
							layoutData: new GridData({
								span: field["Span" + this._sConditionType]
							})
						});

						oControl.attachChange(function() {
							that._handleChangeOnOperationField(oTargetGrid, oConditionGrid);
						});

						// fill some operations to the control to be able to set the selected items
						oConditionGrid[field["ID"]] = oControl;
						this._updateOperationItems(oTargetGrid, oConditionGrid);

						if (oConditionGridData) {
							var oKeyField = this._getCurrentKeyFieldItem(oConditionGrid.keyField),
								aOperations = this._getRelevantOperations(oKeyField),
								sCurrOperation = this.getCurrentOparation(oConditionGridData);

							aOperations.some(function(oOperation) {
								if (sCurrOperation === oOperation) {
									oControl.setSelectedKey(oOperation);
									return true;
								}
							}, this);
						} else {
							if (this.getUsePrevConditionSetting()) {
								// select the key from the condition above
								if (iPos > 0 && sKey === null) {
									var oGrid = oTargetGrid.getContent()[iPos - 1];
									oControl.setSelectedKey(oGrid.operation.getSelectedKey());
								}
							}
						}
					}

					// init tooltip of select control
					if (oControl.getSelectedItem && oControl.getSelectedItem() && oControl.getMetadata()._sUIDToken !== "box") {
						oControl.setTooltip(oControl.getSelectedItem().getTooltip() || oControl.getSelectedItem().getText());
					}

					break;

				case "TextField":
					var oCurrentKeyField = this._getCurrentKeyFieldItem(oConditionGrid.keyField);
					oControl = this._createValueField(oCurrentKeyField, field, oConditionGrid);
					oControl.oTargetGrid = oTargetGrid;

					if (oConditionGridData && oConditionGridData[field["ID"]] !== undefined) {
						var vValue = oConditionGridData[field["ID"]];

						if (oControl instanceof Select) {
							if (typeof vValue === "boolean") {
								oControl.setSelectedIndex(vValue ? 2 : 1);
							}
						} else if (vValue !== null && oConditionGrid.oType) {

							// In case vValue is of type string, and type is StringDate we can set the value without formatting.
							if (typeof vValue === "string" && oConditionGrid.oType.getName() === "sap.ui.comp.odata.type.StringDate") {
								oControl.setValue(vValue);
							} else {
								// In case vValue is of type string, we try to convert it into the type based format.
								if (typeof vValue === "string" && ["String", "sap.ui.model.odata.type.String", "sap.ui.model.odata.type.Decimal"].indexOf(oConditionGrid.oType.getName()) == -1) {
									try {
										vValue = oConditionGrid.oType.parseValue(vValue, "string");
										oControl.setValue(oConditionGrid.oType.formatValue(vValue, "string"));
									} catch (err) {
										Log.error("sap.m.P13nConditionPanel", "Value '" + vValue + "' does not have the expected type format for " + oConditionGrid.oType.getName() + ".parseValue()");
									}
								} else {
									oControl.setValue(oConditionGrid.oType.formatValue(vValue, "string"));
								}
							}

						} else {
							oControl.setValue(vValue);
						}
					}
					break;

				case "Label":
					oControl = new Label({
						text: field["Text"] + ":",
						visible: this.getShowLabel(),
						layoutData: new GridData({
							span: field["Span" + this._sConditionType]
						})
					}).addStyleClass("conditionLabel");

					oControl.oTargetGrid = oTargetGrid;
					break;
			}

			oConditionGrid[field["ID"]] = oControl;
			oConditionGrid.addContent(oControl);
		}
		/* eslint-enable no-loop-func */
		this._addButtons(oConditionGrid, oTargetGrid);

		// Add the new create condition
		oTargetGrid.insertContent(oConditionGrid, iPos);

		// update Operations for all conditions
		this._updateOperationItems(oTargetGrid, oConditionGrid);
		this._changeOperationValueFields(oTargetGrid, oConditionGrid);

		// disable fields if the selectedKeyField value is none
		this._updateAllConditionsEnableStates();

		// update the add/remove buttons visibility
		this._updateConditionButtons(oTargetGrid);

		if (this.getAutoReduceKeyFieldItems()) {
			this._updateKeyFieldItems(oTargetGrid, false);
		}

		if (this._sLayoutMode) {
			this._updateLayout({
				name: this._sLayoutMode
			});
		}

		if (oConditionGridData) {
			var sConditionText = this._getFormatedConditionText(oConditionGridData.operation, oConditionGridData.value1, oConditionGridData.value2, oConditionGridData.exclude, oConditionGridData.keyField, oConditionGridData.showIfGrouped);

			oConditionGridData._oGrid = oConditionGrid;
			oConditionGridData.value = sConditionText;
			this._oConditionsMap[sKey] = oConditionGridData;
		}

		var sOperation = oConditionGrid.operation.getSelectedKey();
		// in case of a BT and a Date type try to set the minDate/maxDate for the From/To value datepicker
		if (sOperation === "BT" && oConditionGrid.value1.setMinDate && oConditionGrid.value2.setMaxDate) {
			var oValue1 = oConditionGrid.value1.getDateValue();
			var oValue2 = oConditionGrid.value2.getDateValue();
			this._updateMinMaxDate(oConditionGrid, oValue1, oValue2);
		} else {
			this._updateMinMaxDate(oConditionGrid, null, null);
		}

		return oConditionGrid;
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._fillOperationListItems = function(oCtrl, aOperations, sType) {
		if (sType === "_STRING_") {
			// ignore the "String" Type when accessing the resource text
			sType = "";
		}
		if (sType === "_TIME_" || sType === "_DATETIME_") {
			sType = "_DATE_";
		}
		if (sType === "_BOOLEAN_" || sType === "_NUMC_") {
			sType = "";
		}

		oCtrl.destroyItems();
		aOperations.forEach(function(sOperation){
			var sText = this._oRb.getText("CONDITIONPANEL_OPTION" + sType + sOperation);
			if (sText.startsWith("CONDITIONPANEL_OPTION")) {
				// when for the specified type the resource does not exist use the normal string resource text
				sText = this._oRb.getText("CONDITIONPANEL_OPTION" + sOperation);
			}
			oCtrl.setShowSecondaryValues(true);
			oCtrl.addItem(new ListItem({
				key: sOperation,
				text: sText,
				additionalText: this._oOperationsHelper.isExcludeType(sOperation) ? P13nConditionOperationType.Exclude : P13nConditionOperationType.Include,
				tooltip: sText
			}));
		}.bind(this));
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._fillKeyFieldListItems = function(oCtrl, aItems) {
		oCtrl.destroyItems();
		for (var iItem in aItems) {
			var oItem = aItems[iItem];
			oCtrl.addItem(new ListItem({
				key: oItem.key,
				text: oItem.text,
				tooltip: oItem.tooltip ? oItem.tooltip : oItem.text
			}));
		}
		this._setLayoutVisible(oCtrl, oCtrl.getItems().length > 1);
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._updateKeyFieldItems = function(oTargetGrid, bFillAll, bAppendLast, oIgnoreKeyField) {
		var n = oTargetGrid.getContent().length;
		var i;

		// collect all used Keyfields
		var oUsedItems = {};
		if (!bFillAll) {
			for (i = 0; i < n; i++) {
				var oKeyField = oTargetGrid.getContent()[i].keyField;

				var sKey = oKeyField.getSelectedKey();
				if (sKey != null && sKey !== "") {
					oUsedItems[sKey] = true;
				}
			}
		}

		for (i = 0; i < n; i++) {
			var oKeyField = oTargetGrid.getContent()[i].keyField;
			var oSelectCheckbox = oTargetGrid.getContent()[i].select;
			var sOldKey = oKeyField.getSelectedKey();
			var j = 0;
			var aItems = this._aKeyFields;

			if (oKeyField !== oIgnoreKeyField) {
				if (bAppendLast) {
					j = aItems.length - 1;
				} else {
					// clean the items
					oKeyField.destroyItems();
				}

				// fill all or only the not used items
				for (j; j < aItems.length; j++) {
					var oItem = aItems[j];
					if (oItem.key == null || oItem.key === "" || !oUsedItems[oItem.key] || oItem.key === sOldKey) {
						oKeyField.addItem(new ListItem({
							key: oItem.key,
							text: oItem.text,
							tooltip: oItem.tooltip ? oItem.tooltip : oItem.text
						}));
					}
				}
				this._setLayoutVisible(oKeyField, oKeyField.getItems().length > 1);
			}

			if (sOldKey) {
				oKeyField.setSelectedKey(sOldKey);
			} else if (oKeyField.getItems().length > 0) {
				// make at least the first item the selected item. We need this for updating the tooltip
				oKeyField.setSelectedItem(oKeyField.getItems()[0]);
			}

			if (!oSelectCheckbox.getSelected()) {
				// set/update the isDefault keyfield as selected item for an empty condition row
				/* eslint-disable no-loop-func */
				this._aKeyFields.some(function(oKeyFieldItem, index) {
					if (oKeyFieldItem.isDefault) {
						oKeyField.setSelectedItem(oKeyField.getItems()[index]);
						return true;
					}
					if (!oKeyField.getSelectedItem()) {
						if (oKeyFieldItem.type !== "boolean") {
							oKeyField.setSelectedItem(oKeyField.getItems()[index]);
						}
					}
				}, this);
			}

			// update the tooltip
			if (oKeyField.getSelectedItem()) {
				oKeyField.setTooltip(oKeyField.getSelectedItem().getTooltip() || oKeyField.getSelectedItem().getText());
			}
		}
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._adjustValue1Span = function(oConditionGrid) {
		if (this._sConditionType === "Filter" && oConditionGrid.value1 && oConditionGrid.operation) {
			var oOperation = oConditionGrid.operation;

			var sNewSpan = this._aConditionsFields[5]["Span" + this._sConditionType];
			var selectedKey = oOperation.getSelectedKey();
			if (selectedKey !== P13nConditionOperation.BT &&
				selectedKey !== P13nConditionOperation.NotBT) {
				sNewSpan = this._aKeyFields.length > 1 ? "L5 M10 S10" : "XL8 L8 M8 S10";
			}

			var oLayoutData = oConditionGrid.value1.getLayoutData();
			if (oLayoutData.getSpan() !== sNewSpan) {
				oLayoutData.setSpan(sNewSpan);
			}
		}
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._changeField = function(oConditionGrid, oEvent) {
		var sKeyField = oConditionGrid.keyField.getSelectedKey();
		if (oConditionGrid.keyField.getSelectedItem()) {
			oConditionGrid.keyField.setTooltip(oConditionGrid.keyField.getSelectedItem().getTooltip() || oConditionGrid.keyField.getSelectedItem().getText());
		} else {
			oConditionGrid.keyField.setTooltip(null);
		}

		var sOperation = oConditionGrid.operation.getSelectedKey();
		var bExclude = this._oOperationsHelper.isExcludeType(sOperation);
		sOperation = bExclude ? this._oOperationsHelper.getCorrespondingIncludeOperation(sOperation) : sOperation;

		if (oConditionGrid.operation.getSelectedItem()) {
			oConditionGrid.operation.setTooltip(oConditionGrid.operation.getSelectedItem().getTooltip() || oConditionGrid.operation.getSelectedItem().getText());
		} else {
			oConditionGrid.operation.setTooltip(null);
		}

		var getValuesFromField = function(oControl, oType) {
			var sValue;
			var oValue;
			if (oControl.getDateValue && !(oControl.isA("sap.m.TimePicker")) && oType.getName() !== "sap.ui.comp.odata.type.StringDate") {
				oValue = oControl.getDateValue();
				if (oType && oValue) {
					if ((oEvent && oEvent.getParameter("valid")) || oControl.isValidValue()) {
						sValue = oType.formatValue(oValue, "string");
					} else {
						sValue = "";
					}
				}
			} else {
				sValue = this._getValueTextFromField(oControl);
				oValue = sValue;
				if (oType && oType.getName() === "sap.ui.comp.odata.type.StringDate") {
					sValue = oType.formatValue(oValue, "string");
				} else if (oType && sValue) {
					try {
						oValue = oType.parseValue(sValue, "string");
						oType.validateValue(oValue);
					} catch (err) {
						Log.error("sap.m.P13nConditionPanel", "not able to parse value " + sValue + " with type " + oType.getName());
						sValue = "";
					}
				}
			}
			return [oValue, sValue];
		}.bind(this);

		// update Value1 field control
		var aValues = getValuesFromField(oConditionGrid.value1, oConditionGrid.oType);
		var oValue1 = aValues[0], sValue1 = aValues[1];

		// update Value2 field control
		aValues = getValuesFromField(oConditionGrid.value2, oConditionGrid.oType);
		var oValue2 = aValues[0], sValue2 = aValues[1];

		// in case of a BT and a Date type try to set the minDate/maxDate for the From/To value datepicker
		if (this._hasSecondValue(sOperation)) {
			this._updateMinMaxDate(oConditionGrid, oValue1, oValue2);
		} else {
			this._updateMinMaxDate(oConditionGrid, null, null);
		}

		var oCurrentKeyField = this._getCurrentKeyFieldItem(oConditionGrid.keyField);
		if (oCurrentKeyField && oCurrentKeyField.type === "numc") {
			// in case of type numc and Contains or EndsWith operator the leading 0 will be removed
			if ([P13nConditionOperation.Contains, P13nConditionOperation.EndsWith].indexOf(sOperation) != -1) {
				oValue1 = oConditionGrid.oType.formatValue(oValue1, "string");
			}
		}

		var bShowIfGrouped = oConditionGrid.showIfGrouped.getSelected();
		var oSelectCheckbox = oConditionGrid.select;
		var sValue = "";
		var sKey;

		if (sKeyField === "" || sKeyField == null) {
			// handling of "(none)" or wrong entered keyField value
			sKeyField = null;
			sKey = this._getKeyFromConditionGrid(oConditionGrid);
			this._removeConditionFromMap(sKey);

			this._enableCondition(oConditionGrid, false);
			var iIndex = this._getIndexOfCondition(oConditionGrid);

			if (oSelectCheckbox.getSelected()) {
				oSelectCheckbox.setSelected(false);
				oSelectCheckbox.setEnabled(false);

				this._bIgnoreSetConditions = true;
				this.fireDataChange({
					key: sKey,
					index: iIndex,
					operation: "remove",
					newData: null
				});
				this._bIgnoreSetConditions = false;
			}
			return;
		}

		this._enableCondition(oConditionGrid, true);

		sValue = this._getFormatedConditionText(sOperation, sValue1, sValue2, bExclude, sKeyField, bShowIfGrouped);

		var oConditionData = {
			"value": sValue,
			"exclude": bExclude,
			"operation": sOperation,
			"keyField": sKeyField,
			"value1": oValue1,
			"value2": this._hasSecondValue(sOperation) ? oValue2 : null,
			"showIfGrouped": bShowIfGrouped
		};
		sKey = this._getKeyFromConditionGrid(oConditionGrid);

		if (sValue !== "") {
			oSelectCheckbox.setSelected(true);
			oSelectCheckbox.setEnabled(true);

			var sChangeOperation = "update";
			if (!this._oConditionsMap[sKey]) {
				sChangeOperation = "add";
			}

			this._oConditionsMap[sKey] = oConditionData;
			if (sChangeOperation === "add") {
				this._aConditionKeys.splice(this._getIndexOfCondition(oConditionGrid), 0, sKey);
			}

			oConditionGrid.data("_key", sKey);

			this.fireDataChange({
				key: sKey,
				index: this._getIndexOfCondition(oConditionGrid),
				operation: sChangeOperation,
				newData: oConditionData
			});
		} else if (this._oConditionsMap[sKey] !== undefined) {
			this._removeConditionFromMap(sKey);
			oConditionGrid.data("_key", null);
			var iIndex = this._getIndexOfCondition(oConditionGrid);

			if (oSelectCheckbox.getSelected()) {
				oSelectCheckbox.setSelected(false);
				oSelectCheckbox.setEnabled(false);

				this._bIgnoreSetConditions = true;
				this.fireDataChange({
					key: sKey,
					index: iIndex,
					operation: "remove",
					newData: null
				});
				this._bIgnoreSetConditions = false;
			}
		}

		this._updatePaginatorToolbar();
	};


	P13nConditionPanel.prototype._getConditions = function(oConditionsSettings) {
		return {
			"index": this._iConditions,
			"key": this._createConditionKey(),
			"exclude": this._oOperationsHelper.isExcludeType(oConditionsSettings.oOperation),
			"operation": oConditionsSettings.oOperation,
			"keyField": oConditionsSettings.oKeyField,
			"value1":  oConditionsSettings.oPastedValue,
			"value2": null
		};
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._changeOperationValueFields = function (oTargetGrid, oConditionGrid) {
		P13nConditionPanelBase.prototype._changeOperationValueFields.apply(this, arguments);
		var iContentCount = oConditionGrid.getContent().length,
			oRemoveControl = oConditionGrid.remove,
			iCurrentRemoveControlIndex = oConditionGrid.indexOfContent(oRemoveControl),
			iRemoveControlIndex = iContentCount - 1;

		if (iCurrentRemoveControlIndex !== iRemoveControlIndex) {
			oConditionGrid.insertContent(oRemoveControl, iRemoveControlIndex);
		}
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._updateLayout = function(oRangeInfo) {};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._addButtons = function (oConditionGrid, oTargetGrid) {
		var that = this;
		var GridData = P13nConditionPanelBase._getGridDataConstructor();
		// create "Remove button"
		var oRemoveControl = new Button({
			type: ButtonType.Transparent,
			icon: IconPool.getIconURI("decline"),
			tooltip: this._oRb.getText("CONDITIONPANEL_REMOVE" + (this._sAddRemoveIconTooltipKey ? "_" + this._sAddRemoveIconTooltipKey : "") + "_TOOLTIP"),
			press: function () {
				that._handleRemoveCondition(this.oTargetGrid, oConditionGrid);
			},
			layoutData: new GridData({
				span: "XL1 L1 M1 S1"
			})
		});

		oRemoveControl.oTargetGrid = oTargetGrid;

		oConditionGrid.addContent(oRemoveControl);
		oConditionGrid["remove"] = oRemoveControl;

		// create "Add button"
		var oAddControl = new Button({
			text: sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("VALUEHELPDLG_CONDITIONPANEL_ADD"),
			tooltip: this._oRb.getText("CONDITIONPANEL_ADD" + (this._sAddRemoveIconTooltipKey ? "_" + this._sAddRemoveIconTooltipKey : "") + "_TOOLTIP"),
			press: function () {
				that._handleAddCondition(this.oTargetGrid, oConditionGrid, true);
			},
			layoutData: new GridData({
				span: "XL2 L3 M3 S3",
				indent: "XL9 L8 M8 S7",
				linebreak: true
			})
		});

		oAddControl.oTargetGrid = oTargetGrid;
		oAddControl.addStyleClass("conditionAddBtnFloatRight");

		oConditionGrid.addContent(oAddControl);
		oConditionGrid["add"] = oAddControl;
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype.getCurrentOparation = function(oConditionGridData) {
		return oConditionGridData.exclude ?
					this._oOperationsHelper.getCorrespondingExcludeOperation(oConditionGridData.operation) :
					oConditionGridData.operation;
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._hasSecondValue = function(sOperation) {
		return P13nConditionPanelBase.prototype._hasSecondValue.apply(this, arguments) ||
				sOperation === P13nConditionOperation.NotBT;
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._hasNoValues = function(sOperation) {
		return P13nConditionPanelBase.prototype._hasNoValues.apply(this, arguments) ||
				sOperation === P13nConditionOperation.NotEmpty;
	};

	P13nConditionPanel._getGridConstructor = function(){
		if (Grid === undefined) {
			Grid = sap.ui.requireSync("sap/ui/layout/Grid");
		}

		return Grid;
	};

	P13nConditionPanel._getGridDataConstructor = function(){
		if (GridData === undefined) {
			GridData = sap.ui.requireSync("sap/ui/layout/GridData");
		}
		return GridData;
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._createConditionsFields = function() {
		return [{
			"ID": "select",
			"Label": "",
			"SpanFilter": "L1 M1 S1",
			"SpanSort": "L1 M1 S1",
			"SpanGroup": "L1 M1 S1",
			"Control": "CheckBox",
			"Value": ""
		}, {
			"ID": "keyFieldLabel",
			"Text": "Sort By",
			"SpanFilter": "L1 M1 S1",
			"SpanSort": "L1 M1 S1",
			"SpanGroup": "L1 M1 S1",
			"Control": "Label"
		}, {
			"ID": "keyField",
			"Label": "",
			"SpanFilter": "L3 M5 S10",
			"SpanSort": "L5 M5 S12",
			"SpanGroup": "L4 M4 S12",
			"Control": "ComboBox"
		}, {
			"ID": "operationLabel",
			"Text": "Sort Order",
			"SpanFilter": "L1 M1 S1",
			"SpanSort": "L1 M1 S1",
			"SpanGroup": "L1 M1 S1",
			"Control": "Label"
		}, {
			"ID": "operation",
			"Label": "",
			"SpanFilter": this._aKeyFields.length > 1 ? "L2 M5 S10" : "XL3 L3 M3 S10",
			"SpanSort": Device.system.phone ? "L5 M5 S8" : "L5 M5 S9",
			"SpanGroup": "L2 M5 S10",
			"Control": "ComboBox"
		}, {
			"ID": "value1",
			"Label": this._sFromLabelText,
			"SpanFilter": this._aKeyFields.length > 1 ? "L3 M10 S10" : "XL4 L4 M4 S10",
			"SpanSort": "L3 M10 S10",
			"SpanGroup": "L3 M10 S10",
			"Control": "TextField",
			"Value": ""
		}, {
			"ID": "value2",
			"Label": this._sToLabelText,
			"SpanFilter": this._aKeyFields.length > 1 ? "L2 M10 S10" : "XL4 L4 M4 S10",
			"SpanSort": "L2 M10 S10",
			"SpanGroup": "L2 M10 S10",
			"Control": "TextField",
			"Value": ""
		}, {
			"ID": "showIfGrouped",
			"Label": this._sShowIfGroupedLabelText,
			"SpanFilter": "L1 M10 S10",
			"SpanSort": "L1 M10 S10",
			"SpanGroup": "L3 M4 S9",
			"Control": "CheckBox",
			"Value": "false"
		}];
	};

	/*
	 * @override
	 * @private
	 */
	P13nConditionPanel.prototype._getSecondValueNegativeIndex = function() {
		return 2;
	};

	P13nConditionPanel.prototype.fireDataChange = function(oEvent){
		var sOperation,
			oCondition = oEvent.newData;

		if (oCondition) {
			sOperation = oCondition.operation;

			oCondition.operation = this._oOperationsHelper.isExcludeType(sOperation) ?
										this._oOperationsHelper.getCorrespondingIncludeOperation(sOperation) :
										sOperation;
		}

		return Control.prototype.fireEvent.call(this, "dataChange", oEvent);
	};

	return P13nConditionPanel;

});
