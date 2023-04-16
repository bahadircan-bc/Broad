from django.db import models
from django.contrib.auth.models import User

from django.core.validators import MaxValueValidator, MinValueValidator


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile') # Delete profile when user is deleted
    profile_name = models.CharField(max_length=50)
    profile_picture = models.ImageField(upload_to='profile_pics', blank=True)
    followers = models.ManyToManyField('self', related_name='following', symmetrical=False, blank=True)

    def __str__(self):
        return f'{self.user.username} Profile' #show how we want it to be displayed
    
    @classmethod
    def create(cls, user, profile_name):
        profile = cls(user=user, profile_name=profile_name)
        profile.save()
        return profile

class Review(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.SET_NULL, related_name='written_reviews', null=True)
    receiver = models.ForeignKey(Profile, on_delete=models.SET_NULL, related_name='reviews', null=True)
    content = models.CharField(max_length=500)
    rating = models.IntegerField(validators=[MaxValueValidator(5), MinValueValidator(0)])
    date = models.DateField()

    def __str__(self) -> str:
        return f'{self.rating}/5 : {self.content}'

class Trip(models.Model):
    driver = models.ForeignKey(Profile, on_delete=models.SET_NULL, related_name='trips_as_driver', null=True)
    passengers = models.ManyToManyField(Profile, related_name='trips_as_passenger', blank=True)
    departure = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departure_date = models.DateField()
    departure_time = models.TimeField()
    fee = models.FloatField()
    max_seats = models.IntegerField()
    empty_seats = models.IntegerField()
    note = models.CharField(max_length=500)
    car_model = models.CharField(max_length=50)
    terminated = models.BooleanField()
    date_published = models.DateField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.departure} -> {self.destination} : {self.departure_date}'

# Create your models here.
