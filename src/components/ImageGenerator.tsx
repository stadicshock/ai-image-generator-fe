import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import axios from "axios";

const styles = ["Ghibli", "Cyberpunk", "Pixel Art", "Watercolor", "Realistic"];

const ImageGenerator = ({ session }: { session: any }) => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(styles[0]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    setError("");
    setImage(null);

    try {
      const token = session.access_token;

      const response = await axios.post(
        "http://localhost:8080/generate",
        { prompt, style },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setImage(imageUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Ghibli Style Generator</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>

        <input
          type="text"
          placeholder="Describe your image..."
          className="w-full p-3 border rounded-xl"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full p-3 border rounded-xl"
        >
          {styles.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {image && (
          <img
            src={image}
            alt="Generated"
            className="w-full rounded-xl mt-4 border"
          />
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
