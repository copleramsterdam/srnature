import React, { useState, useEffect } from 'react';
import { SeoSettings } from '../types';
import {
  CheckCircle, AlertTriangle, AlertCircle, Search, Award, RefreshCw, ShieldCheck
} from 'lucide-react';

interface SeoManagerProps {
  seoSettings: SeoSettings;
  onRefreshData: () => void;
}

export const SeoManager: React.FC<SeoManagerProps> = ({
  seoSettings,
  onRefreshData
}) => {
  // Local SEO States
  const [seoTitleEn, setSeoTitleEn] = useState(seoSettings?.title?.en || '');
  const [seoTitleNl, setSeoTitleNl] = useState(seoSettings?.title?.nl || '');
  const [seoTitleId, setSeoTitleId] = useState(seoSettings?.title?.id || '');

  const [seoDescEn, setSeoDescEn] = useState(seoSettings?.description?.en || '');
  const [seoDescNl, setSeoDescNl] = useState(seoSettings?.description?.nl || '');
  const [seoDescId, setSeoDescId] = useState(seoSettings?.description?.id || '');

  const [seoKeysEnStr, setSeoKeysEnStr] = useState(seoSettings?.keywords?.en?.join(', ') || '');
  const [seoKeysNlStr, setSeoKeysNlStr] = useState(seoSettings?.keywords?.nl?.join(', ') || '');
  const [seoKeysIdStr, setSeoKeysIdStr] = useState(seoSettings?.keywords?.id?.join(', ') || '');

  const [isSavingSeo, setIsSavingSeo] = useState(false);
  const [seoMessage, setSeoMessage] = useState('');
  const [seoLangTab, setSeoLangTab] = useState<'en' | 'nl' | 'id'>('en');

  // Keep state updated if parent prop changes
  useEffect(() => {
    if (seoSettings) {
      setSeoTitleEn(seoSettings.title?.en || '');
      setSeoTitleNl(seoSettings.title?.nl || '');
      setSeoTitleId(seoSettings.title?.id || '');

      setSeoDescEn(seoSettings.description?.en || '');
      setSeoDescNl(seoSettings.description?.nl || '');
      setSeoDescId(seoSettings.description?.id || '');

      setSeoKeysEnStr(seoSettings.keywords?.en?.join(', ') || '');
      setSeoKeysNlStr(seoSettings.keywords?.nl?.join(', ') || '');
      setSeoKeysIdStr(seoSettings.keywords?.id?.join(', ') || '');
    }
  }, [seoSettings]);

  const getAuthToken = () => {
    return localStorage.getItem('djamoe_admin_token') || '';
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSeo(true);
    setSeoMessage('');

    const token = getAuthToken();

    const parseKeys = (str: string) => {
      return str
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
    };

    const updatedSeo = {
      title: {
        en: seoTitleEn,
        nl: seoTitleNl,
        id: seoTitleId
      },
      description: {
        en: seoDescEn,
        nl: seoDescNl,
        id: seoDescId
      },
      keywords: {
        en: parseKeys(seoKeysEnStr),
        nl: parseKeys(seoKeysNlStr),
        id: parseKeys(seoKeysIdStr)
      }
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ seoSettings: updatedSeo })
      });

      if (res.ok) {
        setSeoMessage('Success: SEO Settings successfully updated and applied!');
        onRefreshData();
      } else {
        const data = await res.json();
        setSeoMessage(`Error: ${data.error || 'Failed to update settings'}`);
      }
    } catch (err) {
      console.error(err);
      setSeoMessage('Error: Connection failure while saving settings.');
    } finally {
      setIsSavingSeo(false);
    }
  };

  // Diagnostics computations based on active language tab
  const currentTitle = seoLangTab === 'en' ? seoTitleEn : seoLangTab === 'nl' ? seoTitleNl : seoTitleId;
  const currentDesc = seoLangTab === 'en' ? seoDescEn : seoLangTab === 'nl' ? seoDescNl : seoDescId;
  const currentKeysStr = seoLangTab === 'en' ? seoKeysEnStr : seoLangTab === 'nl' ? seoKeysNlStr : seoKeysIdStr;

  const currentKeys = currentKeysStr
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0);

  const titleLength = currentTitle.length;
  const descLength = currentDesc.length;
  const keysCount = currentKeys.length;

  const relevanceTerms = seoLangTab === 'en'
    ? ["sr natural", "javanese", "massage", "spa", "wellness", "traditional", "herbal", "jamu"]
    : seoLangTab === 'nl'
    ? ["sr natural", "javaanse", "massage", "spa", "wellness", "traditionele", "kruiden", "jamu", "aan huis"]
    : ["sr natural", "pijat", "jawa", "tradisional", "spa", "herbal", "jamu", "kesehatan"];

  const combinedText = (currentTitle + " " + currentDesc).toLowerCase();
  const matchedTerms = relevanceTerms.filter(term => combinedText.includes(term.toLowerCase()));

  let titleScore = 0;
  let titleStatus: 'critical' | 'warning' | 'success' = 'critical';
  let titleFeedback = '';

  if (titleLength === 0) {
    titleScore = 0;
    titleStatus = 'critical';
    titleFeedback = 'Meta Title is empty. This is extremely detrimental for SEO.';
  } else if (titleLength < 30) {
    titleScore = 15;
    titleStatus = 'warning';
    titleFeedback = 'Too short. Aim for 50-60 characters to optimize visibility and click-through rates.';
  } else if (titleLength >= 50 && titleLength <= 60) {
    titleScore = 30;
    titleStatus = 'success';
    titleFeedback = 'Perfect length! Highly optimal for search engine display.';
  } else if (titleLength >= 30 && titleLength <= 65) {
    titleScore = 25;
    titleStatus = 'success';
    titleFeedback = 'Good length. Within acceptable industry standards.';
  } else {
    titleScore = 15;
    titleStatus = 'warning';
    titleFeedback = 'Too long. It will be truncated with "..." in Google search results.';
  }

  let descScore = 0;
  let descStatus: 'critical' | 'warning' | 'success' = 'critical';
  let descFeedback = '';

  if (descLength === 0) {
    descScore = 0;
    descStatus = 'critical';
    descFeedback = 'Meta Description is empty. Search engines will generate automated snippets instead.';
  } else if (descLength < 100) {
    descScore = 15;
    descStatus = 'warning';
    descFeedback = 'Too short. Expand to 120-160 characters to describe the page accurately.';
  } else if (descLength >= 120 && descLength <= 160) {
    descScore = 30;
    descStatus = 'success';
    descFeedback = 'Perfect length! Ensures full description display in search snippets.';
  } else if (descLength >= 100 && descLength <= 170) {
    descScore = 25;
    descStatus = 'success';
    descFeedback = 'Good length. Well within standard expectations.';
  } else {
    descScore = 15;
    descStatus = 'warning';
    descFeedback = 'Too long. Text beyond 160 characters will likely be cut off by search engines.';
  }

  let keysScore = 0;
  let keysStatus: 'warning' | 'success' = 'warning';
  let keysFeedback = '';

  if (keysCount === 0) {
    keysScore = 0;
    keysStatus = 'warning';
    keysFeedback = 'No keywords provided. Add 5-10 key terms to index your heritage remedies.';
  } else if (keysCount < 5) {
    keysScore = 10;
    keysStatus = 'warning';
    keysFeedback = 'Low keyword count. Add a few more focused terms to broaden your reach.';
  } else if (keysCount >= 5 && keysCount <= 10) {
    keysScore = 20;
    keysStatus = 'success';
    keysFeedback = 'Optimal keyword density. Well-balanced catalog indexing.';
  } else {
    keysScore = 10;
    keysStatus = 'warning';
    keysFeedback = 'Too many keywords. Keep it under 10 keywords to avoid looking spammy.';
  }

  const relevanceScore = Math.min(20, matchedTerms.length * 5);
  const totalScore = titleScore + descScore + keysScore + relevanceScore;

  let gradeName = '';
  let gradeColor = '';
  let gradeBg = '';
  let gradeDesc = '';

  if (totalScore >= 90) {
    gradeName = 'Excellent / Luar Biasa';
    gradeColor = 'text-emerald-700 border-emerald-200';
    gradeBg = 'bg-emerald-50';
    gradeDesc = 'Your SEO settings are highly optimized! Your meta elements conform to perfect lengths and incorporate crucial heritage branding and service-related terms.';
  } else if (totalScore >= 70) {
    gradeName = 'Good / Baik';
    gradeColor = 'text-blue-700 border-blue-200';
    gradeBg = 'bg-blue-50';
    gradeDesc = 'Well-crafted! Just a few tweaks on character counts or adding high-value keywords can elevate this to perfection.';
  } else if (totalScore >= 40) {
    gradeName = 'Needs Improvement / Butuh Perbaikan';
    gradeColor = 'text-amber-700 border-amber-200';
    gradeBg = 'bg-amber-50';
    gradeDesc = 'Under-optimized. Some meta fields are too short, too long, or missing target niche terms like "massage", "jamu" or "SR Natural".';
  } else {
    gradeName = 'Poor / Sangat Kurang';
    gradeColor = 'text-rose-700 border-rose-200';
    gradeBg = 'bg-rose-50';
    gradeDesc = 'Critical attention required. Meta tags are either empty, truncated, or completely missing relevant terms to assist customers in finding your site.';
  }

  return (
    <div className="space-y-6 animate-fade-in" id="seo-manager-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gold/15 pb-4 gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-royal-green flex items-center space-x-2">
            <Search className="w-5 h-5 text-gold-dark" />
            <span>Real-Time SEO Meta &amp; Relevance Diagnostic Panel</span>
          </h3>
          <p className="text-xs text-royal-green/60 mt-0.5">
            Analyze, adjust, and optimize metadata tags for maximum visibility on Google search and social indexing.
          </p>
        </div>
        
        <div className="flex bg-cream/30 p-1 rounded-xl border border-gold/15">
          <button
            type="button"
            onClick={() => setSeoLangTab('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide transition-all cursor-pointer ${
              seoLangTab === 'en' ? 'bg-royal-green text-cream' : 'text-royal-green/70 hover:text-royal-green'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setSeoLangTab('nl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide transition-all cursor-pointer ${
              seoLangTab === 'nl' ? 'bg-royal-green text-cream' : 'text-royal-green/70 hover:text-royal-green'
            }`}
          >
            Nederlands
          </button>
          <button
            type="button"
            onClick={() => setSeoLangTab('id')}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold tracking-wide transition-all cursor-pointer ${
              seoLangTab === 'id' ? 'bg-royal-green text-cream' : 'text-royal-green/70 hover:text-royal-green'
            }`}
          >
            Indonesia
          </button>
        </div>
      </div>

      {seoMessage && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
          seoMessage.startsWith('Success') 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-850' 
            : 'bg-rose-50 border-rose-200 text-rose-850'
        }`}>
          {seoMessage.startsWith('Success') ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          )}
          <span>{seoMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Input form editor */}
        <form onSubmit={handleSaveSeo} className="lg:col-span-7 space-y-5 bg-cream/10 border border-gold/10 p-5 sm:p-6 rounded-2xl">
          <div className="flex items-center space-x-2 border-b border-gold/10 pb-2">
            <span className="text-[10px] font-mono tracking-widest text-gold-dark uppercase font-bold">
              Meta Tags Editor ({seoLangTab === 'en' ? 'English' : seoLangTab === 'nl' ? 'Nederlands' : 'Bahasa Indonesia'})
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-mono tracking-widest text-royal-green uppercase font-bold block">
                Meta Title Tag
              </label>
              <span className={`text-[10px] font-mono ${
                titleLength < 30 || titleLength > 65 ? 'text-amber-600 font-semibold' : 'text-emerald-700'
              }`}>
                {titleLength} / 60 chars (Recommended: 50-60)
              </span>
            </div>
            <input
              type="text"
              value={seoLangTab === 'en' ? seoTitleEn : seoLangTab === 'nl' ? seoTitleNl : seoTitleId}
              onChange={e => {
                const val = e.target.value;
                if (seoLangTab === 'en') setSeoTitleEn(val);
                else if (seoLangTab === 'nl') setSeoTitleNl(val);
                else setSeoTitleId(val);
              }}
              className="w-full bg-white border border-gold/25 focus:border-gold rounded-xl px-4 py-2.5 text-xs text-royal-green focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="e.g., SR Natural | Premium Traditional Javanese Massage Netherlands"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-mono tracking-widest text-royal-green uppercase font-bold block">
                Meta Description Tag
              </label>
              <span className={`text-[10px] font-mono ${
                descLength < 120 || descLength > 160 ? 'text-amber-600 font-semibold' : 'text-emerald-700'
              }`}>
                {descLength} / 160 chars (Recommended: 120-160)
              </span>
            </div>
            <textarea
              value={seoLangTab === 'en' ? seoDescEn : seoLangTab === 'nl' ? seoDescNl : seoDescId}
              onChange={e => {
                const val = e.target.value;
                if (seoLangTab === 'en') setSeoDescEn(val);
                else if (seoLangTab === 'nl') setSeoDescNl(val);
                else setSeoDescId(val);
              }}
              rows={4}
              className="w-full bg-white border border-gold/25 focus:border-gold rounded-xl px-4 py-2.5 text-xs text-royal-green focus:outline-none focus:ring-1 focus:ring-gold resize-none leading-relaxed"
              placeholder="Enter a highly engaging page summary to convince searchers to click through."
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-mono tracking-widest text-royal-green uppercase font-bold block">
                Keywords Tag (Comma Separated)
              </label>
              <span className={`text-[10px] font-mono ${
                keysCount < 5 || keysCount > 10 ? 'text-amber-600 font-semibold' : 'text-emerald-700'
              }`}>
                {keysCount} keywords (Recommended: 5-10)
              </span>
            </div>
            <input
              type="text"
              value={seoLangTab === 'en' ? seoKeysEnStr : seoLangTab === 'nl' ? seoKeysNlStr : seoKeysIdStr}
              onChange={e => {
                const val = e.target.value;
                if (seoLangTab === 'en') setSeoKeysEnStr(val);
                else if (seoLangTab === 'nl') setSeoKeysNlStr(val);
                else setSeoKeysIdStr(val);
              }}
              className="w-full bg-white border border-gold/25 focus:border-gold rounded-xl px-4 py-2.5 text-xs text-royal-green focus:outline-none focus:ring-1 focus:ring-gold"
              placeholder="e.g., premium massage, traditional jamu, spa amsterdam"
            />
            <p className="text-[9px] text-royal-green/60 font-serif mt-1 italic">
              Separate each keyword or long-tail keyphrase with a comma.
            </p>
          </div>

          <div className="pt-3 border-t border-gold/10 flex items-center justify-between">
            <p className="text-[10px] text-royal-green/60 font-serif italic max-w-xs leading-normal">
              Note: Saving updates will immediately adjust client index metadata values.
            </p>
            <button
              type="submit"
              disabled={isSavingSeo}
              className="flex items-center space-x-2 px-6 py-3 bg-royal-green hover:bg-leaf-green text-cream hover:text-gold font-bold text-xs tracking-widest uppercase rounded-full transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSavingSeo ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Save &amp; Apply SEO Settings</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* RIGHT COLUMN: Real-Time Diagnostic Dashboard */}
        <div className="lg:col-span-5 space-y-6">
          {/* Overall score banner */}
          <div className={`p-6 rounded-2xl border ${gradeColor} ${gradeBg} space-y-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="font-serif font-bold text-sm uppercase tracking-wider">SEO Score Card</span>
              </div>
              <span className="text-xl font-bold font-serif">{totalScore} <span className="text-xs text-stone-500">/ 100</span></span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  totalScore >= 90 ? 'bg-emerald-600' : totalScore >= 70 ? 'bg-blue-600' : totalScore >= 40 ? 'bg-amber-500' : 'bg-rose-600'
                }`}
                style={{ width: `${totalScore}%` }}
              ></div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-serif font-bold uppercase">{gradeName}</h4>
              <p className="text-xs leading-relaxed text-stone-600 font-serif">
                {gradeDesc}
              </p>
            </div>
          </div>

          {/* Individual Checks list */}
          <div className="bg-white border border-gold/15 p-5 rounded-2xl space-y-4 shadow-sm">
            <h4 className="text-xs font-mono tracking-widest uppercase font-bold text-royal-green border-b border-gold/10 pb-2">
              Structured Element Diagnostics
            </h4>

            {/* Title Diagnostics */}
            <div className="space-y-1.5 pb-3 border-b border-gold/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-royal-green font-serif">Meta Title Tag Check</span>
                {titleStatus === 'success' ? (
                  <span className="inline-flex items-center space-x-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Optimized</span>
                  </span>
                ) : titleStatus === 'warning' ? (
                  <span className="inline-flex items-center space-x-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <span>Adjust recommended</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                    <span>Critical Action</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 leading-normal">
                {titleFeedback}
              </p>
            </div>

            {/* Description Diagnostics */}
            <div className="space-y-1.5 pb-3 border-b border-gold/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-royal-green font-serif">Meta Description Check</span>
                {descStatus === 'success' ? (
                  <span className="inline-flex items-center space-x-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Optimized</span>
                  </span>
                ) : descStatus === 'warning' ? (
                  <span className="inline-flex items-center space-x-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <span>Adjust recommended</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                    <span>Critical Action</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 leading-normal">
                {descFeedback}
              </p>
            </div>

            {/* Keywords Diagnostics */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-royal-green font-serif">Keywords Density Check</span>
                {keysStatus === 'success' ? (
                  <span className="inline-flex items-center space-x-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Optimized</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <span>Needs Tweaking</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 leading-normal mb-2">
                {keysFeedback}
              </p>
              
              {currentKeys.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {currentKeys.map((k, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-royal-green/70 bg-cream/30 border border-gold/15 px-2 py-0.5 rounded-md">
                      {k}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* High Value Term Checklist */}
          <div className="bg-cream/15 border border-gold/10 p-5 rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-gold/10 pb-1.5">
              <h4 className="text-xs font-mono tracking-widest uppercase font-bold text-royal-green">
                Local Niche Search Query Match
              </h4>
              <span className="text-[10px] font-mono text-gold-dark font-bold bg-white px-2 py-0.5 rounded-full border border-gold/10">
                {matchedTerms.length} / {relevanceTerms.length} Matched
              </span>
            </div>

            <p className="text-[11px] font-serif text-stone-500 leading-normal">
              Incorporating highly queried terms helps potential clients find your website on Search engines. Green indicators mean the terms are active in your metadata tags.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {relevanceTerms.map((term, idx) => {
                const matched = combinedText.includes(term.toLowerCase());
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center space-x-1.5 p-1.5 rounded-lg text-xs font-serif ${
                      matched ? 'bg-emerald-50/75 text-emerald-800 font-medium' : 'bg-stone-50 text-stone-400'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${matched ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                    <span className="capitalize">{term}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
