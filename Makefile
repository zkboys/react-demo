TESTS = $(shell find test -type f -name "*.test.js")
TEST_TIMEOUT = 10000
MOCHA_REPORTER = spec
NPM_REGISTRY = ""


all: test

install:
	@npm install $(NPM_REGISTRY)

pretest:
	@if ! test -f config.js; then \
		cp config.default.js config.js; \
	fi
	@if ! test -d public/upload; then \
		mkdir public/upload; \
	fi

test: install pretest
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(MOCHA_REPORTER) \
		--harmony \
		-r should \
		-r test/env \
		--timeout $(TEST_TIMEOUT) \
		$(TESTS)

test-cov cov: install pretest
	@NODE_ENV=test node \
		--harmony \
		node_modules/.bin/istanbul cover --preserve-comments \
		./node_modules/.bin/_mocha \
		-- \
		-r should \
		-r test/env \
		--reporter $(MOCHA_REPORTER) \
		--harmony \
		--timeout $(TEST_TIMEOUT) \
		$(TESTS)


build:
	@npm run build

dev:
	@npm run dev

start:
	@npm run pro
