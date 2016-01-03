'use strict';
export const ddoc = {
	_id: '_design/settings',
	views: {
		index: {
			map: function (doc) {
				if (doc.docType === 'setting') {
					emit(doc.name.replace(/^(The|Y) /, ''));
				}
			}.toString()
		}
	}
};
