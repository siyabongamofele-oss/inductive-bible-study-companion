import React from 'react';
import { BookOpen, Home, Info, Menu, Smartphone, X } from 'lucide-react';

export type AppView = 'home' | 'study' | 'privacy';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [installPrompt, setInstallPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [showInstallHelp, setShowInstallHelp] = React.useState(false);

  React.useEffect(() => {
    const displayMode = window.matchMedia('(display-mode: standalone)');
    const updateInstalledState = () => setIsInstalled(displayMode.matches);
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setShowInstallHelp(false);
      setIsInstalled(true);
    };

    updateInstalledState();
    displayMode.addEventListener('change', updateInstalledState);
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      displayMode.removeEventListener('change', updateInstalledState);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      setShowInstallHelp(true);
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    setShowInstallHelp(choice.outcome === 'dismissed');
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-50 px-4 py-3 flex justify-between items-center">
        <h1 className="font-serif text-xl font-bold text-slate-800">IBS Companion</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="primary-navigation"
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full invisible'}
        lg:relative lg:translate-x-0 transition duration-200 ease-in-out
        w-64 bg-slate-900 text-slate-100 flex flex-col z-40 lg:visible
      `}>
        <div className="p-6 border-b border-slate-700 hidden lg:block">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-white">IBS Companion</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Muizenberg Method</p>
        </div>

        <nav id="primary-navigation" aria-label="Primary navigation" className="flex-1 overflow-y-auto p-4 space-y-2 mt-16 lg:mt-0">
          <button 
            onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
            aria-current={activeView === 'home' ? 'page' : undefined}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 ${activeView === 'home' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <Home size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Current Study
          </div>
          
          <button 
             onClick={() => { onNavigate('study'); setIsMobileMenuOpen(false); }}
             aria-current={activeView === 'study' ? 'page' : undefined}
             className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 ${activeView === 'study' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <BookOpen size={20} />
            <span className="font-medium">Workspace</span>
          </button>

          <button 
             onClick={() => { onNavigate('privacy'); setIsMobileMenuOpen(false); }}
             aria-current={activeView === 'privacy' ? 'page' : undefined}
             className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 ${activeView === 'privacy' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
           >
            <Info size={20} />
            <span className="font-medium">Privacy &amp; launch</span>
          </button>

          <div className="mt-auto px-4 py-4 text-xs text-slate-500">
             <p>"Let the text speak."</p>
             {!isInstalled && (
               <div className="mt-4">
               <button
                 onClick={handleInstall}
                 className="flex w-full items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
               >
                 <Smartphone size={16} /> Install app
               </button>
                {showInstallHelp && (
                  <p role="status" className="mt-2 leading-5 text-slate-300">
                    Use your browser menu to choose <strong>Install app</strong> or <strong>Add to Home Screen</strong>.
                    On iPhone or iPad in Safari, tap Share, then Add to Home Screen.
                  </p>
                )}
               </div>
             )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden pt-14 lg:pt-0 relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;