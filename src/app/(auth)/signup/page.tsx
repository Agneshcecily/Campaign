'use client';

import { ChangeEvent, useState } from "react";
import { Eye, EyeOff, Link } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function SignupPage() {
  interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?:string;

}
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const router=useRouter();
   const [email,setEmail]=useState('');
   const [password,setPassword]=useState('');
   const [confirmPassword,setConfirmPassword]=useState('');
   const [errors, setErrors] = useState<FormErrors>({})
   const [touched, setTouched] = useState({ email: false, password: false,confirmPassword:false })
   const gmailRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
   const togglePassword = () => setShowPassword((prev) => !prev);
   const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const validateEmail=(value:string)=>{
    
    if(!value){
      return "email is required"
    }
    if(!gmailRegex.test(value)){
      return "please enter the valid mail Address"
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
   const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    
    if (touched.password) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validatePassword(value)
      }))
    }
  }


  const handleBlur = (field: 'email' | 'password' | 'confirmPassword') => {
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
    else if(field === 'confirmPassword'){
      setErrors(prev =>({
        ...prev,
        confirmPassword:validatePassword(confirmPassword)
      }))
    }
  }

   const handleSubmit=async (e:React.FormEvent)=>{
   e.preventDefault();
    const emailError=validateEmail(email);
    const passwordError=validatePassword(password);
    const confirmPasswordError=validatePassword(confirmPassword);
   

    setTouched({ email: true, password: true ,confirmPassword:true})

    setErrors({
      email:emailError,
      password:passwordError,
      confirmPassword:confirmPasswordError,
    })

    if(emailError||passwordError || confirmPasswordError){
      
      return
    }
    if(password!==confirmPassword){
        setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match"
      }))
         return;
    }
   try{
            const response = await fetch('http://localhost:4000/user/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials:'include',
            body: JSON.stringify({
              emailId:email,
              password:password,
              isVerified:false
            }),
          });
          const res=await response.json();
         
          if(response.status===401){
            return false;
          }

          if(response.ok){
            if(res.status==="exist"){
              toast.error("User Already Exist! Please Login !")
              return false;
            }
            else if(res.status==="new user"){
            setEmail('');
            setPassword('');
            router.push('signup/register-otp?status=sent')
            return true;
            }
          }
          else{
              
            return false;
          }
    }
    catch(error){
      return false;
    }

        }
   

  return (
    <div className="flex h-screen w-full">
    
      <div className="hidden md:flex md:w-1/2 bg-black flex-col p-6">
       
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <Card className="w-[350px] max-w-md border-none shadow-none">
          <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2 text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight">Let Get You Started</h1>
              <p className="text-sm text-gray-500">
                Create your account to start managing and launching campaigns with ease.
              </p>
            </div>

              <div className="min-h-[64px] space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="e.g., user@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  className={errors.email && touched.email ? "border-red-500 focus:ring-0 focus-visible:ring-0 padding-[10px] " :" w-full px-3 py-2 pr-10 rounded-md border border-gray-300 shadow-none !shadow-none focus:ring-0 focus-visible:ring-0 focus:outline-none padding-[10px]"}
                  onBlur={()=>handleBlur('email')}
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                />
                
              </div>
              {errors.email && touched.email && (<p className="text-red-500 text-sm mb-1">{errors.email}</p>)}

              <div className="min-h-[64px] space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    className={errors.password && touched.password ? "border-red-500 focus:ring-0 focus-visible:ring-0 padding-[10px] " :" w-full px-3 py-2 pr-10 rounded-md border border-gray-300 shadow-none !shadow-none focus:ring-0 focus-visible:ring-0 focus:outline-none padding-[10px]"}
                    onChange={handlePasswordChange}
                    onBlur={()=>handleBlur('password')}
                    type={showPassword ? "text" : "password"}
                    autoCapitalize="none"
                    autoComplete="new-password"
                  />
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 bg-transparent text-gray-500 hover:text-gray-700 hover:bg-transparent"
                    onClick={togglePassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {errors.password && touched.password && (<p className="text-red-500 text-sm mb-1">{errors.password}</p>)}
              </div>

              <div className="min-h-[64px] space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="flex items-center relative">
                  <Input
                    id="confirmPassword"
                    placeholder="Enter your password"
                    value={confirmPassword}
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={handleConfirmPasswordChange}
                    className={errors.confirmPassword && touched.confirmPassword ? "border-red-500 focus:ring-0 focus-visible:ring-0 padding-[10px] " :" w-full px-3 py-2 pr-10 rounded-md border border-gray-300 shadow-none !shadow-none focus:ring-0 focus-visible:ring-0 focus:outline-none padding-[10px]"}
                    onBlur={()=>handleBlur('confirmPassword')}
                    autoCapitalize="none"
                    autoComplete="new-password"
                  />
                  
                  <Button
                    type="button"
                    size="icon"
                    className="flex items-center absolute right-0 top-0 h-full px-3 py-2 bg-transparent text-gray-500 hover:text-gray-700 hover:bg-transparent "
                    onClick={toggleConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className=" absolute h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                  
                </div>
                {errors.confirmPassword && touched.confirmPassword && (<p className="text-red-500 text-sm mb-1">{errors.confirmPassword}</p>)}
              </div>

              <Button 
                className="w-full bg-black text-white hover:bg-gray-800"
                type="submit">
                Sign Up
              </Button>

            <div className="mt-4 text-center text-sm">
             <p> Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
              Log In
              </a>
              </p> 
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              By clicking continue, you agree to our{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Privacy Policy
              </a>
              .
            </div>
          </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}