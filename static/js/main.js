var VF = Vex.Flow;

// Create an SVG renderer and attach it to the DIV element named "boo".
var div = document.getElementById("tablature");
var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

const flask = new CodeFlask('#editor', { language: 'js',
    lineNumbers: true,
    readonly: $("#editor").hasClass("readonly") });

let tablatureSource = $('#id_tablature_source');
tablatureSource.hide();

let scrollWidth = 0;


function update() {
    let source = flask.getCode();
    tablatureSource.val(source);
    drawTabdown(source);
}


let drawTabdown = _.debounce(
function(source) {

    try {
        var tabdown = TABDOWN.parse(source, {actions: tabdownActions});
        renderer.resize(20, 200);
        var context = renderer.getContext();
        context.clear();
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
        renderTablature(context, tabdown.measures);
        scrollWidth = context.width;
        $("#tuning").text("Tuning: " + tabdown.tuning.toString());
        $("#error").text("");
    } catch (e) {
        $("#error").text(e.toString());
    }

}, 2000, {
    'leading': true,
    'trailing': true
});

flask.onUpdate(function (code) {
    if (code === "") {
        return;
    }
    update();
});

function scrollTabToMeasure(textarea) {
    let lineNumber = textarea.value.substr(0, textarea.selectionStart).split("\n").length;
    let ratio = lineNumber / textarea.value.split("\n").length;
    let wrapper = $("#tablature_wrapper");
    wrapper.scrollLeft(ratio * scrollWidth - wrapper.width() / 2 );
}

function scrollTabToMeasure2(textarea) {
    let ratio = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
    let width = scrollWidth - $("#tablature_wrapper").width()
    $("#tablature_wrapper").scrollLeft(ratio * width);
}

flask.elTextarea.addEventListener("scroll", function(e) {
    scrollTabToMeasure2(this);
});

flask.elTextarea.addEventListener("keyup", function(e) {
   scrollTabToMeasure(this);
});

flask.elTextarea.addEventListener("click", function(e) {
    scrollTabToMeasure(this);
});


flask.updateCode(tablatureSource.val());

