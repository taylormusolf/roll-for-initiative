export const generateRandomNumber = (diceSize, mod) => {
    return Math.floor(Math.random() * diceSize) + 1 + mod;
}


