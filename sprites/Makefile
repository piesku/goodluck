# See https://developers.google.com/speed/webp/download.
# On Ubuntu, install the `webp` package.

SPRITES := $(wildcard *.png)
SPRITES := $(filter-out spritesheet.png, $(SPRITES))

all: spritesheet.png.webp

spritesheet.png: $(SPRITES)
	node spritesmith.cjs $^ $@ > spritesheet.ts

%.png.webp: %.png
	cwebp -short -z 9 $< -o $@
