import graphene
from graphene_django import DjangoObjectType

from quizzes.models import Quiz, Question, QuestionChoice, QuizBlank, Answer, CorrectAnswer


class QuizType(DjangoObjectType):
    class Meta:
        model = Quiz
        fields = ('id', 'title', 'steps', 'questions')


class QuestionType(DjangoObjectType):
    class Meta:
        model = Question
        fields = ('id', 'question_text', 'type', 'step', 'quiz', 'choices', 'correct_answer')


class QuestionChoiceType(DjangoObjectType):
    class Meta:
        model = QuestionChoice
        fields = ('id', 'content')


class CorrectAnswerType(DjangoObjectType):
    class Meta:
        model = CorrectAnswer
        fields = ('id', 'content', 'choices')


class QuizBlankType(DjangoObjectType):
    class Meta:
        model = QuizBlank
        fields = ('id', 'user_name', 'active_step', 'is_submitted', 'created_at', 'updated_at', 'quiz', 'answers')


class QuestionAnswerType(DjangoObjectType):
    class Meta:
        model = Answer
        fields = ('id', 'content', 'is_correct', 'choices')


class Query(graphene.ObjectType):
    quizzes = graphene.List(QuizType)
    questions = graphene.List(QuestionType)
    quiz_blanks = graphene.List(QuizBlankType)

    question = graphene.Field(QuestionType, id=graphene.ID())
    quiz_blank = graphene.Field(QuizBlankType, id=graphene.ID())

    blank_answer = graphene.Field(QuestionAnswerType, blank_id=graphene.ID(), question_id=graphene.ID())

    @staticmethod
    def resolve_quizzes(root, info):
        return Quiz.objects.all()

    @staticmethod
    def resolve_questions(root, info):
        return Question.objects.all().order_by('step')

    @staticmethod
    def resolve_quiz_blanks(root, info):
        return QuizBlank.objects.all()

    @staticmethod
    def resolve_quiz_blank(root, info, id):
        return QuizBlank.objects.get(pk=id)

    @staticmethod
    def resolve_question(root, info, id):
        return Question.objects.get(id=id)

    @staticmethod
    def resolve_blank_answer(root, info, blank_id, question_id):
        return Answer.objects.get(quiz_blank_id=blank_id, question_id=question_id)


class CreateQuizBlank(graphene.Mutation):
    class Arguments:
        quiz_id = graphene.ID(required=True)
        user_name = graphene.String(required=True)

    quiz_blank = graphene.Field(QuizBlankType)

    @staticmethod
    def mutate(root, info, quiz_id, user_name):
        try:
            quiz = Quiz.objects.get(id=quiz_id)
        except Quiz.DoesNotExist:
            raise Exception('Quiz does not exist')

        quiz_blank = QuizBlank(quiz=quiz, user_name=user_name)
        quiz_blank.save()

        return CreateQuizBlank(quiz_blank=quiz_blank)


class UpdateQuizBlankStep(graphene.Mutation):
    class Arguments:
        blank_id = graphene.ID(required=True)
        active_step = graphene.Int(required=True)

    quiz_blank = graphene.Field(QuizBlankType)

    @staticmethod
    def mutate(root, info, blank_id, active_step):
        try:
            quiz_blank = QuizBlank.objects.get(pk=blank_id)
        except QuizBlank.DoesNotExist:
            raise Exception('QuizBlank does not exist')

        quiz_blank.active_step = active_step
        quiz_blank.save()

        return UpdateQuizBlankStep(quiz_blank=quiz_blank)


class SubmitQuizBlank(graphene.Mutation):
    class Arguments:
        blank_id = graphene.ID(required=True)

    quiz_blank = graphene.Field(QuizBlankType)

    @staticmethod
    def mutate(root, info, blank_id):
        try:
            quiz_blank = QuizBlank.objects.get(id=blank_id)
        except QuizBlank.DoesNotExist:
            raise Exception('QuizBlank does not exist')

        if quiz_blank.is_submitted:
            raise Exception('QuizBlank is already submitted')

        # get all blank answers and compare to correct answers
        # then mark answers as correct if is
        answers = Answer.objects.filter(quiz_blank=quiz_blank).select_related('question', 'question__correct_answer').prefetch_related('choices')

        for answer in answers:
            is_correct = False
            question, correct_answer = answer.question, answer.question.correct_answer

            if correct_answer:
                if question.type == Question.Type.Input or question.type == Question.Type.NumericInput:
                    is_correct = answer.content == correct_answer.content

                if question.type == Question.Type.Radio or question.type == Question.Type.Checkbox:
                    choices = sorted([choice.id for choice in answer.choices.all()])
                    correct_choices = sorted([choice.id for choice in correct_answer.choices.all()])
                    is_correct = choices == correct_choices
            else:
                is_correct = True

            answer.is_correct = is_correct
            answer.save()

        quiz_blank.is_submitted = True
        quiz_blank.save()

        return SubmitQuizBlank(quiz_blank=quiz_blank)


class SubmitAnswer(graphene.Mutation):
    class Arguments:
        blank_id = graphene.ID(required=True)
        question_id = graphene.ID(required=True)
        content = graphene.String(required=False)
        choice_ids = graphene.List(graphene.ID)

    blank_answer = graphene.Field(QuestionAnswerType)

    @staticmethod
    def mutate(root, info, blank_id, question_id, content, choice_ids):
        try:
            quiz_blank = QuizBlank.objects.get(id=blank_id)
            question = Question.objects.get(id=question_id)
        except QuizBlank.DoesNotExist:
            raise Exception('QuizBlank does not exist')
        except Question.DoesNotExist:
            raise Exception('Question does not exist')

        defaults = {
            'content': content,
        }
        answer, is_created = Answer.objects.update_or_create(quiz_blank=quiz_blank, question=question, defaults=defaults)
        answer.choices.clear()
        question_choices = QuestionChoice.objects.filter(id__in=choice_ids)
        for choice in question_choices:
            answer.choices.add(choice)
        answer.save()

        return SubmitAnswer(blank_answer=answer)


class Mutation(graphene.ObjectType):
    create_quiz_blank = CreateQuizBlank.Field()
    update_quiz_blank_step = UpdateQuizBlankStep.Field()
    submit_quiz_blank = SubmitQuizBlank.Field()
    submit_blank_answer = SubmitAnswer.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
