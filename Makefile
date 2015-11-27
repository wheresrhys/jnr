.PHONY: test

install:
	npm install

mongo-export:
	bash scripts/mongo-export.sh

import:
	node scripts/convert-mongo-to-couch

mongo-import: mongo-export import

run:
	source ./.env; nodemon -e js,marko server

build:
	node-sass webapp/main.scss -o public
	nunjucks-precompile webapp > webapp/templates.js
	webpack

watch: build
	webpack --watch







