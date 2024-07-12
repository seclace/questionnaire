import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import { groupBlankQuestionsByStep } from '../../utils/group-blank-questions-by-step.util';
import { Steps } from '../Steps/Steps';
import { LoaderErrorContainer } from '../LoaderErrorContainer/LoaderErrorContainer';

const GET_QUIZ_BLANK = gql`
query QuizBlank($id: ID!) {
  quizBlank(id: $id) {
    id
    userName
    activeStep
    isSubmitted
    createdAt
    updatedAt
    answers {
      id
      content
      choices {
        id
        content
      }
    }
    quiz {
      id
      steps
      questions {
        id
        questionText
        type
        step
        choices {
          id
          content
        }
        correctAnswer {
          id
          content
          choices {
            id
            content
          }
        }
      }
    }
  }
}
`;

export function QuizBlank() {
  const { blankId } = useParams();
  const { data, loading: isLoading, error } = useQuery(GET_QUIZ_BLANK, {
    variables: {
      id: blankId,
    },
  });
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (data?.quizBlank) {
      setSteps(groupBlankQuestionsByStep(data.quizBlank));
    }
  }, [data]);

  return (
    <LoaderErrorContainer error={error} isLoading={isLoading}>
      <div>It's a new Quiz Blank: {data?.quizBlank?.id}</div>
      <div>userName: {String(data?.quizBlank?.userName)}</div>
      <div>isSubmitted: {String(data?.quizBlank?.isSubmitted)}</div>
      <hr/>
      <Steps
        steps={steps}
        activeStepId={data?.quizBlank?.activeStep}
        maxStepId={data?.quizBlank?.quiz?.steps}
        isCorrectAnswerShown={data?.quizBlank?.isSubmitted}
        isEditable={!data?.quizBlank?.isSubmitted}/>
    </LoaderErrorContainer>
  );
}
