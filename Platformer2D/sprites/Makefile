# See https://developers.google.com/speed/webp/download.
# On Ubuntu, install the `webp` package.

TOOLS := ../../tools
SPRITES := $(shell node $(TOOLS)/atlas_tile_names.cjs atlas.tsj)

all: atlas.png.webp atlas.ts

atlas.png: atlas.tsj $(SPRITES)
	convert $(SPRITES) -background none -append $@

%.png.webp: %.png
	cwebp -short -z 9 $< -o $@

atlas.ts: atlas.tsj
	node $(TOOLS)/atlas_desc.cjs $< > $@
