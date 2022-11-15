import styles from './JoinQuiz.module.scss';
import Link from 'next/link';

const JoinQuiz = () => (
  <Link href="/join-quiz">
    <button className="button__1">Join Quiz</button>
  </Link>
);

export default JoinQuiz;
