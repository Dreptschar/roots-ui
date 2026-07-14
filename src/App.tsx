import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { RoomsPage } from './pages/RoomsPage';
import { SettingsPage } from './pages/SettingsPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { PlantDetailPage } from './pages/PlantDetailPage';
import { PlantEditorPage } from './pages/PlantEditorPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/plants" replace />} />
      <Route path="/plants" element={<DashboardPage />} />
      <Route path="/rooms" element={<RoomsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/rooms/:id" element={<RoomDetailPage />} />
      <Route path="/plants/new" element={<PlantEditorPage mode="create" />} />
      <Route path="/plants/:id" element={<PlantDetailPage />} />
      <Route path="/plants/:id/edit" element={<PlantEditorPage mode="edit" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
