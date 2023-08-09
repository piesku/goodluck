# See https://developers.google.com/speed/webp/download.
# On Ubuntu, install the `webp` package.

SPRITES := $(shell node ../../tools/tiled_tile_names.cjs atlas.tsj)

all: atlas.png.webp atlas.ts

atlas.png: atlas.tsj $(SPRITES)
	convert $(SPRITES) -background none -append $@

%.png.webp: %.png
	cwebp -short -z 9 $< -o $@

atlas.ts: atlas.tsj
	node ../../tools/tiled_atlas_desc.cjs $< > $@
