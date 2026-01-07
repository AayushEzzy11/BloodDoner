import { db } from "@/firebase/firebaseConfig"; // your initialized firebase-admin
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, Timestamp }  from "firebase/firestore";
// import { uploadBloodDonationReport } from "@/lib/uploader";g


export const acceptBloodRequest = async (
  donorId: string,
  bloodRequestId: string
) => {
  const requestRef = doc(db, "bloodRequests", bloodRequestId);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists()) {
    throw new Error("Blood request not found");
  }

  const requestData = requestSnap.data();
  const now = Timestamp.now();

  // Check expiry
  const ttl = requestData.ttl?.toMillis?.() || 0;
  const expired = ttl < now.toMillis();

  if (expired) {
    if (requestData.status === "requested") {
      await updateDoc(requestRef, { status: "expired" });
    }
    throw new Error("Cannot accept expired blood request");
  }

  // Prevent double acceptance: check if donor already accepted
  const existingQuery = query(
    collection(db, "bloodAcceptances"), // inlined here
    where("bloodRequestId", "==", bloodRequestId),
    where("donorId", "==", donorId)
  );
  const existingSnap = await getDocs(existingQuery);

  if (!existingSnap.empty) {
    throw new Error("You have already accepted this request");
  }

  // Save the acceptance
  const acceptanceRef = doc(collection(db, "bloodAcceptances")); // inlined here
  await setDoc(acceptanceRef, {
    bloodRequestId,
    donorId,
    acceptedAt: now,
  });

  // Optionally mark request as accepted
  await updateDoc(requestRef, { status: "accepted" });

  return {
    success: true,
    acceptanceId: acceptanceRef.id,
  };
};

// export const completeBloodDonation = async (
//   donationId: string,
//   file: {
//     buffer: Buffer;
//     originalname: string;
//   }
// ) => {
//   const donationRef = db.collection("bloodAcceptances").doc(donationId);
//   const donationSnap = await donationRef.get();

//   if (!donationSnap.exists) {
//     throw new Error("Donation record not found");
//   }

//   const reportUrl = await uploadBloodDonationReport(file);

//   await donationRef.update({
//     reportUrl,
//     status: "completed",
//     completedAt: Timestamp.now(),
//   });

//   return {
//     success: true,
//     reportUrl,
//   };
// };
