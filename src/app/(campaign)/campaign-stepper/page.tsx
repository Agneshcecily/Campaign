"use client";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import React from 'react';
import ProgressBar from "@/components/ProgressBar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ShoppingBagIcon,
  SendIcon,
  RefreshCwIcon,
  GiftIcon,
  SettingsIcon,
  ChevronsRightIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronsLeftIcon,
  MoreHorizontalIcon,
  ArrowUpDownIcon,
  ArrowLeft,
  HeartIcon,
  Calendar,
  MessageSquareDiff,
  Check,
  SendHorizontal,
  X,
  Badge,
  UsersIcon,
  CalendarIcon,
  TimerIcon,
  MegaphoneIcon,
  CheckIcon,
  MonitorIcon,
  BatteryIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navbar from '@/components/ui/navbar';
import {toast} from 'sonner'

interface Template {
  name: string;
  objectiveId: number;
  template:string;
  id:number;
}

interface Subscriber {
  email: string;
  id: string;
  name: string;
  subscribers: string;
  createdAt: string;
}

interface Group {
  id: string
  name: string
  subscribers: number
  createdAt: string
  description: string;
  senderEmail: string;
  email: string;
}
interface CampaignFormData {
  campName: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  description: string;
  selectedTemplateHtml: string;
  selectedAudienceIds: string[]; // or number[] if you're storing IDs
  deliveryMethod: string;
  selectedTimeZone: string;
  targetRules: Record<string, any>;
  scheduleId:string; // or a specific type
}


 const frameworks = [
    { name: "Spring Newsletter", template: "Seasonal Promotion" },
    { name: "Summer Launch 2025", template: "Product Launch" },
  ];
    // Campaign data
  const campaignInfo = {
    name: "Summer Sale 2025",
    description: "Promotional campaign for our annual summer collection",
    objective: "Seasonal Offer",
    audience: "5,432 Recipients",
    context: "Seasonal Promotion",
    schedule: "Apr 25, 2025",
  };

  // Campaign data
const campaignData = {
  title: "Summer Sale 2025",
  description: "Promotional campaign for our annual summer collection",
  badge: "Seasonal Offer",
  audience: {
    count: "5,432 Recipients",
    context: "Seasonal Promotion",
    schedule: "Apr 25, 2025",
  },
  targetAudience: {
    selected: "Loyal Customers",
    recipients: "5,243 recipients",
    lastUpdated: "2 days ago",
  },
  checklist: [
    { id: "details", label: "Campaign details are complete", checked: true },
    { id: "audience", label: "Target audience is defined", checked: true },
    {
      id: "content",
      label: "Email content and subject line are ready",
      checked: false,
    },
    {
      id: "schedule",
      label: "Delivery schedule is configured",
      checked: false,
    },
  ],
};
 const scheduleDetails = {
    deliveryDate: "April 25, 2025 at 10:00 AM EST",
    timeZone: "Eastern Standard Time (EST)",
  };

  // Checklist items
  const checklistItems = [
    { id: "details", label: "Campaign details are complete", checked: false },
    { id: "audience", label: "Target audience is defined", checked: false },
    {
      id: "content",
      label: "Email content and subject line are ready",
      checked: false,
    },
    {
      id: "schedule",
      label: "Delivery schedule is configured",
      checked: false,
    },
  ];
    // Navigation tabs
  const navigationTabs = [
    { id: "details", label: "Campaign Details", active: true },
    { id: "objective", label: "Objective", active: false },
    { id: "audience", label: "Audience", active: false },
    { id: "content", label: "Email Content", active: false },
    { id: "schedule", label: "Schedule", active: false },
  ];

  const initialaudienceData = [
    {
      id: "1",
      name: "agneshcecily18@gmail.com",
      createdAt: "17/04/2025",
      subscribers: 80,
    },
    {
      id: "2",
      name: "nnandha545@gmail.com",
      createdAt: "15/04/2025",
      subscribers: 50,
    },
    {
      id: "3",
      name: "julyselvam2@gmail.com",
      createdAt: "12/04/2025",
      subscribers: 10,
    },
    {
      id: "4",
      name: "Flash Sale Participants",
      createdAt: "10/04/2025",
      subscribers: 90,
    },
    {
      id: "5",
      name: "Newsletter Subscribers",
      createdAt: "7/04/2025",
      subscribers: 100,
    },
  ]
    // Schedule details data


    const formFields = [
    {
      id: "campName",
      label: "Campaign Name",
      defaultValue: "Spring Sale Launch",
      type: "input",
    },
    {
      id: "senderName",
      label: "Sender Name",
      defaultValue: "John from ACME Inc.",
      type: "input",
    },
    {
      id: "senderEmail",
      label: "Sender Email",
      defaultValue: "john@acme.com",
      type: "input",
    },
    {
      id: "subject",
      label: "Email Subject",
      defaultValue: '"Your Exclusive Spring Deal Inside!"',
      type: "input",
      counter: "0 / 28",
    },
    {
      id: "description",
      label: "Description",
      defaultValue: "Type your Description here.",
      type: "textarea",
      fullWidth: true,
    },
  ];
export default function CampaignStepper() {
  const router = useRouter();
  const [audiences, setAudiences] = useState(initialaudienceData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("14:45"); 
  const allChecked = audiences.length > 0 && selectedIds.length === audiences.length;
  const someChecked = selectedIds.length > 0 && !allChecked;
  const [activeStep, setActiveStep] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [deliveryMethod, setDeliveryMethod] = useState('send-now');
  const [selectedTimeZone, setSelectedTimeZone] = useState('GMT');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const timeZones = ["UTC", "GMT", "EST", "PST", "IST"];
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<number | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campId,setCampId]=useState("")
  const [totalAudience,setTotalAudience]=useState(0);
  const [templateName,setTemplateName]=useState("");
  const [objectiveName,setObjectiveName]=useState("");
  const [selectedAudience,setSelectedAudience]=useState("");
  const [schedule, setSchedule] = useState<{dateTime: string;timeZone: string;} | null>(null);
           

  const [targetRules, setTargetRules] = useState([
    { field: "Age", operator: "Greater", value: "18" }
    
  ]);
    const [campaignId, setCampaignId] = useState<number | null>(null);
 const [formData, setFormData] = useState<CampaignFormData>({
   campName: "",
    senderName: "",
    senderEmail: "",
    subject: "",
    description: "",
    selectedTemplateHtml: "",
    selectedAudienceIds: [],
    deliveryMethod: "",
    selectedTimeZone: "",
    targetRules: {},
    scheduleId:"",
  });

  const getScheduledDateTime = () => {
  if (!startDate || !selectedTime || !selectedTimeZone) return null;

  // Combine date and time
  const [hours, minutes] = selectedTime.split(':').map(Number);
  const scheduledDate = new Date(startDate);
  scheduledDate.setHours(hours);
  scheduledDate.setMinutes(minutes);
  scheduledDate.setSeconds(0);
  scheduledDate.setMilliseconds(0);

  return {
    dateTime: scheduledDate.toISOString(),
    timeZone: selectedTimeZone,
  };
};

const [scheduledAtTime, setScheduledAtTime] = useState<{ dateTime: string; timeZone: string } | null>(null);

const handleScheduleSubmit = async () => {
  const sched= getScheduledDateTime();
  setSchedule(sched);
  console.log(schedule)
  if (!schedule || schedule===null) {
    toast.error('Please fill in all schedule fields');
    return;
  }
  setScheduledAtTime(schedule);
};

useEffect(() => {
  const el = document.querySelector('[data-checkbox-indeterminate="true"]') as HTMLInputElement | null;
  if (el) el.indeterminate = true;
}, [someChecked]);


   const removeTargetRule = (index:any) => {
    setTargetRules(targetRules.filter((_, i) => i !== index));
  };

 const handleSelectAll = (checked: boolean) => {
  if (checked) {
    setSelectedIds(audiences.map((aud) => aud.id));
  } else {
    setSelectedIds([]);
  }
};

const toggleAudienceSelection = (id: string) => {
  setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
  );
};

