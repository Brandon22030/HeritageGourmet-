
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import RecipeLibrary from "./pages/RecipeLibrary";
import ExplorerPage from "./pages/ExplorerPage";
import PlanificationPage from "./pages/PlanificationPage";
import FamillePage from "./pages/FamillePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/bibliotheque" element={<RecipeLibrary />} />
              <Route path="/explorer" element={<ExplorerPage />} />
              <Route path="/planification" element={<PlanificationPage />} />
              <Route path="/famille" element={<FamillePage />} />
              <Route path="/recette/:id" element={<RecipeDetailPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
