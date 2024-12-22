from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api_students.views import *

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'student-records', StudentRecordViewSet)
router.register(r'activity-types', ActivityTypeViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'disciplines', DisciplineViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'codes', CodeViewSet)
router.register(r'logs', LogViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('delete_all_students/', delete_all_students_view),
    # path('export_students/', export_students_view),
    path('export_student_records/', export_student_records_view),
    path('export_codes/', export_codes_view),
]
