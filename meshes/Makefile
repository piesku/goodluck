OBJS := $(wildcard *.obj)
MESHES := $(OBJS:%.obj=%.ts)

all: $(MESHES)

%.json: %.obj
	@echo "$< → $@"
	@docker run --rm -v $(CURDIR):/data piesku/assimp2json:latest /data/$< > $@

%.ts: %.json
	@echo "$< → $@"
	@cat $< | node json2mesh.cjs $* > $@
