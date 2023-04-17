"""
URL configuration for Project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from user import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'profiles', views.ProfileViewSet)
router.register(r'trips', views.TripViewSet, basename='trips')
router.register(r'reviews', views.ReviewViewSet)
router.register(r'active_trips', views.ActiveTripViewSet, basename='active_trips')
router.register(r'registered_trips', views.RegisteredTripViewSet, basename='registered_trips')
router.register(r'past_trips', views.PastTripViewSet, basename='past_trips')
router.register(r'whoami', views.AuthenticatedProfileViewSet, basename='whoami')

urlpatterns = [
    path('csrftoken/', views.get_csrf_token),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('login/', views.LogInView.as_view()),
    path('logout/', views.LogOutView.as_view()),
    path('users/create/', views.CreateUserView.as_view(),  name='create_user'),
    path('profiles/update/<int:profile_pk>', views.UpdateProfileView.as_view(), name='update_profile'),
    path('change_password/', views.ChangePasswordView.as_view(), name='change_password'),
    path('trips/create/', views.CreateTripView.as_view(), name='create_trip'),
    path('trips/update/<int:pk>', views.UpdateTripView.as_view(),  name='update_trip'),
    path('trips/delete/<int:pk>', views.DeleteTripView.as_view(),  name='delete_trip'),
    path('reviews/create/', views.CreateReviewView.as_view(), name='create_review'),
    path('reviews/update/<int:pk>', views.UpdateReviewView.as_view(),  name='update_review'),
    path('reviews/delete/<int:pk>', views.DeleteReviewView.as_view(),  name='delete_review'),
    path('', include(router.urls)),
]
