import { useSelector } from "react-redux";

export default function Profile() {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

            <form className="flex flex-col gap-4">
                <img
                    className="w-24 h-24 rounded-full object-cover cursor-pointer self-center"
                    src={currentUser.avatar}
                    alt=""
                />
                <input
                    type="email"
                    placeholder="Email..."
                    id="email"
                    className="border p-3 rounded-lg"
                />
                <input
                    type="password"
                    placeholder="Password..."
                    id="password"
                    className="border p-3 rounded-lg"
                />
                <button className="bg-slate-700 rounded-lg uppercase text-white p-3 hover:opacity-95 disabled:opacity-80">
                    Update
                </button>
            </form>

            <div className="flex justify-between mt-5">
              <span className="text-red-700 cursor-pointer">Delete account</span>
              <span className="text-red-700 cursor-pointer">Sign out</span>
            </div>
        </div>
    );
}
