from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    path('books/', views.book_list_view, name='book_list'),
    path('books/add/', views.add_book_view, name='add_book'),
    path('books/borrowed/', views.borrowed_books_view, name='borrowed_books'),
    path('books/<int:id>/borrow/', views.borrow_view, name='borrow_book'),
    path('books/<int:id>/return/', views.return_view, name='return_book'),
    path('books/<int:id>/edit/', views.edit_book_view, name='edit_book'),
    path('books/<int:id>/delete/', views.delete_book_view, name='delete_book'),
    path('books/<int:id>/', views.book_details_view, name='book_details'),

    path('', views.home_view, name='home'),
    path('about/', views.about_view, name='about'),
    path('contact/', views.contact_view, name='contact'),
    path('messages/', views.messages_view, name='messages'),  
    path('search/', views.search_page, name='search_page'),
    path('search/api/', views.search_books, name='search_api'),
    path('welcome/', views.welcome_view, name='welcome'),
]
