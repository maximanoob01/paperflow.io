from rest_framework import serializers
from .models import Subject, Question, GeneratedPaper

class SubjectSerializer(serializers.ModelSerializer):
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = '__all__'

    def get_question_count(self, obj):
        return obj.questions.count()


class QuestionSerializer(serializers.ModelSerializer):
    subject_name    = serializers.CharField(source='subject.name', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    marks           = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = '__all__'

    def get_marks(self, obj):
        return obj.get_marks()


class GeneratedPaperSerializer(serializers.ModelSerializer):
    questions      = QuestionSerializer(many=True, read_only=True)
    subject        = SubjectSerializer(read_only=True)
    subject_name   = serializers.CharField(source='subject.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    # group questions by part for easy frontend rendering
    part_a = serializers.SerializerMethodField()
    part_b = serializers.SerializerMethodField()
    part_c = serializers.SerializerMethodField()

    class Meta:
        model = GeneratedPaper
        fields = '__all__'

    def _filter_part(self, obj, part):
        return QuestionSerializer(
            obj.questions.filter(part=part).order_by('co'), many=True
        ).data

    def get_part_a(self, obj): return self._filter_part(obj, 'A')
    def get_part_b(self, obj): return self._filter_part(obj, 'B')
    def get_part_c(self, obj): return self._filter_part(obj, 'C')


class PaperListSerializer(serializers.ModelSerializer):
    subject         = SubjectSerializer(read_only=True)
    subject_name    = serializers.CharField(source='subject.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = GeneratedPaper
        exclude = ['questions']