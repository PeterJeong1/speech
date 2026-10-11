/* KEYHOLE soundtrack - music and background sound for every room, all of it made in the browser.
   There are no audio files: nothing to download, nothing to license. engine.js loads this file by itself.

   Which soundscape a room gets:
     1. ER.init({sound: 'name'})  or  ({sound: ['name', {options}]})        (sound: false = none)
     2. else the entry for "theme/story/room" in ROOMS below
     3. else its theme's default in THEME
   Options: root (MIDI note of the key), bpm, scale, mood ('tense' from the start), drop (kinds of voice to leave out),
   level (1 = as loud as the scape is made; every scape is set to the same average loudness), then (only a note of
   what the room changes to later, for the tests and the listening page), beds ([[name, level], ...] from BEDS: wind sea rain hum crowd static night birds drips fire).

   From a room:   ER.mood('tense')  /  ER.mood('calm')      when the story tightens or lets go.
   By itself the engine starts the music when the title card is left, lowers it while something is being read,
   plays the "solved" phrase in the room's key when the door opens, a small one when a clue is filed, and fades
   everything out as the room is left. The speaker button has three settings: all, effects only, off.

   Music must never sound like a clue. Where the player listens for something (a bell, a clock, a hiss),
   the room's scape keeps clear of that sound: that is why several rooms drop a voice in ROOMS. */
