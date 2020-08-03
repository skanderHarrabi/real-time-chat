import React from 'react';
import onlineIcon from '../../icons/onlineIcon.png';
import './users.css'


const Users = ({ users }) => {
  console.log(users)
  return (
    <div className="textContainer">
      {
        users
          ? (
            <div>
              <h1>Online :</h1>
              <div className="activeContainer">
                <h2>
                  {users.map((user, index) => (
                    <div key={index} className="activeItem">
                      {user.name}
                      <img alt="Online Icon" src={onlineIcon} />
                    </div>
                  ))}
                </h2>
              </div>
            </div>
          )
          : null
      }
    </div>
  );
};


Users.propTypes = {

};


export default Users;
