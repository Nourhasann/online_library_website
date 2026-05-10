from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from .forms import SignupForm

User = get_user_model()


def signup_view(request):
    form = SignupForm(request.POST or None)
    # if user submitted the form → fill form with their data
    # if user just opened the page → empty form

    if request.method == 'POST':  # user clicked the Sign Up button
        if form.is_valid():  # all fields are filled correctly
            user = form.save(commit=False)  # create a new user object but don't save it to the database yet because we need to add the role first
            role = request.POST.get('role', 'member')  # get the role from the form
            user.role = role
            user.save()  # save the user to the database
            login(request, user)
            return redirect('login')  # redirect to the login page after successful signup
    return render(request, 'library/signup.html', {'form': form})


def login_view(request):
    error = None
    if request.method == 'POST':  # user clicked the Login button
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user_obj = User.objects.get(email=email)  # search the database for a user with this email
            user = authenticate(request, username=user_obj.username, password=password)  # check if the password is correct for this user
            if user is not None:  # if authentication was successful (email exists and password is correct)
                login(request, user)  # save session — user is now logged in
                if user.role == 'admin':
                    return redirect('login')
                else:
                    return redirect('login')
            else:
                error = 'Wrong email or password. Please try again.'
        except User.DoesNotExist:
            error = "No account found with this email."
    return render(request, 'library/login.html', {'error': error})  
    
 
def logout_view(request):
    logout(request) # clear the session — user is now logged out
    return redirect('login') # redirect to the login page after logout
 

