import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, Eye, ArrowLeft } from "lucide-react";
import { apiGet, apiPost } from "../lib/api";
import { PostWithDetails } from "../types";

export function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      const data = await apiGet(`/api/posts/${slug}`);

      if (data) {
        setPost(data);

        // Increase view count
        apiPost(`/api/posts/${data.id}/view`, {});
      }
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <Link to="/" className="text-gray-600 hover:text-gray-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/research"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Research
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {post.featured_image_url && (
            <div className="aspect-video bg-gray-100">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded-full">
                {post.type.replace("_", " ").toUpperCase()}
              </span>

              {post.categories && (
                <span className="text-sm text-gray-500">
                  {post.categories.name}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6 pb-6 border-b border-gray-200">
                {post.excerpt}
              </p>
            )}

            {/* Author + Date + Views */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.profiles?.full_name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.view_count} views</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-8">
              {post.content?.split("\n").map((paragraph, i) => (
                <p key={i} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
