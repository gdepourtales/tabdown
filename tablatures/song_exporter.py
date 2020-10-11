import grammar.tabdown
import guitarpro as gp
import attr
from .models import Song

notes = 'C C# D D# E F F# G G# A A# B'.split()

duration_values = {
    'w': gp.Duration.whole,
    'h': gp.Duration.half,
    'q': gp.Duration.quarter,
    'e': gp.Duration.eighth,
    's': gp.Duration.sixteenth,
    't': gp.Duration.thirtySecond,
    'i': gp.Duration.sixtyFourth,
}

bend_effect = gp.BendEffect(type=gp.BendType.bend, points=[
    gp.BendPoint(position=0, value=0),
    gp.BendPoint(position=6, value=4),
    gp.BendPoint(position=12, value=4)])

bend_release_effect = gp.BendEffect(type=gp.BendType.bend, points=[
    gp.BendPoint(position=0, value=0),
    gp.BendPoint(position=3, value=4),
    gp.BendPoint(position=6, value=4),
    gp.BendPoint(position=9, value=0),
    gp.BendPoint(position=12, value=0)])

bend_release_bend_effect = gp.BendEffect(type=gp.BendType.bend, points=[
    gp.BendPoint(position=0, value=0),
    gp.BendPoint(position=2, value=4),
    gp.BendPoint(position=4, value=4),
    gp.BendPoint(position=6, value=0),
    gp.BendPoint(position=8, value=0),
    gp.BendPoint(position=10, value=4),
    gp.BendPoint(position=12, value=4)])

prebend_effect = gp.BendEffect(type=gp.BendType.prebend, points=[
    gp.BendPoint(position=0, value=4),
    gp.BendPoint(position=12, value=4)])

prebend_release_effect = gp.BendEffect(type=gp.BendType.prebend, points=[
    gp.BendPoint(position=0, value=4),
    gp.BendPoint(position=4, value=4),
    gp.BendPoint(position=8, value=0),
    gp.BendPoint(position=12, value=0)])


@attr.s
class Note(object):
    is_silence = attr.ib(default=False)  # Todo: Transform in type
    is_chord = attr.ib(default=False)
    is_tie = attr.ib(default=False)
    is_ghost = attr.ib(default=False)
    is_dead = attr.ib(default=False)
    grace_fret_number = attr.ib(default=None)
    hammer_on = attr.ib(default=False)
    prebend = attr.ib(default=None)
    bend = attr.ib(default=None)
    in_slide = attr.ib(default="")
    out_slide = attr.ib(default="")
    fret_number = attr.ib(default=0)
    string_number = attr.ib(default=1)
    duration = attr.ib(factory=gp.Duration)

    @property
    def is_note(self):
        return not self.is_silence and not self.is_chord and not self.is_tie


@attr.s
class Chord(object):
    notes = attr.ib(factory=list)
    duration = attr.ib(default=gp.Duration(gp.Duration.hundredTwentyEighth))


@attr.s
class ParserState(object):
    tuning_string_values = attr.ib(factory=list)
    measure_time = attr.ib(default=0)
    time_signature_denominator = attr.ib(default=gp.Duration())
    marker = attr.ib(default=None)
    tempo = attr.ib(default=120)
    note_duration = attr.ib(default=960)
    string_number = attr.ib(default=4)
    measure_content = attr.ib(factory=list)
    triplet_feel = attr.ib(default=gp.TripletFeel.none)
    repeat_open = attr.ib(default=False)
    repeat_close = attr.ib(default=None)
    previous_note = attr.ib(default=None)


ALL_NOTES = 'C C# D D# E F F# G G# A A# B'.split()
OCTAVES = range(1, 6)


def generate_string_values():
    strings = {}
    for i, note in enumerate(ALL_NOTES):
        for octave in OCTAVES:
            strings[(note + str(octave))] = octave * 12 + i
    return strings


STRINGS = generate_string_values()


