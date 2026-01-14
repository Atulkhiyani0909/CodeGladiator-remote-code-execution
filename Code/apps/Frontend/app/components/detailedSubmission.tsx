import React from 'react';
import { 
    Clock, 
    CheckCircle, 
    XCircle, 
    Terminal, 
    Code2, 
    AlertTriangle,
    Calendar
} from 'lucide-react';

function DetailedSubmission({ submissionDetail }: any) {
    console.log(submissionDetail);
    
    if (!submissionDetail) return null;

    const { status, code, output, createdAt, language } = submissionDetail;

    // Helper: Format Date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

   
    const isSuccess = status === "ACCEPTED" || status === "SUCCESS";
    const statusColor = isSuccess ? "text-green-400" : "text-red-400";
    const statusBg = isSuccess ? "bg-green-400/10 border-green-400/20" : "bg-red-400/10 border-red-400/20";
    const StatusIcon = isSuccess ? CheckCircle : XCircle;

    return (
        <div className="w-full h-full bg-[#0a0a0a] text-gray-300 p-6 overflow-y-auto custom-scrollbar">
            
           
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6 mb-6">
                
             
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusBg}`}>
                        <StatusIcon size={20} className={statusColor} />
                        <span className={`text-lg font-bold tracking-wide ${statusColor}`}>
                            {status}
                        </span>
                    </div>
                </div>

             
                <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Submitted: {formatDate(createdAt)}</span>
                    </div>
                
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#161616] rounded border border-gray-800">
                        <Code2 size={16} className="text-orange-500"/>
                        <span className="text-gray-300">Language: {language?.name}</span>
                    </div>
                </div>
            </div>

         
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Terminal size={18} className="text-orange-500" />
                    Execution Result
                </h3>
                
                <div className={`rounded-xl border p-4 font-mono text-sm leading-relaxed overflow-x-auto
                    ${isSuccess 
                        ? "bg-black border-green-900/30 text-green-300" 
                        : "bg-black border-red-900/30 text-red-300"
                    }`}
                >
                  
                    <pre className="whitespace-pre-wrap break-words">
                        {output || "No output generated."}
                    </pre>

                    {!isSuccess && (
                        <div className="mt-4 pt-4 border-t border-red-900/30 flex items-start gap-2 text-red-400 text-xs">
                            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                            <span>Check your syntax or logic. The compiler returned a non-zero exit code.</span>
                        </div>
                    )}
                </div>
            </div>

         
            <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Code2 size={18} className="text-orange-500" />
                    Source Code
                </h3>

                <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden relative group">
                
                    <div className="bg-[#1a1a1a] px-4 py-2 border-b border-gray-800 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        <span className="ml-2 text-xs text-gray-600 font-mono">solution.js</span>
                    </div>

                    <div className="p-4 overflow-x-auto">
                        <pre className="font-mono text-sm text-gray-300 leading-6">
                            <code>{code}</code>
                        </pre>
                    </div>

                    
                    <button 
                        className="absolute top-12 right-4 p-2 bg-gray-800/50 rounded hover:bg-orange-500 hover:text-black transition-all opacity-0 group-hover:opacity-100"
                        onClick={() => navigator.clipboard.writeText(code)}
                        title="Copy Code"
                    >
                        <Code2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DetailedSubmission;