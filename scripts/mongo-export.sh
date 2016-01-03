for collection in {arrangements,dodgyPractices,dodgyTunes,oldperformances,oldsets,oldtunes,pieces,sets,tunes,users}; do
	echo $collection;
	mongoexport -h ds057000.mongolab.com:57000 -d heroku_app18207259 -u heroku_app18207259 -p ${MONGO_PASSWORD} -o mongo-export/${collection}.json --jsonArray -c ${collection}
done;
unset collection;