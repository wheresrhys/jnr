'use strict';
module.exports = {
	ddoc: {
		_id: '_design/tune-derivatives-by-type',
		views: {
			index: {
				map: function (doc) {

					var keys = doc.type === 'tune' ? [doc._id] :
						doc.type === 'piece' ? [doc.tuneId] :
						doc.type === 'arrangement' ? [doc.tuneId] :
						doc.type === 'set' ? doc.tunes.map(function (t) {return t.tuneId}) :
						doc.type === 'transition' ? [doc.from.tuneId, doc.to.tuneId] : [];

					keys.forEach(function (key) {
						emit([key, doc.type], doc);
					})
				}.toString()
			}
		}
	}
};