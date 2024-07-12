/**
 * Normalizes quizBlank questions and remaps them to steps with questions
 * @param quizBlank {{
 *   id: string,
 *   userName: string,
 *   activeStep: number,
 *   isSubmitted: boolean,
 *   createdAt: string,
 *   updatedAt: string,
 *   quiz: {
 *     id: string,
 *     steps: number,
 *     questions: [{
 *       id: string,
 *       step: number,
 *       questionText: string,
 *       type: 'IN' | 'NU' | 'CH' | 'RA',
 *       choices: [{
 *         id: string,
 *         content: string,
 *       }],
 *       correctAnswer: {
 *         id: string,
 *         content: string,
 *         choices: [{
 *           id: string,
 *           content: string,
 *         }],
 *       },
 *     }],
 *   },
 * }}
 *
 * @returns {[{
 *   id: number,
 *   questions: [{
 *     id: string,
 *     step: number,
 *     questionText: string,
 *     type: 'IN' | 'NU' | 'CH' | 'RA',
 *     choices: [{
 *       id: string,
 *       content: string,
 *     }],
 *     correctAnswer: {
 *       id: string,
 *       content: string,
 *       choices: [{
 *         id: string,
 *         content: string,
 *       }],
 *     },
 *   }],
 * }]}
 */
export function groupBlankQuestionsByStep(quizBlank) {
  const steps = Array.from({ length: quizBlank.quiz.steps }, (_, i) => ({ id: i + 1, questions: [] }));
  for (const question of quizBlank.quiz.questions) {
    steps.at(question.step - 1).questions.push(question);
  }
  return steps;
}
