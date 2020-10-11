from django.test import TestCase
import os

from .song_exporter import export_song
from .models import Song, Artist

dirname = os.path.dirname(__file__)


class GuitarProExport(TestCase):

    def setUp(self):
        artist = Artist.objects.create(name="Test Band", bass_player="Test Bass Player")
        Song.objects.create(
            name="Name",
            artist=artist,
            tablature_source=""
        )

    def read_tabdown(self, file_path):
        file = open(os.path.join(dirname, file_path))
        tabdown = file.read()
        file.close()
        return tabdown

    def test_song(self, name, tablature):
        song = Song.objects.get(id=1)
        song.name = name
        song.tablature_source = tablature
        return song

    def test_simple_tabdown(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/simple.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/simple_tabdown.gp5"))

    def test_repeated_notes(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/repeated_notes.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/repeated_notes.gp5"))

    def test_repeated_measures(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/repeated_measures.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/repeated_measures.gp5"))

    def test_grace_notes(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/grace_notes.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/grace_notes.gp5"))

    def test_slides(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/slides.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/slides.gp5"))

    def test_tied_notes(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/tied_notes.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/tied_notes.gp5"))

    def test_hammer_on_notes(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/hammer_on.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/hammer_on.gp5"))

    def test_bend(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/bend.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/bend.gp5"))

    def test_rests(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/rests.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/rests.gp5"))

    def test_rests_dotted(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/rests_dotted.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/rests_dotted.gp5"))

    def test_rests_tuples(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/rests_tuple.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/rests_tuple.gp5"))

    def test_markers(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/markers.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/markers.gp5"))

    def test_chords(self):
        song = self.test_song("simple_tabdown", self.read_tabdown("../grammar/tests/files/chords.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/chords.gp5"))


class SongsExport(TestCase):

    def create_song(self, artist_name, bass_player, song_name, tablature):
        artist: Artist = Artist.objects.create(name=artist_name, bass_player=bass_player)
        song = Song.objects.create(
            name=song_name,
            artist=artist,
            tablature_source=tablature,
            tuning=("E2", "A2", "D3", "G3")
        )
        return Song.objects.get(id=song.id)

    def read_tabdown(self, file_path):
        file = open(os.path.join(dirname, file_path))
        tabdown = file.read()
        file.close()
        return tabdown

    def test_lets_dance(self):
        song = self.create_song("David Bowie", "Carmine Rojas", "Let's Dance",
                                self.read_tabdown("../grammar/tests/files/songs/let_s_dance.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/let_s_dance.gp5"))

    def test_my_generation(self):
        song = self.create_song("The Who", "John Entwistle", "My Generation",
                                self.read_tabdown("../grammar/tests/files/songs/my_generation.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/my_generation.gp5"))

    def test_riders_on_the_storm(self):
        song = self.create_song("The Doors", "Jerry Scheff", "Riders on the Storm",
                                self.read_tabdown("../grammar/tests/files/songs/riders_on_the_storm.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/riders_on_the_storm.gp5"))

    def test_good_times(self):
        song = self.create_song("Chic", "Somebody", "Good Times",
                                self.read_tabdown("../grammar/tests/files/songs/good_times.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/good_times.gp5"))

    def test_easy_to_love(self):
        song = self.create_song("Slut", "Somebody", "Easy to Love",
                                self.read_tabdown("../grammar/tests/files/songs/easy_to_love.tabdown"))
        export_song(song=song, stream=os.path.join(dirname, "tests/easy_to_love.gp5"))
