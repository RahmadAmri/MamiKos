import { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router";
import Navbar from "../components/navbar";
import Button from "../components/Button";

const initialForm = {
  name: "",
  facility: "",
  roomCapacity: 0,
  imgUrl: "",
  location: "",
  price: 0,
  TypeId: "",
};

export default function AddEdit() {
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [types, setTypes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const isEdit = location.state?.lodging ? true : false;

  useEffect(() => {
    fetchTypes();
    if (location.state?.lodging) {
      setForm(location.state.lodging);
    }
  }, [location]);

  const fetchTypes = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/type", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const typesData = response.data?.data || response.data || [];
      setTypes(Array.isArray(typesData) ? typesData : []);
    } catch (error) {
      console.error("Failed to fetch types:", error);
      setTypes([]);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch types. Please make sure you are logged in.",
        icon: "error",
      });
    }
  };
  const onChangeForm = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    onChangeForm("imgUrl", previewUrl);
  };

  // hanya saat untuk EDIT
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("imgUrl", file);

    try {
      const response = await api.patch(`/lodging/${form.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.imgUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const createLodging = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return Swal.fire({
          title: "Adding Failed",
          text: "Please login first!",
          icon: "error",
        });
      }

      const requiredFields = [
        "name",
        "facility",
        "roomCapacity",
        "location",
        "price",
        "TypeId",
        "imgUrl",
      ];
      const emptyFields = requiredFields.filter((field) => {
        const value = form[field];
        if (field === "TypeId") {
          return value === "" || value === null || value === undefined;
        }
        return value === "" || value === null || value === undefined;
      });

      if (emptyFields.length > 0) {
        return Swal.fire({
          title: "Add error",
          text: `Please fill in the following fields: ${emptyFields.join(
            ", "
          )}`,
          icon: "warning",
        });
      }

      const response = await api.post("/lodging", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "Success Added",
        text: response.data.message,
        icon: "success",
      });
      navigate("/cms");
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: error.message || "Please fill all form",
        icon: "warning",
      });
    }
  };

  const updateLodging = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        return Swal.fire({
          title: "Fail to edit",
          text: "Please login first",
          icon: "error",
        });
      }

      const requiredFields = [
        "name",
        "facility",
        "roomCapacity",
        "location",
        "price",
        "TypeId",
      ];
      const emptyFields = requiredFields.filter((field) => {
        const value = form[field];
        return (
          value === "" || value === 0 || value === null || value === undefined
        );
      });

      if (emptyFields.length > 0) {
        return Swal.fire({
          title: "Edit Error",
          text: `Please fill in the following fields: ${emptyFields.join(
            ", "
          )}`,
          icon: "warning",
        });
      }

      let finalForm = { ...form };

      if (imageFile) {
        try {
          const imgUrl = await uploadImage(imageFile);
          finalForm.imgUrl = imgUrl;
        } catch (error) {
          console.error("Failed to upload image:", error);
          Swal.fire({
            title: "Warning",
            text: "Failed to upload image, proceeding with other updates",
            icon: "warning",
          });
        }
      }

      const response = await api.put(`/lodging/${form.id}`, finalForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm(initialForm);
      setImageFile(null);

      Swal.fire({
        title: "Success Edit",
        text: response.data.message,
        icon: "success",
      });
      navigate("/cms");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update lodging",
        icon: "error",
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateLodging();
    } else {
      createLodging();
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              {isEdit ? "Edit" : "Add New"} Lodging
            </h2>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => onChangeForm("name", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Facility
              </label>
              <textarea
                value={form.facility}
                onChange={(e) => onChangeForm("facility", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 min-h-[100px]"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Room Capacity
              </label>
              <input
                type="number"
                value={form.roomCapacity}
                onChange={(e) =>
                  onChangeForm("roomCapacity", Number(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => onChangeForm("location", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Price
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => onChangeForm("price", Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Type
              </label>
              <select
                value={form.TypeId}
                onChange={(e) => onChangeForm("TypeId", Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
              >
                <option disabled value="">
                  Select Type
                </option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Image
              </label>
              <input
                type={isEdit ? "file" : "text"}
                onChange={(e) =>
                  isEdit
                    ? handleImageChange(e)
                    : onChangeForm("imgUrl", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                accept="image/*"
              />
              {form.imgUrl && isEdit && (
                <div className="mt-4">
                  <img
                    src={form.imgUrl}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-lg font-semibold rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isEdit ? "Update" : "Create"} Lodging
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
