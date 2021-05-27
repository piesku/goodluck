# See https://developers.google.com/speed/webp/download.
# On Ubuntu, install the `webp` package.

PNGS := $(wildcard *.png)
JPGS := $(wildcard *.jpg)
WEBPS := $(PNGS:%=%.webp) $(JPGS:%=%.webp)

all: $(WEBPS)

%.png.webp: %.png
	@echo "$< → $@"
	@cwebp -short -z 9 $< -o $@

%.jpg.webp: %.jpg
	@echo "$< → $@"
	@cwebp -short $< -o $@
