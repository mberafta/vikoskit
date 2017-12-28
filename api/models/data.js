
function rule(id, title, content, extra, dicePair){
    this.id = id;
    this.title = title == "" ? "Double " + extra : title;
    this.content = content;
    this.extra = "Tu as un double " + extra + ", tu peux distribuer " + extra + " gorgées.";
    this.dicePair = dicePair;
    this.joker = jokers.find(function(j){ return j.ruleId == id });
}

function joker(id, ruleIds, title, content){
    this.id = id;
    this.ruleIds = ruleIds;
    this.title = title;
    this.content = content;
}

function player(id, name, position){
    this.id = id;
    this.name = name;
    this.jokers = [];
    this.position = position;
}

function dicePair(val1, val2){
    this.val1 = val1;
    this.val2 = val2;
}

function game(id, title, ruleIds, playerIds)



