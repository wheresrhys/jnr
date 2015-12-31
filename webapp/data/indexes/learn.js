'use strict';
const fiveDays = 24 * 60 * 60 * 1000 * 5;

export const ddoc = {
	_id: '_design/learn',
	views: {
		index: {
			map: function (doc) {
				if (doc.type === 'tune') {
					doc.settings.forEach(function (piece) {
						var val;
						if (piece.practices.length) {
							var avg = piece.practices.reduce(function (total, practice) {
								return total + practice.urgency;
							}, 0)/piece.practices.length;
							if (piece.practices[0].urgency <3.5 && avg <3.5) {
								return;
							}
							val = piece.practices[0].urgency - (new Date(piece.practices[0].date).getTime() / (24 * 60 * 60 * 1000 * 5))
						} else {
							val = 0;
						}
						emit(val);
					})
				}
			}.toString()
		}
	}
};