(function () {
'use strict';
var ER = window.ER; if (!ER || ER.track) return;

var MAJ = [0, 2, 4, 5, 7, 9, 11], MIN = [0, 2, 3, 5, 7, 8, 10], DOR = [0, 2, 3, 5, 7, 9, 10], PHR = [0, 1, 3, 5, 7, 8, 10], LYD = [0, 2, 4, 6, 7, 9, 11];
var MUSIC = 0.42;     /* the level of all music against the sound effects: about as loud as the rain, well under a click or a bell */

/* Instruments. w: oscillators [type, detune in cents, semitones up, level]; lp: filter; env: seconds for the filter to close;
   a + d: struck (attack, decay)   or   a + r: held (attack, release); g: loudness; wet: how much goes to the reverb; vib: [Hz, cents] */
var INST = {
  pad:   { w: [['sawtooth', -9], ['sawtooth', 8], ['triangle', 0, 0, 0.8]], lp: 620, q: 0.4, a: 1.9, r: 3.2, g: 0.03, wet: 0.7 },
  glass: { w: [['sine', -4], ['sine', 5], ['triangle', 0, 12, 0.14]], lp: 2400, a: 1.4, r: 3.4, g: 0.034, wet: 0.85 },
  keys:  { w: [['triangle', 0], ['sine', 0, 12, 0.32], ['sine', 3, 0, 0.5]], lp: 2100, env: 0.12, a: 0.008, d: 2.3, g: 0.15, wet: 0.5 },
  harp:  { w: [['triangle', 0], ['sawtooth', 0, 0, 0.16]], lp: 2300, env: 0.2, a: 0.004, d: 1.35, g: 0.13, wet: 0.55 },
  ping:  { w: [['sine', 0], ['sine', 0, 19, 0.12]], lp: 6000, a: 0.006, d: 1.9, g: 0.07, wet: 0.9 },
  bass:  { w: [['sine', 0], ['triangle', 0, 0, 0.45], ['sine', 0, 12, 0.2]], lp: 520, a: 0.03, d: 2.1, g: 0.2, wet: 0.08 },
  pulse: { w: [['sawtooth', 0], ['square', 0, 0, 0.3]], lp: 560, q: 2, env: 0.1, a: 0.004, d: 0.19, g: 0.1, wet: 0.2 },
  reed:  { w: [['sawtooth', -7], ['sawtooth', 7], ['square', 0, 0, 0.2]], lp: 1350, a: 0.07, r: 0.28, g: 0.036, wet: 0.35, vib: [5.1, 7] },
  pizz:  { w: [['triangle', 0], ['square', 0, 0, 0.1]], lp: 1700, env: 0.07, a: 0.003, d: 0.34, g: 0.15, wet: 0.3 },
  vibes: { w: [['sine', 0], ['sine', 0, 24, 0.16]], lp: 5200, a: 0.004, d: 1.7, g: 0.12, wet: 0.5 }
};

/* Soundscapes. bpm, beats in a bar, root (MIDI), scale, prog: [[scale degree of the chord, bars], ...], lead: instrument of the
   "solved" phrase. Voices (k = kind):
     pad    chord held for as long as it lasts            bass   root on the first beat (alt: and the fifth half way)
     arp    p: chord tone (0 1 2, 3 = root above) for each half-beat of the bar, or null
     hit    p: 1 where the whole chord is plucked         ost    p: scale steps above the chord's root, or null: a figure that repeats
     mel    a short tune now and then: every N bars, len bars long, pr = how often, c = how high (scale degree)
     tick   a clock                                       heart  two low thumps at the start of each bar
   o: octaves up or down, v: loudness, when: only in this mood ('calm' or 'tense')
   No ready-made scape uses tick or heart: a clock or a knock in the music could be taken for something in the room.
   A room that really wants one can pass its own voices: sound: ['wire', {voices: [...]}]. */
var SCAPES = {
  /* mystery: a wet night, a lamp, somebody thinking */
  noir: { level: 0.75, bpm: 56, root: 50, scale: MIN, prog: [[0, 2], [5, 2], [3, 2], [4, 2]], lead: 'keys', voices: [
    { k: 'pad', i: 'pad' }, { k: 'bass', i: 'bass', o: -1 },
    { k: 'mel', i: 'keys', o: 1, c: 3, every: 4, len: 2, pr: 0.8 },
    { k: 'ost', i: 'pulse', o: -1, p: [0, null, 0, null, 0, null, 0, 4], when: 'tense' }] },
  /* a village show in the sun: nothing here is dangerous, and everybody is slightly ridiculous */
  village: { bpm: 104, root: 48, scale: MAJ, prog: [[0, 1], [3, 1], [4, 1], [0, 1]], lead: 'vibes', sting: 'fanfare', level: 1.12, voices: [
    { k: 'bass', i: 'pizz', o: -1, alt: true, v: 1.2 }, { k: 'hit', i: 'pizz', p: [0, 0, 1, 0, 0, 0, 1, 0], v: 0.55 },
    { k: 'mel', i: 'vibes', o: 1, c: 4, every: 2, len: 1, pr: 0.7, cells: [[2, 2, 2, 2], [2, 1, 1, 4], [4, 2, 2], [1, 1, 2, 2, 2]] },
    { k: 'pad', i: 'glass', v: 0.5 }] },
  /* the morning after: for last rooms */
  morning: { level: 0.59, bpm: 72, root: 55, scale: MAJ, prog: [[0, 2], [3, 2], [5, 2], [4, 2]], lead: 'keys', voices: [
    { k: 'pad', i: 'glass' }, { k: 'bass', i: 'bass', o: -1, v: 0.8 },
    { k: 'arp', i: 'keys', p: [0, null, 1, null, 2, null, 1, null], v: 0.6, pr: 0.92 },
    { k: 'mel', i: 'keys', o: 1, c: 4, every: 4, len: 2, pr: 0.8 }] },
  /* sci-fi: a small warm station and a great deal of nothing outside */
  orbit: { level: 0.91, bpm: 48, root: 50, scale: LYD, prog: [[0, 4], [1, 4]], lead: 'ping', voices: [
    { k: 'pad', i: 'glass' }, { k: 'pad', i: 'pad', o: -1, v: 0.6 },
    { k: 'mel', i: 'ping', o: 2, c: 4, every: 2, len: 1, pr: 0.65, cells: [[4, 4], [8], [3, 5], [2, 6]] },
    { k: 'ost', i: 'pulse', o: -1, p: [0, null, null, 4, 0, null, null, null], when: 'tense' }] },
  /* fantasy: candles, old books, a harp somewhere */
  candle: { bpm: 66, root: 50, scale: DOR, prog: [[0, 2], [3, 2], [6, 2], [0, 2]], lead: 'harp', sting: 'run', voices: [
    { k: 'pad', i: 'pad', v: 0.8 }, { k: 'bass', i: 'bass', o: -1, v: 0.7 },
    { k: 'arp', i: 'harp', o: 1, p: [0, null, 1, 2, null, 3, 2, 1], pr: 0.9 },
    { k: 'mel', i: 'ping', o: 2, c: 4, every: 4, len: 1, pr: 0.5, cells: [[4, 4], [8], [2, 6]] }] },
  /* ghost: an old hotel after bedtime. A slow lullaby in three, and nothing that sounds like a bell */
  hush: { level: 0.76, bpm: 54, beats: 3, root: 45, scale: MIN, prog: [[0, 2], [3, 2], [5, 2], [4, 2]], lead: 'keys', sting: 'soft', voices: [
    { k: 'pad', i: 'glass', o: 1, v: 0.9 }, { k: 'bass', i: 'bass', v: 0.6 },
    { k: 'mel', i: 'keys', o: 2, c: 2, every: 4, len: 2, pr: 0.8 }] },
  /* adventure: a night train. A waltz, because the wheels are in three */
  nighttrain: { level: 0.93, bpm: 108, beats: 3, root: 43, scale: MAJ, prog: [[0, 2], [5, 2], [3, 2], [4, 2]], lead: 'vibes', sting: 'fanfare', voices: [
    { k: 'bass', i: 'bass', v: 0.8 }, { k: 'hit', i: 'pizz', o: 1, p: [0, 0, 1, 0, 1, 0], v: 0.5 },
    { k: 'mel', i: 'reed', o: 2, c: 3, every: 4, len: 2, pr: 0.75 }, { k: 'pad', i: 'glass', o: 1, v: 0.45 }] },
  /* cipher: a clock is running and somebody is ahead of you */
  wire: { level: 0.84, bpm: 92, root: 40, scale: PHR, prog: [[0, 4], [1, 2], [0, 2]], lead: 'keys', voices: [
    { k: 'pad', i: 'pad', o: 1 }, { k: 'bass', i: 'bass', v: 0.8 },
    { k: 'ost', i: 'pulse', o: 1, p: [0, null, null, null, 0, null, 0, null], v: 0.7, when: 'calm' },
    { k: 'ost', i: 'pulse', o: 1, p: [0, 0, 7, 0, 0, 0, 7, 4], when: 'tense' },
    { k: 'mel', i: 'keys', o: 2, c: 4, every: 4, len: 2, pr: 0.6, cells: [[4, 4], [2, 6], [8], [3, 1, 4]] }] },
  /* a television studio before the red light: bright, quick, and too pleased with itself */
  studio: { bpm: 116, root: 48, scale: MAJ, prog: [[0, 1], [5, 1], [3, 1], [4, 1]], lead: 'vibes', sting: 'fanfare', level: 1.16, voices: [
    { k: 'bass', i: 'pizz', o: -1, alt: true, v: 1.2 }, { k: 'hit', i: 'pizz', p: [0, 0, 1, 0, 0, 1, 0, 0], v: 0.5 },
    { k: 'arp', i: 'vibes', o: 1, p: [0, null, 2, 1, null, 3, null, 2], pr: 0.85, v: 0.8 },
    { k: 'ost', i: 'pulse', p: [0, 0, 0, 0, 0, 0, 0, 0], v: 0.6, when: 'tense' }, { k: 'pad', i: 'glass', v: 0.4 }] },
  /* an empty school at night */
  corridor: { level: 0.73, bpm: 60, root: 47, scale: MIN, prog: [[0, 2], [5, 2], [3, 2], [4, 2]], lead: 'keys', voices: [
    { k: 'pad', i: 'glass' }, { k: 'bass', i: 'bass', o: -1, v: 0.7 },
    { k: 'mel', i: 'keys', o: 1, c: 4, every: 4, len: 2, pr: 0.7 },
    { k: 'ost', i: 'pulse', p: [0, null, null, 0, null, null, 0, null], v: 0.8, when: 'tense' }] },
  /* a newspaper at night, with a deadline */
  press: { level: 0.77, bpm: 100, root: 50, scale: MIN, prog: [[0, 2], [6, 2], [5, 2], [4, 2]], lead: 'keys', voices: [
    { k: 'pad', i: 'pad' }, { k: 'bass', i: 'bass', o: -1 },
    { k: 'ost', i: 'pulse', p: [0, null, 0, 0, null, 0, null, 2], v: 0.75 }, { k: 'ost', i: 'pulse', o: 1, p: [null, 4, null, null, 4, null, 7, null], v: 0.6, when: 'tense' },
    { k: 'mel', i: 'keys', o: 1, c: 4, every: 4, len: 2, pr: 0.6 }] },
  /* a listening post on the coast: long notes, and the sea */
  shore: { level: 0.77, bpm: 46, root: 42, scale: MIN, prog: [[0, 4], [5, 4]], lead: 'ping', sting: 'soft', beds: [['sea', 1], ['static', 0.6]], voices: [
    { k: 'pad', i: 'glass', o: 1 }, { k: 'pad', i: 'pad', v: 0.7 }, { k: 'bass', i: 'bass', v: 0.6 },
    { k: 'mel', i: 'ping', o: 3, c: 2, every: 2, len: 1, pr: 0.55, cells: [[8], [4, 4], [6, 2]] },
    { k: 'ost', i: 'pulse', p: [0, null, null, null, null, null, 0, null], when: 'tense' }] },
  /* forensics: a laboratory at night. Careful, curious, one thing at a time */
  lab: { level: 0.85, bpm: 80, root: 52, scale: DOR, prog: [[0, 2], [3, 2], [0, 2], [4, 2]], lead: 'vibes', voices: [
    { k: 'pad', i: 'glass', v: 0.8 }, { k: 'bass', i: 'bass', o: -1, v: 0.7 },
    { k: 'arp', i: 'pizz', p: [0, null, 1, null, 2, null, 1, null], v: 0.5, pr: 0.9 },
    { k: 'mel', i: 'vibes', o: 1, c: 4, every: 4, len: 2, pr: 0.6 },
    { k: 'ost', i: 'pulse', o: -1, p: [0, null, 0, null, 0, null, 0, 3], when: 'tense' }] },
  /* history: an archive, and then the day itself. Warm, a little grand, in no hurry */
  archive: { bpm: 63, root: 53, scale: MAJ, prog: [[0, 2], [2, 2], [3, 2], [4, 2]], lead: 'harp', sting: 'run', voices: [
    { k: 'pad', i: 'pad', v: 0.8 }, { k: 'bass', i: 'bass', o: -1, v: 0.7 },
    { k: 'arp', i: 'harp', p: [0, null, null, 1, null, 2, null, null], pr: 0.9, v: 0.8 },
    { k: 'mel', i: 'reed', o: 1, c: 2, every: 4, len: 2, pr: 0.7 },
    { k: 'ost', i: 'pulse', o: -1, p: [0, null, null, null, 0, null, null, 4], when: 'tense' }] },
  /* court: polished wood, long silences, everybody waiting for one answer. Nothing struck: it could be taken for a gavel */
  bench: { level: 0.84, bpm: 69, root: 45, scale: MIN, prog: [[0, 2], [3, 2], [4, 2], [0, 2]], lead: 'keys', sting: 'soft', voices: [
    { k: 'pad', i: 'pad' }, { k: 'pad', i: 'glass', o: 1, v: 0.5 }, { k: 'bass', i: 'bass', o: -1, v: 0.8 },
    { k: 'mel', i: 'reed', o: 1, c: 4, every: 4, len: 2, pr: 0.55 },
    { k: 'ost', i: 'pulse', p: [0, null, null, 0, null, null, 0, null], v: 0.7, when: 'tense' }] },
  /* news: a desk with a deadline. Quick fingers, and a clock that nobody mentions (there is none in the music) */
  desk: { level: 0.83, bpm: 112, root: 45, scale: DOR, prog: [[0, 2], [3, 2], [6, 2], [4, 2]], lead: 'vibes', voices: [
    { k: 'pad', i: 'glass', v: 0.6 }, { k: 'bass', i: 'bass', o: -1, v: 0.9 },
    { k: 'ost', i: 'pulse', p: [0, null, 0, null, 0, 0, null, 0], v: 0.55 },
    { k: 'mel', i: 'vibes', o: 1, c: 4, every: 4, len: 2, pr: 0.6 },
    { k: 'ost', i: 'pulse', o: 1, p: [null, null, 4, null, null, null, 7, null], v: 0.5, when: 'tense' }] },
  /* the wild: a great deal of land and sky, and one small party in it */
  trail: { level: 0.7, bpm: 56, root: 48, scale: MAJ, prog: [[0, 4], [3, 2], [4, 2]], lead: 'harp', sting: 'soft', beds: [['wind', 0.8]], voices: [
    { k: 'pad', i: 'glass' }, { k: 'pad', i: 'pad', o: -1, v: 0.6 }, { k: 'bass', i: 'bass', v: 0.6 },
    { k: 'mel', i: 'reed', o: 1, c: 4, every: 4, len: 2, pr: 0.65 },
    { k: 'arp', i: 'harp', o: 1, p: [0, null, null, null, 2, null, null, null], pr: 0.6, v: 0.6 },
    { k: 'ost', i: 'pulse', o: -1, p: [0, null, null, null, 0, null, null, null], when: 'tense' }] }
};

var THEME = { mystery: 'noir', scifi: 'orbit', fantasy: 'candle', ghost: 'hush', adventure: 'nighttrain', cipher: 'wire',
  forensic: 'lab', history: 'archive', court: 'bench', news: 'desk', wild: 'trail' };

/* Room by room. A room that already makes its own rain, wind or hum gets music only. */
var ROOMS = {
  'mystery/forty/street': 'noir',
  'mystery/forty/hall': ['noir', { drop: ['mel'] }],                      /* the ship's clock is listened to here */
  'mystery/forty/chart': ['noir', { root: 53, bpm: 52 }],                  /* a room for reading: slower */
  'mystery/forty/cellar': ['noir', { root: 45, drop: ['mel'], level: 0.9 }],
  'mystery/forty/office': ['noir', { root: 48 }],
  'mystery/forty/midnight': ['noir', { mood: 'tense', drop: ['mel', 'ost'] }],       /* and again here: nothing with a beat */
  'mystery/forty/morning': 'morning',
  'mystery/gloria/tent': 'village',
  'mystery/gloria/plots': ['village', { bpm: 96, root: 50, beds: [['birds', 0.7]] }],
  'mystery/gloria/teas': ['village', { bpm: 110, beds: [['crowd', 0.6]] }],
  'mystery/gloria/prize': ['morning', { root: 48, bpm: 84 }],
  'scifi/air/cabin': ['orbit', { mood: 'tense' }],
  'scifi/air/spine': 'orbit',
  'scifi/air/airroom': ['orbit', { mood: 'tense', root: 48 }],
  'scifi/air/garden': ['orbit', { root: 52 }],
  'scifi/air/docking': ['morning', { root: 50, bpm: 66 }],
  'fantasy/library/reading': ['candle', { drop: ['mel'] }],                /* a bell rings in this room: no small bright notes */
  'fantasy/library/landing': ['candle', { root: 52 }],
  'fantasy/library/dome': ['candle', { root: 47, bpm: 58, drop: ['mel'] }],   /* and the player rings one here */
  'fantasy/library/dawn': ['morning', { root: 50 }],
  'ghost/room13/lobby': 'hush',
  'ghost/room13/second': ['hush', { drop: ['mel'], level: 0.85 }],
  'ghost/room13/thirteen': ['hush', { root: 43 }],
  'ghost/room13/morning': ['morning', { root: 53, bpm: 64 }],
  'adventure/orvo/halm': ['nighttrain', { bpm: 96 }],
  'adventure/orvo/dining': 'nighttrain',
  'adventure/orvo/arrival': ['nighttrain', { root: 45, bpm: 116 }],
  /* The Cipher stories name their scapes themselves, in ER.init (their rooms change the music as the story turns).
     The lines below repeat those choices for the tests and the listening page: keep the two the same.
     then: what the room changes to later (the room does that itself, with ER.track.play). */
  'cipher/wrong/phonebox': ['wire', { bpm: 84, drop: ['mel'] }],
  'cipher/wrong/shop': ['wire', { root: 43, bpm: 88, drop: ['ost'] }],                       /* a shop full of clocks: no beat */
  'cipher/wrong/midnight': ['wire', { root: 38, bpm: 76, mood: 'tense', drop: ['mel', 'ost'], then: ['morning', { root: 50, bpm: 66, drop: ['mel'] }] }],
  'cipher/lexicon/corridor': ['studio', { bpm: 104, drop: ['hit'] }],                        /* somebody knocks on a door: no plucked chords */
  'cipher/lexicon/gallery': ['studio', { root: 45, bpm: 92, drop: ['arp', 'hit', 'ost'], level: 1.2, beds: [['hum', 0.6]] }],     /* much to read, a clock to listen for */
  'cipher/lexicon/studio': ['studio', { root: 50, bpm: 108, drop: ['hit'] }],
  'cipher/lexicon/onair': ['studio', { root: 53, bpm: 120, beds: [['crowd', 0.5]] }],
  'cipher/exam/staffroom': ['corridor', { drop: ['mel'] }],                                  /* the caretaker whistles: no tune */
  'cipher/exam/corridor': ['corridor', { root: 43, bpm: 56, drop: ['ost'] }],                /* the copier behind the door keeps time */
  'cipher/exam/copyroom': ['corridor', { root: 50, bpm: 64, drop: ['ost'] }],
  'cipher/exam/library': ['corridor', { root: 45, bpm: 54, drop: ['mel'] }],
  'cipher/exam/hall': ['corridor', { root: 48, bpm: 50, drop: ['mel', 'ost'], level: 0.85, then: ['morning', { root: 52, bpm: 68, drop: ['mel'] }] }],
  'cipher/zero/hut': ['shore', { drop: ['mel'] }],                                           /* the sender is sending Morse: no small bright notes */
  'cipher/zero/cipher': ['shore', { root: 45, bpm: 42, drop: ['mel', 'ost'], beds: [['sea', 0.5], ['static', 0.5]] }],      /* the longest read of the story */
  'cipher/zero/store': ['shore', { root: 40, bpm: 40, drop: ['mel', 'ost'], beds: [['sea', 0.45]] }],
  'cipher/zero/mast': ['shore', { mood: 'tense', drop: ['mel'], beds: [['sea', 0.9], ['wind', 0.6], ['rain', 0.5]] }],
  'cipher/zero/cellar': ['shore', { root: 38, bpm: 44, drop: ['mel', 'ost'], beds: [['drips', 0.6], ['sea', 0.35]] }],
  'cipher/zero/key': ['shore', { root: 43, bpm: 50, mood: 'tense', drop: ['mel'], beds: [['static', 0.8], ['sea', 0.5]] }],             /* a word is keyed in Morse here */
  'cipher/zero/relieved': ['morning', { root: 54, bpm: 66, beds: [['sea', 0.7], ['birds', 0.4]] }],
  'cipher/seven/desk': ['press', { bpm: 88, drop: ['mel'] }],                                 /* a telephone rings in every room of this story: no small bright notes */
  'cipher/seven/library': ['press', { root: 48, bpm: 76, drop: ['ost', 'mel'] }],             /* a room for reading, under a sign that says SILENCE */
  'cipher/seven/composing': ['press', { root: 53, bpm: 96, drop: ['mel'] }],
  'cipher/seven/press': ['press', { root: 45, bpm: 104, mood: 'tense' }],                     /* the clock is running now */
  'cipher/seven/landing': ['press', { root: 47, bpm: 80, mood: 'tense', drop: ['ost', 'mel'], level: 0.85 }],      /* whispering, and feet on the stairs to listen for */
  'cipher/seven/edition': ['press', { root: 50, bpm: 84, drop: ['mel'], then: ['morning', { root: 50, bpm: 72, drop: ['mel'] }] }],    /* a bell is rung at two; then the major key */
  /* The stories of the study wing name their scapes in ER.init as well; these lines repeat them. */
  'forensic/fair/hall': ['lab', { root: 50, bpm: 72, drop: ['mel'], beds: [['rain', 0.5]] }],            /* a big empty hall, rain, much to read: no tune */
  'forensic/fair/prep': ['lab', { root: 52, bpm: 80, drop: ['arp'] }],                                    /* drops fall and powders fizz: nothing plucked */
  'forensic/fair/office': ['lab', { root: 47, bpm: 66, drop: ['arp'] }],                                  /* reading and measuring: slower */
  'forensic/fair/van': ['lab', { root: 45, bpm: 76, mood: 'tense', drop: ['arp'], beds: [['rain', 0.8]] }],
  'forensic/fair/judging': ['morning', { root: 52, bpm: 72 }],
  'history/apollo/backroom': ['archive', { root: 50, bpm: 58, drop: ['mel'], beds: [['hum', 0.6]] }],           /* a speaker beeps and talks in this room: no small bright notes */
  'history/apollo/chart': ['archive', { root: 48, bpm: 56, mood: 'tense', drop: ['mel', 'arp'] }],
  'history/apollo/desk': ['archive', { root: 53, bpm: 54, drop: ['ost'], beds: [['night', 0.45]] }],            /* the calm room: sums by lamplight */
  'history/apollo/bench': ['archive', { root: 45, bpm: 60, mood: 'tense', drop: ['mel'], beds: [['hum', 0.4]] }],
  'history/apollo/splash': ['archive', { root: 50, bpm: 50, drop: ['mel', 'arp', 'ost'], level: 1.05, then: ['morning', { root: 53, bpm: 70, beds: [['crowd', 0.6]] }] }],    /* seven minutes of silence, then the parachutes */
  'court/glass/hall': ['bench', { beds: [['rain', 0.55], ['crowd', 0.3]] }],                               /* a hall full of people waiting, and rain on tall windows */
  'court/glass/consult': ['bench', { root: 47, bpm: 60, drop: ['mel'], beds: [['rain', 0.4]] }],
  'court/glass/exhibits': ['bench', { root: 50, bpm: 63, drop: ['mel'], beds: [['rain', 0.3]] }],
  'court/glass/hearing': ['bench', { root: 43, bpm: 66, drop: ['ost'], beds: [['rain', 0.25]] }],          /* nothing in the music that could be taken for a knock */
  'court/glass/judgment': ['bench', { root: 45, bpm: 60, drop: ['mel', 'ost'], then: ['bench', { scale: MAJ, root: 48, bpm: 72, drop: ['ost'], beds: [['birds', 0.45]] }] }],    /* the same music in a major key, on the steps outside */
  'news/rumour/newsroom': ['desk', { bpm: 100, drop: ['mel'] }],                                           /* a small room and a great deal to read: the pulse, no tune */
  'news/rumour/corridor': ['desk', { root: 47, bpm: 108, drop: ['mel'], beds: [['crowd', 0.6]] }],
  'news/rumour/library': ['desk', { root: 43, bpm: 84, drop: ['ost'] }],                                   /* slower, lower, and without the pulse */
  'news/rumour/e7': ['desk', { root: 48, bpm: 116, mood: 'tense' }],                                       /* ten minutes and a headline to write */
  'news/rumour/four': ['morning', { root: 50, bpm: 76, beds: [['crowd', 0.35]] }],
  /* wild/ridge: no reed tune anywhere, because a whistle is part of the story */
  'wild/ridge/cairn': ['trail', { root: 45, bpm: 52, drop: ['mel', 'arp'], beds: [['wind', 0.9]] }],
  'wild/ridge/whaleback': ['trail', { root: 50, bpm: 50, drop: ['mel', 'arp', 'bass'], level: 0.9, beds: [['wind', 1.1]] }],      /* the thinnest: pads and wind */
  'wild/ridge/door': ['trail', { root: 43, bpm: 60, mood: 'tense', drop: ['mel'], beds: [['wind', 1.25], ['rain', 0.45]] }],
  'wild/ridge/meetings': ['trail', { root: 48, bpm: 58, mood: 'tense', drop: ['mel'], beds: [['wind', 0.4], ['rain', 0.4]] }],
  'wild/ridge/hut': ['trail', { root: 55, bpm: 54, drop: ['mel', 'ost'], level: 0.95, beds: [['fire', 0.7], ['wind', 0.25]] }],     /* blasts are counted here: nothing with a beat */
  'fantasy/toll/gate': ['candle', { root: 50, bpm: 60, beds: [['wind', 0.5]] }],                           /* dusk by a river */
  'fantasy/toll/arch': ['candle', { root: 45, bpm: 56, drop: ['mel'], beds: [['night', 0.5], ['drips', 0.5]] }],      /* pennies ring in this room: no small bright notes */
  'fantasy/toll/counting': ['candle', { root: 48, bpm: 58, drop: ['mel'] }],                               /* the most to read */
  'fantasy/toll/house': ['candle', { root: 52, bpm: 72, beds: [['fire', 0.7], ['rain', 0.3]] }],
  'fantasy/toll/crow': ['candle', { root: 50, bpm: 60, drop: ['mel'], beds: [['night', 0.5]], then: ['morning', { root: 50, bpm: 70, beds: [['birds', 0.5]] }] }],     /* a cock crows here */
  /* ghost/ferry: no bass anywhere, because the ship's whistle is a low long note */
  'ghost/ferry/quay': ['hush', { bpm: 50, drop: ['bass'], beds: [['sea', 0.5]] }],
  'ghost/ferry/saloon': ['hush', { root: 48, bpm: 54, drop: ['bass'], beds: [['hum', 0.55]] }],
  'ghost/ferry/deck': ['hush', { root: 43, bpm: 48, drop: ['bass'], beds: [['sea', 0.85], ['wind', 0.3]] }],
  'ghost/ferry/wheel': ['hush', { root: 40, bpm: 50, drop: ['bass', 'mel'], beds: [['hum', 0.5], ['sea', 0.3]] }],      /* the telegraph gong rings here */
  'ghost/ferry/pier': ['hush', { scale: MAJ, root: 48, bpm: 56, drop: ['bass'], beds: [['sea', 0.6]] }],             /* the same tune in a major key */
  /* adventure/mail: an airship is not a train, so not the theme's waltz. No reed tune: a whistle in a speaking tube is listened for */
  'adventure/mail/shed': ['archive', { root: 48, bpm: 60, drop: ['mel'], beds: [['wind', 0.35], ['birds', 0.3]] }],
  'adventure/mail/gondola': ['archive', { root: 50, bpm: 66, drop: ['mel'], beds: [['hum', 0.7], ['wind', 0.45], ['rain', 0.35]] }],
  'adventure/mail/keel': ['archive', { root: 45, bpm: 58, drop: ['mel', 'arp'], level: 1.1, beds: [['hum', 0.4], ['wind', 0.3], ['drips', 0.5]] }],
  'adventure/mail/windgate': ['archive', { root: 43, bpm: 72, mood: 'tense', drop: ['mel'], beds: [['wind', 1.1], ['hum', 0.35]] }],
  'adventure/mail/tolver': ['archive', { root: 53, bpm: 68, drop: ['mel'], beds: [['birds', 0.45], ['wind', 0.25], ['crowd', 0.25]], then: ['archive', { root: 55, bpm: 76, beds: [['birds', 0.5], ['crowd', 0.35]] }] }],
  'forensic/cake/shop': ['lab', { root: 53, bpm: 70, drop: ['arp'], beds: [['hum', 0.35]] }],
  'forensic/cake/bake': ['lab', { root: 46, bpm: 66, drop: ['mel'], beds: [['hum', 0.5]] }],
  'forensic/cake/store': ['lab', { root: 50, bpm: 76, drop: ['arp'] }],
  'forensic/cake/office': ['lab', { root: 45, bpm: 60, drop: ['arp', 'mel'] }],                             /* slanting light and a great deal of reading */
  'forensic/cake/yard': ['morning', { root: 53, bpm: 70, beds: [['birds', 0.6]] }],
  'history/carpathia/shack': ['archive', { root: 50, bpm: 54, drop: ['mel', 'arp', 'ost'], beds: [['static', 0.55], ['sea', 0.35]] }],      /* Morse is read and sent here: no tune and no beat */
  'history/carpathia/chartroom': ['archive', { root: 48, bpm: 56, mood: 'tense', drop: ['mel'], beds: [['sea', 0.5]] }],
  'history/carpathia/engines': ['archive', { root: 45, bpm: 66, mood: 'tense', drop: ['mel', 'arp'], beds: [['hum', 1.1]] }],
  'history/carpathia/saloon': ['archive', { root: 53, bpm: 58, drop: ['ost'], beds: [['hum', 0.35]] }],
  'history/carpathia/daybreak': ['archive', { root: 50, bpm: 48, drop: ['mel', 'arp', 'ost'], sting: 'soft', beds: [['sea', 0.8]] }],
  'court/gambit/chamber': ['bench', { root: 45, bpm: 60, drop: ['ost'], level: 0.8 }],                      /* a chess hall between rounds: nothing in the music that could be a clock */
  'court/gambit/desk': ['bench', { root: 48, bpm: 63, drop: ['mel', 'ost'], beds: [['crowd', 0.25]] }],
  'court/gambit/parlour': ['bench', { root: 50, bpm: 56, drop: ['mel', 'ost'], beds: [['fire', 0.35]] }],
  'court/gambit/corridor': ['bench', { root: 43, bpm: 66, drop: ['ost'], beds: [['hum', 0.3]] }],
  'court/gambit/boardone': ['bench', { scale: MAJ, root: 48, bpm: 72, drop: ['ost'], beds: [['crowd', 0.3]] }],   /* the same music in a major key: the hall fills up again for round five */
  'news/flood/board': ['desk', { bpm: 96, drop: ['mel'], beds: [['rain', 0.6]] }],                         /* rain on the window: the pulse of the desk, and no tune */
  'news/flood/front': ['desk', { root: 47, bpm: 104, drop: ['mel'], beds: [['crowd', 0.3], ['rain', 0.25]] }],
  'news/flood/records': ['desk', { root: 43, bpm: 80, drop: ['mel', 'ost'], beds: [['rain', 0.45]] }],     /* the quietest room in the building */
  'news/flood/studio': ['desk', { root: 48, bpm: 110, mood: 'tense', drop: ['mel'], beds: [['hum', 0.5], ['static', 0.35]] }],    /* no tune: the station's own four notes are heard in this room */
  'news/flood/light': ['morning', { root: 53, bpm: 66, beds: [['birds', 0.5]] }],
  'mystery/understudy/corner': ['noir', { root: 50, bpm: 54, drop: ['mel', 'ost'], beds: [['crowd', 0.3], ['hum', 0.35]] }],      /* the dark side of the curtain: no tune and no beat anywhere in this story, because a theatre runs on cues */
  'mystery/understudy/box': ['noir', { root: 53, bpm: 58, drop: ['mel', 'ost'], beds: [['crowd', 0.75], ['hum', 0.4]] }],
  'mystery/understudy/wings': ['noir', { root: 45, bpm: 52, drop: ['mel', 'ost'], level: 0.9, beds: [['crowd', 0.22], ['rain', 0.3]] }],
  'mystery/understudy/dressing': ['noir', { root: 48, bpm: 56, drop: ['mel', 'ost'], beds: [['rain', 0.45]] }],
  'mystery/understudy/stage': ['noir', { root: 43, bpm: 60, mood: 'tense', drop: ['mel', 'ost'], beds: [['crowd', 0.6]], then: ['noir', { scale: MAJ, root: 50, bpm: 66, drop: ['ost'], beds: [['crowd', 0.35]] }] }],   /* when the curtain goes up: the same music in a major key, with its tune back */
  'wild/tide/shed': ['trail', { root: 48, bpm: 54, drop: ['mel'], beds: [['sea', 0.45], ['birds', 0.5]] }],            /* a horn belongs to this story: no tune in any of its rooms */
  'wild/tide/scar': ['trail', { root: 50, bpm: 50, drop: ['mel', 'arp'], beds: [['sea', 0.8], ['wind', 0.5]] }],
  'wild/tide/ford': ['trail', { root: 43, bpm: 58, mood: 'tense', drop: ['mel'], beds: [['sea', 1.0], ['wind', 0.5]] }],
  'wild/tide/gap': ['trail', { root: 45, bpm: 48, drop: ['mel', 'arp', 'ost', 'bass'], level: 1.05, beds: [['sea', 0.7], ['wind', 0.5]] }],     /* two horns and a bell are counted against a watch: nothing with a beat */
  'wild/tide/box': ['trail', { root: 55, bpm: 50, drop: ['mel', 'arp', 'ost', 'bass'], level: 1.05, beds: [['sea', 0.9], ['wind', 0.3]] }],     /* a boat's horn is answered with a bell: nothing with a beat */
  'scifi/benthos/watch': ['orbit', { root: 45, bpm: 44, drop: ['mel'], lead: 'keys', beds: [['hum', 0.6]] }],            /* pings carry meaning in this story: the tune of the scape is a ping, so it is dropped, and the solved phrase is played on keys */
  'scifi/benthos/lab': ['orbit', { root: 52, bpm: 50, drop: ['mel'], lead: 'keys', beds: [['drips', 0.5], ['hum', 0.3]] }],
  'scifi/benthos/pumps': ['orbit', { root: 43, bpm: 52, mood: 'tense', drop: ['mel'], lead: 'keys', beds: [['hum', 1], ['drips', 0.4]] }],
  'scifi/benthos/floor': ['orbit', { root: 40, bpm: 42, mood: 'tense', drop: ['mel', 'ost'], lead: 'keys', beds: [['static', 0.5]] }],    /* orders go out and pings come back: no tune and no pulse */
  'scifi/benthos/dock': ['orbit', { root: 50, bpm: 50, drop: ['mel'], lead: 'keys', beds: [['drips', 0.7]], then: ['morning', { root: 50, bpm: 66 }] }],
  'fantasy/hours/stair': ['candle', { root: 50, bpm: 60, drop: ['mel'], beds: [['night', 0.5], ['wind', 0.3]] }],            /* a clock ticks and strikes in this story: no small bright notes */
  'fantasy/hours/weights': ['candle', { root: 45, bpm: 54, drop: ['mel', 'arp'], beds: [['wind', 0.45]] }],
  'fantasy/hours/dial': ['candle', { root: 48, bpm: 56, drop: ['mel', 'arp'], beds: [['wind', 0.6], ['night', 0.3]] }],
  'fantasy/hours/workroom': ['candle', { root: 52, bpm: 66, drop: ['mel'], beds: [['fire', 0.6]] }],
  'fantasy/hours/loft': ['candle', { root: 50, bpm: 50, drop: ['mel', 'arp', 'bass'], beds: [['wind', 0.7], ['night', 0.4]], then: ['morning', { root: 50, bpm: 66, drop: ['mel'], beds: [['night', 0.4]] }] }],   /* eleven strokes are counted here: held notes and wind only */
  'ghost/orchard/kitchen': ['hush', { bpm: 52, drop: ['bass'], beds: [['wind', 0.3]] }],                    /* a cold stone kitchen with the range out */
  'ghost/orchard/backroom': ['hush', { root: 48, bpm: 48, drop: ['mel', 'bass'], beds: [['wind', 0.22]] }],  /* the room with most to read: no tune */
  'ghost/orchard/churchyard': ['hush', { root: 50, bpm: 50, drop: ['mel'], beds: [['birds', 0.45], ['wind', 0.3]] }],
  'ghost/orchard/orchard': ['hush', { root: 43, bpm: 50, drop: ['bass'], beds: [['night', 0.5], ['wind', 0.35]] }],
  'ghost/orchard/supper': ['hush', { scale: MAJ, root: 48, bpm: 56, beds: [['fire', 0.6]] }]                 /* the same slow tune in a major key, and a fire in the range */
};

/* ---------- the sounding part ---------- */
var A = null, S = null, mood = 'calm', step = 0, nextT = 0, timer = 0, events = {}, bedList = [], held = false, ducked = false, started = false, forced = null;
var CELLS4 = [[2, 2, 4], [3, 1, 4], [4, 4], [2, 2, 2, 2], [6, 2], [4, 2, 2], [8]], CELLS3 = [[2, 2, 2], [4, 2], [6], [2, 4], [3, 1, 2]];

function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function deg(d) { var n = S.scale.length; return S.root + 12 * Math.floor(d / n) + S.scale[((d % n) + n) % n]; }

function graph(ctx, musicDest, bedDest) {
  var g = { ctx: ctx, count: 0, live: 0, most: 0 }, len = Math.floor(ctx.sampleRate * 2.6), ir = ctx.createBuffer(2, len, ctx.sampleRate), ch, i, d, n, lp;
  g.out = ctx.createGain(); g.out.gain.value = 0.0001; g.out.connect(musicDest);
  g.dry = ctx.createGain(); g.dry.connect(g.out);
  for (ch = 0; ch < 2; ch++) { d = ir.getChannelData(ch); for (i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
  g.revIn = ctx.createGain(); g.conv = ctx.createConvolver(); g.conv.buffer = ir;
  lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3000;
  g.wet = ctx.createGain(); g.wet.gain.value = 0.6;
  g.revIn.connect(g.conv); g.conv.connect(lp); lp.connect(g.wet); g.wet.connect(g.out);
  g.bed = ctx.createGain(); g.bed.gain.value = 0.0001; g.bed.connect(bedDest);
  n = ctx.sampleRate * 2; g.noise = ctx.createBuffer(1, n, ctx.sampleRate); d = g.noise.getChannelData(0);
  for (i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return g;
}
function note(inst, midi, t, dur, vel) {
  var I = INST[inst], c = A.ctx, f = c.createBiquadFilter(), g = c.createGain(), peak = I.g * (vel == null ? 1 : vel), cut = I.lp * (mood === 'tense' ? 0.86 : 1), end, hold, lg = null, lfo, s;
  f.type = 'lowpass'; f.Q.value = I.q || 0.7;
  if (I.env) { f.frequency.setValueAtTime(Math.min(cut * 3.2, 9000), t); f.frequency.exponentialRampToValueAtTime(cut, t + I.env); }
  else f.frequency.setValueAtTime(cut, t);
  g.gain.setValueAtTime(0.0001, t);
  if (I.d) { g.gain.exponentialRampToValueAtTime(peak, t + I.a); g.gain.exponentialRampToValueAtTime(0.0001, t + I.a + I.d); end = t + I.a + I.d + 0.05; }
  else {
    hold = Math.max(I.a, dur);
    g.gain.linearRampToValueAtTime(peak, t + I.a); g.gain.setValueAtTime(peak, t + hold); g.gain.linearRampToValueAtTime(0.0001, t + hold + I.r);
    end = t + hold + I.r + 0.05;
  }
  if (I.vib) { lfo = c.createOscillator(); lg = c.createGain(); lfo.frequency.value = I.vib[0]; lg.gain.value = I.vib[1]; lfo.connect(lg); lfo.start(t); lfo.stop(end); }
  I.w.forEach(function (w) {
    var o = c.createOscillator(), og, G = A;
    o.type = w[0]; o.frequency.setValueAtTime(hz(midi + (w[2] || 0)), t); o.detune.setValueAtTime(w[1] || 0, t);
    if (lg) lg.connect(o.detune);
    if (w[3] != null) { og = c.createGain(); og.gain.value = w[3]; o.connect(og); og.connect(f); } else o.connect(f);
    o.start(t); o.stop(end);
    G.live++; if (G.live > G.most) G.most = G.live;
    o.onended = function () { G.live--; };
  });
  f.connect(g); g.connect(A.dry);
  if (I.wet) { s = c.createGain(); s.gain.value = I.wet; g.connect(s); s.connect(A.revIn); }
  A.count++; if (A.log) A.log.push(midi);
}
function click(t, f, peak, dur, dest) {                   /* a tick: a grain of noise */
  var c = A.ctx, s = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
  s.buffer = A.noise; s.loop = true; bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 5;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(bp); bp.connect(g); g.connect(dest || A.dry); s.start(t, Math.random()); s.stop(t + dur + 0.03);
}
function thump(t, f, peak, dur) {                         /* a low knock */
  var c = A.ctx, o = c.createOscillator(), g = c.createGain();
  o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.55, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(A.dry); o.start(t); o.stop(t + dur + 0.03);
}
function chirp(t, f1, f2, peak, dur) {                    /* a small gliding whistle, for birds, drips and insects */
  var c = A.ctx, o = c.createOscillator(), g = c.createGain();
  o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + dur * 0.25); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(A.bed); o.start(t); o.stop(t + dur + 0.03);
}

/* ---------- background sound ---------- */
function hiss(type, f, q, gain) {                         /* filtered noise that goes on: returns its filter and its gain */
  var c = A.ctx, s = c.createBufferSource(), flt = c.createBiquadFilter(), g = c.createGain();
  s.buffer = A.noise; s.loop = true; flt.type = type; flt.frequency.value = f; flt.Q.value = q; g.gain.value = gain;
  s.connect(flt); flt.connect(g); g.connect(A.bed); s.start(0, Math.random());
  return { f: flt, g: g };
}
function sway(param, hzs, depth) {                        /* a slow wobble on any setting */
  var c = A.ctx, o = c.createOscillator(), g = c.createGain();
  o.frequency.value = hzs; g.gain.value = depth; o.connect(g); g.connect(param); o.start(0);
}
function now_and_then(min, max, fn) {                     /* something that happens every so often */
  var next = A.ctx.currentTime + min + Math.random() * (max - min);
  return { tick: function (horizon) { while (next < horizon) { fn(next); next += min + Math.random() * (max - min); } } };
}
var BEDS = {
  wind: function (lv) { var h = hiss('bandpass', 420, 0.5, 0.05 * lv); sway(h.f.frequency, 0.07, 230); sway(h.g.gain, 0.11, 0.022 * lv); return {}; },
  sea: function (lv) { var h = hiss('lowpass', 650, 0.3, 0.03 * lv), k = hiss('highpass', 2600, 0.3, 0.006 * lv); sway(h.g.gain, 0.09, 0.022 * lv); sway(k.g.gain, 0.09, 0.005 * lv); return {}; },
  rain: function (lv) { var h = hiss('highpass', 900, 0.4, 0.03 * lv), lp = A.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6500; h.g.disconnect(); h.g.connect(lp); lp.connect(A.bed); return {}; },
  hum: function (lv) { var c = A.ctx, o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(); o.type = 'sawtooth'; o.frequency.value = 50; f.type = 'lowpass'; f.frequency.value = 190; g.gain.value = 0.018 * lv; o.connect(f); f.connect(g); g.connect(A.bed); o.start(0); return {}; },
  crowd: function (lv) { var h = hiss('bandpass', 620, 0.35, 0.03 * lv); sway(h.g.gain, 0.5, 0.008 * lv); sway(h.g.gain, 0.23, 0.008 * lv); sway(h.f.frequency, 0.31, 120); return {}; },
  static: function (lv) {
    var h = hiss('bandpass', 2400, 1.2, 0.012 * lv), c = A.ctx, o = c.createOscillator(), g = c.createGain();
    sway(h.g.gain, 0.37, 0.005 * lv); o.frequency.value = 1180; g.gain.value = 0.0035 * lv; sway(o.frequency, 0.05, 60); o.connect(g); g.connect(A.bed); o.start(0);
    return {};
  },
  night: function (lv) { return now_and_then(0.9, 1.7, function (t) { for (var i = 0; i < 3; i++) chirp(t + i * 0.07, 4300, 4350, 0.012 * lv, 0.04); }); },
  birds: function (lv) { return now_and_then(2.2, 6, function (t) { var n = 2 + Math.floor(Math.random() * 3), f = 2300 + Math.random() * 1500, i; for (i = 0; i < n; i++) chirp(t + i * 0.16, f * (1 + Math.random() * 0.2), f * 0.82, 0.02 * lv, 0.09); }); },
  drips: function (lv) { return now_and_then(2, 5.5, function (t) { chirp(t, 1500, 520, 0.03 * lv, 0.09); }); },
  fire: function (lv) { hiss('lowpass', 240, 0.3, 0.02 * lv); return now_and_then(0.08, 0.55, function (t) { click(t, 1800 + Math.random() * 2500, (0.01 + Math.random() * 0.03) * lv, 0.02, A.bed); }); }
};

/* ---------- the tune ---------- */
function barLen() { return (S.beats || 4) * 2; }
function stepDur() { return 30 / (S.bpm * (mood === 'tense' ? (S.rush || 1.07) : 1)); }
function chordAt(st) {
  var bl = barLen(), total = 0, i, at;
  for (i = 0; i < S.prog.length; i++) total += S.prog[i][1];
  at = Math.floor(st / bl) % total;
  for (i = 0; i < S.prog.length; i++) {
    if (at < S.prog[i][1]) return { d: S.prog[i][0], first: at === 0 && st % bl === 0, bars: S.prog[i][1] };
    at -= S.prog[i][1];
  }
  return { d: 0, first: false, bars: 1 };
}
function nearTone(d, target) {                             /* the note of the chord (as a scale degree) nearest to target */
  var best = d, n = S.scale.length, k, c;
  [0, 2, 4].forEach(function (x) { for (k = -2; k <= 3; k++) { c = d + x + n * k; if (Math.abs(c - target) < Math.abs(best - target)) best = c; } });
  return best;
}
function phrase(v, st) {
  var bl = barLen(), cells = v.cells || (bl === 6 ? CELLS3 : CELLS4), mid = v.c == null ? 4 : v.c, d = nearTone(chordAt(st).d, mid), list = [], b, k, at, cell;
  for (b = 0; b < (v.len || 2); b++) {
    cell = pick(cells);
    for (k = 0, at = st + b * bl; k < cell.length; k++) { list.push({ st: at, len: cell[k] }); at += cell[k]; }
  }
  list.forEach(function (e, i) {
    var last = i === list.length - 1;
    if (i) d += pick([-2, -1, -1, 1, 1, 2]);
    if (e.len >= 3 || last) d = nearTone(chordAt(e.st).d, d);
    d = Math.max(mid - 5, Math.min(mid + 6, d));
    (events[e.st] = events[e.st] || []).push({ i: v.i, m: deg(d) + 12 * (v.o || 0), dur: last ? e.len + 2 : e.len, v: (v.v == null ? 1 : v.v) * (0.8 + Math.random() * 0.3) });
  });
}
function live(v) {
  if (S.drop.indexOf(v.k) >= 0 || (v.when && v.when !== mood)) return false;
  return !held || v.k === 'pad' || v.k === 'bass';         /* after the door has opened, only the long notes go on */
}
function doStep(st, t) {
  var bl = barLen(), pos = st % bl, bar = Math.floor(st / bl), ch = chordAt(st), sd = stepDur(), tones = [deg(ch.d), deg(ch.d + 2), deg(ch.d + 4)], ev;
  S.voices.forEach(function (v) {
    if (!live(v)) return;
    var o = 12 * (v.o || 0), vel = v.v == null ? 1 : v.v, p;
    if (v.k === 'pad') {
      if (ch.first) [tones[0], tones[2], tones[1] + 12].forEach(function (m, i) { note(v.i, m + o, t + i * 0.09, ch.bars * bl * sd * 0.96, vel); });
    } else if (v.k === 'bass') {
      if (pos === 0) note(v.i, tones[0] + o, t, bl * sd * (v.alt ? 0.45 : 0.9), vel);
      else if (v.alt && pos === bl / 2) note(v.i, tones[2] + o - 12, t, bl * sd * 0.4, vel * 0.85);
    } else if (v.k === 'arp') {
      p = v.p[pos % v.p.length];
      if (p != null && (v.pr == null || Math.random() < v.pr)) note(v.i, (p === 3 ? tones[0] + 12 : tones[p]) + o, t, sd * 2, vel);
    } else if (v.k === 'hit') {
      p = v.p[pos % v.p.length];
      if (p) tones.forEach(function (m) { note(v.i, m + o, t, sd, vel * p); });
    } else if (v.k === 'ost') {
      p = v.p[pos % v.p.length];
      if (p != null) note(v.i, deg(ch.d + p) + o, t, sd * 0.9, vel * (pos === 0 ? 1.15 : 1));
    } else if (v.k === 'tick') {
      p = v.p ? v.p[pos % v.p.length] : (pos % 2 ? 0 : 1);
      if (p) click(t, v.f || 4200, 0.05 * vel * p, 0.03);
    } else if (v.k === 'heart') {
      if (pos === 0) { thump(t, 58, 0.2 * vel, 0.2); thump(t + 0.24, 50, 0.14 * vel, 0.24); }
    } else if (v.k === 'mel') {
      if (pos === 0 && bar % (v.every || 4) === (v.at || 0) && Math.random() < (v.pr == null ? 1 : v.pr)) phrase(v, st);
    }
  });
  ev = events[st];
  if (ev) { delete events[st]; if (!held) ev.forEach(function (e) { note(e.i, e.m, t, e.dur * sd, e.v); }); }
}
function pump() {
  if (!A || !S) return;
  var c = A.ctx, horizon = c.currentTime + 0.5;
  if (nextT < c.currentTime) nextT = c.currentTime + 0.05;          /* after a pause (a hidden tab): go on from now, do not catch up */
  while (nextT < horizon) { doStep(step, nextT); nextT += stepDur(); step++; }
  bedList.forEach(function (b) { if (b.tick) b.tick(horizon); });
}

/* ---------- starting, stopping, and what the engine asks for ---------- */
function choose(sound) {
  var cfg = ER.cfg || {}, want = sound != null ? sound : cfg.sound != null ? cfg.sound : (ROOMS[cfg.theme + '/' + cfg.story + '/' + cfg.id] || THEME[cfg.theme]);
  if (!want) return null;
  var name = typeof want === 'string' ? want : want[0], opt = (typeof want === 'string' ? null : want[1]) || {}, base = SCAPES[name], s = {}, k;
  if (!base) return null;
  for (k in base) s[k] = base[k];
  for (k in opt) s[k] = opt[k];
  if (opt.level != null && base.level != null) s.level = base.level * opt.level;      /* a room's level is on top of its scape's */
  s.drop = s.drop || []; s.name = name;
  return s;
}
function vol() { return MUSIC * (S.level == null ? 1 : S.level) * (ducked ? 0.45 : 1); }
function glide(param, v, tc) {
  var t = A.ctx.currentTime;
  try { param.cancelScheduledValues(t); param.setValueAtTime(Math.max(param.value, 0.0001), t); param.setTargetAtTime(v, t, tc); } catch (e) {}
}
function setUp() {
  mood = ER.wantMood || S.mood || 'calm'; step = 0; events = {}; bedList = []; held = false;
  (S.beds || []).forEach(function (b) { var bed = BEDS[b[0]] && BEDS[b[0]](b[1] == null ? 1 : b[1]); if (bed) bedList.push(bed); });
}
function start() {
  if (started) return;
  var ctx = ER.audio(); if (!ctx || !ER.musicOut) return;
  S = choose(forced); if (!S) return;
  started = true;
  A = graph(ctx, ER.musicOut(), ER.out());
  setUp();
  nextT = ctx.currentTime + 0.3;
  A.out.gain.setValueAtTime(0.0001, ctx.currentTime); A.out.gain.exponentialRampToValueAtTime(vol(), ctx.currentTime + 2.6);
  A.bed.gain.setValueAtTime(0.0001, ctx.currentTime); A.bed.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 3);
  timer = setInterval(pump, 120); pump();
}
function stop(sec) {
  if (!A) return;
  clearInterval(timer); timer = 0;
  glide(A.out.gain, 0.0001, (sec || 0.9) / 4); glide(A.bed.gain, 0.0001, (sec || 0.9) / 4);
}
/* Another soundscape, at once: for a room whose story turns a corner (and for the listening page). */
function play(sound) {
  clearInterval(timer); timer = 0;
  if (A) { try { A.out.disconnect(); A.bed.disconnect(); } catch (e) {} }
  A = null; S = null; started = false; forced = sound == null ? null : sound;
  start();
}
function setMood(m) { if (m === 'calm' || m === 'tense') mood = m; }
function duck(on) { ducked = !!on; if (A && S && !held) glide(A.out.gain, vol(), 0.35); }
/* The phrase for a door that opens, in the room's own key and manner (S.sting):
     rise     root, fifth, root, fifth going up: no third, so it suits a minor key as well as a major one
     fanfare  do-mi-sol-do, for the bright rooms        run   up the scale like a hand across a harp
     soft     two slow notes, for rooms where a cheer would be wrong
   soft = true (the room asked for a quiet exit): the same, gentler, and without the low knock of the lock. */
function sting(name, at, soft) {
  if (!A || !S) return false;
  var t = at != null ? at : A.ctx.currentTime + 0.05, lead = S.lead || 'keys', r = S.root + 12, kind = S.sting || 'rise', v = soft ? 0.72 : 1;
  while (r < 57) r += 12;                                       /* the phrase sits in the middle of the keyboard whatever the key */
  function up(d) { return r + 12 * Math.floor(d / 7) + S.scale[d % 7]; }
  if (name === 'solved') {
    held = true; events = {};
    if (at == null) glide(A.out.gain, MUSIC * (soft || kind === 'soft' ? 1 : 1.2), 0.08);
    if (kind === 'soft') { note(lead, r + 7, t, 1.2, 0.9 * v); note(lead, r + 12, t + 0.45, 1.6, 0.9 * v); }
    else if (kind === 'run') [0, 1, 2, 3, 4, 5, 6, 7].forEach(function (d, i) { note(lead, up(d), t + i * 0.07, 0.9, (0.75 + i * 0.07) * v); });
    else if (kind === 'fanfare') [[0, 0], [2, 0.13], [4, 0.26], [7, 0.46]].forEach(function (x) { note(lead, up(x[0]), t + x[1], 1, 1.2 * v); });
    else [0, 7, 12, 19].forEach(function (x, i) { note(lead, r + x, t + i * 0.13, 1.2, 1.3 * v); });
    [0, 7, 12].forEach(function (x) { note('glass', r - 12 + x, t + 0.25, 1.8, 0.9 * v); });
    if (!soft && kind !== 'soft') thump(t, 72, 0.16, 0.3);
  } else if (name === 'clue') {
    note(lead, r + 7, t, 0.5, 0.5); note(lead, r + 12, t + 0.15, 0.8, 0.5);
  } else return false;
  return true;
}

/* For tests: render `seconds` of a soundscape without playing it, and measure it. Returns a promise of
   {peak, rms, quiet (the softest whole second after the fade-in), loud (the loudest), notes}. */
function render(sound, seconds, m, withSting) {
  var OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OC) return Promise.resolve(null);
  var keep = { A: A, S: S, mood: mood, step: step, events: events, bedList: bedList, held: held, want: ER.wantMood }, sr = 22050, ctx = new OC(2, sr * seconds, sr), t = 0.2, st = 0, out;
  S = choose(sound); if (!S) return Promise.resolve(null);
  A = graph(ctx, ctx.destination, ctx.destination); A.log = [];
  ER.wantMood = m || null; setUp();
  A.out.gain.value = vol(); A.bed.gain.value = 1;
  while (t < seconds - 0.5) {
    if (withSting && !held && t > seconds - 4) sting('solved', t);
    doStep(st, t); t += stepDur(); st++;
    bedList.forEach(function (b) { if (b.tick) b.tick(t + 0.5); });
  }
  out = { notes: A.count, name: S.name, off: A.log.filter(function (m) { return S.scale.indexOf((((m - S.root) % 12) + 12) % 12) < 0; }).length,
    lo: Math.min.apply(null, A.log), hi: Math.max.apply(null, A.log), major: S.scale[2] === 4, bpm: S.bpm, drop: S.drop, mood: mood };
  A = keep.A; S = keep.S; mood = keep.mood; step = keep.step; events = keep.events; bedList = keep.bedList; held = keep.held; ER.wantMood = keep.want;
  return ctx.startRendering().then(function (buf) {
    var d = buf.getChannelData(0), peak = 0, sum = 0, i, w, secs = [], x;
    for (i = 0; i < d.length; i++) { x = Math.abs(d[i]); if (x > peak) peak = x; sum += x * x; }
    for (w = 3; w + 1 <= seconds - 1; w++) { for (i = w * sr, x = 0; i < (w + 1) * sr; i++) x += d[i] * d[i]; secs.push(Math.sqrt(x / sr)); }
    out.peak = peak; out.rms = Math.sqrt(sum / d.length); out.quiet = Math.min.apply(null, secs); out.loud = Math.max.apply(null, secs);
    return out;
  });
}

ER.track = { start: start, stop: stop, play: play, mood: setMood, duck: duck, sting: sting, render: render, pump: pump, scapes: SCAPES, rooms: ROOMS, themes: THEME,
  pick: function (theme, story, id) { return ROOMS[theme + '/' + story + '/' + id] || THEME[theme] || null; },
  /* the three notes of the room's home chord (Hz), so that the engine's small 'right' sound is in tune with the music */
  key: function () { if (!A || !S || held) return null; var r = S.root; while (r < 69) r += 12; return [hz(r), hz(r + S.scale[2]), hz(r + S.scale[4])]; },
  info: function () { return { on: !!A, scape: S && S.name, mood: mood, notes: A ? A.count : 0, ducked: ducked, held: held, live: A ? A.live : 0, most: A ? A.most : 0 }; } };
if (ER.kicked) start();
})();
