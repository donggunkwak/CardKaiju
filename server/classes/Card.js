class Card{
    constructor(name, type, value, specialEffect){
        this.name = name;
        this.type = type;//alpha, beta, gamma, neutral
        this.value = value;
        this.specialEffect = specialEffect//figure out later
    }
}
module.exports = {Card};