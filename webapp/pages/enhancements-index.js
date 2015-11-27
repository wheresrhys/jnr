import tunes from './tunes/enhancement';
import rehearse from './rehearse/enhancement';
import sets from './sets/enhancement';
import learn from './learn/enhancement';
import home from './home/enhancement';

const map = {
	tunes: tunes,
	sets: sets,
	rehearse: rehearse,
	learn: learn,
	home: home
};

export default function (e) {
	return map[e.controller](e);
}