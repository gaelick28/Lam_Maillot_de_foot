import React from 'react';

const WelcomeMessage = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-red-300 to-blue-400 p-4 rounded shadow mb-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800">Bienvenue, {user.username} !</h2>
      <p className="text-sm text-gray-900">Votre Email : {user.email}</p>
      {/* <p className="text-sm text-gray-600">Membre depuis le : {new Date(user.created_at).toLocaleDateString()}</p> */}
    </div>
  );
};

export default WelcomeMessage;
