import React from 'react';
import { Plus, X, Briefcase } from 'lucide-react';
import { EditableText } from './EditableText';
import { processImageHighQuality, getExternalEmbedUrl } from '../utils';

export const ProjectsSection = ({ 
  data, 
  setData, 
  isEditing, 
  activeLinkEditor, 
  setActiveLinkEditor, 
  linkInput, 
  setLinkInput 
}: any) => (
  <section className="pdf-no-break">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-xl font-black flex items-center gap-3 text-[#112D4E] tracking-tight">
        <div className="w-9 h-9 rounded-xl bg-[#112D4E]/10 flex items-center justify-center text-[#112D4E]">
          <Briefcase className="w-5 h-5" />
        </div>
        프로젝트 경험
      </h3>
      {isEditing && (
        <button 
          onClick={() => {
            const newExp = [...(data.experience || [])];
            newExp.push({ title: "새 프로젝트", period: "기간", description: "설명", details: [], isReleased: true, metrics: [
              { label: "사용자", value: "0" },
              { label: "좋아요", value: "0" },
              { label: "성과", value: "설명" }
            ] });
            setData({...data, experience: newExp});
          }}
          className="px-4 py-2 bg-[#112D4E] text-white rounded-xl hover:bg-[#0f1a2a] transition-all flex items-center gap-2 text-xs font-extrabold shadow-sm"
        >
          <Plus className="w-4 h-4" /> 프로젝트 추가
        </button>
      )}
    </div>
    <div className="space-y-12">
      {(data.experience || []).map((exp: any, idx: number) => {
        const isReleased = exp.isReleased !== false && (exp.title?.includes('출시') || exp.metrics);
        
        return (
          <div key={idx} className={`relative pl-10 border-l-2 border-[#3F72AF] transition-all group/exp`}>
            {/* Timeline Dot */}
            <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-[#3F72AF] bg-white z-10 ${
              isReleased ? 'shadow-[0_0_15px_rgba(249,115,22,0.3)] border-orange-500' : ''
            }`} />
            
            {isEditing && (
              <button 
                onClick={() => {
                  const newExp = [...(data.experience || [])];
                  newExp.splice(idx, 1);
                  setData({...data, experience: newExp});
                }}
                className="absolute -left-10 top-0 p-1 text-red-300 hover:text-red-500 opacity-0 group-hover/exp:opacity-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  {/* Project Icon */}
                  <div className="relative group/icon shrink-0">
                    {exp.icon ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-[#DBE2EF]/50 relative group/icon">
                        <img src={exp.icon} alt={exp.title} className="w-full h-full object-cover" />
                        {isEditing && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/icon:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
                            <button onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) processImageHighQuality(file).then(d => {
                                  const n = [...(data.experience || [])];
                                  n[idx].icon = d;
                                  setData({...data, experience: n});
                                });
                              };
                              input.click();
                            }} className="w-full py-1 bg-white text-[8px] font-bold rounded-md">파일</button>
                            <button onClick={() => {
                              setActiveLinkEditor({type: 'projIcon', idx});
                              setLinkInput(exp.icon || '');
                            }} className="w-full py-1 bg-[#3F72AF] text-white text-[8px] font-bold rounded-md">링크</button>
                            <button onClick={() => {
                              const n = [...(data.experience || [])];
                              n[idx].icon = null;
                              setData({...data, experience: n});
                            }} className="w-full py-1 bg-red-500 text-white text-[8px] font-bold rounded-md">삭제</button>
                          </div>
                        )}
                        {isEditing && activeLinkEditor?.type === 'projIcon' && activeLinkEditor?.idx === idx && (
                          <div className="absolute inset-0 bg-white/95 z-30 p-2 flex flex-col justify-center gap-2">
                            <input type="text" value={linkInput} onChange={e => setLinkInput(e.target.value)} placeholder="URL" className="w-full border border-[#DBE2EF] rounded px-2 py-1 text-[8px]" autoFocus />
                            <div className="flex gap-1">
                              <button onClick={() => {
                                const finalUrl = getExternalEmbedUrl(linkInput);
                                const n = [...(data.experience || [])];
                                n[idx].icon = finalUrl;
                                setData({...data, experience: n});
                                setActiveLinkEditor(null);
                              }} className="flex-1 bg-[#112D4E] text-white rounded py-1 text-[8px]">적용</button>
                              <button onClick={() => setActiveLinkEditor(null)} className="flex-1 bg-[#DBE2EF] text-[#112D4E] rounded py-1 text-[8px]">취소</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      isEditing && (
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) processImageHighQuality(file).then(d => {
                                  const n = [...(data.experience || [])];
                                  n[idx].icon = d;
                                  setData({...data, experience: n});
                                });
                              };
                              input.click();
                            }}
                            className="w-12 h-6 rounded-md border border-dashed border-[#DBE2EF] flex items-center justify-center text-[8px] text-[#3F72AF] hover:border-[#3F72AF] transition-all"
                          >
                            파일
                          </button>
                          <button 
                            onClick={() => {
                              setActiveLinkEditor({type: 'projIcon', idx});
                              setLinkInput('');
                            }}
                            className="w-12 h-6 rounded-md border border-dashed border-[#3F72AF] flex items-center justify-center text-[8px] text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all"
                          >
                            링크
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-black text-[21px] text-[#112D4E] tracking-tight">
                        <EditableText 
                          value={(exp.title || "").trim()} 
                          onSave={(v) => {
                            const newExp = [...(data.experience || [])];
                            newExp[idx].title = v;
                            setData({...data, experience: newExp});
                          }} 
                          isEditing={isEditing} 
                          style={exp.titleStyle || {}}
                          styleData={exp.titleStyle || {}}
                          onStyleSave={(s) => {
                            const newExp = [...(data.experience || [])];
                            newExp[idx].titleStyle = s;
                            setData({...data, experience: newExp});
                          }}
                        />
                      </h4>
                      {(isReleased || isEditing) && (
                        <div className="flex items-center gap-1">
                          <div
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-1.5 ${
                              isReleased 
                                ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-[0_2px_10px_rgba(249,115,22,0.1)]' 
                                : 'bg-gray-50 text-gray-400 border-gray-200 opacity-50 hover:opacity-100'
                            }`}
                          >
                            {isEditing && (
                              <button
                                onClick={() => {
                                  const newExp = [...(data.experience || [])];
                                  newExp[idx].isReleased = !isReleased;
                                  setData({...data, experience: newExp});
                                }}
                                className={`w-2 h-2 rounded-full transition-colors ${isReleased ? 'bg-orange-500' : 'bg-gray-300'}`}
                                title="출시 상태 토글"
                              />
                            )}
                            
                            {/* Platform Icon Section */}
                            <div className="relative group/picon flex-shrink-0">
                              {exp.platformIcon ? (
                                <div className="w-3.5 h-3.5 rounded-sm overflow-hidden flex items-center justify-center relative group/picon-active">
                                  <img src={exp.platformIcon} alt="platform" className="w-full h-full object-contain" />
                                  {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/picon-active:opacity-100 flex flex-col items-center justify-center gap-0.5 z-20">
                                      <button onClick={(e) => {
                                        e.stopPropagation();
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = (ev: any) => {
                                          const file = ev.target.files?.[0];
                                          if (file) processImageHighQuality(file).then(d => {
                                            const n = [...(data.experience || [])];
                                            n[idx].platformIcon = d;
                                            setData({...data, experience: n});
                                          });
                                        };
                                        input.click();
                                      }} className="text-[5px] bg-white rounded px-0.5">F</button>
                                      <button onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveLinkEditor({type: 'platIcon', idx});
                                        setLinkInput(exp.platformIcon || '');
                                      }} className="text-[5px] bg-white rounded px-0.5">L</button>
                                      <button onClick={(e) => {
                                        e.stopPropagation();
                                        const n = [...(data.experience || [])];
                                        n[idx].platformIcon = null;
                                        setData({...data, experience: n});
                                      }} className="text-[5px] bg-red-500 text-white rounded px-0.5">X</button>
                                    </div>
                                  )}
                                  {isEditing && activeLinkEditor?.type === 'platIcon' && activeLinkEditor?.idx === idx && (
                                    <div className="absolute left-0 top-0 bg-white border border-[#DBE2EF] rounded shadow-xl p-1 z-30 min-w-[80px]">
                                      <input type="text" value={linkInput} onChange={e => setLinkInput(e.target.value)} placeholder="URL" className="w-full text-[6px] border rounded mb-1" autoFocus />
                                      <div className="flex gap-1">
                                        <button onClick={() => {
                                          const finalUrl = getExternalEmbedUrl(linkInput);
                                          const n = [...(data.experience || [])];
                                          n[idx].platformIcon = finalUrl;
                                          setData({...data, experience: n});
                                          setActiveLinkEditor(null);
                                        }} className="flex-1 bg-[#112D4E] text-white text-[6px] rounded">Ok</button>
                                        <button onClick={() => setActiveLinkEditor(null)} className="flex-1 bg-gray-200 text-[6px] rounded">C</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                isEditing && (
                                  <div className="flex items-center gap-1">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = (ev: any) => {
                                          const file = ev.target.files?.[0];
                                          if (file) processImageHighQuality(file).then(d => {
                                            const n = [...(data.experience || [])];
                                            n[idx].platformIcon = d;
                                            setData({...data, experience: n});
                                          });
                                        };
                                        input.click();
                                      }}
                                      className="w-3 h-3 border border-dashed border-gray-300 rounded-sm flex items-center justify-center text-[6px]"
                                      title="파일"
                                    >F</button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveLinkEditor({type: 'platIcon', idx});
                                        setLinkInput('');
                                      }}
                                      className="w-3 h-3 border border-dashed border-blue-300 rounded-sm flex items-center justify-center text-[6px]"
                                      title="링크"
                                    >L</button>
                                  </div>
                                )
                              )}
                            </div>
                            <span className={isEditing ? 'cursor-text' : ''}>
                              <EditableText 
                                value={exp.releasedText || (isReleased ? 'Released' : 'Set Released')} 
                                onSave={(v) => {
                                  const newExp = [...(data.experience || [])];
                                  newExp[idx].releasedText = v;
                                  setData({...data, experience: newExp});
                                }} 
                                isEditing={isEditing} 
                                disableMarkdown={true}
                              />
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* New Indented Subtitle Field */}
                    <div className="pl-1 text-[13px] text-[#3F72AF] font-bold leading-tight -mt-1 mb-1">
                      <EditableText 
                        value={exp.subtitle || (isEditing ? "프로젝트 부제목 또는 한 줄 설명" : "")} 
                        onSave={(v) => {
                          const newExp = [...(data.experience || [])];
                          newExp[idx].subtitle = v;
                          setData({...data, experience: newExp});
                        }} 
                        isEditing={isEditing} 
                        disableMarkdown={true}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-[13px] font-bold font-mono text-[#3F72AF]/80">
                  <EditableText 
                    value={(exp.period || "").trim()} 
                    onSave={(v) => {
                      const newExp = [...(data.experience || [])];
                      newExp[idx].period = v;
                      setData({...data, experience: newExp});
                    }} 
                    isEditing={isEditing} 
                  />
                </span>
              </div>

              {/* Metrics Badge Row — 지표가 있으면 released 여부와 무관하게 표시 */}
              {((exp.metrics && exp.metrics.length > 0) || isEditing) && (
                <div className="flex gap-3 flex-wrap mb-2">
                  {(exp.metrics || []).map((m: any, i: number) => (
                    <div key={i} className="group/metric relative bg-[#F9F7F7] border border-[#DBE2EF] rounded-2xl px-4 py-3 flex flex-col gap-0.5 min-w-[120px] shadow-sm hover:shadow-md transition-all">
                      {isEditing && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newExp = [...(data.experience || [])];
                            newExp[idx].metrics.splice(i, 1);
                            setData({...data, experience: newExp});
                          }}
                          className="absolute -right-2 -top-2 bg-white border border-red-200 text-red-500 rounded-full p-0.5 opacity-0 group-hover/metric:opacity-100 shadow-sm transition-all z-20"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      )}
                      <span className="text-[10px] font-extrabold text-[#3F72AF]/60 uppercase tracking-tighter">
                        <EditableText 
                          value={m.label} 
                          onSave={(v) => {
                            const newExp = [...(data.experience || [])];
                            newExp[idx].metrics[i].label = v;
                            setData({...data, experience: newExp});
                          }} 
                          isEditing={isEditing} 
                        />
                      </span>
                      <span className="text-[14.5px] font-black text-[#112D4E]">
                        <EditableText 
                          value={m.value} 
                          onSave={(v) => {
                            const newExp = [...(data.experience || [])];
                            newExp[idx].metrics[i].value = v;
                            setData({...data, experience: newExp});
                          }} 
                          isEditing={isEditing} 
                        />
                      </span>
                    </div>
                  ))}
                  {isEditing && (
                    <button 
                      onClick={() => {
                        const newExp = [...(data.experience || [])];
                        if(!newExp[idx].metrics) newExp[idx].metrics = [];
                        newExp[idx].metrics.push({ label: "신규 지표", value: "데이터" });
                        setData({...data, experience: newExp});
                      }}
                      className="border-2 border-dashed border-[#3F72AF]/20 rounded-2xl px-4 py-3 flex flex-col items-center justify-center min-w-[120px] text-[#3F72AF]/40 hover:text-[#3F72AF] hover:border-[#3F72AF]/50 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-[10px] font-bold mt-1">지표 추가</span>
                    </button>
                  )}
                </div>
              )}

              <div className="text-[14.5px] text-[#1A374D] font-medium leading-[1.8] tracking-tight markdown-body">
                <EditableText 
                  value={(exp.details || []).filter((d: string) => d && d.trim() !== '').join('\n')} 
                  multiline
                  onSave={(v) => {
                    const newExp = [...(data.experience || [])];
                    if (v.startsWith('<')) {
                      // HTML인 경우 리스트로 쪼개지 않고 전체를 하나로 저장 (Tiptap 호환)
                      newExp[idx].details = [v];
                    } else {
                      // 일반 텍스트인 경우 기존처럼 줄바꿈으로 분리
                      newExp[idx].details = v.split('\n').map((line: string) => line.trim()).filter((line: string) => line !== '');
                    }
                    setData({...data, experience: newExp});
                  }} 
                  isEditing={isEditing} 
                  style={exp.style || {}}
                  styleData={exp.style || {}}
                  onStyleSave={(s) => {
                    const newExp = [...(data.experience || [])];
                    newExp[idx].style = s;
                    setData({...data, experience: newExp});
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);
