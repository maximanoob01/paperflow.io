from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        username = 'admin'
        password = 'CoerAdmin@2025'
        email    = 'admin@coer.ac.in'

        user, created = User.objects.get_or_create(username=username)
        user.email        = email
        user.is_staff     = True
        user.is_superuser = True
        user.is_active    = True
        user.department   = 'Examination Cell'
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(f'Superuser CREATED: {username} / {password}')
        else:
            self.stdout.write(f'Superuser UPDATED: {username} / {password}')