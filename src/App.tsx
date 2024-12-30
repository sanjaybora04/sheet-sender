import { CircleHelp } from "lucide-react";
import { DataTable } from "./components/table";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Toaster } from "./components/ui/sonner";

function App() {

  return (
    <div className="px-5 lg:px-10 pt-7">
      <Dialog>
        <DialogTrigger asChild className="fixed top-2 left-2">
          <Button className="p-2">
            <CircleHelp/>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Use?</DialogTitle>
          </DialogHeader>
          <div>
            1. Go to settings {'->'} Add Sheet {'->'} Load Sheet<br/>
            2. Go to methods tab in settings {'->'} Add email or whatsapp methods<br/>
            3. Use filters to filter the data and select rows you want to Use
            4. Click on arrow icon in top right {'->'} Select method you want to use {'->'} Select column you want to use {'->'} Edit the message and Send<br/>
            5. Wait until all the messages are sent, and if there were any errors a file will be downloaded, send that file to <a href="mailto:sanjaybora380@gmail.com" className="underline text-blue-500">sanjaybora380@gmail.com</a>
          </div>
        </DialogContent>
      </Dialog>
      <DataTable/>
      <Toaster/>
    </div>
  )
}

export default App
