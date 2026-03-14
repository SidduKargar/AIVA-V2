import React, { useState } from "react";
import { Upload, Image, Code, FileText, Loader, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from "lucide-react";
import { uploadDocument, processImage } from "../services/api";

const WelcomeCards = ({ darkMode, setActiveDocumentId, setMessages }) => {
  const [documentUploading, setDocumentUploading] = useState(false);
  const [documentStatus, setDocumentStatus] = useState(null); // { type: 'success'|'error', message }
  const [imageUploading, setImageUploading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [imageError, setImageError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setDocumentUploading(true);
    setDocumentStatus(null);
    try {
      const data = await uploadDocument(file);
      setActiveDocumentId(data.documentId);
      setDocumentStatus({
        type: "success",
        message: `"${file.name}" uploaded & indexed (${data.chunksProcessed} chunks)`,
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Document **"${file.name}"** has been uploaded and indexed successfully. You can now ask me questions about it!`,
        },
      ]);
    } catch (error) {
      setDocumentStatus({ type: "error", message: error.message });
    } finally {
      setDocumentUploading(false);
      event.target.value = "";
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageUploading(true);
    setExtractedText("");
    setImageError(null);
    setShowExtractedText(false);
    try {
      const data = await processImage(file);
      setExtractedText(data.refinedText);
      setShowExtractedText(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Here is the extracted and refined text from your image:\n\n${data.refinedText}`,
        },
      ]);
    } catch (error) {
      setImageError(error.message);
    } finally {
      setImageUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className={`min-h-[70vh] flex items-center justify-center p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="text-center w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Document Upload Card */}
          <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border flex flex-col h-full`}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto flex items-center justify-center mb-4 shadow-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h2 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Upload Document
            </h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4 text-sm flex-grow`}>
              Upload a document to analyze its content with AI assistance
            </p>

            {documentStatus && (
              <div className={`mb-3 flex items-start gap-2 text-xs p-2 rounded-lg ${
                documentStatus.type === "success"
                  ? darkMode ? "bg-green-900/30 text-green-400" : "bg-green-50 text-green-700"
                  : darkMode ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-700"
              }`}>
                {documentStatus.type === "success"
                  ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                <span>{documentStatus.message}</span>
              </div>
            )}

            <label className={`mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium transition-colors text-sm duration-200
              ${darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"}
              ${documentUploading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={documentUploading}
                accept=".txt,.pdf,.doc,.docx,.sql"
              />
              {documentUploading ? (
                <span className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload className="w-4 h-4 mr-2" /> Choose File
                </span>
              )}
            </label>
          </div>

          {/* Image Processing Card */}
          <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border flex flex-col h-full`}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto flex items-center justify-center mb-4 shadow-lg">
              <Image className="w-6 h-6 text-white" />
            </div>
            <h2 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Process Image
            </h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4 text-sm flex-grow`}>
              Upload and process images with AI to extract text and analyze content
            </p>

            {imageError && (
              <div className={`mb-3 flex items-start gap-2 text-xs p-2 rounded-lg ${darkMode ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-700"}`}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{imageError}</span>
              </div>
            )}

            <label className={`mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium transition-colors text-sm duration-200
              ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}
              ${imageUploading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}>
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                disabled={imageUploading}
                accept="image/*"
              />
              {imageUploading ? (
                <span className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" /> Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <Image className="w-4 h-4 mr-2" /> Upload Image
                </span>
              )}
            </label>

            {extractedText && (
              <div className="mt-4">
                <button
                  onClick={() => setShowExtractedText(!showExtractedText)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg ${
                    darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                  } transition-colors duration-200`}
                >
                  <span className={`text-sm ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {showExtractedText ? "Hide Extracted Text" : "Show Extracted Text"}
                  </span>
                  {showExtractedText
                    ? <ChevronUp className={`w-4 h-4 ${darkMode ? "text-white" : "text-gray-800"}`} />
                    : <ChevronDown className={`w-4 h-4 ${darkMode ? "text-white" : "text-gray-800"}`} />}
                </button>
                {showExtractedText && (
                  <div className={`mt-2 p-3 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg text-left text-sm max-h-40 overflow-y-auto`}>
                    <p className={darkMode ? "text-gray-300" : "text-gray-700"}>{extractedText}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Code Card */}
          <div
            onClick={() => setMessages((prev) => [...prev, { role: "assistant", content: "What programming language are you looking for help with?" }])}
            className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border cursor-pointer flex flex-col h-full`}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 mx-auto flex items-center justify-center mb-4 shadow-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h2 className={`text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Search Code
            </h2>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4 text-sm flex-grow`}>
              Get help with code in any programming language with AI assistance
            </p>
            <button className={`mt-auto px-4 py-2 rounded-lg w-full text-sm
              ${darkMode ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-500 hover:bg-pink-600"}
              text-white font-medium transition-colors duration-200 flex items-center justify-center`}>
              <Code className="w-4 h-4 mr-2" /> Start Searching
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WelcomeCards;
