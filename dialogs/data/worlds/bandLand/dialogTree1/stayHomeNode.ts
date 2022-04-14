import { Mood } from "../../../../enums/mood";
import { Speaker } from "../../../../enums/speaker";
import { DialogTreeNode } from "../../../../types/dialogTree";
import { conclusionNode } from "./conclusionNode";

export const stayHomeNode: DialogTreeNode = {
    dialogs: [
        {
            mood: Mood.Wondering,
            speaker: Speaker.Rayman,
            text: "I'm really want to visit him..",
        },
        {
            mood: Mood.Relaxed,
            speaker: Speaker.Rayman,
            text: "Umm... maybe later this week... The breeze is just too good now...",
        },
    ],
    decisions: [
        {
            nextNode: conclusionNode,
        },
    ],
    startEffect: {
        remove: {
            tings: 10,
        },
    },
};
