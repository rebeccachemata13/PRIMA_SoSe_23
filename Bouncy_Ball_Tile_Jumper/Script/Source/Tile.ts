namespace Script{
    import ƒ = FudgeCore;

    export class Tile extends ƒ.Node{
        static meshTile: ƒ.MeshCube = new ƒ.MeshCube("Tile");
        static mtrTile: ƒ.Material = new ƒ.Material("Tile", ƒ.ShaderFlat, new ƒ.CoatRemissive());
        pitch: string;
        length: string;
        jumpforce: number;
        
        constructor(pitch: string, length: string, jumpforce:number, _position: ƒ.Vector3, _color: ƒ.Color){
            super("Tile");
            this.pitch = pitch;
            this.length = length;
            this.jumpforce = jumpforce;

            this.addComponent(new ƒ.ComponentMesh(Tile.meshTile));

            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Tile.mtrTile);
            cmpMaterial.clrPrimary = _color;
            this.addComponent(cmpMaterial);

            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position));
            this.addComponent(cmpTransform);

            let cmpPicker: ƒ.ComponentPick = new ƒ.ComponentPick();
            cmpPicker.pick = ƒ.PICK.RADIUS;
            this.addComponent(cmpPicker);

            let cpmRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1, ƒ.BODY_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE );
            this.addComponent(cpmRigidbody);
        }
    }
}