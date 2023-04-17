from django.contrib.auth.models import User, Group
from user.models import Profile, Trip, Review
from rest_framework import serializers

class UserCreationSerializer(serializers.HyperlinkedModelSerializer):
    password1 = serializers.CharField()
    password2 = serializers.CharField()
    name = serializers.CharField()
    surname = serializers.CharField()
    class Meta:
        model = User
        fields = ['name', 'surname', 'username', 'password1', 'password2', 'email']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups', 'profile']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class ReviewSerializer(serializers.HyperlinkedModelSerializer):
    author = serializers.StringRelatedField(source='author.profile_name')
    receiver = serializers.StringRelatedField(source='receiver.profile_name')
    class Meta:
        model = Review
        fields = ['pk', 'author', 'receiver', 'content', 'rating', 'date']

class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    trips_as_driver = serializers.HyperlinkedRelatedField(
        view_name='trips-detail',
        many=True,
        read_only=True
    )
    trips_as_passenger = serializers.HyperlinkedRelatedField(
        view_name='registered_trips-detail',
        many=True,
        read_only=True
    )
    reviews= ReviewSerializer(many=True)
    average_rating = serializers.SerializerMethodField()

    def get_average_rating(self, obj):
        return obj.average_rating

    class Meta:
        model = Profile
        fields = ['user', 'profile_name', 'name', 'surname', 'profile_picture', 'trips_as_driver', 'trips_as_passenger', 'followers', 'following', 'reviews', 'written_reviews', 'average_rating']


class TripSerializer(serializers.HyperlinkedModelSerializer):
    passengers = ProfileSerializer(required=False, many=True)
    driver = serializers.StringRelatedField(source='driver.profile_name')

    class Meta:
        model = Trip
        fields = ['pk', 'driver', 'passengers', 'departure', 'destination', 'fee', 'departure_date', 'departure_time','car_model', 'empty_seats', 'max_seats', 'note', 'on_going', 'terminated']

