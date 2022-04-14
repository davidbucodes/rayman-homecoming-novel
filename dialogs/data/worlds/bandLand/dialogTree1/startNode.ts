import { Mood } from "../../../../enums/mood";
import { Speaker } from "../../../../enums/speaker";
import { DialogTreeNode } from "../../../../types/dialogTree";
import { goOutNode } from "./goOutNode";
import { stayHomeNode } from "./stayHomeNode";

export enum StartNodeDecisions {
    GoOut,
    StayHome,
}
export const startNode: DialogTreeNode = {
    dialogs: [
        {
            mood: Mood.Relaxed,
            speaker: Speaker.Narration,
            text: "A nice weather is at Rayman's own beach.",
        },
        {
            mood: Mood.Relaxed,
            speaker: Speaker.Rayman,
            text: "Such a wonderful weather is perfect for resting...",
        },
        {
            mood: Mood.Serious,
            speaker: Speaker.Rayman,
            text: "It's been a month since defeating Mr. Dark huh...",
        },
        {
            mood: Mood.Wondering,
            speaker: Speaker.Rayman,
            text: "I wonder how Tarayzan is doing. Maybe I will go to pay him a visit?",
        },
    ],
    decisions: [
        {
            option: StartNodeDecisions.GoOut,
            text: "Let's go out!",
            nextNode: goOutNode,
        },
        {
            option: StartNodeDecisions.StayHome,
            text: "Maybe later...",
            nextNode: stayHomeNode,
        },
    ],
    startEffect: {
        add: {
            tings: 20,
        },
    },
};
