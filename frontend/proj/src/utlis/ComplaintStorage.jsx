
// const STORAGE_KEY = "localfix_complaints";
// export const getComplaints = () => {
//   const data =localStorage.getItem(STORAGE_KEY);
//   return data ? JSON.parse(data): [];
// };

// export const saveComplaint = (complaint) => {
//   const complaints = getComplaints();
//   complaints.push(complaint);
//   localStorage.setItem(
//     STORAGE_KEY,
//     JSON.stringify(complaints)
//   );
// };


// export const getComplaintById = (id) => {
//   const complaints = getComplaints();
//   return complaints.find(
//     (complaint) =>
//       String(complaint.id) === String(id)
//   );
// };

// // update status

// export const updateComplaintStatus=(id,newStatus)=>{
//   const complaints=getComplaints();
//   const updateComplaints=complaints.map((complaint)=>{
//     if(String(complaint.id)===String(id)){
//       return{
//         ...complaint,status:newStatus,
//       };
//     };
//       return complaint;
//     }
//   );
//   localStorage.setItem(STORAGE_KEY,JSON.stringify(updateComplaints));
// return updateComplaints;
 


// };


const API_URL = "http://localhost:5001/api/complaints";

// ==========================================
// GET ALL COMPLAINTS
// ==========================================

export const getComplaints = async () => {
  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch complaints");
    }

    return data.complaints || [];
  } catch (error) {
    console.error("Get Complaints Error:", error);
    return [];
  }
};


// ==========================================
// CREATE COMPLAINT
// ==========================================

export const createComplaint = async (complaint) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(complaint),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create complaint");
    }

    return data;
  } catch (error) {
    console.error("Create Complaint Error:", error);
    throw error;
  }
};


// ==========================================
// GET COMPLAINT BY ID
// ==========================================

export const getComplaintById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Complaint not found");
    }

    return data.complaint;
  } catch (error) {
    console.error("Get Complaint By ID Error:", error);
    return null;
  }
};


// ==========================================
// UPDATE COMPLAINT STATUS
// ==========================================

export const updateComplaintStatus = async (id, newStatus) => {
  try {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status: newStatus,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update status");
    }

    return data.complaint;
  } catch (error) {
    console.error("Update Complaint Status Error:", error);
    throw error;
  }
};


// ==========================================
// DELETE COMPLAINT
// ==========================================

export const deleteComplaint = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete complaint");
    }

    return data;
  } catch (error) {
    console.error("Delete Complaint Error:", error);
    throw error;
  }
};