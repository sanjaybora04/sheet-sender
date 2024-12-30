import { useState } from "react";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowLeft } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import { methodAtom, stepAtom } from ".";
import { toast } from "sonner";
import ProgressBar from "../progress";

export default function SendEmail({recipients}:{recipients:string[]}) {
    const setStep = useSetAtom(stepAtom)
    const method = useAtomValue(methodAtom)

    const [subject, setSubject] = useState<any>()
    const [content, setContent] = useState<any>()

    const [progress, setProgress] = useState<any>(null)
    const [errors, setErrors] = useState(0)

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ];
    const template = (c: string) => `
    <html>
    <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" />
    <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>
    </head>
    <body class='ql-editor'>${c}</body>
    </html>
    `

    async function onSubmit(){
        setProgress(0); // Reset progress for each new submission
        setErrors(0); // Reset error messages

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/sendmails`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    config: {
                        host: method.host,
                        port: method.port,
                        user: method.email,
                        pass: method.password,
                    },
                    recipients,
                    subject,
                    message: template(content),
                }),
            });

            const { sessionId } = await response.json();

            // Initialize EventSource to listen for SSE messages
            const eventSource = new EventSource(`${import.meta.env.VITE_SERVER_URL}/progress/${sessionId}`);

            // Listen for events from the server
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                
                if (data.status === 'progress') {
                    setProgress(data.successCount);
                    setErrors(data.errorCount)
                } else if (data.status === 'completed') {
                    setProgress(null)
                    if(data.errorLog.length>0){
                        downloadErrorsAsJSON(data.errorLog)
                    }
                    toast.success('Operation Successful!!')
                    eventSource.close(); // Close the EventSource when completed
                }
            };

            eventSource.onerror = () => {
                console.error('Error receiving SSE messages');
                eventSource.close();
            };
            setProgress(null)
        } catch (error) {
            setProgress(null)
            console.error("Error sending emails:", error);
            toast("Error sending emails. Please try again.");
        }
    }

    function downloadErrorsAsJSON(errors: any[]) {
        const errorData = JSON.stringify(errors, null, 2);  // Convert errors to pretty-printed JSON string

        // Create a Blob from the JSON string
        const blob = new Blob([errorData], { type: 'application/json' });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'errors.json';  // Filename for the downloaded file

        // Programmatically trigger a click to download the file
        a.click();

        // Clean up the URL object
        URL.revokeObjectURL(url);
    }
        
    
    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Email {recipients.length} contacts
                </DialogTitle>
            </DialogHeader>
            {progress !=null && <ProgressBar progress={progress} total={recipients.length} errors={errors} />}
            <div>
                <div className="my-2 flex gap-2 items-center whitespace-nowrap">Subject :
                    <Input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Enter subject"/>
                </div>
                <ReactQuill theme="snow" value={content} onChange={(val) => setContent(val)}
                    modules={{
                        toolbar: toolbarOptions
                    }}
                    className="max-h-[50vh] overflow-y-scroll"
                />
                <div className="flex justify-between mt-2">
                    <Button className="p-2" onClick={()=>setStep(2)}>
                        <ArrowLeft/>
                    </Button>
                    <Button
                    onClick={()=>onSubmit()}
                >Send</Button>
                </div>
            </div>
        </>
    )
}