function renderTablature(context, tabdown) {
    let startPosX = 10;
    let startPosY = 40;
    let widthByNote = 30;
    let widthByRest = 40;
    let notePadding = 20;

    function createRest(note) {
        let key = note.duration.duration === "2" ? "b/4" : "d/5";
        let rest = new VF.StaveNote({
            clef: "treble",
            stem_direction: 1,
            keys: [key],
            duration: note.duration.duration + "r"
        })

        if (note.duration.dot) {
            rest.addDotToAll();
        }
        return rest;
    }

    function createTabNote(notes, previousNote, previousChord, tabNotes, tabNoteIndex) {

        let max_duration = 128;
        let has_dot = false;
        let is_ghost = false;
        let positions = [];
        let max_time = 0;
        let ties = [];

        notes.forEach(function (note) {
            if (!(note.string) && !!previousNote) {
                note.string = previousNote.string;
            } else if(!(note.string)) {
                note.string = 1;
            }

            if (note.type === "chord_tied_note") {
                note.fret = _.find(previousChord.notes, {'string': note.string}).fret;
            } else if (note.type === "tied_note") {
                note.fret = previousNote.fret;
            }

            if (note.is_dead) {
                note.fret = "x";
            }

            positions.push({str: 4 - note.string + 1, fret: note.fret});

            // Durations have an reversed scale (whole = 1, half = 2, quarter = 4, ...)
            max_duration = max_duration < note.duration.duration ? max_duration : note.duration.duration;
            max_time = max_time < note.duration.time ? note.duration.time : max_time;
            has_dot = has_dot || note.duration.dot
            is_ghost = is_ghost || note.is_ghost;
        });

        let tabNote = new VF.TabNote({
            positions: positions,
            duration: max_duration + (has_dot ? "d" : "")
        }, true);
        if (has_dot) {
            tabNote.addDot();
        }

        if (is_ghost) {
            tabNote.setGhost(true);
        }

        // Grace Notes
        notes.forEach(function (note) {
            if (note.grace !== undefined) {
                tabNote.addModifier(new VF.GraceNoteGroup(
                    [new VF.GraceTabNote({
                        positions: [{str: 4 - note.string + 1, fret: note.grace}],
                        duration: '32'
                    })]));

            }
        });

        // Bends
        notes.forEach(function (note) {
            if (note.prebend === "/") {
                tabNote.addModifier(new VF.Bend(null, null, [{type: VF.Bend.UP, text: 'Pre'}]));
            } else if (note.prebend === "/\\") {
                tabNote.addModifier(new VF.Bend(null, null, [
                    {type: VF.Bend.UP, text: 'Pre'},
                    {type: VF.Bend.DOWN, text: ''}
                ]));
            }

            if (note.bend === "/") {
                tabNote.addModifier(new VF.Bend(null, null, [{type: VF.Bend.UP, text: 'Bend'}]));
            } else if (note.bend === "/\\") {
                tabNote.addModifier(new VF.Bend(null, null, [
                    {type: VF.Bend.UP, text: 'Bend'},
                    {type: VF.Bend.DOWN, text: ''}
                ]));
            } else if (note.bend === "/\\/") {
                tabNote.addModifier(new VF.Bend(null, null, [
                    {type: VF.Bend.UP, text: 'Bend'},
                    {type: VF.Bend.DOWN, text: ''},
                    {type: VF.Bend.UP, text: ''}
                ]));
            }
        });

        // Ties
        notes.forEach(function (note, noteIndex) {
            if (note.type === "chord_tied_note") {
                ties.push(new VF.TabTie({
                    first_note: tabNoteIndex > 0 ? tabNotes[tabNoteIndex - 1] : null,
                    last_note: tabNote,
                    first_indices: [_.findIndex(previousChord.notes, {'string': note.string})],
                    last_indices: [noteIndex]
                }));
            }
            if (note.type === "tied_note") {
                ties.push(new VF.TabTie({
                    first_note: tabNoteIndex > 0 ? tabNotes[tabNoteIndex - 1] : null,
                    last_note: tabNote,
                    first_indices: [0],
                    last_indices: [0]
                }));
            }
        });

        // Hammer Ons
        notes.forEach(function (note, noteIndex) {
            if (note.hammer_on) {
                ties.push(VF.TabTie.createHammeron({
                    first_note: tabNoteIndex > 0 ? tabNotes[tabNoteIndex - 1] : null,
                    last_note: tabNote,
                    first_indices: [0],
                    last_indices: [noteIndex]
                }));
            }
        });

        tabNote.render_options.draw_stem_through_stave = false;

        return {tab_note: tabNote, ties: ties, time: max_time};
    }

    function createSlides(notes, tabNotes, tabNoteIndex) {
        let slides = [];
        // Slides
        notes.forEach(function (note, noteIndex) {
            let first_note = null;
            let last_note = null;
            let slideFn = null;
            if (_.isString(note.in_slide) && note.in_slide !== "") {
                first_note = tabNoteIndex > 0 ? tabNotes[tabNoteIndex - 1] : null;
                last_note = tabNotes[tabNoteIndex];
                slideFn = note.in_slide === "/" ? VF.TabSlide.createSlideUp : VF.TabSlide.createSlideDown;
            }
            if (_.isString(note.out_slide) && note.out_slide !== "") {
                first_note = tabNotes[tabNoteIndex];
                last_note = tabNoteIndex < tabNotes.length - 1 ? tabNotes[tabNoteIndex + 1] : null;
                slideFn = note.out_slide === "/" ? VF.TabSlide.createSlideUp : VF.TabSlide.createSlideDown;
            }

            if (_.isFunction(slideFn)) {
                slides.push(slideFn({
                    first_note: first_note,
                    last_note: last_note,
                    first_indices: [0],
                    last_indices: [0]
                }));
            }
        });
        return slides;
    }

    // Previous note is valid across measures
    let previousNote = undefined;
    let previousChord = undefined;
    let previousTimeSignature = null;
    let staveNum = 1;

    let currentString = 1;

    tabdown.forEach(function (measure) {

        let tabNotes = [];
        let ties = [];
        let staveWidth = 0;
        let slides = [];
        let time = 0;

        let tripletBuffer = [];
        let triplets = [];
        let row = 0;

        measure.notes.forEach(function (note, tabNoteIndex) {
            if (note.type === "note" || note.type === "tied_note") {
                let createdTabNote = createTabNote([note], previousNote, previousChord, tabNotes, tabNoteIndex);
                if (note.duration.triplet) {
                    tripletBuffer.push(createdTabNote.tab_note);
                }
                tabNotes.push(createdTabNote.tab_note);
                ties = ties.concat(createdTabNote.ties);
                previousNote = note;
                time += createdTabNote.time;
            } else if (note.type === "chord") {
                let createdTabNote = createTabNote(note.notes, previousNote, previousChord, tabNotes, tabNoteIndex);
                let longest_note = _.maxBy(note.notes, function (n) {
                    return n.duration.time;
                });
                if (longest_note.duration.triplet) {
                    tripletBuffer.push(createdTabNote.tab_note);
                }
                tabNotes.push(createdTabNote.tab_note);
                ties = ties.concat(createdTabNote.ties);
                previousNote = note.notes[0];
                previousChord = note;
                time += createdTabNote.time;
            } else if (note.type === "rest") {
                let createdRest = createRest(note);
                if (note.duration.triplet) {
                    tripletBuffer.push(createdRest);
                }
                tabNotes.push(createdRest);
                time += note.duration.time;
            }

            if (tripletBuffer.length === 3) {
                triplets.push(new VF.Tuplet(tripletBuffer));
                tripletBuffer = [];
            }
        });

        if (tripletBuffer.length > 0) {
            triplets.push(new VF.Tuplet(tripletBuffer, {
                num_notes: tripletBuffer.length, notes_occupied: 3
            }));
        }

        // Slides
        measure.notes.forEach(function (note, tabNoteIndex) {
            if (note.type === "note") {
                if (!!note.in_slide || !!note.out_slide) {
                    let s = createSlides([note], tabNotes, tabNoteIndex);
                    slides = slides.concat(s);
                }
            }
        });


        function reduce(numerator, denominator) {
            var gcd = function gcd(a, b) {
                return b ? gcd(b, a % b) : a;
            };
            gcd = gcd(numerator, denominator);
            return [numerator / gcd, denominator / gcd];
        }

        let multiplier = 1;

        let firstNoteStartX = 0;
        let timeSig = reduce((time / 4) * multiplier, 960 * multiplier);
        if (timeSig[1] < 4) {
            let m = 4;
            timeSig = [timeSig[0] * m, timeSig[1] * m];
        }

        if (!_.isEqual(previousTimeSignature, timeSig)) {
            staveWidth += widthByNote * 2;
            firstNoteStartX = 20;
        }


        tabNotes.forEach(function(n) {
            if (n.noteType === "r") {
                staveWidth += widthByRest;
            } else {
                staveWidth += widthByNote;
            }
            n.modifiers.forEach(function(m) {
                if (!!m.width) {
                    staveWidth += m.width * 2;
                }
            });
        });


        if (measure.start_repeat) {
            staveWidth += 10;
        }
        if (measure.close_repeat) {
            staveWidth += 10;
        }
        let stave = new VF.TabStave(startPosX, startPosY, staveWidth + 20);

        renderer.resize(renderer.ctx.width + stave.width, renderer.ctx.height);

        if (!_.isEqual(previousTimeSignature, timeSig)) {
            stave.addTimeSignature(timeSig[0] + "/" + timeSig[1]);
            previousTimeSignature = timeSig;
        }

        if (!_.isEmpty(measure.tempo)) {
            stave.setTempo({ duration: measure.tempo.reference, dots: 0, bpm: measure.tempo.tempo }, 0);
        }

        if (!_.isEmpty(measure.marker)) {
            stave.setSection(measure.marker, 0);
        }

        if (measure.start_repeat) {
            stave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
        }

        if (measure.close_repeat) {
            stave.setEndBarType(VF.Barline.type.REPEAT_END);
            stave.setText(measure.close_repeat.num + "x", VF.Modifier.Position.ABOVE,
                { shift_y: 10, justification: VF.TextNote.Justification.RIGHT });
        }

        stave.setText(staveNum, VF.Modifier.Position.ABOVE,
            { shift_y: 10, justification: VF.TextNote.Justification.LEFT, font:{size:6} });
        _.last(stave.modifiers).font.size = 10;
        staveNum++;

        stave.setNumLines(4);
        stave.setContext(context).draw();

        startPosX = stave.width + stave.x;
        startPosY = stave.y;

        let beams = VF.Beam.generateBeams(tabNotes);

        VF.Formatter.SimpleFormat(tabNotes, firstNoteStartX,  { paddingBetween: notePadding });
        tabNotes.forEach(function(n) {
           n.setStave(stave).setContext(context).draw();
        });

        beams.forEach(function(b) {b.setContext(context).draw()});

        ties.forEach(function (t) {
            t.setContext(context).draw()
        });
        slides.forEach(function (s) {
            s.setContext(context).draw()
        });

        triplets.forEach(function (t) {
            t.setContext(context).draw();
        });


    });

}

