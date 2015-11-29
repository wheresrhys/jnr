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
	source ./.env; nodemon -e js,html server

build:
	node-sass webapp/main.scss -o webapp
	# nunjucks-precompile webapp > webapp/templates.js

watch: build







