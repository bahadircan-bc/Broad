from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from user.models import Profile
from django import forms

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    name = forms.CharField(max_length=50)
    surname = forms.CharField(max_length=50)

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def save(self, commit=True):
        user = super(CustomUserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
            profile = Profile.create(user=user, profile_name=user.username, name=self.cleaned_data['name'], surname=self.cleaned_data['surname'])
            profile.save()

        return user
