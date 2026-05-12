from django.urls import path  # lets us define URL patterns
from . import views           # imports our views.py from same folder

urlpatterns = [
    path('signup/', views.signup_view, name='signup'),  # /signup/ → signup_view
    path('login/', views.login_view, name='login'),     # /login/  → login_view
    path('logout/', views.logout_view, name='logout'),  # /logout/ → logout_view
    path('books/<int:id>/borrow/', views.borrow_view, name='borrow'), # /books/<id>/borrow/ → borrow_view
    path('books/<int:id>/return/', views.return_view, name='return'), # /books/<id>/return/ → return_view
    path('borrowed/', views.borrowed_books_view, name='borrowed_books'),  # /borrowed/ → borrowed_books_view
]
