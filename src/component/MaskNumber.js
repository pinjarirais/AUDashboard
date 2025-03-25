import React from 'react'

const MaskNumber = ({ accountNumber }) => {
        const maskBankNumber = (number) => {
            if (!number) return '';
            let numStr = number.toString();
            let maskedArr = numStr.split('');
            for (let i = 6; i <= 11 && i < maskedArr.length; i++) {
                maskedArr[i] = 'X';
            }
            return maskedArr.join('').replace(/(.{4})/g, '$1 ').trim();
        };
        return <div className='font-semibold text-[0.8rem] md:text-base'>{maskBankNumber(accountNumber)}</div>;
      };
      
export default MaskNumber