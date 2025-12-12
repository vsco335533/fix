import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Send } from "lucide-react";
import { apiGet, apiPost, apiPut } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Category, Tag } from "../types";

export function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    type: "research" as "research" | "field_study" | "opinion",
    category_id: "",
    featured_image_url: "",
    document_url: "",
  });

  useEffect(() => {
    loadCategories();
    loadTags();
    if (id) loadPost();
  }, [id]);

  // Load categories
  const loadCategories = async () => {
    const data = await apiGet("/categories");
    setCategories(data || []);
  };

  // Load tags
  const loadTags = async () => {
    const data = await apiGet("/tags");
    setTags(data || []);
  };

  // Load post (edit mode)
  const loadPost = async () => {
    const data = await apiGet(`/posts/${id}`);
    if (data) {
      setFormData({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || "",
        type: data.type,
        category_id: data.category?.id || "",
        featured_image_url: data.featured_image_url || "",
        document_url: data.document_url || "",
      });
    }
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // Save post
  const handleSave = async (status: "draft" | "submitted") => {
    // if (!profile)    alert("Please sign in to continue.");
    // navigate("/signin"); // or your auth route
    // return;
          if (!profile) {
        alert("Please sign in to continue.");
        navigate("/login"); // your actual login route
        return;
      }

    setLoading(true);

    const slug = generateSlug(formData.title);

    const payload = {
      ...formData,
      slug,
      category_id: formData.category_id ? Number(formData.category_id) : null,
      status,
    };

    try {
      if (id) {
        // Update existing post
        await apiPut(`/posts/${id}`, payload);
      } else {
        // Create new post
        await apiPost("/posts", payload);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving post:", err);
      alert("Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {id ? "Edit Post" : "Create New Post"}
        </h1>

        <div className="bg-white rounded-xl border p-6 space-y-6">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Enter a compelling title"
            />
          </div>

          {/* TYPE + CATEGORY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as any })
                }
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="research">Research Article</option>
                <option value="field_study">Field Study</option>
                <option value="opinion">Opinion</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* EXCERPT */}
          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={12}
              className="w-full px-4 py-3 border rounded-lg font-mono"
            />
          </div>

          {/* IMAGE + DOCUMENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                value={formData.featured_image_url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_image_url: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Document URL (PDF)
              </label>
              <input
                type="url"
                value={formData.document_url}
                onChange={(e) =>
                  setFormData({ ...formData, document_url: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 pt-4 border-t">

            <button
              onClick={() => handleSave("draft")}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 border rounded-lg"
            >
              <Save className="w-5 h-5" />
              Save as Draft
            </button>

            <button
              onClick={() => handleSave("submitted")}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg"
            >
              <Send className="w-5 h-5" />
              Submit for Review
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 text-gray-600"
            >
              Cancel
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
