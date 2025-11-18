// Auth Screens
import Splash from './auth/Splash';
import Signin from './auth/Signin';
import ForgetPassword from './auth/ForgetPassword';
import CheckEmail from './auth/CheckEmail';
import CreatePassword from './auth/CreatePassword';
import PasswordReset from './auth/PasswordReset';
import OnBoardingScreen from './auth/OnBoarding/OnBoardingScreen';
import SignUp from './auth/SignUp';
import VerifyEmail from './auth/VerifyEmail';
import Home from './main/Recruiter/Home';
import Chat from './main/Recruiter/Chat';
import FindStaff from './main/Recruiter/FindStaff';
import Wallet from './main/Recruiter/Wallet';
import ActiveJobOffers from './main/Recruiter/HomeTabs/ActiveJobOffers';
import JobPreview from './main/Recruiter/HomeTabs/JobPreview';
import ViewJobDetails from './main/Recruiter/ViewJobDetails';
import JobCandidates from './main/Recruiter/JobCandidates';
import QuickSearch from './main/Recruiter/HomeTabs/QuickSearch';
import ManualSearch from './main/Recruiter/HomeTabs/ManualSearch';

import AccountDetails from './main/wallet/AccountDetails';
import BankDetails from './main/wallet/BankDetails';
import FormSummary from './main/wallet/FormSummary';
import PurchaseCoins from './main/wallet/PurchaseCoins';
import WithdrawCoins from './main/wallet/WithdrawCoins';
import WalletStack from '@/navigation/WalletStack';
import Messages from './main/chat/Messages';

import AbilityToWork from './main/Recruiter/ManualSearchSteps/AbilityToWork';
import StepThree from './main/Recruiter/ManualSearchSteps/StepThree';
import StepTwo from './main/Recruiter/ManualSearchSteps/StepTwo';
import MainDashboard from './main/Recruiter/DashBoard/MainDashboard';
import LaborPoolScreen from './main/Recruiter/LaborPool/LaborPool';
import SquadPoolScreen from './main/Recruiter/LaborPool/SquadPool';
import Contractors from './main/Recruiter/LaborPool/Contractors';
import ActiveOffers from './main/Recruiter/CurrentOffers/ActiveOffers';
import DraftedOffers from './main/Recruiter/CurrentOffers/DraftedOffers';
import CompletedOffers from './main/Recruiter/HomeTabs/CompletedOffers';
import ExpiredOffers from './main/Recruiter/HomeTabs/ExpiredOffers';
import StaffPreferences from './main/Recruiter/Settings/StaffPreferences';
import UpdateMain from './main/Recruiter/Update/UpdateMain';
import UpdateSecond from './main/Recruiter/Update/UpdateSecond';
import UpdateThird from './main/Recruiter/Update/UpdateThird';
import Notifcations from './main/Recruiter/Notifications';
import StepOne from './main/Recruiter/QuickSearch/StepOne';
import StepTwoQuickSearch from './main/Recruiter/QuickSearch/StepTwo';
import StepThreeQuickSearch from './main/Recruiter/QuickSearch/StepThree';
import StepFourQuickSearch from './main/Recruiter/QuickSearch/StepFour';
import JobSettings from './main/Recruiter/Settings/JobSettings';
import AppSettings from './main/Recruiter/Settings/AppSettings';
import SquadSettings from './main/Recruiter/Settings/SquadSettings';
import AccountUpgrade from './main/Recruiter/AccountUpgrade';
import Support from './main/Recruiter/Support';

