import DashboardLayout from "@/components/layout/DashboardLayout";
import Sidebar from "@/components/sidebar/Sidebar";
import { CanvasArea } from "@/components/canvas/CanvasArea";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <CanvasArea />
    </DashboardLayout>
  );
}
