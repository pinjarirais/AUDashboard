import React from "react";
import EditProfile from "../component/userforms/EditProfile";
import ChangePin from "../component/userforms/ChangePin";

function UserForms() {
  return (
    <>
      <div className="pb-12">
        <EditProfile /> 
        <ChangePin />
      </div>
    </>
  );
}

export default UserForms;
