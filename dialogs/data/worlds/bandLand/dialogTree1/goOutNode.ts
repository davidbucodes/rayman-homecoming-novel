import { Mood } from "../../../../enums/mood";
import { Speaker } from "../../../../enums/speaker";
import { DialogTreeNode } from "../../../../types/dialogTree";
import { conclusionNode } from "./conclusionNode";

export const goOutNode: DialogTreeNode = {
    dialogs: [
        {
            mood: Mood.Excited,
            speaker: Speaker.Rayman,
            text: "Let's go see Tarayzan!",
        },
    ],
    decisions: [
        {
            nextNode: conclusionNode,
        },
    ],
    startEffect: {
        add: {
            tings: 10,
        },
    },
};
