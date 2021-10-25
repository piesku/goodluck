EXAMPLE ?= src
SOURCES := $(shell find .. -type f -name "*.ts")

all: index.html ../$(EXAMPLE)/index.js
	@printf "Size gzipped: %s bytes\n" $(shell gzip index.html --stdout | wc -c)

../$(EXAMPLE)/index.js: $(SOURCES)
	@echo -n "Type-checking... "
	@npx tsc --noEmit
	@echo "done."

game.esbuild.js: $(SOURCES)
	@echo "Compiling and bundling..."
	@npx esbuild ../$(EXAMPLE)/index.ts --bundle --define:DEBUG=false --analyze > $@

game.sed.js: game.esbuild.js
	@echo "Running replacements..."
	@sed  -f sed.txt  $< > $@

game.terser.js: game.sed.js
	@echo "Minifying..."
	@npx --quiet terser $< \
		--timings \
		--ecma 9 \
		--mangle toplevel \
		--mangle-props keep_quoted,regex=/^[A-Z]/ \
		--compress $(shell paste -sd, terser_compress.txt) \
	> $@

index.html: game.html game.terser.js
	@echo "Inlining..."
	@node posthtml.cjs $< > $@

# On Ubuntu, install p7zip-full. See https://www.7-zip.org/download.html.
index.zip: index.html
	@7z a -mx=9 -mfb=256 -mpass=15 $@ $<

.PHONY: clean
clean:
	@rm -f *.js index.html index.zip
