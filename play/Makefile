EXAMPLE ?= src

all: index.html
	@printf "Size gzipped: %s bytes\n" $(shell gzip index.html --stdout | wc -c)

../$(EXAMPLE)/index.js: $(shell find .. -type f -name "*.ts")
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
		--define DEBUG=false \
		--timings \
		--ecma 9 \
		--mangle toplevel \
		--mangle-props keep_quoted,regex=/^[A-Z]/ \
		--compress $(shell paste -sd, terser_compress.txt) \
	> $@

index.html: game.html game.terser.js
	@node posthtml.cjs $< > $@

# On Ubuntu, install p7zip-full. See https://www.7-zip.org/download.html.
index.zip: index.html
	@7z a -mx=9 -mfb=256 -mpass=15 $@ $<
