# Generated by Django 3.0.5 on 2020-04-11 15:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tablatures', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Artist',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('bass_player', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('tablature_source', models.TextField()),
                ('artist', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='tablatures.Artist')),
            ],
        ),
        migrations.DeleteModel(
            name='Tablature',
        ),
    ]