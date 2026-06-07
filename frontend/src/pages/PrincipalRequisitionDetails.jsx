import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import API from "../services/api";

const PrincipalRequisitionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [requisition, setRequisition] = useState(null);
  const [loading, setLoading] = useState(false);

  /*
  =========================================
  FETCH SINGLE REQUISITION
  =========================================
  */

  const fetchRequisition = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/requisitions/${id}`);

      setRequisition(res.data.requisition);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisition();
  }, [id]);

  /*
  =========================================
  HANDLE ITEM UPDATE (APPROVE / REJECT)
  =========================================
  */

  const handleItemChange = (index, field, value) => {
    const updated = { ...requisition };
    updated.items[index][field] = value;
    setRequisition(updated);
  };

  /*
  =========================================
  SUBMIT REVIEW
  =========================================
  */

  const handleSubmit = async () => {
    try {
      await API.put(`/requisitions/${id}/review`, {
        items: requisition.items,
        principalComment: requisition.principalComment || ""
      });

      alert("Requisition reviewed successfully");

      navigate("/principal/requisitions");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading || !requisition) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1>Requisition Details</h1>

      <h3>{requisition.requisitionId}</h3>

      <p><b>Department:</b> {requisition.department}</p>
      <p><b>Status:</b> {requisition.status}</p>
      <p><b>Total:</b> {requisition.totalAmount}</p>

      <hr />

      <h3>Items Review</h3>

      {requisition.items.map((item, index) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <p><b>Name:</b> {item.name}</p>
          <p><b>Quantity:</b> {item.quantity}</p>
          <p><b>Unit Price:</b> {item.unitPrice}</p>

          <label>Approved Quantity</label>
          <input
            type="number"
            value={item.approvedQuantity || 0}
            onChange={(e) =>
              handleItemChange(
                index,
                "approvedQuantity",
                Number(e.target.value)
              )
            }
          />

          <br /><br />

          <label>Status</label>
          <select
            value={item.status || "PENDING"}
            onChange={(e) =>
              handleItemChange(index, "status", e.target.value)
            }
          >
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>

          <br /><br />

          <label>Comment</label>
          <input
            type="text"
            value={item.adminComment || ""}
            onChange={(e) =>
              handleItemChange(index, "adminComment", e.target.value)
            }
          />
        </div>
      ))}

      <hr />

      <h3>Principal Comment</h3>

      <textarea
        rows="4"
        style={{ width: "100%" }}
        value={requisition.principalComment || ""}
        onChange={(e) =>
          setRequisition({
            ...requisition,
            principalComment: e.target.value
          })
        }
      />

      <br /><br />

      <button onClick={handleSubmit}>
        Submit Review
      </button>
    </DashboardLayout>
  );
};

export default PrincipalRequisitionDetails;