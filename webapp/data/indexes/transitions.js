'use strict';
export const ddoc = {
	_id: '_design/transitions',
	views: {
		index: {
			map: function (doc) {
				var keys = doc.type === 'transition' ? [doc.from.id, doc.to.id] : [];

				keys.forEach(function (key) {
					emit(key);
				})
			}.toString()
		}
	}
}

