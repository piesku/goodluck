all: map_sample.ts

%.ts: %.json
	echo '// prettier-ignore\nexport const $* =' $$(cat $^) > $@
