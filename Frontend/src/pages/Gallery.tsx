// import { useState, useEffect } from "react";
// import { Image as ImageIcon } from "lucide-react";
// import { apiGet } from "../lib/api";
// import { Media } from "../types";

// export function Gallery() {
//   const [images, setImages] = useState<Media[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadImages();
//   }, []);

//   const loadImages = async () => {
//     try {
//       // Backend → GET /api/media?type=image
//       const data = await apiGet("/media?type=image");

//       setImages(data || []);
//     } catch (error) {
//       console.error("Error loading images:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-gradient-to-br from-gray-900 to-white-400 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h1 className="text-4xl font-bold mb-4">Photo Gallery</h1>
//           <p className="text-xl text-white-100">
//             Visual documentation from field studies and research activities
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {[...Array(8)].map((_, i) => (
//               <div
//                 key={i}
//                 className="aspect-square bg-gray-200 rounded-xl animate-pulse"
//               ></div>
//             ))}
//           </div>
//         ) : images.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//             <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           

//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {images.map((image) => (
//               <div
//                 key={image.id}
//                 className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
//               >
//                 <img
//                   src={image.url}
//                   alt={image.title}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
//                   <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
//                     <h3 className="font-semibold mb-1 line-clamp-2">{image.title}</h3>
//                     {image.description && (
//                       <p className="text-sm text-gray-200 line-clamp-1">
//                         {image.description}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { Image as ImageIcon, Clock } from "lucide-react";
// import { apiGet, apiPost } from "../lib/api";
// import { Media } from "../types";
// import { useAuth } from "../contexts/AuthContext";

// export function Gallery() {
//   const [images, setImages] = useState<Media[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { isAdmin } = useAuth();

//   useEffect(() => {
//     loadImages();
//   }, []);

//   const loadImages = async () => {
//     try {
//       const data = await apiGet("/media?type=image");
//       setImages(data || []);
//     } catch (error) {
//       console.error("Error loading images:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const approveImage = async (id: string) => {
//     await apiPost(`/media/${id}/approve`, {});
//     loadImages(); // refresh after approve
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* HEADER */}
//       <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <h1 className="text-4xl font-bold mb-4">Image Gallery</h1>
//           <p className="text-lg text-blue-100">
//             Browse approved images uploaded by researchers and admins
//           </p>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {loading ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {[...Array(8)].map((_, i) => (
//               <div
//                 key={i}
//                 className="aspect-square bg-gray-200 rounded-xl animate-pulse"
//               ></div>
//             ))}
//           </div>
//         ) : images.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl border">
//             <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500">No images available yet.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {images.map((image) => (
//               <div
//                 key={image.id}
//                 className="bg-white rounded-xl border hover:shadow-lg transition overflow-hidden"
//               >
//                 {/* IMAGE */}
//                 <div className="aspect-square bg-gray-100">
//                   <img
//                     src={image.url}
//                     alt={image.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 {/* INFO */}
//                 <div className="p-3">
//                   <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
//                     {image.title}
//                   </h3>

//                   {image.description && (
//                     <p className="text-xs text-gray-600 line-clamp-2 mb-2">
//                       {image.description}
//                     </p>
//                   )}

//                   <div className="flex items-center justify-between text-xs text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       {new Date(image.created_at).toLocaleDateString()}
//                     </div>

//                     {/* ADMIN APPROVAL */}
//                     {isAdmin && image.status === "pending" && (
//                       <button
//                         onClick={() => approveImage(image.id)}
//                         className="bg-green-600 text-white px-2 py-1 rounded"
//                       >
//                         Approve
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Image as ImageIcon, Clock, Upload, Trash2 } from "lucide-react";
import { apiGet, apiPost, apiDelete } from "../lib/api";
import { Media } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function Gallery() {
  const [images, setImages] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await apiGet("/media?type=image");
      setImages(data || []);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveImage = async (id: string) => {
    try {
      await apiPost(`/media/${id}/approve`, {});
      loadImages();
    } catch {
      alert("Failed to approve image");
    }
  };

  const deleteImage = async (id: string) => {
    if (!id) return alert("Invalid media ID");
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      // ✅ IMPORTANT FIX — send media type
      await apiDelete(`/media/${id}?type=image`);
      loadImages();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete image");
    }
  };

  const handleUploadImage = async (file: File) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("type", "image");

    try {
      setUploading(true);

      const res = await fetch("http://localhost:5000/api/media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      await loadImages();
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Image Gallery</h1>
          <p className="text-lg text-blue-100">
            Browse approved images uploaded by admins
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin && (
          <div className="mb-6">
            <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleUploadImage(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No images available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-xl border hover:shadow-lg transition overflow-hidden"
              >
                <div className="aspect-square bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
                    {image.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(image.created_at).toLocaleDateString()}
                    </div>

                    {isAdmin && (
                      <div className="flex gap-2">
                        {image.status === "pending" && (
                          <button
                            onClick={() => approveImage(image.id)}
                            className="bg-green-600 text-white px-2 py-1 rounded"
                          >
                            Approve
                          </button>
                        )}

                        <button
                          onClick={() => deleteImage(image.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

