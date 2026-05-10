from django.core.management.base import BaseCommand
from library.models import Book


class Command(BaseCommand):  # this is the name of the command we will run in the terminal: python manage.py load_books
    help = 'Load 10 books into the database'   # this is a description of what the command does, which will be shown when we run python manage.py help load_books

    def handle(self, *args, **kwargs):   # this is the method that will be executed when we run the command. 
        #It contains the logic to load the books into the database.
        # if books already exist, don't add them again
        if Book.objects.exists():
            self.stdout.write('Books already loaded, skipping.')
            return


       # we define a list of dictionaries, where each dictionary contains the data for one book.
        books = [
            {
                'title': 'Prolog Fundamentals',
                'author': 'Sam Key',
                'category': 'Programming',
                'description': 'Introduces Prolog concepts including facts, rules, and queries. A great starting point for logic programming beginners.',
                'cover_image': 'Prolog Fundamentals.jpg',
                'available': True,
            },
            {
                'title': 'AI Basics',
                'author': 'Tom Taulli',
                'category': 'AI',
                'description': 'Explains AI fundamentals including machine learning, neural networks, and real-world applications of artificial intelligence.',
                'cover_image': 'AI Basics.jpg',
                'available': True,
            },
            {
                'title': 'Web Development 101',
                'author': 'Josie S. Major',
                'category': 'Programming',
                'description': 'Introduction to HTML, CSS, and JavaScript for building modern, responsive websites from scratch.',
                'cover_image': 'Web Development 101.jpg',
                'available': True,
            },
            {
                'title': 'Data Science Essentials',
                'author': 'Amar Sahay',
                'category': 'Data Science',
                'description': 'Covers data analysis, visualization, statistics, and machine learning basics using Python.',
                'cover_image': 'Data Science Essentials.jpg',
                'available': True,
            },
            {
                'title': 'Machine Learning',
                'author': 'Ryan Turner',
                'category': 'AI',
                'description': 'Explains ML algorithms and real-world applications.',
                'cover_image': 'Machine Learning.jpg',
                'available': True,
            },
            {
                'title': 'Database Management Systems',
                'author': 'Sotirios Zygiaris',
                'category': 'Database',
                'description': 'Explains database design and SQL concepts.',
                'cover_image': 'Database Management Systems.jpg',
                'available': True,
            },
            {
                'title': 'Networking Fundamentals',
                'author': 'Crystal Panek',
                'category': 'Networking',
                'description': 'Introduces networking devices and protocols.',
                'cover_image': 'Networking Fundamentals.png',
                'available': True,
            },
            {
                'title': 'Cybersecurity Basics',
                'author': 'Pete Michaels',
                'category': 'Security',
                'description': 'This book explains the importance of cybersecurity and methods used to protect systems and networks.',
                'cover_image': 'Cybersecurity Basics.jpg',
                'available': True,
            },
            {
                'title': 'Java Programming',
                'author': 'Joyce Farrell',
                'category': 'Programming',
                'description': 'Teaches Java fundamentals and OOP concepts.',
                'cover_image': 'Java Programming.jpg',
                'available': True,
            },
            {
                'title': 'Cloud Computing Concepts',
                'author': 'Thomas Erl',
                'category': 'Cloud Computing',
                'description': 'This book explains cloud computing architecture, services and modern cloud technologies.',
                'cover_image': 'Cloud Computing Concepts.png',
                'available': True,
            },
        ]

        # loop through all books and insert into database
        for book_data in books:
            Book.objects.create(**book_data)
            self.stdout.write(f'Added: {book_data["title"]}')

        self.stdout.write(self.style.SUCCESS('All 10 books loaded successfully!'))