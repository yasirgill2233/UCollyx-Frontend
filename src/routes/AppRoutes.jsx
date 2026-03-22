import {Routes, Route} from "react-router"; 
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Verify from "../pages/auth/Verify";
import WorkspaceSelection from "../pages/auth/WorkspaceSelection";
import WorkspaceSetup from "../pages/auth/WorkspaceSetup";
import JoinWorkspaceFlow from "../pages/auth/JoinWorkspaceFlow";
import RequestSuccessful from "../pages/auth/RequestSuccessful";
import NotFound from "../pages/auth/NotFound";
import SignOutModal from "../pages/auth/SingnOutModal";
import SignedOutSuccess from "../pages/auth/SignedOutSuccess";
import Dashboard from "../pages/dashboard/Dashboard";
import IDEBody from "../pages/CloudeIDE/IDEBody";
import DevChat from "../pages/DevChatt/DevChatt";
import KanbanBoard from "../pages/Board/KanbanBoard";
import MyProject from "../pages/Project/MyProject";
import IssuesDashboard from "../pages/Project/IssuesDashboard";
import MeetingsPage from "../pages/Meeting/MeetingsPage";
import Main from "../components/layout/Main";
import ProjectsPage from "../pages/Project/ProjectsPage";
import ManagerPortfolio from "../pages/Manager/ManagerPortfolio";
import ProjectDetailView from "../pages/Manager/ProjectDetailView";
import TeamActivity from "../pages/Manager/TeamActivity/TeamActivity";
import ProjectTasksView from "../pages/Manager/Tasks/ProjectTasksView";
import MainDashboard from "../pages/QualityAssurance/MainDashboard";
import RedCardsAlerts from "../pages/QualityAssurance/RedCardAlerts";
import AlertDetailsSidebar from "../pages/QualityAssurance/AlertDetailsSidebar";
import ReportBugForm from "../pages/QualityAssurance/ReportBugForm";
import VerificationPage from "../pages/QualityAssurance/VerificationPage";
import OrganizationDashboard from "../pages/OrgAdmin/OrganizationDashboard";
import AdminProjectsView from "../pages/OrgAdmin/AdminProjectsView";
import UsersManagement from "../pages/OrgAdmin/UserManagement";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import OrganizationsScreen from "../pages/Admin/OrganizationsScreen";
import MembersAndRoles from "../pages/Admin/MembersAndRoles";

function AppRoutes() {
  return (
      <Routes>

        {/* Authentication/Authorization */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/workspace-selection" element={<WorkspaceSelection />} />
        <Route path="/workspace-setup" element={<WorkspaceSetup />} />
        <Route path="/join-workspace" element={<JoinWorkspaceFlow />} />
        <Route path="/request-successful" element={<RequestSuccessful />} />
        <Route path="/sign-out" element={<SignOutModal />} />
        <Route path="/signed-out-success" element={<SignedOutSuccess />} />

        {/* Developer */}
        <Route path="/" element={<Main />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/ide/:projectId" element={<IDEBody />} />
          <Route path="/ide" element={<IDEBody />} />
          <Route path="my-projects" element={<MyProject />} />
          <Route path="issues" element={<IssuesDashboard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="dev-chat" element={<DevChat />} />
          <Route path="kanban-board" element={<KanbanBoard />} />
          <Route path="meetings" element={<MeetingsPage />} />

          {/* Manager */}
          <Route path="manager-portfolio" element={<ManagerPortfolio />} />
          <Route path="team-activity" element={<TeamActivity />} />
          <Route path="project-tasks-view" element={<ProjectTasksView />} />
          <Route path="project-detail-view" element={<ProjectDetailView />} />

          {/* Quality Assurance */}
          <Route path="main-dashboard" element={<MainDashboard />} />
          <Route path="red-card-alerts" element={<RedCardsAlerts />} />
          <Route path="report-bug-form" element={<ReportBugForm />} />
          <Route path="verification" element={<VerificationPage />} />

          {/* Org Admin */}
          <Route path="org-dashboard" element={<OrganizationDashboard />} />
          <Route path="admin-projects-view" element={<AdminProjectsView />} />
          <Route path="user-management" element={<UsersManagement />} />

          {/* Super Admin */}
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="orgs-screen" element={<OrganizationsScreen />} />
          <Route path="members-and-roles" element={<MembersAndRoles />} />
          <Route path="members-and-roles/:orgId" element={<MembersAndRoles />} />

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default AppRoutes;