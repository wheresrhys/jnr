.PHONY: test

install:
	npm install
	jspm install

mongo-export:
	bash scripts/mongo-export.sh

import:
	node scripts/convert-mongo-to-couch
	node scripts/create-indexes

mongo-import: mongo-export import

run:
	nodemon --verbose server/app.js

build:
	node-sass webapp/main.scss -o webapp/main.css
