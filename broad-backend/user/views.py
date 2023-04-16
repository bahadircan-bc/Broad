from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login, logout
from user.models import Profile, Trip, Review
from django.db.models import Q
from rest_framework import viewsets, views
from rest_framework import permissions
from user.serializers import UserSerializer, GroupSerializer, ProfileSerializer, TripSerializer, ReviewSerializer, UserCreationSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.request import Request
from user.forms import CustomUserCreationForm
from rest_framework import authentication
from django.http import JsonResponse
from django.middleware.csrf import get_token

class LogInView(views.APIView):
    authentication_classes = [authentication.BasicAuthentication, authentication.SessionAuthentication]
    
    def post(self, request):
        print(request.data)
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request=request, username=username, password=password)
        if user is not None:
            login(request=request, user=user)
            return Response(status=200)
        else:
            return Response(status=401)

class LogOutView(views.APIView):
    authentication_classes = [authentication.BasicAuthentication, authentication.SessionAuthentication]
    
    def post(self, request):
        logout(request=request)
        return Response(status=200)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class CreateUserView(generics.CreateAPIView):
    """
     API endpoint that allows users to be created
    """
    serializer_class = UserCreationSerializer
    def post(self, request: Request):
        print(f'{request.data}')
        form = CustomUserCreationForm(request.data)
        if form.is_valid():
            form.save()
            return Response(status=200)
        return Response(status=500)


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows profiles to be viewed or edited.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class TripViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows trips to be viewed or edited.
    """
    queryset=Trip.objects.all()
    def get_queryset(self):
        profile = self.request.user.profile
        return Trip.objects.filter(driver=profile)
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class CreateTripView(generics.CreateAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

class UpdateTripView(generics.UpdateAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        profile = self.request.user.profile
        return Trip.objects.filter(driver=profile)
    
class DeleteTripView(generics.DestroyAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        profile = self.request.user.profile
        return Trip.objects.filter(driver=profile)
    
class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows reviews to be viewed or edited.
    """
    queryset = Review.objects.all()
    def get_queryset(self):
        profile = self.request.user.profile
        return Review.objects.filter(driver=profile)
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class CreateReviewView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

class UpdateReviewView(generics.UpdateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        profile = self.request.user.profile
        return Review.objects.filter(Q(author=profile) | Q(receiver=profile))
    
class DeleteReviewView(generics.DestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        profile = self.request.user.profile
        return Review.objects.filter(Q(author=profile) | Q(receiver=profile))
    
def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})