from django.contrib import admin

from user.models import Profile, Trip, Review

admin.site.register(Profile)
admin.site.register(Trip)
admin.site.register(Review)

# Register your models here.
