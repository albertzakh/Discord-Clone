import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../features/SocketContext";
import { UserContext } from "../features/UserContext";
import AuthFetch from "../hooks/AuthFetch";

function Login() {
  const { user, authDispatch } = useContext(UserContext);
  const { socket, socketDisatch } = useContext(SocketContext);

  const emailRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    if(user) navigate("/");
  }, [user])

  const [resetPasswordErr, setResetPasswordErr] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {email: emailRef.current.value, password: passwordRef.current.value};

    const res = await fetch('/api/auth/login', {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(userData)
    });

    const data = await res.json();

    if(!res.ok) {
      setError(data.error);
    } else {
      navigate("/"); 
      authDispatch({ type: "LOGIN", payload: data });
    }
  }

  const handleForgotPassword = async () => {
    const res = await fetch("/api/auth/send-reset-password", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email: emailRef.current.value })
    });

    const data = await res.json();

    if(!res.ok) {
      setResetPasswordErr(data.error);
    }
  }

  useEffect(() => {
    if(error) setTimeout(() => setError(""), 2000)
  }, [error])

  return (
    <div className="p-5 ipad:p-10 tablet:p-22 w-screen h-screen flex items-center justify-center bg-no-repeat bg-[url('img/auth.png')]">
        <div className="bg-[#36393f] w-[800px] h-[380px] rounded-md flex">
          <div className="w-full flex flex-row">
              <div className="w-[100%] medium:w-[55%] flex flex-col items-center">
                <div className="mt-2">
                  <h2 className="text-white text-xl font-bold mt-6 text-center">Welcome back!</h2>
                  <p className="text-center text-[#afb1b6] mt-1 text-[14px]">We're so excited to see you again!</p>
                </div>
                <form className="w-full flex flex-col px-6 mt-2">
                  <div className="flex flex-col my-2 text-[#b1b3b7]">  
                      <label className="font-bold text-[11px] flex flex-row">
                        <p className="flex flex-row">EMAIl {error && <p className="ml-1 text-red"> - {error}</p>}</p> 
                        {resetPasswordErr && <p className="ml-1 text-red"> - {resetPasswordErr}</p>}
                      </label>
                      <input ref={emailRef} className="outline-none border-none bg-[#282424] p-2 h-[38px] text-white rounded-[4px] my-[4px] text-[13px]" name="email" type="email" />
                  </div>
                  <div className="flex flex-col text-sm mt-2 text-[#b1b3b7]">
                    <label className="font-bold text-[11px]">
                      <p className="flex flex-row">PASSWORD {error && <p className="ml-1 text-red"> - {error}</p>}</p> 
                    </label>
                    <input ref={passwordRef} className="outline-none border-none bg-[#282424] p-2 h-[38px] text-white rounded-[4px] my-[4px] text-[13px]" name="password" type="password" />
                  </div>
                  <div className="flex flex-col">
                    <Link onClick={handleForgotPassword} className="text-[#969ef8] w-30 text-[12px]">Forgot your password?</Link>
                    <button onClick={handleLogin} className="mt-5 bg-[#5865f2] text-white h-[42px] cursor-pointer hover:bg-[#4655f6] transition-all text-sm rounded-[4px]">Log In</button>
                    <div className="flex text-sm mt-2">
                      <p className="text-[#787b80] text-[12px]">Need an account?</p>
                      <Link to="/register" className="mx-1 text-[12px] text-[#969ef8] hover:underline">Register</Link>
                    </div>
                  </div>
                </form>
            </div>
            <div className="hidden medium:inline-flex flex-1 flex-col items-center pt-12">
              <div className="relative border-14 border-white w-40 bg-no-repeat h-40 bg-[url('img/code.png')]">
                <img className="absolute w-12 h-12 top-14 left-14" src="img/logo.png" />
              </div>
              <h2 className="text-center text-white font-bold text-xl mt-5">Log in with QR Code</h2>
              <span className="text-center text-[#b1b3b7] mt-2 text-[14px]">Scan this with the <strong>Discord mobile <br />app to login instantly</strong></span>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Login;