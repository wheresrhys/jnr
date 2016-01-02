'use strict';
export const ddoc = {
	_id: '_design/tunes',
	views: {
		index: {
			map: function (doc) {
				if (doc.docType === 'tune') {
					emit(doc.name.replace(/^(The|Y) /, ''));
				}
			}.toString()
		}
	}
};
