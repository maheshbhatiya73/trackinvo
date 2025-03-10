"use client";

import { motion } from "framer-motion";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default function ProfessionalStatement({ invoiceData, themeColor = "#6366f1" }: any) {
  const { customer_id, issue_date, due_date, products, total_amount, reference_number } = invoiceData;

  // Dynamic styles based on themeColor
  const lightThemeBg = `${themeColor}10`; // 10% opacity for subtle backgrounds
  const headerGradient = `linear-gradient(to right, ${themeColor}, #9333ea)`; // Gradient with themeColor

  return (
    <div
    style={{
      maxWidth: "900px",
      padding: "32px",
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    }}
  >
    {/* Header Section */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "32px",
        paddingBottom: "24px",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div style={{ marginBottom: "16px" }}>
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            backgroundImage: headerGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Invoice
        </h1>
        <p style={{ fontSize: "14px", fontWeight: "500", color: themeColor }}>
          Ref: #{reference_number}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "16px",
          borderRadius: "8px",
          backgroundColor: lightThemeBg,
        }}
      >
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#6B7280",
              textTransform: "uppercase",
            }}
          >
            Issued Date
          </p>
          <p style={{ color: "#374151", fontWeight: "500" }}>
            {new Date(issue_date).toLocaleDateString()}
          </p>
        </div>
        <div style={{ width: "1px", height: "32px", backgroundColor: "#E5E7EB" }}></div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#6B7280",
              textTransform: "uppercase",
            }}
          >
            Due Date
          </p>
          <p style={{ color: "#374151", fontWeight: "500" }}>
            {new Date(due_date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>

    {/* Client Information */}
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        marginBottom: "32px",
      }}
    >
      <div
        style={{
          flex: "1",
          minWidth: "250px",
          padding: "16px",
          backgroundColor: "#F9FAFB",
          borderRadius: "8px",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke={themeColor}
            viewBox="0 0 24 24"
            style={{ marginRight: "8px" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Invoice Holder
        </h3>
        <div style={{ fontSize: "14px" }}>
          <p style={{ fontWeight: "500", color: "#1F2937" }}>{customer_id.name}</p>
          <p style={{ color: "#4B5563" }}>{customer_id.email}</p>
          <p style={{ color: "#4B5563" }}>{customer_id.phone}</p>
          <p style={{ color: "#4B5563" }}>{customer_id.address}</p>
        </div>
      </div>

      <div
        style={{
          flex: "1",
          minWidth: "250px",
          padding: "16px",
          backgroundColor: "#F9FAFB",
          borderRadius: "8px",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke={themeColor}
            viewBox="0 0 24 24"
            style={{ marginRight: "8px" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
          Financial Summary
        </h3>
        <div style={{ fontSize: "14px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              color: "#4B5563",
            }}
          >
            <span>Outstanding Balance:</span>
            <span style={{ fontWeight: "500", color: "#1F2937" }}>
              ${total_amount}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#4B5563" }}>
            <span>Last Payment:</span>
            <span style={{ fontWeight: "500", color: themeColor }}>$0.00</span>
          </div>
        </div>
      </div>
    </div>

    {/* Transactions Table */}
    <div
      style={{
        marginBottom: "32px",
        overflow: "hidden",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          backgroundColor: "#F9FAFB",
          padding: "16px 24px",
          fontSize: "14px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        <div style={{ textAlign: "left" }}>Description</div>
        <div style={{ textAlign: "right" }}>Date</div>
        <div style={{ textAlign: "right" }}>Amount</div>
      </div>
      {products.map((product: { _id: Key | null | undefined; product_id: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; total_amount: number; }) => (
        <div
          key={product._id}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            padding: "16px 24px",
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <div style={{ fontSize: "14px", color: "#1F2937" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: themeColor,
                display: "inline-block",
                marginRight: "8px",
              }}
            ></span>
            {product.product_id.name}
          </div>
          <div style={{ textAlign: "right", fontSize: "14px", color: "#4B5563" }}>
            {new Date(issue_date).toLocaleDateString()}
          </div>
          <div
            style={{
              textAlign: "right",
              fontSize: "14px",
              fontWeight: "500",
              color: themeColor,
            }}
          >
            ${product.total_amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>

    {/* Total Section */}
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
      <div style={{ width: "100%", maxWidth: "384px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: lightThemeBg,
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
            Total Due:
          </span>
          <span style={{ fontSize: "24px", fontWeight: "bold", color: themeColor }}>
            ${total_amount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #E5E7EB" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "14px",
          color: "#6B7280",
          gap: "16px",
        }}
      >
        <div>
          <p>TrackInvo</p>
          <p>Rajkot, Gujarat, India</p>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <p>Phone: +91 7567145617</p>
          <p>
            Email:{" "}
            <a
              href="mailto:accounting@company.com"
              style={{ color: themeColor, textDecoration: "none" }}
            >
              maheshbhatiya@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
  );
}