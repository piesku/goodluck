SHAPES_BLEND := $(wildcard *.blend)
SHAPES_OBJ := $(SHAPES_BLEND:%.blend=%.obj)
SHAPES_TS := $(SHAPES_BLEND:%.blend=%.ts)

all: $(SHAPES_TS)

.PRECIOUS: %.obj
%.obj: %.blend
	@echo "$< → $@"
	@/c/Program\ Files/Blender\ Foundation/Blender/blender.exe \
		"$(shell wslpath -w $<)" \
		--background \
		--python "$(shell wslpath -w blend2obj.py)" \
		-- \
		"$(shell wslpath -w $@)" \
		1> /dev/null

%.ts: %.obj
	@echo "$< → $@"
	@node asset2mesh.cjs "$(shell wslpath -w $(CURDIR)/$<)" > $@
