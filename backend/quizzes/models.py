from django.db import models
from django.utils.translation import gettext_lazy as _


class Quiz(models.Model):
    title = models.CharField(max_length=100)
    steps = models.IntegerField()

    def __str__(self):
        return f'{self.title} ({self.steps})'

    class Meta:
        verbose_name_plural = 'quizzes'


class Question(models.Model):
    class Type(models.TextChoices):
        Input = 'IN', _('Input')
        NumericInput = 'NU', _('Numeric Input')
        Checkbox = 'CH', _('Checkbox')
        Radio = 'RA', _('Radio')

    question_text = models.CharField(max_length=255, null=True, blank=True)
    type = models.CharField(choices=Type.choices, max_length=2, null=False, blank=False)
    step = models.IntegerField()

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')

    def __str__(self):
        return f'{self.question_text} ({self.step})'


class CorrectAnswer(models.Model):
    content = models.CharField(max_length=255, null=True, blank=True)

    question = models.OneToOneField(Question, on_delete=models.CASCADE, related_name='correct_answer')

    def __str__(self):
        return f'{self.content} ({self.question})'


class QuizBlank(models.Model):
    user_name = models.CharField(max_length=255, null=False, blank=False)
    active_step = models.IntegerField(default=1, null=False, blank=False)
    is_submitted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='quiz_blank')


class Answer(models.Model):
    content = models.CharField(max_length=255, null=True, blank=True)
    is_correct = models.BooleanField(default=False)

    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    quiz_blank = models.ForeignKey(QuizBlank, on_delete=models.CASCADE, related_name='answers')

    def __str__(self):
        return f'{self.quiz_blank.user_name}: {self.content} ({self.question}) (is_correct={self.is_correct})'


class QuestionChoice(models.Model):
    content = models.CharField(max_length=255, null=False, blank=False)

    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    correct_answer = models.ForeignKey(CorrectAnswer, on_delete=models.CASCADE, related_name='choices', null=True)
    answers = models.ManyToManyField(Answer, related_name='choices')

    def __str__(self):
        return f'{self.question}: {self.content}'
