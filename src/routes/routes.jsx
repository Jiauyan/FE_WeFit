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
import { ForgotPassword } from "../pages/auth/ForgotPassword.jsx";
import { TrainerProfile } from '../pages/trainerProfile/TrainerProfile.jsx';
import { TrainerTips } from '../pages/trainerTips/TrainerTips.jsx';
import { TrainerTraining } from '../pages/trainerTraining/TrainerTraining.jsx';
import { TrainerQuotes } from '../pages/trainerQuotes/TrainerQuotes.jsx';
import { EditProfile } from '../pages/userProfile/EditProfile.jsx';
import { EditTrainerProfile } from '../pages/trainerProfile/EditTrainerProfile.jsx';
import { DeleteTrainerAccount } from '../pages/trainerProfile/DeleteTrainerAccount.jsx';
import { AddTip } from '../pages/trainerTips/AddTip.jsx';
import { ViewTip } from '../pages/trainerTips/ViewTip.jsx';
import { EditTip } from '../pages/trainerTips/EditTip.jsx';
import { ViewTipStudent } from '../pages/tips/ViewTipStudent.jsx';


const routes = [
  {
    path: "/",
    element: <SideBar />,
    children: [
      {
        path: "profile",
        element:  <Profile /> ,
      },
      {
        path: "test",
        element:  <Test /> ,
      },
      {
        path: "dashboard",
        element:  <Dashboard /> ,
      },
      {
        path: "training",
        element:  <Training /> ,
      },
      {
        path: "tracking",
        element:  <Tracking /> ,
      },
      {
        path: "bmi",
        element:  <BMI /> ,
      },
      {
        path: "waterConsumption",
        element:  <WaterConsumption /> ,
      },
      {
        path: "goals",
        element:  <Goals /> ,
      },
      {
        path: "community",
        element:  <Community /> ,
      },
      {
        path: "tips",
        element:  <Tips /> ,
      },
      {
        path: "trainerProfile",
        element:  <TrainerProfile /> ,
      },
      
      {
        path: "trainerTips",
        element:  <TrainerTips /> ,
      },
      
      {
        path: "trainerTraining",
        element:  <TrainerTraining /> ,
      },
      
      {
        path: "trainerQuotes",
        element:  <TrainerQuotes /> ,
      },
      {
        path: "editProfile",
        element:  <EditProfile /> ,
      },
      {
        path: "editTrainerProfile",
        element:  <EditTrainerProfile /> ,
      },
      {
        path: "deleteTrainerAccount",
        element:  <DeleteTrainerAccount /> ,
      },
      {
        path: "addTip",
        element:  <AddTip /> ,
      },
      {
        path: "viewTip",
        element:  <ViewTip /> ,
      },
      {
        path: "editTip",
        element:  <EditTip /> ,
      },
      {
        path: "viewTipStudent",
        element:  <ViewTipStudent /> ,
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