@attr.s
class GuitarProActions(object):
    song = attr.ib(default=None)
    state = ParserState()

    def make_song(self, _input, _start, _end, elements):
        del self.song.tracks[0].measures[-1]
        return elements

    def make_tuning(self, _input, _start, _end, elements):
        self.song.tracks[0].strings.clear()
        nb_strings = 1 + len(elements[2].elements)
        strings = [elements[1].text]
        for s in range(0, nb_strings - 1):
            strings.append(elements[2].elements[s].elements[1].text)

        for idx, string_value in enumerate(reversed(strings)):
            self.song.tracks[0].strings.append(gp.GuitarString(idx + 1, STRINGS[string_value]))

    def make_start_repeat(self, _input, _start, _end):
        self.state.repeat_open = True

    def make_close_repeat(self, _input, _start, _end, elements):
        if len(elements[1].elements) > 0:
            self.state.repeat_close = int(elements[1].elements[0].text + elements[1].elements[1].text)
        else:
            self.state.repeat_close = 1

    def add_time_signature(self, measure_header):
        measure_time = max(self.state.measure_time, gp.Duration.minTime)

        denominator = self.state.time_signature_denominator.time
        numerator = measure_time / denominator
        from fractions import Fraction
        numerator_fraction = Fraction(numerator).limit_denominator(100)

        denominator_time = max(int(self.state.time_signature_denominator.time / numerator_fraction.denominator),
                               gp.Duration.minTime)

        denominator_value = (gp.Duration.quarterTime * gp.Duration.quarter) / denominator_time

        time_signature = gp.TimeSignature(numerator=numerator_fraction.numerator,
                                          denominator=gp.Duration(denominator_value))

        measure_header.timeSignature = time_signature

    def add_marker(self, measure_header):
        if self.state.marker is not None:
            measure_header.marker = gp.Marker(title=self.state.marker.strip())

    def add_repeat_open(self, measure_header: gp.MeasureHeader):
        if self.state.repeat_open:
            measure_header.isRepeatOpen = True

    def add_repeat_close(self, measure_header: gp.MeasureHeader):
        if self.state.repeat_close is not None:
            measure_header.repeatClose = self.state.repeat_close

    def add_triplet_feel(self, measure_header):
        measure_header.tripletFeel = self.state.triplet_feel

    def add_tempo(self, voice):
        if len(voice.beats) > 0:
            beat = voice.beats[0]
            beat.effect.mixTableChange = \
                gp.MixTableChange(tempo=gp.MixTableItem(value=self.state.tempo, duration=1))
        if len(self.song.tracks[0].measures) == 1:
            self.song.tempo = self.state.tempo

    def build_note(self, note, gp_beat):
        note_type = gp.NoteType.tie if note.is_tie else (gp.NoteType.dead if note.is_dead else gp.NoteType.normal)

        new_note = gp.Note(gp_beat,
                           value=note.fret_number,
                           string=note.string_number,
                           type=note_type)

        new_note.effect = gp.NoteEffect()
        new_note.effect.hammer = note.hammer_on

        if note.grace_fret_number is not None:
            new_note.effect.grace = gp.GraceEffect(fret=note.grace_fret_number)

        if note.in_slide != "":
            if note.in_slide == "/":
                new_note.effect.slides.append(gp.SlideType.intoFromBelow)
            if note.in_slide == "\\":
                new_note.effect.slides.append(gp.SlideType.intoFromAbove)

        if note.out_slide != "":
            if note.out_slide == "/":
                new_note.effect.slides.append(gp.SlideType.outUpwards)
            if note.out_slide == "\\":
                new_note.effect.slides.append(gp.SlideType.outDownwards)

        if note.prebend is not None:
            if note.prebend == "/":
                new_note.effect.bend = prebend_effect
            if note.prebend == "/\\":
                new_note.effect.bend = prebend_release_effect

        if note.bend is not None:
            if note.bend == "/":
                new_note.effect.bend = bend_effect
            if note.bend == "/\\":
                new_note.effect.bend = bend_release_effect
            if note.bend == "/\\/":
                new_note.effect.bend = bend_release_bend_effect

        if note.is_ghost:
            new_note.effect.ghostNote = True

        return new_note

    def add_notes(self, voice):
        for beat in self.state.measure_content:
            beat_status = gp.BeatStatus.rest if isinstance(beat, Note) and beat.is_silence else gp.BeatStatus.normal

            gp_beat = gp.Beat(voice,
                              duration=beat.duration,
                              status=beat_status)

            if isinstance(beat, Chord):
                for chord_note in beat.notes:
                    gp_note = self.build_note(chord_note, gp_beat)
                    gp_beat.notes.append(gp_note)

            if isinstance(beat, Note) and (beat.is_note or beat.is_tie):
                gp_note = self.build_note(beat, gp_beat)
                gp_beat.notes.append(gp_note)

            voice.beats.append(gp_beat)

    def make_notes(self, _input, _start, _end, elements):
        # TODO: Ugly should be treated in an non-existing make_measure action
        if len(self.song.tracks[0].measures) > 1:
            self.add_repeat_close(self.song.tracks[0].measures[-2].header)

        current_measure = self.song.tracks[0].measures[-1]
        measure_header = current_measure.header

        self.add_time_signature(measure_header)
        self.add_marker(measure_header)
        self.add_triplet_feel(measure_header)
        self.add_repeat_open(measure_header)
        self.add_tempo(current_measure.voices[0])

        self.add_notes(current_measure.voices[0])

        # Add new measure at the end
        measure = gp.Measure(self.song.tracks[0], gp.MeasureHeader())
        self.song.tracks[0].measures.append(measure)
        self.state.measure_time = 0
        self.state.measure_content.clear()
        self.state.marker = None
        self.state.repeat_open = False
        self.state.repeat_close = None

        return elements

    def make_prebend(self, _input, _start, _end, elements):
        return elements[1].text

    def make_bend(self, _input, _start, _end, elements):
        return elements[1].text

    def make_slide(self, input, start, end):
        return input[start:end]

    def make_chord(self, _input, _start, _end, elements):
        chord_size = len(elements[2].elements) + 1
        chord = Chord()
        for n in range(0, chord_size):
            note = self.state.measure_content.pop()
            chord.duration = note.duration if note.duration.time > chord.duration.time else chord.duration
            self.state.measure_time -= note.duration.time
            chord.notes.append(note)

        self.state.measure_content.append(chord)
        self.state.measure_time += chord.duration.time

        return elements

    def make_repeated_notes(self, _input, _start, _end, elements):
        n_repeat = int(elements[0].text + elements[1].text)
        n_notes = len(elements[4].elements) + 1  # we assume there's at least one plus the additional
        additional_notes = list()
        for t in range(1, n_repeat):
            for n in range(-n_notes, 0):
                note = self.state.measure_content[n]
                additional_notes.append(note)
                self.state.measure_time += note.duration.time

        self.state.measure_content.extend(additional_notes)
        return elements

    def make_chord_note(self, _input, _start, _end, elements):
        duration = gp.Duration.fromTime(int(self.state.note_duration))

        in_slide = elements[1] if type(elements[1]) is str else None
        prebend = elements[2] if type(elements[2]) is str else None
        grace_fret_number = int(elements[3].elements[1].text) if len(elements[3].text) > 0 else None
        is_ghost = len(elements[4].text) > 0
        is_dead = len(elements[5].text) > 0
        fret_number = int("".join("".join(o.text) for o in elements[6]))
        bend = elements[9] if type(elements[9]) is str else None
        out_slide = elements[10] if type(elements[10]) is str else None

        new_note: Note = Note(fret_number=fret_number,
                              hammer_on=len(elements[8].text) == 1,
                              grace_fret_number=grace_fret_number,
                              string_number=self.state.string_number,
                              duration=duration,
                              in_slide=in_slide,
                              out_slide=out_slide,
                              prebend=prebend,
                              bend=bend,
                              is_ghost=is_ghost,
                              is_dead=is_dead
                              )
        self.state.measure_content.append(new_note)
        self.state.previous_note = new_note
        return elements

    def make_note(self, _input, _start, _end, elements):
        duration = gp.Duration.fromTime(int(self.state.note_duration))

        in_slide = elements[0] if type(elements[0]) is str else None
        prebend = elements[1] if type(elements[1]) is str else None
        grace_fret_number = int(elements[2].elements[1].text) if len(elements[2].text) > 0 else None
        is_ghost = len(elements[3].text) > 0
        is_dead = len(elements[4].text) > 0
        fret_number = int("".join("".join(o.text) for o in elements[5]))
        bend = elements[8] if type(elements[8]) is str else None
        out_slide = elements[9] if type(elements[9]) is str else None

        new_note: Note = Note(fret_number=fret_number,
                              hammer_on=len(elements[7].text) == 1,
                              grace_fret_number=grace_fret_number,
                              string_number=self.state.string_number,
                              duration=duration,
                              in_slide=in_slide,
                              out_slide=out_slide,
                              prebend=prebend,
                              bend=bend,
                              is_ghost=is_ghost,
                              is_dead=is_dead
                              )
        self.state.measure_content.append(new_note)
        self.state.previous_note = new_note
        return elements

    def make_chord_tied_note(self, _input, _start, _end, elements):
        duration = gp.Duration.fromTime(int(self.state.note_duration))
        out_slide = elements[3].text
        if self.state.previous_note is not None:
            self.state.measure_content.append(Note(
                fret_number=self.state.previous_note.fret_number,
                string_number=self.state.string_number,
                duration=duration,
                out_slide=out_slide,
                is_tie=True
            ))
        return elements

    def make_tied_note(self, _input, _start, _end, elements):
        duration = gp.Duration.fromTime(int(self.state.note_duration))
        out_slide = elements[2]
        if self.state.previous_note is not None:
            self.state.measure_content.append(Note(
                fret_number=self.state.previous_note.fret_number,
                string_number=self.state.previous_note.string_number,
                duration=duration,
                out_slide=out_slide,
                is_tie=True
            ))
        return elements

    def make_silence(self, _input, _start, _end, elements):
        duration = gp.Duration.fromTime(int(self.state.note_duration))
        self.state.measure_content.append(Note(is_silence=True, duration=duration))
        return elements

    def make_string_number(self, _input, _start, _end, elements):
        string_number = int(elements[0].text)
        string_number = len(self.song.tracks[0].strings) + 1 - string_number
        self.state.string_number = string_number
        return elements

    def make_tempo(self, _input, _start, _end, elements):
        self.state.tempo = int(elements[4].text)
        self.state.time_signature_denominator = gp.Duration(value=duration_values[elements[1].text])
        return elements

    def make_marker(self, _input, _start, _end, elements):
        self.state.marker = elements[1].text
        return elements

    def make_triplet_feel(self, _input, _start, _end, elements):
        if elements[1].text == "e":
            self.state.triplet_feel = gp.TripletFeel.eighth
        elif elements[1].text == "s":
            self.state.triplet_feel = gp.TripletFeel.sixteenth
        else:
            self.state.triplet_feel = gp.TripletFeel.none

        return elements

    def make_note_duration_ext(self, _input, _start, _end, elements):
        duration_time = gp.Duration(value=duration_values[elements[0].text]).time
        if elements[1].text == ".":
            duration_time *= 1.5
        if elements[2].text == "t":
            duration_time *= (2 / 3)
        self.state.measure_time += duration_time
        self.state.note_duration = duration_time
        return elements

    def make_whitespace(self, _input, _start, _end):
        return


def export_song(song: Song, stream):
    gp_song = gp.Song()
    gp_song.artist = song.artist.name
    gp_song.tracks[0].name = song.artist.bass_player
    gp_song.tracks[0].indicateTuning = True
    gp_song.tracks[0].stringCount = 4

    gp_song.tracks[0].channel.instrument = 33

    grammar.tabdown.parse(song.tablature_source, actions=GuitarProActions(gp_song))
    gpfile = gp.io._open(gp_song, stream, 'wb', version=(5, 1, 0), encoding='cp1252')
    gpfile.writeSong(gp_song)
