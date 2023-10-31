import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
    return (
        <div className="bg-white shadow-sm hover:shadow-lg transition-shadow rounded-lg overflow-hidden w-full sm:w-[330px]">
            <Link to={`/listing/${listing._id}`}>
                <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 duration-300"
                />

                <div className="p-3 flex flex-col gap-2 w-full">
                    <p className="text-slate-700 font-semibold text-lg truncate">
                        {listing.name}
                    </p>

                    <div className="flex items-center gap-1">
                        <MdLocationOn className="h-4 w-4 text-green-700" />
                        <p className="text-sm truncate text-gray-600">
                            {listing.address}
                        </p>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>

                    <p className="flex items-center text-slate-500 mt-2 font-semibold">
                        $
                        {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / month'}
                    </p>

                    <div className="flex items-center gap-4 text-slate-700">
                        <div className="flex items-center gap-1">
                            <p className="font-bold text-xs">{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Beds`}</p>
                        </div>

                        <div className="flex items-center gap-1">
                            <p className="font-bold text-xs">{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
