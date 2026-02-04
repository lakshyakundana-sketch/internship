from django.urls import path
from .views import (
    ContactListCreateAPI, ContactDetailAPI,
    UserListCreateAPI, UserDetailAPI
)

urlpatterns = [
    path('api/contacts/', ContactListCreateAPI.as_view(), name='contact-list-create'),
    path('api/contacts/<int:pk>/', ContactDetailAPI.as_view(), name='contact-detail'),

    path('api/users/', UserListCreateAPI.as_view(), name='user-list-create'),
    path('api/users/<int:pk>/', UserDetailAPI.as_view(), name='user-detail'),
]
