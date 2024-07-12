import PropTypes from 'prop-types';

import './Question.css';
import { EQuestionType } from '../../../../common/constants';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const GET_ANSWER = gql`
query GetBlankAnswer($blankId: ID!, $questionId: ID!) {
  blankAnswer(blankId: $blankId, questionId: $questionId) {
    id
    content
    isCorrect
    choices {
      id
    }
  }
}
`;

const SUBMIT_ANSWER = gql`
mutation SubmitBlankAnswer($blankId: ID!, $questionId: ID!, $content: String, $choices: [ID!]) {
  submitBlankAnswer(blankId: $blankId, questionId: $questionId, content: $content, choiceIds: $choices) {
    blankAnswer {
      id
      content
      isCorrect
      choices {
        id
      }
    }
  }
}
`;

export function Question(props) {
  const { id, type, choices, correctAnswer, isCorrectAnswerShown, isEditable, questionText, blankId } = props;
  const { data } = useQuery(GET_ANSWER, {
    variables: {
      blankId,
      questionId: id,
    },
  });
  const [submitAnswer] = useMutation(SUBMIT_ANSWER);
  const answer = data?.blankAnswer;

  const handleSubmitInput = (val) => submitAnswer({
    variables: {
      blankId,
      questionId: id,
      content: val,
      choices: [],
    },
  });

  const handleSubmitChoices = (e) => {
    const choiceIdsSet = new Set((answer?.choices || []).map(choice => choice.id));
    if (e.target.checked) {
      choiceIdsSet.add(e.target.value);
    } else {
      choiceIdsSet.delete(e.target.value);
    }
    submitAnswer({
      variables: { blankId, questionId: id, content: '', choices: [...choiceIdsSet] },
      refetchQueries: answer ? [] : ['GetBlankAnswer'],
    });
  };

  const handleSubmitRadio = (e) => {
    const choiceId = e.target.value;
    submitAnswer({
      variables: { blankId, questionId: id, content: '', choices: [choiceId] },
      refetchQueries: answer ? [] : ['GetBlankAnswer'],
    });
  };

  const getQuestionBody = () => {
    switch (type) {
      case EQuestionType.Input:
      case EQuestionType.NumericInput:
        const correctCn = isCorrectAnswerShown ? answer?.isCorrect ? 'correct' : 'incorrect' : '';
        return <>
          <input
            className={`question-input ${correctCn}`}
            disabled={!isEditable}
            type={type === EQuestionType.NumericInput ? 'number' : 'text'}
            onChange={e => handleSubmitInput(e.target.value)}
            defaultValue={answer?.content}/>
          {isCorrectAnswerShown && !answer?.isCorrect
            ? <input className={'question-input correct'} value={correctAnswer?.content} disabled/>
            : null}
        </>;
      case EQuestionType.Radio:
      case EQuestionType.Checkbox:
        const isCheckbox = type === EQuestionType.Checkbox;
        return choices.map(choice => {
          const isChecked = !!(answer?.choices || []).find(c => c.id === choice.id);
          const isChoiceCorrect = !!(correctAnswer?.choices || []).find(c => c.id === choice.id);
          const cn = isCorrectAnswerShown && (isChecked && answer?.isCorrect || isChoiceCorrect) ? 'correct' : '';
          const cnIncorrect = isCheckbox
            ? isCorrectAnswerShown && !isChecked && !answer?.isCorrect ? 'incorrect' : ''
            : isCorrectAnswerShown && isChecked && !answer?.isCorrect ? 'incorrect' : '';
          return <label className={`question-choice ${cn} ${cnIncorrect}`} key={choice.id} htmlFor={choice.id}>
            {choice.content}
            <input
              disabled={!isEditable}
              name={id}
              type={isCheckbox ? 'checkbox' : 'radio'}
              id={choice.id}
              value={choice.id}
              checked={isChecked}
              onChange={isCheckbox ? handleSubmitChoices : handleSubmitRadio}/>
          </label>;
        });
      default:
        return null;
    }
  };

  return (
    <div className={'question'}>
      <div className={'question-text'}>{questionText}</div>
      <div className={'question-body'}>{getQuestionBody()}</div>
    </div>
  );
}

Question.propTypes = {
  id: PropTypes.string,
  questionText: PropTypes.string,
  type: PropTypes.oneOf(Object.values(EQuestionType)),
  choices: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string,
  })),
  answer: PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string,
    choices: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      content: PropTypes.string,
    })),
  }),
  correctAnswer: PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string,
    choices: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      content: PropTypes.string,
    })),
  }),
  isCorrectAnswerShown: PropTypes.bool,
  isEditable: PropTypes.bool,
  blankId: PropTypes.string,
};
