import CreateQuiz from '@components/home/CreateQuiz';
import JoinQuiz from '@components/home/JoinQuiz';
import CenterSection from '@components/layout/CenterSection';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div>
      <CenterSection>
        <div className="button__column">
          <JoinQuiz />
          <CreateQuiz />
        </div>
      </CenterSection>
    </div>
  );
};

export default Home;
