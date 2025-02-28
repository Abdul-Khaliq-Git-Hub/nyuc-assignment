"use client";

import Link from "next/link";
import React, { useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const Home = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    recipientEmail: "",
    name: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    userEmail: "",
    recipientEmail: "",
    name: "",
    message: "",
  });

  const handleForm = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      userEmail: "",
      recipientEmail: "",
      name: "",
      message: "",
    };
    let isValid = true;

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
      isValid = false;
    }
    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = "Recipient email is required";
      isValid = false;
    }
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  console.log("Firebase API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      await addDoc(collection(db, "users"), {
        name: formData.name,
        message: formData.message,
        email: formData.userEmail,
      });

      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Email Sent");
        setFormData({
          name: "",
          recipientEmail: "",
          message: "",
          userEmail: "",
        });
      } else {
        alert("Failed to send email.");
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      <nav className="p-2">
        <Link href="/sign-in">
          <button className="border border-primary p-2 rounded-xl bg-primary text-white tracking-wide">
            Admin Login
          </button>
        </Link>
      </nav>
      <div className="bg-secondary flex flex-1 items-center justify-center">
        <div className="flex flex-col border bg-white border-black min-w-[25%] rounded-xl">
          <p className="flex items-center bg-primary h-[50px] text-2xl tracking-wide text-white justify-center rounded-t-xl shadow-md">
            GET IN TOUCH
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 min-h-[screen] justify-around mt-4 m-2"
          >
            <label className="flex flex-col m-2">
              Email
              <input
                type="email"
                name="userEmail"
                className="border border-gray-300 rounded-lg p-3 text-gray-700 shadow-md focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.userEmail}
                onChange={handleForm}
                placeholder="john@email.com"
              />
              {errors.userEmail && (
                <span className="text-red-500">{errors.userEmail}</span>
              )}
            </label>

            <label className="flex flex-col m-2">
              Full Name
              <input
                type="text"
                name="name"
                className="border border-gray-300 rounded-lg p-3 text-gray-700 shadow-md focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.name}
                onChange={handleForm}
                placeholder="Joe Smith"
              />
              {errors.name && (
                <span className="text-red-500">{errors.name}</span>
              )}
            </label>

            <label className="flex flex-col m-2">
              Send to
              <input
                type="email"
                name="recipientEmail"
                className="border border-gray-300 rounded-lg p-3 text-gray-700 shadow-md focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.recipientEmail}
                onChange={handleForm}
                placeholder="joe@email.com"
              />
              {errors.recipientEmail && (
                <span className="text-red-500">{errors.recipientEmail}</span>
              )}
            </label>

            <label className="flex flex-col m-2">
              Comment or Message
              <textarea
                name="message"
                className="border border-gray-300 rounded-lg p-3 text-gray-700 shadow-md focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.message}
                onChange={handleForm}
                placeholder="Type what's on your mind"
              />
              {errors.message && (
                <span className="text-red-500">{errors.message}</span>
              )}
            </label>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-primary p-2 mt-4 rounded-xl transition duration-200 text-white text-lg tracking-wide"
              >
                Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Home;
