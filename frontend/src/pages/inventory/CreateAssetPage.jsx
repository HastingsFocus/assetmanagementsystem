import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { createManualAssets } from "../../services/assetService";
import { getDepartments } from "../../services/departmentService";

const CreateAssetPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        assetName: "",
        category: "",
        quantity: 1,
        department: "",
        source: "donation",
        purchasePrice: 0,
        brand: "",
        model: "",
        remarks: "",
    });

    /*
    ==========================================
    LOAD DEPARTMENTS
    ==========================================
    */
    const loadDepartments = async () => {
        try {
            const data = await getDepartments();
            setDepartments(data.departments || []);
        } catch (error) {
            console.error("Failed loading departments", error);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    /*
    ==========================================
    HANDLE INPUT CHANGE
    ==========================================
    */
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    /*
    ==========================================
    SUBMIT FORM
    ==========================================
    */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await createManualAssets(formData);
            alert(response.message || "Assets created successfully");
            setFormData({
                assetName: "",
                category: "",
                quantity: 1,
                department: "",
                source: "donation",
                purchasePrice: 0,
                brand: "",
                model: "",
                remarks: "",
            });
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to create assets");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div style={{
                padding: "24px",
                maxWidth: "800px",
            }}>
                <h2>➕ Create Assets</h2>
                <p style={{
                    color: "#666",
                    marginBottom: "25px",
                }}>
                    Add assets obtained through donations, purchases, transfers, or other sources.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={formGroup}>
                        <label>Asset Name</label>
                        <input
                            type="text"
                            name="assetName"
                            value={formData.assetName}
                            onChange={handleChange}
                            required
                            style={input}
                            placeholder="Lenovo Laptop"
                        />
                    </div>

                    <div style={formGroup}>
                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            style={input}
                            placeholder="Computer"
                        />
                    </div>

                    <div style={formGroup}>
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                            required
                            style={input}
                        />
                    </div>

                    <div style={formGroup}>
                        <label>Department</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            style={input}
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept.code}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={formGroup}>
                        <label>Source</label>
                        <select
                            name="source"
                            value={formData.source}
                            onChange={handleChange}
                            required
                            style={input}
                        >
                            <option value="donation">Donation</option>
                            <option value="purchase">Purchase</option>
                            <option value="transfer">Transfer</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div style={formGroup}>
                        <label>Purchase Price</label>
                        <input
                            type="number"
                            name="purchasePrice"
                            value={formData.purchasePrice}
                            onChange={handleChange}
                            style={input}
                        />
                    </div>

                    <div style={formGroup}>
                        <label>Brand</label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            style={input}
                            placeholder="Lenovo"
                        />
                    </div>

                    <div style={formGroup}>
                        <label>Model</label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            style={input}
                            placeholder="ThinkPad T14"
                        />
                    </div>

                    <div style={formGroup}>
                        <label>Remarks</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            rows="4"
                            style={{
                                ...input,
                                resize: "vertical"
                            }}
                            placeholder="Additional notes..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={submitButton}
                    >
                        {loading ? "Creating Assets..." : "Create Assets"}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

const formGroup = {
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column",
};

const input = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginTop: "6px",
};

const submitButton = {
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
};

export default CreateAssetPage;