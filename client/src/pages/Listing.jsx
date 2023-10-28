import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from "react-icons/fa";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setLoading(false);
                    setError(true);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setLoading(false);
                setError(true);
            }
        };

        fetchListing();
    }, []);

    return (
        <main>
            {loading && <p className="text-center text-2xl my-7">Loading...</p>}
            {error && (
                <p className="text-red-700 text-center text-2xl my-7">
                    Something went wrong!
                </p>
            )}
            {listing && !loading && !error && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    className="h-[550px]"
                                    style={{
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: "cover",
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                                setCopied(false);
                            }, 2000);
                        }}
                        className="fixed top-[23%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer"
                    >
                        <FaShare className="text-slate-500" />
                    </div>

                    {copied && (
                        <p className="fixed top-[23%] right-[8%] z-10 rounded-md bg-slate-100 p-2">
                            Link copied!
                        </p>
                    )}

                    <div className="flex max-w-4xl mx-auto p-3 my-7 flex-col gap-4">
                        <p className="font-semibold text-2xl">
                            {listing.name} - ${" "}
                            {listing.regularPrice.toLocaleString("en-US")}
                            {listing.type === "rent" && " / month"}
                        </p>

                        <p className="flex items-center gap-2 mt-6 text-sm text-slate-700">
                            <FaMapMarkerAlt className="text-green-700" />
                            {listing.address}
                        </p>

                        <div className="flex gap-4">
                            <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                                {listing.type === "rent"
                                    ? "For Rent"
                                    : "For Sale"}
                            </p>

                            {listing.offer && (
                                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                                    $
                                    {+listing.regularPrice -
                                        +listing.discountPrice}
                                </p>
                            )}
                        </div>

                        <p className="text-slate-700">
                            <span className="font-semibold text-black">
                                Description -{" "}
                            </span>
                            {listing.description}
                        </p>

                        <ul className="flex gap-4 text-green-900 font-semibold text-sm sm:gap-6 items-center flex-wrap">
                            <li className="flex gap-1 items-center whitespace-nowrap">
                                <FaBed className="text-lg" />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} Beds`
                                    : `${listing.bedrooms} Bed`}
                            </li>
                            <li className="flex gap-1 items-center whitespace-nowrap">
                                <FaBath className="text-lg" />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} Baths`
                                    : `${listing.bathrooms} Bath`}
                            </li>
                            <li className="flex gap-1 items-center whitespace-nowrap">
                                <FaParking className="text-lg" />
                                {listing.parking
                                    ? "Parking spot"
                                    : "No parking"}
                            </li>
                            <li className="flex gap-1 items-center whitespace-nowrap">
                                <FaChair className="text-lg" />
                                {listing.furnished
                                    ? "Furnished"
                                    : "Unfurnished"}
                            </li>
                        </ul>

                        {/* Contact Landlord */}
                        {currentUser && listing.userRef !== currentUser._id && !contact && (
                            <button onClick={() => setContact(true)} className="border bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
                                Contact landlord
                            </button>
                        )}

                        {contact && <Contact listing={listing}/>}
                    </div>
                </div>
            )}
        </main>
    );
}
