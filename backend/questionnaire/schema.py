import graphene
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

import quizzes.schema


class Query(quizzes.schema.Query, graphene.ObjectType):
    pass


class Mutation(quizzes.schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)


@csrf_exempt
def graphql_view(request, *args, **kwargs):
    return GraphQLView.as_view(schema=schema, graphiql=True)(request, *args, **kwargs)
