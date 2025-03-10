"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { motion } from "framer-motion";

export default function ModernQuotation({ quotationData, themeColor = "#6366f1" }: any) {
  const { customer_id, issue_date, expiry_date, products, total_amount, reference_number, discount_type, discount_amount, note } = quotationData;

  // Dynamic styles based on themeColor
  const lightThemeBg = `${themeColor}10`; // 10% opacity for subtle backgrounds
  const headerGradient = `linear-gradient(to right, ${themeColor}, #9333ea)`; // Gradient with themeColor

  // Determine quotation status
  const isExpired = new Date(expiry_date) < new Date();
  const statusText = isExpired ? "Expired" : "Active";
  const statusBg = isExpired ? "#FEE2E2" : "#D1FAE5";
  const statusDotColor = isExpired ? "#DC2626" : "#10B981";

  return (
    <div
      style={{
        maxWidth: "900px",
        padding: "32px",
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "32px", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "12px",
            opacity: "0.1",
            background: headerGradient,
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                backgroundImage: headerGradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              QUOTATION
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>
              #{reference_number}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "8px",
                backgroundColor: themeColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="48"
                height="48"
                fill="none"
                stroke="#FFFFFF"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Grid */}
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
            minWidth: "200px",
            padding: "16px",
            backgroundColor: "#F9FAFB",
            borderRadius: "8px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#6B7280",
              marginBottom: "4px",
            }}
          >
            ISSUE DATE
          </p>
          <p style={{ fontWeight: "500" }}>{new Date(issue_date).toLocaleDateString()}</p>
        </div>
        <div
          style={{
            flex: "1",
            minWidth: "200px",
            padding: "16px",
            backgroundColor: "#F9FAFB",
            borderRadius: "8px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#6B7280",
              marginBottom: "4px",
            }}
          >
            EXPIRY DATE
          </p>
          <p style={{ fontWeight: "500" }}>{new Date(expiry_date).toLocaleDateString()}</p>
        </div>
        <div
          style={{
            flex: "1",
            minWidth: "200px",
            padding: "16px",
            backgroundColor: "#F9FAFB",
            borderRadius: "8px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#6B7280",
              marginBottom: "4px",
            }}
          >
            STATUS
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 12px",
              borderRadius: "9999px",
              backgroundColor: statusBg,
              color: isExpired ? "#DC2626" : "#047857",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: statusDotColor,
                borderRadius: "50%",
                marginRight: "8px",
              }}
            ></span>
            {statusText}
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "32px",
          marginBottom: "48px",
        }}
      >
        <div style={{ flex: "1", minWidth: "250px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "16px",
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
            Quoted To
          </h3>
          <div style={{ fontSize: "14px" }}>
            <p style={{ fontWeight: "500" }}>{customer_id.name}</p>
            <p style={{ color: "#4B5563" }}>{customer_id.email}</p>
            {customer_id.phone && (
              <p style={{ color: "#4B5563" }}>{customer_id.phone}</p>
            )}
            {customer_id.address && (
              <p style={{ color: "#4B5563" }}>{customer_id.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div
        style={{
          marginBottom: "32px",
          overflow: "hidden",
          borderRadius: "12px",
          border: "1px solid #F3F4F6",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "16px",
            backgroundColor: "#F9FAFB",
            padding: "16px 24px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          <div>Item</div>
          <div style={{ textAlign: "right" }}>Qty</div>
          <div style={{ textAlign: "right" }}>Unit Price</div>
          <div style={{ textAlign: "right" }}>Total</div>
        </div>
        {products.map(
          (product: {
            _id: Key | null | undefined;
            product_id: {
              name:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined;
            };
            quantity:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactPortal
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | null
                  | undefined
                >
              | null
              | undefined;
            unit_price: number;
            total_amount: number;
          }) => (
            <div
              key={product._id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: "16px",
                padding: "16px 24px",
                borderBottom: "1px solid #F3F4F6",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: themeColor,
                    marginRight: "12px",
                  }}
                ></span>
                {product.product_id.name}
              </div>
              <div style={{ textAlign: "right" }}>{product.quantity}</div>
              <div style={{ textAlign: "right" }}>${product.unit_price.toFixed(2)}</div>
              <div style={{ textAlign: "right", fontWeight: "500" }}>
                ${product.total_amount.toFixed(2)}
              </div>
            </div>
          )
        )}
      </div>

      {/* Total Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          marginBottom: "32px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "384px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#4B5563",
              marginBottom: "16px",
            }}
          >
            <span>Subtotal:</span>
            <span>${(total_amount + discount_amount).toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#4B5563",
              marginBottom: "16px",
            }}
          >
            <span>Discount ({discount_type}):</span>
            <span>- ${discount_amount.toFixed(2)}</span>
          </div>
          <div style={{ paddingTop: "16px", borderTop: "1px solid #E5E7EB" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              <span>Total:</span>
              <span style={{ color: themeColor }}>${total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {note && (
        <div
          style={{
            marginTop: "48px",
            paddingTop: "32px",
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "12px",
            }}
          >
            Notes
          </h3>
          <p style={{ color: "#4B5563", fontSize: "14px" }}>{note}</p>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid #E5E7EB" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
              Thank you for your consideration!
            </p>
            <p style={{ fontSize: "12px", color: "#6B7280" }}>
              Quotation generated by TrackQuote Pro
            </p>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <a href="#" style={{ color: "#9CA3AF" }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="#" style={{ color: "#9CA3AF" }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}