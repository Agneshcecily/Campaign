'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Users, Activity, TrendingUp, CalendarIcon, CreditCard } from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { DayPicker,DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useRouter } from 'next/navigation';

interface CustomLabelProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
}

const Dashboard = () => {
  // Performance metrics data for the bar chart
  const [total,setTotal]=useState('')
  const [active,setActive]=useState('')
  const [scheduled,setSchedule]=useState('')
  const [draft,setDraft]=useState('')
  const router=useRouter();


  const performanceData = [
    { name: 'Open Rate', value: 186, color: '#64748b' },
    { name: 'Click Rate', value: 305, color: '#1e293b' },
    { name: 'Bounce Rate', value: 237, color: '#1e293b' },
    { name: 'Unsubscribe', value: 73, color: '#64748b' }
  ];

  // Top performing campaigns data
  const topCampaigns = [
    { name: 'Summer Sale', openRate: '28.7%', clickRate: '6.2%', date: '2025-04-15' },
    { name: 'Product Launch', openRate: '32.4%', clickRate: '8.5%', date: '2025-04-10' },
    { name: 'Weekly Newsletter', openRate: '24.6%', clickRate: '3.8%', date: '2025-04-07' },
    { name: 'Customer Survey', openRate: '19.3%', clickRate: '5.1%', date: '2025-04-01' },
    { name: 'Webinar Invite', openRate: '38%', clickRate: '7.3%', date: '2025-03-25' },
    { name: 'Festival Offers – Diwali', openRate: '26.2%', clickRate: '7.3%', date: '2025-03-25' }
  ];

  // Custom label component for the bar chart
  const CustomLabel = (props:CustomLabelProps) => {
    const { x, y, width, height, value } = props;
     if (x === undefined || y === undefined || width === undefined || value === undefined) {
      return null;
    }
    return (
      <text 
        x={x + width / 2} 
        y={y - 5} 
        fill="#1e293b" 
        textAnchor="middle" 
        dy={-6}
        fontSize="12"
        fontWeight="500"
      >
        {value}
      </text>
    );
  };
   useEffect(() => {
      const fetchObjectives = async () => {
        try {
          const res = await fetch('http://localhost:4000/dashboard/campaign-details', {
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
              setTotal(data.total_sent);
              setActive(data.active)
              setDraft(data.drafts)
              setSchedule(data.scheduled)
          } else {
            toast.error(data.message)
          }
        } catch (err) {
          return err
        } 
      };
  
      fetchObjectives();
    }, []);

    const DateRangePicker = () => {
      const today = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      const [isOpen, setIsOpen] = useState(false);
      const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from:oneMonthAgo,
        to:today
      });

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    // Delay closing the popover until both from & to are selected
    if (range?.from && range?.to) {
      setTimeout(() => setIsOpen(false), 150);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-auto justify-start text-left font-normal"
          aria-label="Pick a date range"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
              </>
            ) : (
              `${format(dateRange.from, 'MMM dd, yyyy')} - ...`
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-2 bg-white shadow-md rounded-md z-50" align="start">
        <DayPicker
          mode="range"
          selected={dateRange}
          onSelect={handleDateSelect}
          numberOfMonths={2}
          defaultMonth={dateRange?.from}
          classNames={{
            day_selected: 'bg-gray-500 text-white hover:bg-gray-600',
            day_range_middle: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
            day_today: 'border border-gray-400',
          }}
          modifiersClassNames={{
            selected: 'bg-gray-500 text-white',
            range_middle: 'bg-gray-200',
            today: 'border border-gray-400',
          }}
        />
      </PopoverContent>
    </Popover>
  );
  };


  return (
    <div className="min-h-screen flex overflow-x-hidden gap-[30px]">
      {/* Header */}
       <div className="">
              <Navbar></Navbar>
            </div>
      <div className='flex flex-col min-h-screen w-[95vw] text-black gap-[5px] ml-[75px]'>   
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DateRangePicker />
            </div>
            <Button onClick={()=>router.push('/campaign-stepper')} className="bg-gray-900 hover:bg-gray-800 h-[36px]">
              Create Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className=''>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Campaigns</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Campaigns</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Scheduled Campaigns</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{scheduled}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Draft Campaigns</CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{draft}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Table Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Metrics Chart */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <CustomLabel />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <CardFooter className='flex flex-col ml-0 pl-0 flex-start'>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Trending up by 5.2% this month</span>
              </div>
              <div>
              <p className="text-sm text-gray-500">Showing total visitors for the last 6 months</p>
              </div>
              </CardFooter>
            </CardContent>
          </Card>

          {/* Top Performing Campaigns Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Top Performing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-0 text-sm font-medium text-gray-600">Campaign Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Open Rate</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Click Rate</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCampaigns.map((campaign, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-0 text-sm font-medium text-gray-900">{campaign.name}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{campaign.openRate}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{campaign.clickRate}</td>
                        <td className="py-4 px-4 text-sm text-gray-500">{campaign.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>   
  );
};

export default Dashboard;