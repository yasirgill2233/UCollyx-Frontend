import { Routes, Route } from "react-router";
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
import ReportBugForm from "../pages/QualityAssurance/ReportBugForm";
import VerificationPage from "../pages/QualityAssurance/VerificationPage";
import OrganizationDashboard from "../pages/OrgAdmin/OrganizationDashboard";
import AdminProjectsView from "../pages/OrgAdmin/AdminProjectsView";
import UsersManagement from "../pages/OrgAdmin/UserManagement";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import OrganizationsScreen from "../pages/Admin/OrganizationsScreen";
import MembersAndRoles from "../pages/Admin/MembersAndRoles";
import PageLoader from "../components/ui/PageLoader";
import { Suspense, lazy } from "react";
import SetPassword from "../pages/auth/SetPassword";
import JoinWorkspace from "../pages/auth/JoinWorkspace";
import SelectWorkspace from "../pages/auth/SelectWorkspace";
import ProtectedRoute from "./ProtectedRoute";

// const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* --- PUBLIC / AUTH ROUTES --- */}
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify" element={<Verify />} />
          <Route path="set-password" element={<SetPassword />} />
          <Route path="join-space" element={<JoinWorkspace />} />

          <Route
            path="workspace-selection"
            element={
              <ProtectedRoute>
                <WorkspaceSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="workspace-setup"
            element={
              <ProtectedRoute>
                <WorkspaceSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="join-workspace"
            element={
              <ProtectedRoute>
                <JoinWorkspaceFlow />
              </ProtectedRoute>
            }
          />
          <Route
            path="request-successful"
            element={
              <ProtectedRoute>
                <RequestSuccessful />
              </ProtectedRoute>
            }
          />
          <Route
            path="sign-out"
            element={
              <ProtectedRoute>
                <SignOutModal />
              </ProtectedRoute>
            }
          />
          <Route
            path="signed-out-success"
            element={
              <ProtectedRoute>
                <SignedOutSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="select-workspace"
            element={
              <ProtectedRoute>
                <SelectWorkspace />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          {/* --- PROTECTED APP ROUTES (Inside Layout) --- */}
          <Route element={<Main />}>
            {/* Developer Group */}
            <Route
              path="dev"
              element={<ProtectedRoute allowedRoles={["dev"]} />}
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="my-projects" element={<MyProject />} />
              <Route path="issues" element={<IssuesDashboard />} />
              <Route path="board" element={<KanbanBoard />} />
              <Route path="ide/:projectId?" element={<IDEBody />} />
              <Route path="projects-dir" element={<ProjectsPage />} />
              <Route path="chat" element={<DevChat />} />
              <Route path="meetings" element={<MeetingsPage />} />
            </Route>

            {/* Manager Group */}
            <Route
              path="manager"
              element={<ProtectedRoute allowedRoles={["manager"]} />}
            >
              <Route path="portfolio" element={<ManagerPortfolio />} />
              <Route path="activity" element={<TeamActivity />} />
              <Route path="tasks" element={<ProjectTasksView />} />
              <Route path="details" element={<ProjectDetailView />} />

              <Route path="ide/:projectId?" element={<IDEBody />} />
              <Route path="chat" element={<DevChat />} />
              <Route path="projects-dir" element={<ProjectsPage />} />

              <Route path="meetings" element={<MeetingsPage />} />
            </Route>

            {/* QA Group */}
            <Route path="qa" element={<ProtectedRoute allowedRoles={["qa"]} />}>
              <Route path="dashboard" element={<MainDashboard />} />
              <Route path="alerts" element={<RedCardsAlerts />} />
              <Route path="report-bug" element={<ReportBugForm />} />
              <Route path="verify-task" element={<VerificationPage />} />

              <Route path="board" element={<KanbanBoard />} />
              <Route path="chat" element={<DevChat />} />
              <Route path="projects-dir" element={<ProjectsPage />} />

              <Route path="meetings" element={<MeetingsPage />} />
            </Route>

            {/* Organization Admin Group */}
            <Route
              path="org-admin"
              element={<ProtectedRoute allowedRoles={["org_admin"]} />}
            >
              <Route path="dashboard" element={<OrganizationDashboard />} />
              <Route path="projects" element={<AdminProjectsView />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="chat" element={<DevChat />} />
              <Route path="meetings" element={<MeetingsPage />} />
            </Route>

            {/* Super Admin Group */}
            <Route
              path="super-admin"
              element={<ProtectedRoute allowedRoles={["super_admin"]} />}
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orgs" element={<OrganizationsScreen />} />
              <Route path="roles" element={<MembersAndRoles />} />
              <Route path="roles/:orgId" element={<MembersAndRoles />} />
            </Route>
          </Route>
        </Route>

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
