# See https://developers.google.com/speed/webp/download.
# On Ubuntu, install the `webp` package.

PNGS := $(wildcard *.png)
WEBPS := $(PNGS:%.png=%.webp)

all: $(WEBPS)

%.webp: %.png
	@echo "$< → $@"
	@cwebp -short -z 9 $< -o $@
