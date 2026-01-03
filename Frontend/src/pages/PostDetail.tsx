import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, User, Eye } from "lucide-react";
import { apiGet } from "../lib/api";

export function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    apiGet(`/posts/${slug}`).then(setPost);
  }, [slug]);

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {post.featured_image_url && (
        <img
          src={post.featured_image_url}
          className="w-full rounded mb-6"
        />
      )}

      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-600 mb-4">{post.excerpt}</p>

      <div className="flex gap-6 text-sm mb-6">
        <span><User /> {post.profiles.full_name}</span>
        <span><Calendar /> {new Date(post.published_at).toDateString()}</span>
        <span><Eye /> {post.view_count}</span>
      </div>

      <div className="prose mb-6">
        {post.content}
      </div>

      {/* 📄 PDFs */}
      {post.media.filter((m: any) => m.type === "pdf").length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Documents</h3>
          {post.media
            .filter((m: any) => m.type === "pdf")
            .map((pdf: any) => (
              <a
                key={pdf.id}
                href={pdf.url}
                download
                className="block text-blue-600 underline mb-2"
              >
                📄 {pdf.title || "Download PDF"}
              </a>
            ))}
        </div>
      )}
    </div>
  );
}
