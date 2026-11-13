import React from 'react'
import { useAuth } from 'src/app/core/auth/AuthRouteProvider';
import { Navigate } from 'react-router';

const RedirectionPage = () => {
  const role = useAuth().user.role;
  if (role === 'admin') {
    return <Navigate to="/membership" />
  }

  if (role === 'staff') {
    return <Navigate to="/users" />
  }

  return <Navigate to="/404" />
}

export default RedirectionPage