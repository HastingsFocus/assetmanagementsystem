import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { getMyTransferRequests } from "../services/assetService";

const MyTransferRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    /*
    ==========================================
    LOAD MY REQUESTS
    ==========================================
    */
    const loadRequests = async () => {
        try {
            const response = await getMyTransferRequests();
            setRequests(response.requests || []);
        } catch (error) {
            console.log("Failed loading requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    /*
    ==========================================
    STATUS COLOR
    ==========================================
    */
    const getStatusColor = (status) => {
        switch (status) {
            case "APPROVED":
                return "green";
            case "REJECTED":
                return "red";
            case "PENDING":
                return "orange";
            default:
                return "gray";
        }
    };

    return (
        <DashboardLayout>
            <h1>My Asset Transfer Requests</h1>
            <p style={{ color: "#666" }}>
                Track the status of your requested asset transfers.
            </p>

            {loading ? (
                <p>Loading requests...</p>
            ) : requests.length === 0 ? (
                <p>You have no transfer requests.</p>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                    gap: "20px",
                    marginTop: "20px"
                }}>
                    {requests.map((request) => (
                        <div key={request._id} style={card}>
                            <h3>{request.asset?.assetName}</h3>
                            <p>
                                <strong>Asset Tag:</strong>{" "}
                                {request.asset?.assetTag}
                            </p>
                            <p>
                                <strong>From:</strong>{" "}
                                {request.fromDepartment?.name || "Unknown"}
                            </p>
                            <p>
                                <strong>To:</strong>{" "}
                                {request.toDepartment?.name || "Unknown"}
                            </p>
                            <div style={infoBox}>
                                <strong>Reason:</strong>
                                <p>{request.reason}</p>
                            </div>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span style={{
                                    color: getStatusColor(request.status),
                                    fontWeight: "bold"
                                }}>
                                    {request.status}
                                </span>
                            </p>
                            {request.status === "REJECTED" && (
                                <div style={rejectBox}>
                                    <strong>Rejection Reason:</strong>
                                    <p>{request.rejectionReason || "No reason provided"}</p>
                                </div>
                            )}
                            <p style={{
                                fontSize: "13px",
                                color: "#777"
                            }}>
                                Requested:{" "}
                                {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

const card = {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    background: "#fff",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
};

const infoBox = {
    background: "#f8f9fa",
    padding: "12px",
    borderRadius: "8px",
    margin: "15px 0"
};

const rejectBox = {
    background: "#ffe6e6",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "15px"
};

export default MyTransferRequests;