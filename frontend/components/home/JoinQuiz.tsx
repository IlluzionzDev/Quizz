import styles from './JoinQuiz.module.scss';
import Link from 'next/link';

const JoinQuiz = () => (
    <Link href="/join-quiz" passHref>
        <button className="button button__solid">Join Quiz</button>
    </Link>
);

export default JoinQuiz;
