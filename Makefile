SRCS = $(wildcard *.md) $(wildcard Blog/*/*.md) $(wildcard Project/*/*.md)
HTML = $(SRCS:.md=.html)
BASECSS = style.css
POSTCSS  = ..\/..\/$(BASECSS)

# SSH
USR := jleightc
HST := gateway.coe.neu.edu
DST := ~/www

all: $(HTML) css_prefix

upload: all
	rsync -r . $(USR)@$(HST):$(DST)

%.html: %.md
	cmark -t html --unsafe $^ > $@

# insert CSS header
css_prefix: $(HTML)
	sed -i "1s/^/<link rel=\"stylesheet\" type=\"text\/css\" href=\"$(BASECSS)\" media=\"screen\" \/>\n\n/" *.html
	sed -i "1s/^/<link rel=\"stylesheet\" type=\"text\/css\" href=\"$(POSTCSS)\" media=\"screen\" \/>\n\n/" Blog/*/*.html Project/*/*.html

clean:
	rm -f *.html Blog/*/*.html Project/*/*.html
