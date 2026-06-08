"use client"
import {  CheckCheck, Eye,EyeOff } from "lucide-react";
import { ChangeEvent} from "react";
import { Button } from "@/components/ui/button"
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster,toast } from "sonner";

  interface FormErrors {
  email?: string;
  password?: string;
}
export default function Home() {
  
  const router=useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState({ email: false, password: false })
  const [showPassword, setShowPassword] = useState(false)
  const [loginSuccess,setLoginSuccess]=useState(true)
  const showsuccess=true;
  const [userErrors,setUserErrors]=useState('')
  

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-z]+\.[a-z]{2,}$/
  const togglePassword = () => setShowPassword((prev) => !prev);

  

  const validateEmail=(value:string)=>{
    
    if(!value){
      return "email is required"
    }
    if(!gmailRegex.test(value)){
      return "please enter the valid Gmail Address"
    }       
  }
  
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|']/;
  const hasUppercase = /[A-Z]/;
  const hasLowercase=/[a-z]/;
  const hasNumber = /\d/;


  const validatePassword=(value:string)=>{
      if(!value){
        return "Password is required"
      }
      if(value.length<6){
        return "password must be atleast 6 characters"
      }
      else{
        if(!hasLowercase.test(value)){
          return "Password must contain a lower Case letter"
        }
        if(!hasUppercase.test(value)){
          return "Password must contain atleast one Uppercase"
        }
        else if(!hasNumber.test(value)){
            return "Password must contain atleast one Number"
          }
          else if(!hasSpecialChar.test(value)){
            return "Password must contain atleast one special character"
          }
        
      }
  }
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    if (touched.email) {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value)
      }))
    }
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    
    if (touched.password) {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(value)
      }))
    }
  }


  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    if (field === 'email') {
      setErrors(prev => ({
        ...prev,
        email: validateEmail(email)
      }))
    } else if (field === 'password') {
      setErrors(prev => ({
        ...prev,
        password: validatePassword(password)
      }))
    }
  }

  const handleSubmit=async (e:React.FormEvent)=>{

    e.preventDefault()
    const emailError=validateEmail(email);
    const passwordError=validatePassword(password);
   

    setTouched({ email: true, password: true })

    setErrors({
      email:emailError,
      password:passwordError
    })

    if(emailError||passwordError){
      return
    }
    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email,password}),
        credentials:'include'
      });
      const res= await response.json()
      if(response.status===401){
        setLoginSuccess(false);
        return false;
      }

      if (response.ok) {
        const {isUserExists}=res
        const {isPasswordRight}=res

        if(!isUserExists){
             toast.error('User Not Exist Please Register!'); 
            return
        }
         if(res.verified===false){
          router.push('/signup/register-otp?route=login');
          return
        }
        if(!isPasswordRight){
           toast.error('User or Password is Wrong!'); 
            return
        }
        const { token } = res;
        const {profileExists}=res;
        const {payload}=res;
        const userID=payload.id;
        localStorage.setItem('userId', userID);
        localStorage.setItem('authToken', token);
       
        if(profileExists===false){
           router.push('/signup/onetime-details')
        }
        if(profileExists===true){
        router.push('/dashboard')
        setEmail('');
        setPassword('');
      } 
    }
    } catch (error) {
      setLoginSuccess(false);
      return false;
    }
  }
  return (
    
    <div className="h-screen flex justify-center">
     
      
      <div className="w-1/2 bg-black"></div>
     
 
    <div className="w-1/2 flex justify-center items-center">
    
     <Toaster position="top-center" />
    <Card className="w-[400px] h-[400px] border-0 shadow-none ">
    
    <CardHeader className="text-center">
      <CardTitle className="text-[24px] h-[34px]  font-geist-semibold">
        Welcome Back
      </CardTitle>
      <CardDescription className="text-[14px] font-geist h-[20px] text-zinc-500">
        Sign in to continue managing your email campaigns
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5 ">
            <Label htmlFor="name" className="text-zinc-950 h-[20px] text-[14px] text-m font-geist">
                Email Address
            </Label>
            <Input id="name" value={email} placeholder="eg.user@example.com" 
            onChange={handleEmailChange}
            onBlur={() => handleBlur('email')} 
            className={errors.email && touched.email ? "border-red-500 focus:ring-0 focus-visible:ring-0 padding-[10px] " :" w-full px-3 py-2 pr-10 rounded-md border border-gray-300 shadow-none !shadow-none focus:ring-0 focus-visible:ring-0 focus:outline-none padding-[10px]"}
            />
            {errors.email && touched.email && (<p className="text-red-500 text-sm mt-1">{errors.email}</p>)}
          </div>
          <div className="flex flex-col space-y-1.5">
            <div><Label htmlFor="password">Password</Label>
            </div>
  <div className="relative">
  <input
  id="password"
    type={showPassword? "text":"password"}
    placeholder="Enter your password"
    value={password}
    onChange={handlePasswordChange}
    onBlur={() => handleBlur('password')}
    className={errors.password && touched.password ? "border-red-500 w-full px-3 py-2 pr-10 border border-gray-300 rounded-md padding-[10px]" :"w-full px-3 py-2 pr-10 border border-gray-300 rounded-md padding-[10px]"}
  />
  <button type="button" onClick={togglePassword} className="absolute right-2 top-[20px] -translate-y-1/2 text-gray-500 hover:text-gray-700"  tabIndex={-1}>
    {showPassword ? <EyeOff size={20}/>:<Eye size={20}/>}
  </button>
  {errors.password && touched.password && (<p className="text-red-500 text-sm mt-1 ">{errors.password}</p> )}
</div>
            
          </div>
          <div className="text-end  ">
            <Link href="/forgot-password" className="text-sm text-gray-600 "> Forgot Password ? </Link>
            
          </div>
        </div>
        <div className="w-[100%]">
        <Button  type="submit" className="w-[100%]" >Log In
        </Button>
      </div>
      </form>
     
  
    </CardContent>
    <CardFooter className="flex flex-col items-center gap-2">
  
      
      <div className="">
        <p>Did not have an account ? <a href="/signup" className=" text-sm underline text-blue-500 hover:no-underline ">Sign Up</a></p>
      </div>
      <div className="text-sm text-zinc-500 text-center">
        <p>By clicking continue, you agree to our {" "} 
          <a href="#" className="underline hover:no-underline">Terms of Service</a> and 
          <a href="#" className="underline hover:no-underline">Privacy Policy</a></p>
      </div>
    </CardFooter>
  </Card>
  </div>
  </div>
  );
}
