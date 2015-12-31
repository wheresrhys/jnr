import {db} from '../index';

export function practice (tuneId, repertoireIndex, urgency) {

	return db.get(tuneId)
		.then(tune => {
			const practices = tune.repertoire[repertoireIndex].practices;

			practices.unshift({
				date: new Date().toISOString(),
				urgency: urgency
			});
			if (practices.length > 5) {
				practices.pop();
			}
			db.put(tune);
		});

}