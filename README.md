# 📝 Task Manager App

A full-stack Task Management web application built with **Next.js**, **Firebase Authentication**, and **Cloud Firestore**. It allows users to sign up, log in, create, manage, and categorize tasks with due dates.

---

## 🔧 Features

-  **User Authentication** (Email + Password)
-  **Create / Read / Update / Delete (CRUD)** for tasks
-  **Mark tasks as Completed or Pending**
-  **Task Categories** (e.g. Personal, Work)
-  **Due Dates** for reminders
-  **Search & Filter by title or description**
-  **Responsive Design** (Mobile + Desktop)
-  **Real-time updates with Firestore**
-  **Clean UI with Tailwind CSS**

## Tech Stack
 Frontend    -  Next.js (App Router) 
 Styling     -  Tailwind CSS       
 Auth & DB   -  Firebase (Auth + Firestore) 
 Deployment  -  Vercel             

---

## 📁 Folder Structure

src/

app/

login/ → Contains the login page (page.js)

signup/ → Contains the signup page (page.js)

page.js → Main dashboard page where users can add and view tasks

firebaseConfig.js → Firebase initialization file for Auth and Firestore

