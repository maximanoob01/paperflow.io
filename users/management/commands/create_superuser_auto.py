from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@coer.ac.in',
                password='Admin@1234',
                department='Examination Cell'
            )
            self.stdout.write('Superuser created: admin / Admin@1234')
        else:
            self.stdout.write('Superuser already exists')