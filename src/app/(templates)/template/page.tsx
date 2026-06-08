'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, CheckCheck, HardDriveUpload, HeartIcon, LayoutTemplate, MoreVertical, Upload } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/ui/navbar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TemplatePreviewModal from '@/components/ui/preview';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toaster,toast } from 'sonner';

interface Template {
  name: string;
  objectiveId: number;
  template:string;
  id:number;
}
interface Objective {
  name: string;
  description: string;
  id:number;
}

export default function UploadTemplatePage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [objectiveId, setObjectiveId] = useState<number | null>(null);
  const searchParams=useSearchParams();
  const [templates,setTemplates]=useState<Template[] | null>(null);
  const [objective,setObjective]=useState<Objective | null>(null);
  const [selectedHtml, setSelectedHtml] = useState('');
  const [isDeleteDialogOpen,setIsDeleteDialogOpen]=useState(false);
  const [templateId,setTemplateId]=useState<number | null>(null);

  const handleDelete=(template:Template)=>{
   setIsDeleteDialogOpen(true);
   setTemplateId(template.id);
  }

  useEffect(() => {
    const id = searchParams.get('objId');
    if (id) {
      setObjectiveId(Number(id));
    }
  }, [searchParams]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handlePreview = (html:string) => {
    setSelectedHtml(html);
  };

  const closeModal = () => {
    setSelectedHtml('');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file && file.name.endsWith('.html')) {
      setSelectedFile(file);
    } else {
      toast.error('Please select a html file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = async() => {
    const data=await fetchTemplates();
     const templates = data?.template || [];

  if (templates.length === 0) {
    router.push('/objective');
  }
  
  };
useEffect(() => {
  fetchTemplates();
}, [objectiveId]);

  const handleDeleteSubmit=async (e:React.FormEvent)=>{
  e.preventDefault();

  try{
          const token=localStorage.getItem('authToken')
          const response = await fetch(`http://localhost:4000/campaign-details/template-delete/${templateId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const res=await response.json()

        if(response.ok){
         const newTempId=res.templateId
         setIsDeleteDialogOpen(false);
         setTemplates(prev => {
        if (!prev) return null;
        return prev.filter(template => template.id !== newTempId);
         });

    }
        if(response.status===401){
          return false;
        }
      }
      catch(error){
           return false;    }
    }
   

    const fetchTemplates = async () => {
      if(objectiveId===null) return;
      try {
        const res = await fetch(`http://localhost:4000/campaign-details/${objectiveId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
          },
        });
        if (!res.ok) {
          const text = await res.text();
          return;
        }
        const data = await res.json();

        if (res.ok) {
            setObjective(data.objective) 
            const temp=data.template
            setTemplates(data.template);
            setSelectedFile(null)
            return data;
        } else {
          return [];
        }
      } catch (err) {
        return err
      } 
    };


  const handleAddTemplates = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('template', selectedFile);
      if(objectiveId!==null){
      formData.append('obj',objectiveId.toString());
      }

      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:4000/campaign-details/template', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
          },
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Handle successful upload
            await fetchTemplates()
            toast.success("Templates added successfully!", {
            icon: <CheckCheck className="text-green-600" />,
            className: "bg-white shadow-md",
          }); 
        
        
      } else {
        const error = await response.text();
         toast.error(`Upload failed: ${error}`);
      }
    } 
    catch (error) {
      toast.error('Upload failed. Please try again.');
      return error
    } 
    finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-center" />
           
    <div className="min-h-screen max-w-full bg-gray-50 flex overflow-x-hidden gap-[30px]">
      {/* Left Sidebar */}
      <div className="">
        <Navbar></Navbar>
      </div>

      {/* Main Content */}
      {(!templates || templates.length===0) ? (
      <div className=" flex flex-col min-h-screen w-[95vw] p-6 text-black gap-[35px] ml-[75px]">
        {/* Header */}
        <div className="flex items-center mb-8 max-w-full">
          <button 
            onClick={handleCancel}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Upload Your Templates</h1>
            <p className="text-gray-600 mt-1">Add your Template by simply drag And Drop</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="w-full max-w-7xl h-[423px] bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Your Template</h2>
          
          {/* Drag and Drop Area */}
          <div
            className={`flex items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-xl text-center transition-all duration-200 ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 bg-gray-50'
            } ${selectedFile ? 'border-green-400 bg-green-50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-full max-w-xl  flex flex-col items-center justify-center gap-[16.66px]">
              <div className="w-16 h-12 flex items-center justify-center">
                <HardDriveUpload className="w-[33.33px] h-[33.33px] text-zinc-950" />
              </div>
              
              {selectedFile ? (
                <div className="text-center">
                  <p className="text-lg font-medium text-green-700">
                    File Selected: {selectedFile.name}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Ready to upload ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className=" text-[#09090B] font-bold text-[14px] leading-[16px] tracking-[0]">
                    Drag And Drop html File here
                  </p>
                  <p className="text-[#71717A] text-[14px] leading-[16px] tracking-[0]">Or Click to Browse files</p>
                </div>
              )}
              
              <button
                onClick={openFileDialog}
                disabled={isUploading}
                className="w-32 h-10 text-[#71717A] font-medium text-[14px] leading-[16px] tracking-[0]  bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Select html File
              </button>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,text/html"
            onChange={handleFileInputChange}
            className="hidden"
          />
           {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-[30px] ">
          <button
            onClick={handleCancel}
            disabled={isUploading}
            className="px-6 py-3 bg-zinc-100 border border-gray-300 text-black-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleAddTemplates}
            disabled={!selectedFile || isUploading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedFile && !isUploading
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Add templates'}
          </button>
        </div>
        </div>

       
      </div>):(
      <div className=" flex flex-col min-h-screen w-[95vw] p-6 text-black gap-[35px] ml-[75px]">
        <div className='flex justify-between'>
      <div className='flex items-center gap-[8px]'>
      <div onClick={()=>router.push('/objective')}><ArrowLeft className='hover:bg-gray-300 border-none rounded-md'></ArrowLeft></div>
      <div className='flex flex-col'>
      <h2 className="text-xl font-semibold">{objective?.name}</h2>
      <p className=''>{objective?.description}</p>
      </div>
      </div>
      <Button onClick={()=>{router.push(`/template?objId=${objectiveId}`);
                            setTemplates(null);
    }}><LayoutTemplate></LayoutTemplate> Add New Template</Button>
      </div>
<div className='border p-4 pr-0'>
  <h1 className='font-geist font-bold text-[20px] leading-[32px] tracking-[0%] pb-4'>Your template</h1>
      <div className="flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ml-4">
    {(templates??[]).map((template, index) => (
      <Card key={index} className="w-full max-w-[295px] min-h-[315px] bg-page relative p-0 flex flex-col rounded-xl shadow-md gap-4" >
        <CardHeader className="flex flex-col p-0 justify-top items-center text-center">
          <div
              className="bg-white h-[180px] border border-gray-200 rounded-md  shadow-inner text-left overflow-hidden"
              dangerouslySetInnerHTML={{ __html: template.template }}
            />
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 w-8 h-8 bg-white rounded-full p-2">
           <HeartIcon className='bg-white'></HeartIcon>
          </Button>
           </CardHeader>
          <CardTitle className='ml-[20px] items-center'>{(template.name).replace(/\.html$/, "")} <p className='mt-2 text-[#71717A] text-[14px] leading-[21px] font-normal tracking-[0] font-[Geist]'>{(objective?.name)}</p></CardTitle>
          
          <CardDescription className="flex flex-wrap px-4 justify-between mt-auto mb-4">
            <Button 
            onClick={() => handlePreview(template.template)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
            className='w-full sm:w-[calc(70%-4px)] h-[32px] bg-[#E0E0E0] text-[#18181B] text-sm rounded hover:text-white hover:bg-black'>
            Preview</Button>
            <Button 
            onClick={()=>handleDelete(template)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
            className='w-full sm:w-[calc(30%-4px)] h-[32px] bg-[#E0E0E0] text-[#18181B] text-sm rounded hover:text-white hover:bg-black'>
            Delete</Button>
          </CardDescription>
      </Card>
    ))}
  </div>
  </div>
  <TemplatePreviewModal htmlContent={selectedHtml} onClose={closeModal} />
</div>
          )}
  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <DialogContent className="w-full max-w-sm sm:max-w-lg p-4 sm:p-6 rounded-md">
            <form onSubmit={handleDeleteSubmit}>
            <DialogHeader>
              <DialogTitle>Delete Template ?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-2 m-4 ml-0 mr-0 bg-[#EFF6FF] text-[#1E40AF]">           
              <div className="space-y-2">
                <p>Are you sure you want to delete this email template</p>
              </div>
              <div className="space-y-2">
                <p>This action cant be undone</p>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end mt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[72px] px-4 py-2 sm:h-[36px]"
                type="button"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="w-full sm:w-[142px] px-4 py-2 sm:h-[36px] bg-[#EB5757] text-black hover:bg-[#EB5757] text-sm sm:text-base"
              type="submit"
            >
              Delete
            </Button>
          </DialogFooter>

              </form>
          </DialogContent>
</Dialog>

    </div>
    </div>
  );
}