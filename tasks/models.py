from django.db import models


class Task(models.Model):
    PRIORITY_CHOICES = (
        (1, 'High'),
        (2, 'Medium'),
        (3, 'Low'),
    )

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=2)
    estimate_minutes = models.IntegerField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'priority': self.priority,
            'estimate_minutes': self.estimate_minutes,
            'is_completed': self.is_completed,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
        }


class TaskVisit(models.Model):
    ACTION_CHOICES = (
        ('view', 'View'),
        ('create', 'Create'),
        ('update', 'Update'),
        ('complete', 'Complete'),
    )

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='visits')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES, default='view')
    visited_at = models.DateTimeField(auto_now_add=True)
