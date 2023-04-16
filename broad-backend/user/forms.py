from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from user.models import Profile
from django import forms

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def save(self, commit=True):
        user = super(CustomUserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
            Profile.create(user=user, profile_name=user.username)

        return user
