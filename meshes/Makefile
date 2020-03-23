OBJS := $(wildcard *.obj)
MESHES := $(OBJS:%.obj=%.ts)

all: $(MESHES)

%.ts: %.obj
	@echo "$< → $@"
	@node asset2mesh.cjs "$(shell wslpath -w $(CURDIR)/$<)" > $@
