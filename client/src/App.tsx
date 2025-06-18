import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DoctorsPage from "@/pages/doctors";
import AddDoctorPage from "@/pages/add-doctor";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/doctors/general-physician-internal-medicine" component={DoctorsPage} />
      <Route path="/add-doctor" component={AddDoctorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
