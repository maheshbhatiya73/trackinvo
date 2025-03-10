"use client";

import { motion } from "framer-motion";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { BsCalendar, BsPerson, BsTag } from "react-icons/bs";

export default function ComprehensiveInvoice({ invoiceData, themeColor = "#6366f1" }: any) {
  const {
    customer_id,
    issue_date,
    due_date,
    reference_number,
    recurring,
    products,
    discount_type,
    discount_amount,
    note,
    total_amount,
    created_at,
    updated_at,
    cycle,
  } = invoiceData;

  // Dynamic styles
  const lightThemeBg = `${themeColor}10`; // 10% opacity for backgrounds
  const headerGradient = `linear-gradient(to right, ${themeColor}, #9333ea)`; // Gradient for header

  return (
    <div
    style={{
      maxWidth: "900px",
      margin: "0 auto",
      padding: "24px",
      backgroundColor: "#FFFFFF",
      borderRadius: "16px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    }}
  >
    {/* Header Section */}
    <div
      style={{
        marginBottom: "32px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        background: "linear-gradient(to right, #FFFFFF, #F9FAFB)",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
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
          INVOICE
        </h1>
        <div style={{ marginTop: "8px", fontSize: "14px", color: "#4B5563" }}>
          <p>System ID: {invoiceData._id}</p>
          <p>Created: {new Date(created_at).toLocaleDateString()}</p>
          <p>Last Updated: {new Date(updated_at).toLocaleDateString()}</p>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        {recurring && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 12px",
              borderRadius: "9999px",
              backgroundColor: "#D1FAE5",
              color: "#047857",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            <span style={{ marginRight: "8px" }}>🔄</span>
            Recurring ({cycle})
          </div>
        )}
        <p
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1F2937",
          }}
        >
          Ref: {reference_number}
        </p>
      </div>
    </div>

    {/* Customer & Dates Section */}
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        marginBottom: "32px",
        padding: "16px",
        backgroundColor: "#F9FAFB",
        borderRadius: "8px",
      }}
    >
      <div style={{ flex: "1", minWidth: "200px" }}>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "8px", color: themeColor }}>👤</span> Bill To
        </h3>
        <div style={{ marginTop: "8px", fontSize: "14px" }}>
          <p style={{ fontWeight: "500", color: "#1F2937" }}>{customer_id.name}</p>
          <p style={{ color: "#4B5563" }}>{customer_id.email}</p>
          <p style={{ color: "#4B5563" }}>{customer_id.phone}</p>
          <p style={{ color: "#4B5563" }}>{customer_id.address}</p>
          {customer_id.deleted && (
            <span
              style={{
                display: "inline-block",
                marginTop: "8px",
                padding: "2px 8px",
                fontSize: "12px",
                color: "#DC2626",
                backgroundColor: "#FEE2E2",
                borderRadius: "4px",
              }}
            >
              Archived Customer
            </span>
          )}
        </div>
      </div>

      <div style={{ flex: "1", minWidth: "200px" }}>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "8px", color: themeColor }}>📅</span> Dates
        </h3>
        <div style={{ marginTop: "8px", fontSize: "14px", color: "#4B5563" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Issued:</span>
            <span>{new Date(issue_date).toLocaleDateString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <span>Due:</span>
            <span>{new Date(due_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div style={{ flex: "1", minWidth: "200px" }}>
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "8px", color: themeColor }}>🏷️</span> Status
        </h3>
        <div style={{ marginTop: "8px", fontSize: "14px", color: "#4B5563" }}>
          <p>Pending Payment</p>
          <div
            style={{
              marginTop: "8px",
              height: "8px",
              width: "100%",
              backgroundColor: "#E5E7EB",
              borderRadius: "9999px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "50%",
                backgroundColor: themeColor,
                borderRadius: "9999px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>

    {/* Enhanced Products Table */}
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
          padding: "16px",
          fontSize: "14px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        <div style={{ textAlign: "left" }}>Product Details</div>
        <div style={{ textAlign: "right" }}>Meta</div>
        <div style={{ textAlign: "right" }}>Pricing</div>
      </div>
      {products.map((product: { _id: Key | null | undefined; product_id: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; deleted: any; created_at: string | number | Date; updated_at: string | number | Date; }; quantity: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; unit_price: number; total_amount: number; }) => (
        <div
          key={product._id}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            padding: "16px",
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <div>
            <p style={{ fontWeight: "500", color: "#1F2937" }}>
              {product.product_id.name}
            </p>
          </div>
          <div style={{ textAlign: "right", color: "#4B5563" }}>
            <p>Qty: {product.quantity}</p>
            <p>Base: ${product.unit_price.toFixed(2)}</p>
            {product.product_id.deleted && (
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  fontSize: "12px",
                  color: "#DC2626",
                  backgroundColor: "#FEE2E2",
                  borderRadius: "4px",
                }}
              >
                Discontinued
              </span>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontWeight: "500", color: themeColor }}>
              ${product.total_amount.toFixed(2)}
            </p>
            <p style={{ fontSize: "12px", color: "#6B7280" }}>
              Created: {new Date(product.product_id.created_at).toLocaleDateString()}
            </p>
            <p style={{ fontSize: "12px", color: "#6B7280" }}>
              Updated: {new Date(product.product_id.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Financial Summary */}
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        marginBottom: "32px",
      }}
    >
      <div style={{ flex: "1", padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
          Notes
        </h3>
        <p style={{ fontSize: "14px", color: "#4B5563", whiteSpace: "pre-wrap" }}>
          {note || "No additional notes."}
        </p>
      </div>
      <div
        style={{
          flex: "1",
          padding: "16px",
          backgroundColor: lightThemeBg,
          borderRadius: "8px",
        }}
      >
        <div style={{ fontSize: "14px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#4B5563",
              marginBottom: "12px",
            }}
          >
            <span>Subtotal:</span>
            <span>${(total_amount + discount_amount).toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <span>Discount ({discount_type}):</span>
            <span style={{ color: "#DC2626" }}>- ${discount_amount.toFixed(2)}</span>
          </div>
          <div
            style={{
              paddingTop: "12px",
              borderTop: "1px solid #E5E7EB",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              <span>Total Due:</span>
              <span style={{ color: themeColor }}>${total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div
      style={{
        marginTop: "32px",
        paddingTop: "24px",
        borderTop: "1px solid #E5E7EB",
        textAlign: "center",
        fontSize: "14px",
        color: "#6B7280",
      }}
    >
      <p>Thank you for TrackInvo!</p>
      <p style={{ marginTop: "4px" }}>
        Generated by TrackInvo | Contact: maheshbhatiya302@gmail.com
      </p>
    </div>
  </div>
  );
}