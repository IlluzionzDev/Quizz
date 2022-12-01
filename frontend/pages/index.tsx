import CreateQuiz from '@components/home/CreateQuiz';
import JoinQuiz from '@components/home/JoinQuiz';
import TitleButton from '@components/home/TitleButton';
import CenterSection from '@components/layout/CenterSection';
import FullSection from '@components/layout/FullSection';
import type { NextPage } from 'next';
import { FaPen, FaPlay, FaTimes } from 'react-icons/fa';

const Home: NextPage = () => {
    return (
        <FullSection>
            <CenterSection>
                <h1 className='home__title'>Quizz</h1>
                <div className="button__column">
                    <TitleButton title='Join Quiz' description='Quickly join a hosted quiz' icon={<FaPlay />} link='/join-quiz' />
                    <TitleButton title='Create Quiz' description='Create your own quiz' icon={<FaPen />} link='/create-quiz' />
                </div>
            </CenterSection>
        </FullSection>
    );
};

export default Home;
