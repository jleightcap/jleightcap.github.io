SRCS := $(wildcard *.md)
HTML := $(SRCS:.md=.html)
CSS  := latex.css

# Blog configuration
BLOGSRCS := $(wildcard Blog/*.md)
BLOGHTML := $(BLOGSRCS:.md=.html)
BLOGCSS := ../$(CSS)

# Project configuration
PROJSRCS := $(wildcard Project/*.md)
PROJHTML := $(PROJSRCS:.md=.html)
PROJCSS := ../$(CSS)

# SSH
USR := jleightc
HST := gateway.coe.neu.edu
DST := ~/www

all: $(HTML) $(BLOGHTML) $(PROJHTML)

upload: all
	rsync -r . $(USR)@$(HST):$(DST)

%.html: %.md
	pandoc -s -c $(CSS) -o $@ $^

Blog/%.html: Blog/%.md
	pandoc -s -c $(BLOGCSS) -o $@ $^

Project/%.html: Project/%.md
	pandoc -s -c $(PROJCSS) -o $@ $^

clean:
	rm *.html Blog/*.html Project/*.html
