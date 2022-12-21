import { Box } from "@design-system/layout/box"
import { Flex } from "@design-system/layout/flex"
import { QuestionData } from "api/packets/packets"
import React from "react"

type EditQuestionProps = {
    question: QuestionData;
    onEdit: (question: QuestionData) => void;
    onDelete: (question: QuestionData) => void;
}

export const EditQuestion: React.FC<EditQuestionProps> = ({ question, onEdit, onDelete }) => {
    return <Flex direction='row'>
        
    </Flex>;
}