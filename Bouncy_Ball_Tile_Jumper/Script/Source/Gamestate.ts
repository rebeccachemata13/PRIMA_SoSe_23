namespace Script {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;

    export class Gamestate extends ƒ.Mutable {
        public score: number;
        public note: string;
        public frequency: number;

        constructor() {
            super();
            this.score = 0;
            this.note ="";
            this.frequency = this.frequency;

            let vui: HTMLDivElement = document.querySelector("div#vui");
            new ƒUi.Controller(this, vui);
            this.addEventListener(ƒ.EVENT.MUTATE, () => console.log(this));
        }
        protected reduceMutator(_mutator: ƒ.Mutator): void {
        }


    }
}