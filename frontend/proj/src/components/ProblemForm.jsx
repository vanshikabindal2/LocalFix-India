import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import problemCategories from "../data/problemCategories";
import { getDepartmentByCategory } from "../utlis/DepartmentUtils";
import { createComplaint } from "../api/complaintApi";

function ProblemForm({ initialData }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    description: "",
    severity: "",
    location: "",
    latitude: null,
    longitude: null,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // AI DATA SE FORM AUTO FILL
  // -----------------------------------------

  useEffect(() => {
    if (!initialData) return;

    console.log("AI data received in ProblemForm:", initialData);

    setFormData((prev) => ({
      ...prev,

      category: initialData.category || prev.category,

      description:
        initialData.description || prev.description,

      severity:
        initialData.severity || prev.severity,
    }));

    // AI se aayi image ko form mein set karo
    if (initialData.image) {
      setFile(initialData.image);

      const imageURL = URL.createObjectURL(initialData.image);

      setPreview(imageURL);
    }
  }, [initialData]);

  // -----------------------------------------
  // INPUT CHANGE
  // -----------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------------
  // NORMAL FILE UPLOAD
  // -----------------------------------------

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    const fileURL = URL.createObjectURL(selectedFile);

    setPreview(fileURL);
  };

  // -----------------------------------------
  // GET LOCATION
  // -----------------------------------------

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          location: `${latitude}, ${longitude}`,
          latitude: latitude,
          longitude: longitude,
        }));

        alert("Location verified successfully 📍");
      },
      () => {
        alert(
          "Unable to get location. Please allow location access."
        );
      }
    );
  };

  // -----------------------------------------
  // CONVERT IMAGE TO BASE64
  // -----------------------------------------

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // -----------------------------------------
  // SUBMIT COMPLAINT
  // -----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert("Please select a problem category.");
      return;
    }

    if (!file) {
      alert("Please upload a photo or video.");
      return;
    }

    if (!formData.location) {
      alert("Please add your location.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please describe the problem.");
      return;
    }

    if (!formData.severity) {
      alert("Please select severity.");
      return;
    }

    try {
      setLoading(true);

      let fileData = "";

      // Image ko Base64 mein convert karo
      if (
        file &&
        file.type &&
        file.type.startsWith("image/")
      ) {
        fileData = await convertToBase64(file);
      }

      // Automatic Department
      const department = getDepartmentByCategory(
        formData.category
      );

      // Complaint backend ko bhejo
      const result = await createComplaint({
        category: formData.category,

        description: formData.description,

        location: formData.location,

        latitude: formData.latitude,

        longitude: formData.longitude,

        severity: formData.severity,

        image: fileData,

        department: department,
      });

      console.log(
        "Complaint saved in MongoDB:",
        result
      );

      alert(
        `Complaint submitted successfully!\nDepartment: ${department}`
      );

      navigate("/my-complaints");

    } catch (error) {
      console.error(
        "Complaint submission error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong while submitting complaint."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">

      {/* FORM */}

      <div className="form-wrapper">

        {/* FORM HEADING */}

        <div className="form-heading">

          <span className="heading-icon">
            📢
          </span>

          <div>

            <h1>
              Report a Local Problem
            </h1>

            <p>
              Help make your area better by
              reporting a local problem.
            </p>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* CATEGORY */}

          <div className="form-group">

            <label>
              Problem Category{" "}
              <span>*</span>
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >

              <option value="">
                Select the problem type
              </option>

              {problemCategories.map(
                (problem) => (
                  <option
                    key={problem.id}
                    value={problem.name}
                  >
                    {problem.icon}{" "}
                    {problem.name}
                  </option>
                )
              )}

            </select>

          </div>


          {/* PHOTO / VIDEO */}

          <div className="form-group">

            <label>
              Photo / Video{" "}
              <span>*</span>
            </label>

            <div className="upload-box">

              <div className="upload-icon">
                📷
              </div>

              <h3>
                Upload evidence
              </h3>

              <p>
                Add a photo or video showing
                the problem
              </p>

              <label className="upload-btn">

                Choose File

                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  hidden
                />

              </label>

            </div>


            {/* PREVIEW */}

            {preview && (

              <div className="preview-box">

                {file?.type?.startsWith(
                  "image/"
                ) ? (

                  <img
                    src={preview}
                    alt="Problem"
                  />

                ) : (

                  <video
                    src={preview}
                    controls
                  />

                )}

                <p>
                  {file?.name}
                </p>

              </div>

            )}

          </div>


          {/* LOCATION */}

          <div className="form-group">

            <label>
              Location <span>*</span>
            </label>

            <div className="location-row">

              <input
                type="text"
                name="location"
                placeholder="Enter location or use GPS"
                value={formData.location}
                onChange={handleChange}
              />

              <button
                type="button"
                className="gps-btn"
                onClick={getLocation}
              >
                📍 Use My Location
              </button>

            </div>

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description{" "}
              <span>*</span>
            </label>

            <textarea
              name="description"
              rows="5"
              placeholder="Describe the problem..."
              value={formData.description}
              onChange={handleChange}
            />

          </div>


          {/* SEVERITY */}

          <div className="form-group">

            <label>
              Severity <span>*</span>
            </label>

            <div className="severity-grid">

              {[
                ["Low", "🟢", "Minor issue"],
                ["Medium", "🟡", "Needs attention"],
                ["High", "🟠", "Urgent problem"],
                ["Critical", "🔴", "Immediate action"],
              ].map(
                ([value, icon, text]) => (

                  <label
                    key={value}
                    className={`severity-card ${
                      formData.severity === value
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="severity"
                      value={value}
                      checked={
                        formData.severity === value
                      }
                      onChange={handleChange}
                    />

                    <div>

                      <strong>
                        {icon} {value}
                      </strong>

                      <small>
                        {text}
                      </small>

                    </div>

                  </label>

                )
              )}

            </div>

          </div>


          {/* DATE */}

          <div className="form-group">

            <label>
              Date & Time
            </label>

            <input
              type="text"
              value={new Date().toLocaleString()}
              readOnly
            />

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >

            {loading
              ? "Submitting..."
              : "Submit Complaint →"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default ProblemForm;