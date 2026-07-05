import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { selectUserRole } from 'src/app/auth/user/store/userSlice';

const RedirectionPage = () => {
  const role = useSelector(selectUserRole);
  if (role === 'admin') {
    return <Navigate to="/membership" />
  }

  if (role === 'staff') {
    return <Navigate to="/users" />
  }

  return <Navigate to="/404" />
}

export default RedirectionPage