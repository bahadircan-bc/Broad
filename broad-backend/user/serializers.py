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

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class AuthorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = ['profile_name', 'profile_picture']

class ReviewSerializer(serializers.HyperlinkedModelSerializer):
    author = AuthorSerializer()
    receiver = serializers.StringRelatedField(source='receiver.profile_name')
    class Meta:
        model = Review
        fields = ['pk', 'author', 'receiver', 'content', 'rating', 'date']

class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.StringRelatedField(source='user.username')
    email = serializers.StringRelatedField(source='user.email')
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
        fields = ['pk', 'user', 'email', 'profile_name', 'name', 'surname', 'profile_picture', 'trips_as_driver', 'trips_as_passenger', 'followers', 'following', 'reviews', 'written_reviews', 'average_rating']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups', 'profile']

class TripSerializer(serializers.HyperlinkedModelSerializer):
    passengers = ProfileSerializer(required=False, many=True)
    driver = ProfileSerializer(required=False)

    class Meta:
        model = Trip
        fields = ['pk', 'driver', 'passengers', 'departure', 'departure_coordinates', 'destination', 'destination_coordinates', 'fee', 'departure_date', 'departure_time','car_model', 'empty_seats', 'max_seats', 'note', 'on_going', 'terminated', 'is_hidden']

class HideTripSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Trip
        fields = ['is_hidden']

class CreateTripSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Trip
        fields = ['pk', 'driver', 'passengers', 'departure', 'departure_coordinates', 'destination', 'destination_coordinates', 'fee', 'departure_date', 'departure_time','car_model', 'empty_seats', 'max_seats', 'note', 'on_going', 'terminated', 'is_hidden']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        print(self.context['request'].user)
        user = self.context['request'].user
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError("Old password is incorrect.")

        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")

        return data

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user