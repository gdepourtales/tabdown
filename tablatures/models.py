from django.db import models
from django.urls import reverse
from multiselectfield import MultiSelectField


class Artist(models.Model):
    name = models.CharField(max_length=50)
    bass_player = models.CharField(max_length=50)

    def __str__(self):
        return self.name + " (" + self.bass_player + ")"

    class Meta:
        ordering = ['name']


class Song(models.Model):
    name = models.CharField(max_length=50)
    artist = models.ForeignKey('Artist', on_delete=models.PROTECT)
    tablature_source = models.TextField(blank=True, default='')

    def __str__(self):
        return self.name

    @property
    def number_of_measures(self):
        return len(self.tablature_source.splitlines())

    @property
    def artist_name(self):
        return self.artist.name

    def get_absolute_url(self):
        return reverse('song_detail', args=[str(self.id)])
