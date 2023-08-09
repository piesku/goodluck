all: map_platforms.ts

%.ts: %.tmj
	node ../../tools/tiled_tmj2map.cjs $< > $@
