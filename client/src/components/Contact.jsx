import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if (data.success === false) {
                    console.log(data.message);
                    return;
                }
                setLandlord(data);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchLandlord();
    }, [listing.userRef]);

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    return (
        <>
            {landlord && (
                <div className="flex flex-col gap-2">
                    <p>
                        Contact{" "}
                        <span className="font-semibold">
                            {landlord.username}
                        </span>{" "}
                        for{" "}
                        <span className="font-semibold">
                            {listing.name.toUpperCase()}
                        </span>
                    </p>
                    <textarea
                        className="w-full border p-3 rounded-lg"
                        name="message"
                        id="message"
                        rows="2"
                        value={message}
                        onChange={handleChange}
                        placeholder="Enter your message here..."
                    ></textarea>

                    <Link 
                        to={`mailto:${landlord.email}?subject=Regarding ${landlord.name}&body=${message}`}
                        className="bg-slate-700 text-white rounded-lg hover:opacity-95 uppercase p-3 text-center"
                    >
                        Send message
                    </Link>
                </div>
            )}
        </>
    );
}