const [templateSelection, setTemplateSelection] = useState({
    templateId: 0,
    selectedTemplateHtml: '',
  });

    const handlePreview = (template: Template) => {
    setPreviewHtml(template.template);
    setShowPreviewModal(true);
  };

    const handleUseTemplate = (template: Template,campId:string) => {
    setTemplateSelection({
      templateId: template.id ,
      selectedTemplateHtml: template.template,
    });

    setFormData((prev) => ({
      ...prev,
      templateId: template.id,
      selectedTemplateHtml: template.template,
      campId:campId
    }));
  };

 const addTargetRule = () => {
    setTargetRules([...targetRules, { field: "Age", operator: "Greater", value: "18" }]);
  };

 
  useEffect(() => {
  const fetchTemplates = async () => {
    try {
      const res = await fetch(`http://localhost:4000/campaign-details/${selectedObjectiveId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await res.json();
      setTemplates(data.template);
    } catch (error) {
      toast.error(`Fetch failed:, ${String(error)}`);
    }
  };

  if (activeStep === 4 && selectedObjectiveId) {
    fetchTemplates();
  }
}, [activeStep, selectedObjectiveId]);



 const handleBack = () => {
  setActiveStep((prev) => Math.max(prev - 1, 1));
  if(activeStep===1){
    handleSaveDraft()
      router.push('/campaign-dashboard')
  }
 };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleNextFromStep1 = async (e: React.FormEvent) => {
  e.preventDefault();

  const newErrors: { [key: string]: string } = {};
  const requiredFields = ["campName", "senderName", "senderEmail", "subject", "description"];
  

  requiredFields.forEach((field) => {
  const value = formData[field as keyof typeof formData];

  if (typeof value === "string") {
    if (!value.trim()) {
      newErrors[field] = "This field is required.";
    }
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      newErrors[field] = "At least one selection is required.";
    }
  } else if (typeof value === "object" && value !== null) {
    if (Object.keys(value).length === 0) {
      newErrors[field] = "This section cannot be empty.";
    }
  } else {
    if (!value) {
      newErrors[field] = "This field is required.";
    }
  }
});

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await fetch("http://localhost:4000/campaign-details/create", {
      method: "POST",
      headers: { 
            "Content-Type": "application/json" ,
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setCampId(data.id)

    if (!response.ok) throw new Error(`Failed to create: ${data}`);

    setErrors({}); 
    setActiveStep(2); 
  } catch (error) {
    toast.error(`Error:, ${String(error)}`);
  }
};
type Objective = {
  id: number;
  name: string;
  description: string;
};

function getIconForObjective(id: number) {
  switch (id) {
    case 1:
      return <ShoppingBagIcon className="w-8 h-8" />;
    case 2:
      return <SendIcon className="w-8 h-8" />;
    case 3:
      return <RefreshCwIcon className="w-8 h-8" />;
    case 4:
      return <GiftIcon className="w-8 h-8" />;
    case 5:
      return <SettingsIcon className="w-8 h-8" />;
    default:
      return null;
  }
}
useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const res = await fetch('http://localhost:4000/campaign-details/objective-details', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
          }
        });
        if (!res.ok) {
  const text = await res.text(); // Use .text() instead of .json() for error responses
  return;
}
        const data = await res.json();
        if (res.ok) {
          
            setObjectives(data);
        } else {
          return data.message
        }
      } catch (err) {
        return err
      } 
    };
if(activeStep===2){
    fetchObjectives();
}
}, [activeStep]);


 const handleNextFromStep2 = async() => {
    if (selectedObjectiveId === null) {
      toast.error("Please select a campaign objective.");
      return;
    }

    setFormData((prev) => ({ ...prev, objectiveId: selectedObjectiveId.toString(),campId:campId }));
    try {
          const res = await fetch('http://localhost:4000/campaign-details/objective-store', {
            method: "POST",
            headers: {
              "Content-Type": "application/json" ,
              'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
            },
              body: JSON.stringify({...formData,campId:campId})
          });
          const data = await res.json();
          if (res.ok) {
              setObjectiveName(data.objectiveName)
              setActiveStep(3)
          } else {
            toast.error(data.message)
          }
        } catch (err) {
          return err
        } 
      };

 const handleNextFromStep3 = async() => {

    setFormData((prev) => ({ ...prev, selectedAudienceIds:selectedIds,campId:campId }));
    const finalFormData = {
        ...formData,                         // includes any existing fields like objectiveId, etc.
        selectedAudienceIds: selectedIds,   // latest selected IDs from UI
        campId: campId                      // current campaign ID
      };
    try {
          const res = await fetch('http://localhost:4000/campaign-details/audience-store', {
            method: "POST",
            headers: {
              "Content-Type": "application/json" ,
              'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
            },
              body: JSON.stringify({finalFormData})
          });
          const data = await res.json();
          if (res.ok) {
            if(data.selectedAudience && data.audienceCounts){
              setTotalAudience(data.audienceCounts)
              setSelectedAudience(data.selectedAudience)
              setActiveStep(4)
            }
            else{
               toast.error("please select the audience !")
               return
            }
          } else {
             toast.error(data.message)
          }
        } catch (err) {
          return err
        } 
      };

    const handleNextFromStep4 = async() => {

    setFormData((prev) => ({
      ...prev,
      templateId: templateSelection.templateId,
      selectedTemplateHtml: templateSelection.selectedTemplateHtml,
    }));
  
    try {
          const res = await fetch('http://localhost:4000/campaign-details/template-store', {
            method: "POST",
            headers: {
              "Content-Type": "application/json" ,
              'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
            },
              body: JSON.stringify({...formData,campId:campId,templateId:templateSelection.templateId})
          });
          const data = await res.json();
          if (res.ok) {
              setTemplateName(data.templateName)
              setActiveStep(5)
          } else {
             toast.error(data.message)
          }
        } catch (err) {
          return err
        } 
      };

  const handleNextFromStep5 = async() => {

    setFormData((prev) => ({
      ...prev,
      deliveryMethod:deliveryMethod
    }));
    const finalFormData = {
        ...formData,                         // includes any existing fields like objectiveId, etc.
        deliveryMethod:deliveryMethod,   // latest selected IDs from UI
        campId: campId                      // current campaign ID
      };
      if(finalFormData.deliveryMethod==='schedule'){
        if(!schedule || schedule===null){
          toast.error('Fill all the Schedule details !')
          return
        }
      }

  
    try {
          const res = await fetch('http://localhost:4000/campaign-details/deliveryMethod-store', {
            method: "POST",
            headers: {
              "Content-Type": "application/json" ,
              'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
            },
              body: JSON.stringify({finalFormData})
          });
          const data = await res.json();
          if (res.ok) {
              setActiveStep(6)
          } else {
            toast.error(data.message)
          }
        } catch (err) {
          return err
        } 
      };



const handleSaveDraft = async () => {
  try {
    const response = await fetch("http://localhost:4000/campaign-details/save-draft", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
      },
      body: JSON.stringify({
        id: campaignId,       
        ...formData,             
        activeStep,
        status: "draft"
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      toast.error("Failed to save draft. Please try again.");
      return
    }

    router.push('/campaign-dashboard')
  } catch (error) {
    toast.error("An error occurred while saving the draft.");
  }
};
  const fetchGroups = async () => {
    try{
      const res = await fetch('http://localhost:4000/subscriber/groups',{
        headers:{'Authorization': `Bearer ${localStorage.getItem('authToken')}`}
      });
      const data = await res.json();
      setGroups(data);
    } catch (error) {
      return error
    }
  };
  useEffect(() => {
  fetchGroups();
  }, []);

   const fetchSubscribers = async (selectedIds:string[]) => {
      try{
        const res = await fetch(`http://localhost:4000/subscriber/campaign-creation/${selectedIds}`,{
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
            }
        });
        if(res.ok){
          const data = await res.json();
          setSubscribers(data);
          setTotalSubscribers(data.length);

          if(data.length === 0)
            if (typeof window !== 'undefined'){ //ensure client side only
              router.push(`subscriberlist/add-subscriber?groupId=${selectedIds}`)
          }
        } else {
          toast.error(`failed to fetch:, ${String(res.status)}`);
          
          
        }
      } catch(err) {
        toast.error(`Error fetching subscribers: ${String(err)}`);

      }
    };

    useEffect(() => {
  if (selectedIds.length > 0) {
    fetchSubscribers(selectedIds);
  }
}, [selectedIds]);


  const navigateToStep5 = () => {

};

