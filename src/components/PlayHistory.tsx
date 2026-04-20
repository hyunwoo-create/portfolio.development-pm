import React from 'react';
import { motion } from 'motion/react';
import { Monitor, Smartphone, Package as PackageIcon, Plus, X, Clock } from 'lucide-react';
import { EditableText } from './EditableText';
import { GameHistory } from '../types';

export const PlayHistory = ({ isEditing, history, setHistory }: { isEditing: boolean, history: GameHistory, setHistory: (h: GameHistory) => void }) => (
  <section id="play-history" className="py-32 px-6 max-w-7xl mx-auto border-t border-[#3F72AF]/8">
    <div className="inline-block px-4 py-1 rounded-lg bg-[#112D4E]/10 text-[#1e3d5e] text-xs font-bold mb-6">05_PLAY_HISTORY</div>
    <h2 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">게임 플레이 이력.</h2>
    
    <div className="grid md:grid-cols-3 gap-8">
      {/* Online */}
      <div className="bento-card !p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-[#112D4E]">
            <Monitor className="w-6 h-6" />
            <span className="font-bold uppercase tracking-wider">Online Games</span>
          </div>
          {isEditing && (
            <button 
              onClick={() => {
                const newHistory = {...history};
                newHistory.online.push({ id: Date.now().toString(), name: "새 게임", hours: 0 });
                setHistory(newHistory);
              }}
              className="p-1.5 glass rounded-lg text-[#112D4E] hover:bg-[#112D4E]/10"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="space-y-4">
          {history.online.map((game, idx) => (
            <div key={game.id} className="flex justify-between items-center group">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newHistory = {...history};
                      newHistory.online.splice(idx, 1);
                      setHistory(newHistory);
                    }}
                    className="text-[#8fabc8] hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[#3F72AF] font-medium">
                  <EditableText 
                    value={game.name} 
                    onSave={(v) => {
                      const newHistory = {...history};
                      newHistory.online[idx].name = v;
                      setHistory(newHistory);
                    }} 
                    isEditing={isEditing} 
                  />
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#0a1e36] font-mono text-sm">
                <Clock className="w-3.5 h-3.5" /> 
                <EditableText 
                  value={game.hours.toString()} 
                  onSave={(v) => {
                    const newHistory = {...history};
                    newHistory.online[idx].hours = parseInt(v) || 0;
                    setHistory(newHistory);
                  }} 
                  isEditing={isEditing} 
                />h
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="bento-card !p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-[#3F72AF]">
            <Smartphone className="w-6 h-6" />
            <span className="font-bold uppercase tracking-wider">Mobile Games</span>
          </div>
          {isEditing && (
            <button 
              onClick={() => {
                const newHistory = {...history};
                newHistory.mobile.push({ id: Date.now().toString(), name: "새 게임", hours: 0 });
                setHistory(newHistory);
              }}
              className="p-1.5 glass rounded-lg text-[#3F72AF] hover:bg-[#112D4E]/10"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="space-y-4">
          {history.mobile.map((game, idx) => (
            <div key={game.id} className="flex justify-between items-center group">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newHistory = {...history};
                      newHistory.mobile.splice(idx, 1);
                      setHistory(newHistory);
                    }}
                    className="text-[#8fabc8] hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[#3F72AF] font-medium">
                  <EditableText 
                    value={game.name} 
                    onSave={(v) => {
                      const newHistory = {...history};
                      newHistory.mobile[idx].name = v;
                      setHistory(newHistory);
                    }} 
                    isEditing={isEditing} 
                  />
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#0a1e36] font-mono text-sm">
                <Clock className="w-3.5 h-3.5" /> 
                <EditableText 
                  value={game.hours.toString()} 
                  onSave={(v) => {
                    const newHistory = {...history};
                    newHistory.mobile[idx].hours = parseInt(v) || 0;
                    setHistory(newHistory);
                  }} 
                  isEditing={isEditing} 
                />h
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package */}
      <div className="bento-card !p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-[#112D4E]">
            <PackageIcon className="w-6 h-6" />
            <span className="font-bold uppercase tracking-wider">Package Games</span>
          </div>
          {isEditing && (
            <button 
              onClick={() => {
                const newHistory = {...history};
                newHistory.package.push({ id: Date.now().toString(), name: "새 게임", hours: 0 });
                setHistory(newHistory);
              }}
              className="p-1.5 glass rounded-lg text-[#112D4E] hover:bg-[#112D4E]/10"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="space-y-4">
          {history.package.map((game, idx) => (
            <div key={game.id} className="flex justify-between items-center group">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button 
                    onClick={() => {
                      const newHistory = {...history};
                      newHistory.package.splice(idx, 1);
                      setHistory(newHistory);
                    }}
                    className="text-[#8fabc8] hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[#3F72AF] font-medium">
                  <EditableText 
                    value={game.name} 
                    onSave={(v) => {
                      const newHistory = {...history};
                      newHistory.package[idx].name = v;
                      setHistory(newHistory);
                    }} 
                    isEditing={isEditing} 
                  />
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#0a1e36] font-mono text-sm">
                <Clock className="w-3.5 h-3.5" /> 
                <EditableText 
                  value={game.hours.toString()} 
                  onSave={(v) => {
                    const newHistory = {...history};
                    newHistory.package[idx].hours = parseInt(v) || 0;
                    setHistory(newHistory);
                  }} 
                  isEditing={isEditing} 
                />h
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
