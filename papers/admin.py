from django.contrib import admin
from .models import Subject, Question, GeneratedPaper

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'department', 'semester']
    search_fields = ['code', 'name']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text', 'subject', 'part', 'co', 'btl', 'uploaded_by']
    list_filter = ['subject', 'part', 'co']
    search_fields = ['text']

@admin.register(GeneratedPaper)
class GeneratedPaperAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'status', 'created_by', 'created_at']
    list_filter = ['status', 'subject']