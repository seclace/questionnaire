import PropTypes from 'prop-types';

import { Question } from '../Question/Question';
import { EQuestionType } from '../../../../common/constants';

export function Step({ questions, isCorrectAnswerShown, isEditable, blankId }) {
  return questions.map(q => <Question
    key={q.id}
    id={q.id}
    step={q.step}
    questionText={q.questionText}
    type={q.type}
    choices={q.choices}
    correctAnswer={q.correctAnswer}
    isCorrectAnswerShown={isCorrectAnswerShown}
    isEditable={isEditable}
    blankId={blankId}/>);
}

Step.propTypes = {
  blankId: PropTypes.string,
  isCorrectAnswerShown: PropTypes.bool,
  isEditable: PropTypes.bool,
  questions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    step: PropTypes.number,
    questionText: PropTypes.string,
    type: PropTypes.oneOf(Object.values(EQuestionType)),
    choices: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      content: PropTypes.string,
    })),
    correctAnswer: PropTypes.shape({
      id: PropTypes.string,
      content: PropTypes.string,
      choices: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        content: PropTypes.string,
      })),
    }),
  })),
};
