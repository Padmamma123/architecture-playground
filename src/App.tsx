import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './features/dashboard/Dashboard';
import SolidListPage, { SolidDetailPage } from './features/solid/SolidPage';
import PatternCategoryPage from './features/patterns/PatternCategoryPage';
import PatternDetailPage from './features/patterns/PatternDetailPage';
import ArchitecturePlayground from './features/architecture/ArchitecturePlayground';
import CaseStudiesPage from './features/case-studies/CaseStudiesPage';
import ComparisonLab from './features/comparison/ComparisonLab';
import QuizPage from './features/quiz/QuizPage';
import CodePlayground from './features/code-playground/CodePlayground';
import StoryLibraryPage from './features/stories/StoryLibraryPage';
import SystemDesignHub from './features/system-design/SystemDesignHub';
import TopicPage from './features/system-design/TopicPage';
import DesignProblemPage from './features/system-design/DesignProblemPage';
import CapacityCalculator from './features/system-design/CapacityCalculator';
import DecisionLab from './features/system-design/DecisionLab';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/solid" element={<SolidListPage />} />
            <Route path="/solid/:id" element={<SolidDetailPage />} />
            <Route path="/patterns/:category" element={<PatternCategoryPage />} />
            <Route path="/patterns/:category/:id" element={<PatternDetailPage />} />
            <Route path="/architecture" element={<ArchitecturePlayground />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/comparison" element={<ComparisonLab />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/playground" element={<CodePlayground />} />
            <Route path="/stories" element={<StoryLibraryPage />} />
            <Route path="/system-design" element={<SystemDesignHub />} />
            <Route path="/system-design/topic/:id" element={<TopicPage />} />
            <Route path="/system-design/problem/:id" element={<DesignProblemPage />} />
            <Route path="/system-design/calculator" element={<CapacityCalculator />} />
            <Route path="/system-design/decisions" element={<DecisionLab />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
