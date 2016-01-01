'use strict';

var liquidMetal = require('liquidmetal');

var analyzeTerm = function (term) {
	var obj = {};
	obj.term = term
		.replace(/\b[kK]\:(?:([ABCDEFG][#b]?)?(maj|mix|dor|min|aeo|\+|-)?)(\s|$)/, function ($0, root, mode) {
			// as both root and mode are optional and 'either but not none' is hard to do in regex, doing it manually
			if (!root && !mode) {
				return $0;
			}
			obj.key = {
				root: root,
				modes: mode === '+' ? ['maj', 'mix'] :
								mode === '-' ? ['dor', 'min', 'aeo'] :
								mode ? [mode] : undefined
			}
			return ' ';
		})
		.replace(/\b[rR]\:(reel|jig|slip jig|hornpipe|polka)\b/, function ($0, rhythm) {
			obj.rhythm = {
				rhythm: rhythm
			}
			return ' ';
		})
		.replace(/\b[kKrR]\:([^\s]+)?/g, function () {
			return ' ';
		})
		.trim()
		.replace(/\s+/, ' ')
	return obj;
};

var scoreForKey = function (model, keyCriteria) {
	if (!keyCriteria) {
		return 1;
	}
	return model.get('keys').some(function (key) {
		if (keyCriteria.modes) {
			var root = keyCriteria.root || '';
			return keyCriteria.modes.some(function (mode) {
				return key.indexOf(root + mode) > -1;
			});
		} else {
			return key.indexOf(keyCriteria.root) === 0;
		}
	}) ? 1 : 0;
}

var scoreForRhythm = function (model, rhythmCriteria) {
	if (!rhythmCriteria) {
		return 1;
	}
	return model.get('rhythms').some(function (rhythm) {
		return rhythmCriteria.rhythm.toLowerCase() === rhythm.toLowerCase();
	}) ? 1 : 0;
}

var getSubjects = function (tune) {
	return [tune];
}

export default function (term) {
	this.allItems = opts.items;
	this.criteria = analyzeTerm(ev.delegateTarget.value);
	this.limit = opts.limit || 20;
	if (this.criteria.term.length < 3 && !this.criteria.key && !this.criteria.rhythm)  {
		this.trigger('invalid');
	} else {

		if (this.criteria.key || this.criteria.rhythm) {
			items = items.filter(function (item) {
				var key = this.criteria.key;
				var rhythm = this.criteria.rhythm;
				item.subjects = item.subjects.filter(function (model) {
					return scoreForKey(model, key) * scoreForRhythm(model, rhythm);
				});
				return !!item.subjects.length;
			});
		}

		var hash = {};
		var self = this;
		if (this.criteria.term.length > 2) {
			items.forEach(this.scoreItem)

			items = items
				.filter(function (item) {
					item.score = liquidMetal.score(item[opts.field], this.criteria.term) > 0
					return item.score > 0;
				})
				.sort(function(item1, item2) {
					return item1.score === item2.score ? 0 : item1.score > item2.score ? -1: 1
				});
		}

		if (this.limit > 0) {
			items = items.slice(0, this.limit);
		}
	}

	return items;
}