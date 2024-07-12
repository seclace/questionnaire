import { gql, useQuery } from '@apollo/client';

import './Quizzes.css';
import { LoaderErrorContainer } from '../LoaderErrorContainer/LoaderErrorContainer';

const GET_QUIZZES = gql`
query {
  quizzes {
    id
    title
    steps
    questions {
      id
    }
  }
}
`;

const GET_BLANKS = gql`
query {
  quizBlanks {
    id
    userName
    activeStep
    isSubmitted
    createdAt
    updatedAt
    quiz {
      questions {
        id
      }
    }
    answers {
      id
      isCorrect
      content
      choices {
        id
      }
    }
  }  
}
`;

function Quizzes() {
  const { loading: isLoading, error, data } = useQuery(GET_QUIZZES);
  const { loading: isLoadingBlanks, error: blanksError, data: blanksData } = useQuery(GET_BLANKS);

  return (
    <LoaderErrorContainer isLoading={isLoading || isLoadingBlanks} error={error || blanksError}>
      Quizzes:
      {
        data?.quizzes.map(quiz => (
          <div key={quiz.id} className={'quiz-info'}>
            <div><b>{quiz.title}</b></div>
            <div>Steps: {quiz.steps}</div>
            <div>Questions: {quiz.questions.length}</div>
            <a href={`quiz/${quiz.id}/new_blank`}>Answer the quiz</a>
          </div>
        ))
      }
      <hr/>
      Quiz Blanks:
      {
        blanksData?.quizBlanks.map(blank => (
          <div key={blank.id} className={'blank-info'}>
            <div><b>{blank.userName}</b> started at {blank.createdAt.slice(0, 19)}</div>
            <div>Active step: {`${blank.activeStep}`}</div>
            <div>Questions answered: {`${blank.answers.length} / ${blank.quiz.questions.length}`}</div>
            <div>Submitted: {`${blank.isSubmitted}`} {blank.isSubmitted ? null : <a href={`/quiz_blank/${blank.id}`}>Continue</a>}</div>
          </div>
        ))
      }
    </LoaderErrorContainer>
  );
}

export default Quizzes;
