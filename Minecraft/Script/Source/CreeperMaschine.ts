namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class CreeperMaschine extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(CreeperMaschine);
    // Properties may be mutated by users in the editor via the automatically created user interface
    // public message: string = "This is the CreeperMaschine Skript ";


    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
      this.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
        case ƒ.EVENT.RENDER_PREPARE:
           console.log("Rendering now..");
          break;
      }
    }

    public update = (_event: Event): void => {
      // let rigidbodySteve: ƒ.ComponentRigidbody = steve.getComponent(ƒ.ComponentRigidbody);
      // let rigidbodyCreeper: ƒ.ComponentRigidbody = this.node.getComponent(ƒ.ComponentRigidbody);

      // let posSteve: ƒ.Vector3 = rigidbodySteve.node.mtxWorld.translation;
      // let posCreeper: ƒ.Vector3 = rigidbodySteve.node.mtxWorld.translation;
      // rigidbodyCreeper.applyForce(ƒ.Vector3.X(1));
      // rigidbodyCreeper.applyForce(ƒ.Vector3.Z(3));

      // let movementVector: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(posSteve, posCreeper);
      // movementVector.normalize(100);

      // rigidbodyCreeper.applyForce(movementVector);
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }

    //1. (Steve-Creeper) -> 
  }
}