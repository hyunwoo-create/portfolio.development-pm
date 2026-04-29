import React from 'react';
import { Plus, X, Star, Award, GraduationCap, Briefcase, Wrench, User, ArrowRight } from 'lucide-react';
import { EditableText } from './EditableText';
import { processImageHighQuality } from '../utils';

export const ToolsSection = ({ data, setData, isEditing, onNavClick }: any) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, listKey: string, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageHighQuality(file, 100).then(dataUrl => {
      setData((prev: any) => {
        const n = [...(prev[listKey] || [])];
        const oldItem = n[idx];
        const name = typeof oldItem === 'string' ? oldItem : oldItem.name;
        n[idx] = { name, image: dataUrl };
        return { ...prev, [listKey]: n };
      });
    }).catch(console.error);
  };

  const renderTool = (tool: any, idx: number, listKey: string) => {
    const toolObj = typeof tool === 'string' ? { name: tool, image: '' } : tool;
    
    return (
      <span key={idx} className="relative group/tool inline-flex items-center">
        <span className="px-3 py-1.5 bg-[#F9F7F7] border border-[#DBE2EF] text-[#112D4E] rounded-lg text-[11px] font-bold shadow-sm flex items-center gap-1.5">
          {isEditing ? (
            <label className="cursor-pointer flex items-center justify-center relative w-6 h-6 bg-gray-200/50 rounded hover:bg-gray-300/50 transition-colors shrink-0 overflow-hidden" title="아이콘 업로드">
              {toolObj.image ? (
                <img src={toolObj.image} alt="" className="w-full h-full object-contain" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-gray-500" />
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, listKey, idx)} />
            </label>
          ) : (
            toolObj.image && <img src={toolObj.image} alt="" className="w-6 h-6 object-contain shrink-0" />
          )}
          <EditableText value={toolObj.name} onSave={(v) => { 
            setData((prev: any) => {
              const n = [...(prev[listKey] || [])]; 
              n[idx] = { ...toolObj, name: v }; 
              return { ...prev, [listKey]: n };
            });
          }} isEditing={isEditing} disableMarkdown={true} />
        </span>
        {isEditing && (
          <button type="button" onClick={() => { 
            setData((prev: any) => {
              const n = [...(prev[listKey] || [])]; 
              n.splice(idx, 1); 
              return { ...prev, [listKey]: n };
            });
          }} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/tool:opacity-100 transition-opacity z-10 shadow-sm"><X className="w-2.5 h-2.5" /></button>
        )}
      </span>
    );
  };

  return (
    <div className="py-10 border-t border-[#DBE2EF]/60 relative pdf-no-break">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] flex items-center gap-3 uppercase">
          <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
            <Wrench className="w-5 h-5" />
          </div>
          사용 TOOL
        </h3>
        {!isEditing && (
          <button 
            onClick={() => {
              if (onNavClick) {
                onNavClick('stat-board');
              } else {
                const el = document.getElementById('stat-board');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-[11px] font-bold text-[#3F72AF] bg-[#3F72AF]/10 px-3 py-1.5 rounded-full hover:bg-[#3F72AF]/20 transition-colors flex items-center gap-1 flex-shrink-0"
          >
            More <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-6 pl-1">
        {(() => {
          const cats = [
            { id: 'toolsDocs', fallback: 'usedTools', label: '문서' },
            { id: 'toolsCollab', fallback: 'usedToolsBottom', label: '협업' },
            { id: 'toolsDesign', fallback: null, label: '디자인' },
            { id: 'toolsDev', fallback: null, label: '개발' },
            { id: 'toolsAi', fallback: null, label: 'AI' }
          ].map(c => {
            const listKey = (data[c.id] && data[c.id].length > 0) ? c.id : (c.fallback && data[c.fallback] && data[c.fallback].length > 0 ? c.fallback : c.id);
            return { ...c, listKey, items: data[listKey] || [] };
          }).filter(c => isEditing || c.items.length > 0);

          return cats.map((cat, index) => (
            <div key={cat.id} className="flex flex-col gap-2.5">
              <div className="text-[13.5px] font-black text-[#3F72AF] tracking-widest uppercase">{cat.label}</div>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((tool: any, idx: number) => renderTool(tool, idx, cat.listKey as any))}
                {isEditing && (
                  <button type="button" onClick={() => { 
                    setData((prev: any) => {
                      const n = [...(prev[cat.listKey] || []), { name: "새 툴", image: "" }]; 
                      return { ...prev, [cat.listKey]: n };
                    });
                  }} className="px-3 py-1.5 border border-dashed border-[#3F72AF]/40 text-[#3F72AF] rounded-lg text-[11px] font-bold hover:bg-[#3F72AF]/5 transition-colors flex items-center gap-1">
                    <Plus className="w-3 h-3" /> 추가
                  </button>
                )}
              </div>
              {index < cats.length - 1 && <div className="h-px bg-[#DBE2EF]/50 w-full mt-3" />}
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

export const ActivitiesSection = ({ data, setData, isEditing }: any) => (
  <div className="py-10 border-t border-[#DBE2EF]/60 relative pdf-no-break">
    <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] mb-8 flex items-center gap-3 uppercase">
      <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
        <Star className="w-5 h-5" />
      </div>
      주요 활동
    </h3>
    <div className="space-y-6 pl-1">
      {(data.keyActivities || []).map((act: any, idx: number) => (
        <div key={idx} className="relative group/act">
          {isEditing && (
            <button type="button" onClick={() => { 
              setData((prev: any) => {
                const n = [...(prev.keyActivities || [])]; 
                n.splice(idx, 1); 
                return { ...prev, keyActivities: n };
              });
            }} className="absolute -left-6 top-1 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/act:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
          )}
          <div className="text-[14px] font-bold text-[#112D4E] mb-1.5 leading-tight">
            <EditableText value={act.title} onSave={(v) => { 
              setData((prev: any) => {
                const n = [...(prev.keyActivities || [])]; 
                n[idx] = { ...n[idx], title: v }; 
                return { ...prev, keyActivities: n };
              });
            }} isEditing={isEditing} />
          </div>
          <div className="text-[12px] text-[#3F72AF] font-medium leading-[1.6]">
            <EditableText value={act.description} onSave={(v) => { 
              setData((prev: any) => {
                const n = [...(prev.keyActivities || [])]; 
                n[idx] = { ...n[idx], description: v }; 
                return { ...prev, keyActivities: n };
              });
            }} isEditing={isEditing} multiline />
          </div>
        </div>
      ))}
      {isEditing && <button type="button" onClick={() => { 
        setData((prev: any) => {
          const n = prev.keyActivities ? [...prev.keyActivities] : []; 
          n.push({ title: "새 주요 활동", description: "활동 설명을 입력하세요" }); 
          return { ...prev, keyActivities: n };
        });
      }} className="w-full py-2 border border-dashed border-[#3F72AF]/30 rounded-xl text-[11px] font-bold text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all mt-4"><Plus className="w-3 h-3 inline mr-1" /> 주요 활동 추가</button>}
    </div>
  </div>
);

export const EducationSection = ({ data, setData, isEditing }: any) => (
  <div className="py-10 border-t border-b border-[#DBE2EF]/60 relative pdf-no-break">
    <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] mb-8 flex items-center gap-3 uppercase">
      <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
        <GraduationCap className="w-5 h-5" />
      </div>
      학력 및 교육
    </h3>
    <div className="space-y-7">
      {(data.education || []).map((edu: any, idx: number) => (
        <div key={idx} className="relative group/edu">
          {isEditing && (
            <button type="button" onClick={() => { 
              setData((prev: any) => {
                const n = [...(prev.education || [])]; 
                n.splice(idx, 1); 
                return { ...prev, education: n };
              });
            }} className="absolute -left-6 top-1 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/edu:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
          )}
          <div className="text-[14px] font-bold text-[#112D4E] mb-2 leading-tight">
            <EditableText value={edu.title} onSave={(v) => { 
              setData((prev: any) => {
                const n = [...(prev.education || [])]; 
                n[idx] = { ...n[idx], title: v }; 
                return { ...prev, education: n };
              });
            }} isEditing={isEditing} />
          </div>
          <div className="space-y-1.5 mt-2">
            {(edu.details || []).map((d: string, i: number) => (
              <div key={i} className="group/item relative flex items-start gap-1.5 text-[12px] text-[#3F72AF] font-medium">
                <span className="font-bold shrink-0 mt-[1px]">•</span>
                <span className="flex-1">
                  <EditableText value={d} onSave={(v) => { 
                    setData((prev: any) => {
                      const n = [...(prev.education || [])]; 
                      const details = [...(n[idx].details || [])];
                      details[i] = v;
                      n[idx] = { ...n[idx], details };
                      return { ...prev, education: n };
                    });
                  }} isEditing={isEditing} />
                </span>
                {isEditing && <button type="button" onClick={() => { 
                  setData((prev: any) => {
                    const n = [...(prev.education || [])]; 
                    const details = [...(n[idx].details || [])];
                    details.splice(i, 1); 
                    n[idx] = { ...n[idx], details };
                    return { ...prev, education: n };
                  });
                }} className="opacity-0 group-hover/item:opacity-100 absolute -left-5 top-0 text-red-300 transition-opacity"><X className="w-2.5 h-2.5" /></button>}
              </div>
            ))}
            {isEditing && (
              <button type="button" onClick={() => { 
                setData((prev: any) => {
                  const n = [...(prev.education || [])]; 
                  const details = [...(n[idx].details || [])];
                  details.push("새 설명"); 
                  n[idx] = { ...n[idx], details };
                  return { ...prev, education: n };
                });
              }} className="text-[10px] text-[#3F72AF]/60 hover:text-[#3F72AF] ml-2">+ 설명 추가</button>
            )}
          </div>
        </div>
      ))}
      {isEditing && <button type="button" onClick={() => { 
        setData((prev: any) => {
          const n = prev.education ? [...prev.education] : []; 
          n.push({ title: "새 학력", period: "", description: "", details: [] }); 
          return { ...prev, education: n };
        });
      }} className="w-full py-2 border border-dashed border-[#3F72AF]/30 rounded-xl text-[11px] font-bold text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all mt-4"><Plus className="w-3 h-3 inline mr-1" /> 학력 추가</button>}
    </div>
  </div>
);

export const ExperienceSection = ({ data, setData, isEditing }: any) => (
  <div className="py-10 border-b border-[#DBE2EF]/60 relative pdf-no-break">
    <div className="flex flex-col mb-8">
      <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] flex items-center gap-3 uppercase">
        <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
          <Briefcase className="w-5 h-5" />
        </div>
        경력 사항
      </h3>
    </div>

    <div className="relative before:absolute before:inset-y-2 before:left-[4.5px] before:w-[1.5px] before:bg-[#DBE2EF] space-y-8">
      {(data.leftExperience || []).map((exp: any, idx: number) => (
        <div key={idx} className="relative group/exp pl-6">
          {/* Timeline Node */}
          <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-[1.5px] border-[#3F72AF] bg-[#F9F7F7] z-10" />

          {isEditing && (
            <button type="button" onClick={() => { 
              setData((prev: any) => {
                const n = [...(prev.leftExperience || [])]; 
                n.splice(idx, 1); 
                return { ...prev, leftExperience: n };
              });
            }} className="absolute -left-6 top-0.5 text-red-300 hover:text-red-500 z-20 opacity-0 group-hover/exp:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
          )}

          <div className="text-[14px] font-bold text-[#112D4E] mb-2 leading-tight">
            <EditableText value={exp.title} onSave={(v) => { 
              setData((prev: any) => {
                const n = [...(prev.leftExperience || [])]; 
                n[idx] = { ...n[idx], title: v }; 
                return { ...prev, leftExperience: n };
              });
            }} isEditing={isEditing} />
          </div>

          <div className="space-y-1.5">
            <div className="text-[12px] text-[#3F72AF] font-medium leading-[1.6] flex flex-col gap-1">
              {(exp.details || []).map((d: string, i: number) => (
                <div key={i} className="group/detail relative flex items-start gap-1.5">
                  <span className="font-bold shrink-0 mt-[1px]">•</span>
                  <span className="flex-1 whitespace-pre-wrap">
                    <EditableText
                      value={d}
                      multiline
                      onSave={(v) => {
                        setData((prev: any) => {
                          const n = [...(prev.leftExperience || [])];
                          const details = [...(n[idx].details || [])];
                          details[i] = v;
                          n[idx] = { ...n[idx], details };
                          return { ...prev, leftExperience: n };
                        });
                      }}
                      isEditing={isEditing}
                    />
                  </span>
                  {isEditing && <button type="button" onClick={() => { 
                    setData((prev: any) => {
                      const n = [...(prev.leftExperience || [])]; 
                      const details = [...(n[idx].details || [])];
                      details.splice(i, 1); 
                      n[idx] = { ...n[idx], details };
                      return { ...prev, leftExperience: n };
                    });
                  }} className="opacity-0 group-hover/detail:opacity-100 absolute -left-5 top-0 text-red-300 transition-opacity"><X className="w-2.5 h-2.5" /></button>}
                </div>
              ))}
              {isEditing && (
                <button type="button" onClick={() => { 
                  setData((prev: any) => {
                    const n = [...(prev.leftExperience || [])]; 
                    const details = [...(n[idx].details || [])];
                    details.push("새 직무/역할"); 
                    n[idx] = { ...n[idx], details };
                    return { ...prev, leftExperience: n };
                  });
                }} className="text-[10px] text-[#3F72AF]/60 hover:text-[#3F72AF] w-max">+ 역할 추가</button>
              )}
            </div>

            <div className="text-[12px] font-bold text-[#112D4E] whitespace-pre-wrap leading-[1.6] pt-1">
              <EditableText
                value={exp.period || 'YYYY.MM ~ YYYY.MM'}
                multiline
                onSave={(v) => {
                  setData((prev: any) => {
                    const n = [...(prev.leftExperience || [])];
                    n[idx] = { ...n[idx], period: v };
                    return { ...prev, leftExperience: n };
                  });
                }}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      ))}
      {isEditing && <button type="button" onClick={() => { 
        setData((prev: any) => {
          const n = prev.leftExperience ? [...prev.leftExperience] : []; 
          n.push({ title: "새 경력", period: "YYYY.MM ~ YYYY.MM", description: "", details: [] }); 
          return { ...prev, leftExperience: n };
        });
      }} className="w-full py-2 border border-dashed border-[#3F72AF]/30 rounded-xl text-[11px] font-bold text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all mt-4 ml-6"><Plus className="w-3 h-3 inline mr-1" /> 경력 추가</button>}
    </div>
  </div>
);

export const CertificatesSection = ({ data, setData, isEditing }: any) => (
  <div className="py-10 relative pdf-no-break border-b border-[#DBE2EF]/60 md:border-none">
    <h3 className="font-black text-[#112D4E] text-[13px] tracking-[0.15em] mb-8 flex items-center gap-3 uppercase">
      <div className="w-9 h-9 rounded-xl bg-[#3F72AF]/10 flex items-center justify-center text-[#3F72AF] shadow-sm">
        <Award className="w-5 h-5" />
      </div>
      자격 및 수상
    </h3>
    <div className="space-y-7 pl-1">
      {(data.awards || []).map((cert: any, idx: number) => (
        <div key={idx} className="relative group/cert">
          {isEditing && (
            <button type="button" onClick={() => { 
              setData((prev: any) => {
                const n = [...(prev.awards || [])]; 
                n.splice(idx, 1); 
                return { ...prev, awards: n };
              });
            }} className="absolute -left-6 top-1 text-red-300 hover:text-red-500 z-10 opacity-0 group-hover/cert:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
          )}
          <div className="flex flex-col gap-1.5">
            <div className="text-[14px] text-[#112D4E] font-bold leading-tight">
              <EditableText value={cert.title} onSave={(v) => { 
                setData((prev: any) => {
                  const n = [...(prev.awards || [])]; 
                  n[idx] = { ...n[idx], title: v }; 
                  return { ...prev, awards: n };
                });
              }} isEditing={isEditing} />
            </div>
            <div className="flex items-center gap-2 text-[12px] font-medium text-[#7A8A9E]">
              <span>
                <EditableText value={cert.organization} onSave={(v) => { 
                  setData((prev: any) => {
                    const n = [...(prev.awards || [])]; 
                    n[idx] = { ...n[idx], organization: v }; 
                    return { ...prev, awards: n };
                  });
                }} isEditing={isEditing} />
              </span>
              <span className="w-1 h-1 rounded-full bg-[#DBE2EF]" />
              <span>
                <EditableText value={cert.year ? `${cert.year}` : '연도'} onSave={(v) => { 
                  setData((prev: any) => {
                    const n = [...(prev.awards || [])]; 
                    n[idx] = { ...n[idx], year: v.replace(/[()]/g, '') }; 
                    return { ...prev, awards: n };
                  });
                }} isEditing={isEditing} />
              </span>
            </div>
          </div>
        </div>
      ))}
      {isEditing && <button type="button" onClick={() => { 
        setData((prev: any) => {
          const c = prev.awards || []; 
          const n = [...c, { title: "새 자격증", organization: "기관", year: "연도" }]; 
          return { ...prev, awards: n };
        });
      }} className="w-full py-2 border border-dashed border-[#3F72AF]/30 rounded-xl text-[11px] font-bold text-[#3F72AF] hover:bg-[#3F72AF]/5 transition-all mt-4"><Plus className="w-3 h-3 inline mr-1" /> 자격/수상 추가</button>}
    </div>
  </div>
);

export const SummarySection = ({ data, setData, isEditing }: any) => (
  <section className="pdf-no-break">
    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 ">
      <User className="text-[#112D4E] w-6 h-6" /> 한 줄 소개
    </h3>
    <p className="text-[#112D4E] leading-relaxed font-medium">
      <EditableText
        value={data.summary}
        onSave={(v) => setData((prev: any) => ({ ...prev, summary: v }))}
        isEditing={isEditing}
        multiline
        style={data.summaryStyle || {}}
        styleData={data.summaryStyle || {}}
        onStyleSave={(s) => setData((prev: any) => ({ ...prev, summaryStyle: s }))}
      />
    </p>
  </section>
);
