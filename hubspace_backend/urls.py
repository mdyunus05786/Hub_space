from django.contrib import admin
from django.urls import path
from django.http import HttpResponse

from tasks import views as task_views

# Root view
def root_view(request):
    return HttpResponse("Welcome to the Hubspace App API!", content_type="text/plain")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', root_view),

    # API
    path('api/health', task_views.health),
    path('api/tasks', task_views.tasks_collection),
    path('api/tasks/<int:task_id>', task_views.task_item),
    path('api/tasks/<int:task_id>/complete', task_views.task_complete),
    path('api/tasks/<int:task_id>/visit', task_views.task_visit),
    path('api/analytics/summary', task_views.analytics_summary),
    path('api/analytics/completion', task_views.analytics_completion),
    path('api/analytics/reset', task_views.analytics_reset),
]
