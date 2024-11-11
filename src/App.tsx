import { DataTable } from "./components/table";
import { Toaster } from "./components/ui/sonner";

function App() {

  return (
    <div className="px-5 lg:px-10 pt-7">
      <DataTable/>
        <Toaster/>
    </div>
  )
}

export default App
