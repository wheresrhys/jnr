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
	markoc ./webapp/components
	find ./webapp -type f -iname '*.marko' | grep -v layout | sed s/'webapp\/'// | awk '{print "exports['\''"$$1"'\'']\ =\ require('\''"$$1".js'\'');"}' > webapp/_template-map.js
	webpack

watch: build
	webpack --watch







