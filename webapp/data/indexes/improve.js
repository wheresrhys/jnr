'use strict';
const fiveDays = 24 * 60 * 60 * 1000 * 5;

export const ddoc = {
	_id: '_design/improve',
	views: {
		index: {
			map: function (doc) {
				if (doc.docType === 'setting') {
					var val;
					if (doc.practices.length) {
						val = (doc.practices.reduce(function (total, practice) {
							return total + practice.urgency;
						}, 0)/doc.practices.length)
						if (val > 3.5) {
							val = val - (new Date(doc.practices[0].date).getTime() / (24 * 60 * 60 * 1000 * 5))
						}
					} else {
						val = 0;
					}
					emit(val);
				}
			}.toString()
		}
	}
};
