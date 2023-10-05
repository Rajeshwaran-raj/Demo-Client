import axios from "../Axios/Axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Auth, jsonwebtoken, Load } from "../Atom/Atom";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../StyleSheet/Register.css";
import Dropzone from "react-dropzone";

export const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(Auth);
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [imageurl, setImageurl] = useState(null);
  const [imageName, setImageName] = useState();
  const [password, setPassword] = useState("");
  const [passoutyear, setPhoneNumber] = useState(""); // Changed "passoutyear" to "phoneNumber"
  const [jwt, setJwt] = useRecoilState(jsonwebtoken);
  const [loading, setLoading] = useRecoilState(Load);
  const [otp, setOtp] = useState(false);
  const [otpcode, setOtpcode] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [showpassword, setShowpassword] = useState(false);
  
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  const checkPasswordStrength = () => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (regex.test(password)) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    // Replace 'otpcode' and 'enteredOtp' with your OTP comparison logic here
    if (otpcode === enteredOtp) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", image);
        // Define 'imageName' or replace it with a desired name for the image
        formData.append("name", imageName);

        const uploadResponse = await axios.post("/uploadimage", formData, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });

        // Assuming the server responds with an image URL
        const imageUrl = uploadResponse.data.location;
        // Now, you can include the image URL in your registration request
        const result = await axios.post(
          "/register",
          {
            name: user.name,
            email: email,
            password: password,
            phoneNumber: passoutyear, // Changed "passoutyear" to "phoneNumber"
            imageurl: imageUrl, // Include the image URL in the registration data
          },
          { withCredentials: true }
        );

        setLoading(false);

        // Rest of your code...
      } catch (err) {
        console.error(err);
      }
    } else {
      toast.error(`Otp does not match`, {
        position: toast.POSITION.TOP_RIGHT,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGetOtp = async (e) => {
    setTimeRemaining(120);
    e.preventDefault();
    // Validate phone number (10 digits starting with 9, 8, 7, or 6)
    const phoneNumberRegex = /^[6-9]\d{9}$/;
    if (!phoneNumberRegex.test(passoutyear)) {
      toast.error("Invalid phone number. It should start with 9, 8, 7, or 6 and have 10 digits.");
      return;
    }

    // Validate email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address.");
      return;
    }
    try {
      const result = await axios.post("/generateotp", {
        email: email,
      });
      if (result.data.status) {
        toast.success(result.data.msg);
        setOtpcode(result.data.Otp);
        console.log(result.data);
        setOtp(true);
      } else {
        toast.info("Account already exists. Try login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isDisabled =
    !checkPasswordStrength() ||
    !user.name ||
    !email ||
    !password ||
    enteredOtp.length !== 6;

  return (
    <>
      <ToastContainer />
      {loading ? (
        <></>
      ) : (
        <Container>
          <Row>
            <Col lg={3} xs={0}></Col>
            <Col lg={6} xs={12}>
              <div className="auth">
                <h1>Signup</h1>
                {!otp ? (
                  <form onSubmit={handleSubmit}>
                    <input
                      required
                      className="form-control"
                      type="text"
                      placeholder="Username"
                      value={user.name}
                      onChange={(e) =>
                        setUser({ name: e.target.value, login: true })
                      }
                    />
                    <input
                      required
                      className="form-control"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      required
                      className="form-control"
                      type="number"
                      placeholder="Phone Number"
                      value={passoutyear}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <div className="item">
                      <h2>Profile</h2>
                      {image ? (<>
                        <img
                          src={image}
                          alt="Selected"
                          className="selected-image"
                          width="50px"
                        />
                         <button
                            className="btn btn-danger"
                            style={{ marginTop: "1em" }}
                            onClick={() => setImage(null)}
                          >
                            Remove Image
                          </button></>
                      ) : (
                        <Dropzone onDrop={handleDrop}>
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone" {...getRootProps()}>
                              <input
                                {...getInputProps({ accept: "image/*" })}
                              />
                              <p>
                                Drag and drop an image here, or click to select
                              </p>
                            </div>
                          )}
                        </Dropzone>
                      )}
                    </div>
                    <input
                      className={`form-control ${
                        password
                          ? checkPasswordStrength()
                            ? "strong"
                            : "weak"
                          : ""
                      }`}
                      required
                      type={!showpassword ? "password" : "text"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckIndeterminate"
                        checked={showpassword}
                        onChange={() => setShowpassword(!showpassword)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckIndeterminate"
                      >
                        Show Password
                      </label>
                    </div>

                    {password && !checkPasswordStrength() && (
                      <div className="password-strength">
                        Password is Weak. Must Contain Uppercase, Lowercase, Special Characters, Numbers, and length more than 7
                      </div>
                    )}
                    <button
                      className="btn btn-primary"
                      onClick={handleGetOtp}
                      disabled={
                        !checkPasswordStrength() ||
                        !user.name ||
                        !email ||
                        !password
                      }
                    >
                      Get OTP
                    </button>
                    <span>
                      Have an account?{" "}
                      <Link to="/Login" style={{ color: "" }}>
                        Login
                      </Link>
                    </span>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                    {timeRemaining ? (
                      <p>Resend OTP in {timeRemaining} seconds</p>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={handleGetOtp}
                      >
                        Resend OTP
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "fit-content" }}
                      disabled={isDisabled}
                    >
                      Submit
                    </button>
                  </form>
                )}
              </div>
            </Col>
            <Col md={6} xs={0}></Col>
          </Row>
        </Container>
      )}
    </>
  );
};
