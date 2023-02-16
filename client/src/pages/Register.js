import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../features/UserContext";
import AuthFetch from "../hooks/AuthFetch";

function Register() {
    const { user } = useContext(UserContext);

    const emailRef = useRef();
    const nameRef = useRef();
    const passwordRef = useRef();
    const monthRef = useRef();
    const yearRef = useRef();
    const dayRef = useRef();
    
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleRegister = async (e) => {
        e.preventDefault();

        const userData = {username:nameRef.current.value, email:emailRef.current.value, password: passwordRef.current.value, birthMonth: monthRef.current.value, birthDay: Number(dayRef.current.value), birthYear: Number(yearRef.current.value)};

        const res = await fetch('/api/auth/register', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userData)
        });

        const data = await res.json();

        if(!res.ok) {
            setError(data.error);
        } else { 
            navigate("/login"); 
        }
  }

  useEffect(() => {
    if(user) navigate("/"); 
  }, [user])

  useEffect(() => {
    if(error) setTimeout(() => setError(""), 2000);
  });
  
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[url('img/auth.png')]">
        <div className="w-full h-full ipad:w-[450px] ipad:h-[515px] bg-[#36393f] rounded-md text-white flex flex-col items-center py-6">
            <h2 className="text-[21px] font-bold">Create an account</h2>
            {/* {error && <div className="text-red font-bold mt-2">{error}</div>} */}
            <form className="flex w-[85%] text-[#b1b3b7] flex-col my-4">
                <div className="flex flex-col my-2">
                    <label className="font-bold text-[11px] text-[#b1b3b7]">EMAIL</label>
                    <input ref={emailRef} className="outline-none border-none bg-[#282424] p-2 h-[38px] text-white rounded-[4px] my-[6px] autofill:bg-transparent text-[14px]" name="email" type="email" />
                </div>
                <div className="flex flex-col my-2">
                    <label className="font-bold text-[11px]">USERNAME</label>
                    <input ref={nameRef} className="outline-none border-none bg-[#282424] p-2 h-[38px] text-white text-[15px] rounded-[4px] my-[6px] autofill:bg-[#282424]" name="username" type="text" />
                </div>
                <div className="flex flex-col my-2">
                    <label className="font-bold text-[11px]">PASSWORD</label>
                    <input ref={passwordRef} className="outline-none border-none bg-[#282424] p-2 h-[38px] text-white text-[15px] rounded-[4px] my-[6px]" name="password" type="password" />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold text-[11px]">DATE OF BIRTH</label>
                    <div className="flex flex-row">
                        <div className="w-[150px] h-[38px] bg-[#282424] rounded-[4px] text-[14px] my-2 flex flex-row items-center relative">
                            <select ref={monthRef} className="auth-selector">
                                <option defaultValue className="hidden">Month</option>
                                <option>January</option>
                                <option>February</option>
                                <option>March</option>
                                <option>April</option>
                                <option>May</option>
                                <option>June</option>
                                <option>July</option>
                                <option>August</option>
                                <option>September</option>
                                <option>October</option>
                                <option>November</option>
                                <option>December</option>
                            </select>
                            <FontAwesomeIcon className="absolute cursor-pointer right-3" icon={faChevronDown} />
                        </div>
                        <div className="w-[135px] h-[38px] bg-[#282424] rounded-[4px] text-[14px] my-2 mx-3 flex flex-row items-center relative">
                            <select ref={dayRef} className="auth-selector">
                                <option defaultValue className="hidden">Day</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                                <option>13</option>
                                <option>14</option>
                                <option>15</option>
                                <option>16</option>
                                <option>17</option>
                                <option>18</option>
                                <option>19</option>
                                <option>20</option>
                                <option>21</option>
                                <option>22</option>
                                <option>23</option>
                                <option>24</option>
                                <option>25</option>
                                <option>26</option>
                                <option>27</option>
                                <option>28</option>
                                <option>29</option>
                                <option>30</option>
                                <option>31</option>
                            </select>
                            <FontAwesomeIcon className="absolute cursor-pointer right-3" icon={faChevronDown} />
                        </div>
                        <div className="w-[135px] h-[38px] bg-[#282424] text-[14px] rounded-md my-2 flex flex-row items-center relative">
                            <select ref={yearRef} className="auth-selector">
                                <option defaultValue className="hidden">Year</option>
                                <option>2022</option>
                                <option>2021</option>
                                <option>2020</option>
                                <option>2019</option>
                                <option>2018</option>
                                <option>2017</option>
                                <option>2016</option>
                                <option>2015</option>
                                <option>2014</option>
                                <option>2013</option>
                                <option>2012</option>
                                <option>2011</option>
                                <option>2010</option>
                                <option>2009</option>
                                <option>2008</option>
                                <option>2007</option>
                                <option>2006</option>
                                <option>2005</option>
                                <option>2004</option>
                                <option>2003</option>
                                <option>2002</option>
                                <option>2001</option>
                                <option>2000</option>
                            </select>
                            <FontAwesomeIcon className="absolute cursor-pointer right-3" icon={faChevronDown} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col relative">
                    <button onClick={handleRegister} className="mt-4 bg-[#5865f2] text-sm text-white h-[42px] cursor-pointer hover:bg-[#4655f6] transition-all rounded-[3px]">Continue</button>
                    <Link to="/login" className="text-[#969ef8] text-[13px] mt-2 hover:underline">Already have an account?</Link>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Register