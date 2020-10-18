---
title: Replacing Spotify and Google Play Music on Linux
date: May 23, 2020
author: <a href="../../index.html">Jack Leightcap</a>
---

## Background
In the past I've used a combination of YouTube and Spotify to listen to music on
desktop.
I've used YouTube a lot for discovering new music, but there is a overhead of
streaming a video just for the audio, especially on slow quarantine WiFi.
There's also the case to be made to try to migrate as far away from Google
products as possible.

Spotify is much better just because it's a dedicated music platform,
however its tagging (especially for classical music) is genuinely terrible.
It's a toss up if the 'artist' is listed as the actual composer, the performer,
the ensemble, the conductor...
it's terrible and out of your control.

## Music Downloading
The best music downloading service that I've used, hands down, is
[`nicotine+`](https://nicotine-plus.github.io/nicotine-plus/).
It requires an account, and places some restrictions if you don't share a
directory, but the availability is second to none.

If one wanted to download music from YouTube, where there is
usually a precompiled playlist of a full album, the best tool would be
[`youtube-dl`](https://github.com/ytdl-org/youtube-dl).
I've also tinkered around with [`ytmdl`](https://github.com/deepjyoti30/ytmdl)
but found it to automate parts of the process that aren't particularly difficult
on their own (searching for playlists from the command line versus just in a
browser, for example).
To download an album:

```bash
youtube-dl -f 'bestaudio[ext=m4a]' [PLAYLIST URL]
```

## Music Tagging
For tagging, I've found [`eyeD3`](https://github.com/nicfit/eyed3) easy to use.
For an example of tagging music downloaded from a playlist,

```bash
eyeD3 --artist "[ARTIST]" *.mp3                     # Tag artist name
eyeD3 --album "[ALBUM]" *.mp3                       # Tag album title
eyeD3 --track 1 01.mp3                              # Tag track number
eyeD3 --title "First Song" 01.mp3                   # Tag track title
eyeD3 --add-image "cover.png:FRONT_COVER" *.mp3     # Tag album art
```

These tags are usually enough to sort through my music, but `eyeD3` supports
tagging all [ID3 metadata](https://en.wikipedia.org/wiki/ID3).

## Music Player
I've defaulted on [`cmus`](https://cmus.github.io/), mostly because of its ease of use
and vim-like keybindings.
[`ncmpcpp`](https://github.com/ncmpcpp/ncmpcpp) supports tagging natively, and definitely
has more potential for eye candy with embedded album art and audio
visualizations, but `cmus` gets the job done just fine (without messing with
daemons).
The only two commands you need to know:

```
:add [MUSIC DIRECTORY]
:update-cache
```

<center><img src="music-cmus.png" width="90%"></center>
No prizes for looks :)

## Integration
On my Android phone, I use [Musicolet](https://krosbits.in/musicolet/).
It's impressive that freeware like Musicolet can be more featureful than Google
Play Music, which I used previously.

In order to transfer music from a computer to an android phone,
[`android-file-transfer-linux`](https://github.com/whoozle/android-file-transfer-linux)
works great for a wired connection with the command line.
`rsync` is a fantastic tool for syncing files, which is handy not only new files but also deletions/changes.
The wireless solution I use uses `rsync` with `SSHelper` on Android:
```shell
rsync -tuavzz -e "ssh -p 2222" [LOCAL MUSIC DIRECTORY] admin@[PHONE IP]:/[PHONE MUSIC DIRECTORY]
```

Definitely not as fast as a wired solution but a lazy way to sync music in the background.

Finally, a module in `polybar` can be added easily with a small shell script,
found in the top comment of [this Reddit
thread](https://www.reddit.com/r/Polybar/comments/66m9vh/are_there_any_modules_for_mpv_or_cmus/).

<center><img src="music-polybar.png" width="90%"></center>
