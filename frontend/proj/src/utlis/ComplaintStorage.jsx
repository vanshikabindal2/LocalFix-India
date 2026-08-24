


const API_URL = "https://local-fix-india-backend.vercel.app/api/complaints";

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