import { useEffect, useState } from "react";
import { X, Upload, Trash2, Plus, FileText } from "lucide-react";
import { useAddDetailImagesMutation, useAddProductMutation, useGetCategoriesQuery, useGetUserRolesQuery, useAddProductPdfMutation, useGetProductPdfsQuery, useGetBrandsQuery, useGetBrandQuery, useGetProductsBrandQuery } from "../../../store/API";
import { toast } from "react-toastify";
import { WiRefresh } from "react-icons/wi";

const ProductFormUI = ({ setOpen }) => {

  const { data: userRoles, error, isRolesLoading, refetch } = useGetUserRolesQuery();

  // Map user role IDs to Azerbaijani names
  const getRoleName = (roleId) => {
    const roleNames = {
      1: "ümumi",
      2: "topdan",
      3: "diller",
      4: "eksklüziv diller"
    };
    return roleNames[roleId] || userRoles?.[roleId]?.name || `Role ${roleId}`;
  };
  const { data: categories, isLoading, errorC } = useGetCategoriesQuery();
  const [sortedCat, setSortedCat] = useState([]);

  useEffect(() => {
    if (categories) {
      setSortedCat([...categories].sort((a, b) => a.name.localeCompare(b.name)));
    }
  }, [categories]);
  const { data: brands, isLoading: isBrandsLoading } = useGetBrandsQuery();
  const { data: brand, isLoading: isBrandLoading } = useGetBrandQuery("1cd62de1-35cd-4d90-b767-dc1a443bdb3f");
  const { data: brandPr, isLoading: is } = useGetProductsBrandQuery({ brandSlug: "hp" });


  const { data: pdfs } = useGetProductPdfsQuery();
  const [addProduct, { isLoading: isProductLoading }] = useAddProductMutation();
  const [addDetailImages, { isLoading: isDetailLoading }] = useAddDetailImagesMutation();
  const [addProductPdf, { isLoading: isPdfLoading }] = useAddProductPdfMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    sku: "",
    isActive: true,
    isHotDeal: false,
    stockQuantity: 0,
    categoryId: "",
    brandId: "",
    price: "",
    discountedPrice: "",
    detailImageUrls: [],
  });





  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDescription, setPdfDescription] = useState("");
  const [pdfCustomName, setPdfCustomName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImageUrl(null);
    }
  }, [file]);

  // Multiple files preview
  useEffect(() => {
    if (files && files.length > 0) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setImageUrls(urls);

      return () => {
        urls.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      setImageUrls([]);
    }
  }, [files]);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    e.target.value = "";
  };

  const handleMultipleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles || selectedFiles.length === 0) return;

    setFiles(prev => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const handlePdfUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast.error("Zəhmət olmasa yalnız PDF faylları yükləyin");
      return;
    }

    setPdfFile(selectedFile);
    e.target.value = "";
  };

  const removeDetailImage = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removePdfFile = () => {
    setPdfFile(null);
    setPdfDescription("");
    setPdfCustomName("");
  };

  const close = () => {
    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      sku: "",
      isHotDeal: false,
      stockQuantity: "",
      categoryId: "",
      brandId: "",
      price: "",
      discountedPrice: "",
      minimumOrderQuantity: "",
    });
    setFile(null);
    setFiles([]);
    setPdfFile(null);
    setPdfDescription("");
    setPdfCustomName("");
    setOpen(false);
  }

  const handleProductFormData = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Zəhmət olmasa əvvəlcə şəkil yükləyin");
      return;
    }

    try {
      const formDataToSend = new FormData();
      const productData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        sku: formData.sku,
        isActive: formData.isActive,
        isHotDeal: formData.isHotDeal,
        stockQuantity: Number(formData.stockQuantity) || 0,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        price: Number(formData.price) || 0,
        discountedPrice: Number(formData.discountedPrice) || 0,
        minimumOrderQuantity: Number(formData.minimumOrderQuantity) || 0,
        detailImageUrls: [],
      };

      const productDataString = JSON.stringify(productData);
      formDataToSend.append("productData", productDataString);
      formDataToSend.append("imageFile", file, file.name);


      // Add the product first
      const result = await addProduct(formDataToSend).unwrap();

      // If there are detail images, upload them
      if (files.length > 0) {
        const detailImagesFormData = new FormData();

        files.forEach(file => {
          detailImagesFormData.append("imageFiles", file, file.name);
        });

        const resultDetail = await addDetailImages({
          id: result.id,
          images: detailImagesFormData
        }).unwrap();
      }

      // If there is a PDF file, upload it
      if (pdfFile) {
        const pdfFormData = new FormData();
        pdfFormData.append("ProductId", result.id);
        pdfFormData.append("PdfFile", pdfFile, pdfFile.name);

        if (pdfCustomName) {
          pdfFormData.append("CustomFileName", pdfCustomName);
        }

        if (pdfDescription) {
          pdfFormData.append("Description", pdfDescription);
        }

        pdfFormData.append("IsActive", "true");

        await addProductPdf({
          productId: result.id,
          formData: pdfFormData
        }).unwrap();
      }

      toast.success("Məhsul uğurla əlavə edildi");
      close();
    } catch (error) {
      toast.error(error?.data || error?.message || "Nəsə səhv getdi");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name == "stockQuantity" ? Number(value) : value
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-[#1f1f1f] text-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto dark-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold !text-white">Yeni məhsul əlavə et</h2>
      </div>

      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Məhsul adı *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Məhsul adını daxil edin"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium mb-2">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="SKU daxil edin"
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">Stok miqdarı *</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity === 0 ? '' : formData.stockQuantity}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Kateqoriya *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 dark-scrollbar bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>Kateqoriya seçin</option>
              {sortedCat?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium mb-2">Brend *</label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Brend seçin</option>
              {brands?.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hot Deal Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isHotDeal"
            name="isHotDeal"
            checked={formData.isHotDeal}
            onChange={handleInputChange}
            className="w-4 h-4 text-indigo-600 bg-[#2c2c2c] border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
          />
          <label htmlFor="isHotDeal" className="text-sm font-medium">
            Xüsusi təklif kimi işarələ
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="w-4 h-4 text-indigo-600 bg-[#2c2c2c] border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Aktiv
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Açıqlama</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Məhsul açıqlamasını daxil edin"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Qısa açıqlama</label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            rows="2"
            className="w-full px-3 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Qısa açıqlama daxil edin"
          />
        </div>

        {/* Pricing Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#2c2c2c] rounded-md border border-gray-600">
          <div>
            <label className="block text-sm font-medium mb-2">Qiymət</label>
            <input
              type="number"
              name="price"
              value={formData.price === 0 ? "" : formData.price}
              onChange={handlePriceChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-[#1f1f1f] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Endirimli qiymət</label>
            <input
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice === 0 ? "" : formData.discountedPrice}
              onChange={handlePriceChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-[#1f1f1f] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">Məhsul şəkilləri</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-gray-400">
                Şəkil yükləmək üçün klik edin və ya sürükləyin
              </span>
              <span className="text-sm text-gray-500">
                PNG, JPG, GIF up to 10MB each
              </span>
            </label>
          </div>

          {/* Image Previews */}
          {file &&
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="relative group">
                <img
                  src={imageUrl}
                  alt="Product preview"
                  className="w-full h-24 object-cover rounded-md border "
                />
                <button
                  type="button"
                  onClick={() => { setFile(null) }}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          }
        </div>

        {/* Detailed Images */}
        <div>
          <label className="block text-sm font-medium mb-2">Ətraflı şəkillər</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleFileUpload}
              className="hidden"
              id="detail-image-upload"
            />
            <label
              htmlFor="detail-image-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-gray-400">
                Şəkil yükləmək üçün klik edin və ya sürükləyin
              </span>
              <span className="text-sm text-gray-500">
                PNG, JPG, GIF up to 10MB each
              </span>
            </label>
          </div>

          {/* Multiple Image Previews */}
          {files.length > 0 &&
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrls[index]}
                    alt={`Detail preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border "
                  />
                  <button
                    type="button"
                    onClick={() => removeDetailImage(index)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          }
        </div>

        {/* PDF Upload Section */}
        <div>
          <label className="block text-sm font-medium mb-2">Məhsul spesifikasiyası (PDF)</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <FileText className="w-8 h-8 text-gray-400" />
              <span className="text-gray-400">
                PDF spesifikasiya yükləmək üçün klik edin
              </span>
              <span className="text-sm text-gray-500">
                PDF up to 10MB
              </span>
            </label>
          </div>

          {/* PDF Preview and Details */}
          {pdfFile &&
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-[#2c2c2c] rounded-md">
                <FileText className="w-8 h-8 text-indigo-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{pdfFile.name}</p>
                  <p className="text-xs text-gray-400">
                    {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removePdfFile}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* PDF Custom Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Xüsusi fayl adı (İxtiyari)
                </label>
                <input
                  type="text"
                  value={pdfCustomName}
                  onChange={(e) => setPdfCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="PDF üçün xüsusi ad daxil edin"
                />
              </div>

              {/* PDF Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  PDF açıqlaması (İxtiyari)
                </label>
                <textarea
                  value={pdfDescription}
                  onChange={(e) => setPdfDescription(e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="PDF üçün açıqlama daxil edin"
                />
              </div>
            </div>
          }
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => close()}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold"
            disabled={isProductLoading || isDetailLoading || isPdfLoading}
          >
            Ləğv et
          </button>
          <button
            type="button"
            onClick={handleProductFormData}
            disabled={isProductLoading || isDetailLoading || isPdfLoading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProductLoading || isDetailLoading || isPdfLoading ? "Əlavə edilir..." : "Məhsul əlavə et"}
          </button>
        </div>
      </div>
    </div >
  );
};

export default ProductFormUI;