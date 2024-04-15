import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavbarSection from './components/navbar';
import ProtectedRoute from './components/protectedroute';
import HomePage from './pages/homepage';
import RegisterPage from './pages/userregisterpage';
import LoginPage from './pages/userloginpage';
import ProfilePage from './pages/profilepage';
import AuthContextProvider from "./context/authcontext"
import CreateJobPage from './pages/createjobpage';
import EditJobPage from './pages/editjob';
import AllListings from './pages/alllistings';
import JobApplicantsPage from './pages/jobapplicants';
import AllEmpolyees from './pages/allempolyees';
import ALLRecruiterJobs from './pages/allRecruiterJobs';
import MYApplications from './pages/myApplications';
import PageNotFound from './pages/pagenotfound';
import './App.css';









function App() {
  return (
    <div className="App font-mainFont flex flex-col h-screen">
      <AuthContextProvider>
        <BrowserRouter>
              <NavbarSection />
              <div className='bg-custom-pattern bg-cover bg-center basis-full'>
                <Routes>
                  <Route path='/'element={<HomePage />} />
                  <Route path='/login'element={<LoginPage />} />
                  <Route path='/register'element={<RegisterPage />} />
                  <Route path='/myprofile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path='/createjob' element={<ProtectedRoute><CreateJobPage /></ProtectedRoute>} />
                  <Route path='/mylistings' element={<ProtectedRoute><AllListings /></ProtectedRoute>} />
                  <Route path='/editjob/:id' element={<ProtectedRoute><EditJobPage /></ProtectedRoute>} />
                  <Route path='/jobapplicants/:id' element={<ProtectedRoute><JobApplicantsPage /></ProtectedRoute>} />
                  <Route path='/allempolyees' element={<ProtectedRoute><AllEmpolyees /></ProtectedRoute>} />
                  <Route path='/alljobs' element={<ProtectedRoute><ALLRecruiterJobs /></ProtectedRoute>} />
                  <Route path='/myapplications' element={<ProtectedRoute><MYApplications /></ProtectedRoute>} />
                  <Route path='*' element={<PageNotFound />} />
                </Routes>
              </div>
          </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
