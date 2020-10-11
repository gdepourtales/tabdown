const duration_values = {
    'w': '1',
    'h': '2',
    'q': '4',
    'e': '8',
    's': '16',
    't': '32',
    'i': '64',
};

let tabdownActions = {
    currentString:1,

    make_song: function (input, start, end, elements) {
        const tuning = elements[0];
        const in_measures = elements[2].elements[0];
        if (!in_measures) {
            return [{
                tempo: {tempo:120, reference:"q"},
                marker: "",
                triplet_feel: false,
                notes: [],
                start_repeat: false,
                close_repeat: false
            }];
        }
        let measures = [];
        measures.push(in_measures.elements[1]);
        const other_measures = in_measures.elements[3].elements.map(function (item) {
            return item.elements[2];
        });


        measures = measures.concat(other_measures).map(function (item) {
            return {
                tempo: item.elements[0].tempo,
                marker: item.elements[1].marker,
                triplet_feel: item.triplet_feel,
                notes: item.notes,
                start_repeat: item.elements[3].start_repeat,
                close_repeat: item.elements[5].close_repeat,
            }
        });
        return {
            tuning: tuning,
            measures: measures
        }
    },

    make_tuning: function(input, star, end, elements) {
        let nb_strings = 1 + elements[2].elements.length;
        let strings = [elements[1].text];
        for (let s = 0; s < nb_strings - 1; s++) {
            strings.push(elements[2].elements[s].elements[1].text);
        }
        return strings;
    },

    make_start_repeat: function (input, start, end, elements) {
        return true;
    },
    make_close_repeat: function (input, start, end, elements) {
        let num = 1;
        if (elements[1].elements.length > 0) {
            num = parseInt(elements[1].elements[0].text + elements[1].elements[1].text);
        }
        return {num: num};
    },

    make_notes: function (input, start, end, elements) {
        let notes = [];

        if (elements[2].num) {
            for (let i = 0; i < elements[2].num; i++) {
                notes = notes.concat(elements[2].notes);
            }
        } else {
            notes.push(elements[2]);
        }

        elements[3].elements.forEach(function (beat) {
            if (beat.elements[3].num) {
                for (let i = 0; i < beat.elements[3].num; i++) {
                    notes = notes.concat(beat.elements[3].notes);
                }
            } else {
                notes.push(beat.elements[3]);
            }
        });
        return notes;
    },
    make_chord: function (input, start, end, elements) {
        let notes = [];
        // Push first chord note
        notes.push(elements[1]);

        elements[2].elements.forEach(function (treeNode) {
            notes.push(treeNode.elements[1]);
        });


        return {
            type: "chord",  // TODO: Create an enumeration
            notes: notes
        }
    },

    make_string_number: function(input, start, end, elements) {
        this.currentString = parseInt(elements[0].text);
        return this.currentString;
    },



    make_repeated_notes: function (input, start, end, elements) {
        let numRepeats = parseInt(elements[0].text + elements[1].text);
        let notes = [elements[3]]
        elements[4].elements.forEach(function (node) {
            notes.push(node.elements[1]);
        });
        return {num: numRepeats, notes: notes};
    },

    make_chord_note: function (input, start, end, elements) {
        return {
            type: "note",  // TODO: Create an enumeration
            string: _.isInteger(elements[0]) ? elements[0] : this.currentString,
            in_slide: elements[1],
            prebend: elements[2].prebend,
            grace: elements[3].text === "" ? undefined : parseInt(elements[3].elements[1].text),
            is_ghost: elements[4].text === "g",
            is_dead:elements[5].text === "d",
            fret: parseInt(elements[6].text),
            duration: elements[7],
            hammer_on: elements[8].text === "_",
            bend: elements[9].bend,
            out_slide: elements[10]
        }
    },
    make_note: function (input, start, end, elements) {
        return {
            type: "note",  // TODO: Create an enumeration
            string: this.currentString,
            in_slide: elements[0],
            prebend: elements[1].prebend,
            grace: elements[2].text === "" ? undefined : parseInt(elements[2].elements[1].text),
            is_ghost: elements[3].text === "g",
            is_dead:elements[4].text === "d",
            fret: parseInt(elements[5].text),
            duration: elements[6],
            hammer_on: elements[7].text === "_",
            bend: elements[8].bend,
            out_slide: elements[9]
        }
    },
    make_chord_tied_note: function (input, start, end, elements) {
        return {
            type: "chord_tied_note", // TODO: Create an enumeration
            string: this.currentString,
            duration: elements[2]
        }
    },
    make_tied_note: function (input, start, end, elements) {
        return {
            type: "tied_note",  // TODO: Create an enumeration
            duration: elements[1]
        }
    },

    make_bend: function (input, start, end, elements) {
        return {bend: elements[1].text};
    },

    make_prebend: function (input, start, end, elements) {
        return {prebend: elements[1].text};
    },

    make_slide: function (input, start, end, elements) {
        return input.substring(start, end);
    },

    make_silence: function (input, start, end, elements) {
        return {
            type: "rest",
            duration: elements[1]
        };
    },

    make_tempo: function (input, start, end, elements) {
        return {
            tempo: parseInt(elements[4].text),
            reference: duration_values[elements[1].text]
        };
    },
    make_marker: function (input, start, end, elements) {
        return elements[1].text;
    },
    make_triplet_feel: function (input, start, end, elements) {
        return {triplet_feel: elements[1].text};
    },
    make_note_duration_ext: function (input, start, end, elements) {
        let duration_value = duration_values[elements[0].text];
        let time = 960 * (4.0 / parseInt(duration_value));
        time *= elements[1].text === "." ? 1.5 : 1;
        time *= elements[2].text === "t" ? 2 / 3 : 1;
        return {
            duration: duration_value,
            time: time,
            dot: elements[1].text === ".",
            triplet: elements[2].text === "t"
        };
    },
    make_whitespace: function() {
        return;
    }
}
