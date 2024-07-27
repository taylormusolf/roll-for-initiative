export const generateRandomNumber = num => {
    if(!num) num = 20;
    return Math.floor(Math.random() * num) + 1;
}


