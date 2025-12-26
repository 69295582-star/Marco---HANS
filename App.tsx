import React, { useState, useRef } from 'react';
import Header from './components/Header';
import { generateStyledPortrait } from './services/geminiService';
import { 
  AppStatus, 
  GenerationResult, 
  HAIR_COLORS, 
  HairColor, 
  FRINGE_STYLES, 
  FringeStyle, 
  MAKEUP_STYLES, 
  MakeupStyle, 
  CLOTHING_STYLES, 
  ClothingStyle,
  EARRING_STYLES,
  EarringStyle,
  GESTURE_STYLES,
  GestureStyle,
  EXPRESSION_STYLES,
  ExpressionStyle
} from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [smilePreviewUrl, setSmilePreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [selectedColor, setSelectedColor] = useState<HairColor>(HAIR_COLORS[0]); // Default to 'Silver White'
  const [selectedFringe, setSelectedFringe] = useState<FringeStyle>(FRINGE_STYLES[0]);
  const [selectedMakeup, setSelectedMakeup] = useState<MakeupStyle>(MAKEUP_STYLES[0]);
  const [selectedClothing, setSelectedClothing] = useState<ClothingStyle>(CLOTHING_STYLES[0]); // Default to '简约白T' (now at index 0)
  const [selectedEarrings, setSelectedEarrings] = useState<EarringStyle>(EARRING_STYLES[0]);
  const [selectedGesture, setSelectedGesture] = useState<GestureStyle>(GESTURE_STYLES[5]); // Default to 'Beckoning' (勾引)
  const [selectedExpression, setSelectedExpression] = useState<ExpressionStyle>(EXPRESSION_STYLES[2]); // Default to 'Sexy' (性感)
  const [hasCap, setHasCap] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const smileInputRef = useRef<HTMLInputElement>(null);

  const isAncientActive = selectedClothing.id === 'ancient';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setResult(null);
        setError(null);
        setStatus(AppStatus.IDLE);
        if (e.target) e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSmileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSmilePreviewUrl(reader.result as string);
        setError(null);
        if (e.target) e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (dataUrl: string) => {
    return dataUrl.split(',')[1];
  };

  const getMimeType = (dataUrl: string) => {
    return dataUrl.split(';')[0].split(':')[1];
  };

  const handleGenerate = async () => {
    if (!previewUrl) return;

    if (!process.env.API_KEY) {
      setError("API Key is missing. Please ensure your environment is configured correctly.");
      setStatus(AppStatus.ERROR);
      return;
    }

    setStatus(AppStatus.GENERATING);
    setError(null);

    try {
      const base64 = fileToBase64(previewUrl);
      const mimeType = getMimeType(previewUrl);

      let smileBase64 = undefined;
      let smileMimeType = undefined;

      if (!isAncientActive && selectedExpression.id === 'smile' && smilePreviewUrl) {
        smileBase64 = fileToBase64(smilePreviewUrl);
        smileMimeType = getMimeType(smilePreviewUrl);
      }
      
      const generatedUrl = await generateStyledPortrait(
        base64, 
        mimeType, 
        selectedColor, 
        selectedFringe, 
        hasCap, 
        selectedMakeup,
        selectedClothing,
        selectedEarrings,
        selectedGesture,
        selectedExpression,
        smileBase64,
        smileMimeType
      );
      
      setResult({
        imageUrl: generatedUrl,
        originalUrl: previewUrl,
        timestamp: Date.now()
      });
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "An unexpected error occurred in the portrait studio.";
      setError(msg);
      setStatus(AppStatus.ERROR);
    }
  };

  const triggerFileInput = () => {
    if (status === AppStatus.GENERATING) return;
    fileInputRef.current?.click();
  };

  const triggerSmileInput = () => {
    if (status === AppStatus.GENERATING) return;
    smileInputRef.current?.click();
  };

  const LoadingOverlay = () => (
    <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center px-4">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div>
        <p className="text-lg font-bold text-slate-800">Studio is shooting...</p>
        <p className="text-sm text-slate-500 max-w-[280px]">
          {isAncientActive ? "AI is creating a cinematic ANCIENT style look..." : `Styling your ${selectedColor.label} look with ${selectedClothing.label}...`}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-[1400px]">
        <section className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
            Premium AI Portrait Studio
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Youth Portrait Generator
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience high-end studio photography. Transform into a white-haired youthful beauty while strictly preserving your identity.
          </p>
        </section>

        {/* Customization Panel */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          
          {/* Clothing Style */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 ring-2 ring-indigo-500/20">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              Clothing / 服装
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {CLOTHING_STYLES.map((clothing) => (
                <button
                  key={clothing.id}
                  onClick={() => setSelectedClothing(clothing)}
                  className={`py-1.5 rounded-xl text-[10px] font-bold transition-all border-2 ${
                    selectedClothing.id === clothing.id ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-50 hover:border-slate-200'
                  }`}
                >
                  {clothing.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Color - DISABLED IF ANCIENT */}
          <div className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all ${isAncientActive ? 'opacity-40 grayscale-[0.5] pointer-events-none' : ''}`}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              Hair Color / 发色
            </h3>
            <div className="flex flex-wrap gap-2">
              {HAIR_COLORS.map((color) => (
                <button
                  key={color.id}
                  disabled={isAncientActive}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    selectedColor.id === color.id ? 'border-indigo-600 scale-110' : 'border-slate-100'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.label}
                />
              ))}
            </div>
            <p className="mt-2 text-[10px] font-bold text-indigo-600 uppercase">{isAncientActive ? 'AI AUTO' : selectedColor.label}</p>
          </div>

          {/* Fringe Style - DISABLED IF ANCIENT */}
          <div className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all ${isAncientActive ? 'opacity-40 grayscale-[0.5] pointer-events-none' : ''}`}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              Fringe / 刘海
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {FRINGE_STYLES.map((fringe) => (
                <button
                  key={fringe.id}
                  disabled={isAncientActive}
                  onClick={() => setSelectedFringe(fringe)}
                  className={`py-1.5 rounded-xl text-[10px] font-bold transition-all border-2 ${
                    selectedFringe.id === fringe.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-50 hover:border-slate-200'
                  }`}
                >
                  {fringe.label}
                </button>
              ))}
            </div>
          </div>

          {/* Makeup Style - DISABLED IF ANCIENT */}
          <div className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all ${isAncientActive ? 'opacity-40 grayscale-[0.5] pointer-events-none' : ''}`}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
              Makeup / 妆容
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {MAKEUP_STYLES.map((makeup) => (
                <button
                  key={makeup.id}
                  disabled={isAncientActive}
                  onClick={() => setSelectedMakeup(makeup)}
                  className={`py-1.5 rounded-xl text-[10px] font-bold transition-all border-2 ${
                    selectedMakeup.id === makeup.id ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-600 border-slate-50 hover:border-slate-200'
                  }`}
                >
                  {makeup.label}
                </button>
              ))}
            </div>
          </div>

          {/* Expression Style - DISABLED IF ANCIENT */}
          <div className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all ${isAncientActive ? 'opacity-40 grayscale-[0.5] pointer-events-none' : ''}`}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
              Expression / 表情
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {EXPRESSION_STYLES.map((exp) => (
                <button
                  key={exp.id}
                  disabled={isAncientActive}
                  onClick={() => setSelectedExpression(exp)}
                  className={`py-1.5 rounded-xl text-[10px] font-bold transition-all border-2 ${
                    selectedExpression.id === exp.id ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-600 border-slate-50 hover:border-slate-200'
                  }`}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Earring Style - DISABLED IF ANCIENT */}
          <div className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all ${isAncientActive ? 'opacity-40 grayscale-[0.5] pointer-events-none' : ''}`}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              Earrings / 耳环
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {EARRING_STYLES.map((earring) => (
                <button
                  key={earring.id}
                  disabled={isAncientActive}
                  onClick={() => setSelectedEarrings(earring)}
                  className={`py-1.5 rounded-xl text-[10px] font-bold transition-all border-2 ${
                    selectedEarrings.id === earring.id ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-slate-600 border-slate-50 hover:border-slate-200'
                  }`}
                >
                  {earring.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gesture Style - DISABLED IF ANCIENT */}
          <div className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all ${isAncientActive ? 'opacity-40 grayscale-[0.5] pointer-events-none' : ''}`}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
              Gesture / 手势
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {GESTURE_STYLES.map((gesture) => (
                <button
                  key={gesture.id}
                  disabled={isAncientActive}
                  onClick={() => setSelectedGesture(gesture)}
                  className={`py-1.5 rounded-xl text-[10px] font-bold transition-all border-2 ${
                    selectedGesture.id === gesture.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-600 border-slate-50 hover:border-slate-200'
                  }`}
                >
                  {gesture.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accessory - DISABLED IF ANCIENT */}
          <div className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all ${isAncientActive ? 'opacity-40 grayscale-[0.5] pointer-events-none' : ''}`}>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Cap / 帽子
            </h3>
            <div className="flex flex-col gap-1.5">
              <button
                disabled={isAncientActive}
                onClick={() => setHasCap(false)}
                className={`py-2 rounded-xl text-[10px] font-bold transition-all border-2 ${
                  !hasCap ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-50 hover:border-slate-200'
                }`}
              >
                无帽子
              </button>
              <button
                disabled={isAncientActive}
                onClick={() => setHasCap(true)}
                className={`py-2 rounded-xl text-[10px] font-bold transition-all border-2 ${
                  hasCap ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-50 hover:border-slate-200'
                }`}
              >
                戴棒球帽
              </button>
            </div>
          </div>
        </div>

        {/* Ancient Style Mode Indicator */}
        {isAncientActive && (
          <div className="mb-10 animate-in fade-in zoom-in duration-300">
             <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                   </div>
                   <p className="text-sm font-bold tracking-wide">
                     ANCIENT STYLE MODE ACTIVE: AI will automatically style your hair and makeup for a cinematic look.
                   </p>
                </div>
                <button 
                  onClick={() => setSelectedClothing(CLOTHING_STYLES[0])}
                  className="text-[10px] font-black uppercase tracking-widest bg-white text-indigo-600 px-4 py-1.5 rounded-xl hover:bg-indigo-50 transition-colors"
                >
                  Exit Mode
                </button>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {/* Main Reference Photo */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-bold text-slate-800">1. Reference Image</h3>
              <button 
                onClick={triggerFileInput}
                className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-indigo-100 transition-all"
              >
                Upload Photo
              </button>
            </div>
            
            <div 
              className={`relative aspect-[3/4] flex items-center justify-center bg-slate-50 cursor-pointer overflow-hidden group ${!previewUrl ? 'border-4 border-dashed border-slate-200 m-6 rounded-2xl' : ''}`}
              onClick={triggerFileInput}
            >
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="bg-white px-6 py-2 rounded-full text-xs font-black shadow-2xl tracking-widest">REPLACE</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <div className="mx-auto w-16 h-16 text-indigo-200 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <p className="text-slate-600 font-bold">Drop main portrait here</p>
                  <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-widest">Identity preservation mode</p>
                </div>
              )}
            </div>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            <div className="p-6">
              <button
                disabled={!previewUrl || status === AppStatus.GENERATING}
                onClick={handleGenerate}
                className={`w-full py-5 rounded-2xl font-black text-white shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm ${
                  !previewUrl || status === AppStatus.GENERATING ? 'bg-slate-200 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                }`}
              >
                {status === AppStatus.GENERATING ? 'Generating Art...' : 'Launch Studio Shoot'}
              </button>
            </div>
          </div>

          {/* Smile Reference Photo (Conditional) */}
          {!isAncientActive && selectedExpression.id === 'smile' && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-pink-50/30">
                <h3 className="font-bold text-slate-800">Smile Reference</h3>
                <button 
                  onClick={triggerSmileInput}
                  className="text-xs font-bold uppercase tracking-wider text-pink-600 hover:text-pink-700 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-pink-100 transition-all"
                >
                  Upload Smile
                </button>
              </div>
              
              <div 
                className={`relative aspect-[3/4] flex items-center justify-center bg-slate-50 cursor-pointer overflow-hidden group ${!smilePreviewUrl ? 'border-4 border-dashed border-slate-200 m-6 rounded-2xl' : ''}`}
                onClick={triggerSmileInput}
              >
                {smilePreviewUrl ? (
                  <>
                    <img src={smilePreviewUrl} alt="Smile Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="bg-white px-6 py-2 rounded-full text-xs font-black shadow-2xl tracking-widest text-pink-600">REPLACE</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="mx-auto w-16 h-16 text-pink-200 mb-4">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <p className="text-slate-600 font-bold">Upload a smiling photo</p>
                    <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-widest text-pink-400">Reference for expression</p>
                  </div>
                )}
              </div>
              <input type="file" ref={smileInputRef} className="hidden" accept="image/*" onChange={handleSmileFileChange} />
              <div className="p-4 bg-pink-50/50 m-6 rounded-2xl">
                <p className="text-[10px] leading-relaxed text-pink-600 font-medium italic">
                  * Uploading a photo of yourself smiling helps the AI capture your unique features when you laugh.
                </p>
              </div>
            </div>
          )}

          {/* Result Masterpiece */}
          <div className={`bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 min-h-[500px] flex flex-col ${(!isAncientActive && selectedExpression.id === 'smile') ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-indigo-50/20">
              <h3 className="font-bold text-slate-800">2. Styled Masterpiece</h3>
            </div>
            
            <div className="flex-grow flex items-center justify-center bg-slate-50/30 p-6">
              {status === AppStatus.GENERATING ? (
                <LoadingOverlay />
              ) : status === AppStatus.SUCCESS && result ? (
                <div className="w-full space-y-6 max-w-md mx-auto">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white">
                    <img src={result.imageUrl} alt="Generated result" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => window.open(result.imageUrl, '_blank')} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Enlarge</button>
                    <a href={result.imageUrl} download="studio-portrait.png" className="flex-1 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-xs text-center uppercase tracking-widest">Download</a>
                  </div>
                </div>
              ) : status === AppStatus.ERROR ? (
                <div className="text-center p-8">
                  <p className="text-red-600 font-bold mb-4">{error}</p>
                  <button onClick={handleGenerate} className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase">Retry</button>
                </div>
              ) : (
                <div className="text-center opacity-30">
                  <svg className="w-20 h-20 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p className="text-xs font-bold uppercase tracking-widest">Awaiting Render</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;