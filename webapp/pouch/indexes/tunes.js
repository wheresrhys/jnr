'use strict';
module.exports = {
	ddoc: {
		_id: '_design/tunes',
		views: {
			index: {
				map: function (doc) {
					if (doc.type === 'tune') {
						emit(doc.name.replace(/^(The|Y) /, ''), doc);
					}
				}.toString()
			}
		}
	}
};
