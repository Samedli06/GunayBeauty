import { useEffect, useState } from "react";
import { useEditBrandWithImageMutation, API_BASE_URL } from "../../../store/API";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "react-toastify";

const EditBrandUI = ({ item, setOpen }) => {
  const [editBrand, { isLoading: isBrandLoading }] = useEditBrandWithImageMutation();

  const [formData, setFormData] = useState({
    name: "",
    sortOrder: 0,
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        sortOrder: item.sortOrder || 0,
        isActive: item.isActive !== undefined ? item.isActive : true,
      });

      // Set existing image preview
      if (item.logoUrl) {
        setImagePreview(`${API_BASE_URL}/${item.logoUrl}`);
      }
    }
  }, [item]);

  const handleBrand = async (e) => {
    e.preventDefault();
    try {
      const brandData = {
        name: formData.name,
        isActive: formData.isActive,
        sortOrder: Number(formData.sortOrder),
        logoUrl: item.logoUrl,
      };

      await editBrand({
        id: item.id,
        brandData: brandData,
        imageFile: imageFile,
      }).unwrap();

      toast.success("Brend uğurla yeniləndi");
      setOpen();

    } catch (error) {
      toast.error(error?.data?.message || "Brendi yeniləmək uğursuz oldu");
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(item?.logoUrl ? `${API_BASE_URL}/${item.logoUrl}` : null);
  };

  return (
    <form
      onSubmit={handleBrand}
      className="flex flex-col gap-6 p-6 bg-[#1f1f1f] rounded-lg w-96 max-h-[90vh] overflow-y-auto"
    >
      {/* Name Field */}
      <div className="flex flex-col">
        <label className="text-white text-sm mb-1" htmlFor="name">
          Ad <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          onChange={handleChange}
          name="name"
          type="text"
          required
          value={formData.name}
          className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-400"
        />
      </div>

      {/* Sort Order Field */}
      <div className="flex flex-col">
        <label className="text-white text-sm mb-1" htmlFor="sortOrder">
          Sıra nömrəsi
        </label>
        <input
          id="sortOrder"
          onChange={handleChange}
          name="sortOrder"
          type="number"
          value={formData.sortOrder}
          className="w-full px-4 py-3 rounded-lg bg-[#2a2a2a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
        />
      </div>

      {/* Is Active Field */}
      <div className="flex items-center gap-3">
        <input
          id="isActive"
          onChange={handleChange}
          name="isActive"
          type="checkbox"
          checked={formData.isActive}
          className="w-5 h-5 rounded border-gray-700 bg-[#2a2a2a] text-white focus:ring-white"
        />
        <label className="text-white text-sm cursor-pointer" htmlFor="isActive">
          Aktivdir
        </label>
      </div>

      {/* Image Upload Field */}
      <div className="flex flex-col">
        <label className="text-white text-sm mb-2">
          Brend loqosu
        </label>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative mb-3">
            <img
              src={imagePreview}
              alt="Brand logo preview"
              className="relative w-32 h-32 mx-auto object-cover rounded-lg border-2 border-gray-700"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 right-24 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* Upload Button */}
        <label
          htmlFor="imageFile"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[#2a2a2a] text-white rounded-lg border border-gray-700 hover:bg-[#333] cursor-pointer transition"
        >
          <Upload className="w-5 h-5" />
          <span>{imageFile ? "Şəkli dəyişdir" : "Şəkil yüklə"}</span>
        </label>
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {imageFile && (
          <p className="text-sm text-gray-400 mt-2">
            Seçildi: {imageFile.name}
          </p>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={setOpen}
          className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all"
        >
          Ləğv et
        </button>
        <button
          type="submit"
          disabled={isBrandLoading}
          className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBrandLoading ? (
            <Loader2 className="w-6 h-6 text-black animate-spin" />
          ) : (
            "Yadda saxla"
          )}
        </button>
      </div>
    </form>
  );
};

export default EditBrandUI;