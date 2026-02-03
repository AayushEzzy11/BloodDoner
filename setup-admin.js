import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBh1gCiAjI5EZzw6ramniOmIt8yScjwfu4",
  authDomain: "sahayogred.firebaseapp.com",
  projectId: "sahayogred",
  storageBucket: "sahayogred.firebasestorage.app",
  messagingSenderId: "735884438835",
  appId: "1:735884438835:web:22fee40fc5878262ba2246",
  measurementId: "G-NSWCQ6T5GP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupAdmin() {
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
    
    console.log("✅ Admin account created successfully!");
    console.log("Email: admin@sahayogred.com");
    console.log("Password: Admin@123456");
    console.log("You can now login and access the admin dashboard.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin account:", error.message);
    process.exit(1);
  }
}

setupAdmin();
