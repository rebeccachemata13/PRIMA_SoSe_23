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
        static meshTile: ƒ.MeshCube;
        static mtrTile: ƒ.Material;
        tileNumber: number;
        pitch: string;
        length: string;
        jumpforce: number;
        constructor(tileNumber: number, pitch: string, length: string, jumpforce: number, _position: ƒ.Vector3, _color: ƒ.Color);
    }
}
