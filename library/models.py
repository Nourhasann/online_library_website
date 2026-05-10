from django.db import models
from django.contrib.auth.models import AbstractUser


#User Table
class User(AbstractUser):    # we are creating our own user model by inheriting from Django's built-in AbstractUser model, which already includes fields like username, email, password, etc.
    ROLE_CHOICES = (   #These are the only allowed values for the role field. 
        ('admin', 'Admin'),
        ('member', 'Member'),
    )
    # role column in the database will store either 'admin' or 'member', 
    # and the default value will be 'member' if no role is specified when creating a new user.

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')

    def __str__(self):
        return self.username
    

#Book Table
#Stores information about the books available in the library.
class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=100, blank=True)  # ← ADD THIS
    description = models.TextField(blank=True)
    cover_image = models.CharField(max_length=200, blank=True)
    available = models.BooleanField(default=True)
    def __str__(self):
        return self.title   
    

#Borrow Table
#Stores information about book borrowing transactions.
class Borrow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) # This creates a foreign key relationship to the User model, meaning each borrow record is associated with a specific user. If the user is deleted, all their borrow records will also be deleted (cascade delete).
    book = models.ForeignKey(Book, on_delete=models.CASCADE) # This creates a foreign key relationship to the Book model, meaning each borrow record is associated with a specific book. If the book is deleted, all related borrow records will also be deleted (cascade delete).
    borrow_date = models.DateTimeField(auto_now_add=True)  # This will automatically set the date and time when a book is borrowed.
    return_date = models.DateTimeField(null=True, blank=True) 
    returned = models.BooleanField(default=False) # This field indicates whether the book has been returned or not. It defaults to False when a book is borrowed and can be set to True when the book is returned.
    def __str__(self):  
        return f"{self.user.username} borrowed {self.book.title}"
