from django.urls import path,include

urlpatterns = [
    path('', include('library.urls')),  # Include URLs from library app
]
