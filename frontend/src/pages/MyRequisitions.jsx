import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getMyRequisitions } from "../services/requisitionService";

const MyRequisitions = () => {
  const { user } = useAuth();

  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyRequisitions = async () => {
    try {
      setLoading(true);

      const res = await getMyRequisitions();

      setRequisitions(res.data.requisitions || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "HOD") {
      fetchMyRequisitions();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <h1>My Requisitions</h1>

      {loading && <p>Loading...</p>}

      {requisitions.map((req) => (
        <div
          key={req._id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px"
          }}
        >
          <h3>{req.requisitionId}</h3>
          <p>Status: {req.status}</p>
          <p>Priority: {req.priority}</p>
          <p>Total: {req.totalAmount}</p>
          <p>Items: {req.items.length}</p>
        </div>
      ))}
    </DashboardLayout>
  );
};

export default MyRequisitions;