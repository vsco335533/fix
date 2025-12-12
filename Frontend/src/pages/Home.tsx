import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Eye, TrendingUp } from "lucide-react";
import { apiGet } from "../lib/api";
import { PostWithAuthor } from "../types";

export function Home() {
  const [latestPosts, setLatestPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestPosts();
  }, []);

  const loadLatestPosts = async () => {
    try {
      const data = await apiGet("/posts?limit=6");
      setLatestPosts(data || []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-6">
            Advancing Knowledge Through Research
          </h1>
          <p className="text-xl text-gray-100 mb-8">
            Explore groundbreaking research, field studies, and expert insights.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/research"
              className="bg-white text-gray-600 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-50"
            >
              Browse Research <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/videos"
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 border border-gray-400"
            >
              Watch Videos
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST POSTS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest Research</h2>
            <p className="text-gray-600">Recent publications</p>
          </div>

          <Link
            to="/research"
            className="text-gray-600 font-medium flex gap-2 items-center"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 bg-white border rounded-xl animate-pulse">
                <div className="bg-gray-200 h-4 mb-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-3 mb-2 rounded w-full"></div>
                <div className="bg-gray-200 h-3 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : latestPosts.length === 0 ? (
          <p className="text-center text-gray-500">No published posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                to={`/posts/${post.slug}`}
                className="bg-white rounded-xl border hover:shadow-lg transition overflow-hidden"
              >
                {post.featured_image_url && (
                  <div className="aspect-video">
                    <img
                      src={post.featured_image_url}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1 bg-gray-50 text-gray-700 text-xs rounded-full">
                      {post.type.replace("_", " ").toUpperCase()}
                    </span>

                    {post.categories && (
                      <span className="text-xs text-gray-500">
                        {post.categories.name}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex justify-between text-sm text-gray-500 mt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatDate(post.published_at)}
                    </div>

                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {post.view_count}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FEATURES */}
      <section className="bg-white py-16 border-y">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 text-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl">Cutting-Edge Research</h3>
            <p className="text-gray-600 mt-2">
              Access the latest findings from global researchers.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl">Field Studies</h3>
            <p className="text-gray-600 mt-2">
              Explore real-world environmental observations.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl">Expert Opinions</h3>
            <p className="text-gray-600 mt-2">
              Read deep analysis from leading experts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
