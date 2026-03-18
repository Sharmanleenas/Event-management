import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const DashboardShell = ({ children }) => {
  return (
    <div className="flex h-screen bg-opera-plaster overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
