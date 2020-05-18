EXAMPLE ?= src

all: game.terser.js
	@printf "Size gzipped: %s bytes\n" \
		$(shell gzip index.html game.terser.js --stdout | wc -c)

../$(EXAMPLE)/index.js: $(shell find .. -name "*.ts")
	@echo -n "Compiling project... "
	@npx tsc
	@echo "Done"

game.rollup.js: ../$(EXAMPLE)/index.js
	@echo -n "Bundling files into one... "
	@npx rollup --format iife $< --silent > $@
	@echo "Done"

game.sed.js: game.rollup.js
	@echo -n "Running replacements... "
	@sed  -f sed.txt  $< > $@
	@echo "Done"

game.terser.js: game.sed.js
	@echo "Minifying... "
	@npx --quiet terser $< \
		--timings \
		--ecma 9 \
		--mangle toplevel \
		--mangle-props keep_quoted,regex=/^[A-Z]/ \
		--compress $(shell paste -sd, terser_compress.txt) \
	> $@
