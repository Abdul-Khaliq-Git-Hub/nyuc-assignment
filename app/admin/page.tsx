"use client";
import { db } from "@/firebase/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { auth } from "../../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { Parser } from "json2csv";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";

interface Data {
  id: string;
  name?: string;
  email?: string;
  message?: string;
}

const Admin = () => {
  const [submittedFormData, setSubmittedFormData] = useState<Data[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSubmittedData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const submittedData: Data[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubmittedFormData(submittedData);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    fetchSubmittedData();
  }, []);

  const downloadUserData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userData: Data[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (userData.length === 0) {
        alert("No data to download.");
        return;
      }

      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(userData);

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "user_data.csv");
    } catch (error) {
      console.error("Error generating CSV:", error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <header className="text-center flex justify-between">
        <h1 className="text-4xl font-bold text-primary tracking-wide m-4">
          Admin Dashboard
        </h1>
        <button
          className="m-4 bg-primary rounded-lg p-2 text-white hover:bg-blue-600"
          onClick={() => {
            auth.signOut();
            router.push("/");
          }}
        >
          Log out
        </button>
      </header>

      <div className="flex flex-col flex-1 items-center justify-center bg-secondary">
        <div className="overflow-x-auto w-[60%] bg-white rounded-xl shadow-lg p-4">
          <table className="w-full border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-primary text-white text-lg uppercase">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Message</th>
              </tr>
            </thead>

            <tbody>
              {submittedFormData.length > 0 ? (
                submittedFormData.map((user) => (
                  <tr
                    className="text-center border-b border-gray-300"
                    key={user.id}
                  >
                    <td className="p-3">{user.name || "N/A"}</td>
                    <td className="p-3">{user.email || "N/A"}</td>
                    <td className="p-3">{user.message || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-gray-500">
                    No submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <button
            onClick={downloadUserData}
            className="mt-4 p-2 bg-primary text-white rounded-lg hover:bg-blue-600"
          >
            Download CSV
          </button>
        </div>
      </div>
    </main>
  );
};

export default Admin;
