'use client';

import { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, FileCheck2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Toaster,toast } from "sonner";

export default function OneTimeDetails() {
  type UserTypes = 'CompanyEmployee' | 'Student' | 'FreeLancer' | null;
  type FieldNames =
  | 'firstName'
  | 'lastName'
  | 'mobileNumber'
  | 'companyName'
  | 'companyWebsite'
  | 'collegeName';

type ErrorType = {
  [key in FieldNames]?: string;
};

type TouchedType = {
  [key in FieldNames]?: boolean;
};
  
  const [firstName,setFirstName]=useState('');
  const [lastName,setLastName]=useState('');
  const [mobileNumber,setMobileNumber]=useState('');
  const [companyName,setCompanyName]=useState('');
  const [companyWebsite,setCompanyWebsite]=useState('');
  const [collegeName,setCollegeName]=useState('');
  const [selectedOption, setSelectedOption] = useState<UserTypes>(null);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🔹 Separate validation functions
  const [touched, setTouched] = useState<TouchedType>({});

  // Validation functions
  const validateName = (name: string): string =>
    /^[A-Za-z\s]+$/.test(name) ? '' : 'Only letters allowed';

  const validateMobile = (mobile: string): string =>
    /^\d{10}$/.test(mobile) ? '' : 'Mobile number must be exactly 10 digits';

  const validateWebsite = (url: string): string =>
    /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(url)
      ? ''
      : 'Invalid website URL';

  const validateCompanyName = (name: string): string => {
  if (!/^[A-Za-z\s.-]+$/.test(name)) {
    return 'Company name must contain only letters, spaces, periods, or hyphens';
  }
  if (name.length < 2 || name.length > 100) {
    return 'Company name must be between 2 and 100 characters';
  }
  return '';
};

  const validateCollegeName = (name: string): string => {
  if (!/^[A-Za-z\s.-]+$/.test(name)) {
    return 'College name must contain only letters, spaces, periods, or hyphens';
  }
  if (name.length < 2 || name.length > 100) {
    return 'College name must be between 2 and 100 characters';
  }
  return '';
};


  const validateCompanyWebsite = (url: string): string =>
  /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(url)
    ? ''
    : 'Invalid website URL (e.g., https://example.com)';


  const handleBlur = (field: FieldNames) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Change handlers
  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    if (touched.firstName) {
      setErrors(prev => ({ ...prev, firstName: validateName(value) }));
    }
  };

  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    if (touched.lastName) {
      setErrors(prev => ({ ...prev, lastName: validateName(value) }));
    }
  };

  const handleMobileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobileNumber(value);
    if (touched.mobileNumber) {
      setErrors(prev => ({ ...prev, mobileNumber: validateMobile(value) }));
    }
  };

  const handleWebsiteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompanyWebsite(value);
    if (touched.companyWebsite) {
      setErrors(prev => ({ ...prev, companyWebsite: validateWebsite(value) }));
    }
  };

  const handleCompanyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompanyName(value);
  };

  const handleCollegeNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCollegeName(value);
  };

  const validateForm = (): boolean => {
  const newErrors: ErrorType = {
    firstName: validateName(firstName),
    lastName: validateName(lastName),
    mobileNumber: validateMobile(mobileNumber),
    companyName: selectedOption === 'CompanyEmployee' ? validateCompanyName(companyName) : '',
    companyWebsite: selectedOption === 'CompanyEmployee' ? validateCompanyWebsite(companyWebsite) : '',
    collegeName: selectedOption === 'Student' ? validateCollegeName(collegeName) : '',
  };

  setErrors(newErrors);

  const fieldLabels: Record<FieldNames, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    mobileNumber: 'Mobile Number',
    companyName: 'Company Name',
    companyWebsite: 'Company Website',
    collegeName: 'College Name',
  };

  const firstError = Object.entries(newErrors).find(([_, error]) => error);
  if (firstError) {
    const [field, message] = firstError;
    toast.error(`${fieldLabels[field as FieldNames]}: ${message}`);
    return false;
  }

  return true;
};


  const steps = [1, 2, 3];

  const userTypes = [
    { id: 'CompanyEmployee' as UserTypes, label: 'CompanyEmployee' },
    { id: 'Student' as UserTypes, label: 'Student' },
    { id: 'FreeLancer' as UserTypes, label: 'FreeLancer' },
  ];
  
  const handleNext = () => {
    if (step < 3) setStep((prev) => prev + 1);
    else router.push('/campaign-dashboard'); // change path accordingly
  };

  const handleBack = async() => {
    if (step > 1 && step<3) setStep((prev) => prev - 1);
    else if(step===3) {
      const success=await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
      if(success){
      router.push('/login');
      }
      else{
        throw new Error("User not saved");
      }
    }
    else router.push('/login')
  };
  const handleSubmit=async (e:React.FormEvent)=>{
   e.preventDefault();
   if (step >= 2 && !validateForm()) return false;
  
   try{
   if(step===3){
            const token=localStorage.getItem('authToken')
            const response = await fetch('http://localhost:4000/user/onetime-details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            credentials:'include',
            body: JSON.stringify({
             userType:selectedOption,
            firstName,
            lastName,
            mobileNumber,
            companyName,
            companyWebsite,
            collegeName,
            }),
          });
         
          if(response.status===401){
            return false;
          }
          
          if(response.ok){
            const res=await response.json()
            if(res.isProfileExist===true){
              toast.error("Profile Already Exist!");
              return false
              
            }
            router.push('/dashboard')
            return true;
          }
          else{
            return false;
          }
        }
        else{
          handleNext();
        }

}
 catch(error){
      return false;
    }
}
  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="w-full max-w-md">
          <h2 className="text-base leading-5 font-medium mb-[16px]">I am Joining As a...</h2>
          <div className="flex flex-col gap-[16px]">
            {userTypes.map((type) => (
              <Button
              type='button'
                key={type.id}
                variant="outline"
                className={`flex items-center justify-between p-6 h-[45px] w-[350px] ${
                  selectedOption === type.id ? 'bg-gray-100' : 'bg-white'
                }`}
                onClick={() => setSelectedOption(type.id)}
              >
                <span className="font-normal">{type.label}</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
            ))}
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="w-full max-w-md space-y-4">
          {selectedOption && (
            <>
              <Label className='h-[20px] mb-[8px]'>First Name<span className="text-red-500">*</span></Label>
              <Input 
              required
              className='mb-[8px]' 
              placeholder="First Name"
              value={firstName}
               onBlur={()=>handleBlur('firstName')}
              onChange={handleFirstNameChange} 
              />
              <Label className='h-[20px] mb-[8px]'>Last Name<span className="text-red-500">*</span></Label>
              <Input 
              required
              className='mb-[8px]' 
              placeholder="Last Name" 
              value={lastName}
              onBlur={()=>handleBlur('lastName')}
              onChange={handleLastNameChange} 
              />
              <Label className='h-[20px] mb-[8px]'>Mobile Number <span className="text-red-500">*</span></Label>
              <Input 
              required
              className='mb-[8px]' 
              placeholder="Mobile number" 
              value={mobileNumber}
              onBlur={()=>handleBlur('mobileNumber')}
              onChange={handleMobileChange} 
              />
              {selectedOption === 'CompanyEmployee' && (
                <>
                  <Label className='h-[20px] mb-[8px]'>Company Name<span className="text-red-500">*</span></Label>
                  <Input 
                  required
                  className='mb-[8px]' 
                  placeholder="Company Name" 
                  value={companyName}
                   onBlur={()=>handleBlur('companyName')}
                  onChange={handleCompanyNameChange} 
                  />
                  <Label className='h-[20px] mb-[8px]'>Company Website<span className="text-red-500">*</span></Label>
                  <Input 
                  required
                  className='mb-[8px]' 
                  placeholder="Company Website" 
                  value={companyWebsite}
                   onBlur={()=>handleBlur('companyWebsite')}
                  onChange={handleWebsiteChange} 
                  />
                </>
              )}
              {selectedOption === 'Student' && (
                <>
                  <Label>College Name<span className="text-red-500">*</span></Label>
                  <Input 
                  required
                  placeholder="College Name" 
                  value={collegeName}
                  onBlur={()=>handleBlur('collegeName')}
                  onChange={handleCollegeNameChange} />
                </>
              )}
            </>
          )}
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-200 p-4">
              <FileCheck2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Account Created Successfully!</h2>
          <p className="text-gray-600">Your Campverse account is now set up and ready to use.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/2 bg-black flex items-center justify-center p-8">
        <div className="text-white text-lg font-medium flex items-center">
          <span className="mr-2">⌘</span> Acme Inc
        </div>
      </div>

      {/* Main content */}
      <div className="w-1/2 flex flex-col items-center justify-start p-8 overflow-y-auto max-h-screen">
        {/* Stepper */}
        <div className="relative w-[394px] mt-[30px] mb-12">
          <div className="absolute top-1/2 left-0 w-full h-[10px] bg-gray-200 -z-10 transform -translate-y-1/2"></div>
          <div className="flex justify-between">
            {steps.map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-16 h-16 rounded-full z-10 ${
                  step >= s ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div className="flex justify-center items-center">
          <Card className="w-[350px] h-[437px] border-0 shadow-none flex flex-col gap-[24px]">
            <form onSubmit={handleSubmit}>
            <div className="h-[60px] flex flex-col gap-[10px] items-center">
              <CardTitle className="text-[24px] font-geist-semibold">Welcome To Campverse</CardTitle>
              <CardDescription className="text-[14px] font-geist w-[350px] flex items-center justify-center text-zinc-500">
                Lets Set Up Your Account
              </CardDescription>
            </div>
            <div className="flex flex-col gap-[10px]">
              <CardContent className="w-[350px]  px-0">
                {renderStepContent()}
              </CardContent>

              {/* Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-black text-white py-6"
                  disabled={step === 1 && !selectedOption}
                  type='submit'
                >
                  {step === 3 ? 'Get Started' : 'Next'}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center"
                  type='button'
                  onClick={handleBack}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {step === 3 ? 'Back to Login' : 'Back'}
                </Button>
              </div>
            </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
