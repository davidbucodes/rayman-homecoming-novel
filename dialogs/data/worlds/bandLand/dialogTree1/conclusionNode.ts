import { Mood } from "../../../../enums/mood";
import { Speaker } from "../../../../enums/speaker";
import { DialogTreeNode } from "../../../../types/dialogTree";

export const conclusionNode: DialogTreeNode = {
    dialogs: [
        {
            mood: Mood.SuddenlyRemembered,
            speaker: Speaker.Rayman,
            text: "I've remembered now!",
        },
        {
            mood: Mood.Disappointed,
            speaker: Speaker.Rayman,
            text: "Actually he is at a vacation at picture city right now...",
        },
        {
            mood: Mood.Relaxed,
            speaker: Speaker.Rayman,
            text: "I guess I continue relaxing...",
        },
    ],
    decisions: [],
    startEffect: {
        add: {
            tings: 10,
        },
    },
};
