SRCS = $(wildcard *.ts)
JS = $(SRCS:.ts=.js)
JSMI = $(JS:.js=.min.js)

all: $(JSMI)

$(JS):
	tsc *.ts

%.min.js: %.js
	uglifyjs $< > $@
	rm $<
	mv $@ js/

clean:
	rm -f *.js *.min.js js/*

.PHONY: all clean
