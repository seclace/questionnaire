import { gql, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import './Steps.css';
import { Step } from './components/Step/Step';
import { LoaderErrorContainer } from '../LoaderErrorContainer/LoaderErrorContainer';
import { EQuestionType } from '../../common/constants';

const UPDATE_BLANK_ACTIVE_STEP = gql`
mutation UpdateQuizBlankStep($blankId: ID!, $activeStep: Int!) {
  updateQuizBlankStep(blankId: $blankId, activeStep: $activeStep) {
    quizBlank {
      id
      activeStep
    }
  }
}
`;

const SUBMIT_QUIZ_BLANK = gql`
mutation SubmitQuizBlank($blankId: ID!) {
  submitQuizBlank(blankId: $blankId) {
    quizBlank {
      id
      activeStep
      isSubmitted
    }
  }
}
`;

export function Steps(props) {
  const { steps, activeStepId, minStepId = 1, maxStepId, isCorrectAnswerShown, isEditable } = props;
  const { blankId } = useParams();

  const [updateBlankActiveStep, { error: updatingError }] = useMutation(UPDATE_BLANK_ACTIVE_STEP);
  const [submitQuizBlank, { loading: isSubmitting, error: submissionError }] = useMutation(SUBMIT_QUIZ_BLANK);

  const handleChangeStep = (stepId) => {
    if (activeStepId === stepId) {
      return;
    }
    updateBlankActiveStep({ variables: { blankId, activeStep: stepId } });
  };

  const handlePreviousStepClick = () => {
    if (activeStepId <= minStepId) {
      return;
    }
    handleChangeStep(activeStepId - 1);
  };
  const handleNextStepClick = () => {
    if (activeStepId >= maxStepId) {
      return;
    }
    handleChangeStep(activeStepId + 1);
  };

  const handleSubmitBlank = () => {
    if (isEditable) {
      submitQuizBlank({ variables: { blankId } });
    }
  };

  const renderActiveStep = () => {

    const activeStep = steps.find(step => step.id === activeStepId);

    if (!activeStep) {
      return null;
    }

    return <Step blankId={blankId} questions={activeStep.questions} isCorrectAnswerShown={isCorrectAnswerShown} isEditable={isEditable}/>;
  };

  const renderStepsHeader = () => {
    return steps.map(step => (
      <div
        key={step.id}
        onClick={() => handleChangeStep(step.id)}
        className={`steps-header-item ${step.id === activeStepId ? 'active' : ''}`}
      >
        Step - {step.id}
      </div>
    ));
  };

  const renderStepsFooter = () => {
    const isPrevDisabled = activeStepId === minStepId;

    return (<>
      <div className={`steps-footer-button ${isPrevDisabled ? 'disabled' : ''}`} onClick={handlePreviousStepClick}>
        Previous
      </div>
      {activeStepId === maxStepId
        ? <div className={`steps-footer-button submit ${isEditable ? '' : 'disabled'}`} onClick={handleSubmitBlank}>Submit</div>
        : <div className={`steps-footer-button`} onClick={handleNextStepClick}>Next</div>
      }
    </>);
  };

  return (
    <LoaderErrorContainer isLoading={isSubmitting} error={submissionError || updatingError}>
      <div className={'steps-header'}>{renderStepsHeader()}</div>
      <div className={'steps-body'}>{renderActiveStep()}</div>
      <div className={'steps-footer'}>{renderStepsFooter()}</div>
    </LoaderErrorContainer>
  );
}

Steps.propTypes = {
  isCorrectAnswerShown: PropTypes.bool,
  isEditable: PropTypes.bool,
  activeStepId: PropTypes.number,
  minStepId: PropTypes.number,
  maxStepId: PropTypes.number,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
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
    }),
  ),
  onSubmitStep: PropTypes.func,
  onSubmitAnswer: PropTypes.func,
};
