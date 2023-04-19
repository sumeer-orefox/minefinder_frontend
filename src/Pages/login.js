import React, { useState, useEffect } from "react";
import eyeopen from "../assets/eyeopen.png";
import eyeclose from "../assets/eyeclose.png";
import google from "../assets/google.png";
import twitter from "../assets/twitter.png";
import closeWhite from "../assets/close-white.png";
import { Link } from "react-router-dom";
import { axiosHandler, errorHandler } from "../helper";
import { LOGIN_URL } from "../urls";
import Loader from "../components/loader";
import { checkAuthState, tokenName } from "./authController";

export const loginRequest = async (data, setError, props) => {
  const result = await axiosHandler({
    method: "post",
    url: LOGIN_URL,
    data: data,
  }).catch((e) => setError(errorHandler(e)));
  if (result) {
    localStorage.setItem(tokenName, JSON.stringify(result.data));
    props.history.push("/");
  }
};

const Login = (props) => {
  const [loginData, setLoginData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();
  const [checking, setChecking] = useState(localStorage.getItem(tokenName));

  useEffect(() => {
    if (checking) {
      checkAuthState(
        () => null,
        () => props.history.push("/"),
        props
      );
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    await loginRequest(loginData, setError, props);
    setLoading(false);
  };

  const onChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="loginContainer">
      {checking ? (
        <div className="centerAll">
          <Loader />
        </div>
      ) : (
        <div className="inner">
          <div className="logo">MINEFINDER</div>
          <div className="title">Sign in</div>
          <AuthForm
            login
            data={loginData}
            onSubmit={submit}
            onChange={onChange}
            showPassword={showPassword}
            error={error}
            loading={loading}
            setError={setError}
            setShowPassword={setShowPassword}
          />
          {/*<div className="grid grid-2 grid-gap-2">*/}
          {/*  <div className="socialButton">*/}
          {/*    <img src={twitter} /> <span>Twitter</span>*/}
          {/*  </div>*/}
          {/*  <div className="socialButton">*/}
          {/*    <img src={google} /> <span>Google</span>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="switchOption">
            Don’t have an accout yet? <Link to="/register">Sign up</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export const AuthForm = (props) => {
 
  return (
    <>
      {props.error && (
        <div className="errorHolder">
          <div dangerouslySetInnerHTML={{ __html: props.error }} />
          <img src={closeWhite} onClick={() => props.setError(null)} alt="error"/>
        </div>
      )}
      <form onSubmit={props.onSubmit}>
        <input
          value={props.data.username}
          name="email"
          onChange={props.onChange}
          className="input-field"
          placeholder="Email"
          required
        />
       
        <div className="input-container">
          <input
            className="input-field"
            placeholder="Password"
            value={props.data.password}
            name="password"
            onChange={props.onChange}
            type={!props.showPassword ? "password" : "text"}
            autoComplete="new-password"
            required
          />
          <img
            src={!props.showPassword ? eyeopen : eyeclose}
            onClick={() => props.setShowPassword(!props.showPassword)} alt="show"
          />
        </div>
        {!props.login && (
          <><div className="input-container">
             <input
            className="input-field"
            placeholder="Confirm Password"
            value={props.data.re_password}
            name="re_password"
            onChange={props.onChange}
            type={!props.showPassword ? "password" : "text"}
            autoComplete="off"
            required
          />
          <img
            src={!props.showPassword ? eyeopen : eyeclose}
            onClick={() => props.setShowPassword(!props.showPassword)} alt="show"
          />
          </div>
          <div className="input-container" onChange={props.onChange}>
            <input   type="radio" value="is_buyer" name="user_type"  required/><span className="radio-field">Buyer</span>
            <input  type="radio" value="is_seller" name="user_type" required/><span className="radio-field">Seller</span> 
            <input type="radio" value="both" name="user_type" required/><span  className="radio-field"> Both </span>
            
          </div>
          </>
        )}
        {/*{props.login && (*/}
        {/*  <div className="flex justify-end">*/}
        {/*    <Link to="/">Forgot Password</Link>*/}
        {/*  </div>*/}
        {/*)}*/}
        <button type="submit" disabled={props.loading}>
          {props.loading ? (
            <center>
              <Loader />
            </center>
          ) : props.login ? (
            "Login"
          ) : (
            "Register"
          )}
        </button>
      </form>
    </>
  );
};

export default Login;
