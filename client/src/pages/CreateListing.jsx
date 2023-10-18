import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploadLoading, setFileUploadLoading] = useState(false);

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
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl my-7 font-semibold text-center">
                Create a Listing
            </h1>
            <form className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        id="name"
                        placeholder="Name..."
                        className="border rounded-lg p-3"
                        maxLength="62"
                        minLength="10"
                        required
                    />
                    <textarea
                        type="text"
                        id="description"
                        placeholder="Description..."
                        className="border rounded-lg p-3"
                        required
                    />
                    <input
                        type="text"
                        id="address"
                        placeholder="Address..."
                        className="border rounded-lg p-3"
                        required
                    />

                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sell" className="w-5" />
                            <span>Sell</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5" />
                            <span>Rent</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                            />
                            <span>Parking spot</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                            />
                            <span>Furnished</span>
                        </div>

                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5" />
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
                            />
                            <p>Baths</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                id="regularPrice"
                                min="1"
                                max="10"
                                className="p-3 rounded-lg border border-gray-300"
                            />
                            <div className="flex flex-col items-center">
                                <p>Regular price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                id="discountPrice"
                                min="1"
                                max="10"
                                className="p-3 rounded-lg border border-gray-300"
                            />
                            <div className="flex flex-col items-center">
                                <p>Discount price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>
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
                        >
                            {uploadLoading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                    {imageUploadError ? (
                        <p className="text-red-700">{imageUploadError}</p>
                    ) : (
                        ""
                    )}
                    {formData.imageUrls.length > 0 &&  formData.imageUrls.map((url, index) => 
                            (<div className="flex justify-between items-center p-3 border" key={index}>
                                <img className="w-20 h-20 object-contain rounded-lg" src={url} alt="image listing" />
                                <button type="button" onClick={() => handleDeleteImage(index)} className="text-red-700 p-3 uppercase rounded-lg hover:opacity-95">Delete</button>
                            </div>)
                    )}

                    <button className="p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80 ">
                        Create Listing
                    </button>
                </div>
            </form>
        </main>
    );
}
