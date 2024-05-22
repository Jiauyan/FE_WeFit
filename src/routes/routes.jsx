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
import { FavClass } from "../pages/auth/FavClass.jsx";
import { useAuth } from '../hook/UseAuth.js';  // Adjust the path as necessary
import { ForgotPassword } from "../pages/auth/ForgotPassword.jsx";
import { TrainerProfile } from '../pages/trainerProfile/TrainerProfile.jsx';
import { TrainerTips } from '../pages/trainerTips/TrainerTips.jsx';
import { TrainerTraining } from '../pages/trainerTraining/TrainerTraining.jsx';
import { TrainerQuotes } from '../pages/trainerQuotes/TrainerQuotes.jsx';
import { EditProfile } from '../pages/userProfile/EditProfile.jsx';
import { EditTrainerProfile } from '../pages/trainerProfile/EditTrainerProfile.jsx';
import { DeleteTrainerAccount } from '../pages/trainerProfile/DeleteTrainerAccount.jsx';

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
      {
        path: "trainerProfile",
        element: <ProtectedRoute element={<TrainerProfile />} />,
      },
      
      {
        path: "trainerTips",
        element: <ProtectedRoute element={<TrainerTips />} />,
      },
      
      {
        path: "trainerTraining",
        element: <ProtectedRoute element={<TrainerTraining />} />,
      },
      
      {
        path: "trainerQuotes",
        element: <ProtectedRoute element={<TrainerQuotes />} />,
      },
      {
        path: "editProfile",
        element: <ProtectedRoute element={<EditProfile />} />,
      },
      {
        path: "editTrainerProfile",
        element: <ProtectedRoute element={<EditTrainerProfile />} />,
      },
      {
        path: "deleteTrainerAccount",
        element: <ProtectedRoute element={<DeleteTrainerAccount />} />,
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
    path: "/forgotPassword",
    element: <ForgotPassword />,
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
    path: "/favClass",
    element: <FavClass />,
  },
];

export default routes;
