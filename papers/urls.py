from django.urls import path
from .views import (
    SubjectListCreateView, SubjectDeleteView,
    QuestionListView, QuestionDeleteView,
    ExcelUploadView, ExcelTemplateView,
    GeneratePaperView, PaperListView,
    PaperDetailView, PaperDeleteView,
    DownloadPDFView, DashboardStatsView,
)

urlpatterns = [
    path('subjects/',              SubjectListCreateView.as_view()),
    path('subjects/<int:pk>/',     SubjectDeleteView.as_view()),
    path('questions/',             QuestionListView.as_view()),
    path('questions/<int:pk>/',    QuestionDeleteView.as_view()),
    path('questions/upload/',      ExcelUploadView.as_view()),
    path('questions/template/',    ExcelTemplateView.as_view()),
    path('papers/generate/',       GeneratePaperView.as_view()),
    path('papers/',                PaperListView.as_view()),
    path('papers/<int:pk>/',       PaperDetailView.as_view()),
    path('papers/<int:pk>/delete/', PaperDeleteView.as_view()),
    path('papers/<int:pk>/pdf/',   DownloadPDFView.as_view()),
    path('dashboard/stats/',       DashboardStatsView.as_view()),
]