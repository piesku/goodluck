SOURCES = $(shell find src -name "*.ts")

all: public/opt/game.terser.js
	@printf "Size gzipped: %s bytes\n" \
		$(shell gzip public/opt/index.html public/opt/game.terser.js --stdout | wc -c)

public/js/index.js: $(SOURCES)
	@echo -n "Compiling project... "
	@npx tsc
	@echo "Done"

public/opt/game.rollup.js: public/js/index.js
	@echo -n "Bundling files into one... "
	@npx rollup -c bundle_config.js --silent
	@echo "Done"

public/opt/game.sed.js: public/opt/game.rollup.js
	@echo -n "Running replacements... "
	@sed  -f sed.txt  $< > $@
	@echo "Done"

public/opt/game.tr.js: public/opt/game.sed.js
	@echo -n "Stripping newlines... "
	@cat $< | tr -d "\n" > $@
	@echo "Done"

public/opt/game.terser.js: public/opt/game.tr.js
	@echo "Minifying... "
	@npx --quiet terser $< \
		--timings \
		--ecma 9 \
		--mangle toplevel \
		--mangle-props regex=/^[A-Z]/ \
		--compress $(shell paste -sd, terser_compress.txt) \
	> $@
