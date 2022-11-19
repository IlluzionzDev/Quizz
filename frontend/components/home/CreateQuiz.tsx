import styles from './CreateQuiz.module.scss';
import Link from 'next/link';

const CreateQuiz = () => (
    <Link href="/create-quiz">
        <button className="button button__solid">Create Quiz</button>
    </Link>
);

export default CreateQuiz;
