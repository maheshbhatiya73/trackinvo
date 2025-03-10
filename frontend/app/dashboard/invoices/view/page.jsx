"use client";

import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { api } from "@/app/lib/api";
import ClassicInvoice from "@/app/templates/ClassicInvoice";
import ModernBill from "@/app/templates/ModernBill";
import ProfessionalStatement from "@/app/templates/ProfessionalStatement";
import CompactInvoice from "@/app/templates/CompactInvoice";
import CreativeReceipt from '@/app/templates/CreativeReceipt'
import Loader from "@/app/components/loader";
import { motion } from "framer-motion";
import { FiDownload, FiEye, FiX } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/app/components/common/Button";
import { HiArrowLeft } from "react-icons/hi";


const invoiceTemplates = {
  "template-001": { name: "Classic Invoice", component: ClassicInvoice },
  "template-002": { name: "Modern Bill", component: ModernBill },
  "template-003": { name: "Professional Statement", component: ProfessionalStatement },
  "template-004": { name: "Creative Receipt", component: CreativeReceipt },
  "template-005": { name: "Compact Invoice", component: CompactInvoice },
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [templateId, setTemplateId] = useState("template-001");
  const invoiceRef = useRef(null);
  const searchParams = useSearchParams();
    const router = useRouter();
  


  useEffect(() => {
    setIsClient(true);
    const id = searchParams.get("id");
    const fetchInvoice = async () => {
      try {
        const response = await api.getInvoiceById(id);
        if (response.data) {
          setInvoiceData(response.data);
          setTemplateId(response.data.invoice_template_id || "template-001");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };
    fetchInvoice();
  }, []);


  const generatePDF = () => {
    const input = invoiceRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      pdf.save(`${invoiceTemplates[templateId].name}.pdf`);
    });
  };

  const handleBack = () => {
    router.push("/dashboard/invoices");
  };

  const TemplateComponent = invoiceTemplates[templateId]?.component || ClassicInvoice;

  return (
    <div className="">
      <Head>
        <title>{invoiceTemplates[templateId].name} PDF</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={handleBack}
            className="flex items-center gap-2 bg-gray-600 text-white hover:bg-gray-700"
          >
            <HiArrowLeft className="w-5 h-5" />
            Back to Invoices
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="flex gap-4">
            <h1 className="text-4xl font-bold  mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              {invoiceData?.reference_number}
            </h1>
            <div className="flex gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => generatePDF()}
                className="flex cursor-pointer items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <FiDownload className="text-xl" />
                Download PDF
              </motion.button>
            </div>
          </div>

          {isClient && invoiceData ? (
            <>
              <div
                ref={invoiceRef}
                style={{
                  maxWidth: '64rem',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '1rem',
                  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1)',
                  transition: 'transform 0.2s ease-in-out',
                  ':hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <TemplateComponent invoiceData={invoiceData} themeColor="#6366f1" />
              </div>
            </>
          ) : (
            <Loader />
          )}
        </motion.div>
      </div>
    </div>
  );
}
