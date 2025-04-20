import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";


export default function StudentForm() {

  const history = useHistory();
  document.title = "Registration";

  //----------HOOKS----------
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [registerInput, setRegister] = useState({
    full_name: "",
    dob: "",
    email: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    courses: [{ examination: "", group: "", result: "", passing: "" }],
    image: null,
    password: "",
    password_confirmation: "",
  });


  //----------HANDLE CHANGE----------
  const handleChange = (e) => {
    e.persist();
    setRegister({ ...registerInput, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRegister((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...registerInput.courses];
    updatedCourses[index][field] = value;
    setRegister((prev) => ({ ...prev, courses: updatedCourses }));
  };

  const addCourse = () => {
    setRegister((prev) => ({
      ...prev,
      courses: [...prev.courses, { examination: "", group: "", result: "", passing: "" }],
    }));
  };


  //----------FORM SUBMISSION----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingBtn(true);
    setErrors({});

    // FormData
    const formData = new FormData();
    formData.append('image', registerInput.image);
    formData.append('full_name', registerInput.full_name);
    formData.append('dob', registerInput.dob);
    formData.append('email', registerInput.email);
    formData.append('street', registerInput.street);
    formData.append('city', registerInput.city);
    formData.append('state', registerInput.state);
    formData.append('country', registerInput.country);
    formData.append('zip', registerInput.zip);
    formData.append("courses", JSON.stringify(registerInput.courses));
    formData.append('password', registerInput.password);
    formData.append('password_confirmation', registerInput.password_confirmation);

    // Debugging: Log formData content
    console.log("Form Data Entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // API
    try {
      await axios.get("/sanctum/csrf-cookie", { withCredentials: true });
      const res = await axios.post("/api/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // crucial for Laravel file upload
        }, withCredentials: true,
      });
      setIsLoadingBtn(false);
      if (res.data.status === 200) {
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("auth_name", res.data.full_name);
        swal("Success", res.data.message, "success");
        history.push("/login");
      } else {
        setErrors(res.data.validation_errors || {});
      }
    } catch (err) {
      setIsLoadingBtn(false);
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        console.error("Something went wrong:", err.response || err.message);
        swal("Error!!!!!!", err.response?.data?.message || "Something went wrong!", "error");
      }
    }
  };


  return (
    <div className="container p-5">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4 text-success">Student Registration Form</h2>

          {/* Profile Image */}
          <div className="text-center mb-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="rounded-circle img-thumbnail"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "150px", height: "150px" }}
              >
                No Image
              </div>
            )}
            <div className="mt-3">
              <input type="file" accept="image/*" required onChange={handleImageChange} name="image" className="form-control w-100 mx-auto" />
              {errors.image && <span className="text-danger">{errors.image}</span>}
            </div>
          </div>

          {/* Personal Info */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label style={{ display: 'flex' }}>Full Name</label>
              <input type="text" name="full_name" value={registerInput.full_name} onChange={handleChange} className="form-control" />
              {errors.full_name && <span className="text-danger">{errors.full_name}</span>}
            </div>
            <div className="col-md-4">
              <label style={{ display: 'flex' }}>Email</label>
              <input type="email" name="email" value={registerInput.email} onChange={handleChange} className="form-control" />
              {errors.email && <span className="text-danger">{errors.email}</span>}
            </div>
            <div className="col-md-4">
              <label style={{ display: 'flex' }}>Date of Birth</label>
              <input type="date" name="dob" value={registerInput.dob} onChange={handleChange} className="form-control" />
              {errors.dob && <span className="text-danger">{errors.dob}</span>}
            </div>
          </div>

          {/* Academic Info */}
          <div className="mb-4">
            <h5 className="text-success" style={{ display: 'flex' }}>Academic Information</h5>
            {registerInput.courses.map((course, index) => (
              <div key={index} className="row g-2 mb-3">
                <div className="col-md-3">
                  <select
                    value={course.examination}
                    onChange={(e) => handleCourseChange(index, "examination", e.target.value)}
                    className="form-select"
                  >
                    <option value="">Examination</option>
                    <option value="SSC">SSC</option>
                    <option value="HSC">HSC</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Masters">Masters</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    placeholder="Group/Department"
                    value={course.group}
                    onChange={(e) => handleCourseChange(index, "group", e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    placeholder="Result"
                    value={course.result}
                    onChange={(e) => handleCourseChange(index, "result", e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    placeholder="Passing Year"
                    value={course.passing}
                    onChange={(e) => handleCourseChange(index, "passing", e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-end">
              <button type="button" onClick={addCourse} className="btn btn-outline-success">
                + Add Academic Info
              </button>
            </div>
          </div>

          {/* Address Info */}
          <div className="mb-4">
            <h5 className="text-success" style={{ display: 'flex' }}>Address</h5>
            <input type="text" name="street" placeholder="Street Address" value={registerInput.street} onChange={handleChange} className="form-control mb-2" />
            <div className="row g-2">
              <div className="col-md-6 mb-2">
                <input type="text" name="city" placeholder="City" value={registerInput.city} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6 mb-2">
                <input type="text" name="state" placeholder="State" value={registerInput.state} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6 mb-2">
                <input type="text" name="country" placeholder="Country" value={registerInput.country} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6 mb-2">
                <input type="text" name="zip" placeholder="ZIP Code" value={registerInput.zip} onChange={handleChange} className="form-control" />
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="row g-3 mb-4">
            <h5 className="text-success" style={{ display: 'flex' }}>Password</h5>
            <div className="col-md-6">
              <input type="password" name="password" value={registerInput.password} onChange={handleChange} placeholder="Password" className="form-control" />
              {errors.password && <span className="text-danger">{errors.password}</span>}
            </div>
            <div className="col-md-6">
              <input type="password" name="password_confirmation" value={registerInput.password_confirmation} onChange={handleChange} placeholder="Confirm Password" className="form-control" />
              {errors.password && <span className="text-danger">{errors.password_confirmation}</span>}
            </div>
          </div>

          {/* Submit */}
          <div className="d-grid">
            <button type="submit" className="btn btn-success btn-lg" disabled={isLoadingBtn}>
              {isLoadingBtn ? "Please wait..." : "Register"}
            </button>
          </div>

          <div className="text-center mt-4">
            <span>Already Registered? </span>
            <Link to="/login" className="text-success">Login here</Link>
          </div>
        </div>

      </form>
    </div>
  );
}
