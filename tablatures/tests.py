from django.test import TestCase
from django.urls import reverse
from .models import Song, Artist


class SongModelTest(TestCase):

    def setUp(self):
        artist = Artist.objects.create(name="Artist", bass_player="Bass Player")
        Song.objects.create(name="One song", artist=artist, tablature_source="some tablature")

    def test_song_content(self):
        song = Song.objects.get(id=1)
        expected_object_name = f'{song.name}'
        self.assertEqual(expected_object_name, 'One song')


class HomePageViewTest(TestCase):

    def setUp(self) -> None:
        artist = Artist.objects.create(name="Artist", bass_player="Bass Player")
        Song.objects.create(name="One song", artist=artist, tablature_source="some tablature")

    def test_view_url_exists_at_proper_location(self):
        resp = self.client.get('/')
        self.assertEqual(resp.status_code, 200)

    def test_view_url_by_name(self):
        resp = self.client.get(reverse('home'))
        self.assertEqual(resp.status_code, 200)

    def test_view_uses_correct_template(self):
        resp = self.client.get(reverse('home'))
        self.assertEqual(resp.status_code, 200)
        self.assertTemplateUsed(resp, 'home.html')
