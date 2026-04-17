import { cn } from "./utils/cn";
import { useApplications } from "./hooks/useApplications";
import { useHealthPoller } from "./hooks/useHealthPoller";
import { Header } from "./components/Header";
import { AppCard } from "./components/AppCard";

function App() {
  const { applications, error } = useApplications();
  const { healthMap, checkNow } = useHealthPoller(applications);

  return (
    <div className={cn("min-h-screen bg-[#0a0820] text-white flex flex-col overflow-x-hidden")}>
      <Header />

      {error ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className={cn(
            "w-full max-w-lg rounded-xl p-6 text-center",
            "bg-red-900/40 border border-red-500 text-red-200"
          )}>
            <p className="text-lg font-semibold mb-2">Failed to load applications</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      ) : (
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-screen-xl px-4 py-6 flex flex-col gap-4">
            {applications.map((app) => (
              <AppCard
                key={app.Name}
                app={app}
                healthMap={healthMap}
                onHealthCheck={checkNow}
              />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
