"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import {
  ActivityIcon,
  ArrowLeftIcon,
  BatteryIcon,
  CalendarIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  MegaphoneIcon,
  MonitorIcon,
  TimerIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast} from 'sonner';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/ui/navbar";


export default function Home({ campaignName }: { campaignName?: string }) {
  const params = useParams();
  const searchParams=useSearchParams();
  const [campaignId,setCampaignId]=useState("")
  const [audience, setAudience] = useState({ selectedAudience: '', totalCount: 0 });
const [campaign, setCampaign] = useState({ campName: '', description: '', objective: '' ,subject:'',from:'',to:''});
const [schedule, setSchedule] = useState({ deliveryDate:'',timeZone:'' });
const [emailContent, setEmailContent] = useState({ templateName: '',templateHtml:'' });

useEffect(() => {
    const id = searchParams.get('campaignId');
    if (id) {
      setCampaignId(id);
    }
  }, [searchParams]);

import { useParams, useRouter } from "next/navigation";


export default function Home({ campaignName }: { campaignName?: string }) {
    const params = useParams();
  const campaignId = params?.id;

const [campaign, setCampaign] = useState({
  campName: "",
  description: "",
  objective: "",
});


  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const navigateToTable = () => router.push("/campaign-dashboard");

  const [formData, setFormData] = useState({
    campName: "",
    senderName: "",
    senderEmail: "",
    subject: "",
    description: "",
    objectiveId: "",
  });  
const metricsData = [
  { title: "Delivered", value: "-", icon: <UsersIcon className="w-4 h-4" /> },
  { title: "Opens", value: "-", icon: <UsersIcon className="w-4 h-4" /> },
  { title: "Clicks", value: "-", icon: <CreditCardIcon className="w-4 h-4" /> },
  {
    title: "Unsubscribe",
    value: "-",
    icon: <ActivityIcon className="w-4 h-4" />,
  },
];

  useEffect(() => {
    if (!campaignId) return;

    const fetchCampaignDetails = async () => {
      try {

        const res = await fetch(`http://localhost:4000/campaign-details/view/${campaignId}`,{
          headers:{'Authorization': `Bearer ${localStorage.getItem('authToken')}`}
        });
        const data = await res.json();
         if (res.ok) {
              const {audienceDetails,campaignDetails,emailContent,schedule}=data
              setCampaign({campName:campaignDetails.campName,description:campaignDetails.description,subject:campaignDetails.subject,objective:campaignDetails.objective,from:campaignDetails.from,to:campaignDetails.to})
              setAudience({ selectedAudience: audienceDetails.selectedAudience, totalCount: audienceDetails.totalCount})  
              setEmailContent({templateName:emailContent.templateName ,templateHtml:(emailContent.templateHtml)})
              setSchedule({ deliveryDate:schedule?.deliveryDate || '',timeZone:schedule?.timeZone || '' })
          } 
          else {
             toast.error(data.message)
          }
      } catch (error) {
        toast.error(`Failed to fetch campaign details: ${String(error)}`);

        const res = await fetch(`http://localhost:3001/campaign-details/${campaignId}`);
        const data = await res.json();
        setCampaign(data);
      } catch (error) {
        console.error("Failed to fetch campaign details:", error);

      }
    };

    fetchCampaignDetails();
  }, [campaignId]);

  
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


        const emailData = {
    from: "Your Company <marketing@yourcompany.com>",
    to: "Loyal Customers <recipient@example.com>",
    subject: "Don't Miss Our Biggest Summer Sale Yet!",
    previewText: "Up to 50% off on summer essentials",
  };
    
  

// Campaign info cards data
const infoCardsData = [
  {
    title: "Audience",
    value: "5,432 Recipents",
    icon: <UsersIcon className="w-4 h-4" />,
  },
  {
    title: "Context",
    value: "Seasonal Promotion",
    icon: <CalendarIcon className="w-4 h-4" />,
  },
  {
    title: "Schedule",
    value: "Apr 25, 2025",
    icon: <TimerIcon className="w-4 h-4" />,
  },
];
  
  const [templateSelection, setTemplateSelection] = useState({
      templateId: null,
      selectedTemplateHtml: '',
    });

    // Checklist items
  const checklistItems = [
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
  ];

    const navigationTabs = [
    { id: "details", label: "Campaign Details", active: true },
    { id: "objective", label: "Objective", active: false },
    { id: "audience", label: "Audience", active: false },
    { id: "content", label: "Email Content", active: false },
    { id: "schedule", label: "Schedule", active: false },
  ];

    const campaignInfo = {
    name: "Summer Sale 2025",
    description: "Promotional campaign for our annual summer collection",
    objective: "Seasonal Offer",
    audience: "5,432 Recipients",
    context: "Seasonal Promotion",
    schedule: "Apr 25, 2025",
  };
// Campaign details data
const campaignDetails = {
  name: "Summer Sale 2025",
  description: "Promotional campaign for our annual summer collection",
  objective: "Seasonal Offer",
};

// Tab items data
const tabItems = [
  { value: "details", label: "Campaign Details", isActive: true },
  { value: "objective", label: "Objective", isActive: false },
  { value: "audience", label: "Audience", isActive: false },
  { value: "content", label: "Email Content", isActive: false },
  { value: "schedule", label: "Schedule", isActive: false },
];
  // Navigation items data
  const navItems = [
    { icon: <LayoutDashboardIcon className="w-6 h-6" />, active: false },
    { icon: <MegaphoneIcon className="w-6 h-6" />, active: true },
    { icon: <UsersIcon className="w-6 h-6" />, active: false },
    { icon: <LayoutTemplateIcon className="w-6 h-6" />, active: false },
  ];

    const [audiences, setAudiences] = useState(initialaudienceData);
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="">
              <Navbar></Navbar>
            </div>
      <div className='flex flex-col min-h-screen w-[95vw] text-black gap-[5px] ml-[75px]'>   
                     {/* Header */}
                      <header className="flex w-full items-center justify-between py-9 px-4">
                            <div className="flex items-center gap-4">
                              <Button onClick={navigateToTable} variant="ghost" size="icon" className="p-0">
                                <ArrowLeftIcon  className="h-6 w-6" />
                              </Button>

                              <div className="flex items-center gap-6">
                                        <div>
                                          <h1 className="text-2xl font-semibold">
                                            {campaign.campName}
                                          </h1>
                                          <p className="text-sm">Create all kinds of email campaigns and analyse every detail.</p>
                                        </div>
                              </div>
                            </div>
                          </header>
               
                     <div className="flex flex-1 relative">
                      
                       {/* Main Content */}
                       <main className="flex-1 bg-white">
                         <div className="relative w-full p-6">
                     <div className="flex items-center gap-4 w-full">
                              {metricsData.map((metric, index) => (
                                <Card key={index} className="flex-1 shadow-box-shadow-shadow">
                                  <CardContent className="p-0">
                                    <div className="flex items-center justify-around gap-[76px] pt-6 pb-2 px-6">
                                      <div className="flex w-full items-center justify-between">
                                        <div className="inline-flex items-center justify-center gap-2.5">
                                          <div className="font-text-sm-medium text-zinc-950">
                                            {metric.title}
                                          </div>
                                        </div>
                                        {metric.icon}
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-start pt-0 pb-6 px-6">
                                      <div className="flex items-center gap-2.5 w-full">
                                        <div className="font-text-2xl-bold text-zinc-950">
                                          {metric.value}
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
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
                                                    {campaign.campName}
                                                  </h3>
                                                  <p className="text-sm text-zinc-500 leading-5">
                                                    {campaign.description}
                                                  </p>
                                                </div>
                                                <Badge className="bg-blue-100 text-[#1d4edf] hover:bg-blue-100 px-2 py-1 rounded-[10px]">
                                                  {campaign.objective}
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
                                                      {audience.totalCount} Recipients
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
                                                      {emailContent.templateName}
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
                                                      {schedule.deliveryDate}
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
                                            {activeTab === "details" && campaign && (
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
                                                        <p className="text-sm font-semibold text-[#08080a]">
                                                          {campaign.campName || "N/A"}
                                                        </p>
                                                      </div>
                                                      <div className="flex flex-col gap-1.5">
                                                        <p className="text-sm text-zinc-500">Description</p>
                                                        <p className="text-sm font-semibold text-[#08080a]">
                                                          {campaign.description || "N/A"}
                                                        </p>
                                                      </div>
                                                      <div className="flex flex-col gap-1.5">
                                                        <p className="text-sm text-zinc-500">Campaign Objective</p>
                                                        <p className="text-sm font-semibold text-[#08080a]">
                                                          {campaign.objective || "N/A"}
                                                        </p>
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
                                                   
                                                        <p className="text-sm font-semibold text-[#08080a]">{campaign.objective}</p>
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
                                                              {audience.selectedAudience}
                                                            </span>
                                                          </div>

                                                          <div className="flex flex-col gap-1.5">
                                                            <span className="text-zinc-500 text-sm leading-5 font-['Inter',Helvetica]">
                                                              Total Recipients
                                                            </span>
                                                            <span className="font-semibold text-[#08080a] text-sm tracking-[-0.35px] leading-[18px] font-['Inter',Helvetica]">
                                                              {audience.totalCount}
                                                            </span>
                                                          </div>

                                                          <Alert className="bg-blue-50 p-2 border-0">
                                                            <AlertDescription className="text-blue-800 text-sm font-['Geist',Helvetica]">
                                                              This audience was last updated.
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
                                                            {campaign.subject}
                                                          </p>
                                                        </div>

                                                      

                                                        <div className="flex flex-col gap-1.5">
                                                          <p className="text-zinc-500 text-sm leading-5">
                                                            Email Template
                                                          </p>
                                                          <p className="font-semibold text-[#08080a] text-sm tracking-[-0.35px] leading-[18px]">
                                                           {emailContent.templateName}
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
                                                                Delivery Dae &amp; Time
                                                              </span>
                                                              <span className="w-full text-sm tracking-[-0.35px] font-semibold text-[#08080a] leading-[18px]">
                                                                {schedule.deliveryDate}
                                                              </span>
                                                            </div>

                                                            <div className="flex flex-col items-start gap-1.5 w-full mb-4">
                                                              <span className="w-full text-zinc-500 text-sm leading-5">
                                                                Time Zone
                                                              </span>
                                                              <span className="w-full font-semibold text-[#08080a] text-sm tracking-[-0.35px] leading-[18px]">
                                                                {schedule.timeZone}
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
                                                    From: {campaign.from} <br />
                                                    To: {
                                                        campaign.to
                                                      }

                                                  </p>
                                                </div>
                                              </div>

                                              <div className="flex flex-col items-start w-full">
                                                <div className="relative w-full h-7">
                                                  <div className="inline-flex items-center gap-2.5">
                                                    <h3 className="font-text-lg-semi-bold text-zinc-950 whitespace-nowrap">
                                                      {campaign.subject}
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
                                                        {emailContent.templateHtml ? (
                                                          <div
                                                            className="w-full h-full"
                                                            dangerouslySetInnerHTML={{ __html: emailContent.templateHtml }}
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
                                    </div>
                               </Card>
                             </div>
                           </div>
               
                           {/* Action Buttons */}
                          
                         </div>
                       </main>
                     </div>
                     </div>
                   </div>
)}