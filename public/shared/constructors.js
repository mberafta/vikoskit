function Player(name) {
    this.name = name;
    this.statDescriptor = {
        date: new Date().toDateString(),
        sipsEmitted: 0,
        sipsReceived: 0,
        bestTarget: null,
        nemesis: null
    };
    this.activeRules = [];
}

function Rule() {
    this.id = "R-" + Math.random() * 6,
        this.name = "";
        this.combinations = [];
        this.descriptor = {
            actions: []
        };
        this.counter = {
            type:'',
            currentValue:0,
            limit:0
        };
}

function Action(){
    this.type = '';
    this.content = '';
    this.sources = [];
    this.targets = [];
}