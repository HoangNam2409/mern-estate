import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure,
} from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";

export default function Profile() {
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateUserSuccessfully, setFileUploadSuccessfully] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);
    const dispatch = useDispatch();

    // firebase storage
    // allow read;
    // allow write: if
    // request.resource.size < 2 * 1024 * 1024 &&
    // request.resource.contentType.matches('image/.*')

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }

        return () => {
            
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            () => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL })
                );
            }
        );
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            if (formData.password === "") {
                delete formData.password;
            }
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setFileUploadSuccessfully(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDelete = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch("/api/auth/signout");
            const data = await res.json();
            if (data.message === false) {
                dispatch(signOutUserFailure(data.message));
                return;
            }

            dispatch(signOutUserSuccess());
        } catch (error) {
            dispatch(signOutUserFailure(error.message));
        }
    };

    const handleShowListings = async () => {
        try {
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                showListingsError(true);
                return;
            }
            setUserListings(data);
            setShowListingsError(false);
        } catch (error) {
            setShowListingsError(true);
        }
    };

    const handleDeleteListing = async (listingID) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingID}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setUserListings((prev) =>
                prev.filter((listing) => listing._id !== listingID)
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                />
                <img
                    className="w-24 h-24 rounded-full object-cover cursor-pointer self-center"
                    src={formData.avatar || currentUser.avatar}
                    alt=""
                    onClick={() => fileRef.current.click()}
                />

                <p className="text-center">
                    {fileUploadError ? (
                        <span className="text-red-700">
                            Error image upload (image must be less than 2 MB)
                        </span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                        <span className="text-green-700">
                            Image successfully uploaded
                        </span>
                    ) : (
                        ""
                    )}
                </p>

                <input
                    type="text"
                    placeholder="Username"
                    id="username"
                    defaultValue={currentUser.username}
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />

                <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    defaultValue={currentUser.email}
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    className="bg-slate-700 rounded-lg uppercase text-white p-3 hover:opacity-95 disabled:opacity-80"
                >
                    {loading ? "Loading..." : "Update"}
                </button>

                <Link
                    to="/create-listing"
                    className=" text-center bg-green-700 rounded-lg uppercase text-white p-3 hover:opacity-95 disabled:opacity-80"
                >
                    Create Listing
                </Link>
            </form>

            <div className="flex justify-between mt-5">
                <span
                    onClick={handleDelete}
                    className="text-red-700 cursor-pointer"
                >
                    Delete account
                </span>
                <span
                    onClick={handleSignOut}
                    className="text-red-700 cursor-pointer"
                >
                    Sign out
                </span>
            </div>

            <p className="text-red-700 mt-5 text-center">
                {error ? error : ""}
            </p>

            <p className="text-green-700 mt-5 text-center">
                {updateUserSuccessfully ? "User is updated successfully!" : ""}
            </p>

            <button
                type="button"
                onClick={handleShowListings}
                className="text-green-700 w-full"
            >
                Show Listings
            </button>
            <p className="text-red-700 mt-5 text-center">
                {showListingsError ? "Error showing listings" : ""}
            </p>

            {userListings && userListings.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h1 className="text-center mt-7 text-2xl font-semibold text-slate-700">
                        Your Listings
                    </h1>
                    {userListings.map((userListing) => {
                        return (
                            <div
                                key={userListing._id}
                                className="border rounded-lg p-3 flex justify-between items-center gap-4"
                            >
                                <Link to={`/listing/${userListing._id}`}>
                                    <img
                                        className="h-16 w-16 object-contain rounded-lg"
                                        src={userListing.imageUrls[0]}
                                        alt="Image listing"
                                    />
                                </Link>

                                <Link
                                    className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                                    to={`/listing/${userListing._id}`}
                                >
                                    <p>{userListing.name}</p>
                                </Link>

                                <div className="flex flex-col items-center">
                                    <button
                                        onClick={() =>
                                            handleDeleteListing(userListing._id)
                                        }
                                        className="text-red-700"
                                    >
                                        Delete
                                    </button>
                                    <Link to={`/update-listing/${userListing._id}`}>
                                        <button className="text-green-700">
                                            Edit
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
