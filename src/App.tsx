import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { PlantDetailPage } from './pages/PlantDetailPage';
import { PlantEditorPage } from './pages/PlantEditorPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/plants/new" element={<PlantEditorPage mode="create" />} />
      <Route path="/plants/:id" element={<PlantDetailPage />} />
      <Route path="/plants/:id/edit" element={<PlantEditorPage mode="edit" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
