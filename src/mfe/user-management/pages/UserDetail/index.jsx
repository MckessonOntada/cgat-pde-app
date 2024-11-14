import React from "react";
import { useParams } from "react-router-dom";
import { USER_DATA } from "../../mockData/UsersData";

const UserDetail = () => {
  const { userId } = useParams();
  const user = USER_DATA.find((user) => user.id === parseInt(userId));

  if (!user) {
    return <h1>User not found test.</h1>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>Status:</strong> {user.status}
      </p>
      <p>
        <strong>Date Added:</strong> {user.date_added}
      </p>
      <p>
        <strong>Date Updated:</strong> {user.date_updated}
      </p>
    </div>
  );
};

export default UserDetail;
