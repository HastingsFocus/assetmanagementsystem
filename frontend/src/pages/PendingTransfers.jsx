import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";

import {
    getPendingTransferRequests,
    approveTransferRequest,
    rejectTransferRequest
} from "../services/assetService";

const PendingTransfers = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    /*
    ==========================================
    LOAD REQUESTS
    ==========================================
    */
    const loadRequests = async () => {
        try {
            const response = await getPendingTransferRequests();
            setRequests(response.requests || []);
        } catch (error) {
            console.log("Failed loading transfers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    /*
    ==========================================
    APPROVE TRANSFER
    ==========================================
    */
    const handleApprove = async (id) => {
        const confirm = window.confirm("Approve this asset transfer?");
        if (!confirm) return;

        try {
            await approveTransferRequest(id);
            alert("Asset transferred successfully");
            loadRequests();
        } catch (error) {
            console.log(error);
            alert(error?.response?.data?.message || "Failed approving transfer");
        }
    };

    /*
    ==========================================
    REJECT TRANSFER
    ==========================================
    */
    const handleReject = async (id) => {
        const reason = window.prompt("Enter rejection reason");
        if (!reason) return;

        try {
            await rejectTransferRequest(id, { rejectionReason: reason });
            alert("Transfer rejected");
            loadRequests();
        } catch (error) {
            console.log(error);
            alert(error?.response?.data?.message || "Failed rejecting request");
        }
    };

    return (
        <DashboardLayout>
            <h1>Pending Asset Transfers</h1>
            <p style={{ color: "#666" }}>
                Review and approve asset movement requests.
            </p>

            {loading ? (
                <p>Loading requests...</p>
            ) : requests.length === 0 ? (
                <p>No pending transfers.</p>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                    gap: "20px"
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
                            <p>
                                <strong>Requested By:</strong>{" "}
                                {request.requestedBy?.name || "Unknown"}
                            </p>
                            <div style={reasonBox}>
                                <strong>Reason</strong>
                                <p>{request.reason}</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleApprove(request._id)}
                                    style={approveBtn}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(request._id)}
                                    style={rejectBtn}
                                >
                                    Reject
                                </button>
                            </div>
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

const reasonBox = {
    background: "#f8f9fa",
    padding: "12px",
    borderRadius: "8px",
    margin: "15px 0"
};

const approveBtn = {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
    fontWeight: "bold"
};

const rejectBtn = {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
};

export default PendingTransfers;