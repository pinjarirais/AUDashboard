import React from "react";
import ChangePinForm1 from "./ChangePinForm1";
import ChangePinForm2 from "./ChangePinForm2";
import ChangePinForm3 from "./ChangePinForm3";

function ChangePin() {
    return (<>
        <div className="form-wrap">
            <div className='login-form w-full p-4'>
                <div className='form-wrapp mx-auto sm:w-full sm:max-w-sm'>

                    <ChangePinForm1 />


                    <ChangePinForm2 />
                </div>
                <hr className="color-gray-300 my-5 w-3/6 mx-auto" />
                <div className='form-wrapp mx-auto sm:w-full sm:max-w-sm'>
                    <ChangePinForm3 />
                </div>
            </div>
        </div>
    </>)
}

export default ChangePin;