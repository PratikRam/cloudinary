import { useEffect, useState } from 'react';
import { fetchFiles, deleteFile } from '../api';
import { Trash2, ExternalLink } from 'lucide-react';

const FileGrid = ({ refreshTrigger }) => {
  const [files, setFiles] = useState([]);
  const [activeFolder, setActiveFolder] = useState('all');
  const [loading, setLoading] = useState(true);

  // Jab page load ho ya naya upload aae, images laao
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const { data } = await fetchFiles();
        setFiles(data);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFiles();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    if (!window.confirm("Aap is image ko sach mein completely delete karna chahte hain?")) return;

    try {
      await deleteFile(id);
      // Agar API Delete pass ho gaya to Grid se bhi seedha hatado
      setFiles(files.filter((file) => file._id !== id));
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Delete fail ho gaya! Server connectivity check karein.");
    }
  };

  if (loading) {
    return <div className="text-center mt-12 text-gray-500 animate-pulse">Database se images laa rahe hain...</div>;
  }

  if (files.length === 0) {
    return <div className="text-center mt-12 text-gray-500">Koi file nahi mili. Upar box se file upload karein!</div>;
  }

  const displayedFiles = files.filter(file => {
    if (!file.resourceType) return true;
    if (activeFolder === 'all') return true;
    if (activeFolder === 'image') return file.resourceType.includes('image');
    if (activeFolder === 'video') return file.resourceType.includes('video');
    if (activeFolder === 'raw') return !file.resourceType.includes('image') && !file.resourceType.includes('video');
    return true;
  });

  return (
    <div className="mt-16 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex justify-between items-center text-gray-800">
        Cloudinary Drive ({displayedFiles.length})
      </h2>

      {/* Folders / Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setActiveFolder('all')}
          className={`px-6 py-2 rounded-lg font-medium transition ${activeFolder === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'}`}>
          All Files
        </button>
        <button
          onClick={() => setActiveFolder('image')}
          className={`px-6 py-2 rounded-lg font-medium transition ${activeFolder === 'image' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'}`}>
          Images
        </button>
        <button
          onClick={() => setActiveFolder('video')}
          className={`px-6 py-2 rounded-lg font-medium transition ${activeFolder === 'video' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'}`}>
          Videos
        </button>
        <button
          onClick={() => setActiveFolder('raw')}
          className={`px-6 py-2 rounded-lg font-medium transition ${activeFolder === 'raw' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'}`}>
          Documents
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedFiles.map((file) => (
          <div key={file._id} className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition duration-300">

            {file.resourceType?.includes('image') && (
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={file.fileUrl}
                  alt={file.originalFilename}
                  className="w-full h-full object-cover"
                />

                {/* Hover hone par dikhne wale options */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-4">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/90 p-3 rounded-full text-gray-800 hover:bg-white hover:text-blue-600 transition shadow-sm"
                    title="Full Size mein Dekhein"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="bg-white p-3 rounded-full text-gray-800 hover:bg-red-500 hover:text-white transition shadow-sm"
                    title="Delete File"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )}

            {file.resourceType?.includes('video') && (
              <div className="aspect-square bg-gray-100 relative">
                <video

                  src={file.fileUrl}
                  controls
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-4">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/90 p-3 rounded-full text-gray-800 hover:bg-white hover:text-blue-600 transition shadow-sm"
                    title="Full Size mein Dekhein"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="bg-white p-3 rounded-full text-gray-800 hover:bg-red-500 hover:text-white transition shadow-sm"
                    title="Delete File"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )}

            {(!file.resourceType?.includes('image') && !file.resourceType?.includes('video')) && (
              <div className="aspect-square bg-gray-100 relative">
                <iframe
                  src={file.fileUrl}
                  title={file.originalFilename}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-4">
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/90 p-3 rounded-full text-gray-800 hover:bg-white hover:text-blue-600 transition shadow-sm"
                    title="Full Size mein Dekhein"
                  >
                    <ExternalLink size={20} />
                  </a>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="bg-white p-3 rounded-full text-gray-800 hover:bg-red-500 hover:text-white transition shadow-sm"
                    title="Delete File"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            )}

            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-600 truncate" title={file.originalFilename}>
                {file.originalFilename || 'Saved File'}
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default FileGrid;
