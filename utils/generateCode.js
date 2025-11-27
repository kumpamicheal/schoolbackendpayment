export const generatePaymentCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "SCH-";
    for (let i = 0; i < 6; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
    }
    return code;
};