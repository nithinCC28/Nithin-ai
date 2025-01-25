import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Loader2, MessageSquarePlus, ChevronDown, ArrowDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const API_URLS = {
  "stabilityai/stable-diffusion-3.5-large-turbo": "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large-turbo",
  "flux/flux-1-dev": "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
  "flux/flux-1-schnell": "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"
};

const headers = {
  "Authorization": `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_TOKEN}`,
  "Content-Type": "application/json",
};

// Helper function to query the API
async function query(modelId: string, data: any) {
  const apiUrl = API_URLS[modelId as keyof typeof API_URLS];
  if (!apiUrl) {
    throw new Error('Invalid model selected');
  }

  const response = await fetch(apiUrl, {
    headers: headers,
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
}

type Resolution = {
  width: number;
  height: number;
  label: string;
  ratio: string;
};

type Model = {
  name: string;
  id: string;
};

const models: Model[] = [
  { name: "Stable-Diffusion-3.5-Turbo", id: "stabilityai/stable-diffusion-3.5-large-turbo" },
  { name: "FLUX.1-dev", id: "flux/flux-1-dev" },
  { name: "FLUX.1-schnell", id: "flux/flux-1-schnell" }
];

const resolutions: Resolution[] = [
  { width: 1024, height: 1024, label: '1:1', ratio: '1:1' },
  { width: 1024, height: 576, label: '16:9', ratio: '16:9' },
  { width: 576, height: 1024, label: '9:16', ratio: '9:16' },
  { width: 1024, height: 768, label: '4:3', ratio: '4:3' },
  { width: 768, height: 1024, label: '3:4', ratio: '3:4' },
  { width: 1024, height: 440, label: '21:9', ratio: '21:9' },
  { width: 440, height: 1024, label: '9:21', ratio: '9:21' },
];

export default function ImageGenerator() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<Resolution>(resolutions[4]); // 3:4 default
  const [isResolutionMenuOpen, setIsResolutionMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const payload = {
        inputs: prompt,
        parameters: {
          width: selectedResolution.width,
          height: selectedResolution.height,
          guidance_scale: 7.5,
          num_inference_steps: 50
        }
      };

      const response = await query(selectedModel.id, payload);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        
        if (errorData?.error?.includes('loading')) {
          throw new Error(`Model is loading. Please try again in ${Math.ceil(errorData.estimated_time || 20)} seconds.`);
        } else if (errorData?.error) {
          throw new Error(errorData.error);
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Generated image is empty. Please try again.');
      }
      
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
      setError(null);
    } catch (err) {
      console.error('Image generation failed:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to generate image. Please try again.'
      );
      setGeneratedImage(null);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to get ratio dimensions for visual representation
  const getRatioDimensions = (ratio: string) => {
    const [width, height] = ratio.split(':').map(Number);
    const maxDimension = 24; // Maximum size in pixels
    const scale = maxDimension / Math.max(width, height);
    return {
      width: `${width * scale}px`,
      height: `${height * scale}px`
    };
  };

  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 py-12 md:py-24 relative">
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-4 flex items-center gap-2 text-primary-accent hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-light">Back</span>
      </button>

      <div className="text-center mb-20">
        <h1 className="cabinet-grotesk text-4xl md:text-7xl mb-6 font-extralight tracking-tight leading-none">
          <span className="font-light bg-gradient-to-r from-[#B088BC] via-[#E7EDEA] to-[#7DFFC3] bg-clip-text text-transparent inline-block transform hover:scale-105 transition-transform duration-300">
            Ai-image generator
          </span>
        </h1>
        <p className="text-primary-accent text-lg md:text-xl max-w-3xl mx-auto font-light tracking-wide">
          Create stunning images with Stable Diffusion 3.5 Turbo and FLUX models, state-of-the-art AI image generation models
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-[#141517] rounded-3xl p-6 backdrop-blur-xl border border-primary-gray/20">
          <div className="bg-[#212224] rounded-2xl p-6 backdrop-blur-sm border border-primary-gray/10">
            <div className="space-y-6">
              <div>
                <label htmlFor="prompt" className="block text-white mb-2 font-medium flex items-center gap-2">
                  <MessageSquarePlus className="w-5 h-5 text-[#B088BC]" />
                  Enter your prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="w-full h-32 px-4 py-3 rounded-xl bg-[#141517] border border-primary-gray/20 text-white placeholder-primary-accent/50 focus:outline-none focus:ring-2 focus:ring-[#B088BC]/50 transition-all resize-none"
                />
              </div>
              
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm">{error}</p>
                  {error.includes('Model is loading') && (
                    <p className="text-red-400/80 text-xs mt-2">
                      The model is warming up. This is normal and only happens on the first request.
                    </p>
                  )}
                </div>
              )}

              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-white/60 text-sm">
                    Resolution
                  </label>
                  <ArrowDown className="w-4 h-4 text-[#B088BC] animate-bounce" />
                </div>
                <button
                  onClick={() => setIsResolutionMenuOpen(!isResolutionMenuOpen)}
                  className="w-full px-4 py-3 rounded-xl bg-[#141517] border border-primary-gray/20 text-white flex items-center justify-between hover:border-[#B088BC]/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                      <div 
                        className="bg-white/80"
                        style={{
                          ...getRatioDimensions(selectedResolution.ratio),
                          minWidth: '8px',
                          minHeight: '8px'
                        }}
                      />
                    </div>
                    <span>{selectedResolution.ratio}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isResolutionMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isResolutionMenuOpen && (
                  <div className="absolute w-full mt-2 py-2 bg-[#141517] border border-primary-gray/20 rounded-xl shadow-xl z-10">
                    {resolutions.map((resolution) => (
                      <button
                        key={resolution.ratio}
                        onClick={() => {
                          setSelectedResolution(resolution);
                          setIsResolutionMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-colors"
                      >
                        <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                          <div 
                            className="bg-white/80"
                            style={{
                              ...getRatioDimensions(resolution.ratio),
                              minWidth: '8px',
                              minHeight: '8px'
                            }}
                          />
                        </div>
                        <span className={`${selectedResolution.ratio === resolution.ratio ? 'text-white' : 'text-white/60'}`}>
                          {resolution.ratio}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-white/60 text-sm">
                    Model
                  </label>
                  <ArrowDown className="w-4 h-4 text-[#B088BC] animate-bounce" />
                </div>
                <button
                  onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                  className="w-full px-4 py-3 rounded-xl bg-[#141517] border border-primary-gray/20 text-white flex items-center justify-between hover:border-[#B088BC]/50 transition-colors"
                >
                  <span>{selectedModel.name}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isModelMenuOpen && (
                  <div className="absolute w-full mt-2 py-2 bg-[#141517] border border-primary-gray/20 rounded-xl shadow-xl z-10">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model);
                          setIsModelMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors"
                      >
                        <span className={`${selectedModel.id === model.id ? 'text-white' : 'text-white/60'}`}>
                          {model.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-[#B088BC] via-[#E7EDEA] to-[#7DFFC3] text-primary-black py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity tracking-wide group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span className="group-hover:translate-x-0.5 transition-transform">Generate Now</span>
                    <Sparkles className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              {generatedImage && (
                <div className="mt-6">
                  <h3 className="text-white font-medium mb-4">Generated Image</h3>
                  <div className="relative rounded-xl overflow-hidden bg-[#141517]" style={{
                    aspectRatio: selectedResolution.ratio
                  }}>
                    <img
                      src={generatedImage}
                      alt="AI Generated"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-primary-gray/20">
                <p className="text-primary-accent text-sm">
                  Pro tip: Be specific with your prompts. Include details about style, mood, lighting, and composition for better results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}