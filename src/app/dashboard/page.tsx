"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import GoogleMapsModal from "@/components/GoogleMapsModal";

interface GFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  thumbnailLink?: string;
  createdTime: string;
  appProperties?: {
    location?: string;
  };
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  
  const [files, setFiles] = useState<GFile[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string>("root");
  const [folderHistory, setFolderHistory] = useState<{ id: string; name: string }[]>([
    { id: "root", name: "My Drive" }
  ]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [mapQuery, setMapQuery] = useState<string>("Hyderabad, India");

  // Check URL parameters for tokens, save to localStorage, and clear URL
  useEffect(() => {
    const urlAccess = searchParams.get("access_token");
    const urlRefresh = searchParams.get("refresh_token");

    if (urlAccess) {
      localStorage.setItem("google_access_token", urlAccess);
      if (urlRefresh) {
        localStorage.setItem("google_refresh_token", urlRefresh);
      }
      
      // Clean up search parameters from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      setAccessToken(urlAccess);
      if (urlRefresh) setRefreshToken(urlRefresh);
    } else {
      const storedAccess = localStorage.getItem("google_access_token");
      const storedRefresh = localStorage.getItem("google_refresh_token");
      if (storedAccess) {
        setAccessToken(storedAccess);
      }
      if (storedRefresh) {
        setRefreshToken(storedRefresh);
      }
    }
  }, [searchParams]);

  // Load files when access token or folder ID changes
  useEffect(() => {
    if (accessToken) {
      fetchFiles(currentFolderId);
    }
  }, [accessToken, currentFolderId]);

  const fetchFiles = async (folderId: string) => {
    setIsLoading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    try {
      const res = await fetch(`${apiUrl}/api/vault/list?folder_id=${folderId}`, {
        headers: {
          "x-google-access-token": accessToken || ""
        }
      });
      
      if (!res.ok) {
        if (res.status === 401 || res.status === 400) {
          // Access token might have expired
          handleDisconnect();
          throw new Error("Session expired. Please reconnect your Google Drive.");
        }
        throw new Error("Failed to fetch files from Google Drive.");
      }
      
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading files.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    try {
      const redirectUri = typeof window !== "undefined" ? encodeURIComponent(`${window.location.origin}/dashboard`) : "";
      const res = await fetch(`${apiUrl}/api/auth/google/login?frontend_redirect=${redirectUri}`);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Unable to fetch login authorization URL.");
      }
    } catch (err: any) {
      setError("Failed to initiate connection to Google Drive.");
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("google_refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
    setFiles([]);
    setFolderHistory([{ id: "root", name: "My Drive" }]);
    setCurrentFolderId("root");
  };

  const handleFolderClick = (folderId: string, folderName: string) => {
    setFolderHistory([...folderHistory, { id: folderId, name: folderName }]);
    setCurrentFolderId(folderId);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newHistory = folderHistory.slice(0, index + 1);
    setFolderHistory(newHistory);
    setCurrentFolderId(newHistory[newHistory.length - 1].id);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFiles = e.target.files;
    if (!targetFiles || targetFiles.length === 0) return;
    
    const fileToUpload = targetFiles[0];
    const formData = new FormData();
    formData.append("file", fileToUpload);

    // Ask user for an optional custom location tag
    const customLocation = window.prompt("Add location tag for this photo (optional):") || "";
    const locationQuery = customLocation.trim() ? `&location=${encodeURIComponent(customLocation.trim())}` : "";

    setUploading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    try {
      const res = await fetch(`${apiUrl}/api/vault/upload?folder_id=${currentFolderId}${locationQuery}`, {
        method: "POST",
        headers: {
          "x-google-access-token": accessToken || ""
        },
        body: formData
      });
      
      if (!res.ok) {
        throw new Error("Failed to upload file.");
      }
      
      // Refresh file list
      await fetchFiles(currentFolderId);
    } catch (err: any) {
      setError(err.message || "Failed to upload file.");
    } finally {
      setUploading(false);
      // Reset input value so same file can be selected again
      e.target.value = "";
    }
  };

  const formatSize = (bytesStr?: string) => {
    if (!bytesStr) return "-";
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes)) return "-";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] font-sans text-gray-100 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/85 backdrop-blur-md sticky top-0 z-55">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="relative w-8 h-8 rounded-lg overflow-hidden border border-indigo-500/30">
              <Image 
                src="/icon-192x192.png" 
                alt="NuFrame Logo" 
                fill
                className="object-cover"
              />
            </Link>
            <Link href="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              NuFrame
            </Link>
            <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              The Vault
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link href="/studio" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              The Studio
            </Link>
            {accessToken && (
              <button 
                onClick={handleDisconnect}
                className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
              >
                Disconnect Drive
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Connection Prompt State */}
        {!accessToken ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="absolute top-1/3 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/5 blur-[100px]" />
            
            <div className="h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6 flex border border-indigo-500/20">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.822.11-1.619.317-2.378" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Connect Your Cloud Vault</h2>
            <p className="max-w-md text-gray-400 mb-8">
              NuFrame defaults to User-Owned storage. Connect your Google Drive to browse your files, splice layouts, and edit carousels securely.
            </p>
            
            <button
              onClick={handleConnect}
              className="flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-base font-semibold text-black hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Connect Google Drive
            </button>

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>
        ) : (
          /* Main Explorer State */
          <div>
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
              
              {/* Breadcrumbs */}
              <div className="flex items-center flex-wrap gap-2 text-sm text-gray-400">
                {folderHistory.map((folder, index) => (
                  <span key={folder.id} className="flex items-center gap-2">
                    {index > 0 && <span>/</span>}
                    <button
                      onClick={() => handleBreadcrumbClick(index)}
                      className={`hover:text-white font-medium transition-colors ${
                        index === folderHistory.length - 1 ? "text-indigo-400" : ""
                      }`}
                    >
                      {folder.name}
                    </button>
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500 cursor-pointer transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7-7H5" />
                  </svg>
                  <span>{uploading ? "Uploading..." : "Upload File"}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    accept="image/*"
                  />
                </label>

                {/* Google Maps Location Explorer */}
                <button
                  type="button"
                  onClick={() => {
                    setMapQuery("Hyderabad, India");
                    setIsMapModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  title="Explore photo spots on Google Maps"
                >
                  <MapPin className="w-4 h-4 text-[#EA4335]" />
                  <span className="hidden sm:inline">Google Maps</span>
                </button>
                
                <Link
                  href="/studio"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-200"
                >
                  Go to Studio
                </Link>
              </div>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400 flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="text-gray-400 hover:text-white">
                  &times;
                </button>
              </div>
            )}

            {/* Loading Grid Indicator */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-10">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col rounded-2xl border border-white/5 bg-white/[0.01] p-4 h-40 justify-between">
                    <div className="h-10 w-10 bg-white/5 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-4 bg-white/5 rounded w-3/4" />
                      <div className="h-3 bg-white/5 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : files.length === 0 ? (
              /* Empty Folder View */
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
                <p className="text-gray-400">This folder is empty.</p>
                <p className="text-sm text-gray-600 mt-1">Upload an image file to begin splicing templates.</p>
              </div>
            ) : (
              /* Explorer Grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {files.map((file) => {
                  const isFolder = file.mimeType === "application/vnd.google-apps.folder";
                  const isImage = file.mimeType.startsWith("image/");
                  
                  return (
                    <div
                      key={file.id}
                      onDoubleClick={() => isFolder ? handleFolderClick(file.id, file.name) : null}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm transition-all duration-200 hover:border-indigo-500/20 hover:bg-white/[0.04] cursor-pointer h-44 select-none"
                    >
                      {/* File Icon / Image Thumbnail */}
                      <div className="flex items-start justify-between">
                        {isFolder ? (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18" />
                            </svg>
                          </div>
                        ) : isImage && file.thumbnailLink ? (
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                            {/* We use standard img element because next/image might not authorize external thumbnail link domains immediately without configuration */}
                            <img
                              src={file.thumbnailLink}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500/10 text-gray-400">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Inline download action for images */}
                        {!isFolder && isImage && (
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"}/api/vault/download/${file.id}?x-google-access-token=${accessToken}`}
                            download
                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-indigo-600/25 border border-indigo-500/30 rounded-lg text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                          </a>
                        )}
                      </div>

                      {/* File Details */}
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition-colors" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {isFolder ? "Folder" : formatSize(file.size)}
                          </p>
                          {file.appProperties?.location && (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMapQuery(file.appProperties?.location || "");
                                setIsMapModalOpen(true);
                              }}
                              className="text-[10px] text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/30 border border-indigo-500/20 rounded px-1.5 py-0.5 max-w-[110px] truncate transition-colors cursor-pointer flex items-center gap-1"
                              title={`View ${file.appProperties.location} on Google Maps`}
                            >
                              <span>📍</span>
                              <span className="truncate">{file.appProperties.location.split(',')[0]}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Google Maps Location Explorer Modal */}
      <GoogleMapsModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        initialQuery={mapQuery}
      />
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-gray-400">
        Loading Command Center...
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
