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
	# nunjucks-precompile webapp > webapp/templates.js

watch:
	node-sass webapp/main.scss -o public -w webapp
	webpack --watch






