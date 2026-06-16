import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";

import {
  getConditionRequests,
  approveConditionRequest,
  rejectConditionRequest,
} from "../services/assetService";


const ConditionRequests = () => {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);


  const loadRequests = async () => {
    try {
      const response = await getConditionRequests();

      setRequests(response.requests || []);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadRequests();
  }, []);



  const approve = async (id) => {
    try {

      await approveConditionRequest(id);

      alert("Request approved successfully");

      loadRequests();

    } catch (error) {
      console.log(error);
    }
  };



  const reject = async (id) => {

    const reason = prompt("Enter rejection reason");

    if (!reason) return;


    try {

      await rejectConditionRequest(id, {
        rejectionReason: reason,
      });


      alert("Request rejected");

      loadRequests();


    } catch (error) {
      console.log(error);
    }

  };



  return (
    <DashboardLayout>

      <div style={container}>

        <h2>🔄 Asset Condition Requests</h2>


        {loading ? (

          <p>Loading requests...</p>


        ) : requests.length === 0 ? (

          <div style={card}>
            No condition requests found
          </div>


        ) : (

          <div style={card}>

            <table style={table}>

              <thead>

                <tr>

                  <th style={header}>Asset</th>
                  <th style={header}>Current</th>
                  <th style={header}>Requested</th>
                  <th style={header}>Reason</th>
                  <th style={header}>Requested By</th>
                  <th style={header}>Status</th>
                  <th style={header}>Action</th>

                </tr>

              </thead>


              <tbody>

                {requests.map((request) => (

                  <tr key={request._id}>


                    <td style={cell}>
                      {request.asset?.assetName}
                      <br />
                      {request.asset?.assetTag}
                    </td>


                    <td style={cell}>
                      {request.currentCondition}
                    </td>


                    <td style={cell}>
                      {request.requestedCondition}
                    </td>


                    <td style={cell}>
                      {request.reason}
                    </td>


                    <td style={cell}>
                      {request.requestedBy?.name}
                    </td>


                    <td style={cell}>
                      {request.status}
                    </td>


                    <td style={cell}>

                      {request.status === "PENDING" && (

                        <>

                          <button
                            style={approveBtn}
                            onClick={() => approve(request._id)}
                          >
                            Approve
                          </button>


                          <button
                            style={rejectBtn}
                            onClick={() => reject(request._id)}
                          >
                            Reject
                          </button>

                        </>

                      )}

                    </td>


                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
};



const container = {
  padding: "24px",
};


const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};


const table = {
  width: "100%",
  borderCollapse: "collapse",
};


const header = {
  padding: "12px",
  border: "1px solid #ddd",
  background: "#f5f5f5",
};


const cell = {
  padding: "10px",
  border: "1px solid #ddd",
};


const approveBtn = {
  background: "green",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "10px",
};


const rejectBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "5px",
  cursor: "pointer",
};


export default ConditionRequests;