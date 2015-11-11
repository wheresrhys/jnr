.PHONY: test

install:
	npm install
	jspm install

mongo-export:
	bash scripts/mongo-export.sh

import:
	node scripts/convert-mongo-to-couch

mongo-import: mongo-export import

run:
	nodemon --verbose server/app.js
