from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate, login, logout
from user.models import Profile, Trip, Review
from django.db.models import Q, Avg
from rest_framework import viewsets, views
from rest_framework import permissions
from user.serializers import UserSerializer, GroupSerializer, ProfileSerializer, TripSerializer, ReviewSerializer, UserCreationSerializer, ChangePasswordSerializer, CreateTripSerializer, HideTripSerializer
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request
from user.forms import CustomUserCreationForm
from rest_framework import authentication
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.core.mail import send_mail
import random

class LogInView(views.APIView):
    authentication_classes = [authentication.BasicAuthentication, authentication.SessionAuthentication]
    
    def post(self, request):
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
        form = CustomUserCreationForm(request.data)
        if form.is_valid():
            user = form.save()
            verification_code = random.randrange(12345, 98765)
            send_mail(
            'Welcome to BROAD',
            f'Hello {user.username}. Verification Code : {verification_code}',
            'bahadircan1997@windowslive.com',
            [user.email],
            fail_silently=False,
            )
            ###########
            return Response(data=verification_code,status=200)
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
    queryset = Profile.objects.all().annotate(_average_rating=Avg('reviews__rating'))
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class AuthenticatedProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

class UpdateProfileView(generics.GenericAPIView):
    profile_serializer_class = ProfileSerializer
    user_serializer_class = UserSerializer
    profile_queryset = Profile.objects.all()
    user_queryset = User.objects.all()

    # Add this method for PATCH requests
    def patch(self, request:Request, *args, **kwargs):
        profile_instance = self.get_object_from_queryset(self.profile_queryset, kwargs['profile_pk'])
        user_pk = profile_instance.user.pk
        user_instance = self.get_object_from_queryset(self.user_queryset, user_pk)

        profile_serializer = self.profile_serializer_class(profile_instance, data=request.data.get('profile'), partial=True, context={'request': request})
        user_serializer = self.user_serializer_class(user_instance, data=request.data.get('user'), partial=True, context={'request': request})
        profile_serializer.is_valid() 
        user_serializer.is_valid()

        if profile_serializer.is_valid() and user_serializer.is_valid():
            profile_serializer.save()
            user_serializer.save()
            return Response({'profile': profile_serializer.data, 'user': user_serializer.data})
        else:
            return Response({'errors': {'profile': profile_serializer.errors, 'user': user_serializer.errors}}, status=status.HTTP_400_BAD_REQUEST)
        
    def get_object_from_queryset(self, queryset, pk):
        return generics.get_object_or_404(queryset, pk=pk)
        
class UpdateProfilePictureView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def get_object_from_queryset(self, queryset, pk):
        return self.request.user.profile
    
    def get_object(self):
        return self.request.user.profile
    
    def patch(self, request, *args, **kwargs):
        print(request.data)
        return super().patch(request, *args, **kwargs)
    
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(status=status.HTTP_204_NO_CONTENT)

class TripViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows trips to be viewed or edited.
    """
    def get_queryset(self):
        return Trip.objects.exclude(Q(driver=self.request.user.profile) | Q(terminated=True) | Q(passengers=self.request.user.profile) | Q(is_hidden=True))
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

class ActiveTripViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows trips to be viewed or edited.
    """
    queryset=Trip.objects.all()
    def get_queryset(self):
        profile = self.request.user.profile
        return Trip.objects.filter(Q(driver=profile) & Q(terminated=False))
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

class RegisteredTripViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows trips to be viewed or edited.
    """
    queryset=Trip.objects.all()
    def get_queryset(self):
        profile = self.request.user.profile
        return Trip.objects.filter(Q(passengers=profile) & Q(terminated=False))
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

class PastTripViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows trips to be viewed or edited.
    """
    queryset=Trip.objects.all()
    def get_queryset(self):
        profile = self.request.user.profile
        return Trip.objects.filter((Q(passengers=profile) | Q(driver=profile)) & Q(terminated=True))
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class CreateTripView(generics.ListCreateAPIView):
    queryset=Trip.objects.all()
    serializer_class = CreateTripSerializer
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        profile = self.request.user.profile
        serializer.save(driver=profile)

class UpdateTripView(generics.UpdateAPIView):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        profile = self.request.user.profile
        return Trip.objects.filter(driver=profile)
    
class HideTripView(generics.UpdateAPIView):
    serializer_class = HideTripSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Trip.objects.filter(driver=self.request.user.profile)
        
class DeleteTripView(generics.DestroyAPIView):
    serializer_class = HideTripSerializer
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
        return Review.objects.filter(Q(author=profile) | Q(receiver=profile))
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