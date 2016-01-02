'use strict';
const fiveDays = 24 * 60 * 60 * 1000 * 5;

export const ddoc = {
	_id: '_design/learn',
	views: {
		index: {
			map: function (doc) {
				if (doc.docType === 'tune') {
					var val;
					if (doc.practices.length) {
						var avg = doc.practices.reduce(function (total, practice) {
							return total + practice.urgency;
						}, 0)/doc.practices.length;
						if (doc.practices[0].urgency <3.5 && avg <3.5) {
							return;
						}
						val = doc.practices[0].urgency - (new Date(doc.practices[0].date).getTime() / (24 * 60 * 60 * 1000 * 5))
					} else {
						val = 0;
					}
					emit(val);
				}
			}.toString()
		}
	}
};
