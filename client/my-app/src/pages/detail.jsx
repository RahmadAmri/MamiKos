import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../api/api";
import Navbar from "../components/navbar";

export default function Detail() {
  const [lodging, setLodging] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchLodging = async () => {
      try {
        const response = await api.get(`/pub/${id}`);
        setLodging(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLodging();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Lodging Image */}
            <div className="md:w-1/3">
              <img
                src={lodging?.imgUrl}
                alt={lodging?.name}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Right side - Lodging Details */}
            <div className="md:w-2/3">
              <h1 className="text-4xl font-bold mb-4">{lodging?.name}</h1>

              {/* Type Badge */}
              <div className="mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {lodging?.Type?.name}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6">{lodging?.facility}</p>

              {/* Additional Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-gray-400 text-sm">Location</h3>
                  <p className="text-lg">{lodging?.location}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Room Capacity</h3>
                  <p className="text-lg">{lodging?.roomCapacity} persons</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Price</h3>
                  <p className="text-lg">${lodging?.price}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Owner</h3>
                  <p className="text-lg">{lodging?.User?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
