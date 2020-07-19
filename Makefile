SRCS := $(wildcard *.md) $(wildcard Blog/*/*.md) $(wildcard Project/*/*.md)
HTML := $(SRCS:.md=.html)
CSS  := style.css

# Blog configuration
BLOGSRCS := $(wildcard Blog/*.md)
BLOGHTML := $(BLOGSRCS:.md=.html)
BLOGCSS := ..\/$(CSS)

# Project configuration
PROJSRCS := $(wildcard Project/*.md)
PROJHTML := $(PROJSRCS:.md=.html)
PROJCSS := ..\/$(CSS)

# SSH
USR := jleightc
HST := gateway.coe.neu.edu
DST := ~/www

all: $(HTML)

upload: all
	rsync -r . $(USR)@$(HST):$(DST)

%.html: %.md
	cmark -t html --unsafe $^ > $@
	sed -i "1s/^/<link rel=\"stylesheet\" type=\"text\/css\" href=\"$(CSS)\" media=\"screen\" \/>\n\n/" $@

clean:
	rm -f *.html Blog/*.html Project/*.html
