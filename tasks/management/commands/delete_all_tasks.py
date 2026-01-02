from django.core.management.base import BaseCommand
from tasks.models import Task, TaskVisit

class Command(BaseCommand):
    help = 'Delete all tasks and visits from the database.'

    def handle(self, *args, **options):
        TaskVisit.objects.all().delete()
        Task.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('All tasks and visits deleted.'))
