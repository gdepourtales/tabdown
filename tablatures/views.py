from django.views.generic import ListView, TemplateView, DetailView, CreateView, UpdateView, DeleteView
from .models import Song
from django.urls import reverse_lazy
from django.http import FileResponse
from .song_exporter import export_song
import io


class SongListView(ListView):
    model = Song
    template_name = 'home.html'
    context_object_name = 'all_songs_list'
    ordering = ['artist', 'name']


class SongDetailView(DetailView):
    model = Song
    template_name = 'song_detail.html'


class SongCreateView(CreateView):
    model = Song
    template_name = 'song_new.html'
    fields = ['name', 'artist', 'tablature_source']
    initial = {'tablature_source': "tuning(E2,A2,D3,G3) tempo(q,120) marker(Intro) -w"}


class SongUpdateView(UpdateView):
    model = Song
    template_name = 'song_edit.html'
    fields = ['name', 'artist', 'tablature_source']


class SongDeleteView(DeleteView):
    model = Song
    template_name = 'song_delete.html'
    success_url = reverse_lazy('home')


class AboutPageView(TemplateView):
    template_name = 'about.html'


def generate_gp5(request, pk):
    song = Song.objects.get(id=pk)
    buffer = io.BytesIO()
    export_song(song, buffer)
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename=song.name + '.gp5')
