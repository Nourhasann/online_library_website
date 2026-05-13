from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from .forms import SignupForm, BookForm
from .models import Book, Borrow
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone

User = get_user_model()


def signup_view(request):
    form = SignupForm(request.POST or None)
    if request.method == 'POST':
        if form.is_valid():
            user = form.save(commit=False)
            role = request.POST.get('role', 'member')
            user.role = role
            user.save()
            login(request, user)
            if user.role == 'admin':
                return redirect('book_list')
            else:
                return redirect('book_list')
    return render(request, 'library/signup.html', {'form': form})


def login_view(request):
    error = None
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(request, username=user_obj.username, password=password)
            if user is not None:
                login(request, user)
                if user.role == 'admin':
                    return redirect('book_list')
                else:
                    return redirect('book_list')
            else:
                error = 'Wrong email or password. Please try again.'
        except User.DoesNotExist:
            return redirect('signup')
    return render(request, 'library/login.html', {'error': error})


def logout_view(request):
    logout(request)
    return redirect('login')


@login_required
@require_POST
def borrow_view(request, id):
    book = get_object_or_404(Book, id=id)
    if not book.available:
        return JsonResponse({'error': 'Book is not available'}, status=400)
    book.available = False
    book.save()
    Borrow.objects.create(user=request.user, book=book)
    return JsonResponse({'status': 'borrowed'})


@login_required
@require_POST
def return_view(request, id):
    book = get_object_or_404(Book, id=id)
    record = Borrow.objects.filter(
        user=request.user, book=book, returned=False
    ).first()
    if not record:
        return JsonResponse({'error': 'No active borrow record found'}, status=400)
    record.returned = True
    record.return_date = timezone.now()
    record.save()
    book.available = True
    book.save()
    return JsonResponse({'status': 'returned'})


@login_required
def borrowed_books_view(request):
    records = Borrow.objects.filter(
        user=request.user, returned=False
    ).select_related('book')
    return render(request, 'library/borrowed_books.html', {'records': records})


def book_list_view(request):
    books = Book.objects.all()
    for book in books:
        book.is_borrowed = Borrow.objects.filter(book=book, returned=False).exists()
        if request.user.is_authenticated:
            book.borrowed_by_me = Borrow.objects.filter(
                book=book, user=request.user, returned=False
            ).exists()
        else:
            book.borrowed_by_me = False
    return render(request, 'library/book_list.html', {'books': books})


def book_details_view(request, id):
    book = get_object_or_404(Book, id=id)
    is_borrowed = Borrow.objects.filter(book=book, returned=False).exists()
    borrowed_by_me = False
    if request.user.is_authenticated:
        borrowed_by_me = Borrow.objects.filter(
            book=book, user=request.user, returned=False
        ).exists()
    return render(request, 'library/book_details.html', {
        'book': book,
        'is_borrowed': is_borrowed,
        'borrowed_by_me': borrowed_by_me,
    })


@login_required
def add_book_view(request):
    if request.user.role != 'admin':
        return redirect('book_list')
    form = BookForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        form.save()
        return redirect('book_list')
    return render(request, 'library/add_book.html', {'form': form})


@login_required
def edit_book_view(request, id):
    if request.user.role != 'admin':
        return redirect('book_list')
    book = get_object_or_404(Book, id=id)
    form = BookForm(request.POST or None, instance=book, current_book_id=id)
    if request.method == 'POST' and form.is_valid():
        form.save()
        return redirect('book_details', id=id)
    return render(request, 'library/edit_book.html', {'form': form, 'book': book})


@login_required
def delete_book_view(request, id):
    if request.user.role != 'admin':
        return redirect('book_list')
    book = get_object_or_404(Book, id=id)
    if request.method == 'POST':
        book.delete()
        return redirect('book_list')
    return render(request, 'library/book_list.html', {'books': Book.objects.all()})


def home_view(request):
    return render(request, 'library/home.html')

def about_view(request):
    return render(request, 'library/about.html')

def contact_view(request):
    return render(request, 'library/contact.html')
