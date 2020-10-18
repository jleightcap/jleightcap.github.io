---
title: Classical Music on YouTube
date: May 24, 2019
author: <a href="../../index.html">Jack Leightcap</a>
---

## Background
From November 2017 to April 2020, I ran a YouTube channel called *jleightcap*.
The channel posted a genre of videos I call *scrolling score*, where a recording
of a piece of classical music is synced to the score.
Here is an example for [Stockhausen's *Kontakte*](https://youtu.be/l_UHaulsw3M)
that I made.

At its peak, I had over 15 thousand subscribers, a handful of years of
watchtime, and amassed an extremely kind group of viewers and friends.

Throughout March and early April, the channel received a total of 4 copyright strikes,
resulting in the deletion of the channel in mid-April 2020.

## Copyright of Classical Music
In general, these types of videos are allowed to exist because of the kindness
(or apathy) of sheet music publishers.
Record labels have automated claims that catch about 99% of videos and
place ads, so I assume they are slightly more welcome to this type of video
because of additional income potential (of
course with plenty of major exceptions).
This also means that every comment complaining about how there is an ad in the
middle of a movement is equally frustrating to the video creator (and entirely
out of their control).

For a lot of the videos I produced, I *personally* think it's ridiculous the
sheet music isn't in public domain, but *legally* they just aren't.

So, when a sheet music publisher removes all of their intellectual property from
my YouTube channel (even if written a century ago), YouTube places a strike on
my channel.
With 4 of these in an extremely short window, my channel was unrecoverable.

>If you want a good example of just how bent copyright law can be,
>Shostakovich's music was
>[*removed* from the public domain](https://www.wqxr.org/story/182225-prokofiev-and-shostakovich-public-domain-no-more/)
>in 2012, with some recently entering *back* into public domain!

However, I do think it's important to consider that there is already a small
market to support living composers, and "freely distributing" (although in
video format) sheet music does dig into that market.
Personally, I think that exposing a wider audience to classical music as a whole
is a net positive for the industry, but that is just my opinion and not a fact.
My general rule of thumb has been not to upload pieces by living composers.

In general, if you're interested in making this type of video, for your own
sake, <u>use mostly pieces written before 1900</u>.
For me, this just isn't where my interests lie, and the deletion of my channel
could be considered only inevitable.

If you're curious about specific publishers or record labels, there is a
Facebook group dedicated to making scrolling score videos filled with very kind,
helpful people.
I started this group, but have since deleted my Facebook account.
Feel free to reach out to an active member of this community for details.

## Aftermath
I don't plan on making scrolling score videos at the same frequency or magnitude
that I had been.
I've heard that others have archived my videos, and I consider these to be
'public domain'.
Feel free to reupload entirely at your own risk, with or without credit.

My current plans are to continue engraving scores in `lilypond`, and post those
to my personal YouTube channel
[Jack Leightcap](https://www.youtube.com/channel/UCWt1oAwvbU7EQHWlUE9AvsA).
I'd also like to focus on more "gigantic" pieces without worrying
about posting often.

## Video Production
A frequent question was how I made videos.
I developed a tool,
[ScrollingScore](https://github.com/jleightcap/ScrollingScore), which attempted
to automate some of the more tedious image processing aspects of scrolling score video
production.

### Finding or Producing Sheet Music
This ranges from simply downloading public domain sheet music from the
[International Music Score Library Project](https://imslp.org/wiki/Main_Page),
to engraving the score myself in `lilypond` like with [Feldman's *Piano and String
Quartet*](https://youtu.be/TUAxrFQXuO4)
(the source can be found [here](https://github.com/jleightcap/Feldman-PianoStringQuartet))
or using inter-library loans and scanning the score myself.
I had a lot of fun tracking down music this way.

There are websites that host scans of non-public domain sheet music that I
will not mention out of fear of their takedown.

### Obtaining Audio
Can again range from finding the public domain recording on YouTube, to tracking
down a record on eBay and converting it yourself.

This again toes the line of piracy, which for the same reason I won't get into.

### Sheet Music Preparation
This is the point where `ScrollingScore` was intended to be useful.
Sheet music preparation includes:

- Straightening images (usually scans will skew each page by rotation/warping)
- Placing pages side-by-side (this is a personal preference): if the aspect
  ratio of two consecutive pages are both very tall, then I found it to look
  nicer to place them next to one another on one slide.
  See the `ScrollingScore` repo for more information.
- Padding images so that there is a reasonable amount of whitespace at each edge
- Cluster removal: remove artifacts from scanning or blotches on the pages
  themselves.
  This can range from removing unnecessary markings like page headers and footers, to a terrible scan that requires extensive cleaning.

A more powerful tool I'd recommend is
[CMaj7's *sproc*](https://github.com/edwardx999/ScoreProcessor).
Fun fact: I won't get into the details, but meeting CMaj7 was one of the
craziest coincidences in my life.
I guess similar interests lead to similar places.

### Audio Synchronization
This is the point where the video is actually assembled.
A frequent question was what video editor I used (the answer is
[Shotcut](https://www.shotcut.org/)), but generally scrolling score videos are
glorified slideshows and almost any video editor will be adequate.
Of course there are exceptions like Crumb's *Makrokosmos* where the graphic score
actually "rotates", but graphic scores like this are very much an exception.

At this point actually being familiar with reading music is required (although
from what I've heard from people, the barrier of entry is technological, not
musical).
For 'traditional scores' (have a time signature, key, aren't extremely
complicated), this is usually a two-pass system with one pass for syncing and
one for verifying.

For scores that don't have some or all of those traditional qualities, syncing
the audio and score can take as much as thirty times as long as the recording
(notable examples from my experience: Ligeti's *String Quartet no. 2*, Crumb's
*Makrokosmos*, Schnittke's *Symphony no. 1*).
In some rare instances, syncing can actually be *impossible* or
*nondeterministic!* (although this is
the result of some pretty avant-garde notation, like different instruments being
on different pages at the same time or 'free' notation where there is no clear
'breakpoint' between sections).
