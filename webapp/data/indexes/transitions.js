'use strict';
export const ddoc = {
	_id: '_design/transitions',
	views: {
		index: {
			map: function (doc) {
				if (doc.docType === 'transition') {
					emit(doc.from.id);
					emit(doc.to.id);
					emit(doc.from.id + '|' + doc.from.key);
					emit(doc.to.id + '|' + doc.to.key);
				}
			}.toString()
		}
	}
}

