import { State } from "./state";

export type Effect = {
    add?: Partial<State>;
    remove?: Partial<State>;
};
