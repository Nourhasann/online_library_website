from django import forms
from django.contrib.auth import get_user_model
from .models import Book

User = get_user_model()

class SignupForm(forms.ModelForm):
    password1 = forms.CharField(
        min_length=8,
        widget=forms.PasswordInput
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput
    )
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email is already registered.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        p1 = cleaned_data.get('password1')
        p2 = cleaned_data.get('password2')
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError("Passwords do not match.")
        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user


class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)


class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'author', 'category', 'description', 'cover_image', 'available']

    def __init__(self, *args, **kwargs):
        self.current_book_id = kwargs.pop('current_book_id', None)
        super().__init__(*args, **kwargs)
        self.fields['title'].required = True
        self.fields['author'].required = True

    def clean_title(self):
        title = self.cleaned_data.get('title')
        qs = Book.objects.filter(title__iexact=title)
        if self.current_book_id:
            qs = qs.exclude(id=self.current_book_id)
        if qs.exists():
            raise forms.ValidationError("A book with this title already exists.")
        return title

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100, required=True)
    email = forms.EmailField(required=True)
    message = forms.CharField(
        widget=forms.Textarea,
        min_length=10,
        required=True,
        error_messages={'min_length': 'Message must be at least 10 characters.'}
    )
