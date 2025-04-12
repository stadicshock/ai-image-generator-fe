import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   'https://okwkocbowyrkgucbedtt.supabase.co',
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rd2tvY2Jvd3lya2d1Y2JlZHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDEyMzIsImV4cCI6MjA1OTYxNzIzMn0.HtIRxWlb8aiiWOndx-mq7wL9gjrKbxa0bIFE5p69_ps'
// );
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

function App() {
  const [user, setUser] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Ghibli");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) alert(error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const generateImage = async () => {
    setLoading(true);
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const res = await fetch("http://localhost:8080/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt, style }),
    });

    if (!res.ok) {
      alert("Image generation failed");
      setLoading(false);
      return;
    }

    const blob = await res.blob();
    setImageURL(URL.createObjectURL(blob));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-green-100 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8 space-y-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-emerald-700">
          Ghibli AI Generator 🎨
        </h1>

        {!user ? (
          <div className="flex justify-center">
            <button
              onClick={signIn}
              className="bg-emerald-600 text-white px-6 py-2 rounded-xl shadow hover:bg-emerald-700 transition"
            >
              Login with Google
            </button>
          </div>
        ) : (
          <>
            <div className="text-center text-sm text-gray-600">
              Logged in as <span className="font-medium">{user.email}</span>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your magical scene..."
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />

              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none"
              >
                <option value="Ghibli">🎴 Ghibli</option>
                <option value="Disney">🎠 Disney</option>
                <option value="Cyberpunk">🌆 Cyberpunk</option>
              </select>

              <button
                onClick={generateImage}
                disabled={loading}
                className="w-full bg-emerald-500 text-white py-2 rounded-xl shadow hover:bg-emerald-600 transition"
              >
                {loading ? "Generating..." : "Generate Image"}
              </button>
            </div>

            {imageURL && (
              <div className="pt-6">
                <img
                  src={imageURL}
                  alt="Generated"
                  className="w-full rounded-2xl shadow-lg border"
                />
              </div>
            )}

            <div className="pt-4 flex justify-center">
              <button
                onClick={signOut}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
