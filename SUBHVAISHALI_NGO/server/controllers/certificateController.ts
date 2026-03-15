import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { Certificate } from "../models/Certificate.js";
import { Volunteer } from "../models/Volunteer.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificate = async (req: Request, res: Response) => {
  try {
    const { volunteerId } = req.body;
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    const certificateId = uuidv4();
    
    // In a real app, you would upload this PDF to Cloudinary or AWS S3
    // Here we will just create a basic PDF and return a mock URL or base64
    
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
    });

    let buffers: any[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);
      const base64Pdf = pdfData.toString('base64');
      const pdfUrl = `data:application/pdf;base64,${base64Pdf}`;

      const certificate = await Certificate.create({
        volunteerId,
        volunteerName: volunteer.name,
        certificateId,
        pdfUrl: pdfUrl // Saving base64 for simplicity in this demo
      });

      res.status(201).json(certificate);
    });

    // Draw Certificate
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');
    doc.fontSize(40).fillColor('#333').text('Certificate of Appreciation', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text('This is proudly presented to', { align: 'center' });
    doc.moveDown();
    doc.fontSize(30).fillColor('#2563eb').text(volunteer.name, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).fillColor('#666').text('For their outstanding contribution and dedication as a volunteer.', { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(12).text(`Certificate ID: ${certificateId}`, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

    doc.end();

  } catch (error) {
    res.status(500).json({ message: "Error generating certificate", error });
  }
};

export const getCertificates = async (req: Request, res: Response) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 }).populate('volunteerId', 'name email');
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) return res.status(404).json({ message: "Certificate not found or invalid" });
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findByIdAndUpdate(id, req.body, { new: true });
    if (!certificate) return res.status(404).json({ message: "Certificate not found" });
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findByIdAndDelete(id);
    if (!certificate) return res.status(404).json({ message: "Certificate not found" });
    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
