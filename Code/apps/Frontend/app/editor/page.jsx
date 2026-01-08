'use client';

import { useEffect, useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import ProblemSection from '../components/ProblemSection';
import { Play } from 'lucide-react';
import axios from 'axios'
import SubmissionStatus from '../components/SubmissionStatus'

export default function Page() {
    const languages = ["javascript", "python", "java", "cpp"];
    const [theme, setTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(16);
    const [selectedLang, setSelectedLang] = useState("javascript");
    const [currcode, setCode] = useState('');
    const [submission,setSubmission]=useState(true);
    const [allsubmissions,setSubmissions]=useState([]);
    const [submmisionCodeValue,setSubmissionCode]=useState("");

    const handleSubmit = async () => {
        let data = {
            code: currcode,
            languageId: "93b7913b-db85-4235-91d1-af146a0d89d3",
            userId: "cd0c4fd5-0a65-4125-a824-00a3b35097a0",
            problemId: "215766eb-7d19-4d07-977b-1f58c7b4de5d"
        }
        const res = await axios.post('http://localhost:8080/api/v1/code-execution/execute', data);
        console.log(res);
    };

    const submissions = async () => {
        console.log("Sending Request ");
        
        let data = {
            userId: "cd0c4fd5-0a65-4125-a824-00a3b35097a0"
        }

        let res = await axios.post(`http://localhost:8080/api/v1/submission/status/215766eb-7d19-4d07-977b-1f58c7b4de5d`, data);
        setSubmissions(res.data.data);
        console.log("Submission Status ", res);

    }

    useEffect(() => {
        setTimeout(() => {
            submissions();
        }, 2000)
    })

    function handleEditorChange(value) {
        setCode(value);
    }

    function submmisionCode(value){
        console.log("Code ",value);
        
         setSubmissionCode(value);
    }

    return (
        <div className="min-h-screen bg-black text-white flex">

           
            
            {submission ? <SubmissionStatus submissions={allsubmissions} onCode={submmisionCode}/> : <ProblemSection/> }

            <div className="w-1/2 bg-[#0f0f0f] border-l border-orange-500/30 flex flex-col p-6 relative">

                <br /><br />


                <div className="flex items-center justify-between px-4 py-3 border-b border-orange-500/20 bg-black rounded-t-lg">
                    <select
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value)}
                        className="bg-black text-white border border-orange-500/40 rounded px-3 py-1 outline-none focus:border-orange-500 transition-colors"
                    >
                        {languages.map((lang) => (
                            <option key={lang} value={lang}>
                                {lang.toUpperCase()}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-4">
                        <select
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="bg-black text-white border border-orange-500/40 rounded px-3 py-1 outline-none"
                        >
                            {[14, 16, 18, 20, 22].map(size => (
                                <option key={size} value={size}>
                                    {size}px
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
                            className="border border-orange-500/40 px-3 py-1 rounded hover:bg-orange-500 hover:text-black transition"
                        >
                            {theme === "vs-dark" ? "Light" : "Dark"}
                        </button>
                    </div>
                </div>

                <CodeEditor language={selectedLang} theme={theme} fontSize={fontSize} functionEditorValue={handleEditorChange} submissionCode={submmisionCodeValue}/>


                <button
                    onClick={handleSubmit}
                    className="absolute bottom-8 right-8 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 z-10"
                >

                    <Play size={20} />
                    Submit Code
                </button>

            </div>
        </div>
    );
}