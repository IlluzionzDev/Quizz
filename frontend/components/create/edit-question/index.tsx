import { Box } from "@design-system/layout/box"
import { Flex } from "@design-system/layout/flex"
import { QuestionData } from "api/packets/packets"
import styles from './edit-question.module.scss';
import React from "react"
import { Label } from "@design-system/typography";
import { trimString } from "@design-system/utils";
import { FaPen, FaTrash } from "react-icons/fa";

type EditQuestionProps = {
    question: QuestionData;
    onEdit: (question: QuestionData) => void;
    onDelete: (question: QuestionData) => void;
}

export const EditQuestion: React.FC<EditQuestionProps> = ({ question, onEdit, onDelete }) => {
    return (
        <Flex direction="row" justifyContent="space-between" gap={4} paddingTop={3} paddingBottom={3} paddingLeft={6} paddingRight={6} background="neutral100" alignItems="center" hasRadius>
            <Flex gap={4} alignItems="center">
                <Label variant="lg" color="black">
                    {question.question}
                </Label>
                <Label variant="md" color="neutral300">
                    {trimString(question.answers.join(', '), 27, true)}
                </Label>
            </Flex>
            <Flex gap={4}>
                <FaPen className={styles.iconButton} onClick={() => onEdit(question)} />
                <FaTrash className={styles.iconButton}  onClick={() => onDelete(question)} />
            </Flex>
        </Flex>
    );
}

export { EditQuestionModal } from './modal'