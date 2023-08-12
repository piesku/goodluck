all: map_platforms.ts

%.ts: %.tmj
	node ../../util/tiled_tmj2map.cjs $< > $@
