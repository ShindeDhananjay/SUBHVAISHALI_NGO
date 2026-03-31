import { Router } from "express";
import { loginAdmin, getDashboardStats, updateCredentials } from "../controllers/adminController.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.ts";
import { getActivities, createActivity, updateActivity, deleteActivity } from "../controllers/activityController.ts";
import { registerVolunteer, getVolunteers, updateVolunteerStatus, updateVolunteer, deleteVolunteer } from "../controllers/volunteerController.ts";
import { recordDonationIntent, getDonations, updateDonation, deleteDonation } from "../controllers/donationController.ts";
import { generateCertificate, getCertificates, verifyCertificate, updateCertificate, deleteCertificate } from "../controllers/certificateController.ts";
import { getContent, updateContent, updateMultipleContent } from "../controllers/contentController.ts";
import { submitContact, getMessages, markAsRead } from "../controllers/contactController.ts";
import { uploadImage, upload } from "../controllers/uploadController.ts";

const router = Router();

// Admin
router.post("/admin/login", loginAdmin);
router.get("/admin/dashboard", authMiddleware, getDashboardStats);
router.put("/admin/credentials", authMiddleware, updateCredentials);

// Events
router.get("/events", getEvents);
router.post("/events", authMiddleware, createEvent);
router.put("/events/:id", authMiddleware, updateEvent);
router.delete("/events/:id", authMiddleware, deleteEvent);

// Activities
router.get("/activities", getActivities);
router.post("/activities", authMiddleware, createActivity);
router.put("/activities/:id", authMiddleware, updateActivity);
router.delete("/activities/:id", authMiddleware, deleteActivity);

// Volunteers
router.post("/volunteers", registerVolunteer);
router.get("/volunteers", authMiddleware, getVolunteers);
router.put("/volunteers/:id/status", authMiddleware, updateVolunteerStatus);
router.put("/volunteers/:id", authMiddleware, updateVolunteer);
router.delete("/volunteers/:id", authMiddleware, deleteVolunteer);

// Donations
router.post("/donations/intent", recordDonationIntent);
router.get("/donations", authMiddleware, getDonations);
router.put("/donations/:id", authMiddleware, updateDonation);
router.delete("/donations/:id", authMiddleware, deleteDonation);

// Certificates
router.post("/certificates/generate", authMiddleware, generateCertificate);
router.get("/certificates", authMiddleware, getCertificates);
router.get("/certificates/verify/:certificateId", verifyCertificate);
router.put("/certificates/:id", authMiddleware, updateCertificate);
router.delete("/certificates/:id", authMiddleware, deleteCertificate);

// Content
router.get("/content", getContent);
router.put("/content", authMiddleware, updateContent);
router.put("/content/multiple", authMiddleware, updateMultipleContent);

// Contact
router.post("/contact", submitContact);
router.get("/contact", authMiddleware, getMessages);
router.put("/contact/:id/read", authMiddleware, markAsRead);

// Uploads
router.post("/upload", authMiddleware, upload.single("image"), uploadImage);

export default router;
