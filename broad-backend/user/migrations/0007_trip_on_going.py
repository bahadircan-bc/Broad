# Generated by Django 4.2 on 2023-04-16 21:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_profile_name_profile_surname'),
    ]

    operations = [
        migrations.AddField(
            model_name='trip',
            name='on_going',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
