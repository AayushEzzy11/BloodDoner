import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";

export default function SetupAdmin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const createAdminUser = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      console.log("Creating admin user...");
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        "admin@sahayogred.com",
        "Admin@123456"
      );
      
      const user = userCredential.user;
      
      console.log("Creating admin profile in Firestore...");
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: "admin@sahayogred.com",
        firstName: "Admin",
        lastName: "User",
        phone: "+977 9841234567",
        role: "admin",
        createdAt: new Date(),
        isActive: true
      });
      
      setMessage("✅ Admin account created successfully!");
      setLoading(false);
    } catch (err) {
      setError(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Setup Admin Account</CardTitle>
              <CardDescription>Create the initial admin user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={createAdminUser} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Creating..." : "Create Admin User"}
              </Button>
              
              {message && (
                <div className="p-4 bg-green-50 text-green-800 rounded-lg">
                  <p className="font-medium">{message}</p>
                  <p className="text-sm mt-2">Email: <code>admin@sahayogred.com</code></p>
                  <p className="text-sm">Password: <code>Admin@123456</code></p>
                  <p className="text-sm mt-2">You can now <a href="/login" className="underline text-green-700">login here</a></p>
                </div>
              )}
              
              {error && (
                <div className="p-4 bg-red-50 text-red-800 rounded-lg">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
