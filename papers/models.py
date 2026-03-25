from django.db import models
from users.models import User

class Subject(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    semester = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Question(models.Model):
    PART_CHOICES = [
        ('A', 'Part-A (1 Mark)'),
        ('B', 'Part-B (2 Marks)'),
        ('C', 'Part-C (3 Marks)'),
    ]
    CO_CHOICES = [
        ('CO1', 'CO1'),
        ('CO2', 'CO2'),
        ('CO3', 'CO3'),
    ]
    BTL_CHOICES = [
        (1, 'BTL-1 Remember'),
        (2, 'BTL-2 Understand'),
        (3, 'BTL-3 Apply'),
        (4, 'BTL-4 Analyze'),
        (5, 'BTL-5 Evaluate'),
        (6, 'BTL-6 Create'),
    ]

    subject     = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='questions')
    part        = models.CharField(max_length=1, choices=PART_CHOICES)   # A / B / C
    co          = models.CharField(max_length=3, choices=CO_CHOICES)     # CO1 / CO2 / CO3
    btl         = models.IntegerField(choices=BTL_CHOICES)               # 1–6
    text        = models.TextField()
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def get_marks(self):
        return {'A': 1, 'B': 2, 'C': 3}[self.part]

    def __str__(self):
        return f"[{self.part}][{self.co}] {self.text[:60]}"


class GeneratedPaper(models.Model):
    STATUS_CHOICES = [('DRAFT', 'Draft'), ('FINAL', 'Final')]

    subject         = models.ForeignKey(Subject, on_delete=models.CASCADE)
    title           = models.CharField(max_length=300)
    program         = models.CharField(max_length=200, blank=True)   # Program Name & Specialization
    semester        = models.CharField(max_length=50, blank=True)
    course_name     = models.CharField(max_length=200, blank=True)
    course_code     = models.CharField(max_length=50, blank=True)
    exam_type       = models.CharField(max_length=100, default='MID TERM EXAMINATION, EVEN SEMESTER')
    session         = models.CharField(max_length=20, default='2025-26')
    duration        = models.CharField(max_length=50, default='1 Hour')
    max_marks       = models.IntegerField(default=20)
    instructions    = models.TextField(
        default='Attempt all parts given in the question paper. '
                'No student is allowed to leave the examination hall before the completion of the time.'
    )
    questions       = models.ManyToManyField(Question, related_name='papers')
    status          = models.CharField(max_length=10, choices=STATUS_CHOICES, default='DRAFT')
    created_by      = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.subject.code})"