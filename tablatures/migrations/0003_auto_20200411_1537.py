# Generated by Django 3.0.5 on 2020-04-11 15:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tablatures', '0002_auto_20200411_1509'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='tablature_source',
            field=models.TextField(null=True),
        ),
    ]
