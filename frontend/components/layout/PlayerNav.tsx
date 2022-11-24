import styles from './PlayerNav.module.scss';

type PlayerNavProps = {
    onBack: Function;
    backlink: string;
    title: string;
};

const PlayerNav: React.FC<PlayerNavProps> = ({ onBack, backlink, title }) => (
    <header className={`container ${styles.header}`}>
        <nav>
            <ul>
                <li>
                    <button
                        className="button button__solid"
                        onClick={(e) => {
                            onBack();
                        }}
                    >
                        {backlink}
                    </button>
                </li>

                <li>{title}</li>
            </ul>
        </nav>
    </header>
);

export default PlayerNav;
