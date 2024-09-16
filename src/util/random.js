export const generateRandomNumber = (diceSize, mod=0) => {
    return Math.floor(Math.random() * diceSize) + 1 + mod;
}

export const generateRandomID = () => {
    return Math.floor(Math.random()*100000);
}


