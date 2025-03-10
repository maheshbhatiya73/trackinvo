import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default function CompactQuotation({ quotationData, themeColor = "#6366f1" }: any) {
  const { customer_id, products, total_amount, issue_date, expiry_date, reference_number } = quotationData;

  // Format dates
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Header Section */}
      <header
        style={{
          marginBottom: "20px",
          borderBottom: `2px solid ${themeColor}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "15px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#1f2937",
              }}
            >
              QUOTATION
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginTop: "5px",
              }}
            >
              # {reference_number}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: themeColor,
              }}
            >
              TrackQuote
            </h2>
            <p style={{ fontSize: "14px", color: "#4b5563" }}>
              123 Business Street
            </p>
            <p style={{ fontSize: "14px", color: "#4b5563" }}>
              New York, NY 10001
            </p>
          </div>
        </div>

        {/* Client & Info Grid */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
            fontSize: "14px",
          }}
        >
          <div>
            <h3
              style={{
                fontWeight: "600",
                color: "#374151",
                marginBottom: "5px",
              }}
            >
              QUOTED TO
            </h3>
            <p style={{ color: "#4b5563" }}>{customer_id.name}</p>
            <p style={{ color: "#4b5563" }}>{customer_id.email}</p>
            <p style={{ color: "#4b5563" }}>{customer_id.phone}</p>
            <p style={{ color: "#4b5563" }}>{customer_id.address}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span style={{ fontWeight: "500", color: "#374151" }}>
                Issue Date:
              </span>
              <span style={{ color: "#4b5563" }}>{formatDate(issue_date)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: "500", color: "#374151" }}>
                Expiry Date:
              </span>
              <span style={{ color: "#4b5563" }}>{formatDate(expiry_date)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Items Table */}
      <div style={{ width: "100%", marginBottom: "20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            backgroundColor: `${themeColor}33`, // Light transparent version
            padding: "10px",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          <div>Description</div>
          <div style={{ textAlign: "right" }}>Qty</div>
          <div style={{ textAlign: "right" }}>Price</div>
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
            unit_price:
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
            total_amount:
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
          }) => (
            <div
              key={product._id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                padding: "10px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div style={{ color: "#374151" }}>{product.product_id.name}</div>
              <div style={{ textAlign: "right", color: "#4b5563" }}>
                {product.quantity}
              </div>
              <div style={{ textAlign: "right", color: "#4b5563" }}>
                ${Number(product.unit_price).toFixed(2)}
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                ${Number(product.total_amount).toFixed(2)}
              </div>
            </div>
          )
        )}
      </div>

      {/* Total Section */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: "200px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <span style={{ fontWeight: "600" }}>Subtotal:</span>
            <span>${Number(total_amount).toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontWeight: "600" }}>Discount:</span>
            <span>-${Number(quotationData.discount_amount).toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: `${themeColor}33`,
              fontWeight: "bold",
              fontSize: "18px",
              color: themeColor,
            }}
          >
            <span>Total:</span>
            <span>${Number(total_amount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "20px",
          paddingTop: "15px",
          borderTop: "1px solid #e5e7eb",
          textAlign: "center",
          fontSize: "12px",
          color: "#6b7280",
        }}
      >
        <p>Thank you for considering TrackQuote!</p>
        <p style={{ marginTop: "5px" }}>Valid until the expiry date</p>
      </footer>
    </div>
  );
}