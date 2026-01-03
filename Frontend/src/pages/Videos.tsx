// import { useState, useEffect } from "react";
// import { Play, Clock } from "lucide-react";
// import { apiGet } from "../lib/api";  
// import { Media } from "../types";

// export function Videos() {
//   const [videos, setVideos] = useState<Media[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadVideos();
//   }, []);

//   const loadVideos = async () => {
//     try {
//       // Supabase
//       // const { data, error } = await supabase.from("media").select("*")

//       //  Backend API
//       const data = await apiGet("/media?type=video");
//       setVideos(data || []);
//     } catch (error) {
//       console.error("Error loading videos:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDuration = (seconds: number | null) => {
//     if (!seconds) return "N/A";
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-gradient-to-br from-gray-800 to-white-600 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h1 className="text-4xl font-bold mb-4">Video Library</h1>
//           <p className="text-xl text-white-100">
//             Watch presentations, documentaries, and research briefings
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="bg-white rounded-xl border border-gray-200 animate-pulse">
//                 <div className="aspect-video bg-gray-200"></div>
//                 <div className="p-4">
//                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : videos.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//             <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500">No videos available yet. Check back soon!</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {videos.map((video) => (
//               <div
//                 key={video.id}
//                 className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-red-200 transition-all duration-300"
//               >
//                 <div className="relative aspect-video bg-gray-100">
//                   {video.thumbnail_url ? (
//                     <video
//                           controls
//                           src={video.url}
//                           className="w-full h-full object-cover"
//                         />
                        

//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
//                       <Play className="w-16 h-16 text-white opacity-50" />
//                     </div>
//                   )}

//                   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
//                     <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                       <Play className="w-8 h-8 text-red-600 ml-1" />
//                     </div>
//                   </div>

//                   {video.duration && (
//                     <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
//                       {formatDuration(video.duration)}
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-4">
//                   <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
//                     {video.title}
//                   </h3>

//                   {video.description && (
//                     <p className="text-sm text-gray-600 line-clamp-2 mb-3">{video.description}</p>
//                   )}
                 

//                   <div className="flex items-center justify-between text-xs text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       {new Date(video.created_at).toLocaleDateString()}
//                     </div>
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

// import { useState, useEffect } from "react";
// import { Play, Clock } from "lucide-react";
// import { apiGet, apiPost } from "../lib/api";
// import { Media } from "../types";
// import { useAuth } from "../contexts/AuthContext";

// export function Videos() {
//   const [videos, setVideos] = useState<Media[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { isAdmin } = useAuth();

//   useEffect(() => {
//     loadVideos();
//   }, []);

