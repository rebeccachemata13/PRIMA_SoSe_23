declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Tile extends ƒ.Node {
        static meshCube: ƒ.MeshCube;
        tileNumber: number;
        pitch: string;
        tileLength: number;
        constructor(tileNumber: number, pitch: string, tileLength: number, _position: ƒ.Vector3, _material: ƒ.Material);
    }
}
