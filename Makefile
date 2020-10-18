SRCS = $(wildcard *.md) $(wildcard Blog/*/*.md) $(wildcard Project/*/*.md)
HTML = $(SRCS:.md=.html)
BASECSS = style.css

# SSH
USR := jleightc
HST := gateway.coe.neu.edu
DST := ~/www

all: $(HTML)

upload: all
	rsync -r . $(USR)@$(HST):$(DST)

%.html: %.md
	pandoc -s -c $(BASECSS) $^ -o $@ --mathjax

clean:
	rm -f *.html Blog/*/*.html Project/*/*.html
