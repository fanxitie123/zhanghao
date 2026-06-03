import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import KnowledgeBase from "@/pages/KnowledgeBase";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import PartyBuildingScreen from "@/pages/PartyBuildingScreen";
import MyActivities from "@/pages/MyActivities";
import MediaTools from "@/pages/MediaTools";
import TestExcelGenerator from "@/pages/TestExcelGenerator";
import { AdminLayout } from "@/components/AdminLayout";
import ChatData from "@/pages/admin/ChatData";
import Feedback from "@/pages/admin/Feedback";
import SystemStats from "@/pages/admin/SystemStats";
import QaStats from "@/pages/admin/QaStats";
import KnowledgeStats from "@/pages/admin/KnowledgeStats";
import ModelConfig from "@/pages/admin/ModelConfig";
import KnowledgeConfig from "@/pages/admin/KnowledgeConfig";
import DocumentTemplate from "@/pages/admin/DocumentTemplate";
import QaRules from "@/pages/admin/QaRules";
import RoleManagement from "@/pages/admin/RoleManagement";
import PermissionManagement from "@/pages/admin/PermissionManagement";
import OrganizationManagement from "@/pages/admin/OrganizationManagement";
import AccountManagement from "@/pages/admin/AccountManagement";
import SystemConfig from "@/pages/admin/SystemConfig";
import LoginLog from "@/pages/admin/LoginLog";
import OperationLog from "@/pages/admin/OperationLog";
import ChatLog from "@/pages/admin/ChatLog";
import SensitiveWord from "@/pages/admin/SensitiveWord";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/media-tools" element={<MediaTools />} />
        <Route path="/test-excel" element={<TestExcelGenerator />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/party-building" element={<PartyBuildingScreen />} />
        <Route path="/activities" element={<MyActivities />} />
        
        <Route path="/admin" element={<AdminLayout children={<SystemStats />} />} />
        <Route path="/admin/chat" element={<AdminLayout children={<ChatData />} />} />
        <Route path="/admin/feedback" element={<AdminLayout children={<Feedback />} />} />
        <Route path="/admin/system" element={<AdminLayout children={<SystemStats />} />} />
        <Route path="/admin/qa" element={<AdminLayout children={<QaStats />} />} />
        <Route path="/admin/knowledge" element={<AdminLayout children={<KnowledgeStats />} />} />
        <Route path="/admin/model" element={<AdminLayout children={<ModelConfig />} />} />
        <Route path="/admin/knowledge-config" element={<AdminLayout children={<KnowledgeConfig />} />} />
        <Route path="/admin/template" element={<AdminLayout children={<DocumentTemplate />} />} />
        <Route path="/admin/rules" element={<AdminLayout children={<QaRules />} />} />
        <Route path="/admin/role" element={<AdminLayout children={<RoleManagement />} />} />
        <Route path="/admin/permission" element={<AdminLayout children={<PermissionManagement />} />} />
        <Route path="/admin/organization" element={<AdminLayout children={<OrganizationManagement />} />} />
        <Route path="/admin/account" element={<AdminLayout children={<AccountManagement />} />} />
        <Route path="/admin/system-config" element={<AdminLayout children={<SystemConfig />} />} />
        <Route path="/admin/login-log" element={<AdminLayout children={<LoginLog />} />} />
        <Route path="/admin/operation-log" element={<AdminLayout children={<OperationLog />} />} />
        <Route path="/admin/chat-log" element={<AdminLayout children={<ChatLog />} />} />
        <Route path="/admin/sensitive-word" element={<AdminLayout children={<SensitiveWord />} />} />
      </Routes>
    </Router>
  );
}
