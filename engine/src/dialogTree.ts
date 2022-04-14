import _ from "lodash";
import { Mood } from "../../dialogs/enums/mood";
import { Speaker } from "../../dialogs/enums/speaker";
import { DialogTreeNode } from "../../dialogs/types/dialogTree";
import { State } from "../../dialogs/types/state";
import * as inquirer from "inquirer";

let state: State = {
    items: [],
    tings: 0,
    friendshipGauge: 0,
};

function logContent(node: DialogTreeNode) {
    for (const dialog of node.dialogs) {
        console.log(
            `${Speaker[dialog.speaker]} (${Mood[dialog.mood]}): ${dialog.text}`
        );
    }
}

function getNewState(state: State, node: DialogTreeNode) {
    let newState = {
        ...state,
    };
    if (node.startEffect && node.startEffect.add) {
        newState.friendshipGauge += node.startEffect.add.friendshipGauge || 0;
        newState.tings += node.startEffect.add.tings || 0;
        newState.items = _.union(
            newState.items,
            node.startEffect.add.items || []
        );
    }
    if (node.startEffect && node.startEffect.remove) {
        newState.friendshipGauge -=
            node.startEffect.remove.friendshipGauge || 0;
        newState.tings -= node.startEffect.remove.tings || 0;
        newState.items = _.difference(
            newState.items,
            node.startEffect.remove.items || []
        );
    }
    return newState;
}

function handleDecisions(node: DialogTreeNode) {
    logContent(node);
    const question = node.decisionsTitle || "What should Rayman do next?";
    inquirer
        .prompt([
            {
                type: "list",
                name: question,
                message: "Select an options from below list",
                choices: node.decisions
                    .map((decision) => [
                        {
                            name: decision.text,
                            value: decision.option,
                        },
                    ])
                    .flat(),
            },
        ])
        .then((answers) => {
            const selected = answers[question];
            console.log(selected);
            const selectedDecision = node.decisions.find(
                (decision) => decision.option === selected
            );
            console.log(selectedDecision);

            if (selectedDecision) {
                handleNode(selectedDecision.nextNode);
            }
        });
}

export function handleNode(node: DialogTreeNode) {
    const newState = getNewState(state, node);
    console.table([
        { state: "before", ...state },
        { state: "after", ...newState },
    ]);
    state = newState;
    logContent(node);
    handleDecisions(node);
}
