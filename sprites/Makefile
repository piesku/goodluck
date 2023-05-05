# See https://developers.google.com/speed/webp/download.
# On Ubuntu, install the `webp` package.

SPRITES := $(wildcard *.png)
SPRITES := $(filter-out spritesheet.png, $(SPRITES))

all: spritesheet.png.webp

spritesheet.png: $(SPRITES) node_modules
	node spritesmith.cjs $(SPRITES) $@ > spritesheet.ts

%.png.webp: %.png
	cwebp -short -z 9 $< -o $@

node_modules:
	npm install
