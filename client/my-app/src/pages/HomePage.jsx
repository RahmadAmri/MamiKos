import { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import Navbar from "../components/navbar";
import { NavLink, useNavigate } from "react-router";
import Button from "../components/Button";

export default function HomePage() {
  const [result, setResult] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("name-asc");
  const navigate = useNavigate();

  const handleDetail = async (id) => {
    try {
      navigate(`/detail/${id}`);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Failed to load lodging details",
        icon: "error",
      });
    }
  };

  const getPub = async () => {
    try {
      const response = (await api.get(`/pub?search=${search}`)).data;
      let filteredData = [...response.data];

      // filter
      if (priceRange.min !== "" || priceRange.max !== "") {
        filteredData = filteredData.filter((item) => {
          const price = Number(item.price);
          const min = priceRange.min === "" ? 0 : Number(priceRange.min);
          const max = priceRange.max === "" ? Infinity : Number(priceRange.max);
          return price >= min && price <= max;
        });
      }

      //  sorting
      filteredData.sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return Number(a.price) - Number(b.price);
          case "price-desc":
            return Number(b.price) - Number(a.price);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "name-asc":
          default:
            return a.name.localeCompare(b.name);
        }
      });

      setResult({ ...response, data: filteredData });

      if (!filteredData.length) {
        Swal.fire({
          title: "Not Found",
          text: "There is no Lodging matching your criteria",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPub();
  }, [sortBy]);

  const itemsPerPage = 6;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = result?.data?.slice(firstIndex, lastIndex) || [];
  const totalPages = Math.ceil((result?.data?.length || 0) / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              getPub();
              setCurrentPage(1);
            }}
            className="space-y-4"
          >
            {/* Search input */}
            <div className="relative flex items-center shadow-md rounded-lg overflow-hidden">
              <input
                value={search}
                placeholder="Search for lodgings..."
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3 px-4 pr-12 border-0 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <Button
                type="submit"
                variant="primary"
                className="absolute right-0 h-full px-6 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Button>
            </div>

            {/* Filter and Sort */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.length ? (
            currentItems.map((el, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
                    src={el.imgUrl}
                    alt={el.name}
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {el.name}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {el.facility}
                  </p>
                  <div className="flex justify-end space-x-3">
                    <Button
                      onClick={() => handleDetail(el.id)}
                      variant="primary"
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Detail
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16 bg-gray-50 rounded-xl">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-xl text-gray-600">No lodgings found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {result?.data?.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-6 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>

              <div className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                {currentPage}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-6 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>

            <div className="text-gray-600">
              Showing {firstIndex + 1} to{" "}
              {Math.min(lastIndex, result.data.length)} of {result.data.length}{" "}
              entries
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
