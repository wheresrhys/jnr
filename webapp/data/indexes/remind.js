'use strict';
export const ddoc = {
	_id: '_design/remind',
	views: {
		index: {
			map: function (doc) {
				if (doc.docType === 'setting') {
					var val;
					if (doc.practices.length) {
						val = doc.practices.reduce(function (total, practice) {
							return total + practice.urgency;
						}, 0)/doc.practices.length;
						if (val < 4) {
							emit(new Date(doc.practices[0].date).getTime() / (24 * 60 * 60 * 1000 * 5));
						}
					}
				}
			}.toString()
		}
	}
};
