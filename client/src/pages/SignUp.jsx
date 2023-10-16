import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";
import {
    signUpStart,
    signUpSuccess,
    signUpFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";

export default function SignUp() {
    const [formData, setFormDate] = useState({});
    const { error, loading } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormDate({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(signUpStart());
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signUpFailure(data.message));
                return;
            }
            dispatch(signUpSuccess());
            navigate("/sign-in");
        } catch (error) {
            dispatch(signUpFailure(error.message));
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7 ">
                Sign Up
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Username..."
                    id="username"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <input
                    type="email"
                    placeholder="Email..."
                    id="email"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="Password..."
                    id="password"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    className="bg-slate-700 rounded-lg uppercase text-white p-3 hover:opacity-95 disabled:opacity-80"
                >
                    {loading ? "Loading..." : "Sign Up"}
                </button>

                <Oauth />
            </form>

            <div className="flex gap-2 mt-5">
                <p>Have an account?</p>
                <Link to="/sign-in">
                    <span className="text-blue-700 hover:underline">
                        Sign in
                    </span>
                </Link>
            </div>

            {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>
    );
}
