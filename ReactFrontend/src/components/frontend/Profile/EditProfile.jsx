import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, useParams } from "react-router-dom";
import { PUBLIC_URL } from "../../../PUBLIC_URL";

const EditProfile = () => {
  document.title = "Edit Profile";
  const history = useHistory();
  const { id } = useParams();


  //----------HOOKS----------
  const [user, setUser] = useState({});
  const [courses, setCourses] = useState([{ examination: "", group: "", result: "", passing: "" }]);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("auth_token")) {
      axios.get("/api/me").then((res) => {
        const data = res.data.user;
        setUser(data);
        setCourses(data.academic_infos || []);
      });
    }
  }, []);


  //----------HANDLE CHANGE----------
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...user, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCourseChange = (index, field, value) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
  };

  const addCourse = () => {
    setCourses([...courses, { examination: "", group: "", result: "", passing: "" }]);
  };


  //----------FORM SUBMISSION----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingBtn(true);
    setErrors({});

    // Debugging
    console.log("Submitting ID:", id);

    const formData = new FormData();
    formData.append("full_name", user.full_name);
    formData.append("dob", user.dob);
    formData.append("street", user.street);
    formData.append("city", user.city);
    formData.append("state", user.state);
    formData.append("country", user.country);
    formData.append("zip", user.zip);
    formData.append("courses", JSON.stringify(courses));
    if (user.image instanceof File) formData.append("image", user.image);

    // Debugging: Log formData content
    console.log("Form Data Entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }


    //Update
    try {
      await axios.get("/sanctum/csrf-cookie");
      const res = await axios.post(`/api/update-profile/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.status === 200) {
        swal("Success", res.data.message, "success");
        history.push("/profile");
      } else {
        setErrors(res.data.validation_errors || {});
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        swal("Error!!", err.message || "Something went wrong!", "error");
      }
    } finally {
      setIsLoadingBtn(false);
    }
  };

  return (
    <div className="container p-5">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4 text-success">Update Profile</h2>

          <div className="text-center mb-4">
            {imagePreview || user.image ? (
              <img
                src={imagePreview || `${PUBLIC_URL}/img_DB/images/${user.image}`}
                alt={user.full_name}
                className="rounded-circle img-thumbnail"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            ) : (
              "No Image"
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="form-control mt-3" />
            {errors.image && <span className="text-danger">{errors.image}</span>}
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label>Full Name</label>
              <input type="text" name="full_name" value={user.full_name || ""} onChange={handleChange} className="form-control" />
              {errors.full_name && <span className="text-danger">{errors.full_name}</span>}
            </div>
            <div className="col-md-6">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={user.dob || ""} onChange={handleChange} className="form-control" />
              {errors.dob && <span className="text-danger">{errors.dob}</span>}
            </div>
          </div>

          {/* Academic Information */}
          <h5 className="text-success mb-2">Academic Information</h5>
          {courses.map((course, index) => (
            <div key={index} className="row g-2 mb-3">
              <div className="col-md-3">
                <select value={course.examination} onChange={(e) => handleCourseChange(index, "examination", e.target.value)} className="form-select">
                  <option value="">Examination</option>
                  <option value="SSC">SSC</option>
                  <option value="HSC">HSC</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Masters">Masters</option>
                </select>
              </div>
              <div className="col-md-3">
                <input type="text" placeholder="Group/Department" value={course.group} onChange={(e) => handleCourseChange(index, "group", e.target.value)} className="form-control" />
              </div>
              <div className="col-md-3">
                <input type="text" placeholder="Result" value={course.result} onChange={(e) => handleCourseChange(index, "result", e.target.value)} className="form-control" />
              </div>
              <div className="col-md-3">
                <input type="text" placeholder="Passing Year" value={course.passing} onChange={(e) => handleCourseChange(index, "passing", e.target.value)} className="form-control" />
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-end mb-4">
            <button type="button" onClick={addCourse} className="btn btn-outline-success">+ Add Academic Info</button>
          </div>

          {/* Address */}
          <h5 className="text-success mb-2">Address</h5>
          <input type="text" name="street" placeholder="Street Address" value={user.street || ""} onChange={handleChange} className="form-control mb-2" />
          <div className="row g-2">
            <div className="col-md-6 mb-2">
              <input type="text" name="city" placeholder="City" value={user.city || ""} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-6 mb-2">
              <input type="text" name="state" placeholder="State" value={user.state || ""} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-6 mb-2">
              <input type="text" name="country" placeholder="Country" value={user.country || ""} onChange={handleChange} className="form-control" />
            </div>
            <div className="col-md-6 mb-2">
              <input type="text" name="zip" placeholder="ZIP Code" value={user.zip || ""} onChange={handleChange} className="form-control" />
            </div>
          </div>

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-success btn-lg" disabled={isLoadingBtn}>
              {isLoadingBtn ? "Please wait..." : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
