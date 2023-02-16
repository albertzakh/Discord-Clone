import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ForgotPasswordSvg from "../img/ForgotPassword.svg";

function Login() {
  const newPasswordRef = useRef();
  const navigate = useNavigate();

  const { token } = useParams();
  const { id } = useParams();

  const [error, setError] = useState("");

  useEffect(() => {
    async function ValidateToken() {
      const res = await fetch(`/api/auth/validate-token`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ token, id })
      });

      const data = await res.json();

      if(!res.ok) navigate("/login");
    }

    ValidateToken();
  }, [])

  const handleResetPassword = async () => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id, newPassword: newPasswordRef.current.value })
    });

    const data = await res.json();

    if(!res.ok) {
      setError(data.error);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[url('img/auth.png')]">
        <div className="w-full h-full ipad:w-[475px] ipad:h-[340px] bg-[#36393f] rounded-md text-white flex flex-col items-center py-6">
          <img src={ForgotPasswordSvg} />
            <h2 className="text-[21px] font-bold mt-4">Change Your Password</h2>
            <form onSubmit={(e) => e.preventDefault()} className="flex w-[85%] text-[#b1b3b7] flex-col my-4">
                <div className="flex flex-col my-2">
                    <div className="flex flex-row">
                      <p className="text-sm font-bold">NEW PASSWORD</p> 
                      {error && <p className="ml-1 text-red text-sm"> - {error}</p>}
                    </div> 
                    <input ref={newPasswordRef} className="outline-none border-none bg-[#282424] p-2 h-[42px] text-white text-[15px] rounded-[4px] my-[6px]" name="password" type="password" />
                </div>
                <div className="flex flex-col relative">
                    <button onClick={handleResetPassword} className="bg-[#5865f2] text-md text-white h-[42px] cursor-pointer hover:bg-[#4655f6] transition-all rounded-[3px]">Change Password</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login;