'use strict';
export const ddoc = {
	_id: '_design/tune-derivatives-by-type',
	views: {
		index: {
			map: function (doc) {

				var keys = doc.type === 'transition' ? [doc.from.tuneId, doc.to.tuneId] : [];

				keys.forEach(function (key) {
					emit([key, doc.type], doc);
				})
			}.toString()
		}
	}
};