/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// --------------------------------------------------------------------------------
// Utility class used by smart controls for date/time conversions
// --------------------------------------------------------------------------------
sap.ui.define([], function() {
	"use strict";

	function _padStart(sValue, targetLength, padString) {
		var sResultValue,
			sPrefix,
			iValueLength = sValue.length;

		if (iValueLength >= targetLength) {
			sResultValue = sValue;
		} else {
			sPrefix = Array(targetLength + 1 - iValueLength).join(padString);
			sResultValue = sPrefix + sValue;
		}

		return sResultValue;
	}

	/**
	 * Utility class used by smart controls for date/time conversions
	 *
	 * @private
	 */
	var DateTimeUtil = {
		/**
		 * Convert time part of a JS Date object from local time to UTC
		 *
		 * Returns a new date object, where the UTC time is set to the same value as
		 * the local time on the original date object.
		 *
		 * If a date has a local time of to 14:00 GMT+0200, the resulting date will have
		 * 14:00 UTC on the same day.
		 *
		 * @param {Date} oDate the date to convert
		 * @returns {Date} a new date object with converted time
		 * @private
		 */
		localToUtc: function(oDate) {
			var sPadString = "0",
				// sDate pattern is "YYYY-MM-DDTHH:mm:ss.sssZ" where "Z" stands for UTC
				sDate = _padStart(oDate.getFullYear().toString(), 4, sPadString) + "-" +
						_padStart((oDate.getMonth() + 1).toString(), 2, sPadString) + "-" +
						_padStart(oDate.getDate().toString(), 2, sPadString) + "T" +
						_padStart(oDate.getHours().toString(), 2, sPadString) + ":" +
						_padStart(oDate.getMinutes().toString(), 2, sPadString) + ":" +
						_padStart(oDate.getSeconds().toString(), 2, sPadString) + "." +
						_padStart(oDate.getMilliseconds().toString(), 3, sPadString) +
						"Z";

			return new Date(sDate);
		},

		/**
		 * Convert time part of a JS Date object from UTC to local time
		 *
		 * Returns a new date object, where the local time is set to the same value as
		 * the UTC time on the original date object.
		 *
		 * If a date has a time of to 14:00 UTC, the resulting date will have
		 * 14:00 GMT+0200 on the same day.
		 *
		 * Please be aware that due to summer/winter time and changes in timezones,
		 * not all times can be converted to local time.
		 *
		 * @param {Date} oDate the date to convert
		 * @returns {Date} a new date object with converted time
		 * @private
		 */
		utcToLocal: function(oDate) {
			var sPadString = "0",
				// sDate pattern is "YYYY-MM-DDTHH:mm:ss.sss"
				sDate = _padStart(oDate.getUTCFullYear().toString(), 4, sPadString) + "-" +
						_padStart((oDate.getUTCMonth() + 1).toString(), 2, sPadString) + "-" +
						_padStart(oDate.getUTCDate().toString(), 2, sPadString) + "T" +
						_padStart(oDate.getUTCHours().toString(), 2, sPadString) + ":" +
						_padStart(oDate.getUTCMinutes().toString(), 2, sPadString) + ":" +
						_padStart(oDate.getUTCSeconds().toString(), 2, sPadString) + "." +
						_padStart(oDate.getUTCMilliseconds().toString(), 3, sPadString);

			return new Date(sDate);
		},

		/**
		 * Convert date object to Edm.Time object
		 *
		 * Returns the date object as specially formed JS object, containing
		 * type information and time in milliseconds, as used in the ODataModel.
		 *
		 * @param {Date} oDate
		 * @returns {Object} the time object
		 */
		dateToEdmTime: function(oDate) {
			return {
				__edmType: "Edm.Time",
				ms: oDate.valueOf()
			};
		},

		/**
		 * Convert Edm.Time object to date object
		 *
		 * Returns the time object, which is a specially formed JS object, containing
		 * type information and time in milliseconds, converted to a JS Date, with
		 * the time as UTC on 1st of January 1970.
		 *
		 * @param {Object} oTime
		 * @returns {Date} the date object
		 */
		edmTimeToDate: function(oTime) {
			return new Date(oTime.ms);
		},

		/**
		 * Adapt the precision of a date object
		 *
		 * A JS date object may contain milliseconds, where the corresponding backend
		 * type does not. To avoid rounding issues this method can be used to reduce
		 * the precision to the given amount of fraction digits.
		 *
		 * Returns the same date object, if no adaption is necessary or a new date
		 * object with the required precision.
		 *
		 * @param {Date} oDate the date to adapt
		 * @param {number} iPrecision the precision to apply
		 * @returns {Date} the resulting date object
		 * @private
		 */
		adaptPrecision: function(oDate, iPrecision) {
			var iMilliseconds = oDate.getMilliseconds(),
				oResultDate;
			if (isNaN(iPrecision) || iPrecision >= 3 || iMilliseconds === 0) {
				return oDate;
			}
			if (iPrecision === 0) {
				iMilliseconds = 0;
			} else if (iPrecision === 1) {
				iMilliseconds = Math.floor(iMilliseconds / 100) * 100;
			} else if (iPrecision === 2) {
				iMilliseconds = Math.floor(iMilliseconds / 10) * 10;
			}
			oResultDate = new Date(oDate);
			oResultDate.setMilliseconds(iMilliseconds);
			return oResultDate;
		},

		/**
		 * Checks a date object to only contain date without time
		 *
		 * When the JS date object is used for storing date information only, the hours,
		 * minutes, seconds and milliseconds should be set to zero.
		 *
		 * @param {Date} oDate the date to check
		 * @param {boolean} bUTC whether the time should be 0 o'clock local time or UTC
		 * @returns {boolean} whether the time part is zero
		 */
		isDate: function(oDate, bUTC) {
			if (bUTC) {
				return oDate.getUTCHours() === 0 &&
					oDate.getUTCMinutes() === 0 &&
					oDate.getUTCSeconds() === 0 &&
					oDate.getUTCMilliseconds() === 0;
			} else {
				return oDate.getHours() === 0 &&
					oDate.getMinutes() === 0 &&
					oDate.getSeconds() === 0 &&
					oDate.getMilliseconds() === 0;
			}
		},

		/**
		 * Normalize date only date object
		 *
		 * When a JS date object is used for storing date information only, the hours,
		 * minutes, seconds and milliseconds should be set to zero.
		 *
		 * Returns the same date object, if no normalization is needed or a new date
		 * object, with time part set to zero, either local time or UTC depending on the
		 * UTC flag.
		 *
		 * @param {Date} oDate the date to convert
		 * @param {boolean} bUTC whether to normalize to 0:00 UTC instead of local time
		 */
		normalizeDate: function(oDate, bUTC) {
			var oResultDate;
			if (this.isDate(oDate, bUTC)) {
				return oDate;
			}
			oResultDate = new Date(oDate);
			if (bUTC) {
				oResultDate.setUTCHours(0, 0, 0, 0);
			} else {
				oResultDate.setHours(0, 0, 0, 0);
			}
			return oResultDate;
		}

	};

	return DateTimeUtil;
});
