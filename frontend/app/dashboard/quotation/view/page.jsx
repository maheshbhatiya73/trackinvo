"use client";

import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { api } from "@/app/lib/api";
import ClassicQuotation from "@/app/templates/Classicquotation";
import ModernQuotation from "@/app/templates/Modernquotation";
import ProfessionalQuotation from "@/app/templates/Professionalquotation";
import CompactQuotation from "@/app/templates/Compactquotation";
import CreativeQuotation from "@/app/templates/Creativequotation";
import Loader from "@/app/components/loader";
import { motion } from "framer-motion";
import { FiDownload, FiEye, FiX } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/app/components/common/Button";
import { HiArrowLeft } from "react-icons/hi";

const quotationTemplates = {
  "template-001": { name: "Classic Quotation", component: ClassicQuotation },
  "template-002": { name: "Modern Quotation", component: ModernQuotation },
  "template-003": { name: "Professional Quotation", component: ProfessionalQuotation },
  "template-004": { name: "Creative Quotation", component: CreativeQuotation },
  "template-005": { name: "Compact Quotation", component: CompactQuotation },
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [quotationData, setQuotationData] = useState(null);
  const [templateId, setTemplateId] = useState("template-001");
  const quotationRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const id = searchParams.get("id");
    const fetchQuotation = async () => {
      try {
        const response = await api.getQuotationById(id); // Updated API call
        if (response.data) {
          setQuotationData(response.data);
          setTemplateId(response.data.quotation_template_id || "template-001"); // Updated field name
        }
      } catch (error) {
        console.error("Error fetching quotation:", error);
      }
    };
    fetchQuotation();
  }, []);

  const generatePDF = () => {
    const input = quotationRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      pdf.save(`${quotationTemplates[templateId].name}.pdf`);
    });
  };

  const handleBack = () => {
    router.push("/dashboard/quotation"); // Updated route
  };

  const TemplateComponent = quotationTemplates[templateId]?.component || ClassicQuotation;

  return (
    <div className="">
      <Head>
        <title>{quotationTemplates[templateId].name} PDF</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={handleBack}
            className="flex items-center gap-2 bg-gray-600 text-white hover:bg-gray-700"
          >
            <HiArrowLeft className="w-5 h-5" />
            Back to Quotations
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="flex gap-4">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              {quotationData?.reference_number}
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

          {isClient && quotationData ? (
            <>
              <div
                ref={quotationRef}
                style={{
                  maxWidth: "64rem",
                  backdropFilter: "blur(16px)",
                  borderRadius: "1rem",
                  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  transform: "scale(1)",
                  transition: "transform 0.2s ease-in-out",
                  ":hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <TemplateComponent quotationData={quotationData} themeColor="#6366f1" />
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