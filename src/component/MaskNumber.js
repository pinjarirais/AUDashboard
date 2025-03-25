import React from 'react'

export const MaskNumber = ({ accountNumber }) => {
        const maskBankNumber = (number) => {
            if (!number) return '';
            let numStr = number.toString();
            let maskedArr = numStr.split('');
            for (let i = 6; i <= 11 && i < maskedArr.length; i++) {
                maskedArr[i] = 'X';
            }
            return maskedArr.join('').replace(/(.{4})/g, '$1 ').trim();
        };
        return <>
        {maskBankNumber(accountNumber)}
        </>;
      };
      


export const PhoneNumber = ({ PhoneNumber }) => {
const maskPhoneNumber = (number) => {
    if (!number) return '';
    let numStr = number.toString();
    let maskedArr = numStr.split('');
    for (let i = 0; i <= 5 && i < maskedArr.length; i++) {
        maskedArr[i] = 'X';
    }
    return maskedArr;
};
return <>
{maskPhoneNumber(PhoneNumber)}
</>;

};
