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
	markoc ./webapp/pages
	find ./webapp/pages -type f -iname '*.marko' | sed s/'webapp\/'// | awk '{print "exports['\''"$1"'\'']\ =\ require('\''"$1"'\'');"}' > webapp/_marko.compiled-pages.js
	markoc ./webapp/components
	find ./webapp/components -type f -iname '*.marko' | sed s/'webapp\/'// | awk '{print "exports['\''"$1"'\'']\ =\ require('\''"$1"'\'');"}' > webapp/_marko.compiled-components.js
	webpack --watch


