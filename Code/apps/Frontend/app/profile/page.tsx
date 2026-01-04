'use client'

import React, { useEffect } from 'react';
import useAuth from '../store';

const UserProfile = () => {

  const { user, isLoading, error, getUserData } : any = useAuth();

 
  useEffect(() => {
    getUserData();
  }, [getUserData]); 

 
  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user logged in</div>;
  }

  
  return (
    <div className="mt-12 p-4 border rounded shadow">
      <br /><br /><br /><br /><br /><br /><br /><br />
      <h1>Welcome, {JSON.stringify(user)}</h1>
    </div>
  );
};

export default UserProfile;