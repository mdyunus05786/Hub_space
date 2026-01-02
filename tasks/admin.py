from django.contrib import admin

from .models import Task, TaskVisit


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'priority', 'due_date', 'is_completed', 'created_at', 'completed_at')
    list_filter = ('is_completed', 'priority', 'due_date')
    search_fields = ('title', 'description')


@admin.register(TaskVisit)
class TaskVisitAdmin(admin.ModelAdmin):
    list_display = ('id', 'task', 'action', 'visited_at')
    list_filter = ('action',)
    search_fields = ('task__title',)
