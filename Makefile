.PHONY: test mongo-export

install:
	npm install
	git clone -b master --depth=1 --single-branch https://github.com/paulrosen/abcjs.git abcjs

mongo-export:
	bash scripts/mongo-export.sh

import:
	node scripts/convert-mongo-to-couch

mongo-import: mongo-export import

run:
	source ./.env; nodemon -e js,html server

build:
	node-sass webapp/main.scss -o public
	webpack
	cp abcjs/bin/abcjs_basic_2.3-min.js public/abc.js

watch:
	node-sass webapp/main.scss -o public -w webapp
	webpack --watch

build-prod:
	nunjucks-precompile webapp > public/templates.js
	export PRODUCTION_BUILD=true; webpack;
	node-sass webapp/main.scss -o public
	cp abcjs/bin/abcjs_basic_2.3-min.js public/abc.js

