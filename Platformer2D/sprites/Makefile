# See https://developers.google.com/speed/webp/download.
# On Ubuntu, install the `webp` package.

SPRITES := $(shell node ../../util/tiled_tile_names.cjs atlas.tsj)
PADDED := $(SPRITES:%.png=%.pad.png)

all: atlas.png.webp atlas.ts

atlas.png: atlas.tsj $(PADDED)
	convert $(PADDED) -background None -append $@

%.png.webp: %.png
	cwebp -short -z 9 $< -o $@

atlas.ts: atlas.tsj
	node ../../util/tiled_tsj2atlas.cjs $< > $@

$(PADDED): %.pad.png: %.png
	convert $< -set option:distort:viewport "%[fx:w+2]x%[fx:h+2]"-1-1 -virtual-pixel Edge -filter point -distort SRT 0 +repage $@
