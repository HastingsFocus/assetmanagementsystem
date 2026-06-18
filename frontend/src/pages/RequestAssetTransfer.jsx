import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getDepartmentAssets } from "../services/assetService";
import { createTransferRequest } from "../services/assetService";
import { getDepartments } from "../services/departmentService";

const RequestAssetTransfer = () => {
    const { user } = useAuth();
    const [assets, setAssets] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState("");
    const [toDepartment, setToDepartment] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    /*
    ==========================================
    LOAD HOD ASSETS
    ==========================================
    */
    const loadAssets = async () => {
    try {
      const response = await getDepartmentAssets(user.department._id);
setAssets(response);
    } catch (error) {
        console.log("Failed loading assets", error);
    }
};

    /*
    ==========================================
    LOAD DEPARTMENTS
    ==========================================
    */
    const loadDepartments = async () => {
        try {
            const response = await getDepartments();
            setDepartments(response.departments || []);
        } catch (error) {
            console.log("Failed loading departments", error);
        }
    };

    useEffect(() => {
        if (user?.department) {
            loadAssets();
            loadDepartments();
        }
    }, [user]);

    /*
    ==========================================
    SUBMIT REQUEST
    ==========================================
    */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAsset || !toDepartment || !reason) {
            return alert("Please fill all fields");
        }

        try {
            setLoading(true);
            await createTransferRequest({
    assetId: selectedAsset,
    toDepartment,
    reason
});
            alert("Transfer request submitted successfully");
            setSelectedAsset("");
            setToDepartment("");
            setReason("");
        } catch (error) {
            console.log(error);
            alert(error?.response?.data?.message || "Failed submitting request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: "700px" }}>
                <h1>Request Asset Transfer</h1>
                <p style={{ color: "#666" }}>
                    Request assets to be moved from your department to another department.
                </p>

                <div style={{
                    background: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "10px",
                    marginBottom: "20px"
                }}>
                    <strong>Your Department:</strong>
                    <p>{user?.department?.name}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={formGroup}>
                        <label>Select Asset</label>
                        <select
                            value={selectedAsset}
                            onChange={e => setSelectedAsset(e.target.value)}
                            style={input}
                            required
                        >
                            <option value="">Select asset</option>
                            {assets.map(asset => (
                                <option key={asset._id} value={asset._id}>
                                    {asset.assetName} - {asset.assetTag}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={formGroup}>
                        <label>Transfer To</label>
                        <select
                            value={toDepartment}
                            onChange={e => setToDepartment(e.target.value)}
                            style={input}
                            required
                        >
                            <option value="">Select department</option>
                            {departments
                                .filter(dept => dept._id !== user.department._id)
                                .map(dept => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div style={formGroup}>
                        <label>Reason</label>
                        <textarea
                            rows="4"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            style={input}
                            placeholder="Why should this asset be transferred?"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={button}
                    >
                        {loading ? "Submitting..." : "Request Transfer"}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

const formGroup = {
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column"
};

const input = {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginTop: "8px"
};

const button = {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
};

export default RequestAssetTransfer;