from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from .forms import SignupForm
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Book, Borrow
from django.utils import timezone


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
 

@login_required
@require_POST
def borrow_view(request, id):
    book = get_object_or_404(Book, id=id)
    
    if not book.available:
        return JsonResponse({'error': 'Book is not available'}, status=400)
    
    # Mark book as unavailable
    book.available = False
    book.save()
    
    # Create a borrow record
    Borrow.objects.create(user=request.user, book=book)
    
    return JsonResponse({'status': 'borrowed'})


@login_required
@require_POST
def return_view(request, id):
    book = get_object_or_404(Book, id=id)
    
    # Find the active borrow record for this user and book
    record = Borrow.objects.filter(
        user=request.user, book=book, returned=False
    ).first()
    
    if not record:
        return JsonResponse({'error': 'No active borrow record found'}, status=400)
    
    # Update the record
    record.returned = True
    record.return_date = timezone.now()
    record.save()
    
    # Mark book as available again
    book.available = True
    book.save()
    
    return JsonResponse({'status': 'returned'})


@login_required
def borrowed_books_view(request):
    records = Borrow.objects.filter(
        user=request.user, returned=False
    ).select_related('book')
    
    return render(request, 'library/borrowed_books.html', {'records': records})

