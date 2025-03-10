"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiLayout, FiEye } from "react-icons/fi";
import { useState, useEffect } from "react";
import ClassicInvoice from "@/app/templates/ClassicInvoice";
import ModernBill from "@/app/templates/ModernBill";
import ProfessionalStatement from "@/app/templates/ProfessionalStatement";
import CreativeReceipt from "@/app/templates/CreativeReceipt";
import CompactInvoice from "@/app/templates/CompactInvoice";
import Image from "next/image";

const invoiceData = {
    "_id": "67cb0c6244a311b7f2bf5dca",
    "customer_id": {
        "_id": "67c9ca73c796ff003c1ff55d",
        "name": "Mahesh Bhatiya",
        "email": "maheshbhatiya304@gmail.com",
        "phone": "+91 98765 43210",
        "address": "Rajkot, Gujarat, India",
        "deleted": false,
        "created_at": "2025-03-06T16:16:51.831Z",
        "updated_at": "2025-03-06T16:17:55.051Z",
    },
    "issue_date": "2009-04-24T00:00:00.000Z",
    "due_date": "1970-02-04T00:00:00.000Z",
    "reference_number": "ygugu yguy",
    "recurring": true,
    "products": [
        {
            "product_id": {
                "_id": "67c86e3968b7d9de28ec3f17",
                "name": "Lenovo ThinkSystem SR650 Server",
                "category_id": "67c86cc768b7d9de28ec3ee1",
                "unit_id": "67c86d5868b7d9de28ec3ef5",
                "price": 150000,
                "deleted": false,
                "created_at": "2025-03-05T15:31:05.230Z",
                "updated_at": "2025-03-06T14:55:55.704Z",
            },
            "quantity": 1,
            "unit_price": 150000,
            "total_amount": 150000,
            "_id": "67cb0c6244a311b7f2bf5dcb",
        },
    ],
    "discount_type": "percentage",
    "discount_amount": 0,
    "note": "Maxime ratione facil",
    "total_amount": 150000,
    "deleted": false,
    "created_at": "2025-03-07T15:10:26.728Z",
    "updated_at": "2025-03-07T15:41:50.409Z",
    "cycle": "year",
};

const invoiceTemplates = [
    { id: "template-001", name: "Classic Invoice", component: ClassicInvoice, image: "/template1.png" },
    { id: "template-002", name: "Modern Bill", component: ModernBill, image: "/template2.png" },
    { id: "template-003", name: "Professional Statement", component: ProfessionalStatement, image: "/template3.png" },
    { id: "template-004", name: "Creative Receipt", component: CreativeReceipt, image: "/template4.png" },
    { id: "template-005", name: "Compact Invoice", component: CompactInvoice, image: "/template5.png" },
];

export default function InvoicePage({ params }: any) {
    // Load selected template from localStorage or default to null
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [themeColor, setThemeColor] = useState("#87CEEB");
    const [checkedTemplateId, setCheckedTemplateId] = useState<string | null>(null);

    // Load saved template from localStorage on mount
    useEffect(() => {
        const savedTemplateId = localStorage.getItem("selectedTemplateId");
        if (savedTemplateId) {
            const savedTemplate = invoiceTemplates.find(t => t.id === savedTemplateId);
            setCheckedTemplateId(savedTemplateId);
            setSelectedTemplate(savedTemplate || null);
        }
    }, []);

    const handleTemplateCheck = (templateId: string) => {
        const template = invoiceTemplates.find(t => t.id === templateId);
        if (template) {
            setCheckedTemplateId(templateId);
            setSelectedTemplate(template);
            // Save to localStorage
            localStorage.setItem("selectedTemplateId", templateId);
        }
    };

    const handlePreview = () => {
        if (checkedTemplateId) {
            setIsFullScreen(true);
        }
    };

    const handleBack = () => {
        setIsFullScreen(false);
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        hover: { scale: 1.05, zIndex: 10 },
        tap: { scale: 0.95 }
    };

    return (
        <div className="">
            <AnimatePresence mode="wait">
                {!isFullScreen ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="container mx-auto p-6"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <h1 className="text-3xl font-bold">Invoice #{params.id}</h1>
                                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                                    <FiLayout className="w-4 h-4" />
                                    {invoiceTemplates.length} Templates Available
                                </span>
                            </div>
                            {checkedTemplateId && (
                                <div className="flex gap-2 items-center">
                                    <div className=" gap-2">
                                    <input type="color" className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700" id="hs-color-input" value="#2563eb" title="Choose your color"/>
                                    </div>
                                    <button
                                        onClick={handlePreview}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Preview Selected Template
                                    </button>
                                </div>
                            )}
                        </div>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                            layout
                        >
                            {invoiceTemplates.map((template) => (
                                <motion.div
                                    key={template.id}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="relative group bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                                >
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={checkedTemplateId === template.id}
                                                    onChange={() => handleTemplateCheck(template.id)}
                                                    className="w-4 h-4 cursor-pointer"
                                                />
                                                <h3 className="font-semibold text-gray-800">
                                                    {template.name}
                                                </h3>
                                            </div>
                                            <FiEye className="text-gray-400 group-hover:text-blue-500" />
                                        </div>
                                        <motion.div
                                            className="relative h-80 overflow-hidden rounded-lg bg-gray-50"
                                            whileHover={{ scale: 0.95 }}
                                        >
                                            <div className="absolute inset-0 scale-100 origin-top-left">
                                                <Image
                                                    src={template.image}
                                                    height={500}
                                                    width={500}
                                                    alt={`${template.name} preview`}
                                                />
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50"
                    >
                        <div className="h-screen flex flex-col">
                            <div className="p-6 border-b flex items-center justify-between bg-white">
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <FiArrowLeft className="w-5 h-5" />
                                    Back to Templates
                                </button>
                                <span className="text-lg font-semibold">
                                    {selectedTemplate?.name}
                                </span>
                            </div>

                            <motion.div
                                layoutId={`card-${selectedTemplate?.id}`}
                                className="flex-1 overflow-auto p-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="max-w-4xl mx-auto">
                                    <selectedTemplate.component invoiceData={invoiceData} themeColor={themeColor} />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}