//   const loadVideos = async () => {
//     try {
//       const data = await apiGet("/media?type=video");
//       setVideos(data || []);
//     } catch (error) {
//       console.error("Error loading videos:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDuration = (seconds: number | null) => {
//     if (!seconds) return "N/A";
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const approveVideo = async (id: string) => {
//     await apiPost(`/media/${id}/approve`, {});
//     loadVideos();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <h1 className="text-4xl font-bold mb-4">Video Library</h1>
//           <p className="text-xl text-gray-200">
//             Watch presentations, documentaries, and research briefings
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="bg-white rounded-xl border animate-pulse">
//                 <div className="aspect-video bg-gray-200"></div>
//                 <div className="p-4 h-20 bg-gray-100"></div>
//               </div>
//             ))}
//           </div>
//         ) : videos.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl border">
//             <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500">No videos available yet.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {videos.map((video) => (
//               <div
//                 key={video.id}
//                 className="bg-white rounded-xl border hover:shadow-lg transition"
//               >
//                 {/* VIDEO PLAYER */}
//                 <div className="relative aspect-video bg-black">
//                   <video
//                     src={video.url}
//                     controls
//                     className="w-full h-full object-cover rounded-t-xl"
//                   ></video>

//                   {video.duration && (
//                     <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
//                       {formatDuration(video.duration)}
//                     </div>
//                   )}
//                 </div>

//                 {/* CONTENT */}
//                 <div className="p-4">
//                   <h3 className="text-lg font-bold text-gray-900 mb-2">
//                     {video.title}
//                   </h3>

//                   {video.description && (
//                     <p className="text-sm text-gray-600 mb-3">
//                       {video.description}
//                     </p>
//                   )}

//                   <div className="flex items-center justify-between text-xs text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       {new Date(video.created_at).toLocaleDateString()}
//                     </div>

//                     {/* ADMIN APPROVAL */}
//                     {isAdmin && video.status === "pending" && (
//                       <button
//                         onClick={() => approveVideo(video.id)}
//                         className="bg-green-600 text-white px-3 py-1 rounded"
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


// import { useState, useEffect } from "react";
// import { Play, Clock, Upload, Trash2 } from "lucide-react";
// import { apiGet, apiPost, apiDelete } from "../lib/api";
// import { Media } from "../types";
// import { useAuth } from "../contexts/AuthContext";

// export function Videos() {
//   const [videos, setVideos] = useState<Media[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const { isAdmin } = useAuth();

//   useEffect(() => {
//     loadVideos();
//   }, []);

//   const loadVideos = async () => {
//     try {
//       const data = await apiGet("/media?type=video");
//       setVideos(data || []);
//     } catch (error) {
//       console.error("Error loading videos:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDuration = (seconds: number | null) => {
//     if (!seconds) return "N/A";
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const approveVideo = async (id: string) => {
//     try {
//       await apiPost(`/media/${id}/approve`, {});
//       loadVideos();
//     } catch {
//       alert("Failed to approve video");
//     }
//   };

//   const deleteVideo = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this video?")) return;

//     try {
//       await apiDelete(`/media/${id}`);
//       loadVideos();
//     } catch {
//       alert("Failed to delete video");
//     }
//   };

//   // ✅ FILE UPLOAD HANDLER (ADMIN ONLY)
//   const handleUploadVideo = async (file: File) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Not authenticated");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("title", file.name);
//     formData.append("type", "video");

//     try {
//       setUploading(true);

//       const res = await fetch("http://localhost:5000/api/media/upload", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error("Upload failed");
//       }

//       await loadVideos();
//     } catch (error) {
//       console.error("Video upload failed:", error);
//       alert("Failed to upload video");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* HEADER */}
//       <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4">
//           <h1 className="text-4xl font-bold mb-4">Video Library</h1>
//           <p className="text-xl text-gray-200">
//             Watch presentations, documentaries, and research briefings
//           </p>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* ✅ ADMIN UPLOAD BUTTON */}
//         {isAdmin && (
//           <div className="mb-6">
//             <label className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
//               <Upload className="w-4 h-4" />
//               {uploading ? "Uploading..." : "Upload Video"}
//               <input
//                 type="file"
//                 accept="video/*"
//                 className="hidden"
//                 disabled={uploading}
//                 onChange={(e) => {
//                   if (e.target.files?.[0]) {
//                     handleUploadVideo(e.target.files[0]);
//                   }
//                 }}
//               />
//             </label>
//           </div>
//         )}

//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="bg-white rounded-xl border animate-pulse">
//                 <div className="aspect-video bg-gray-200"></div>
//                 <div className="p-4 h-20 bg-gray-100"></div>
//               </div>
//             ))}
//           </div>
//         ) : videos.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-xl border">
//             <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500">No videos available yet.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {videos.map((video) => (
//               <div
//                 key={video._id}
//                 className="bg-white rounded-xl border hover:shadow-lg transition"
//               >
//                 {/* VIDEO PLAYER */}
//                 <div className="relative aspect-video bg-black">
//                   <video
//                     src={video.url}
//                     controls
//                     className="w-full h-full object-cover rounded-t-xl"
//                   />

//                   {video.duration && (
//                     <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
//                       {formatDuration(video.duration)}
//                     </div>
//                   )}
//                 </div>

//                 {/* CONTENT */}
//                 <div className="p-4">
//                   <h3 className="text-lg font-bold text-gray-900 mb-2">
//                     {video.title}
//                   </h3>

//                   {video.description && (
//                     <p className="text-sm text-gray-600 mb-3">
//                       {video.description}
//                     </p>
//                   )}

//                   <div className="flex items-center justify-between text-xs text-gray-500">
//                     <div className="flex items-center gap-1">
//                       <Clock className="w-3 h-3" />
//                       {new Date(video.created_at).toLocaleDateString()}
//                     </div>

//                     {/* ADMIN ACTIONS */}
//                     {isAdmin && (
//                       <div className="flex gap-2">
//                         {video.status === "pending" && (
//                           <button
//                             onClick={() => approveVideo(video._id)}
//                             className="bg-green-600 text-white px-3 py-1 rounded"
//                           >
//                             Approve
//                           </button>
//                         )}

//                         <button
//                           onClick={() => deleteVideo(video._id)}
//                           className="bg-red-600 text-white px-3 py-1 rounded"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
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
import { useState, useEffect } from "react";
import { Play, Clock, Trash2, Check } from "lucide-react";
import { apiGet, apiPost, apiDelete } from "../lib/api";
import { Media } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function Videos() {
  const [videos, setVideos] = useState<Media[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const data = await apiGet("/media?type=video");
    setVideos(data || []);
    setLoading(false);
  };

  const submitVideo = async () => {
    if (!youtubeUrl) return alert("Paste YouTube URL");

    setSubmitting(true);
    try {
      await apiPost("/media/upload", {
        type: "video",
        youtube_url: youtubeUrl,
        title: "YouTube Video",
      });
      setYoutubeUrl("");
      loadVideos();
    } catch {
      alert("Invalid YouTube URL");
    } finally {
      setSubmitting(false);
    }
  };

  const approveVideo = async (id: string) => {
    await apiPost(`/media/${id}/approve`, {});
    loadVideos();
  };

  const deleteVideo = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    await apiDelete(`/media/${id}`);
    loadVideos();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* ADMIN ADD VIDEO */}
      {isAdmin && (
        <div className="mb-6 flex gap-2">
          <input
            className="flex-1 border p-2 rounded"
            placeholder="Paste YouTube URL"
            value={youtubeUrl}
            onChange={e => setYoutubeUrl(e.target.value)}
          />
          <button
            onClick={submitVideo}
            disabled={submitting}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Add Video
          </button>
        </div>
      )}

      {/* VIDEO GRID */}
      {loading ? (
        <p>Loading…</p>
      ) : videos.length === 0 ? (
        <p>No videos yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <div key={video.id} className="bg-white border rounded-xl">
              <iframe
                src={video.url}
                className="w-full aspect-video rounded-t-xl"
                allowFullScreen
              />

              <div className="p-4">
                <h3 className="font-bold">{video.title}</h3>

                <div className="flex justify-between mt-3">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(video.created_at).toLocaleDateString()}
                  </span>

                  {isAdmin && (
                    <div className="flex gap-2">
                      {video.status === "pending" && (
                        <button
                          onClick={() => approveVideo(video.id)}
                          className="bg-green-600 text-white px-2 rounded"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteVideo(video.id)}
                        className="bg-red-600 text-white px-2 rounded"
                      >
                        <Trash2 size={14} />
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
  );
}
