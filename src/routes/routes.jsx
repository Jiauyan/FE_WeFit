import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
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
import { CompleteProfile } from "../pages/auth/CompleteProfile.jsx";
import { FitnessLevel } from "../pages/auth/FitnessLevel.jsx";
import { FitnessGoal } from "../pages/auth/FitnessGoal.jsx";
import { FavClass } from "../pages/auth/FavClass.jsx";
import { ForgotPassword } from "../pages/auth/ForgotPassword.jsx";
import { TrainerProfile } from '../pages/trainerProfile/TrainerProfile.jsx';
import { TrainerTips } from '../pages/trainerTips/TrainerTips.jsx';
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
import { BookingDetails } from '../pages/training/BookingDetails.jsx';
import { Booking } from '../pages/booking/Booking.jsx';
import { ViewBooking } from '../pages/booking/ViewBooking.jsx';
import { GetRandomMotivationalQuote } from '../pages/trainerQuotes/GetRandomMotivationalQuote.jsx';
import { MyPost } from '../pages/community/MyPost.jsx';
import { ChatRoom}  from '../pages/community/ChatRoom.jsx';
import { ChatPage } from '../pages/community/ChatPage.jsx';
import { UserChatList } from '../pages/community/UserChatList.jsx';
import { NewChatRoom }from '../pages/community/NewChatRoom.jsx';
import { StudentList } from '../pages/trainerTraining/StudentList.jsx';
import { ViewStudentDetails } from '../pages/trainerTraining/ViewStudentDetails.jsx';
import { ViewConsentForm } from '../pages/trainerTraining/ViewConsentForm.jsx';
import RecommendedTrainingPrograms from '../pages/training/RecommededTrainingPrograms.jsx';
import BeginnerTrainingPrograms from '../pages/training/BeginnerTrainingPrograms.jsx';
import IntermediateTrainingPrograms from '../pages/training/IntermediateTrainingPrograms.jsx';
import AdvancedTrainingPrograms from '../pages/training/AdvancedTrainingPrograms.jsx';
import PendingBooking from '../pages/booking/PendingBooking.jsx';
import CompletedBooking from '../pages/booking/CompletedBooking.jsx';
import { ViewPost } from '../pages/community/ViewPost.jsx';
import { TrainerDashboard } from '../pages/trainerDashboard/TrainerDashboard.jsx';
import { ScreeningForm } from '../pages/training/ScreeningForm.jsx';
import { ConsentForm } from '../pages/training/ConsentForm.jsx';
import { LiabilityForm } from '../pages/training/LiabilityForm.jsx';
import { Checkout } from '../pages/training/Checkout.jsx';
import PaymentSuccess from '../components/PaymentSuccess.jsx';
import PaymentCancel from '../components/PaymentCancel.jsx';
import BookingSuccess from '../components/BookingSuccess.jsx';
import { ViewScreeningForm } from '../pages/trainerTraining/ViewScreeningForm.jsx';
import { Logout } from '../pages/auth/Logout.jsx';
import { DeleteAccountSuccess } from '../pages/auth/DeleteAccountSuccess.jsx';
import { PrivacyPolicy } from '../components/PrivacyPolicy.jsx';
import { ContactUs } from '../components/ContactUs.jsx';

const ProtectedRoute = ({ children }) => {
  // Replace this logic with your actual authentication logic
  const isAuthenticated = Boolean(localStorage.getItem('accessToken')); // Example: checking for a token in localStorage
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the login page but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const RedirectIfAuthenticated = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem('accessToken')); // Check if user is authenticated
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard"; // Where to redirect if needed

  // Redirect authenticated users to 'from' or dashboard
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  // Render children (Login, Register, etc.) if not authenticated
  return children;
};

const routes = [
  {
    path: "/",
    element: <Navigate to="/login" replace /> // Redirects root path to login
  },
  {
    path: "/login",
    element: (
      <RedirectIfAuthenticated>
        <Login />
      </RedirectIfAuthenticated>
    ),
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
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/deleteAccountSuccess",
    element: <DeleteAccountSuccess />,
  },
  {
    path: "/",
    element: <ProtectedRoute><SideBar /></ProtectedRoute>,
    children: [
      {
        path: "profile",
        element:  <Profile /> ,
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
        path: "screeningForm",
        element:  <ScreeningForm/> ,
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
      {
        path: "studentList",
        element:  <StudentList/> ,
      },
      {
        path: "viewStudentDetails",
        element:  <ViewStudentDetails/> ,
      },
      {
        path: "viewConsentForm",
        element:  <ViewConsentForm/> ,
      },
      {
        path: "recommededTrainingPrograms",
        element:  <RecommendedTrainingPrograms/> ,
      },
      {
        path: "beginnerTrainingPrograms",
        element:  <BeginnerTrainingPrograms/> ,
      },
      {
        path: "intermediateTrainingPrograms",
        element:  <IntermediateTrainingPrograms/> ,
      },
      {
        path: "advancedTrainingPrograms",
        element:  <AdvancedTrainingPrograms/> ,
      },
      {
        path: "pendingBooking",
        element:  <PendingBooking/> ,
      },
      {
        path: "completedBooking",
        element:  <CompletedBooking/> ,
      },
      {
        path: "viewPost",
        element:  <ViewPost/> ,
      },
      {
        path: "trainerDashboard",
        element:  <TrainerDashboard/> ,
      },
      {
        path: "consentForm",
        element:  <ConsentForm/> ,
      },
      {
        path: "liabilityForm",
        element:  <LiabilityForm/> ,
      },
      {
        path: "checkout",
        element:  <Checkout/> ,
      },
      {
        path: "paymentSuccess",
        element:  <PaymentSuccess/> ,
      },
      {
        path: "paymentCancel",
        element:  <PaymentCancel/> ,
      },
      {
        path: "bookingSuccess",
        element:  <BookingSuccess/> ,
      },
      {
        path: "viewScreeningForm",
        element:  <ViewScreeningForm/> ,
      },
      {
        path: "privacyPolicy",
        element:  <PrivacyPolicy/> ,
      },
      {
        path: "contactUs",
        element:  <ContactUs/> ,
      },
    ],
  }
];

export default routes;