const handleFinalStep = async() => {
  if (deliveryMethod === 'schedule') {
    await handleScheduleEmail();
    router.push('/campaign-dashboard') // ⬅️ this triggers the API call to schedule
  } else {
    // your logic for sending immediately
    await handleSendEmail();
    router.push('/campaign-dashboard')
     // ⬅️ you should define this
  }
};
  const handleSendEmail = async () => {
  const selectedEmails = subscribers.map((aud) => aud.email);
  if (selectedEmails.length === 0) {
    toast.error("Please select at least one audience to send the email.");
    return;
  }

  const payload = {
    to: selectedEmails, 
    subject: formData.subject || "No Subject",
    html: templateSelection.selectedTemplateHtml || "<p>No content</p>",
    from: formData.senderEmail,
    campId:campId
  };

  try {
    const response = await fetch("http://localhost:4000/campaign-details/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      toast.error("Email sent successfully!");
    } else {
       toast.error("Email failed to send: " + result.error);
      return
    }
  } catch (error) {
     toast.error("An unexpected error occurred.");
  }
};

const handleScheduleEmail = async () => {
  const selectedEmails = subscribers.map((aud) => aud.email);
  const selectedNames=subscribers.map((aud)=>aud.name)

  if (!startDate || !selectedTime || !selectedTimeZone) {
    return  toast.error("All fields are required.");
  }

const localScheduledAt = new Date(startDate);
const [hours, minutes] = selectedTime.split(":").map(Number);
localScheduledAt.setHours(hours);
localScheduledAt.setMinutes(minutes);
localScheduledAt.setSeconds(0);
  const scheduledAt = localScheduledAt.toISOString();

  const payload = {
    to: selectedEmails,
    subject: formData.subject || "No Subject",
    html: templateSelection.selectedTemplateHtml || "<p>No content</p>",
    scheduledAt: scheduledAt,
    timeZone: selectedTimeZone,
    selectedNames:selectedNames,
    campId:campId
  };

  try {
    const res = await fetch("http://localhost:4000/campaign-details/schedule-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // adjust as needed
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();


    if (!res.ok) {
      throw new Error(result.message || "Failed to schedule email");
    }

     toast.success("Email scheduled successfully!");
  } catch (err) {
     toast.error("Failed to schedule email: " + err)
  }
};
  
  return (
    <div className="flex">
      < Navbar/>
      <main className="flex-1 ml-[75px]">
        <header className="text-black p-6">
      <div className="flex items-center gap-4">
        <button onClick={handleBack} aria-label="Go back">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold">{activeStep === 1 ? "Create New Campaign" : formData.campName || "Campaign"}</h1>
          <p className="text-sm">Create all type of email campaigns.</p>
        </div>
      </div>
    </header>
        <div className="p-5">
          <ProgressBar activeStep={activeStep} />
          
          <section className="flex flex-col w-full  gap-6 mx-auto">

            {/* Step 1: Campaign Basics */}
            {activeStep === 1 && (
              <>
               
                <form onSubmit={handleNextFromStep1}>
                  <Card className="border border-solid border-zinc-200 rounded-none">
              <CardContent className="flex flex-wrap items-center gap-[44px] p-0 pl-12 pr-6 py-6">
                <h2 className="w-full font-bold text-xl text-zinc-950 leading-8">
                  Set Up Your Campaign Basics
                </h2>

                {formFields.map((field) => {
                    const rawValue = formData[field.id as keyof typeof formData];
                    const inputValue =typeof rawValue === "string" || typeof rawValue === "number" ? rawValue : "";
                   return (
                    <div
                      key={field.id}
                      className={`flex flex-col items-start gap-2.5 ${field.fullWidth ? "w-full" : "w-80"}`}
                    >
                      <div className="flex flex-col items-start gap-1.5 w-full">
                        <label
                          htmlFor={field.id}
                          className="inline-flex items-center gap-2.5 text-sm font-medium text-zinc-950"
                        >
                          {field.label}
                        </label>

                        {field.type === "input" ? (
                          <div className="relative w-full">
                            <Input
                              id={field.id}
                              value={inputValue}
                              onChange={handleChange}
                              placeholder={field.defaultValue}
                              className="h-10 bg-white"
                            />
                          </div>
                        ) : (
                          <Textarea
                            id={field.id}
                            value={inputValue}
                            onChange={handleChange}
                            placeholder={field.defaultValue}
                            className="h-20 bg-white"
                          />
                        )}

                        {errors[field.id] && (
                          <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                        )}
                      </div>
                    </div>
                  );
})}

              </CardContent>
            </Card>

                  <div className="flex justify-end mt-4 gap-4">
                    <Button variant="secondary" onClick={handleSaveDraft}>
                      Save Draft
                    </Button>

                    <Button type="submit">Next</Button>
                  </div>
                </form>
              </>
            )}

            {/* Step 2: Campaign Objective */}
            {activeStep === 2 && (
              <>
              <Card className="border border-solid border-zinc-200 rounded-none">
        <h2 className="text-xl font-bold ml-8 mb-6">Choose Your Campaign Objective</h2>
        <div className="flex ml-8 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1460px]">
            {objectives.map((objective) => {
              const objectiveId = Number(objective.id);
              const isSelected = selectedObjectiveId === objective.id;
              return (
                <Card
                  key={objectiveId}
                  onClick={() => {
                    setSelectedObjectiveId(objectiveId);
                  }}
                  className={`w-[360px] h-[300px] flex flex-col items-center rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-[2px] border-black shadow-md"
                      : "border border-zinc-200 shadow-sm"
                  }`}
                >
                  <CardContent className="flex flex-col w-full items-center gap-3 p-6">
                    {getIconForObjective(objective.id)}
                    <div className="text-[#08080a] text-lg font-semibold text-center">
                      {objective.name}
                    </div>
                    <div className="text-zinc-500 text-sm text-center">
                      {objective.description}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-start gap-2.5 pt-0 pb-6 px-6 w-full">
                    <Button
                      className={`flex-1 h-10 rounded-md font-medium text-sm ${
                        isSelected
                          ? "bg-black text-white"
                          : "bg-zinc-100 text-zinc-900"
                      }`}
                    >
                      {isSelected ? "Selected" : "Choose"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="flex justify-end mt-4 gap-4">
        <Button variant="secondary" onClick={handleSaveDraft}>
                      Save Draft
                    </Button>
        <Button
          onClick={() => {
            if (selectedObjectiveId !== null) {
              handleNextFromStep2();
            } else {
               toast.error("Please select a campaign objective.");
            }
          }}
        >
          Next
        </Button>
      </div>
    </>
              
            )}

            {/* Step 3: Audience Selection */}
            {activeStep === 3 && (
              <>
              <div className="flex flex-col items-start w-full">

      <div className="flex w-full bg-white">
        <main className="flex-1 relative">
          <div className="flex flex-col w-full items-end justify-end gap-[21px]">
            <div className="flex flex-wrap items-start gap-[24px] pt-6 pb-10 px-6 relative self-stretch w-full">
              <h2 className="w-full mt-[-1.00px] font-bold text-zinc-950 text-xl leading-8">
                Choose Your Campaign Audience
              </h2>

              <div className="flex flex-col w-full items-end relative">
                <div className="flex items-center justify-between w-full py-4">
                  <div className="relative w-96">
                    <Input
                      className="h-10 pl-3 pr-3 py-2 bg-white rounded-md border border-zinc-200 shadow-box-shadow-shadow-sm"
                      placeholder="Search"
                    />
                  </div>
                </div>

                <div className="w-full border border-zinc-200 rounded-t-md bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[46px] p-0">
                          <div className="h-10 flex items-center justify-center pl-2">
                            <Checkbox
                                checked={allChecked}
                                 data-checkbox-indeterminate={someChecked}
                                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                              />

                         </div>
                        </TableHead>
                        <TableHead className="w-[430px]">
                          <div className="font-text-sm-medium text-zinc-500">
                            Name
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center font-text-sm-medium text-zinc-500">
                            Created At
                            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center font-text-sm-medium text-zinc-500">
                            Subscribers
                            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="font-text-sm-medium text-zinc-500">
                            Actions
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groups.map((audience) => (
                        <TableRow key={audience.id}>
                          <TableCell className="p-0">
                            <div className="h-[49px] flex items-center justify-center pl-2">
                              <Checkbox
                                  checked={selectedIds.includes(audience.id)}
                                  onCheckedChange={() => toggleAudienceSelection(audience.id)}
                                />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-text-sm-medium text-zinc-950">
                              {audience.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-text-sm-medium text-zinc-950">
                              {audience.createdAt}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-text-sm-medium text-zinc-950">
                              {audience.subscribers} Subscribers
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <footer className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-2 pt-4 px-2">
                      <div className="text-zinc-500 font-text-sm-medium whitespace-nowrap">
                          {selectedIds.length} of {audiences.length} row(s) selected.
                        </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center">
                          <div className="font-text-sm-medium text-zinc-950 mr-2">Rows per page</div>
                          <Select defaultValue="10">
                            <SelectTrigger className="w-[70px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="font-text-sm-medium text-zinc-950">Page 1 of 10</div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 opacity-50" disabled>
                            <ChevronsLeftIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8 opacity-50" disabled>
                            <ChevronLeftIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <ChevronRightIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <ChevronsRightIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </footer>

              </div>
            </div>

            <div className="flex justify-between mt-4">
                  <Button variant="secondary" onClick={handleSaveDraft}>
                      Save Draft
                    </Button>
                  <Button onClick={() => handleNextFromStep3()}>Next</Button>
                </div>
          </div>
        </main>
      </div>
    </div>
              </>
            )}

            {/* Step 4: Template Selection */}
            <>
            {activeStep === 4 && (
        <div className="flex flex-col min-h-screen bg-white">
          <div className="flex flex-1">
            <main className="flex-1 p-6">
              <div className="flex flex-col w-full gap-6 mt-4">
                <Tabs defaultValue="templates" className="w-full">
                  <TabsList className="border-b border-zinc-200 mb-4">
                    <TabsTrigger
                      value="templates"
                      className="text-sm font-bold text-zinc-900 pb-2 border-b-2 border-zinc-900"
                    >
                      Templates
                    </TabsTrigger>
                    <TabsTrigger
                      value="my-templates"
                      className="text-sm font-medium text-zinc-500 pb-2"
                    >
                      My templates
                    </TabsTrigger>
                  </TabsList>

                  {/* Template Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.isArray(templates) && templates.length > 0 ? (
                      templates.map((template, index) => (
                        <Card
                          key={index}
                          className={`flex flex-col ${
                            templateSelection.templateId === template.id
                              ? "border-2 border-blue-600"
                              : ""
                          }`}
                        >
                          <div className="relative h-48 bg-white rounded-t-lg overflow-hidden border">
                            <div
                              className="absolute inset-0 scale-[0.6] origin-top-left pointer-events-none p-2"
                              dangerouslySetInnerHTML={{ __html: template.template}}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute top-2 right-2 rounded-full z-10"
                            >
                              <HeartIcon className="h-4 w-4" />
                            </Button>
                          </div>

                          <CardContent className="flex flex-col justify-between p-4">
                            <div>
                              <h4 className="font-semibold text-zinc-950">{template.name}</h4>
                              <p className="text-sm text-zinc-500">Stored HTML Template</p>
                            </div>
                            <div className="flex justify-between mt-4">
                              <Button
                                variant="secondary"
                                className="text-zinc-900"
                                onClick={() => handlePreview(template)}
                              >
                                Preview
                              </Button>
                              <Button
                                variant="default"
                                className="bg-zinc-900 text-white"
                                onClick={() => handleUseTemplate(template,campId)}
                              >
                                Use
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">No templates found.</p>
                    )}
                    
                  </div>
                  
                </Tabs>
                

                {/* Bottom Navigation */}
                    <div className="flex justify-between mt-4">
                      <Button variant="secondary" onClick={handleSaveDraft}>
                      Save Draft
                    </Button>
                      <Button
                        onClick={handleNextFromStep4}
                        disabled={!templateSelection.selectedTemplateHtml}
                            className={`text-white ${
                              !templateSelection.selectedTemplateHtml
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-zinc-900"
                            }`}
                          >
                        Next
                      </Button>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
        {showPreviewModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4"> Template Preview</h2>
        <div
          className="border p-4 rounded"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
        <Button
          onClick={() => setShowPreviewModal(false)}
          className="mt-4 bg-zinc-900 text-white"
        >
          Close Preview
        </Button>
      </div>
    </div>
  )}
    </>
          {/* Step 5: Schedule */}
            {activeStep === 5 && (
               <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 relative bg-white">
         {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Campaign Content */}
          <div className="flex flex-col w-full gap-6 px-8 py-6">
            {/* Main Campaign Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-6">
                  {/* Section Header */}
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-xl font-bold text-zinc-950">
                      When Should This Campaign Go Live?
                    </CardTitle>
                    <p className="text-zinc-500">
                      Select a date and time or send it immediately.
                    </p>
                  </div>

                  {/* Campaign Info Summary */}
                  <Card className="bg-gray-50 border border-gray-200">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="flex-1">
                        <div className="text-sm text-zinc-500 mb-1">Campaign Name</div>
                        <div className="text-lg font-semibold text-zinc-900">
                          {formData.campName}
                        </div>
                      </div>
                      <div className="w-[220px]">
                        <div className="text-sm text-zinc-500 mb-1">Email Template</div>
                        <div className="text-lg font-semibold text-zinc-900">
                          {templateName.replace(/\.html$/, "")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delivery Method */}
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-500">Delivery Method</label>
                    <div className="inline-flex items-start gap-2 p-1 bg-gray-100 rounded-md w-fit">
                      <Button
                        variant={deliveryMethod === 'send-now' ? "default" : "ghost"}
                        className={`gap-2 px-3 py-1.5 rounded ${
                          deliveryMethod === 'send-now' 
                            ? "bg-white shadow-md text-blue-600" 
                            : "bg-transparent"
                        }`}
                        onClick={() => setDeliveryMethod('send-now')}
                      >
                        <SendHorizontal className="w-5 h-5" />
                        Send Now
                      </Button>
                      <Button
                        variant={deliveryMethod === 'schedule' ? "default" : "ghost"}
                        className={`gap-2 px-3 py-1.5 rounded ${
                          deliveryMethod === 'schedule' 
                            ? "bg-white shadow-md text-blue-600" 
                            : "bg-transparent"
                        }`}
                        onClick={() => setDeliveryMethod('schedule')}
                      >
                        <Calendar className="w-5 h-5" />
                        Schedule For Later
                      </Button>
                    </div>
                  </div>

                  {/* Scheduled Campaign Details */}
                  {deliveryMethod === 'schedule' && (
                    <Card className="bg-gray-50 border border-gray-200">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-zinc-500 mb-4">
                          Scheduled Campaigns
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          
                          <div>
                            <label className="block text-sm font-medium text-zinc-950 mb-1">Start Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between text-left text-zinc-500 px-3 py-2 bg-white border border-zinc-200 rounded-md"
                                >
                                  <span>
                                    {startDate ? format(startDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                                  </span>
                                  <CalendarIcon className="w-4 h-4 text-zinc-400" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2 bg-white shadow-md border rounded-md">
                                <DayPicker
                                  mode="single"
                                  selected={startDate}
                                  onSelect={setStartDate}
                                  fromYear={2000}
                                  toYear={2035}
                                  captionLayout="dropdown"
                                  showOutsideDays
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-zinc-950 mb-1">End Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between text-left text-zinc-500 px-3 py-2 bg-white border border-zinc-200 rounded-md"
                                >
                                  <span>
                                    {endDate ? format(endDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                                  </span>
                                  <CalendarIcon className="w-4 h-4 text-zinc-400" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2 bg-white shadow-md border rounded-md">
                                <DayPicker
                                  mode="single"
                                  selected={endDate}
                                  onSelect={setEndDate}
                                  fromYear={2000}
                                  toYear={2035}
                                  captionLayout="dropdown"
                                  showOutsideDays
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                           <div>
                                <label className="block text-sm font-medium text-zinc-950 mb-1">Select Time</label>
                                <input
                                  type="time"
                                  value={selectedTime}
                                  onChange={(e) => setSelectedTime(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-md text-zinc-950"
                                />
                              </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-950 mb-1">
                              Time Zone
                            </label>
                            <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
                              <SelectTrigger className="bg-white border border-zinc-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeZones.map((zone) => (
                                  <SelectItem key={zone} value={zone}>
                                    <div className="flex items-center justify-between w-full">
                                      {zone}
                                      {zone === selectedTimeZone && (
                                        <Check className="w-4 h-4 ml-2" />
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <p className="text-sm text-zinc-500 mb-4">
                          You can manage email addresses in your email settings.
                        </p>

                        <Button className="bg-zinc-900 text-white" type='button' onClick={handleScheduleSubmit}>
                          Submit Schedule
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Target Rules Card */}
            <Card className="bg-gray-50 border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-zinc-500 mb-4">
                  Target Rules
                </h3>

                <Card className="bg-white">
                  <CardContent className="p-6">
                    <p className="text-sm text-zinc-500 mb-4">
                      Define rules to target specific subscribers. Only subscribers who match ALL rules will receive this campaign.
                    </p>

                    <div className="space-y-4">
                      {targetRules.map((rule, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <Select defaultValue={rule.field}>
                            <SelectTrigger className="w-[115px] bg-white shadow-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Age">Age</SelectItem>
                              <SelectItem value="Location">Location</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select defaultValue={rule.operator}>
                            <SelectTrigger className="w-[115px] bg-white shadow-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Greater">Greater</SelectItem>
                              <SelectItem value="Less">Less</SelectItem>
                              <SelectItem value="Equal">Equal</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select defaultValue={rule.value}>
                            <SelectTrigger className="w-[115px] bg-white shadow-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="18">18</SelectItem>
                              <SelectItem value="21">21</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeTargetRule(index)}
                            className="text-black-500 hover:text-black-700"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        variant="link"
                        onClick={addTargetRule}
                        className="flex items-center gap-1 text-blue-600 p-0"
                      >
                        <MessageSquareDiff className="w-5 h-5" />
                        Add Rule
                      </Button>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        Campaign will target:
                      </p>
                      <p className="text-xs text-blue-700">
                        Subscribers who are age greater than 18 years old
                        {targetRules.length > 1 && " AND additional conditions"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Scheduled Campaign Preview */}
            <Card className="bg-gray-50 border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-zinc-500 mb-4">
                  Campaign Preview
                </h3>

                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-zinc-900 mb-2">
                      {formData.campName}
                    </h4>
                    <p className="text-sm text-zinc-500 mb-3">
                      Template: Seasonal Promotion
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 justify-end">
              <Button
                variant="outline"
                className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                onClick={handleSaveDraft}
              > 
                Save Draft
              </Button>
              <Button onClick={()=>handleNextFromStep5()}  className="bg-zinc-900 text-white hover:bg-zinc-800">
                Next Review Launch
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
            )}
            {activeStep === 6 && (
               <div className="flex flex-col min-h-screen">
                     {/* Header */}
                     
               
                     <div className="flex flex-1 relative">
                      
                       {/* Main Content */}
                       <main className="flex-1 bg-white">
                         <div className="relative w-full p-6">
               
                           {/* Two Column Layout */}
                           <div className="flex gap-6 mt-6">
                             {/* Left Column - Pre-flight Checklist */}
                             <div className="w-[537px]">
                               <div className="flex flex-col w-full items-center gap-6">
                                      <div className="flex flex-col items-start gap-4 w-full">
                                        <div className="flex flex-col items-start gap-5 w-full">
                                          <Card className="w-full border border-[#e3e3e7]">
                                            <CardContent className="p-6 space-y-4">
                                              <div className="flex items-center gap-4 w-full">
                                                <div className="flex flex-col items-start gap-1.5 flex-1">
                                                  <h3 className="text-lg tracking-[-0.45px] font-semibold text-[#08080a] leading-[18px]">
                                                    {formData.campName}
                                                  </h3>
                                                  <p className="text-sm text-zinc-500 leading-5">
                                                    {formData.description}
                                                  </p>
                                                </div>
                                                <Badge className="bg-blue-100 text-[#1d4edf] hover:bg-blue-100 px-2 py-1 rounded-[10px]">
                                                
                                                </Badge>
                                              </div>

                                              <div className="flex items-start gap-2 w-full">
                                                <Card className="flex-1 bg-neutral-100 p-4 flex flex-col items-center justify-center gap-1 h-[97px]">
                                                  <UsersIcon className="w-4 h-4" />
                                                  <div className="flex flex-col items-start gap-1 w-full">
                                                    <div className="flex items-start justify-center gap-2.5 w-full">
                                                      <div className="w-full text-center text-sm font-medium text-zinc-950">
                                                        Audience
                                                      </div>
                                                    </div>
                                                    <div className="w-full text-center text-sm text-zinc-500">
                                                      {totalAudience}
                                                    </div>
                                                  </div>
                                                </Card>

                                                <Card className="w-[138px] bg-neutral-100 p-4 flex flex-col items-center justify-center gap-1 h-[97px]">
                                                  <CalendarIcon className="w-4 h-4" />
                                                  <div className="flex flex-col items-start gap-1 w-full">
                                                    <div className="flex items-start justify-center gap-2.5 w-full">
                                                      <div className="w-full text-center text-sm font-medium text-zinc-950">
                                                        Context
                                                      </div>
                                                    </div>
                                                    <div className="w-full text-center text-sm text-zinc-500">
                                                      {templateName.replace(/\.html$/, "")}
                                                    </div>
                                                  </div>
                                                </Card>

                                                <Card className="flex-1 bg-neutral-100 p-4 flex flex-col items-center justify-center gap-1 h-[97px]">
                                                  <TimerIcon className="w-4 h-4" />
                                                  <div className="flex flex-col items-start gap-1 w-full">
                                                    <div className="flex items-start justify-center gap-2.5 w-full">
                                                      <div className="w-full text-center text-sm font-medium text-zinc-950">
                                                        Schedule
                                                      </div>
                                                    </div>
                                                    <div className="w-full text-center text-sm text-zinc-500">
                                                      {scheduledAtTime?.dateTime}
                                                    </div>
                                                  </div>
                                                </Card>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        </div>

                                        <div className="flex flex-col items-end gap-4 w-full">
                                          <div className="flex items-start gap-1 pt-1 pb-0 px-4 w-full border-b border-[#e3e3e7]">
                                                  {navigationTabs.map((tab) => (
                                                    <div
                                                      key={tab.id}
                                                      onClick={() => setActiveTab(tab.id)} 
                                                      className={`cursor-pointer inline-flex h-7 items-center justify-center gap-2 px-3 py-2 ${
                                                        activeTab === tab.id ? "border-b-2 border-black" : "rounded-md"
                                                      }`}
                                                    >
                                                      <div
                                                        className={`text-xs leading-4 whitespace-nowrap ${
                                                          activeTab === tab.id
                                                            ? "font-bold text-[#08080a]"
                                                            : "font-medium text-zinc-500"
                                                        }`}
                                                      >
                                                        {tab.label}
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                          <div className="flex flex-col items-start gap-5 w-full">
                                            {activeTab === "details" && (
                                                  <Card className="w-full border border-zinc-200 mt-4">
                                                    <CardContent className="p-6 space-y-4">
                                                      <div className="flex items-center justify-between w-full">
                                                        <div className="flex items-center gap-2 flex-1">
                                                          <MegaphoneIcon className="w-6 h-6" />
                                                          <h3 className="text-lg font-semibold text-zinc-950">Campaign Details</h3>
                                                        </div>
                                                      </div>

                                                      <div className="flex flex-col gap-1.5">
                                                        <p className="text-sm text-zinc-500">Campaign Name</p>
                                                        <p className="text-sm font-semibold text-[#08080a]">{formData.campName}</p>
                                                      </div>
                                                      <div className="flex flex-col gap-1.5">
                                                        <p className="text-sm text-zinc-500">Description</p>
                                                        <p className="text-sm font-semibold text-[#08080a]">{formData.description}</p>
                                                      </div>
                                                      <div className="flex flex-col gap-1.5">
                                                        <p className="text-sm text-zinc-500">Campaign Objective</p>
                                                        <p className="text-sm font-semibold text-[#08080a]">{objectiveName}</p>
                                                      </div>
                                                    </CardContent>
                                                  </Card>
                                                )}

                                                {activeTab === "objective" && (
                                                  <Card className="w-full border border-zinc-200 mt-4">
                                                    <CardContent className="p-6 space-y-4">
                                                      <div className="flex items-center justify-between w-full">
                                                        <div className="flex items-center gap-2">
                                                          <LayoutDashboardIcon className="w-6 h-6" />
                                                          <h3 className="text-lg font-semibold text-zinc-950">Objective</h3>
                                                        </div>
                                                      </div>
                                                      <div className="flex flex-col gap-1.5">
                                                        <p className="text-sm text-zinc-500">Objective Name</p>
                                                        <p className="text-sm font-semibold text-[#08080a]">{objectiveName}</p>
                                                      </div>
                                                    </CardContent>
                                                  </Card>
                                                )}
                                                {activeTab === "audience" && (
                                                  <Card className="w-full border border-zinc-200 mt-4">
                                                    <CardContent className="p-6 space-y-4">
                                                      <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center gap-2">
                                                              <UsersIcon className="w-6 h-6" />
                                                              <h3 className="font-semibold text-lg tracking-[-0.45px] leading-[18px] text-[#08080a] font-['Inter',Helvetica]">
                                                                Target Audience
                                                              </h3>
                                                            </div>
                                                          </div>

                                                          <div className="flex flex-col gap-1.5">
                                                            <span className="text-zinc-500 text-sm leading-5 font-['Inter',Helvetica]">
                                                              Selected Audience
                                                            </span>
                                                            <span className="font-semibold text-[#08080a] text-sm tracking-[-0.35px] leading-[18px] font-['Inter',Helvetica]">
                                                              {selectedAudience}
                                                            </span>
                                                          </div>

                                                          <div className="flex flex-col gap-1.5">
                                                            <span className="text-zinc-500 text-sm leading-5 font-['Inter',Helvetica]">
                                                              Total Recipients
                                                            </span>
                                                            <span className="font-semibold text-[#08080a] text-sm tracking-[-0.35px] leading-[18px] font-['Inter',Helvetica]">
                                                              {totalAudience}
                                                            </span>
                                                          </div>

                                                          <Alert className="bg-blue-50 p-2 border-0">
                                                            <AlertDescription className="text-blue-800 text-sm font-['Geist',Helvetica]">
                                                              This audience was last updated{" "}
                                                           
                                                            </AlertDescription>
                                                          </Alert>
                                                    </CardContent>
                                                  </Card>
                                                )}
                                                {activeTab === "content" && (
                                                  <Card className="w-full border border-zinc-200 mt-4">
                                                    <CardContent className="p-6 space-y-4">
                                                      <div className="flex items-center justify-between">
                                                          <div className="flex items-center gap-2">
                                                            <CalendarIcon className="w-6 h-6" />
                                                            <h3 className="font-semibold text-lg tracking-[-0.45px] leading-[18px] text-[#08080a]">
                                                              Email Content
                                                            </h3>
                                                          </div>
                                                        </div>

                                                        <div className="flex flex-col gap-1.5">
                                                          <p className="text-zinc-500 text-sm leading-5">
                                                            Subject Line
                                                          </p>
                                                          <p className="font-semibold text-[#08080a] text-sm tracking-[-0.35px] leading-[18px]">
                                                            {formData.subject}
                                                          </p>
                                                        </div>

                                                        <div className="flex flex-col gap-1.5">
                                                          <p className="text-zinc-500 text-sm leading-5">
                                                            Email Template
                                                          </p>
                                                          <p className="font-semibold text-[#08080a] text-sm tracking-[-0.35px] leading-[18px]">
                                                            {templateName.replace(/\.html$/, "")}
                                                          </p>
                                                        </div>
                                                    </CardContent>
                                                  </Card>
                                                )}
                                                {activeTab === "schedule" && (
                                                  <Card className="w-full border border-zinc-200 mt-4">
                                                    <CardContent className="p-6 space-y-4">
                                                      <div className="flex items-center gap-4 w-full mb-4">
                                                              <div className="flex items-center gap-2 flex-1">
                                                                <CalendarIcon className="w-6 h-6" />
                                                                <div className="flex flex-col items-start gap-1.5 flex-1">
                                                                  <h3 className="w-full mt-[-1.00px] font-semibold text-lg tracking-[-0.45px] leading-[18px] text-[#08080a]">
                                                                    Schedule
                                                                  </h3>
                                                                </div>
                                                              </div>
                                                            </div>

                                                            <div className="flex flex-col items-start gap-1.5 w-full mb-4">
                                                              <span className="w-full text-zinc-500 text-sm leading-5">
                                                                Delivery Date &amp; Time
                                                              </span>
                                                              <span className="w-full text-sm tracking-[-0.35px] font-semibold text-[#08080a] leading-[18px]">
                                                                {scheduledAtTime?.dateTime}
                                                              </span>
                                                            </div>

                                                            <div className="flex flex-col items-start gap-1.5 w-full mb-4">
                                                              <span className="w-full text-zinc-500 text-sm leading-5">
                                                                Time Zone
                                                              </span>
                                                              <span className="w-full font-semibold text-[#08080a] text-sm tracking-[-0.35px] leading-[18px]">
                                                                {scheduledAtTime?.timeZone}
                                                              </span>
                                                            </div>

                                                            <div className="flex items-start gap-2 w-full">
                                                              <div className="flex flex-col items-center justify-center gap-1 p-2 flex-1 bg-blue-50 rounded">
                                                                <div className="flex flex-col items-start gap-1 w-full">
                                                                  <div className="flex items-start justify-center gap-2.5 w-full">
                                                                    <p className="flex-1 mt-[-1.00px] font-normal text-blue-800 text-sm leading-5">
                                                                      Email will be delivered based on each recipient&#39;s
                                                                      local time zone when possible
                                                                    </p>
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                    </CardContent>
                                                  </Card>
                                                )}

                                          </div>
                                        </div>
                                      </div>

                                      <Card className="w-full border border-zinc-200">
                                        <CardContent className="p-4">
                                          <div className="flex flex-col h-[31px] items-start pt-0 pb-4 px-0 w-full">
                                            <div className="items-center gap-2.5 flex w-full">
                                              <h3 className="flex-1 font-medium text-zinc-950">
                                                Pre-flight Checklist
                                              </h3>
                                            </div>
                                          </div>

                                          <div className="flex flex-col items-start w-full space-y-2">
                                            {checklistItems.map((item) => (
                                              <div key={item.id} className="flex items-center w-full pt-2">
                                                {item.checked ? (
                                                  <div className="w-4 h-4 bg-zinc-950 rounded-md overflow-hidden flex items-center justify-center">
                                                    <CheckIcon className="w-3 h-3 text-white" />
                                                  </div>
                                                ) : (
                                                  <Checkbox
                                                    id={item.id}
                                                    className="w-4 h-4 rounded-md border-zinc-950"
                                                  />
                                                )}
                                                <label
                                                  htmlFor={item.id}
                                                  className="pl-2 flex-1 text-sm font-medium text-zinc-950"
                                                >
                                                  {item.label}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <div className="flex flex-col w-full h-14 items-start justify-center gap-1 p-3 bg-amber-50 rounded">
                                        <div className="flex items-start gap-2 w-full">
                                          <div className="bg-amber-500 w-4 h-4 rounded-md overflow-hidden flex items-center justify-center">
                                            <CheckIcon className="w-3 h-3 text-white" />
                                          </div>
                                          <div className="flex flex-col h-8 items-start justify-center gap-1 flex-1">
                                            <div className="flex items-start justify-center w-full gap-2.5">
                                              <p className="flex-1 font-normal text-[#ae400e] text-sm leading-5">
                                                Once launched, your campaign will be queued for delivery
                                                according to your schedule and cannot be recalled.
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                             </div>
               
                             {/* Right Column - Campaign Details */}
                             <div className="flex-1">
                               <Card className="bg-zinc-100 rounded-lg border border-solid border-zinc-200">
                                 <div className="flex flex-col w-full items-start gap-2 mt-4">
                                      <div className="flex flex-col items-start gap-2 w-full">
                                        <div className="flex items-center justify-between w-full">
                                          <h2 className="font-text-lg-semi-bold text-zinc-950">
                                            Email Preview
                                          </h2>

                                          <ToggleGroup
                                            type="single"
                                            defaultValue="desktop"
                                            className="bg-white rounded-md p-1"
                                          >
                                            <ToggleGroupItem
                                              value="desktop"
                                              className="flex items-center gap-2.5 px-3 py-1.5 data-[state=on]:bg-blue-100 data-[state=on]:text-[#1d4edf] rounded"
                                            >
                                              <MonitorIcon className="w-6 h-6" />
                                              <span className="font-medium text-sm">Desktop</span>
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                              value="mobile"
                                              className="flex items-center gap-2 px-3 py-1.5 data-[state=on]:bg-blue-100 rounded"
                                            >
                                              <BatteryIcon className="w-6 h-6" />
                                              <span className="font-medium text-sm">Mobile</span>
                                            </ToggleGroupItem>
                                          </ToggleGroup>
                                        </div>

                                        <Card className="w-full border border-solid border-black p-0">
                                          <CardContent className="p-0">
                                            {/* Email header section */}
                                            <div className="flex flex-col h-40 items-start gap-4 p-6 bg-white border-b border-zinc-200">
                                              <div className="flex flex-col items-start gap-2.5 w-full">
                                                <div className="flex items-center w-full">
                                                  <p className="flex-1 font-text-sm-regular text-zinc-500">
                                                    From: {formData.senderEmail} <br />
                                                    To: {
                                                        subscribers.map((sub) => sub.email).join(", ")
                                                      }

                                                  </p>
                                                </div>
                                              </div>

                                              <div className="flex flex-col items-start w-full">
                                                <div className="relative w-full h-7">
                                                  <div className="inline-flex items-center gap-2.5">
                                                    <h3 className="font-text-lg-semi-bold text-zinc-950 whitespace-nowrap">
                                                      {formData.subject}
                                                    </h3>
                                                  </div>
                                                </div>

                                              </div>
                                            </div>

                                            {/* Email template icon section */}
                                            <div className="flex items-start p-4 w-full bg-white">
                                              <div className="flex flex-col items-center gap-2 flex-1">
                                                <LayoutDashboardIcon className="w-8 h-8" />
                                                <div className="flex flex-col items-start gap-1.5 pl-2 w-full">
                                                  <div className="flex items-center justify-center w-full">
                                                    <p className="flex-1 font-text-xs-regular text-zinc-500 text-center">
                                                      Email template preview
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Email template preview section */}
                                                  <div className="flex flex-col h-[432px] items-center justify-center gap-5 w-full bg-white">
                                                    <div className="relative w-full h-[394px] rounded-[5px] overflow-hidden border border-dashed border-[#9747ff] mx-4 bg-white">
                                                      <div className="w-full h-full overflow-auto p-4 scale-[0.9] origin-top">
                                                        {templateSelection?.selectedTemplateHtml ? (
                                                          <div
                                                            className="w-full h-full"
                                                            dangerouslySetInnerHTML={{ __html: templateSelection.selectedTemplateHtml }}
                                                          />
                                                        ) : (
                                                          <p className="text-center text-zinc-500 mt-10">No template selected</p>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>

                                          </CardContent>
                                        </Card>
                                      </div>

                                      <Card className="w-full mt-4">
                                        <CardHeader className="px-6 py-4">
                                          <CardTitle className="text-2xl font-text-2xl-semi-bold text-zinc-950">
                                            Test Your Campaign
                                          </CardTitle>
                                          <CardDescription className="font-text-sm-regular text-zinc-500 pt-1.5">
                                            Send a test email to check how it looks in different email clients.
                                          </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex items-center gap-4 p-4">
                                          <div className="flex items-center flex-1">
                                            <Input
                                              className="h-10 px-3 py-2 border-zinc-200 rounded-md"
                                              placeholder="Enter your email Address"
                                            />
                                            <div className="pl-2">
                                              <Button className="h-9 px-4 py-2 bg-zinc-900 text-neutral-50 rounded-md"
                                              onClick={handleSendEmail}>
                                                Send test
                                              </Button>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                               </Card>
                             </div>
                           </div>
               
                           {/* Action Buttons */}
                           <div className="flex justify-end gap-4 mt-8 mb-4">
                             <Button
                               variant="outline"
                               className="bg-zinc-100 opacity-80 text-zinc-900"
                             >
                               Back To Edit
                             </Button>
                             <Button onClick={handleFinalStep} className="bg-zinc-900 text-neutral-50">
                               Launch Campaign
                             </Button>
                           </div>
                         </div>
                       </main>
                     </div>
                   </div>
                 )}
          </section>
       </div>
      </main>
    </div> 
  );
}