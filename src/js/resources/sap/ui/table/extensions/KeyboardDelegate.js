/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../utils/TableUtils","../library","sap/ui/base/Object","sap/ui/Device","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery"],function(T,l,B,D,K,q){"use strict";var C=T.CELLTYPE;var S=l.SelectionMode;var M={CTRL:1,SHIFT:2,ALT:4};var H=5;var a="1rem";function p(E,P){E.setMarked("sapUiTableSkipItemNavigation",P!==false);}var b=B.extend("sap.ui.table.extensions.KeyboardDelegate",{constructor:function(i){B.call(this);},destroy:function(){B.prototype.destroy.apply(this,arguments);},getInterface:function(){return this;}});function n(i,E){if(!e(i,E)){return;}var A=T.getCellInfo(T.getCell(i,E.target));if(A.isOfType(C.ANYCOLUMNHEADER)){_(i,A,E);}else if(A.isOfType(C.ANYCONTENTCELL)){c(i,A,E);}}function _(i,A,E){var F=T.getHeaderRowCount(i);if(T.isNoDataVisible(i)){var G=T.getFocusedItemInfo(i);if(G.row-F<=1){p(E);}}else if(A.isOfType(C.COLUMNROWHEADER)&&F>1){p(E);T.focusItem(i,F*(T.getVisibleColumnCount(i)+1),E);}}function c(i,A,E){var F=i._getKeyboardExtension();var G=F.isInActionMode();var I=b._isKeyCombination(E,null,M.CTRL);var J=I||G;var P=T.getParentCell(i,E.target);if(!J&&P){P.trigger("focus");return;}p(E);if(T.isLastScrollableRow(i,A.cell)){var L=s(i,E);if(L){E.preventDefault();return;}}if(A.rowIndex===i.getRows().length-1||(T.isVariableRowHeightEnabled(i)&&A.rowIndex===i.getRows().length-2&&i.getRows()[A.rowIndex+1].getRowBindingContext()===null)){if(!G&&P){P.trigger("focus");}else{var N=i.getCreationRow();if(!N||!N._takeOverKeyboardHandling(E)){F.setActionMode(false);}}return;}y(i,A.type,A.rowIndex+1,A.columnIndex,J);E.preventDefault();}function d(i,E){var A=T.getCellInfo(T.getCell(i,E.target));if(!A.isOfType(C.ANYCONTENTCELL)||!e(i,E)){return;}var F=b._isKeyCombination(E,null,M.CTRL);var G=i._getKeyboardExtension();var I=G.isInActionMode();var J=F||I;var P=T.getParentCell(i,E.target);if(!J&&P){P.trigger("focus");return;}p(E);if(T.isFirstScrollableRow(i,A.cell)){var L=g(i,E);if(L){E.preventDefault();return;}}if(A.rowIndex===0){p(E,A.isOfType(C.ROWACTION)||J);if(!I&&P){P.trigger("focus");}else{G.setActionMode(false);}return;}y(i,A.type,A.rowIndex-1,A.columnIndex,J);E.preventDefault();}function e(i,E){var A=b._isKeyCombination(E,null,M.CTRL);return!E.isMarked()&&(A||!(E.target instanceof window.HTMLInputElement)&&!(E.target instanceof window.HTMLTextAreaElement));}function f(i,E){if(E.isMarked()){return;}var A=T.getCellInfo(T.getCell(i,E.target));var I=sap.ui.getCore().getConfiguration().getRTL();if(!A.isOfType(C.COLUMNHEADER)||!I){return;}var F=T.getFocusedItemInfo(i);var G=F.cellInRow-(T.hasRowHeader(i)?1:0);var J=T.getVisibleColumnCount(i);if(T.hasRowActions(i)&&G===J-1){p(E);}}function s(i,E,P,F){var A=i._getFirstRenderedRowIndex()===i._getMaxFirstRenderedRowIndex();if(A){return null;}h(i,E,true,P,F);return true;}function g(i,E,P,F){var A=i._getFirstRenderedRowIndex()===0;if(A){return false;}h(i,E,false,P,F);return true;}function h(i,E,A,P,F){var G=T.getCellInfo(T.getCell(i,E.target));var I=i._getKeyboardExtension().isInActionMode();var J=b._isKeyCombination(E,null,M.CTRL);var L=J||I;var N=I&&G.isOfType(C.DATACELL);if(N){document.activeElement.blur();setTimeout(function(){i._getScrollExtension().scrollVertically(A===true,P);},0);}else{i._getScrollExtension().scrollVertically(A===true,P);}if(L||F){i.attachEventOnce("_rowsUpdated",function(){if(F){F();}else{y(i,G.type,G.rowIndex,G.columnIndex,true);}});}}function j(i,E){var R=i._getRowCounts();var A=s(i,E,false,function(){k(i,R.fixedTop+R.scrollable-1);});if(A){return;}if(R.fixedBottom>0){k(i,R.fixedTop+R.scrollable);}else{i._getKeyboardExtension().setActionMode(false);}}function k(i,R){var A=i.getRows()[R];var E=A.isGroupHeader()||T.isRowSelectorSelectionAllowed(i);if(E){y(i,C.ROWHEADER,R);}else{var I=b._getFirstInteractiveElement(A);if(I){b._focusElement(i,I[0]);}else{y(i,C.DATACELL,R,0,false,true);if(A.getIndex()===i._getTotalRowCount()-1){i._getKeyboardExtension().setActionMode(false);}}}}function m(i,E){var R=i._getRowCounts();var A=g(i,E,false,function(){o(i,R.fixedTop);});if(A){return;}if(R.fixedTop>0){o(i,R.fixedTop-1);}else{i._getKeyboardExtension().setActionMode(false);}}function o(i,R){var A=i.getRows()[R];var E=A.isGroupHeader()||T.isRowSelectorSelectionAllowed(i);var I=b._getLastInteractiveElement(A);if(I){b._focusElement(i,I[0]);}else if(E){y(i,C.ROWHEADER,R);}else{y(i,C.DATACELL,R,0,false,true);if(A.getIndex()===0){i._getKeyboardExtension().setActionMode(false);}}}function r(i,E){var A=T.getFocusedItemInfo(i);var L=i._getKeyboardExtension()._getLastFocusedCellInfo();T.focusItem(i,A.cellInRow+(A.columnCount*L.row),E);}function t(i,E){var A=T.getFocusedItemInfo(i);T.focusItem(i,A.cellInRow,E);}function u(i,A){i._getKeyboardExtension()._setSilentFocus(i.$().find("."+A));}b._isKeyCombination=function(E,i,A){if(A==null){A=0;}var F=typeof i==="string"?String.fromCharCode(E.charCode):E.keyCode;var G=0;G|=(D.os.macintosh?E.metaKey:E.ctrlKey)&&i!==K.CONTROL?M.CTRL:0;G|=E.shiftKey&&i!==K.SHIFT?M.SHIFT:0;G|=E.altKey&&i!==K.ALT?M.ALT:0;var V=i==null||F===i;var I=A===G;return V&&I;};function v(i,E){var A=T.getCellInfo(E.target);if(A.isOfType(C.COLUMNROWHEADER)){i._getSelectionPlugin().onHeaderSelectorPress();}else if(b._isElementGroupToggler(i,E.target)){T.Grouping.toggleGroupHeaderByRef(i,E.target);}else if(A.isOfType(C.ROWHEADER)){G();}else if(A.isOfType(C.DATACELL|C.ROWACTION)){var F=!i.hasListeners("cellClick");if(!i._findAndfireCellEvent(i.fireCellClick,E)){if(T.isRowSelectionAllowed(i)){G();F=false;}}if(F){var I=T.getInteractiveElements(E.target);if(I){i._getKeyboardExtension().setActionMode(true);}}}function G(){var J=null;if(i._legacyMultiSelection){J=function(R){i._legacyMultiSelection(R,E);return true;};}T.toggleRowSelection(i,E.target,null,J);}}function w(i,N){var A=i.getParent();var V=A._getVisibleColumns();var I=V.indexOf(i);var E;if(N&&I<V.length-1){E=A.indexOfColumn(V[I+1])+1;}else if(!N&&I>0){E=A.indexOfColumn(V[I-1]);}if(E!=null){T.Column.moveColumnTo(i,E);}}function x(A,E){var V=A.getColumns().filter(function(E){return E.getVisible()||E.getGrouped();});for(var i=0;i<V.length;i++){var F=V[i];if(F===E){return i;}}return-1;}b._focusElement=function(i,E,A){if(!i||!E){return;}if(A==null){A=false;}T.deselectElementText(document.activeElement);if(A){i._getKeyboardExtension()._setSilentFocus(E);}else{E.focus();}T.selectElementText(E);};function y(i,A,R,E,F,G){if(!i||A==null||R==null||R<0||R>=i.getRows().length){return;}var I=i.getRows()[R];var J;if(A===C.ROWHEADER){i._getKeyboardExtension()._setFocus(i.getDomRef("rowsel"+R));return;}else if(A===C.ROWACTION){J=i.getDomRef("rowact"+R);}else if(A===C.DATACELL&&(E!=null&&E>=0)){var L=i.getColumns()[E];var N=x(i,L);if(N>=0){J=I.getDomRef("col"+N);}}if(!J){return;}if(F){var $=T.getInteractiveElements(J);if($){b._focusElement(i,$[0]);return;}}if(G){i._getKeyboardExtension()._bStayInActionMode=true;}J.focus();}b._isElementGroupToggler=function(i,E){return T.Grouping.isInGroupHeaderRow(E)||(T.Grouping.isTreeMode(i)&&E.classList.contains("sapUiTableCellFirst")&&(E.querySelector(".sapUiTableTreeIconNodeOpen")||E.querySelector(".sapUiTableTreeIconNodeClosed")))||E.classList.contains("sapUiTableTreeIconNodeOpen")||E.classList.contains("sapUiTableTreeIconNodeClosed");};b._isElementInteractive=function(E){if(!E){return false;}return q(E).is(T.INTERACTIVE_ELEMENT_SELECTORS);};b._getFirstInteractiveElement=function(R){if(!R){return null;}var A=R.getParent();var E=R.getCells();var $;var I;if(T.hasRowActions(A)){E.push(R.getRowAction());}for(var i=0;i<E.length;i++){$=T.getParentCell(A,E[i].getDomRef());I=T.getInteractiveElements($);if(I){return I.first();}}return null;};b._getLastInteractiveElement=function(R){if(!R){return null;}var A=R.getParent();var E=R.getCells();var $;var I;if(T.hasRowActions(A)){E.push(R.getRowAction());}for(var i=E.length-1;i>=0;i--){$=T.getParentCell(A,E[i].getDomRef());I=T.getInteractiveElements($);if(I){return I.last();}}return null;};b._getPreviousInteractiveElement=function(A,E){if(!A||!E){return null;}var $=q(E);if(!this._isElementInteractive($)){return null;}var F=T.getParentCell(A,E);var I;var G;var J;var L;var N;var O;var P;I=T.getInteractiveElements(F);if(I[0]!==$[0]){return I.eq(I.index(E)-1);}G=T.getCellInfo(F);L=A.getRows()[G.rowIndex].getCells();if(G.isOfType(C.ROWACTION)){P=L.length-1;}else{N=A.getColumns()[G.columnIndex];O=x(A,N);P=O-1;}for(var i=P;i>=0;i--){J=L[i].getDomRef();F=T.getParentCell(A,J);I=T.getInteractiveElements(F);if(I){return I.last();}}return null;};b._getNextInteractiveElement=function(A,E){if(!A||!E){return null;}var $=q(E);if(!this._isElementInteractive($)){return null;}var F=T.getParentCell(A,E);var I;var G;var J;var L;var N;var R;var O;I=T.getInteractiveElements(F);if(I.get(-1)!==$[0]){return I.eq(I.index(E)+1);}G=T.getCellInfo(F);if(G.isOfType(C.ROWACTION)){return null;}R=A.getRows()[G.rowIndex];L=R.getCells();N=A.getColumns()[G.columnIndex];O=x(A,N);for(var i=O+1;i<L.length;i++){J=L[i].getDomRef();F=T.getParentCell(A,J);I=T.getInteractiveElements(F);if(I){return I.first();}}if(T.hasRowActions(A)){F=T.getParentCell(A,R.getRowAction().getDomRef());I=T.getInteractiveElements(F);if(I.get(-1)!==$[0]){return I.eq(I.index(E)+1);}}return null;};function z(i){var F=T.getRowIndexOfFocusedCell(i);var A=i.getRows()[F].getIndex();var E=i._getSelectionPlugin();i._oRangeSelection={startIndex:A,selected:E.isIndexSelected(A)};}b.prototype.enterActionMode=function(){var i=this._getKeyboardExtension();var A=document.activeElement;var I=T.getInteractiveElements(A);var $=T.getParentCell(this,A);var E=T.getCellInfo($);if(E.isOfType(C.ANYCOLUMNHEADER)){return false;}if(I){i._suspendItemNavigation();A.tabIndex=-1;b._focusElement(this,I[0],true);return true;}else if($){this._getKeyboardExtension()._suspendItemNavigation();return true;}return false;};b.prototype.leaveActionMode=function(A){A=A==null?true:A;var i=this._getKeyboardExtension();var E=document.activeElement;var $=T.getParentCell(this,E);i._resumeItemNavigation();if(A){if($){b._focusElement(this,$[0],true);}else{var I=this._getItemNavigation();if(I){var F=I.aItemDomRefs;var G=F.indexOf(E);if(G>-1){I.setFocusedIndex(G);}}i._setSilentFocus(E);}}};b.prototype.onfocusin=function(E){if(E.isMarked("sapUiTableIgnoreFocusIn")){return;}var $=q(E.target);if($.hasClass("sapUiTableOuterBefore")||$.hasClass("sapUiTableOuterAfter")||(E.target!=this.getDomRef("overlay")&&this.getShowOverlay())){this.$("overlay").trigger("focus");}else if($.hasClass("sapUiTableCtrlBefore")){var N=T.isNoDataVisible(this);if(!N||N&&this.getColumnHeaderVisible()){t(this,E);}else{this._getKeyboardExtension()._setSilentFocus(this.$("noDataCnt"));}}else if($.hasClass("sapUiTableCtrlAfter")){if(!T.isNoDataVisible(this)){r(this,E);}}var i=T.getCellInfo(E.target);var I=i.isOfType(C.ROWHEADER)&&T.Grouping.isInGroupHeaderRow(E.target);var A=i.isOfType(C.ROWHEADER)&&!I&&T.isRowSelectorSelectionAllowed(this);var F=i.isOfType(C.DATACELL)&&this._getKeyboardExtension()._bStayInActionMode;var P=T.getCellInfo(T.getParentCell(this,E.target)).isOfType(C.ANYCONTENTCELL);var G=b._isElementInteractive(E.target);var J=this._getKeyboardExtension().isInActionMode();var L=(J&&(I||A||F)||(G&&P));if(F){this._getKeyboardExtension()._bStayInActionMode=false;}this._getKeyboardExtension().setActionMode(L,false);};b.prototype.onkeydown=function(E){var i=this._getKeyboardExtension();var A=T.getCellInfo(E.target);var F=this.getSelectionMode();var G=this._getSelectionPlugin();if(D.browser.msie&&b._isKeyCombination(E,K.V,M.CTRL)){this.onpaste(E);return;}if(b._isKeyCombination(E,K.F2)){var I=i.isInActionMode();var $=T.getCell(this,E.target);var J=T.getParentCell(this,E.target)!=null;A=T.getCellInfo($);if(!I&&J){$.trigger("focus");}else if(A.isOfType(C.ANYCOLUMNHEADER)){var L=T.getInteractiveElements($);if(L){L[0].focus();}}else{i.setActionMode(!I);}return;}else if(b._isKeyCombination(E,K.F4)&&b._isElementGroupToggler(this,E.target)){T.Grouping.toggleGroupHeaderByRef(this,E.target);return;}if(this._getKeyboardExtension().isInActionMode()||!A.isOfType(C.ANY)){return;}if(b._isKeyCombination(E,K.SPACE)){E.preventDefault();}if(b._isKeyCombination(E,K.SHIFT)&&F===S.MultiToggle&&(A.isOfType(C.ROWHEADER)&&T.isRowSelectorSelectionAllowed(this)||(A.isOfType(C.DATACELL|C.ROWACTION)))){z(this);}else if(b._isKeyCombination(E,K.A,M.CTRL)){E.preventDefault();if(A.isOfType(C.ANYCONTENTCELL|C.COLUMNROWHEADER)&&F===S.MultiToggle){G.onKeyboardShortcut("toggle");}}else if(b._isKeyCombination(E,K.A,M.CTRL+M.SHIFT)){if(A.isOfType(C.ANYCONTENTCELL|C.COLUMNROWHEADER)){G.onKeyboardShortcut("clear");}}else if(b._isKeyCombination(E,K.F4)){if(A.isOfType(C.DATACELL)){i.setActionMode(true);}}};b.prototype.onkeypress=function(E){var i=this._getKeyboardExtension();var A=T.getCellInfo(E.target);if(b._isKeyCombination(E,"+")){if(b._isElementGroupToggler(this,E.target)){T.Grouping.toggleGroupHeaderByRef(this,E.target,true);}else if(A.isOfType(C.DATACELL|C.ROWACTION)){i.setActionMode(true);}}else if(b._isKeyCombination(E,"-")){if(b._isElementGroupToggler(this,E.target)){T.Grouping.toggleGroupHeaderByRef(this,E.target,false);}else if(A.isOfType(C.DATACELL|C.ROWACTION)){i.setActionMode(true);}}};b.prototype.oncontextmenu=function(E){if(E.isMarked("handledByPointerExtension")){return;}var i=T.getCellInfo(document.activeElement);if(i.isOfType(C.ANY)){E.preventDefault();T.Menu.openContextMenu(this,E.target,E);}};b.prototype.onkeyup=function(E){var i=T.getCellInfo(E.target);if(b._isKeyCombination(E,K.SHIFT)){delete this._oRangeSelection;}if(i.isOfType(C.COLUMNHEADER)){if(b._isKeyCombination(E,K.SPACE)||b._isKeyCombination(E,K.ENTER)){T.Menu.openContextMenu(this,E.target);}}else if(b._isKeyCombination(E,K.SPACE)){v(this,E);}else if(b._isKeyCombination(E,K.SPACE,M.SHIFT)){T.toggleRowSelection(this,this.getRows()[i.rowIndex].getIndex());z(this);}else if(this._legacyMultiSelection&&!i.isOfType(C.COLUMNROWHEADER)&&(b._isKeyCombination(E,K.SPACE,M.CTRL)||b._isKeyCombination(E,K.ENTER,M.CTRL))){v(this,E);}};b.prototype.onsaptabnext=function(E){var A=this._getKeyboardExtension();var F=T.getCellInfo(E.target);var $;if(A.isInActionMode()){var I;$=T.getCell(this,E.target);F=T.getCellInfo($);if(!F.isOfType(C.ANYCONTENTCELL)){return;}var R=this.getRows()[F.rowIndex];var L=b._getLastInteractiveElement(R);var G=L===null||L[0]===E.target;if(G){var J=R.getIndex();var N=T.isLastScrollableRow(this,$);var O=this._getTotalRowCount()-1===J;var P=T.isRowSelectorSelectionAllowed(this);E.preventDefault();if(O){A.setActionMode(false);}else if(N){j(this,E);}else{var Q=F.rowIndex;if(P){y(this,C.ROWHEADER,Q+1);}else{var U=this.getRows().length;var V=false;for(var i=F.rowIndex+1;i<U;i++){Q=i;R=this.getRows()[Q];I=b._getFirstInteractiveElement(R);V=R.isGroupHeader();if(I||V){break;}}if(I){b._focusElement(this,I[0]);}else if(V){y(this,C.ROWHEADER,Q);}else{j(this,E);}}}}else if(F.isOfType(C.ROWHEADER)){E.preventDefault();I=b._getFirstInteractiveElement(R);b._focusElement(this,I[0]);}else{E.preventDefault();I=b._getNextInteractiveElement(this,E.target);b._focusElement(this,I[0]);}}else if(F.isOfType(C.ANYCOLUMNHEADER)){if(T.isNoDataVisible(this)){this.$("noDataCnt").trigger("focus");E.preventDefault();}else if(this.getRows().length>0){r(this,E);E.preventDefault();}}else if(F.isOfType(C.ANYCONTENTCELL)){u(this,"sapUiTableCtrlAfter");}else if(E.target===this.getDomRef("overlay")){A._setSilentFocus(this.$().find(".sapUiTableOuterAfter"));}else if(!F.isOfType(C.ANY)){$=T.getParentCell(this,E.target);if($){E.preventDefault();$.trigger("focus");}}};b.prototype.onsaptabprevious=function(E){var A=this._getKeyboardExtension();var F=T.getCellInfo(E.target);var $;if(A.isInActionMode()){var I;$=T.getCell(this,E.target);F=T.getCellInfo($);if(!F.isOfType(C.ANYCONTENTCELL)){return;}var R=this.getRows()[F.rowIndex];var G=R.getIndex();var J=b._getFirstInteractiveElement(R);var L=J!==null&&J[0]===E.target;var N=T.isRowSelectorSelectionAllowed(this);var O=N||R.isGroupHeader();if(L&&O){E.preventDefault();y(this,C.ROWHEADER,F.rowIndex);}else if((L&&!O)||F.isOfType(C.ROWHEADER)||J===null){var P=T.isFirstScrollableRow(this,$);var Q=G===0;E.preventDefault();if(Q){A.setActionMode(false);}else if(P){m(this,E);}else{var U=F.rowIndex;var V=false;for(var i=F.rowIndex-1;i>=0;i--){U=i;R=this.getRows()[U];I=b._getLastInteractiveElement(R);V=R.isGroupHeader();if(I||O||V){break;}}if(I){b._focusElement(this,I[0]);}else if(V||O){y(this,C.ROWHEADER,U);}else{m(this,E);}}}else{E.preventDefault();I=b._getPreviousInteractiveElement(this,E.target);b._focusElement(this,I[0]);}}else if(F.isOfType(C.ANYCONTENTCELL)||E.target===this.getDomRef("noDataCnt")){if(this.getColumnHeaderVisible()&&!F.isOfType(C.ROWACTION)){t(this,E);E.preventDefault();}else{u(this,"sapUiTableCtrlBefore");}}else if(E.target===this.getDomRef("overlay")){this._getKeyboardExtension()._setSilentFocus(this.$().find(".sapUiTableOuterBefore"));}else if(!F.isOfType(C.ANY)){$=T.getParentCell(this,E.target);if($){E.preventDefault();$.trigger("focus");}}};b.prototype.onsapdown=function(E){n(this,E);};b.prototype.onsapdownmodifiers=function(E){if(b._isKeyCombination(E,null,M.CTRL)){n(this,E);return;}var i=this._getKeyboardExtension();if(b._isKeyCombination(E,null,M.ALT)&&b._isElementGroupToggler(this,E.target)){p(E);T.Grouping.toggleGroupHeaderByRef(this,E.target,true);return;}if(i.isInActionMode()){return;}var A=T.getCellInfo(E.target);if(b._isKeyCombination(E,null,M.SHIFT)){E.preventDefault();if(A.isOfType(C.ANYCONTENTCELL)){if(!this._oRangeSelection){p(E);return;}var F=T.getRowIndexOfFocusedCell(this);var G=this.getRows()[F].getIndex();if(G===this._getTotalRowCount()-1){return;}if(T.isLastScrollableRow(this,E.target)){var I=s(this,E);if(I){p(E);}}if(this._oRangeSelection.startIndex<=G){G++;if(this._oRangeSelection.selected){T.toggleRowSelection(this,G,true);}else{T.toggleRowSelection(this,G,false);}}else{T.toggleRowSelection(this,G,false);}}else{p(E);}}if(b._isKeyCombination(E,null,M.ALT)){if(A.isOfType(C.DATACELL)){i.setActionMode(true);}p(E);}};b.prototype.onsapup=function(E){d(this,E);};b.prototype.onsapupmodifiers=function(E){if(b._isKeyCombination(E,null,M.CTRL)){d(this,E);return;}if(b._isKeyCombination(E,null,M.ALT)&&b._isElementGroupToggler(this,E.target)){p(E);T.Grouping.toggleGroupHeaderByRef(this,E.target,false);return;}var i=this._getKeyboardExtension();if(i.isInActionMode()){return;}var A=T.getCellInfo(E.target);if(b._isKeyCombination(E,null,M.SHIFT)){E.preventDefault();if(A.isOfType(C.ANYCONTENTCELL)){if(!this._oRangeSelection){p(E);return;}var F=T.getRowIndexOfFocusedCell(this);var G=this.getRows()[F].getIndex();if(G===0){p(E);return;}if(T.isFirstScrollableRow(this,E.target)){var I=g(this,E);if(I){p(E);}}if(this._oRangeSelection.startIndex>=G){G--;if(this._oRangeSelection.selected){T.toggleRowSelection(this,G,true);}else{T.toggleRowSelection(this,G,false);}}else{T.toggleRowSelection(this,G,false);}}else{p(E);}}if(b._isKeyCombination(E,null,M.ALT)){if(A.isOfType(C.DATACELL)){i.setActionMode(true);}p(E);}};b.prototype.onsapleft=function(E){f(this,E);};b.prototype.onsapleftmodifiers=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}var A=T.getCellInfo(E.target);var I=sap.ui.getCore().getConfiguration().getRTL();if(b._isKeyCombination(E,null,M.SHIFT)){E.preventDefault();if(A.isOfType(C.DATACELL)){if(!this._oRangeSelection){p(E);return;}var F=T.getFocusedItemInfo(this);var G=T.hasRowHeader(this)&&F.cellInRow===1;if(G&&!T.isRowSelectorSelectionAllowed(this)){p(E);}}else if(A.isOfType(C.ROWACTION)){if(!this._oRangeSelection){p(E);}}else if(A.isOfType(C.ROWHEADER)&&I){if(!T.isRowSelectionAllowed(this)){p(E);}}else if(A.isOfType(C.COLUMNROWHEADER)&&I){p(E);}else if(A.isOfType(C.COLUMNHEADER)){var R=-T.convertCSSSizeToPixel(a);var J=0;if(I){R=R*-1;}for(var i=A.columnIndex;i<A.columnIndex+A.columnSpan;i++){J+=T.Column.getColumnWidth(this,i);}T.Column.resizeColumn(this,A.columnIndex,J+R,true,A.columnSpan);p(E);}}else if(b._isKeyCombination(E,null,M.CTRL)){if(A.isOfType(C.COLUMNHEADER)){E.preventDefault();E.stopImmediatePropagation();var L=this.getColumns()[A.columnIndex];w(L,I);}}};b.prototype.onsaprightmodifiers=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}var A=T.getCellInfo(E.target);var I=sap.ui.getCore().getConfiguration().getRTL();if(b._isKeyCombination(E,null,M.SHIFT)){E.preventDefault();if(A.isOfType(C.DATACELL)){if(!this._oRangeSelection){p(E);}}else if(A.isOfType(C.ROWHEADER)){if(!T.isRowSelectionAllowed(this)){p(E);}}else if(A.isOfType(C.ROWACTION)&&I){if(!this._oRangeSelection){p(E);}}else if(A.isOfType(C.COLUMNHEADER)){var R=T.convertCSSSizeToPixel(a);var F=0;if(I){R=R*-1;}for(var i=A.columnIndex;i<A.columnIndex+A.columnSpan;i++){F+=T.Column.getColumnWidth(this,i);}T.Column.resizeColumn(this,A.columnIndex,F+R,true,A.columnSpan);p(E);}else if(A.isOfType(C.COLUMNROWHEADER)){p(E);}}else if(b._isKeyCombination(E,null,M.CTRL)){if(A.isOfType(C.COLUMNHEADER)){E.preventDefault();E.stopImmediatePropagation();var G=this.getColumns()[A.columnIndex];w(G,!I);}}};b.prototype.onsaphome=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}if(T.Grouping.isInGroupHeaderRow(E.target)){p(E);E.preventDefault();return;}var i=T.getCellInfo(E.target);if(i.isOfType(C.ANY)){E.preventDefault();}if(i.isOfType(C.DATACELL|C.ROWACTION|C.COLUMNHEADER)){var F=T.getFocusedItemInfo(this);var A=F.cell;var G=F.cellInRow;var I=this.getComputedFixedColumnCount();var J=T.hasRowHeader(this);var R=J?1:0;if(T.hasFixedColumns(this)&&G>I+R){p(E);T.focusItem(this,A-G+I+R,null);}else if(J&&G>1){p(E);T.focusItem(this,A-G+R,null);}}};b.prototype.onsapend=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}if(T.Grouping.isInGroupHeaderRow(E.target)){E.preventDefault();p(E);return;}var i=T.getCellInfo(E.target);if(i.isOfType(C.ANY)){E.preventDefault();var F=T.getFocusedItemInfo(this);var A=F.cell;var G=F.columnCount;var I=this.getComputedFixedColumnCount();var J=F.cellInRow;var L=T.hasRowHeader(this);var R=L?1:0;var N=false;if(i.isOfType(C.COLUMNHEADER)&&T.hasFixedColumns(this)){var O=parseInt(i.cell.attr("colspan")||1);if(O>1&&J+O-R===I){N=true;}}if(L&&J===0){p(E);T.focusItem(this,A+1,null);}else if(T.hasFixedColumns(this)&&J<I-1+R&&!N){p(E);T.focusItem(this,A+I-J,null);}else if(T.hasRowActions(this)&&i.isOfType(C.DATACELL)&&J<G-2){p(E);T.focusItem(this,A-J+G-2,null);}}};b.prototype.onsaphomemodifiers=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}if(b._isKeyCombination(E,null,M.CTRL)){E.preventDefault();var i=T.getCellInfo(E.target);if(i.isOfType(C.ANYCONTENTCELL|C.COLUMNHEADER)){p(E);var F=T.getFocusedItemInfo(this);var A=F.row;if(A>0){var G=F.cell;var I=F.columnCount;var J=T.getHeaderRowCount(this);var R=this._getRowCounts();if(A<J+R.fixedTop){if(i.isOfType(C.ROWACTION)){T.focusItem(this,G-I*(A-J),E);}else{T.focusItem(this,G-I*A,E);}}else if(A>=J+R.fixedTop&&A<J+T.getNonEmptyRowCount(this)-R.fixedBottom){this._getScrollExtension().scrollVerticallyMax(false);if(R.fixedTop>0||i.isOfType(C.ROWACTION)){T.focusItem(this,G-I*(A-J),E);}else{T.focusItem(this,G-I*A,E);}}else{this._getScrollExtension().scrollVerticallyMax(false);T.focusItem(this,G-I*(A-J-R.fixedTop),E);}}}}};b.prototype.onsapendmodifiers=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}if(b._isKeyCombination(E,null,M.CTRL)){E.preventDefault();var i=T.getCellInfo(E.target);if(i.isOfType(C.ANY)){var F=T.getFocusedItemInfo(this);var A=F.row;var G=T.getHeaderRowCount(this);var N=T.getNonEmptyRowCount(this);var R=this._getRowCounts();p(E);if(R.fixedBottom===0||A<G+N-1||(T.isNoDataVisible(this)&&A<G-1)){var I=F.cell;var J=F.columnCount;if(T.isNoDataVisible(this)){T.focusItem(this,I+J*(G-A-1),E);}else if(A<G){if(R.fixedTop>0){T.focusItem(this,I+J*(G+R.fixedTop-A-1),E);}else{this._getScrollExtension().scrollVerticallyMax(true);T.focusItem(this,I+J*(G+N-R.fixedBottom-A-1),E);}}else if(A>=G&&A<G+R.fixedTop){this._getScrollExtension().scrollVerticallyMax(true);T.focusItem(this,I+J*(G+N-R.fixedBottom-A-1),E);}else if(A>=G+R.fixedTop&&A<G+N-R.fixedBottom){this._getScrollExtension().scrollVerticallyMax(true);T.focusItem(this,I+J*(G+N-A-1),E);}else{T.focusItem(this,I+J*(G+N-A-1),E);}}}}};b.prototype.onsappageup=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}E.preventDefault();var i=T.getCellInfo(E.target);if(i.isOfType(C.ANYCONTENTCELL|C.COLUMNHEADER)){var F=T.getFocusedItemInfo(this);var A=F.row;var G=T.getHeaderRowCount(this);var R=this._getRowCounts();if(R.fixedTop===0&&A>=G||R.fixedTop>0&&A>G){p(E);var I=F.cell;var J=F.columnCount;if(A<G+R.fixedTop){T.focusItem(this,I-J*(A-G),E);}else if(A===G+R.fixedTop){var P=T.getNonEmptyRowCount(this)-R.fixedTop-R.fixedBottom;var L=this.getFirstVisibleRow();g(this,E,true);if(L<P){if(R.fixedTop>0||i.isOfType(C.ROWACTION)){T.focusItem(this,I-J*(A-G),E);}else{T.focusItem(this,I-J*G,E);}}}else if(A>G+R.fixedTop&&A<G+T.getNonEmptyRowCount(this)){T.focusItem(this,I-J*(A-G-R.fixedTop),E);}else{T.focusItem(this,I-J*(A-G-T.getNonEmptyRowCount(this)+1),E);}}if(i.isOfType(C.ROWACTION)&&A===G&&R.fixedTop>0){p(E);}}};b.prototype.onsappagedown=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}E.preventDefault();var i=T.getCellInfo(E.target);if(i.isOfType(C.ANY)){var F=T.getFocusedItemInfo(this);var A=F.row;var G=T.getHeaderRowCount(this);var N=T.getNonEmptyRowCount(this);var R=this._getRowCounts();p(E);if((T.isNoDataVisible(this)&&A<G-1)||R.fixedBottom===0||A<G+N-1){var I=F.cell;var J=F.columnCount;if(A<G-1&&!i.isOfType(C.COLUMNROWHEADER)){T.focusItem(this,I+J*(G-A-1),E);}else if(A<G){if(!T.isNoDataVisible(this)){T.focusItem(this,I+J*(G-A),E);}}else if(A>=G&&A<G+N-R.fixedBottom-1){T.focusItem(this,I+J*(G+N-R.fixedBottom-A-1),E);}else if(A===G+N-R.fixedBottom-1){var P=T.getNonEmptyRowCount(this)-R.fixedTop-R.fixedBottom;var L=this._getTotalRowCount()-R.fixedBottom-this.getFirstVisibleRow()-P*2;s(this,E,true);if(L<P&&R.fixedBottom>0){T.focusItem(this,I+J*(G+N-A-1),E);}}else{T.focusItem(this,I+J*(G+N-A-1),E);}}}};b.prototype.onsappageupmodifiers=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}if(b._isKeyCombination(E,null,M.ALT)){var i=T.getCellInfo(E.target);var F=T.getFocusedItemInfo(this);if(i.isOfType(C.DATACELL|C.COLUMNHEADER)){var A=F.cell;var G=F.cellInRow;var I=T.hasRowHeader(this);var R=I?1:0;var P=H;p(E);if(I&&(T.Grouping.isInGroupHeaderRow(E.target)||G===1)){T.focusItem(this,A-G,null);}else if(G-R<P){T.focusItem(this,A-G+R,null);}else{T.focusItem(this,A-P,null);}}else if(i.isOfType(C.ROWACTION)){T.focusItem(this,F.cell-1,null);}}};b.prototype.onsappagedownmodifiers=function(E){if(this._getKeyboardExtension().isInActionMode()){return;}if(b._isKeyCombination(E,null,M.ALT)){var i=T.getCellInfo(E.target);if(i.isOfType(C.DATACELL|C.ROWHEADER|C.ANYCOLUMNHEADER)){var F=T.getFocusedItemInfo(this);var A=F.cellInRow;var G=T.hasRowHeader(this);var R=G?1:0;var V=T.getVisibleColumnCount(this);var I=parseInt(i.cell.attr("colspan")||1);p(E);if(A+I-R<V){var J=F.cell;var P=H;if(G&&A===0){T.focusItem(this,J+1,null);}else if(I>P){T.focusItem(this,J+I,null);}else if(A+I-R+P>V){T.focusItem(this,J+V-A-1+R,null);}else if(!T.Grouping.isInGroupHeaderRow(E.target)){T.focusItem(this,J+P,null);}}else if(i.isOfType(C.DATACELL)&&T.hasRowActions(this)&&A===F.columnCount-2){T.focusItem(this,F.cell+1,null);}}}};b.prototype.onsapenter=function(E){v(this,E);};return b;});