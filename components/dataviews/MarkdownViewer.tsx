//written by gpt
import React from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../../styles/Q.module.css';

interface Props {
    markdown: string;
}

export const MarkdownViewer: React.FC<Props> = ({ markdown }) => {
    return (
        <ReactMarkdown className={styles.markdownBox}>{markdown}</ReactMarkdown>
    );
};

export default MarkdownViewer;