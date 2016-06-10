.PHONY: test mongo-export

install:
	npm install --no-spin --no-progress
	rm -rf abcjs 2>/dev/null
	git clone -b master --depth=1 --single-branch https://github.com/paulrosen/abcjs.git abcjs

mongo-export:
	bash scripts/mongo-export.sh

import:
	node scripts/convert-mongo-to-couch

mongo-import: mongo-export import

run:
	source ./.env; nodemon -e js,html server -w webapp -w server

run2:
	source ./.env; node server

build:
	webpack
	node-sass webapp/main.scss -o public
	cp abcjs/bin/abcjs_basic_2.3-min.js public/abc.js
	cp webapp/favicon.ico public/favicon.ico
	cp -r webapp/img public/img

watch:
	node-sass webapp/main.scss -o public -w webapp
	webpack --watch

build-prod:
	mkdir public 2>/dev/null
	nunjucks-precompile ./webapp > ./public/templates.js
	export PRODUCTION_BUILD=true; webpack;
	node-sass webapp/main.scss -o public
	cp abcjs/bin/abcjs_basic_2.3-min.js public/abc.js
	cp webapp/favicon.ico public/favicon.ico
	cp -r webapp/img public/img

deploy:
	# Package+deploy
	@haikro build
	@haikro deploy --app jnr3 --commit `git rev-parse HEAD`