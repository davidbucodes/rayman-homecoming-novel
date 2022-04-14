import { Mood } from "../enums/mood";
import { Speaker } from "../enums/speaker";

export interface Dialog {
    speaker: Speaker;
    text: string;
    mood: Mood;
}
