import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
    const [sitebardata, setSitebardata] = useState({
        searchTerm: "",
        type: "all",
        offer: false,
        parking: false,
        furnished: false,
        sort: "created_at",
        order: "desc",
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const typeFormUrl = urlParams.get("type");
        const parkingFormUrl = urlParams.get("parking");
        const offerFormUrl = urlParams.get("offer");
        const furnishedFormUrl = urlParams.get("furnished");
        const sortFormUrl = urlParams.get("sort");
        const orderFormUrl = urlParams.get("order");

        if (
            searchTermFromUrl ||
            typeFormUrl ||
            parkingFormUrl ||
            offerFormUrl ||
            sortFormUrl ||
            orderFormUrl ||
            furnishedFormUrl
        ) {
            setSitebardata({
                searchTerm: searchTermFromUrl || "",
                type: typeFormUrl || "all",
                offer: offerFormUrl === "true" ? true : false,
                parking: parkingFormUrl === "true" ? true : false,
                furnished: furnishedFormUrl === "true" ? true : false,
                sort: sortFormUrl || "created_at",
                order: orderFormUrl || "desc",
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        if (
            e.target.id === "all" ||
            e.target.id === "rent" ||
            e.target.id === "sale"
        ) {
            setSitebardata({ ...sitebardata, type: e.target.id });
        }

        if (
            e.target.id === "offer" ||
            e.target.id === "parking" ||
            e.target.id === "furnished"
        ) {
            setSitebardata({
                ...sitebardata,
                [e.target.id]: e.target.checked,
            });
        }

        if (e.target.type === "text") {
            setSitebardata({ ...sitebardata, searchTerm: e.target.value });
        }

        if (e.target.id === "sort_order") {
            const sort = e.target.value.split("_")[0] || "created_at";
            const order = e.target.value.split("_")[1] || "desc";

            setSitebardata({ ...sitebardata, sort, order });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set("searchTerm", sitebardata.searchTerm);
        urlParams.set("type", sitebardata.type);
        urlParams.set("offer", sitebardata.offer);
        urlParams.set("parking", sitebardata.parking);
        urlParams.set("furnished", sitebardata.furnished);
        urlParams.set("sort", sitebardata.sort);
        urlParams.set("order", sitebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex items-center gap-2">
                        <label
                            className="whitespace-nowrap font-semibold"
                            htmlFor="searchTerm"
                        >
                            Search Term:{" "}
                        </label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search..."
                            className="border p-3 w-full bg-white rounded-lg"
                            value={sitebardata.searchTerm}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <label className="font-semibold">Type: </label>
                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                checked={sitebardata.type === "all"}
                                type="checkbox"
                                id="all"
                                className="w-5"
                            />
                            <span>Rent & Sale</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                checked={sitebardata.type === "rent"}
                                type="checkbox"
                                id="rent"
                                className="w-5"
                            />
                            <span>Rent</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                checked={sitebardata.type === "sale"}
                                type="checkbox"
                                id="sale"
                                className="w-5"
                            />
                            <span>Sale</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                checked={sitebardata.offer}
                                type="checkbox"
                                id="offer"
                                className="w-5"
                            />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <label className="font-semibold">Amenities: </label>
                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                checked={sitebardata.parking}
                                type="checkbox"
                                id="parking"
                                className="w-5"
                            />
                            <span>Parking</span>
                        </div>

                        <div className="flex gap-2">
                            <input
                                onChange={handleChange}
                                checked={sitebardata.furnished}
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                            />
                            <span>Furnished</span>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center">
                        <label className="font-semibold">Sort: </label>
                        <select
                            onChange={handleChange}
                            defaultValue={"created_at_desc"}
                            id="sort_order"
                            className="border rounded-lg p-3"
                        >
                            <option value="regularPrice_desc">
                                Price high to low
                            </option>
                            <option value="regularPrice_asc">
                                Price low to high
                            </option>
                            <option value="createAt_desc">Latest</option>
                            <option value="createAt_asc">Oldest</option>
                        </select>
                    </div>

                    <button className="bg-slate-700 w-full p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80">
                        Search
                    </button>
                </form>
            </div>

            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-700 border-b p-3 mt-5">
                    Listing results:
                </h1>

                <div className="p-7 flex flex-wrap gap-4">
                    {!loading && listings.length === 0 && (
                        <p className="text-xl text-slate-700">
                            Listing not found!
                        </p>
                    )}

                    {loading && (
                        <p className="text-xl text-slate-700 text-center w-full">
                            Loading...
                        </p>
                    )}

                    {!loading &&
                        listings &&
                        listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))}

                    {showMore && (
                        <button
                            onClick={onShowMoreClick}
                            className="text-green-700 w-full text-center p-7 hover:underline"
                        >
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
