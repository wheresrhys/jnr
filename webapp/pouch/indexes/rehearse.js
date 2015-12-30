'use strict';
export const ddoc = {
	_id: '_design/rehearse',
	views: {
		index: {
			map: function (doc) {
				if (doc.type === 'tune') {
					doc.repertoire.forEach(function (piece) {
						var val;
						if (piece.practices.length) {
							val = piece.practices.reduce(function (total, practice) {
								return total + practice.urgency;
							}, 0)/piece.practices.length;
							if (val < 4) {
								emit(new Date(piece.practices[0].date).getTime() / (24 * 60 * 60 * 1000 * 5));
							}
						}
					})
				}
			}.toString()
		}
	}
};
