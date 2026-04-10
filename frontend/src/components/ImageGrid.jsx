import { useEffect, useState } from 'react';
import { fetchImages, deleteImage } from '../api';
import { Trash2, ExternalLink } from 'lucide-react';

const ImageGrid = ({ refreshTrigger }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Jab page load ho ya naya upload aae, images laao
  useEffect(() => {
    const loadImages = async () => {
      try {
        const { data } = await fetchImages();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm("Aap is image ko sach mein completely delete karna chahte hain?")) return;

    try {
      await deleteImage(id);
      // Agar API Delete pass ho gaya to Grid se bhi seedha hatado
      setImages(images.filter((img) => img._id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Delete fail ho gaya! Server connectivity check karein.");
    }
  };

  if (loading) {
    return <div className="text-center mt-12 text-gray-500 animate-pulse">Database se images laa rahe hain...</div>;
  }

  if (images.length === 0) {
    return <div className="text-center mt-12 text-gray-500">Koi image nahi mili. Upar box se photo upload karein!</div>;
  }

  return (
    <div className="mt-16 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex justify-between items-center text-gray-800">
        Cloudinary Drive ({images.length})
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img._id} className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition duration-300">

            <div className="aspect-square bg-gray-100 relative">
              <img
                src={img.imageUrl}
                alt={img.originalFilename}
                className="w-full h-full object-cover"
              />

              {/* Hover hone par dikhne wale options */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-4">
                <a
                  href={img.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/90 p-3 rounded-full text-gray-800 hover:bg-white hover:text-blue-600 transition shadow-sm"
                  title="Full Size mein Dekhein"
                >
                  <ExternalLink size={20} />
                </a>
                <button
                  onClick={() => handleDelete(img._id)}
                  className="bg-white p-3 rounded-full text-gray-800 hover:bg-red-500 hover:text-white transition shadow-sm"
                  title="Delete Image"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-600 truncate" title={img.originalFilename}>
                {img.originalFilename || 'Saved Image'}
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
