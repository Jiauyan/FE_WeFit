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
import { TrainerQuotes } from '../pages/trainerQuotes/TrainerQuotes.jsx';
import { EditProfile } from '../pages/userProfile/EditProfile.jsx';
import { EditTrainerProfile } from '../pages/trainerProfile/EditTrainerProfile.jsx';
import { DeleteTrainerAccount } from '../pages/trainerProfile/DeleteTrainerAccount.jsx';
import { AddTip } from '../pages/trainerTips/AddTip.jsx';
import { ViewTip } from '../pages/trainerTips/ViewTip.jsx';
import { EditTip } from '../pages/trainerTips/EditTip.jsx';
import { ViewTipStudent } from '../pages/tips/ViewTipStudent.jsx';
import { MotivationalQuotes } from '../pages/trainerQuotes/MotivationalQuotes.jsx';
import { AddMotivationalQuote } from '../pages/trainerQuotes/AddMotivationalQuote.jsx';
import { EditMotivationalQuote } from '../pages/trainerQuotes/EditMotivationalQuote.jsx';
import { DeleteMotivationalQuote } from '../pages/trainerQuotes/DeleteMotivationalQuote.jsx';
import { AddTrainingProgram } from '../pages/trainerTraining/AddTrainingProgram.jsx';
import { ViewTrainerTrainingProgram} from '../pages/trainerTraining/ViewTrainerTrainingProgram.jsx';
import { DeleteTrainingProgram } from '../pages/trainerTraining/DeleteTrainingProgram.jsx';
import { EditTrainingProgram } from '../pages/trainerTraining/EditTrainingProgram.jsx';
import { TrainerTrainingPrograms } from '../pages/trainerTraining/TrainerTrainingPrograms.jsx';
import { TrainingPrograms } from '../pages/training/TrainingPrograms.jsx';
import { ViewTrainingProgram } from '../pages/training/ViewTrainingProgram.jsx';
import { FitnessPlan } from '../pages/fitnessPlan/FitnessPlan.jsx';
import { AddFitnessPlan } from '../pages/fitnessPlan/AddFitnessPlan.jsx';
import { ViewFitnessPlan } from '../pages/fitnessPlan/ViewFitnessPlan.jsx';
import { EditFitnessPlan } from '../pages/fitnessPlan/EditFitnessPlan.jsx';
import { ConsentForm } from '../pages/training/ConsentForm.jsx';
import { BookingDetails } from '../pages/training/BookingDetails.jsx';
import { Booking } from '../pages/booking/Booking.jsx';
import { ViewBooking } from '../pages/booking/ViewBooking.jsx';
import { GetRandomMotivationalQuote } from '../pages/trainerQuotes/GetRandomMotivationalQuote.jsx';
import { MyPost } from '../pages/community/MyPost.jsx';
import { ChatRoom}  from '../pages/community/ChatRoom.jsx';
import { ChatPage } from '../pages/community/ChatPage.jsx';
import { UserChatList } from '../pages/community/UserChatList.jsx';
import { NewChatRoom }from '../pages/community/NewChatRoom.jsx';


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
      {
        path: "motivationalQuotes",
        element:  <MotivationalQuotes /> ,
      },
      {
        path: "addMotivationalQuote",
        element:  <AddMotivationalQuote /> ,
      },
      {
        path: "editMotivationalQuote",
        element:  <EditMotivationalQuote /> ,
      },
      {
        path: "deleteMotivationalQuotes",
        element:  <DeleteMotivationalQuote /> ,
      },
      {
        path: "trainerTrainingPrograms",
        element:  <TrainerTrainingPrograms /> ,
      },
      {
        path: "addTrainingProgram",
        element:  <AddTrainingProgram /> ,
      },
      {
        path: "viewTrainerTrainingProgram",
        element:  <ViewTrainerTrainingProgram /> ,
      },
      {
        path: "deleteTrainingProgram",
        element:  <DeleteTrainingProgram /> ,
      },
      {
        path: "editTrainingProgram",
        element:  <EditTrainingProgram /> ,
      },
      {
        path: "trainingPrograms",
        element:  <TrainingPrograms /> ,
      },
      {
        path: "viewTrainingProgram",
        element:  <ViewTrainingProgram /> ,
      },
      {
        path: "fitnessPlan",
        element:  <FitnessPlan /> ,
      },
      {
        path: "addFitnessPlan",
        element:  <AddFitnessPlan /> ,
      },
      {
        path: "viewFitnessPlan",
        element:  <ViewFitnessPlan/> ,
      },
      {
        path: "editFitnessPlan",
        element:  <EditFitnessPlan/> ,
      },
      {
        path: "consentForm",
        element:  <ConsentForm/> ,
      },
      {
        path: "bookingDetails",
        element:  <BookingDetails/> ,
      },
      {
        path: "myBooking",
        element:  <Booking/> ,
      },
      {
        path: "viewBooking",
        element:  <ViewBooking/> ,
      },
      {
        path: "getRandomMotivationalQuote",
        element:  <GetRandomMotivationalQuote/> ,
      },
      {
        path: "myPost",
        element:  <MyPost/> ,
      },
      {
        path: "chatPage",
        element:  <ChatPage/> ,
      },
      {
        path: "chat",
        element:  <ChatRoom/> ,
      },
      {
        path: "userChatList",
        element:  <UserChatList/> ,
      },
      {
        path: "newChatRoom",
        element:  <NewChatRoom/> ,
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
