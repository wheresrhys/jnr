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
							val = 1000000000000 * piece.practices.reduce(function (total, practice) {
								return total + practice.urgency;
							}, 0)/(piece.practices.length * new Date(piece.practices[0].date).getTime())
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
