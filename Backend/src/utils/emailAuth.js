export const isValidNitpEmail=function(email){
    const emailRegex = /^[a-zA-Z0-9._%+-]+@nitp\.ac\.in$/;
    return emailRegex.test(email);
}