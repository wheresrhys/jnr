function(doc) {

	var keys = doc.type === 'tune' ? [doc._id] :
		doc.type === 'piece' ? [doc.tuneId] :
		doc.type === 'arrangement' ? [doc.tuneId] :
		doc.type === 'set' ? doc.tunes.map(t => t.tuneId) :
		doc.type === 'transition' ? [doc.from.tuneId, doc.to.tuneId] : [];

	keys.forEach(function (key) {
		emit([key, doc.type], doc);
	})
}