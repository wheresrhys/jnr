'use strict';
export const ddoc = {
	_id: '_design/tune-derivatives',
	views: {
		index: {
			map: function (doc) {
				var keys = doc.type === 'tune' ? [doc._id] :
									doc.type === 'set' ? doc.tunes.map(function (t) {return t.tuneId}) :
									doc.type === 'transition' ? [doc.from.tuneId, doc.to.tuneId] : [];

				keys.forEach(function (key) {
					emit(key, doc);
				})
			}.toString()
		}
	}
}

