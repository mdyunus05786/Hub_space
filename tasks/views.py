from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def analytics_reset(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    # Accept both query params and POST body
    range_type = request.GET.get('range') or request.POST.get('range')
    date_str = request.GET.get('date') or request.POST.get('date')
    today = now().date()
    deleted = 0
    if range_type == 'week':
        start = today - timedelta(days=today.weekday())
        end = start + timedelta(days=6)
        deleted = Task.objects.filter(due_date__range=[start, end]).delete()[0]
    elif range_type == 'month':
        start = today.replace(day=1)
        days_in_month = (start.replace(month=start.month % 12 + 1, day=1) - timedelta(days=1)).day
        end = start.replace(day=days_in_month)
        deleted = Task.objects.filter(due_date__range=[start, end]).delete()[0]
    elif range_type == 'year':
        start = today.replace(month=1, day=1)
        end = today.replace(month=12, day=31)
        deleted = Task.objects.filter(due_date__range=[start, end]).delete()[0]
    elif range_type == 'day' and date_str:
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            deleted = Task.objects.filter(due_date=target_date).delete()[0]
        except Exception:
            return JsonResponse({'error': 'Invalid date'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid range or missing date'}, status=400)
    return JsonResponse({'deleted': deleted})
# from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
# New completion efficiency endpoint
@require_GET
def analytics_completion(request):
    import calendar
    from django.db.models import Count, Q
    from datetime import datetime
    today = now().date()
    range_type = request.GET.get('range', 'week')
    labels, values, completedCounts, totalCounts = [], [], [], []
    if range_type == 'week':
        start = today - timedelta(days=6)
        for i in range(7):
            d = start + timedelta(days=i)
            label = d.strftime('%a')
            completed = Task.objects.filter(is_completed=True, completed_at__date=d).count()
            total = Task.objects.filter(due_date=d).count()
            percent = round((completed / max(total, 1)) * 100)
            labels.append(label)
            values.append(percent)
            completedCounts.append(completed)
            totalCounts.append(total)
    elif range_type == 'month':
        start = today.replace(day=1)
        days_in_month = calendar.monthrange(today.year, today.month)[1]
        for i in range(days_in_month):
            d = start + timedelta(days=i)
            label = d.strftime('%d')
            completed = Task.objects.filter(is_completed=True, completed_at__date=d).count()
            total = Task.objects.filter(due_date=d).count()
            percent = round((completed / max(total, 1)) * 100)
            labels.append(label)
            values.append(percent)
            completedCounts.append(completed)
            totalCounts.append(total)
    elif range_type == 'year':
        for m in range(1, 13):
            label = calendar.month_abbr[m]
            completed = Task.objects.filter(is_completed=True, completed_at__year=today.year, completed_at__month=m).count()
            total = Task.objects.filter(due_date__year=today.year, due_date__month=m).count()
            percent = round((completed / max(total, 1)) * 100)
            labels.append(label)
            values.append(percent)
            completedCounts.append(completed)
            totalCounts.append(total)
    return JsonResponse({
        'labels': labels,
        'values': values,
        'completedCounts': completedCounts,
        'totalCounts': totalCounts,
    })
import json
from datetime import date, datetime, timedelta

from django.http import JsonResponse
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt

from .models import Task, TaskVisit


def _json_error(message, status=400):
    return JsonResponse({'error': message}, status=status)


def _parse_body(request):
    if not request.body:
        return {}
    try:
        return json.loads(request.body.decode('utf-8'))
    except Exception:
        return None


def health(request):
    return JsonResponse({'ok': True, 'time': now().isoformat()})


@csrf_exempt
def tasks_collection(request):
    if request.method == 'GET':
        try:
            completed = request.GET.get('completed')
            due_date = request.GET.get('due_date')
            limit = int(request.GET.get('limit') or 200)

            qs = Task.objects.all().order_by('-created_at')
            if completed in ('true', 'false'):
                qs = qs.filter(is_completed=(completed == 'true'))
            if due_date:
                try:
                    qs = qs.filter(due_date=date.fromisoformat(due_date))
                except ValueError:
                    return _json_error('Invalid due_date. Expected YYYY-MM-DD.')

            items = [t.to_dict() for t in qs[:limit]]
            return JsonResponse({'items': items, 'count': len(items)})
        except ValueError:
            return _json_error('Invalid limit. Expected an integer.', status=400)

    if request.method == 'POST':
        body = _parse_body(request)
        if body is None:
            return _json_error('Invalid JSON.')

        title = (body.get('title') or '').strip()
        if not title:
            return _json_error('Title is required.')

        due_date_val = None
        if body.get('due_date'):
            try:
                due_date_val = date.fromisoformat(body['due_date'])
            except ValueError:
                return _json_error('Invalid due_date. Expected YYYY-MM-DD.')

        task = Task.objects.create(
            title=title,
            description=(body.get('description') or '').strip(),
            due_date=due_date_val,
            priority=int(body.get('priority') or 2),
            estimate_minutes=body.get('estimate_minutes'),
        )
        TaskVisit.objects.create(task=task, action='create')
        return JsonResponse(task.to_dict(), status=201)

    return _json_error('Method not allowed.', status=405)


@csrf_exempt
def task_item(request, task_id: int):
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return _json_error('Task not found.', status=404)

    if request.method == 'GET':
        return JsonResponse(task.to_dict())

    if request.method == 'PUT':
        body = _parse_body(request)
        if body is None:
            return _json_error('Invalid JSON.')

        if 'title' in body:
            title = (body.get('title') or '').strip()
            if not title:
                return _json_error('Title cannot be empty.')
            task.title = title
        if 'description' in body:
            task.description = (body.get('description') or '').strip()
        if 'priority' in body:
            task.priority = int(body.get('priority') or 2)
        if 'estimate_minutes' in body:
            task.estimate_minutes = body.get('estimate_minutes')
        if 'due_date' in body:
            if body.get('due_date'):
                try:
                    task.due_date = date.fromisoformat(body['due_date'])
                except ValueError:
                    return _json_error('Invalid due_date. Expected YYYY-MM-DD.')
            else:
                task.due_date = None

        task.save()
        return JsonResponse(task.to_dict())

    if request.method == 'DELETE':
        task.delete()
        return JsonResponse({'ok': True})

    return _json_error('Method not allowed.', status=405)


@csrf_exempt
def task_complete(request, task_id: int):
    if request.method != 'POST':
        return _json_error('Method not allowed.', status=405)
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return _json_error('Task not found.', status=404)

    if not task.is_completed:
        task.is_completed = True
        task.completed_at = now()
        task.save()
        TaskVisit.objects.create(task=task, action='complete')
    return JsonResponse(task.to_dict())


@csrf_exempt
def task_visit(request, task_id: int):
    if request.method != 'POST':
        return _json_error('Method not allowed.', status=405)
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return _json_error('Task not found.', status=404)

    body = _parse_body(request)
    if body is None:
        return _json_error('Invalid JSON.')

    action = (body.get('action') or 'view').strip()
    if action not in dict(TaskVisit.ACTION_CHOICES):
        action = 'view'

    TaskVisit.objects.create(task=task, action=action)
    return JsonResponse({'ok': True})


def analytics_summary(request):
    # Today
    today = now().date()
    completed_today = Task.objects.filter(is_completed=True, completed_at__date=today).count()
    remaining_today = Task.objects.filter(is_completed=False, due_date=today).count()
    total_active = Task.objects.filter(is_completed=False).count()

    # 7 days window
    start = today - timedelta(days=6)
    created_7d = Task.objects.filter(created_at__date__gte=start, created_at__date__lte=today).count()
    completed_7d = Task.objects.filter(is_completed=True, completed_at__date__gte=start, completed_at__date__lte=today).count()

    # Completion rate: completed / (created + active baseline) is tricky; keep it simple:
    # rate = completed_7d / max(created_7d, 1)
    completion_rate_7d = round((completed_7d / max(created_7d, 1)) * 100)

    daily = []
    for i in range(7):
        d = start + timedelta(days=i)
        daily.append({
            'date': d.isoformat(),
            'completed': Task.objects.filter(is_completed=True, completed_at__date=d).count(),
        })

    return JsonResponse({
        'completed_today': completed_today,
        'remaining_today': remaining_today,
        'total_active': total_active,
        'created_7d': created_7d,
        'completed_7d': completed_7d,
        'completion_rate_7d': completion_rate_7d,
        'daily': daily,
    })
