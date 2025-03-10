import React from "react";

export default function ClassicQuotation({ quotationData, themeColor = "#87CEEB" }: any) { // Skyblue hex
  const { customer_id, issue_date, expiry_date, reference_number, products, total_amount, note } = quotationData;

  return (
    <div
      style={{
        maxWidth: "800px",
        padding: "20px",
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo Section */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: themeColor,
          }}
        >
          <span style={{ color: "#333333" }}>Track</span>
          <span style={{ color: themeColor }}>Invo</span>
        </h1>
        <p style={{ fontSize: "14px", color: "#666666" }}>
          Professional Quotation Management
        </p>
      </div>

      {/* Header Section */}
      <div
        style={{
          paddingBottom: "20px",
          marginBottom: "20px",
          borderBottom: `2px solid ${themeColor}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: themeColor,
                marginBottom: "5px",
              }}
            >
              QUOTATION
            </h1>
            <p style={{ fontSize: "14px", color: "#666666" }}>
              #{reference_number}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontWeight: "bold", fontSize: "14px" }}>Issued</p>
            <p style={{ color: "#666666", fontSize: "14px" }}>
              {new Date(issue_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Client Details */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: themeColor,
              textTransform: "uppercase",
              marginBottom: "5px",
            }}
          >
            Quoted To
          </h3>
          <p style={{ fontSize: "16px", fontWeight: "500" }}>{customer_id.name}</p>
          <p style={{ fontSize: "14px", color: "#666666" }}>{customer_id.email}</p>
          <p style={{ fontSize: "14px", color: "#666666" }}>{customer_id.phone}</p>
          <p style={{ fontSize: "14px", color: "#666666" }}>{customer_id.address}</p>
        </div>
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: themeColor,
              textTransform: "uppercase",
              marginBottom: "5px",
            }}
          >
            Quotation Details
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Expiry Date:</span>
            <span>{new Date(expiry_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            padding: "10px",
            backgroundColor: `${themeColor}33`, // Light transparent version of themeColor
            fontWeight: "bold",
            borderRadius: "5px 5px 0 0",
          }}
        >
          <div>Item</div>
          <div style={{ textAlign: "right" }}>Qty</div>
          <div style={{ textAlign: "right" }}>Unit Price</div>
          <div style={{ textAlign: "right" }}>Total</div>
        </div>
        {products.map((product: any) => (
          <div
            key={product._id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              padding: "10px",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <div>{product.product_id.name}</div>
            <div style={{ textAlign: "right" }}>{product.quantity}</div>
            <div style={{ textAlign: "right" }}>${product.unit_price.toFixed(2)}</div>
            <div style={{ textAlign: "right" }}>${product.total_amount.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: "250px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Subtotal:</span>
            <span>${total_amount.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <span style={{ fontWeight: "bold" }}>Discount:</span>
            <span>- ${quotationData.discount_amount.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "10px",
              borderTop: `2px solid ${themeColor}`,
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            <span>Total:</span>
            <span style={{ color: themeColor }}>${total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      {note && (
        <div style={{ marginTop: "20px", paddingTop: "10px", borderTop: "1px solid #e0e0e0" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>Notes</h3>
          <p style={{ fontSize: "14px", color: "#666666" }}>{note}</p>
        </div>
      )}

      {/* Footer Section */}
      <div
        style={{
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: `2px solid ${themeColor}`,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: themeColor,
            marginBottom: "10px",
          }}
        >
          Thank You for Your Consideration!
        </h2>
        <p style={{ fontSize: "14px", color: "#666666" }}>
          We appreciate your interest in TrackInvo. Please reach out if you have any questions.
        </p>
        <p style={{ fontSize: "12px", color: "#999999", marginTop: "5px" }}>
          Contact us: support@trackInvo.com | +1 (555) 123-4567
        </p>
      </div>
    </div>
  );
}