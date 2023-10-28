import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom'

export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });

    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploadLoading, setFileUploadLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate()

    const handleUploadImage = () => {
        setFileUploadLoading(true);
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setFileUploadLoading(false);
                    setImageUploadError(false);
                })
                .catch(() => {
                    setImageUploadError(
                        "Image upload fail (2 mb max per image)"
                    );
                    setFileUploadLoading(false);
                });
        } else {
            setImageUploadError("You can only upload 6 images per listing");
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const process =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${process}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            resolve(downloadURL);
                        }
                    );
                }
            );
        });
    };

    const handleDeleteImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === "sale" || e.target.id == "rent") {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }

        if (
            e.target.id === "offer" ||
            e.target.id === "parking" ||
            e.target.id === "furnished"
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (
            e.target.type === "number" ||
            e.target.type === "text" ||
            e.target.type === "textarea"
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1)
                return setError("You must upload at least one image");
            if (+formData.regularPrice < +formData.discountPrice)
                return setError(
                    "Discount price must be lower than regular price"
                );
            setLoading(true);
            const res = await fetch("/api/listing/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            if (data.success === false) {
                setError(data.message);
            }
            setLoading(false);
            setError(false);
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl my-7 font-semibold text-center">
                Create a Listing
            </h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        id="name"
                        placeholder="Name..."
                        className="border rounded-lg p-3"
                        maxLength="62"
                        minLength="10"
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <textarea
                        type="text"
                        id="description"
                        placeholder="Description..."
                        className="border rounded-lg p-3"
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input
                        type="text"
                        id="address"
                        placeholder="Address..."
                        className="border rounded-lg p-3"
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />

                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                type="checkbox"
                                id="sale"
                                className="w-5"
                                checked={formData.type === "sale"}
                            />
                            <span>Sell</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                type="checkbox"
                                id="rent"
                                className="w-5"
                                checked={formData.type === "rent"}
                            />
                            <span>Rent</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <span>Parking spot</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.furnished}
                            />
                            <span>Furnished</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                type="checkbox"
                                id="offer"
                                className="w-5"
                                checked={formData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                id="bedrooms"
                                min="1"
                                max="10"
                                className="p-3 rounded-lg border border-gray-300"
                                onChange={handleChange}
                                value={formData.bedrooms}
                            />
                            <p>Beds</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                id="bathrooms"
                                min="1"
                                max="10"
                                className="p-3 rounded-lg border border-gray-300"
                                onChange={handleChange}
                                value={formData.bathrooms}
                            />
                            <p>Baths</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                id="regularPrice"
                                min="50"
                                max="100000"
                                className="p-3 rounded-lg border border-gray-300"
                                onChange={handleChange}
                                value={formData.regularPrice}
                            />
                            <div className="flex flex-col items-center">
                                <p>Regular price</p>
                                {formData.type === 'rent' && <span className="text-xs">($ / month)</span>}
                            </div>
                        </div>

                        {formData.offer && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    id="discountPrice"
                                    min="0"
                                    max="1000000"
                                    className="p-3 rounded-lg border border-gray-300"
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                                <div className="flex flex-col items-center">
                                    <p>Discount price</p>
                                    {formData.type === 'rent' && <span className="text-xs">($ / month)</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4 flex-1">
                    <p className="font-semibold">
                        Images:
                        <span className="text-gray-600 ml-2 font-normal">
                            The first image will be the cover (max 6)
                        </span>
                    </p>

                    <div className="flex gap-4">
                        <input
                            className="p-3 border border-gray-300 rounded w-full"
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                        />
                        <button
                            type="button"
                            onClick={handleUploadImage}
                            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                            disabled={uploadLoading}
                        >
                            {uploadLoading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                    {imageUploadError ? (
                        <p className="text-red-700">{imageUploadError}</p>
                    ) : (
                        ""
                    )}
                    {formData.imageUrls.length > 0 &&
                        formData.imageUrls.map((url, index) => (
                            <div
                                className="flex justify-between items-center p-3 border"
                                key={index}
                            >
                                <img
                                    className="w-20 h-20 object-contain rounded-lg"
                                    src={url}
                                    alt="image listing"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(index)}
                                    className="text-red-700 p-3 uppercase rounded-lg hover:opacity-95"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}

                    <button disabled={loading || uploadLoading} className="p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80 ">
                        {loading ? "Creating..." : "Create Listing"}
                    </button>

                    {error && (
                        <p className="text-red-700 text-center text-sm">
                            {error}
                        </p>
                    )}
                </div>
            </form>
        </main>
    );
}
