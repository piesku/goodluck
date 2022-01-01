EXAMPLE ?= src
SOURCES := $(shell find .. -type f -name "*.ts")

all: index.html
	@printf "Size gzipped: %s bytes\n" $(shell gzip index.html --stdout | wc -c)

game.esbuild.js: $(SOURCES)
# Remove --noEmit to emit *.js files next to the source *.ts files. index.ts
# will then import the emitted *.js files. This may produce a smaller build
# because the bundle will be ordered differently.
	npx tsc --noEmit
	npx esbuild ../$(EXAMPLE)/index.ts \
		--preserve-symlinks \
		--define:DEBUG=false \
		--target=es2020 \
		--bundle \
		--analyze \
	> $@

game.sed.js: game.esbuild.js sed.txt
	sed  -f sed.txt  $< > $@

game.terser.js: game.sed.js terser_compress.txt
	npx --quiet terser $< \
		--ecma 9 \
		--mangle toplevel \
		--mangle-props keep_quoted,regex=/^[A-Z]/ \
		--compress $(shell paste -sd, terser_compress.txt) \
	> $@

index.html: game.html game.terser.js game.css debug.css posthtml.cjs
	node posthtml.cjs $< > $@

# On Ubuntu, install p7zip-full. See https://www.7-zip.org/download.html.
index.zip: index.html
	7z a -mx=9 -mfb=256 -mpass=15 $@ $<

.PHONY: clean
clean:
	rm -f *.js index.html index.zip
