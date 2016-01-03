import {getSetCollection} from './controller';
import {init as initPracticers} from '../../components/practicer/enhancement';
import {init as initSets} from '../../components/set/enhancement';
import co from 'co';


function getContainer (el) {
	while (el.nodeName.toUpperCase() !== 'LI') {
		el = el.parentNode;
	}
	return el;
}

function getTuneId (el) {
	while (!el.dataset.tuneId) {
		el = el.parentNode;
	}
	return el.dataset.tuneId;
}

export default function (del) {
	initPracticers(del);
	initSets(del);
}