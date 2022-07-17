TARGETS := $(wildcard *.ts)

all: $(TARGETS)

%.ts: ../assets/%.gltf
	@echo "$< → $@"
	@cat $< | node gltf2mesh.cjs $* > $@
	@npx prettier --loglevel=silent --write $@
