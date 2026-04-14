import { useState } from 'react'
import { CloudUpload, Loader2 } from 'lucide-react'
import { uploadFile } from './api'
import FileGrid from './components/ImageGrid'

function App() {
  const [file, setFile] = useState(null)
  const [refreshGrid, setRefreshGrid] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Jab user file choose kare
  const handleFileChange = e => {
    if (e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // Jab Upload button par click ho
  const handleUpload = async () => {
    if (!file) {
      setMessage('⚠️ Pehle ek image select karein!')
      return
    }

    setLoading(true)
    setMessage('')

    // Form data create karna (file bhejne ke liye)
    const formData = new FormData()
    formData.append('file', file)

    try {
      await uploadFile(formData)
      setMessage('🎉 File successfully uploaded!')
      setFile(null) // File selection clear kar dena
      setRefreshGrid(prev => prev + 1)
    } catch (error) {
      console.error(error)
      setMessage('❌ Upload failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center text-gray-800 p-8'>
      <h1 className='text-4xl font-bold mb-4'>My Drive</h1>

      <div className='flex flex-col items-center gap-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md'>
        {/* Upload Icon */}
        <div className='p-4 bg-blue-50 rounded-full'>
          <CloudUpload size={48} className='text-blue-500' />
        </div>

        {/* File Input */}
        <input
          type='file'
          accept='image/*,video/*,.pdf,.doc,.docx'
          onChange={handleFileChange}
          className='w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className='w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed font-medium'
        >
          {loading ? (
            <>
              <Loader2 className='animate-spin' size={20} />
              Uploading...
            </>
          ) : (
            'Upload File'
          )}
        </button>

        {/* Status Message */}
        {message && (
          <p
            className={`text-sm mt-2 font-medium ${message.includes('❌') ? 'text-red-500' : 'text-green-600'
              }`}
          >
            {message}
          </p>
        )}
      </div>

      <FileGrid refreshTrigger={refreshGrid} />
    </div>
  )
}

export default App
