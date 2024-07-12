from django.contrib import admin

from quizzes.models import Quiz, Question, QuestionChoice, QuizBlank, Answer, CorrectAnswer


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    pass


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    pass


@admin.register(QuestionChoice)
class QuestionChoiceAdmin(admin.ModelAdmin):
    pass


@admin.register(QuizBlank)
class QuizBlankAdmin(admin.ModelAdmin):
    pass


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    pass


@admin.register(CorrectAnswer)
class CorrectAnswerAdmin(admin.ModelAdmin):
    pass
