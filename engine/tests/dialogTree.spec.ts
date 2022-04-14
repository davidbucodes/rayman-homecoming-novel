import { dialogTree1 } from "../../dialogs/data/worlds/bandLand/dialogTree1";
import { handleNode } from "../src/dialogTree";

describe("DialogTree", () => {
    it("test", () => {
        handleNode(dialogTree1.startNode);
    });
});
