from django.urls import path

from .views import SongListView, AboutPageView, SongDetailView, SongCreateView, SongUpdateView, SongDeleteView, \
    generate_gp5

urlpatterns = [
    path('about/', AboutPageView.as_view(), name='about'),
    path('song/new/', SongCreateView.as_view(), name='song_new'),
    path('song/<int:pk>/delete/', SongDeleteView.as_view(), name='song_delete'),
    path('song/<int:pk>/edit/', SongUpdateView.as_view(), name='song_edit'),
    path('song/<int:pk>/guitarpro/', generate_gp5, name="song_gp5"),
    path('song/<int:pk>/', SongDetailView.as_view(), name="song_detail"),
    path('', SongListView.as_view(), name='home'),
]
