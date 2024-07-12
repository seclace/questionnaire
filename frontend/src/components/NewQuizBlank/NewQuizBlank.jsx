import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { LoaderErrorContainer } from '../LoaderErrorContainer/LoaderErrorContainer';

const CREATE_QUIZ_BLANK = gql`
mutation CreateQuizBlank($quizId: ID!, $userName: String!) {
  createQuizBlank(quizId: $quizId, userName: $userName) {
    quizBlank {
      id
    }
  }
}
`;

export function NewQuizBlank() {
  const { quizId } = useParams();
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [createQuizBlank, { data, loading: isLoading, error }] = useMutation(CREATE_QUIZ_BLANK);

  useEffect(() => {
    if (data?.createQuizBlank?.quizBlank) {
      navigate(`/quiz_blank/${data.createQuizBlank.quizBlank?.id}`);
    }
  }, [data, navigate]);

  const handleChange = e => setUserName(e.target.value);

  const handleSubmitNewBlank = async () => {
    createQuizBlank({ variables: { quizId, userName } });
  };

  return (
    <LoaderErrorContainer error={error} isLoading={isLoading}>
      Please, enter user name for a new blank: <input type="text" value={userName} onChange={handleChange}/>
      <button onClick={handleSubmitNewBlank}>Create</button>
    </LoaderErrorContainer>
  );
}
