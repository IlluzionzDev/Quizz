import Link from 'next/link';
import styles from './PlayerNav.module.scss';

type PlayerNavProps = {
    backlink: string;
    title: string;
};

const PlayerNav: React.FC<PlayerNavProps> = ({ backlink, title }) => (
    <header className={`container ${styles.header}`}>
        <nav>
            <ul>
                <li>
                    <Link href={backlink} passHref>
                        <button className="button button__solid">Go Back</button>
                    </Link>
                </li>

                <li>{title}</li>
            </ul>
        </nav>
    </header>
);

export default PlayerNav;
