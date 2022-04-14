import { State } from "./state";

export type Condition = (state: State) => boolean;
