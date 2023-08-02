from rest_framework.pagination import CursorPagination

class SmallResultsCursorPagination(CursorPagination):
    page_size = 20
    ordering = '-created_at'
