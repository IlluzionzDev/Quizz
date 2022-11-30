import CreateQuiz from '@components/home/CreateQuiz';
import JoinQuiz from '@components/home/JoinQuiz';
import CenterSection from '@components/layout/CenterSection';
import FullSection from '@components/layout/FullSection';
import type { NextPage } from 'next';

const Home: NextPage = () => {
    return (
        <FullSection>
            <CenterSection>
                <div className="button__column">
                    <JoinQuiz />
                    <CreateQuiz />
                </div>
            </CenterSection>
        </FullSection>
    );
};

export default Home;
