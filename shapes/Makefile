SHAPES_BLEND := $(wildcard *.blend)
SHAPES_OBJ := $(SHAPES_BLEND:%.blend=%.obj)
SHAPES_TS := $(SHAPES_BLEND:%.blend=../src/shapes/%.ts)

all: $(SHAPES_TS)

%.obj: %.blend
	@echo "$< → $@"
	@/c/Program\ Files/Blender\ Foundation/Blender/blender.exe \
		"$(shell wslpath -w $<)" \
		--background \
		--python "$(shell wslpath -w blend2obj.py)" \
		-- \
		"$(shell wslpath -w $@)" \
		1> /dev/null

../src/shapes/%.ts: %.obj
	@echo "$< → $@"
	@node asset2shape "$(shell wslpath -w $(CURDIR)/$<)" > $@