import Profile from './main/Recruiter/profile/Profile';
import BasicDetails from './main/Recruiter/profile/BasicDetails';
import Address from './main/Recruiter/profile/Address';
import ContactDetails from './main/Recruiter/profile/ContactDetails';
import TaxInformation from './main/Recruiter/profile/TaxInformation';
import VisaDetails from './main/Recruiter/profile/VisaDetails';
import KycVerification from './main/Recruiter/profile/kyc/KycVerification';
import JobQualification from './main/Recruiter/profile/JobQualification';
import Biography from './main/Recruiter/profile/Biography';
import SocialMedia from './main/Recruiter/profile/SocialMedia';
import Password from './main/Recruiter/profile/Password';
import KycDocument from './main/Recruiter/profile/kyc/KycDocument';
import KycSubmit from './main/Recruiter/profile/kyc/KycSubmit';
import JobSeekerTabNavigator from '@/navigation/JobSeekerTab';
import WorkExperienceScreen from './main/JobSeeker/DashBoard/TabScreens/WorkExperience';
import JobSeekerDashboard from './main/JobSeeker/DashBoard/Dashboard';
import MarketPlace from './main/JobSeeker/DashBoard/MarketPlace/MarketPlace';
import ProductDetails from './main/JobSeeker/DashBoard/MarketPlace/ProductDetails';
import PostProduct from './main/JobSeeker/DashBoard/MarketPlace/PostProduct';
import MarketplaceCart from './main/JobSeeker/DashBoard/MarketPlace/Cart';
import MarketplaceFavorites from './main/JobSeeker/DashBoard/MarketPlace/Favorites';
import Checkout from './main/JobSeeker/DashBoard/MarketPlace/Checkout';
import Payment from './main/JobSeeker/DashBoard/MarketPlace/Payment';
import Orders from './main/JobSeeker/DashBoard/MarketPlace/Orders';
import OrderDetails from './main/JobSeeker/DashBoard/MarketPlace/OrderDetails';
import MarketplaceStack from '@/navigation/MarketplaceStack';
import KycBusiness from './main/Recruiter/profile/kyc/KycBusiness';
import AddExperience from './main/JobSeeker/DashBoard/TabScreens/AddExperince/AddExpericnce';
import AddJobStep1 from './main/JobSeeker/DashBoard/TabScreens/AddExperince/AddJobStep1';
import AddJobStep2 from './main/JobSeeker/DashBoard/TabScreens/AddExperince/AddJobStep2';
import SquadSettingsGroups from './main/JobSeeker/DashBoard/Settings/Groups';
import GroupDetail from './main/JobSeeker/DashBoard/Settings/GroupDetail';
import Members from './main/JobSeeker/DashBoard/Settings/Members';

import EditProfile from './main/Recruiter/profile/EditProfile';

import QuickSearchPreview from './main/Recruiter/QuickSearch/QuickSearchPreview';

import AcceptedOffers from './main/JobSeeker/AcceptedOffers';
// Tab Screens

export {
  Splash,
  Signin,
  ForgetPassword,
  CheckEmail,
  CreatePassword,
  PasswordReset,
  OnBoardingScreen,
  SignUp,
  VerifyEmail,
  Home,
  Wallet,
  FindStaff,
  Chat,
  ActiveJobOffers,
  JobPreview,
  ViewJobDetails,
  JobCandidates,
  QuickSearch,
  ManualSearch,

  AccountDetails,
  BankDetails,
  FormSummary,
  PurchaseCoins,
  WithdrawCoins,

  WalletStack,
  Messages,

  AbilityToWork,
  StepThree,
  StepTwo,
  MainDashboard,
  LaborPoolScreen,
  SquadPoolScreen,
  Contractors,
  ActiveOffers,
  DraftedOffers,
  CompletedOffers,
  ExpiredOffers,
  StaffPreferences,
  UpdateMain,
  UpdateSecond,
  UpdateThird,
  Notifcations,
  StepOne,
  StepTwoQuickSearch,
  StepThreeQuickSearch,
  StepFourQuickSearch,
  JobSettings,
  AppSettings,
  SquadSettings,
  AccountUpgrade,
  Support,
  Profile,
  BasicDetails,
  Address,
  ContactDetails,
  TaxInformation,
  VisaDetails,
  KycVerification,
  JobQualification,
  Biography,
  SocialMedia,
  Password,
  KycDocument,
  KycSubmit,
  JobSeekerTabNavigator,
JobSeekerDashboard,
MarketPlace,
ProductDetails,
PostProduct,
MarketplaceCart,
MarketplaceFavorites,
Checkout,
Payment,
Orders,
OrderDetails,
MarketplaceStack,
KycBusiness,
AddExperience,
AddJobStep1,
AddJobStep2,
SquadSettingsGroups,
GroupDetail,
Members,
EditProfile,
QuickSearchPreview,

AcceptedOffers
};
