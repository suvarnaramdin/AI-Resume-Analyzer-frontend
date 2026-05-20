import { useState } from "react"
import axios from "axios"

import {
  FileText,
  Brain,
  BadgeCheck,
  AlertTriangle
} from "lucide-react"

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar"

import "react-circular-progressbar/dist/styles.css"
import jsPDF from "jspdf"

const Home = () => {

  const [file, setFile] = useState(null)

  const [analysis, setAnalysis] = useState("")
  const [improvedResume, setImprovedResume] =
  useState("")
  const [questions, setQuestions] =
  useState("")
  const [atsScore, setAtsScore] = useState(75)

  const [loading, setLoading] = useState(false)

  const [jobDescription, setJobDescription] =
    useState("")

  const handleUpload = async () => {

    if (!file) {

      alert("Please select a resume")

      return
    }

    const formData = new FormData()

    formData.append("resume", file)

    formData.append(
      "job_description",
      jobDescription
    )

    try {

      setLoading(true)

      const res = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData
      )

      setAnalysis(
  res.data.analysis
)

setImprovedResume(
  res.data.improved_resume
)
setQuestions(
  res.data.questions
)

      // Extract ATS Score
      const match =
       res.data.analysis.match(/(\d{1,3})\s*%/)

      if (match) {

        setAtsScore(
          parseInt(match[1])
        )
      }

    } catch (error) {

      console.log(error)

      alert("Analysis failed")

    } finally {

      setLoading(false)
    }
  }
  const downloadPDF = () => {

  const doc = new jsPDF()

  doc.setFontSize(22)

  doc.text(
    "AI Resume Analysis Report",
    20,
    20
  )

  doc.setFontSize(12)

  const splitText =
    doc.splitTextToSize(
      analysis,
      170
    )

  doc.text(
    splitText,
    20,
    40
  )

  doc.save(
    "ATS_Report.pdf"
  )
}
  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-10">

      {/* Header */}

      <div className="text-center mb-10">

        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
  AI Resume Analyzer
</h1>

        <p className="text-gray-400 text-lg">
          Upload your resume and get
          AI-powered ATS insights
        </p>

      </div>

      {/* Upload Section */}

      <div className="max-w-2xl mx-auto mt-12 bg-gray-900/70 backdrop-blur-lg p-10 rounded-3xl border border-gray-800 shadow-2xl">

        <div className="flex items-center gap-3 mb-6">

          <FileText size={30} />

          <h2 className="text-3xl font-semibold">
            Upload Resume
          </h2>

        </div>

        {/* Job Description */}

        <textarea
          placeholder="Paste Job Description Here..."
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(
              e.target.value
            )
          }
          className="w-full bg-gray-800 p-4 rounded-xl mb-5 h-40 outline-none"
        ></textarea>

        {/* Resume Upload */}

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setFile(
              e.target.files[0]
            )
          }
          className="w-full bg-gray-800 p-4 rounded-xl"
        />

        {/* Analyze Button */}

        <button
          onClick={handleUpload}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-500 transition-all duration-300 p-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-blue-500/30"
        >

          {
            loading
              ? "Analyzing Resume..."
              : "Analyze Resume"
          }

        </button>

      </div>

      {/* Analysis Section */}

      {
        analysis && (

          <div className="max-w-7xl mx-auto mt-12 grid md:grid-cols-3 gap-6">

            {/* ATS Analysis */}

            <div className="bg-gray-900/60 backdrop-blur-lg hover:scale-[1.02] transition-all duration-300 p-6 rounded-2xl border border-gray-800 shadow-lg">

              <div className="flex items-center gap-3 mb-4">

                <BadgeCheck className="text-green-400" />

                <h2 className="text-2xl font-bold">
                  ATS Analysis
                </h2>

              </div>

              <p className="text-gray-300 whitespace-pre-wrap leading-7">
                {analysis}
              </p>
              <button
  onClick={downloadPDF}
  className="mt-6 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-semibold"
>
  Download PDF Report
</button>
            </div>

            {/* ATS Score Meter */}

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-lg flex flex-col items-center justify-center">

              <h2 className="text-2xl font-bold mb-6">
                ATS Match Score
              </h2>

              <div className="w-48 h-48">

                <CircularProgressbar
                  value={atsScore}
                  text={`${atsScore}%`}
                  styles={buildStyles({
                    textColor: "#ffffff",
                    pathColor: "#2563eb",
                    trailColor: "#1f2937"
                  })}
                />

              </div>

              <p className="text-gray-400 mt-6 text-center">

                Higher ATS score increases
                recruiter shortlisting chances.

              </p>

            </div>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-lg">

  <h2 className="text-2xl font-bold mb-4">
    AI Improved Resume Suggestions
  </h2>

  <p className="text-gray-300 whitespace-pre-wrap leading-7">
    {improvedResume}
  </p>

</div>
<div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-lg">

  <h2 className="text-2xl font-bold mb-4">
    AI Interview Questions
  </h2>

  <p className="text-gray-300 whitespace-pre-wrap leading-7">
    {questions}
  </p>

</div>
            {/* Right Side */}

            <div className="space-y-6">

              {/* AI Insights */}

              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-lg">

                <div className="flex items-center gap-3 mb-4">

                  <Brain className="text-purple-400" />

                  <h2 className="text-2xl font-bold">
                    AI Insights
                  </h2>

                </div>

                <p className="text-gray-400 leading-7">

                  AI analyzes:
                  <br /><br />

                  • ATS Compatibility
                  <br />
                  • Resume Formatting
                  <br />
                  • Skill Matching
                  <br />
                  • Missing Keywords
                  <br />
                  • Resume Quality
                  <br />
                  • Hiring Potential
                  <br />
                  • Job Fitment

                </p>

              </div>

              {/* Resume Tips */}

              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-lg">

                <div className="flex items-center gap-3 mb-4">

                  <AlertTriangle className="text-yellow-400" />

                  <h2 className="text-2xl font-bold">
                    Resume Tips
                  </h2>

                </div>

                <ul className="text-gray-400 list-disc ml-5 space-y-2">

                  <li>
                    Add measurable achievements
                  </li>

                  <li>
                    Include industry keywords
                  </li>

                  <li>
                    Mention impactful projects
                  </li>

                  <li>
                    Improve resume formatting
                  </li>

                  <li>
                    Add certifications & internships
                  </li>

                  <li>
                    Keep resume ATS-friendly
                  </li>

                </ul>

              </div>

            </div>

          </div>
        )
      }

    </div>
  )
}

export default Home