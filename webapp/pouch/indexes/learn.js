'use strict';
export const ddoc = {
	_id: '_design/learn',
	views: {
		index: {
			map: function (doc) {
				if (doc.type === 'piece') {
					if (doc.practices.length) {
						var val = 1000000000000 * doc.practices.reduce(function (total, practice) {
							return total + practice.urgency;
						}, 0)/(doc.practices.length * new Date(doc.practices[0].date).getTime())
					} else {
						val = 1;
					}
					emit([doc.tunebook, val], doc);
				}
			}.toString()
		}
	}
};
