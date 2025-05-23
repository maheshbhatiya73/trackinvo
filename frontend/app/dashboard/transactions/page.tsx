import React from "react";

export default function TransactionList() {
  // Sample JSON data (replace with your actual data source)
  const transactions = [
    {
      _id: "67cc860504bfb008e4eeb756",
      description: "Jemima Bender",
      quantity: 2,
      unit_price: 663,
      total_amount: 1326,
      date: "2025-03-08",
    },
    {
      _id: "67cc860504bfb008e4eeb757",
      description: "Premium Service Plan",
      quantity: 1,
      unit_price: 1500,
      total_amount: 1500,
      date: "2025-03-09",
    },
    {
      _id: "67cc860504bfb008e4eeb758",
      description: "Consulting Fee",
      quantity: 3,
      unit_price: 200,
      total_amount: 600,
      date: "2025-03-10",
    },
  ];

  const themeColor = "#6366f1"; // Default indigo theme color
  const lightThemeBg = `${themeColor}10`; // 10% opacity for subtle backgrounds

  return (
    <div
      style={{
        margin: "0 auto",
        padding: "32px",
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "32px",
          paddingBottom: "16px",
          borderBottom: `1px solid ${themeColor}33`,
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#1F2937",
            backgroundImage: `linear-gradient(to right, ${themeColor}, #9333ea)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          Transaction List
        </h1>
      </div>

      {/* Transactions Table */}
      <div
        style={{
          overflow: "hidden",
          borderRadius: "8px",
          border: "1px solid #E5E7EB",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            backgroundColor: lightThemeBg,
            padding: "16px 24px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          <div style={{ textAlign: "left" }}>Description</div>
          <div style={{ textAlign: "right" }}>Quantity</div>
          <div style={{ textAlign: "right" }}>Unit Price</div>
          <div style={{ textAlign: "right" }}>Total Amount</div>
          <div style={{ textAlign: "right" }}>Date</div>
        </div>
        {transactions.map((transaction) => (
          <div
            key={transaction._id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              padding: "16px 24px",
              borderTop: "1px solid #E5E7EB",
              backgroundColor: "#FFFFFF",
              transition: "background-color 0.2s ease",
              
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#1F2937",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: themeColor,
                  marginRight: "12px",
                }}
              ></span>
              {transaction.description}
            </div>
            <div style={{ textAlign: "right", fontSize: "14px", color: "#4B5563" }}>
              {transaction.quantity}
            </div>
            <div style={{ textAlign: "right", fontSize: "14px", color: "#4B5563" }}>
              ${transaction.unit_price.toFixed(2)}
            </div>
            <div
              style={{
                textAlign: "right",
                fontSize: "14px",
                fontWeight: "500",
                color: themeColor,
              }}
            >
              ${transaction.total_amount.toFixed(2)}
            </div>
            <div style={{ textAlign: "right", fontSize: "14px", color: "#4B5563" }}>
              {transaction.date}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "32px",
          paddingTop: "16px",
          borderTop: "1px solid #E5E7EB",
          textAlign: "center",
          fontSize: "12px",
          color: "#6B7280",
        }}
      >
        <p>Generated by Trackinvo | Total Transactions: {transactions.length}</p>
      </div>
    </div>
  );
}