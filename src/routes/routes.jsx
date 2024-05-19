import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import App from "../App.jsx";
import { Login } from "../pages/auth/Login.jsx";
import { Register } from "../pages/auth/Register.jsx";
import { Dashboard } from "../pages/dashboard/Dashboard.jsx";
import { Profile } from "../pages/userProfile/Profile.jsx";
import { SideBar } from "../components/Drawer.jsx";
import { Training } from "../pages/training/Training.jsx";
import { Tracking } from "../pages/tracking/Track.jsx";
import { Goals } from "../pages/goals/Goals.jsx";
import { Community } from "../pages/community/Community.jsx";
import { Tips } from "../pages/tips/Tips.jsx";
import { BMI } from "../pages/tracking/BMI.jsx";
import { WaterConsumption } from "../pages/tracking/WaterConsumption.jsx";
import { Test } from "../pages/Test.jsx";
import { CompleteProfile } from "../pages/auth/CompleteProfile.jsx";
import { FitnessLevel } from "../pages/auth/FitnessLevel.jsx";
import { FitnessGoal } from "../pages/auth/FitnessGoal.jsx";
import { ExerciseType } from "../pages/auth/ExerciseType.jsx";
import { useAuth } from '../hook/UseAuth.js';  // Adjust the path as necessary

const AuthWrapper = ({ children }) => {
  useAuth();  // Hook to check and manage token
  return <>{children}</>;
};

const ProtectedRoute = ({ element }) => {
  const { token } = useAuth();
  return token ? element : <Navigate to="/login" />;
};

const routes = [
  {
    path: "/",
    element: (
      <AuthWrapper>
        <SideBar />
      </AuthWrapper>
    ),
    children: [
      {
        path: "profile",
        element: <ProtectedRoute element={<Profile />} />,
        children: [
          {
            path: "test",
            element: <Test />,
          },
        ]
      },
      {
        path: "test",
        element: <ProtectedRoute element={<Test />} />,
      },
      {
        path: "dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,
      },
      {
        path: "training",
        element: <ProtectedRoute element={<Training />} />,
      },
      {
        path: "tracking",
        element: <ProtectedRoute element={<Tracking />} />,
      },
      {
        path: "bmi",
        element: <ProtectedRoute element={<BMI />} />,
      },
      {
        path: "waterConsumption",
        element: <ProtectedRoute element={<WaterConsumption />} />,
      },
      {
        path: "goals",
        element: <ProtectedRoute element={<Goals />} />,
      },
      {
        path: "community",
        element: <ProtectedRoute element={<Community />} />,
      },
      {
        path: "tips",
        element: <ProtectedRoute element={<Tips />} />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/completeProfile",
    element: <CompleteProfile />,
  },
  {
    path: "/fitnessLevel",
    element: <FitnessLevel />,
  },
  {
    path: "/fitnessGoal",
    element: <FitnessGoal />,
  },
  {
    path: "/exerciseType",
    element: <ExerciseType />,
  },
];

export default routes;
