declare namespace Script {
    import ƒ = FudgeCore;
    class Block extends ƒ.Node {
        static meshCube: ƒ.MeshCube;
        constructor(_position: ƒ.Vector3, _material: ƒ.Material);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CreeperMaschine extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let blocks: ƒ.Node;
    let grid: Block[][][];
    let steve: ƒ.Node;
}
declare namespace Script {
    function pickByComponent(_event: PointerEvent): void;
    function hitComponent(_event: PointerEvent): void;
    function pickByCamera(_event: PointerEvent): void;
    function pickByRadius(_event: PointerEvent): void;
    function pickByGrid(_event: PointerEvent): void;
}
