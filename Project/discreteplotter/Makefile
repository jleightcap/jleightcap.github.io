SRCS = $(wildcard *.ts)
JS = $(SRCS:.ts=.js)
JSMI = $(JS:.js=.min.js)

all: $(JSMI)

%.js: %.ts
	tsc $< ||:

%.min.js: %.js
	uglifyjs $< > $@
	rm $<

clean:
	rm -f *.js *.min.js js/*

.PHONY: all clean
