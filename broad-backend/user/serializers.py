from django.contrib.auth.models import User, Group
from user.models import Profile, Trip, Review
from rest_framework import serializers

class UserCreationSerializer(serializers.HyperlinkedModelSerializer):
    password1 = serializers.CharField()
    password2 = serializers.CharField()
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2', 'email']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups', 'profile']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ['user', 'profile_picture', 'trips_as_driver', 'trips_as_passenger', 'followers', 'following', 'reviews']
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        profile = Profile.objects.create(user=user, **validated_data)
        return profile

    def update(self, instance, validated_data):
        instance.profile_name = validated_data.get('profile_name', instance.profile_name)
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        return instance

class TripSerializer(serializers.HyperlinkedModelSerializer):
    passengers = UserSerializer(required=False, many=True)
    driver = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all(), required=False)

    class Meta:
        model = Trip
        fields = ['pk', 'driver', 'passengers', 'departure', 'destination', 'fee', 'departure_date', 'departure_time','car_model', 'empty_seats', 'max_seats', 'note', 'terminated']
        read_only_fields = ['driver']
    
    def create(self, validated_data):
        return Trip.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.departure = validated_data.get('departure', instance.departure)
        instance.destination = validated_data.get('destination', instance.destination)
        instance.departure_date = validated_data.get('departure_date', instance.departure_date)
        instance.departure_time = validated_data.get('departure_time', instance.departure_time)
        instance.fee = validated_data.get('fee', instance.fee)
        instance.max_seats = validated_data.get('max_seats', instance.max_seats)
        instance.empty_seats = validated_data.get('empty_seats', instance.empty_seats)
        instance.note = validated_data.get('note', instance.note)
        instance.car_model = validated_data.get('car_model', instance.car_model)
        instance.save()
        return instance

class ReviewSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Review
        fields = ['pk', 'author', 'receiver', 'content', 'rating', 'date']