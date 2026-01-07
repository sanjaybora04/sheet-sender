import ProgressBar from "../progress";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowUpRightFromSquare, Phone } from "lucide-react";
import { z } from "zod";
import { useState } from "react";
import axios from "axios";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { useAtomValue, useSetAtom } from "jotai";
import { methodAtom, stepAtom } from ".";
import { toast } from "sonner";
import { Input } from "../ui/input";

export default function SendWhatsapp({ numbers }: { numbers: string[] }) {
    const setStep = useSetAtom(stepAtom)
    const method = useAtomValue(methodAtom)

    const [progress, setProgress] = useState<any>(null)
    const [errors, setErrors] = useState<any>([])
    const [templateName, setTemplateName] = useState("");

    const [image, setImage] = useState<any>('')

    async function uploadImage(base64String: string) {
        const byteString = atob(base64String.split(',')[1]); // Decode Base64 string
        const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0]; // Get the MIME type
        const ab = new ArrayBuffer(byteString.length); // Create an ArrayBuffer
        const ia = new Uint8Array(ab); // Create a typed array

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i); // Fill the typed array with byte values
        }

        // Generate a default filename based on the current timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Format timestamp
        const defaultFileName = `file_${timestamp}.${mimeString.split('/')[1]}`; // Generate filename


        const file = new File([ab], defaultFileName, { type: mimeString });

        // Create FormData to send the file
        const formData = new FormData();
        formData.append('file', file); // Append the file to the FormData
        formData.append('type', mimeString),
            formData.append('messaging_product', 'whatsapp')

        try {
            // Make the Axios POST request to upload the file
            const response = await axios.post(`https://graph.facebook.com/v21.0/${method.numberId}/media`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the correct content type
                    Authorization: `Bearer ${method.token}`
                }
            });
            if (response.status == 200) {
                return response.data.id
            }
            else {
                throw new Error('Error uploading file')
            }
        } catch (error) {
            throw new Error('Error uploading file')
        }

    }

    async function sendMessage(number: string) {

        const toNumber = number.startsWith("91") ? number : `91${number}`;

        const mediaId = await uploadImage(image);

        let query: any = {
            messaging_product: "whatsapp",
            to: toNumber,
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: "en"
                },
                components: [
                    {
                        type: 'header',
                        parameters: [
                            {
                                type: "image",
                                image: {
                                    id: mediaId
                                }
                            }
                        ]
                    }
                ]
            }
        }

        const res = await axios.post(`https://graph.facebook.com/v22.0/${method.numberId}/messages`,
            query,
            {
                headers: {
                    Authorization: `Bearer ${method.token}`
                }
            }
        )
        
        console.log(res.data);

        if (res.status == 200) {
            console.log('Message Sent', res.data)
        }
        else {
            throw res
        }
        return
    }

    async function onSubmit() {
        // console.log(await uploadImage(image))
        // return
        if (!image) {
            toast.error("Please upload image first");
            return;
        }

        if (!templateName) {
            toast.error("Please enter template name");
            return;
        }

        try {
            setProgress(0)
            setErrors([])

            for (let i = 0; i < numbers.length; i++) {
                try {
                    await sendMessage(numbers[i])
                } catch (error: any) {
                    setErrors((prev: any) => [...prev, { number: numbers[i], error: error }])
                }
                setProgress((prev: any) => prev + 1)
            }

            if (errors.length > 0) {
                downloadErrorsAsJSON(errors);
            }

            setProgress(null)
            toast.success('Operation successfull!!')

        } catch (error) {
            alert('Error')
            setProgress(null)
            return
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
                    Whatsapp Message
                </DialogTitle>
            </DialogHeader>
            {progress != null && <ProgressBar progress={progress} total={numbers.length} errors={errors.length} />}

            <>
                <Input type="file"
                    onChange={(e) => {
                        const file = e.target.files?.[0]; // Get the selected file
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setImage(reader.result); // Base64 string is available here
                            };
                            reader.readAsDataURL(file); // Convert the file to base64 string
                        }
                    }}
                />
                {image && (
                <Input
                    placeholder="Enter approved template name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                />
                )}
                <div className="flex items-center justify-between min-w-64">
                    <Button onClick={() => onSubmit()}>Send</Button>
                    <div>Cost: ₹{Math.floor(numbers.length * 0.7846)}(approx)</div>
                </div>
            </>

            <hr />
            <div className="flex justify-between">
                <Button className="p-2" onClick={() => setStep(2)}><ArrowLeft /></Button>
            </div>
        </>
    )
}