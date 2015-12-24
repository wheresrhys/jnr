'use strict';
export const ddoc = {
	_id: '_design/learn',
	views: {
		index: {
			map: function (doc) {
				if (doc.type === 'tune') {
					doc.repertoire.forEach(function (piece) {
						var val;
						if (piece.practices.length) {
							val = piece.practices.reduce(function (total, practice) {
								return total + practice.urgency;
							}, 0)/piece.practices.length
						} else {
							val = 1;
						}
						emit([piece.tunebook, val]);
					})
				}
			}.toString()
		}
	}
};
