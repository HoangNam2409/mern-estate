import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";

import ListingItem from "../components/ListingItem";

export default function Home() {
    SwiperCore.use([Navigation]);
    const [offerlistings, setOfferListings] = useState([]);
    const [rentlistings, setRentlistings] = useState([]);
    const [salelistings, setSalelistings] = useState([]);

    useEffect(() => {
        const fetchOfferListings = async () => {
            const res = await fetch("/api/listing/get?offer=true&limit=4");
            const data = await res.json();
            setOfferListings(data);
            fetchRentListings();
        };

        const fetchRentListings = async () => {
            const res = await fetch("/api/listing/get?rent=true&limit=4");
            const data = await res.json();
            setRentlistings(data);
            fetchSaleListings();
        };

        const fetchSaleListings = async () => {
            const res = await fetch("/api/listing/get?sale=true&limit=4");
            const data = await res.json();
            setSalelistings(data);
        };

        fetchOfferListings();
    }, []);

    return (
        <div>
            {/* Top */}
            <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
                <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
                    Find your next{" "}
                    <span className="text-slate-500">perfect</span>
                    <br />
                    place with ease
                </h1>

                <div className="text-gray-400 text-xs sm:text-sm">
                    HarryNam Estate will help you find your home fast, easy and
                    comfortable.
                    <br />
                    Our expert support are always available.
                </div>

                <Link
                    className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
                    to="/search"
                >
                    Let's start now...
                </Link>
            </div>

            {/* Swiper */}
            <Swiper navigation>
                {offerlistings &&
                    offerlistings.length > 0 &&
                    offerlistings.map((listing) => {
                        return (
                            <SwiperSlide key={listing.imageUrls[0]}>
                                <div
                                    className="h-[550px]"
                                    style={{
                                        background: `url(${listing.imageUrls[0]}) center no-repeat`,
                                        backgroundSize: "cover",
                                    }}
                                ></div>
                            </SwiperSlide>
                        );
                    })}
            </Swiper>

            {/* Listings result for offer, sale and rent */}
            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
                {offerlistings && offerlistings.length > 0 && (
                    <div className="">
                        <div className="my-3">
                            <h2 className="text-2xl font-semibold text-slate-700">
                                Recent offers
                            </h2>
                            <Link
                                className="text-sm text-blue-800 hover:underline"
                                to={`/search?offer=true`}
                            >
                                Show more offers
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {offerlistings.map((listing) => (
                                <ListingItem
                                    key={listing._id}
                                    listing={listing}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {rentlistings && rentlistings.length > 0 && (
                    <div className="">
                        <div className="my-3">
                            <h2 className="text-2xl font-semibold text-slate-700">
                                Recent places for rent
                            </h2>
                            <Link
                                className="text-sm text-blue-800 hover:underline"
                                to={`/search?type=rent`}
                            >
                                Show more places for rent
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {rentlistings.map((listing) => (
                                <ListingItem
                                    key={listing._id}
                                    listing={listing}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {salelistings && salelistings.length > 0 && (
                    <div className="">
                        <div className="my-3">
                            <h2 className="text-2xl font-semibold text-slate-700">
                                Recent places for sale
                            </h2>
                            <Link
                                className="text-sm text-blue-800 hover:underline"
                                to={`/search?type=sale`}
                            >
                                Show more places for sale
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {salelistings.map((listing) => (
                                <ListingItem
                                    key={listing._id}
                                    listing={listing}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
