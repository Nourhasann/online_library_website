from django.urls import path  # lets us define URL patterns
from . import views           # imports our views.py from same folder

urlpatterns = [
    path('signup/', views.signup_view, name='signup'),  # /signup/ → signup_view
    path('login/', views.login_view, name='login'),     # /login/  → login_view
    path('logout/', views.logout_view, name='logout'),  # /logout/ → logout_view
    path('books/<int:id>/borrow/', views.borrow_view, name='borrow'), # /books/<id>/borrow/ → borrow_view
    path('books/<int:id>/return/', views.return_view, name='return'), # /books/<id>/return/ → return_view
    path('borrowed/', views.borrowed_books_view, name='borrowed_books'),  # /borrowed/ → borrowed_books_view

    path('books/', views.book_list_view, name='book_list'),
    path('books/add/', views.add_book_view, name='add_book'),
    path('books/<int:id>/', views.book_details_view, name='book_details'),
    path('books/<int:id>/edit/', views.edit_book_view, name='edit_book'),
    path('books/<int:id>/delete/', views.delete_book_view, name='delete_book'),



    
]
