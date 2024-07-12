import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './Router.css';
import Quizzes from '../Quizzes/Quizzes';
import ErrorPage from '../error-page';
import { NewQuizBlank } from '../NewQuizBlank/NewQuizBlank';
import { QuizBlank } from '../QuizBlank/QuizBlank';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Quizzes/>,
    errorElement: <ErrorPage/>,
    children: [],
  },
  {
    path: 'quiz/:quizId/new_blank',
    element: <NewQuizBlank/>,
  },
  {
    path: 'quiz_blank/:blankId',
    element: <QuizBlank/>,
  },
]);

export function Router() {
  return <>
    <div className={'navbar'}>
      <a href={'/'}>Home</a>
    </div>
    <RouterProvider router={router}/>
  </>;
}
