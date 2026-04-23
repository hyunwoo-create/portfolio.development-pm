import React from 'react';
import { PlayCircle, Upload, ChevronRight } from 'lucide-react';
import { EditableText } from './EditableText';
import { AdminTextEditor } from './AdminTextEditor';
import { processImageHighQuality } from '../utils';

interface AboutProps {
  isEditing: boolean;
  content: any;
  setContent: (c: any) => void;
  onMoreMeClick: () => void;
}

export const About = ({ isEditing, content, setContent, onMoreMeClick }: AboutProps) => {
  const skills = [1, 2, 3];
  
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      try {
        const base64 = await processImageHighQuality(file);
        setContent({...content, videoUrl: base64});
      } catch (err) {
        console.error(err);
        alert('이미지 최적화 중 오류가 발생했습니다.');
      }
    } else {
      if (file.size > 500 * 1024) {
        alert("서버 용량 제한으로 인해 500KB 이상의 동영상은 직접 업로드할 수 없습니다. 유튜브, 구글 드라이브 등의 외부 링크를 이용해주세요.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setContent({...content, videoUrl: ev.target?.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const totalParam = parseInt(content.chartTotal) || 100;
  const v1 = parseInt(content.skill1Value) || 80;
  const v2 = parseInt(content.skill2Value) || 60;
  const v3 = parseInt(content.skill3Value) || 40;

  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto bg-[#F9F7F7]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-[#3F72AF]/20 pb-6 gap-4">
        <h2 className="text-3xl md:text-4xl font-black text-[#112D4E] tracking-tight whitespace-pre-wrap">
          <EditableText 
            value={content.titleLeft || "Q. 누구를 채용해야 할까요?"} 
            onSave={(v) => setContent({...content, titleLeft: v})} 
            isEditing={isEditing} 
          />
        </h2>
        <h2 className="text-2xl md:text-3xl font-black text-[#3F72AF] tracking-tight text-right w-full md:w-auto whitespace-pre-wrap">
          <EditableText 
            value={content.titleRight || "A. 저 입니다. 지원자 양 현우"} 
            onSave={(v) => setContent({...content, titleRight: v})} 
            isEditing={isEditing} 
          />
        </h2>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 relative items-stretch">
        
        {/* Left Column: Cards */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Chart Card */}
          <div className="bg-white rounded-[2rem] shadow-lg shadow-[#112D4E]/5 border border-[#DBE2EF] p-8">
            <div className="flex flex-col items-center justify-center mb-10 relative">
              <h3 className="text-lg font-black text-[#112D4E] text-center">
                <EditableText 
                  value={content.chartTitle || "막대형 그래프 채용 지원자격 top3"} 
                  onSave={(v) => setContent({...content, chartTitle: v})} 
                  isEditing={isEditing} 
                />
              </h3>
              {isEditing && (
                <div className="mt-4 flex items-center gap-2 bg-[#DBE2EF]/30 px-3 py-1.5 rounded-lg border border-[#DBE2EF]">
                  <span className="text-[#3F72AF] text-xs font-bold">모수(Total): </span>
                  <input 
                    type="number"
                    value={content.chartTotal || 100}
                    onChange={(e) => setContent({...content, chartTotal: e.target.value})}
                    className="w-16 border border-[#3F72AF]/30 rounded px-2 py-0.5 text-xs font-bold text-center"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-8 relative">
              {/* Vertical Grid Lines (Cosmetic) */}
              <div className="absolute inset-0 left-20 flex justify-between pointer-events-none z-0 mt-2">
                <div className="h-full ml-4 relative flex items-start">
                  <div className="absolute inset-y-0 left-0 border-l border-dashed border-[#3F72AF] opacity-20"></div>
                  <span className="absolute -top-6 -translate-x-1/2 text-[10px] font-bold text-[#3F72AF] opacity-50 bg-white px-1">0</span>
                </div>
                <div className="h-full mr-12 relative flex items-start">
                  <div className="absolute inset-y-0 left-0 border-l border-dashed border-[#3F72AF] opacity-20"></div>
                  <span className="absolute -top-6 -translate-x-1/2 text-xs font-black text-[#1A59A7] bg-white px-1.5 py-0.5 shadow-sm rounded z-10 border border-[#DBE2EF]">{totalParam}</span>
                </div>
              </div>

              {skills.map((num) => {
                const v = num === 1 ? v1 : num === 2 ? v2 : v3;
                const p = Math.min((v / totalParam) * 100, 100);
                return (
                <div key={num} className="flex items-center gap-4 relative z-10 pr-4">
                  <div className="w-14 text-sm font-bold text-[#112D4E] text-right whitespace-pre-wrap">
                    <EditableText 
                      value={content[`skill${num}Name`] || `역량 ${String.fromCharCode(64 + num)}`} 
                      onSave={(v) => setContent({...content, [`skill${num}Name`]: v})} 
                      isEditing={isEditing} 
                    />
                  </div>
                  <div className="flex-1 flex flex-col group w-full">
                    <div className="h-8 bg-transparent relative flex items-center w-full">
                      <div 
                        className="h-full bg-[#3F72AF] rounded-r-md transition-all duration-700 shadow-sm flex items-center justify-end px-2 overflow-visible relative"
                        style={{ width: `${p}%`, minWidth: '1.5rem', maxWidth: '100%' }}
                      >
                         {p > 15 && <span className="text-white text-[10px] font-bold drop-shadow-md whitespace-nowrap px-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2">{Math.round(p)}%</span>}
                      </div>
                      <span className="ml-3 text-sm font-black text-[#112D4E] min-w-[2rem]">{v}</span>
                      
                      {isEditing && (
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#3F72AF]">값:</span>
                          <input 
                            type="number" 
                            value={content[`skill${num}Value`] || v}
                            onChange={(e) => setContent({...content, [`skill${num}Value`]: e.target.value})}
                            className="w-14 text-xs border border-[#DBE2EF] rounded px-1 h-6 font-bold text-[#112D4E] text-center"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Video Card */}
          <div className="bg-white rounded-[2rem] shadow-lg shadow-[#112D4E]/5 border border-[#DBE2EF] p-8 flex flex-col items-center">
            <h3 className="text-lg font-black text-[#112D4E] text-center mb-6">
              <EditableText 
                value={content.videoTitle || "크롤러 동영상"} 
                onSave={(v) => setContent({...content, videoTitle: v})} 
                isEditing={isEditing} 
              />
            </h3>
            
            <div className="w-full aspect-video bg-[#DBE2EF]/30 rounded-2xl overflow-hidden relative flex items-center justify-center border border-[#DBE2EF]">
              {content.videoUrl ? (
                <video 
                  src={content.videoUrl} 
                  controls 
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-[#3F72AF]">
                  <PlayCircle className="w-12 h-12 mx-auto mb-2 opacity-60" />
                </div>
              )}

              {isEditing && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 opacity-0 hover:opacity-100 transition-opacity z-10 p-4">
                  <div className="w-full max-w-[200px]">
                    <label className="text-white text-xs font-bold mb-1 block">동영상 URL 입력</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      value={content.videoUrl || ""}
                      onChange={(e) => setContent({...content, videoUrl: e.target.value})}
                      className="w-full px-3 py-2 rounded text-black text-xs"
                    />
                  </div>
                  <div className="text-white text-[10px] font-bold">OR</div>
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'video/*,image/*';
                      input.onchange = handleVideoUpload as any;
                      input.click();
                    }}
                    className="flex items-center gap-2 bg-white text-[#112D4E] px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition"
                  >
                    <Upload className="w-4 h-4" /> 파일 업로드
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Text and Button */}
        <div className="lg:col-span-7 flex flex-col justify-between py-6">
          <div className="flex flex-col space-y-16 lg:pl-16 flex-1 justify-around">
            {skills.map((num) => (
              <div key={num} className="relative">
                {/* Desktop Arrow perfectly pointing at this block */}
                <div className="hidden lg:flex absolute top-1/2 -left-16 w-12 -translate-y-1/2 items-center opacity-30 text-[#3F72AF] pointer-events-none">
                  <div className="flex-1 border-t-2 border-dashed border-[#3F72AF]"></div>
                  <ChevronRight className="w-5 h-5 -ml-2" />
                </div>

                <h4 className="text-[17px] font-black text-[#112D4E] mb-3 leading-snug tracking-tight whitespace-pre-wrap">
                  <EditableText 
                    value={content[`descTitle${num}`] || `역량 ${String.fromCharCode(64 + num)}에 해당하는 내용 및 역량`} 
                    onSave={(v) => setContent({...content, [`descTitle${num}`]: v})} 
                    isEditing={isEditing} 
                  />
                </h4>
                <div className="text-[#3F72AF] text-[15px] leading-relaxed font-medium">
                  <AdminTextEditor
                    isAdmin={isEditing}
                    hideTitle
                    bodyValue={content[`descText${num}`] || (num === 1 ? '채용 공고에서 요구하는 최우선 역량을 완벽하게 충족하며, 실무에서 즉시 성과를 창출할 수 있는 기획력과 문제해결 능력을 보유하고 있습니다.' : num === 2 ? '다양한 직군과의 협업 경험을 통해 커뮤니케이션 비용을 줄이고, 복잡한 프로젝트를 리드하여 성공적인 런칭을 이끌어냅니다.' : '데이터 수집 및 분석 자동화(크롤링) 경험을 바탕으로, 높은 수준의 기술적 이해도를 지니고 있어 개발팀과 매끄럽게 소통합니다.')}
                    onBodyChange={(v) => setContent({...content, [`descText${num}`]: v})}
                    bodyPlaceholder="상세 설명을 입력하세요..."
                    minBodyHeight="120px"
                    readonlyClassName="markdown-body"
                  />
                </div>
                
                {/* Arrow for mobile, displayed below text */}
                <div className="lg:hidden flex items-center w-full opacity-20 text-[#3F72AF] mt-6">
                  <div className="flex-1 border-t-2 border-dashed border-[#3F72AF]"></div>
                  <ChevronRight className="w-5 h-5 -ml-2" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-end lg:pr-8">
            <button 
              onClick={onMoreMeClick}
              className="bg-[#112D4E] text-white px-8 py-4 rounded-full font-bold shadow-xl flex items-center gap-3 hover:bg-[#1A59A7] transition-all whitespace-nowrap transform hover:scale-105"
            >
              MORE ME <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
