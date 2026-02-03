import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { Heart, UserPlus, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/lib/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Register() {
  //
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is already logged in, redirect them away from register page
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if(userDocSnap.exists()){
            const userData = userDocSnap.data();

            if (userData.role === "donor") {
              navigate("/dashboard", { replace: true });
              return;
            } else if (userData.role === "seeker") {
              navigate("/", { replace: true });
              return;
            } else if (userData.role === "admin") {
              // If an admin somehow lands on the public register page
              // (e.g. via "Become a Donor"), send them to the
              // admin dashboard instead of the admin login page.
              navigate("/admin/dashboard", { replace: true });
              return;
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    });

    return () => unsubscribe();
  }, []);
  const [tab, setTab] = useState<"donor" | "admin">("donor");
  const [isLoading, setIsLoading] = useState(false);

  // const [formData, setFormData] = useState<any>({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   phone: "",
  //   bloodType: "",
  //   age: "",
  //   address: "",
  //   password: "",
  //   confirmPassword: "",
  //   orgName: "",
  //   contactPerson: "",
  //   licenseNumber: "",
  // });

  const [donorData, setDonorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bloodType: "",
    age: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [seekerData, setSeekerData] = useState({
    orgName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    licenseNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    adminKey: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (tab === "donor") {
      setDonorData((prev) => ({ ...prev, [id]: value }));
    } else if (tab === "admin") {
      setAdminData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSelectChange = (value: string) => {
    if (tab === "donor") {
      setDonorData((prev) => ({ ...prev, bloodType: value }));
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    if (tab === "donor") {
      const { email,firstName, lastName,phone,bloodType,age,address, password, confirmPassword } = donorData;
      if(!firstName) {
        setIsLoading(false);
        return toast.error("First name is required.");
      }
      if(!lastName) {
        setIsLoading(false);
        return toast.error("Last name is required.");
      }
      if (!email) {
        setIsLoading(false);
        return toast.error("Email is required.");
      }
      if(!phone) {
        setIsLoading(false);
        return toast.error("Phone number is required.");
      }
      const phoneRegex = /^\+977\s9\d{9}$/;
      if(!phoneRegex.test(phone)) {
        setIsLoading(false);
        return toast.error("Invalid Phone number.");
      }
      if(!bloodType) {
        setIsLoading(false);
        return toast.error("Blood type is required.");
      }
      if(!age) {
        setIsLoading(false);
        return toast.error("Age is required.");
      }
      if(parseInt(age) < 18) {
        setIsLoading(false);
        return toast.error("You must be at least 18 years old.");
      }
      if(!address) {
        setIsLoading(false);
        return toast.error("Address is required.");
      }
      const addressRegex = /^[^,]+(,[^,]+)+[^\s,]$/;
      if(!addressRegex.test(address)) {
        setIsLoading(false);
        return toast.error("Address must be in City, District format.");
      }
      if(!password) {
        setIsLoading(false);
        return toast.error("Password is required.");
      }
      if (password !== confirmPassword) {
        setIsLoading(false);
        return toast.error("Passwords do not match.");
      }
      try {
        await registerUser(email, password, {
          role: "donor",
          firstName: donorData.firstName,
          lastName: donorData.lastName,
          phone: donorData.phone,
          bloodType: donorData.bloodType,
          age: donorData.age,
          address: donorData.address,
        });
        toast.success("Donor registration successful!");
        setDonorData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          bloodType: "",
          age: "",
          address: "",
          password: "",
          confirmPassword: "",
        });
        // Don't navigate, let auth listener handle redirect
      } catch (err: any) {
        setIsLoading(false);
        switch (err.code) {
          case "auth/email-already-in-use":
            toast.error("This email already exist.");
            break;
          case "auth/invalid-email":
            toast.error("Invalid email format.");
            break;
          case "auth/weak-password":
            toast.error("Password is too weak (min 6 characters).");
            break;
          default:
            toast.error("Registration failed:",err.message);
        }
      }
    } else if (tab === "admin") {
      const { email, firstName, lastName, phone, adminKey, password, confirmPassword } = adminData;
      if (!firstName) {
        setIsLoading(false);
        return toast.error("First name is required.");
      }
      if (!lastName) {
        setIsLoading(false);
        return toast.error("Last name is required.");
      }
      if (!email) {
        setIsLoading(false);
        return toast.error("Email is required.");
      }
      if (!phone) {
        setIsLoading(false);
        return toast.error("Phone number is required.");
      }
      const phoneRegex = /^\+977\s9\d{9}$/;
      if (!phoneRegex.test(phone)) {
        setIsLoading(false);
        return toast.error("Invalid Phone number.");
      }
      if (!adminKey) {
        setIsLoading(false);
        return toast.error("Admin key is required.");
      }
      const validAdminKey = "ADMIN_SECRET_2024";
      if (adminKey !== validAdminKey) {
        setIsLoading(false);
        return toast.error("Invalid admin key.");
      }
      if (!password) {
        setIsLoading(false);
        return toast.error("Password is required.");
      }
      if (password !== confirmPassword) {
        setIsLoading(false);
        return toast.error("Passwords do not match.");
      }

      try {
        await registerUser(email, password, {
          role: "admin",
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          phone: adminData.phone,
        });
        toast.success("Admin account created successfully!");
        setAdminData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          adminKey: "",
          password: "",
          confirmPassword: "",
        });
        // Don't navigate, let auth listener handle redirect
      } catch (err: any) {
        setIsLoading(false);
        switch (err.code) {
          case "auth/email-already-in-use":
            toast.error("This email already exist.");
            break;
          case "auth/invalid-email":
            toast.error("Invalid email format.");
            break;
          case "auth/weak-password":
            toast.error("Password is too weak (min 6 characters).");
            break;
          default:
            toast.error("Registration failed:", err.message);
        }
      }
    }
    setIsLoading(false);
  };
  //
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary fill-current" />
            </div>
            <h1 className="text-2xl font-bold text-brand-gray">
              Join SahayogRed
            </h1>
            <p className="text-muted-foreground mt-2">
              Create your account and start saving lives
            </p>
          </div>

          <Tabs defaultValue="donor" value={tab} onValueChange={(val) => setTab(val as "donor" | "admin")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="donor" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Donor
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donor">
              <Card>
                <CardHeader>
                  <CardTitle>Register as a Blood Donor</CardTitle>
                  <CardDescription>
                    Help save lives by becoming a verified blood donor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName"
                        value={donorData.firstName}
                        onChange={handleChange}
                        placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" 
                        value={donorData.lastName}
                        onChange={handleChange}
                        placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={donorData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" 
                      value={donorData.phone}
                      onChange={handleChange}
                      placeholder="+977 9XXXXXXXXX" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Select onValueChange={handleSelectChange} value={donorData.bloodType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age"
                        value={donorData.age}
                        onChange={handleChange}
                        type="number" placeholder="25" 
                        min="18"/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" 
                      value={donorData.address}
                      onChange={handleChange}
                      placeholder="City, District" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" 
                        value={donorData.password}
                        onChange={handleChange}
                        type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" 
                        value={donorData.confirmPassword}
                        onChange={handleChange}
                        type="password" />
                  </div>
                  <Button className="w-full" onClick={handleRegister}>Register as Donor</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Register as Administrator</CardTitle>
                  <CardDescription>
                    Create an admin account to manage blood donations and requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName"
                        value={adminData.firstName}
                        onChange={handleChange}
                        placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" 
                        value={adminData.lastName}
                        onChange={handleChange}
                        placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={adminData.email}
                      onChange={handleChange}
                      placeholder="admin@blooddoner.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" 
                      value={adminData.phone}
                      onChange={handleChange}
                      placeholder="+977 9XXXXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminKey">Admin Key</Label>
                    <Input id="adminKey" 
                      type="password"
                      value={adminData.adminKey}
                      onChange={handleChange}
                      placeholder="Enter admin secret key" />
                    <p className="text-xs text-muted-foreground">Contact the system administrator for the admin key</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" 
                        value={adminData.password}
                        onChange={handleChange}
                        type="password" 
                        placeholder="Enter strong password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" 
                        value={adminData.confirmPassword}
                        onChange={handleChange}
                        type="password" 
                        placeholder="Confirm your password" />
                  </div>
                  <Button className="w-full" onClick={handleRegister}>Register as Admin</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
