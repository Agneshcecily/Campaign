// app/subscriberlist/add-subscriber/page.tsx
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileSpreadsheet, FileType2, HardDriveUpload } from "lucide-react";
import {toast, Toaster} from "sonner";
import { CheckCheck } from "lucide-react";
import router from "next/dist/client/router";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/ui/navbar";




export default function AddSubscriberPage() {
     const router = useRouter();
     const [loading, setLoading] = useState(false);
     const searchParams = useSearchParams();
     const [groupId, setgroupId] = useState('')//use grpid when uploading
     const [uploadStatus, setUploadStatus] = useState<string>('');

    useEffect(() => {
    const id = searchParams.get('groupId');
    if (id) {
      setgroupId(id);
    }
  }, [searchParams]);


  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
   const file = event.target.files?.[0];
   if (!file) {
     toast.error("No file selected!");
    return;
   }

   const formData = new FormData();
   formData.append("file", file);

  
   // ensure this exists in DB

   try {
    const res = await fetch(`http://localhost:4000/subscriber/groups/${groupId}/upload`, {
        headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
            },
      method: "POST",
      body: formData,
    });

    const text = await res.text();

    if (res.ok) {
      toast.success("Upload successful", {
        icon: <CheckCheck className="text-green-600" />,
        className: "bg-white shadow-md",
      });
      setUploadStatus("Upload successful");

      setTimeout(() => {
        router.push(`/subscriberview?groupId=${groupId}`);
      }, 1000);
    } else {
      setUploadStatus("Upload failed: " + res.status);
    }
  } catch (error) {
    setUploadStatus("Upload error");
  }
}

  


  return (
    <div className="min-h-screen flex overflow-x-hidden gap-[30px]">
      <div className="">
         <Navbar></Navbar>
      </div>
      <div className='flex flex-col min-h-screen w-[95vw] text-black gap-[5px] ml-[75px]'>   
      <h1 className="text-2xl font-semibold ml-8">Summer Launch 2025</h1>

      <p className="text-gray-500 ml-8">
        Add subscribers manually or import them to build your audience.
      </p>

      <div
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 cursor-pointer ml-2 mb-4"
        onClick={() => router.back()}
       >
        <ArrowLeft className="w-4 h-4 text-black" />
      </div>



      <Tabs defaultValue="csv" className="w-full">
        <div className="relative ml-8 border-b border-gray-300 w-fit max-w-xl space-x-10 mb-4">
          <TabsList className="bg-transparent p-0 flex gap-10 relative">
            <TabsTrigger
              value="csv"
              className="relative text-lg font-medium text-gray-700 pb-2 
               data-[state=active]:text-black 
               data-[state=active]:after:content-[''] 
               data-[state=active]:after:absolute 
               data-[state=active]:after:bottom-0 
               data-[state=active]:after:left-0 
               data-[state=active]:after:h-[2px] 
               data-[state=active]:after:w-full 
               data-[state=active]:after:bg-black"
            >
              Bulk Upload (CSV)
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className="relative text-lg font-medium text-gray-700 pb-2 
               data-[state=active]:text-black 
               data-[state=active]:after:content-[''] 
               data-[state=active]:after:absolute 
               data-[state=active]:after:bottom-0 
               data-[state=active]:after:left-0 
               data-[state=active]:after:h-[2px] 
               data-[state=active]:after:w-full 
               data-[state=active]:after:bg-black"
            >
              Manual Entry
            </TabsTrigger>
          </TabsList>
        </div>
        

        {/* Bulk Upload Content */}
        <TabsContent value="csv" className="mt-0 pt-0 -ml-4">
          {/* Segments Dropdown */}
          <div className="mb-6 ml-4">
            <Label htmlFor="segments" className="mb-2 block">
              Segments
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger className="border border-gray-300 bg-white w-72 h-10 px-4 text-left rounded-md flex items-center justify-between">
                <span>Newsletter, Promotions</span>
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Newsletter</DropdownMenuItem>
                <DropdownMenuItem>Promotions</DropdownMenuItem>
                <DropdownMenuItem>VIP Customers</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* File Upload */}
          <CardContent className="mr-8 mb-4">
            <h3 className="text-black font-bold mb-2">Upload Your File</h3>
            <div className="border border-dashed border-gray-500 p-6 rounded text-center h-50 flex flex-col items-center justify-center">
              <HardDriveUpload size={40} />
              <p className="mb-1 font-bold">Drag And Drop CSV File here</p>
              <p className="text-gray-500 mb-1">or Click to Browse Files</p>
              <label htmlFor="csv-upload">
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button asChild>
                    <span>Select CSV File</span>
                </Button>
              </label>
              
            </div>
          </CardContent>

          {/* Advanced Options */}
          <h2 className="font-bold ml-5 mb-4">Advance Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileType2 size={18} />
                <h4 className="font-semibold mb-2">Paste Text</h4>
              </div>
              <p className="text-gray-500 mb-2">Directly copy and paste your subscribers</p>
              <p>Enter email addresses (one per line, up to 2000 at a time)</p>
              <Input placeholder="Type your description here." className="mt-2 h-15" />
            </CardContent>

            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileSpreadsheet size={18} />
                <h4 className="font-semibold mb-2">Google Sheet</h4>
              </div>
              <p className="text-gray-500 mb-2">Import your subscriber list directly from Google Sheets</p>
              <p>Enter email addresses (one per line, up to 2000 at a time)</p>
              <Input placeholder="Type your description here." className="mt-2 h-15" />
            </CardContent>

            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileType2 size={18} />
                <h4 className="font-semibold mb-2">Connect Your Database</h4>
              </div>
              <p className="text-gray-500 mb-2">Directly copy and paste your subscribers</p>
              <p>Enter email addresses (one per line, up to 2000 at a time)</p>
              <Input placeholder="Type your description here." className="mt-2 h-15" />
            </CardContent>
          </div>
        </TabsContent>

        {/* Manual Entry Content */}
        <TabsContent value="manual">
          <Card>
            <CardContent className="p-6">
              <Label>Email Address</Label>
              <Input placeholder="example@email.com" className="mb-4" />

              <Label>Segments</Label>
              <Input placeholder="e.g. Newsletter, Promotions" className="mb-4" />

              <Button variant="outline" className="mr-2">
                Add New Detail
              </Button>
              <Button className="mt-4">Save</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  );
}
function setUploadStatus(arg0: string) {
    throw new Error("Function not implemented.");
}

