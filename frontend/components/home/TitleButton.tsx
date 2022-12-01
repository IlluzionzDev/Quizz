import Link from 'next/link';
import { Component, ReactNode } from 'react';
import styles from './TitleButton.module.scss';

type TitleButtonProps = {
    title: string;
    description: string;
    icon: ReactNode;
    link: string;
};

/**
 * Main home page button to redirect to app
 */
const TitleButton: React.FC<TitleButtonProps> = ({ title, description, icon, link }) => {
    return (
        <Link href={link} passHref>
            <div className={styles.button}>
                <div className={styles.button__icon}>{icon}</div>

                <div className={styles.button__info}>
                    <p className={styles.button__info__title}>{title}</p>
                    <p className={styles.button__info__desc}>{description}</p>
                </div>
            </div>
        </Link>
    );
};

export default TitleButton;
