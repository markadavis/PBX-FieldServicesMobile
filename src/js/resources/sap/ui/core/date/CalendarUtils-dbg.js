/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides type sap.ui.core.date.CalendarUtils.
sap.ui.define([
	"sap/ui/core/date/CalendarWeekNumbering",
	"sap/ui/core/LocaleData"
], function(
	CalendarWeekNumbering,
	LocaleData
) {
	"use strict";

	var mWeekNumberingConfiguration = {
			ISO_8601 : {
				firstDayOfWeek : 1,
				minimalDaysInFirstWeek : 4
			},
			MiddleEastern : {
				firstDayOfWeek : 6,
				minimalDaysInFirstWeek : 1
			},
			WesternTraditional : {
				firstDayOfWeek : 0,
				minimalDaysInFirstWeek : 1
			}
		};

	/**
	 * Provides calendar-related utilities.
	 *
	 * Note: This API has been introduced with version 1.108 and downported to this release with
	 * patch level 31.
	 *
	 * @namespace
	 * @alias module:sap/ui/core/date/CalendarUtils
	 * @public
	 * @since 1.84.31
	 */
	var CalendarUtils = {

		/**
		 * Resolves calendar week configuration.
		 *
		 * Returns an object with the following fields:
		 * <ul>
		 *   <li><code>firstDayOfWeek</code>: specifies the first day of the week starting with
		 *   <code>0</code> (which is Sunday)</li>
		 *   <li><code>minimalDaysInFirstWeek</code>: minimal days at the beginning of the year
		 *   which define the first calendar week</li>
		 * </ul>
		 *
		 * Note: This API has been introduced with version 1.108 and downported to this release with
		 * patch level 31.
		 *
		 * @param {sap.ui.core.date.CalendarWeekNumbering} [sCalendarWeekNumbering=Default]
		 *   The calendar week numbering; if omitted, <code>Default</code> is used.
		 * @param {sap.ui.core.Locale} [oLocale]
		 *   The locale to use; if not provided, this falls back to the format locale from the
		 *   Configuration; see {@link sap.ui.core.Configuration.FormatSettings#getFormatLocale}.
		 *   Is only used when <code>sCalendarWeekNumbering</code> is set to <code>Default</code>.
		 * @returns {{firstDayOfWeek: int, minimalDaysInFirstWeek: int}|undefined}
		 *   The calendar week configuration, or <code>undefined<code> for an invalid value of
		 *   <code>sap.ui.core.date.CalendarWeekNumbering</code>.
		 * @public
		 * @since 1.84.31
		 */
		getWeekConfigurationValues : function (sCalendarWeekNumbering, oLocale) {
			var oLocaleData;

			if (mWeekNumberingConfiguration.hasOwnProperty(sCalendarWeekNumbering)) {
				return mWeekNumberingConfiguration[sCalendarWeekNumbering];
			}
			sCalendarWeekNumbering = sCalendarWeekNumbering || CalendarWeekNumbering.Default;
			if (sCalendarWeekNumbering === CalendarWeekNumbering.Default) {
				oLocale = oLocale ||
					sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
				oLocaleData = LocaleData.getInstance(oLocale);
				return {
					firstDayOfWeek : oLocaleData.getFirstDayOfWeek(),
					minimalDaysInFirstWeek : oLocaleData.getMinimalDaysInFirstWeek()
				};
			}
			return undefined;
		}
	};

	return CalendarUtils;
});