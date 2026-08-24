import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

export const createComplaint = async (complaintData) => {
  const response = await API.post("/complaints", complaintData);
  return response.data;
};

export const getComplaints = async () => {
  const response = await API.get("/complaints");
  return response.data;
};

export const getComplaintById = async (id) => {
  const response = await API.get(`/complaints/${id}`);
  return response.data;
};

export const updateComplaintStatus = async (id, status) => {
  const response = await API.put(
    `/complaints/${id}/status`,
    { status }
  );

  return response.data;
};

export const deleteComplaint = async (id) => {
  const response = await API.delete(`/complaints/${id}`);
  return response.data;
};